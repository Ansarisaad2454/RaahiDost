from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import math
import joblib

# -------------------------------------------
# Load data and ML models
# -------------------------------------------
places_df = pd.read_csv('updated_tourist_places.csv')
packages_df = pd.read_csv('packages_cleaned.csv')

try:
    knn = joblib.load('knn_model.joblib')
    scaler = joblib.load('scaler.joblib')
    le_state = joblib.load('le_state.joblib')
    le_type = joblib.load('le_type.joblib')
except Exception as e:
    print(f"[WARN] Could not load ML models: {e}")
    knn = scaler = le_state = le_type = None

# Dummy fallback ML recommend function
try:
    from recommend_model import predict_top3_destinations
except ImportError:
    def predict_top3_destinations(dest_type, budget, season):
        if dest_type == "hill station":
            return ["Manali", "Shimla", "Ooty"]
        elif dest_type == "beach":
            return ["Goa", "Pondicherry", "Gokarna"]
        else:
            return ["Jaipur", "Agra", "Udaipur"]

# -------------------------------------------
# Utils
# -------------------------------------------
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def normalize_budget(budget):
    if isinstance(budget, str):
        budget_lower = budget.lower()
        if budget_lower == "cheap":
            return 5000
        elif budget_lower == "moderate":
            return 15000
        elif budget_lower == "luxury":
            return 50000
    return float(budget)

# -------------------------------------------
# Flask app
# -------------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# -------------------------------------------
# /FalskAPI/suggestions with KNN
# -------------------------------------------
# @app.route('/FalskAPI/suggestions', methods=['POST'])
# def suggest_places():
#     try:
#         data = request.get_json(force=True)
#         budget = float(data.get('budget', 0))
#         selected_state = data.get('state', '').strip().lower()
#         dest_type = data.get('type', '').strip().lower()
#         user_lat = float(data.get('latitude', 0))
#         user_lon = float(data.get('longitude', 0))

#         print(f"[DEBUG] INPUT -> budget: {budget}, state: '{selected_state}', type: '{dest_type}'")

#         # Prepare fallback defaults
#         most_common_state = le_state.transform([places_df['state'].str.lower().value_counts().idxmax()])[0]
#         most_common_type = le_type.transform([places_df['significance'].str.lower().value_counts().idxmax()])[0]

#         def safe_encode_label(le, value, known_classes, fallback):
#             value = value.lower().strip()
#             if value in known_classes:
#                 encoded = le.transform([value])[0]
#                 print(f"[DEBUG] Encoded '{value}' as {encoded}")
#                 return encoded
#             else:
#                 print(f"[WARN] '{value}' not found in known classes. Using fallback {fallback}")
#                 return fallback

#         state_encoded = safe_encode_label(le_state, selected_state, le_state.classes_, most_common_state)
#         type_encoded = safe_encode_label(le_type, dest_type, le_type.classes_, most_common_type)

#         # Enforce rule: if non-Gujarat state, bump min budget
#         if selected_state and selected_state != "gujarat" and budget < 1500:
#             print(f"[DEBUG] Raising budget to 1500 for non-Gujarat state '{selected_state}'")
#             budget = 1500

#         # Case: only state given, no type -> skip KNN, directly filter
#         if selected_state and not dest_type:
#             print(f"[DEBUG] State only given. Skipping KNN. Filtering directly on state='{selected_state}'")
#             filtered_places = places_df[
#                 (places_df['state'].str.lower().str.strip() == selected_state) &
#                 (places_df['total_cost'] <= budget)
#             ].copy()

#             filtered_places[['fare', 'distance_km']] = filtered_places.apply(
#                 lambda row: pd.Series({
#                     'fare': round(50 + haversine_distance(user_lat, user_lon, row['latitude'], row['longitude']) * 10, 2),
#                     'distance_km': round(haversine_distance(user_lat, user_lon, row['latitude'], row['longitude']), 2)
#                 }),
#                 axis=1
#             )
#             print(f"[DEBUG] Found {len(filtered_places)} places after direct state filter.")
#             return jsonify(filtered_places.to_dict(orient='records'))

#         # Else use KNN on features
#         user_features = scaler.transform([[budget, state_encoded, type_encoded]])
#         distances, indices = knn.kneighbors(user_features)
#         nearest_places = places_df.iloc[indices[0]].copy()
#         print(f"[DEBUG] KNN found {len(nearest_places)} nearest places.")

#         # Post-filter
#         filtered_places = nearest_places.copy()
#         if selected_state:
#             before = len(filtered_places)
#             filtered_places = filtered_places[filtered_places['state'].str.lower().str.strip() == selected_state]
#             after = len(filtered_places)
#             print(f"[DEBUG] Post-filter by state='{selected_state}': {before} -> {after}")
#         if dest_type:
#             before = len(filtered_places)
#             filtered_places = filtered_places[filtered_places['significance'].str.lower().str.strip() == dest_type]
#             after = len(filtered_places)
#             print(f"[DEBUG] Post-filter by type='{dest_type}': {before} -> {after}")

#         if filtered_places.empty:
#             print("[DEBUG] Post-filter empty. Falling back to original KNN nearest.")
#             filtered_places = nearest_places

#         filtered_places[['fare', 'distance_km']] = filtered_places.apply(
#             lambda row: pd.Series({
#                 'fare': round(50 + haversine_distance(user_lat, user_lon, row['latitude'], row['longitude']) * 10, 2),
#                 'distance_km': round(haversine_distance(user_lat, user_lon, row['latitude'], row['longitude']), 2)
#             }),
#             axis=1
#         )

#         print(f"[DEBUG] Returning {len(filtered_places)} final places.")
#         return jsonify(filtered_places.to_dict(orient='records'))

#     except Exception as e:
#         print(f"[ERROR] {e}")
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/FlaskAPI/suggestions', methods=['POST'])
def suggest_places():
    try:
        data = request.get_json(force=True)
        budget = float(data.get('budget', 0))
        selected_state = data.get('state', '').strip().lower()
        dest_type = data.get('type', '').strip().lower()
        user_lat = float(data.get('latitude', 0))
        user_lon = float(data.get('longitude', 0))

        # Enforce min budget if state is not Gujarat
        if selected_state != "gujarat" and budget < 1500:
            budget = 1500

        filtered_df = places_df[places_df['total_cost'] <= budget]
        if selected_state:
            filtered_df = filtered_df[filtered_df['state'].str.lower().str.strip() == selected_state]
        if dest_type:
            filtered_df = filtered_df[filtered_df['significance'].str.lower().str.strip() == dest_type]

        # Add distance & fare
        def compute_fare(row):
            d = haversine_distance(user_lat, user_lon, row['latitude'], row['longitude'])
            return pd.Series({'fare': round(50 + d * 10, 2), 'distance_km': round(d, 2)})

        filtered_df[['fare', 'distance_km']] = filtered_df.apply(compute_fare, axis=1)

        results = filtered_df.sort_values('total_cost').head(50).to_dict(orient='records')
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


# -------------------------------------------
# /FalskAPI/packages
# -------------------------------------------
@app.route('/FlaskAPI/packages', methods=['POST'])
def suggest_packages():
    try:
        data = request.get_json(force=True)
        budget = float(data.get('budget', 0))
        destination = data.get('state', '').strip().lower()  # actually destination
        dest_type = data.get('type', '').strip().lower()
        persons = max(int(data.get('persons', 2)), 1)
        nights = max(int(data.get('nights', 2)), 1)

        multiplier = (persons / 2) * (nights / 2)
        effective_budget = budget / multiplier if multiplier > 0 else budget

        filtered_df = packages_df[packages_df['Price Per Two Persons'] <= effective_budget]

        if destination:
            filtered_df = filtered_df[
                filtered_df['Destination'].str.lower().str.contains(destination)
            ]

        if dest_type:
            filtered_df = filtered_df[
                filtered_df['Package Type'].str.lower().str.contains(dest_type)
            ]

        results = filtered_df.sort_values('Price Per Two Persons').head(50).to_dict(orient='records')
        return jsonify(results)
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500


# -------------------------------------------
# /FlaskAPI/recommend
# -------------------------------------------
@app.route("/FlaskAPI/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    location = data.get("location", "your city")
    people = data.get("people", "2")
    budget = normalize_budget(data.get("budget", "15000"))
    dest_type = data.get("type", "hill station")
    season = "summer"

    top3 = predict_top3_destinations(dest_type, budget, season)

    return jsonify({
        "location": location,
        "people": people,
        "budget": budget,
        "recommendations": [
            f"{top3[0]} (Best match)",
            f"{top3[1]} (Good alternative)",
            f"{top3[2]} (Also consider)"
        ]
    })

# -------------------------------------------
# /FlaskAPI/create_trip using Gemini
# -------------------------------------------
from google.generativeai import configure, GenerativeModel
configure(api_key="AIzaSyBeaNb0-NpJHibWsnmFNKKXuGSq2iAQxHA")
model = GenerativeModel('gemini-2.5-flash')

@app.route("/FlaskAPI/create_trip", methods=["POST"])
def create_trip():
    data = request.get_json()
    location = data.get("location", "Manali")
    days = data.get("days", 5)
    budget = data.get("budget", "moderate")
    travel_type = data.get("type", "hill station")
    season = data.get("season", "summer")

    prompt = f"""
    Plan a {days}-day trip to {location}, India.
    Travel type: {travel_type}, Budget: {budget}.
    Include: daily plan, activities, approx cost, local food recommendations.
    """

    response = model.generate_content(prompt)
    plan = response.text

    return jsonify({"location": location, "trip_plan": plan})

# -------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

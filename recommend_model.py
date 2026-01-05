import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Load data
df = pd.read_csv('data.csv')

# Encode
type_encoder = LabelEncoder()
season_encoder = LabelEncoder()

df['type_encoded'] = type_encoder.fit_transform(df['type'])
df['season_encoded'] = season_encoder.fit_transform(df['best_season'])

X = df[['type_encoded', 'avg_cost', 'season_encoded']].values
y = df['name']

# Train
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

def predict_top3_destinations(user_type, user_budget, season_hint):
    try:
        user_type_encoded = type_encoder.transform([user_type])[0]
    except:
        user_type_encoded = 0
    try:
        season_encoded = season_encoder.transform([season_hint])[0]
    except:
        season_encoded = 0

    user_features = np.array([[user_type_encoded, float(user_budget), season_encoded]])
    proba = model.predict_proba(user_features)[0]

    # Get top 3 indices
    top3_indices = np.argsort(proba)[::-1][:3]
    top3_places = [model.classes_[idx] for idx in top3_indices]

    return top3_places

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import NearestNeighbors
import joblib

# Load dataset
df = pd.read_csv('updated_tourist_places.csv')

# Encode state and type
le_state = LabelEncoder()
df['state_encoded'] = le_state.fit_transform(df['state'].str.lower().str.strip())

le_type = LabelEncoder()
df['type_encoded'] = le_type.fit_transform(df['significance'].str.lower().str.strip())

# Weighted features: budget, state, type
# Example: scale down budget, boost state & type
df['budget_norm'] = df['total_cost'] / 10000  # reduce scale
df['state_weighted'] = df['state_encoded'] * 2
df['type_weighted'] = df['type_encoded'] * 3

features = df[['budget_norm', 'state_weighted', 'type_weighted']]

# Scale features
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

# Train KNN
knn = NearestNeighbors(n_neighbors=10, algorithm='auto').fit(scaled_features)

# Save models
joblib.dump(knn, 'knn_model.joblib')
joblib.dump(scaler, 'scaler.joblib')
joblib.dump(le_state, 'le_state.joblib')
joblib.dump(le_type, 'le_type.joblib')

print("✅ KNN model and encoders saved.")

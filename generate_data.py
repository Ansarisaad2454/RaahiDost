import pandas as pd
import random
import faker
import csv

fake = faker.Faker()

zones = ['Northern', 'Western', 'Eastern', 'Southern', 'Central']
states = ['Punjab', 'Gujarat', 'Maharastra', 'Kerala', 'Tamil Nadu', 'Karnataka', 'Ladakh', 'Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh']
cities = ['Amritsar', 'Mumbai', 'Jaipur', 'Chennai', 'Bengaluru', 'Leh', 'Ujjain', 'Lucknow', 'Kolkata', 'Cochin']
types = ['Cultural', 'Religious', 'Historical', 'Nature', 'Shopping', 'Entertainment']
significance_types = types

data = []

for i in range(1000):
    zone = random.choice(zones)
    state = random.choice(states)
    city = random.choice(cities)
    place_name = f"{fake.word().capitalize()} {random.choice(['Temple', 'Fort', 'Lake', 'Park', 'Museum', 'Beach', 'Palace'])}"
    type_ = random.choice(types)
    entrance_fee = random.choice([0, 50, 100, 200, 500, 1000, 1500])
    significance = random.choice(significance_types)
    total_cost = entrance_fee + random.randint(1000, 15000)
    latitude = round(random.uniform(8, 35), 6)
    longitude = round(random.uniform(68, 88), 6)
    image_url = f"https://placehold.co/600x400?text={place_name.replace(' ', '+')}"

    data.append({
        'zone': zone,
        'state': state,
        'city': city,
        'name': place_name,
        'type': type_,
        'entrance_fee_in_inr': entrance_fee,
        'significance': significance,
        'image_url': image_url,
        'total_cost': total_cost,
        'latitude': latitude,
        'longitude': longitude
    })

# Save to CSV
df = pd.DataFrame(data)
df.to_csv('generated_tourist_places.csv', index=False, quoting=csv.QUOTE_NONNUMERIC)
print("✅ Generated 'generated_tourist_places.csv' with 1000 rows.")

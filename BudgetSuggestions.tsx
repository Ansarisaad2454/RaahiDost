import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BudgetSuggestions() {
  const [budget, setBudget] = useState('');
  const [results, setResults] = useState([]);
  const [stateFilter, setStateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSearch = async () => {
    const numericBudget = parseInt(budget.trim(), 10);
    if (!numericBudget || isNaN(numericBudget)) {
      showAlert('Invalid input', 'Please enter a valid numeric budget.');
      return;
    }

    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission denied', 'Location permission was denied.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userLat = location.coords.latitude;
      const userLon = location.coords.longitude;

      const response = await fetch('http://192.168.236.203:5000/FlaskAPI/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: numericBudget,
          state: stateFilter,
          type: typeFilter,
          latitude: userLat,
          longitude: userLon,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setResults(data);
    } catch (error) {
      console.error('Fetch error:', error);
      showAlert('Error', error.message || 'Failed to fetch suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setBudget('');
    setStateFilter('');
    setTypeFilter('');
    setResults([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={results}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Raahi Dost</Text>

              <TextInput
                placeholder="Enter your budget (e.g., 5000)"
                keyboardType="numeric"
                value={budget}
                onChangeText={setBudget}
                style={styles.input}
                placeholderTextColor="#888"
              />

              <Text style={styles.label}>Select State:</Text>
              <Picker
                selectedValue={stateFilter}
                onValueChange={setStateFilter}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="All States" value="" />
                <Picker.Item label="Andaman and Nicobar Islands" value="Andaman and Nicobar Islands" />
                <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
                <Picker.Item label="Arunachal Pradesh" value="Arunachal Pradesh" />
                <Picker.Item label="Assam" value="Assam" />
                <Picker.Item label="Bihar" value="Bihar" />
                <Picker.Item label="Chandigarh" value="Chandigarh" />
                <Picker.Item label="Chhattisgarh" value="Chhattisgarh" />
                <Picker.Item label="Dadra and Nagar Haveli and Daman and Diu" value="Dadra and Nagar Haveli and Daman and Diu" />
                <Picker.Item label="Delhi" value="Delhi" />
                <Picker.Item label="Goa" value="Goa" />
                <Picker.Item label="Gujarat" value="Gujarat" />
                <Picker.Item label="Haryana" value="Haryana" />
                <Picker.Item label="Himachal Pradesh" value="Himachal Pradesh" />
                <Picker.Item label="Jammu and Kashmir" value="Jammu and Kashmir" />
                <Picker.Item label="Jharkhand" value="Jharkhand" />
                <Picker.Item label="Karnataka" value="Karnataka" />
                <Picker.Item label="Kerala" value="Kerala" />
                <Picker.Item label="Ladakh" value="Ladakh" />
                <Picker.Item label="Lakshadweep" value="Lakshadweep" />
                <Picker.Item label="Madhya Pradesh" value="Madhya Pradesh" />
                <Picker.Item label="Maharashtra" value="Maharashtra" />
                <Picker.Item label="Manipur" value="Manipur" />
                <Picker.Item label="Meghalaya" value="Meghalaya" />
                <Picker.Item label="Mizoram" value="Mizoram" />
                <Picker.Item label="Nagaland" value="Nagaland" />
                <Picker.Item label="Odisha" value="Odisha" />
                <Picker.Item label="Puducherry" value="Puducherry" />
                <Picker.Item label="Punjab" value="Punjab" />
                <Picker.Item label="Rajasthan" value="Rajasthan" />
                <Picker.Item label="Sikkim" value="Sikkim" />
                <Picker.Item label="Tamil Nadu" value="Tamil Nadu" />
                <Picker.Item label="Telangana" value="Telangana" />
                <Picker.Item label="Tripura" value="Tripura" />
                <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
                <Picker.Item label="Uttarakhand" value="Uttarakhand" />
                <Picker.Item label="West Bengal" value="West Bengal" />
              </Picker>

              <Text style={styles.label}>Select Type:</Text>
              <Picker
                selectedValue={typeFilter}
                onValueChange={setTypeFilter}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="All Types" value="" />
                <Picker.Item label="Cultural" value="cultural" />
                <Picker.Item label="Nature" value="nature" />
                <Picker.Item label="Religious" value="religious" />
                <Picker.Item label="Historical" value="historical" />
                <Picker.Item label="Entertainment" value="entertainment" />
                <Picker.Item label="Scenic" value="scenic" />
                <Picker.Item label="Recreational" value="recreational" />
                <Picker.Item label="Shopping" value="shopping" />
              </Picker>

              <View style={styles.buttonContainer}>
                <Button title="Get Recommendations" onPress={handleSearch} color="#1e90ff" />
                <View style={{ marginTop: 10 }}>
                  <Button title="Clear Filters" onPress={clearFilters} color="#ff4757" />
                </View>
              </View>

              <Text style={styles.subTitle}>Suggested Destinations:</Text>
              {loading && <ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 20 }} />}
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/map-screen',
                  params: {
                    latitude: item.latitude,
                    longitude: item.longitude,
                    name: item.name,
                  },
                })
              }
            >
              <View style={styles.card}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardState}>{item.state}</Text>
                <Text style={styles.cardSubtitle}>Estimated Cost: ₹{item.total_cost}</Text>
                <Text style={styles.cardSubtitle}>Distance: {Math.round(item.distance_km)} km</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f8',
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 25,
    paddingBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    color: '#1e293b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1e293b',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#555',
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 10,
  },
  cardState: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
    color: '#1e293b',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  pickerItem: {
    height: 150,
  },
});

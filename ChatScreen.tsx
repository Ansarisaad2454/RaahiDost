import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

// Cross-platform alert
function showAlert(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function ChatScreen() {
  const [query, setQuery] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const extractKeywords = (query) => {
    const budgetMatch = query.match(/\d+/);
    const budget = budgetMatch ? parseInt(budgetMatch[0], 10) : null;

    const personsMatch = query.match(/(\d+)\s*(persons|people|person)?/i);
    const persons = personsMatch ? parseInt(personsMatch[1], 10) : 2;

    const nightsMatch = query.match(/(\d+)\s*(night|nights|stay|stays)/i);
    const nights = nightsMatch ? parseInt(nightsMatch[1], 10) : 2;

    const locations = [
      'Goa', 'Agra', 'Jaipur', 'Manali', 'Shimla', 'Leh', 'Ladakh', 'Kashmir', 'Srinagar',
      'Darjeeling', 'Gangtok', 'Ooty', 'Mysore', 'Coorg', 'Hampi', 'Rishikesh', 'Haridwar',
      'Varanasi', 'Udaipur', 'Jaisalmer', 'Mount Abu', 'Ranthambore', 'Khajuraho',
      'Puri', 'Konark', 'Kanyakumari', 'Rameswaram', 'Mahabalipuram', 'Pondicherry',
      'Auroville', 'Chennai', 'Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Lonavala',
      'Matheran', 'Mahabaleshwar', 'Alleppey', 'Munnar', 'Thekkady', 'Kochi',
      'Andaman', 'Lakshadweep', 'Tawang', 'Shillong', 'Cherrapunji', 'Kaziranga', 'Sundarbans'
    ];

    let location = null;
    for (let loc of locations) {
      if (query.toLowerCase().includes(loc.toLowerCase())) {
        location = loc;
        break;
      }
    }

    return { location, budget, persons, nights };
  };

  const handleQuerySubmit = async () => {
    const { location, budget, persons, nights } = extractKeywords(query);

    if (!location || !budget) {
      showAlert('Oops!', 'Could not extract location or budget from your query.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.236.203:5000/FlaskAPI/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          budget, 
          state: location, 
          type: '', 
          persons, 
          nights 
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError, text);
        showAlert('Error', 'Invalid response from server.');
        return;
      }

      if (data.error) {
        showAlert('Server Error', data.error);
      } else {
        setPackages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Network Error:', error);
      showAlert('Network error', 'Server is not reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌍 Raahi Assistant</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="e.g. I want to go to Goa in 5000"
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      <Button 
        title="Get Travel Packages" 
        onPress={handleQuerySubmit} 
        color="#007AFF" 
      />

      {loading && (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
      )}

      {!loading && packages.length === 0 && (
        <Text style={{ marginTop: 20, textAlign: 'center', color: '#888' }}>
          No packages found for your query.
        </Text>
      )}

      <FlatList
        data={packages}
        style={{ marginTop: 20 }}
        keyExtractor={(item, index) => item['Uniq Id']?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item['Package Name'] || 'Package'}</Text>
            <Text style={styles.text}>📍 Destination: {item['Destination'] || '-'}</Text>
            <Text style={styles.text}>💸 Price (for 2): ₹{item['Price Per Two Persons'] || '-'}</Text>
            <Text style={styles.text}>🗺️ Places Covered: {item['Places Covered'] || '-'}</Text>
            <Text style={styles.text}>🏞️ Sightseeing: {item['Sightseeing Places Covered'] || '-'}</Text>
            <Text style={styles.text}>🧳 Type: {item['Package Type'] || '-'}</Text>
            {item['Page Url'] && (
              <Text
                style={styles.link}
                onPress={() => Linking.openURL(item['Page Url'])}
              >
                🔗 More Info
              </Text>
            )}
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2e3a59',
  },
  text: {
    fontSize: 14,
    marginBottom: 3,
    color: '#333',
  },
  link: {
    marginTop: 5,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

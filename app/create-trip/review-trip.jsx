import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CreatTripContext } from '../../context/CreatTripContext';

export default function TripSummary() {
  const { tripData } = useContext(CreatTripContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConfirmTrip = async () => {
    setLoading(true);
    try {
      console.log("Sending data:", tripData);
      const response = await fetch("http://192.168.236.203:5000/FlaskAPI/create_trip", {  // 👈 apne local IP
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: tripData.location?.name,
          people: tripData.people,
          budget: tripData.budget
        })
      });
      const data = await response.json();
      console.log("AI Recommendation:", data);

      router.push({
        pathname: '/create-trip/AiResult',
        params: {
          suggestion: data.suggestion,
          location: data.location,
          people: data.people,
          budget: data.budget,
          trip_plan: data.trip_plan.slice(0,1000)+"..."
        }
      });
    } catch (err) {
      console.error(err);
      alert("AI model error");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop:15, fontSize:16, color:'#333' }}>Planning your perfect trip with AI...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Trip Summary</Text>

      <View style={styles.card}><Text style={styles.title}>📍 Location</Text><Text>{tripData.location?.name}</Text></View>
      <View style={styles.card}><Text style={styles.title}>👨‍👩‍👧‍👦 Travelers</Text><Text>{tripData.people}</Text></View>
      <View style={styles.card}><Text style={styles.title}>📅 Dates</Text><Text>{tripData.travelDates?.join(' → ')}</Text></View>
      <View style={styles.card}><Text style={styles.title}>💰 Budget</Text><Text>{tripData.budget}</Text></View>

      <TouchableOpacity style={styles.button} onPress={handleConfirmTrip}>
        <Text style={{ color:'#fff', fontSize:18 }}>Confirm Trip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fafafa', padding:25 },
  loadingContainer: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa' },
  header: { fontSize:28, fontWeight:'bold', color:'#111', marginBottom:20 },
  card: { backgroundColor:'#fff', borderRadius:16, padding:20, marginBottom:15, elevation:3 },
  title: { fontSize:18, fontWeight:'600', marginBottom:8 },
  button: { backgroundColor:'#3B82F6', paddingVertical:16, borderRadius:12, alignItems:'center', marginTop:30 }
});

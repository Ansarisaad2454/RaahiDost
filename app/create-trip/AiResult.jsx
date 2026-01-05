import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AIResult() {
  const router = useRouter();
  const { trip_plan, location, people, budget } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🎯 AI Created Trip</Text>
      
      <View style={styles.card}>
        <Text style={styles.title}>📍 Location</Text>
        <Text style={styles.desc}>{location || 'Unknown'}</Text>


        <Text style={[styles.title, {marginTop:10}]}>📝 Trip Plan</Text>
        <Text style={styles.suggestion}>{trip_plan}</Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={{color:'#fff', fontSize:18}}>Go Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fafafa', padding:25, paddingTop:55 },
  header: { fontSize:28, fontWeight:'bold', color:'#111', marginBottom:20 },
  card: { backgroundColor:'#fff', borderRadius:16, padding:20, elevation:3 },
  title: { fontSize:18, fontWeight:'600', marginTop:10 },
  desc: { fontSize:16, color:'#444' },
  suggestion: { fontSize:16, color:'#2563EB', marginTop:6 },
  button: { backgroundColor:'#3B82F6', paddingVertical:16, borderRadius:12, alignItems:'center', marginTop:30, elevation:3 }
});

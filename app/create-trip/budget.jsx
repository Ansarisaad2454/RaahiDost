import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CreatTripContext } from '../../context/CreatTripContext';

export default function SelectBudget() {
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreatTripContext);
  const [selected, setSelected] = useState(null);

  const budgets = [
    { title: 'Cheap', desc: 'Stay conscious of costs', icon: 'cash' },
    { title: 'Moderate', desc: 'Keep cost on the average side', icon: 'pricetag' },
    { title: 'Luxury', desc: 'Don’t worry about cost', icon: 'card' },
  ];

  const handleContinue = () => {
    setTripData({ ...tripData, budget: selected });
    console.log('Context updated:', { ...tripData, budget: selected });
    router.push('/create-trip/review-trip');  // or your next page
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={{ marginLeft:8, fontSize:16 }}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Budget</Text>
      <Text style={styles.subHeader}>Choose spending habits for your trip</Text>

      <View style={{ marginTop:25 }}>
        {budgets.map((item, index) => {
          const isSelected = selected === item.title;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelected(item.title)}
              style={[
                styles.card,
                isSelected && styles.cardSelected
              ]}
              activeOpacity={0.8}
            >
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
              <Ionicons
                name={item.icon}
                size={34}
                color={isSelected ? "#2563EB" : "#3B82F6"}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        disabled={!selected}
        style={[
          styles.button,
          { backgroundColor: selected ? '#3B82F6' : '#9CA3AF' }
        ]}
      >
        <Text style={{ color:'#fff', fontSize:18 }}>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fafafa',
    padding:25,
    paddingTop:55,
  },
  backRow: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom:20
  },
  header: {
    fontSize:32,
    fontWeight:'bold',
    color:'#111'
  },
  subHeader: {
    fontSize:18,
    color:'#555',
    marginTop:6
  },
  card: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:20,
    backgroundColor:'#fff',
    borderRadius:16,
    marginBottom:15,
    shadowColor:'#000',
    shadowOffset:{width:0, height:2},
    shadowOpacity:0.06,
    shadowRadius:4,
    elevation:3,
    borderWidth:1,
    borderColor:'transparent'
  },
  cardSelected: {
    borderColor:'#3B82F6',
    shadowOpacity:0.15,
    elevation:6,
    transform:[{ scale:1.02 }],
  },
  cardTitle: {
    fontSize:20,
    fontWeight:'600',
    color:'#222'
  },
  cardDesc: {
    fontSize:15,
    color:'#666',
    marginTop:4
  },
  button: {
    marginTop:'auto',
    paddingVertical:16,
    borderRadius:12,
    alignItems:'center',
    width:'100%',
    elevation:3
  }
});

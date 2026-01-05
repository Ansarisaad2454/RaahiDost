import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CreatTripContext } from '../../context/CreatTripContext';

export default function SelectTraveler() {
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreatTripContext);
  const [selected, setSelected] = useState(null);

  const options = [
    { title: 'Just Me', desc: 'A sole traveler exploring', icon: 'airplane' },
    { title: 'A Couple', desc: 'Two travelers in tandem', icon: 'wine' },
    { title: 'Family', desc: 'Fun-loving adventurers', icon: 'home' },
    { title: 'Friends', desc: 'A bunch of thrill-seekers', icon: 'boat' },
  ];

  const handleContinue = () => {
    let peopleCount = '';

    if (selected === 'Just Me') peopleCount = '1';
    else if (selected === 'A Couple') peopleCount = '2';
    else if (selected === 'Family') peopleCount = '3 to 5 People';
    else if (selected === 'Friends') peopleCount = '5 to 10 People';

    const newData = { 
      ...tripData, 
      travelerType: selected, 
      people: peopleCount 
    };

    setTripData(newData);
    console.log('Context updated:', newData);

    router.push('/create-trip/select-date');  // 👈 navigate to next page
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={{ marginLeft:8, fontSize:16 }}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Who's Traveling</Text>
      <Text style={styles.subHeader}>Choose your travelers</Text>

      <View style={{ marginTop:25 }}>
        {options.map((opt, index) => {
          const isSelected = selected === opt.title;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelected(opt.title)}
              style={[
                styles.card,
                isSelected && styles.cardSelected
              ]}
              activeOpacity={0.8}
            >
              <View>
                <Text style={styles.cardTitle}>{opt.title}</Text>
                <Text style={styles.cardDesc}>{opt.desc}</Text>
              </View>
              <Ionicons
                name={opt.icon}
                size={36}
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
    elevation:3
  }
});

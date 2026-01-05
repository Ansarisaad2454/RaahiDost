import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { CreatTripContext } from '../../context/CreatTripContext';

export default function SelectDates() {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const { tripData, setTripData } = useContext(CreatTripContext);
  const router = useRouter();

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
      setTripData({
        ...tripData,
        travelDates: [
          selectedStartDate?.toISOString().split('T')[0],
          date.toISOString().split('T')[0]
        ]
      });
      console.log('Context updated:', {
        ...tripData,
        travelDates: [
          selectedStartDate?.toISOString().split('T')[0],
          date.toISOString().split('T')[0]
        ]
      });
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>When are you traveling?</Text>
      <Text style={styles.subHeader}>Select start & end dates</Text>

      <CalendarPicker
        startFromMonday={true}
        allowRangeSelection={true}
        minDate={new Date()}
        selectedDayColor="#3B82F6"
        selectedDayTextColor="#fff"
        todayBackgroundColor="#E5E7EB"
        width={300}
        onDateChange={onDateChange}
      />

      {(selectedStartDate && selectedEndDate) && (
        <Text style={styles.selectedDate}>
          Trip: {selectedStartDate.toDateString()} → {selectedEndDate.toDateString()}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: (selectedStartDate && selectedEndDate) ? '#3B82F6' : '#9CA3AF' }
        ]}
        disabled={!(selectedStartDate && selectedEndDate)}
        onPress={() => router.push('/create-trip/budget')}
      >
        <Text style={{color:'#fff', fontSize:18}}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fafafa',
    padding:20,
    paddingTop:55,
    alignItems:'center'
  },
  header: {
    fontSize:26,
    fontWeight:'bold',
    color:'#111',
    marginBottom:4
  },
  subHeader: {
    fontSize:16,
    color:'#555',
    marginBottom:20
  },
  selectedDate: {
    marginTop:20,
    fontSize:15,
    color:'#333',
    textAlign:'center'
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

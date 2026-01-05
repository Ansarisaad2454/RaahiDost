import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const [userTrips, setUserTrips] = useState([]);

  return (
    <View style={{flex:1,padding:25,paddingTop:55,backgroundColor:'#fff'}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{fontSize:35,fontWeight:'bold'}}>My Trip</Text>
        <Ionicons
          name={'add-circle'} 
          size={50}
          color={'black'}
        />
      </View>

      {userTrips?.length === 0 && (  // ✅ wrap inside {}
        <View style={{display:'flex',padding:20,marginTop:50,alignItems:'center',gap:25}}>
          <Ionicons
            name={'location-sharp'} 
            size={30}
            color={'#3B82F6'}
          />
          <Text style={{fontSize:25}}>No trips found yet!</Text>
          <Text style={{fontSize:20,textAlign:'center',color:'gray'}}>
            Looks like it's time to plan a new travel experience! Get started below
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('../create-trip/search-place')}
            style={{
              marginTop: 20,
              backgroundColor: '#3B82F6',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              elevation: 3,
              paddingHorizontal: 30,
              width: '20%'
            }}
          >
            <Text style={{fontSize:18,color:'white'}}>Plan a New Trip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

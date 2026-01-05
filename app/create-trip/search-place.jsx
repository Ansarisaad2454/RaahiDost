import { Ionicons } from '@expo/vector-icons'; // expo install @expo/vector-icons
import { useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CreatTripContext } from '../../context/CreatTripContext';

export default function PhotonCitySearchIndia() {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const debounceTimer = useRef(null);
  const { tripData, setTripData } = useContext(CreatTripContext);
  const router = useRouter();

  const searchCities = async (input) => {
    if (!input) {
      setPlaces([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&bbox=68,6,97,36`
      );
      const json = await response.json();

      const filtered = json.features.filter(item =>
        item.properties.osm_value === 'city' ||
        item.properties.osm_value === 'town' ||
        item.properties.osm_value === 'village'
      );

      setPlaces(filtered);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (query.trim() === '') {
      setPlaces([]);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      searchCities(query);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  const handleSelectPlace = (item) => {
    const placeInfo = {
      name: item.properties.name,
      country: item.properties.country,
      lat: item.geometry.coordinates[1],
      lon: item.geometry.coordinates[0],
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}`,
      staticMap: `https://maps.googleapis.com/maps/api/staticmap?center=${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}&zoom=12&size=600x300&markers=color:red%7C${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}&key=YOUR_GOOGLE_MAPS_STATIC_KEY`
    };

    setSelectedPlace(placeInfo);
    setTripData({ ...tripData, location: placeInfo });

    router.push('/create-trip/select-traveler');
  };

  return (
    <View style={{ padding:20, marginTop:40 }}>
      
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          flexDirection:'row',
          alignItems:'center',
          marginBottom:15
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <TextInput
        placeholder="Search for an Indian city"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth:1,
          borderColor:'#ccc',
          padding:12,
          borderRadius:12,
          backgroundColor:'#fff',
          elevation:2
        }}
      />

      {loading && <ActivityIndicator style={{ marginTop:10 }} />}

      <FlatList
        data={places}
        keyExtractor={(item, index) => item.properties.osm_id + '_' + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectPlace(item)}
            style={{
              padding:15,
              marginVertical:6,
              backgroundColor:'#fff',
              borderRadius:12,
              borderWidth:1,
              borderColor:'#ddd',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize:16, fontWeight:'500' }}>{item.properties.name}</Text>
            <Text style={{ color:'gray' }}>{item.properties.country}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading && query ? (
          <Text style={{ padding:10, color:'gray' }}>No Indian cities found.</Text>
        ) : null}
      />

      {selectedPlace && (
        <View style={{
          marginTop:20,
          padding:15,
          backgroundColor:'#fff',
          borderRadius:15,
          borderWidth:1,
          borderColor:'#ddd',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 3.84,
          elevation: 4
        }}>
          <Text style={{ fontSize:20, fontWeight:'bold', marginBottom:5 }}>{selectedPlace.name}</Text>
          <Text style={{ fontSize:16, marginBottom:4 }}>{selectedPlace.country}</Text>
          <Text style={{ color:'gray', marginBottom:6 }}>Lat: {selectedPlace.lat}, Lon: {selectedPlace.lon}</Text>
          <Text selectable style={{ color:'#1E90FF' }}>{selectedPlace.mapUrl}</Text>
          <Image
            source={{ uri: selectedPlace.staticMap }}
            style={{
              width:'100%',
              height:200,
              marginTop:10,
              borderRadius:12
            }}
          />
        </View>
      )}
    </View>
  );
}

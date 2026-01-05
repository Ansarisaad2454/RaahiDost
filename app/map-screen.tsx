import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapScreen() {
  const { latitude, longitude, name } = useLocalSearchParams();
  const parsedLat = parseFloat(latitude as string);
  const parsedLng = parseFloat(longitude as string);

  const [leaflet, setLeaflet] = useState<any>(null);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const L = (await import('leaflet')).default;

      // Patch marker icons without loading CSS
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const leafletLib = await import('react-leaflet');
      setLeaflet(L);
      setMapContainer(() => leafletLib.MapContainer);
      setTileLayer(() => leafletLib.TileLayer);
      setMarker(() => leafletLib.Marker);
      setPopup(() => leafletLib.Popup);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setUserLocation(coords);

            if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
              const dist = getDistanceFromLatLonInKm(
                pos.coords.latitude,
                pos.coords.longitude,
                parsedLat,
                parsedLng
              );
              setDistance(dist);
            }
          },
          (err) => console.error(err)
        );
      }
    })();
  }, []);

  if (!MapContainer || !TileLayer || !Marker || !Popup) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  const centerPosition = !isNaN(parsedLat) && !isNaN(parsedLng)
    ? [parsedLat, parsedLng]
    : userLocation ?? [22.9734, 78.6569];
  const zoomLevel = !isNaN(parsedLat) && !isNaN(parsedLng) ? 13 : 5;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <div style={{ height: '100vh', width: '100%' }}>
        <MapContainer center={centerPosition} zoom={zoomLevel} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {!isNaN(parsedLat) && !isNaN(parsedLng) && (
            <Marker position={[parsedLat, parsedLng]}>
              <Popup>{name ?? 'Destination'}</Popup>
            </Marker>
          )}

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {distance !== null && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '12px 18px',
          borderRadius: '12px',
          fontSize: 16,
          fontWeight: 500,
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        }}>
          Distance to {name ? `"${name}"` : 'destination'}: {distance.toFixed(2)} km
        </div>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 20,
    left: 20,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 50,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
});

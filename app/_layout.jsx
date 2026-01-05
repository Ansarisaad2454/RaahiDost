// app/_layout.tsx
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { CreatTripContext } from '../context/CreatTripContext'; // spelling sahi karo

export default function RootLayout() {
  const [tripData, setTripData] = useState({});  // [] ki jagah {}

  return (
    <CreatTripContext.Provider value={{ tripData, setTripData }}>
      <Stack screenOptions={{ headerShown: false }} />
    </CreatTripContext.Provider>
  );
}

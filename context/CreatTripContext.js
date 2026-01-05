import { createContext, useState } from 'react';

export const CreatTripContext = createContext();

export function CreatTripProvider({ children }) {
  const [tripData, setTripData] = useState({});
  return (
    <CreatTripContext.Provider value={{ tripData, setTripData }}>
      {children}
    </CreatTripContext.Provider>
  );
}

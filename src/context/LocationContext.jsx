import { createContext, useState, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState("All Locations");
  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </LocationContext.Provider>
  );
};

// Renamed from useLocation to useLocationContext to avoid React Router DOM hook conflict
export const useLocationContext = () => useContext(LocationContext);

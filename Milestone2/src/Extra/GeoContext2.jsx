// GeoContext.js

import React, { createContext, useContext, useState } from "react";
import { regions } from "../constant/Data"; // Assuming you have this data imported

const GeoContext = createContext();

export const GeoProvider = ({ children }) => {
  const [selectedRegions, setSelectedRegions] = useState({});
  const [selectedCountries, setSelectedCountries] = useState({});
  const [selectedMarketTeams, setSelectedMarketTeams] = useState({});
  const [selectedMarkets, setSelectedMarkets] = useState({});
  const [selectedStores, setSelectedStores] = useState({});
  const [finalSelected, setFinalSelected] = useState([]);

  const toggleSelection = (key, stateSetter) => {
    stateSetter((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <GeoContext.Provider
      value={{
        selectedRegions,
        setSelectedRegions,
        selectedCountries,
        setSelectedCountries,
        selectedMarketTeams,
        setSelectedMarketTeams,
        selectedMarkets,
        setSelectedMarkets,
        selectedStores,
        setSelectedStores,
        finalSelected,
        setFinalSelected,
        toggleSelection,
        regionsData: regions,
      }}
    >
      {children}
    </GeoContext.Provider>
  );
};

export const useGeoContext = () => useContext(GeoContext);

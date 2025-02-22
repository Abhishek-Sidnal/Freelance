import React, { createContext, useState, useEffect } from "react";
import { regions } from "../constant/Data";

export const GeoContext = createContext();

export const GeoProvider = ({ children }) => {
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedMarketTeams, setSelectedMarketTeams] = useState([]);
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);

  const [selectedColumns, setSelectedColumns] = useState([]);
  const resetAll = () => {
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectedMarketTeams([]);
    setSelectedMarkets([]);
    setSelectedStores([]);
    setSelectedColumns([]);
  }



  const resetSelections = (level, id = null) => {
    if (level === "region" && id) {
      setSelectedCountries((prev) =>
        prev.filter((countryId) =>
          regions
            .filter((region) => region.id !== id)
            .flatMap((region) => region.countries.map((country) => country.id))
            .includes(countryId)
        )
      );
      setSelectedMarketTeams((prev) =>
        prev.filter((teamId) =>
          regions
            .filter((region) => region.id !== id)
            .flatMap((region) =>
              region.countries.flatMap((country) => country.marketTeams.map((team) => team.id))
            )
            .includes(teamId)
        )
      );
      setSelectedMarkets((prev) =>
        prev.filter((marketId) =>
          regions
            .filter((region) => region.id !== id)
            .flatMap((region) =>
              region.countries.flatMap((country) =>
                country.marketTeams.flatMap((team) => team.markets.map((market) => market.id))
              )
            )
            .includes(marketId)
        )
      );
      setSelectedStores((prev) =>
        prev.filter((store) =>
          regions
            .filter((region) => region.id !== id)
            .flatMap((region) =>
              region.countries.flatMap((country) =>
                country.marketTeams.flatMap((team) =>
                  team.markets.flatMap((market) => market.stores)
                )
              )
            )
            .includes(store)
        )
      );
    }

    if (level === "country" && id) {
      setSelectedMarketTeams((prev) =>
        prev.filter((teamId) =>
          regions
            .flatMap((region) => region.countries)
            .filter((country) => country.id !== id)
            .flatMap((country) => country.marketTeams.map((team) => team.id))
            .includes(teamId)
        )
      );
      setSelectedMarkets((prev) =>
        prev.filter((marketId) =>
          regions
            .flatMap((region) => region.countries)
            .filter((country) => country.id !== id)
            .flatMap((country) =>
              country.marketTeams.flatMap((team) => team.markets.map((market) => market.id))
            )
            .includes(marketId)
        )
      );
      setSelectedStores((prev) =>
        prev.filter((store) =>
          regions
            .flatMap((region) => region.countries)
            .filter((country) => country.id !== id)
            .flatMap((country) =>
              country.marketTeams.flatMap((team) =>
                team.markets.flatMap((market) => market.stores)
              )
            )
            .includes(store)
        )
      );
    }

    if (level === "marketTeam" && id) {
      setSelectedMarkets((prev) =>
        prev.filter((marketId) =>
          regions
            .flatMap((region) => region.countries)
            .flatMap((country) => country.marketTeams)
            .filter((team) => team.id !== id)
            .flatMap((team) => team.markets.map((market) => market.id))
            .includes(marketId)
        )
      );
      setSelectedStores((prev) =>
        prev.filter((store) =>
          regions
            .flatMap((region) => region.countries)
            .flatMap((country) => country.marketTeams)
            .filter((team) => team.id !== id)
            .flatMap((team) =>
              team.markets.flatMap((market) => market.stores)
            )
            .includes(store)
        )
      );
    }

    if (level === "market" && id) {
      setSelectedStores((prev) =>
        prev.filter((store) =>
          regions
            .flatMap((region) => region.countries)
            .flatMap((country) => country.marketTeams)
            .flatMap((team) => team.markets)
            .filter((market) => market.id !== id)
            .flatMap((market) => market.stores)
            .includes(store)
        )
      );
    }
  };

  // Function to update selectedColumns dynamically
  const updateSelectedColumns = () => {
    // Priority: Stores > Markets > Market Teams > Countries > Regions
    if (selectedStores.length > 0) {
      setSelectedColumns(selectedStores);
    } else if (selectedMarkets.length > 0) {
      setSelectedColumns(
        regions
          .flatMap((region) => region.countries)
          .flatMap((country) => country.marketTeams)
          .flatMap((team) => team.markets)
          .filter((market) => selectedMarkets.includes(market.id))
          .map((market) => market.market)
      );
    } else if (selectedMarketTeams.length > 0) {
      setSelectedColumns(
        regions
          .flatMap((region) => region.countries)
          .flatMap((country) => country.marketTeams)
          .filter((team) => selectedMarketTeams.includes(team.id))
          .map((team) => team.marketTeam)
      );
    } else if (selectedCountries.length > 0) {
      setSelectedColumns(
        regions
          .flatMap((region) => region.countries)
          .filter((country) => selectedCountries.includes(country.id))
          .map((country) => country.country)
      );
    } else if (selectedRegions.length > 0) {
      setSelectedColumns(
        regions
          .filter((region) => selectedRegions.includes(region.id))
          .map((region) => region.region)
      );
    } else {
      setSelectedColumns([]);
    }
  };

  // Update selectedColumns whenever any selection changes
  useEffect(() => {
    updateSelectedColumns();
  }, [
    selectedRegions,
    selectedCountries,
    selectedMarketTeams,
    selectedMarkets,
    selectedStores,
  ]);

  return (
    <GeoContext.Provider
      value={{
        regions,
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
        selectedColumns, // Pass the flat list
        resetSelections,
        resetAll
      }}
    >
      {children}
    </GeoContext.Provider>
  );
};

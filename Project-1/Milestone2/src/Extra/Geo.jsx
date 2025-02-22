// Geo.js

import React, { useEffect } from "react";
import { useGeoContext } from "./GeoContext2"; // Import the context
import { regions } from "../constant/Data"; // Import regions data

const Geo = () => {
  const {
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
  } = useGeoContext();

  useEffect(() => {
    const selected = [];
    if (Object.keys(selectedStores).length > 0) {
      selected.push(
        ...Object.keys(selectedStores).filter((key) => selectedStores[key])
      );
    } else if (Object.keys(selectedMarkets).length > 0) {
      selected.push(
        ...Object.keys(selectedMarkets).filter((key) => selectedMarkets[key])
      );
    } else if (Object.keys(selectedMarketTeams).length > 0) {
      selected.push(
        ...Object.keys(selectedMarketTeams).filter(
          (key) => selectedMarketTeams[key]
        )
      );
    } else if (Object.keys(selectedCountries).length > 0) {
      selected.push(
        ...Object.keys(selectedCountries).filter((key) => selectedCountries[key])
      );
    } else if (Object.keys(selectedRegions).length > 0) {
      selected.push(
        ...Object.keys(selectedRegions).filter((key) => selectedRegions[key])
      );
    }
    setFinalSelected(selected);
  }, [
    selectedRegions,
    selectedCountries,
    selectedMarketTeams,
    selectedMarkets,
    selectedStores,
  ]);

  const handleWorldWideToggle = () => {
    const allRegionsSelected = Object.keys(selectedRegions).length === regions.length;
    const newRegions = {};
    if (!allRegionsSelected) {
      regions.forEach((region) => {
        const regionName = Object.keys(region)[0];
        newRegions[regionName] = true;
      });
    }
    setSelectedRegions(newRegions);
    setSelectedCountries({});
    setSelectedMarketTeams({});
    setSelectedMarkets({});
    setSelectedStores({});
  };

  const renderRegions = () =>
    regions.map((region) => {
      const regionName = Object.keys(region)[0];
      return (
        <div key={regionName}>
          <label>
            <input
              type="checkbox"
              checked={selectedRegions[regionName] || false}
              onChange={() => toggleSelection(regionName, setSelectedRegions)}
            />
            {regionName}
          </label>
        </div>
      );
    });

  const renderCountries = () => {
    const selectedRegionNames = Object.keys(selectedRegions).filter(
      (key) => selectedRegions[key]
    );
    let countries = [];
    selectedRegionNames.forEach((regionName) => {
      const region = regions.find((r) => r[regionName]);
      const countryList = region[regionName]?.countries || {};
      countries = [...countries, ...Object.keys(countryList)];
    });
    return countries.map((country) => (
      <div key={country}>
        <label>
          <input
            type="checkbox"
            checked={selectedCountries[country] || false}
            onChange={() => toggleSelection(country, setSelectedCountries)}
          />
          {country}
        </label>
      </div>
    ));
  };

  const renderMarketTeams = () => {
    const selectedCountryNames = Object.keys(selectedCountries).filter(
      (key) => selectedCountries[key]
    );
    let marketTeams = [];
    selectedCountryNames.forEach((country) => {
      regions.forEach((region) => {
        const regionName = Object.keys(region)[0];
        const countryData = region[regionName]?.countries[country];
        if (countryData) {
          marketTeams = [
            ...marketTeams,
            ...Object.keys(countryData.marketTeams),
          ];
        }
      });
    });
    return marketTeams.map((team) => (
      <div key={team}>
        <label>
          <input
            type="checkbox"
            checked={selectedMarketTeams[team] || false}
            onChange={() => toggleSelection(team, setSelectedMarketTeams)}
          />
          {team}
        </label>
      </div>
    ));
  };

  const renderMarkets = () => {
    const selectedTeamNames = Object.keys(selectedMarketTeams).filter(
      (key) => selectedMarketTeams[key]
    );
    let markets = [];
    selectedTeamNames.forEach((team) => {
      regions.forEach((region) => {
        const regionName = Object.keys(region)[0];
        const countries = region[regionName]?.countries || {};
        Object.keys(countries).forEach((country) => {
          const marketTeams = countries[country].marketTeams || {};
          if (marketTeams[team]) {
            markets = [...markets, ...Object.keys(marketTeams[team].markets)];
          }
        });
      });
    });
    return markets.map((market) => (
      <div key={market}>
        <label>
          <input
            type="checkbox"
            checked={selectedMarkets[market] || false}
            onChange={() => toggleSelection(market, setSelectedMarkets)}
          />
          {market}
        </label>
      </div>
    ));
  };

  const renderStores = () => {
    const selectedMarketNames = Object.keys(selectedMarkets).filter(
      (key) => selectedMarkets[key]
    );
    let stores = [];
    selectedMarketNames.forEach((market) => {
      regions.forEach((region) => {
        const regionName = Object.keys(region)[0];
        const countries = region[regionName]?.countries || {};
        Object.keys(countries).forEach((country) => {
          const marketTeams = countries[country].marketTeams || {};
          Object.values(marketTeams).forEach((teamData) => {
            const marketData = teamData.markets[market];
            if (marketData) {
              stores = [...stores, ...marketData];
            }
          });
        });
      });
    });
    return stores.map((store) => (
      <div key={store}>
        <label>
          <input
            type="checkbox"
            checked={selectedStores[store] || false}
            onChange={() => toggleSelection(store, setSelectedStores)}
          />
          {store}
        </label>
      </div>
    ));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div>
        <h3>Region</h3>
        <label>
          <input
            type="checkbox"
            onChange={handleWorldWideToggle}
            checked={Object.keys(selectedRegions).length === regions.length}
          />
          WW
        </label>
        {renderRegions()}
      </div>
      <div>
        <h3>Country</h3>
        {renderCountries()}
      </div>
      <div>
        <h3>Market Team</h3>
        {renderMarketTeams()}
      </div>
      <div>
        <h3>Market</h3>
        {renderMarkets()}
      </div>
      <div>
        <h3>Store</h3>
        {renderStores()}
      </div>
      <div>
        <h3>Final Selected</h3>
        {finalSelected.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
};

export default Geo;

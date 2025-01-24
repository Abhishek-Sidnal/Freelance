import React, { useContext } from "react";
import { GeoContext } from "../context/GeoContext";

const GeoSelector = () => {
  const {
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
    resetSelections,
    selectedColumns,
    resetAll
  } = useContext(GeoContext);

  const handleRegionChange = (regionId) => {
    if (regionId === "WW") {
      // Handle Worldwide selection
      if (selectedRegions.length === regions.length) {
        // If all regions are already selected, deselect all
        setSelectedRegions([]);
        resetSelections("region");
        resetAll();
      } else {
        // Otherwise, select all regions
        const allRegionIds = regions.map((region) => region.id);
        setSelectedRegions(allRegionIds);
      }
    } else {
      // Handle individual region selection
      if (selectedRegions.includes(regionId)) {
        setSelectedRegions(selectedRegions.filter((id) => id !== regionId));
        resetSelections("region", regionId);
      } else {
        setSelectedRegions([...selectedRegions, regionId]);
      }
    }
  };

  const handleCountryChange = (countryId) => {
    if (selectedCountries.includes(countryId)) {
      setSelectedCountries(selectedCountries.filter((id) => id !== countryId));
      resetSelections("country", countryId);
    } else {
      setSelectedCountries([...selectedCountries, countryId]);
    }
  };

  const handleMarketTeamChange = (teamId) => {
    if (selectedMarketTeams.includes(teamId)) {
      setSelectedMarketTeams(selectedMarketTeams.filter((id) => id !== teamId));
      resetSelections("marketTeam", teamId);
    } else {
      setSelectedMarketTeams([...selectedMarketTeams, teamId]);
    }
  };

  const handleMarketChange = (marketId) => {
    if (selectedMarkets.includes(marketId)) {
      setSelectedMarkets(selectedMarkets.filter((id) => id !== marketId));
      resetSelections("market", marketId);
    } else {
      setSelectedMarkets([...selectedMarkets, marketId]);
    }
  };

  const handleStoreChange = (store) => {
    if (selectedStores.includes(store)) {
      setSelectedStores(selectedStores.filter((s) => s !== store));
    } else {
      setSelectedStores([...selectedStores, store]);
    }
  };

  const getSelectedDisplay = () => {
    if (selectedStores.length > 0) {
      return selectedStores.join(", ");
    } else if (selectedMarkets.length > 0) {
      return regions
        .flatMap((region) => region.countries)
        .flatMap((country) => country.marketTeams)
        .flatMap((team) => team.markets)
        .filter((market) => selectedMarkets.includes(market.id))
        .map((market) => market.market)
        .join(", ");
    } else if (selectedMarketTeams.length > 0) {
      return regions
        .flatMap((region) => region.countries)
        .flatMap((country) => country.marketTeams)
        .filter((team) => selectedMarketTeams.includes(team.id))
        .map((team) => team.marketTeam)
        .join(", ");
    } else if (selectedCountries.length > 0) {
      return regions
        .flatMap((region) => region.countries)
        .filter((country) => selectedCountries.includes(country.id))
        .map((country) => country.country)
        .join(", ");
    } else if (selectedRegions.length > 0) {
      return regions
        .filter((region) => selectedRegions.includes(region.id))
        .map((region) => region.region)
        .join(", ");
    } else {
      return "";
    }
  };

  return (
    <div className="geo-selector">
      {/* Regions */}
      <div className="geo-column">
        <h2>Regions {`( ${selectedRegions.length} )`} </h2>
        {/* Worldwide (WW) Option */}
        <div>
          <input
            type="checkbox"
            id="region-ww"
            checked={selectedRegions.length === regions.length}
            onChange={() => handleRegionChange("WW")}
          />
          <label htmlFor="region-ww">Worldwide (WW)</label>
        </div>
        {/* Individual Regions */}
        {regions.map((region) => (
          <div key={region.id}>
            <input
              type="checkbox"
              id={`region-${region.id}`}
              checked={selectedRegions.includes(region.id)}
              onChange={() => handleRegionChange(region.id)}
            />
            <label htmlFor={`region-${region.id}`}>{region.region}</label>
          </div>
        ))}
      </div>

      {/* Countries */}
      <div className="geo-column">
        <h2>Countries {`( ${selectedCountries.length} )`} </h2>
        {selectedRegions.length === 0 ? (
          <p>Select a region</p>
        ) : (
          regions
            .filter((region) => selectedRegions.includes(region.id))
            .flatMap((region) => region.countries)
            .map((country) => (
              <div key={country.id}>
                <input
                  type="checkbox"
                  id={`country-${country.id}`}
                  checked={selectedCountries.includes(country.id)}
                  onChange={() => handleCountryChange(country.id)}
                />
                <label htmlFor={`country-${country.id}`}>{country.country}</label>
              </div>
            ))
        )}
      </div>

      {/* Market Teams */}
      <div className="geo-column">
        <h2>Market Teams {`( ${selectedMarketTeams.length} )`}</h2>
        {selectedCountries.length === 0 ? (
          <p>Select a country</p>
        ) : (
          regions
            .filter((region) => selectedRegions.includes(region.id))
            .flatMap((region) =>
              region.countries.filter((country) =>
                selectedCountries.includes(country.id)
              )
            )
            .flatMap((country) => country.marketTeams)
            .map((team) => (
              <div key={team.id}>
                <input
                  type="checkbox"
                  id={`team-${team.id}`}
                  checked={selectedMarketTeams.includes(team.id)}
                  onChange={() => handleMarketTeamChange(team.id)}
                />
                <label htmlFor={`team-${team.id}`}>{team.marketTeam}</label>
              </div>
            ))
        )}
      </div>

      {/* Markets */}
      <div className="geo-column">
        <h2>Markets {`( ${selectedMarkets.length} )`} </h2>
        {selectedMarketTeams.length === 0 ? (
          <p>Select a market team</p>
        ) : (
          regions
            .flatMap((region) => region.countries)
            .flatMap((country) => country.marketTeams)
            .filter((team) => selectedMarketTeams.includes(team.id))
            .flatMap((team) => team.markets)
            .map((market) => (
              <div key={market.id}>
                <input
                  type="checkbox"
                  id={`market-${market.id}`}
                  checked={selectedMarkets.includes(market.id)}
                  onChange={() => handleMarketChange(market.id)}
                />
                <label htmlFor={`market-${market.id}`}>{market.market}</label>
              </div>
            ))
        )}
      </div>

      {/* Stores */}
      <div className="geo-column">
        <h2>Stores {`( ${selectedStores.length} )`} </h2>
        {selectedMarkets.length === 0 ? (
          <p>Select a market</p>
        ) : (
          regions
            .flatMap((region) => region.countries)
            .flatMap((country) => country.marketTeams)
            .flatMap((team) => team.markets)
            .filter((market) => selectedMarkets.includes(market.id))
            .flatMap((market) => market.stores)
            .map((store) => (
              <div key={store}>
                <input
                  type="checkbox"
                  id={`store-${store}`}
                  checked={selectedStores.includes(store)}
                  onChange={() => handleStoreChange(store)}
                />
                <label htmlFor={`store-${store}`}>{store}</label>
              </div>
            ))
        )}
      </div>

      {/* Selected */}
      <div className="geo-column">
        <h2>Selected {`( ${selectedColumns.length} )`} </h2>
        {selectedColumns.map((s, i) => (
          <p key={i}>{s}</p>
        ))}
      </div>
    </div>
  );
};

export default GeoSelector;

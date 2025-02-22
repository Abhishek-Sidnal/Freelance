import React, { useState } from 'react';
import { regions } from '../constant/Data2';

const GeoSelector = () => {
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedMarketTeams, setSelectedMarketTeams] = useState([]);
    const [selectedMarkets, setSelectedMarkets] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);

    // Handler for selecting or deselecting regions
    const handleRegionChange = (regionId) => {
        if (selectedRegions.includes(regionId)) {
            // Deselect region and reset deeper selections
            setSelectedRegions(selectedRegions.filter(id => id !== regionId));
            setSelectedCountries([]);
            setSelectedMarketTeams([]);
            setSelectedMarkets([]);
            setSelectedStores([]);
        } else {
            // Select region
            setSelectedRegions([...selectedRegions, regionId]);
        }
    };

    // Handler for selecting or deselecting countries
    const handleCountryChange = (countryId) => {
        if (selectedCountries.includes(countryId)) {
            // Deselect country and reset deeper selections
            setSelectedCountries(selectedCountries.filter(id => id !== countryId));
            setSelectedMarketTeams([]);
            setSelectedMarkets([]);
            setSelectedStores([]);
        } else {
            // Select country
            setSelectedCountries([...selectedCountries, countryId]);
        }
    };

    // Handler for selecting or deselecting market teams
    const handleMarketTeamChange = (teamId) => {
        if (selectedMarketTeams.includes(teamId)) {
            // Deselect market team and reset deeper selections
            setSelectedMarketTeams(selectedMarketTeams.filter(id => id !== teamId));
            setSelectedMarkets([]);
            setSelectedStores([]);
        } else {
            // Select market team
            setSelectedMarketTeams([...selectedMarketTeams, teamId]);
        }
    };

    // Handler for selecting or deselecting markets
    const handleMarketChange = (marketId) => {
        if (selectedMarkets.includes(marketId)) {
            // Deselect market and reset deeper selections
            setSelectedMarkets(selectedMarkets.filter(id => id !== marketId));
            setSelectedStores([]);
        } else {
            // Select market
            setSelectedMarkets([...selectedMarkets, marketId]);
        }
    };

    // Handler for selecting or deselecting stores
    const handleStoreChange = (store) => {
        if (selectedStores.includes(store)) {
            // Deselect store
            setSelectedStores(selectedStores.filter(s => s !== store));
        } else {
            // Select store
            setSelectedStores([...selectedStores, store]);
        }
    };

    // Determine the highest level selected item for display in the "Selected" column
    const getSelectedDisplay = () => {
        if (selectedStores.length > 0) {
            return selectedStores.join(', '); // Display all selected stores
        } else if (selectedMarkets.length > 0) {
            return selectedMarkets.map(marketId =>
                regions
                    .flatMap(region => region.countries)
                    .flatMap(country => country.marketTeams)
                    .flatMap(team => team.markets)
                    .find(market => market.id === marketId)?.market
            ).join(', '); // Display all selected markets
        } else if (selectedMarketTeams.length > 0) {
            return selectedMarketTeams.map(teamId =>
                regions
                    .flatMap(region => region.countries)
                    .flatMap(country => country.marketTeams)
                    .find(team => team.id === teamId)?.marketTeam
            ).join(', '); // Display all selected market teams
        } else if (selectedCountries.length > 0) {
            return selectedCountries.map(countryId =>
                regions
                    .flatMap(region => region.countries)
                    .find(country => country.id === countryId)?.country
            ).join(', '); // Display all selected countries
        } else if (selectedRegions.length > 0) {
            return selectedRegions.map(regionId =>
                regions.find(region => region.id === regionId)?.region
            ).join(', '); // Display all selected regions
        } else {
            return "";
        }
    };

    return (
        <div className="geo-selector">
            {/* Regions selection */}
            <div className="geo-column">
                <h2>Regions</h2>
                {regions.map(region => (
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

            {/* Countries selection */}
            <div className="geo-column">
                <h2>Countries</h2>
                {selectedRegions.length === 0 ? (
                    <p>Select region</p>
                ) : (
                    <>
                        {regions
                            .filter(region => selectedRegions.includes(region.id))
                            .flatMap(region => region.countries)
                            .map(country => (
                                <div key={country.id}>
                                    <input
                                        type="checkbox"
                                        id={`country-${country.id}`}
                                        checked={selectedCountries.includes(country.id)}
                                        onChange={() => handleCountryChange(country.id)}
                                    />
                                    <label htmlFor={`country-${country.id}`}>{country.country}</label>
                                </div>
                            ))}
                    </>
                )}
            </div>

            {/* Market Teams selection */}
            <div className="geo-column">
                <h2>Market Teams</h2>
                {selectedCountries.length === 0 ? (
                    <p>Select country</p>
                ) : (
                    <>
                        {regions
                            .filter(region => selectedRegions.includes(region.id))
                            .flatMap(region => region.countries.filter(country => selectedCountries.includes(country.id)))
                            .flatMap(country => country.marketTeams)
                            .map(team => (
                                <div key={team.id}>
                                    <input
                                        type="checkbox"
                                        id={`market-team-${team.id}`}
                                        checked={selectedMarketTeams.includes(team.id)}
                                        onChange={() => handleMarketTeamChange(team.id)}
                                    />
                                    <label htmlFor={`market-team-${team.id}`}>{team.marketTeam}</label>
                                </div>
                            ))}
                    </>
                )}
            </div>

            {/* Markets selection */}
            <div className="geo-column">
                <h2>Markets</h2>
                {selectedMarketTeams.length === 0 ? (
                    <p>Select market team</p>
                ) : (
                    <>
                        {regions
                            .filter(region => selectedRegions.includes(region.id))
                            .flatMap(region => region.countries.filter(country => selectedCountries.includes(country.id)))
                            .flatMap(country => country.marketTeams.filter(team => selectedMarketTeams.includes(team.id)))
                            .flatMap(team => team.markets)
                            .map(market => (
                                <div key={market.id}>
                                    <input
                                        type="checkbox"
                                        id={`market-${market.id}`}
                                        checked={selectedMarkets.includes(market.id)}
                                        onChange={() => handleMarketChange(market.id)}
                                    />
                                    <label htmlFor={`market-${market.id}`}>{market.market}</label>
                                </div>
                            ))}
                    </>
                )}
            </div>

            {/* Stores selection */}
            <div className="geo-column">
                <h2>Stores</h2>
                {selectedMarkets.length === 0 ? (
                    <p>Select market</p>
                ) : (
                    <ul>
                        {regions
                            .filter(region => selectedRegions.includes(region.id))
                            .flatMap(region => region.countries.filter(country => selectedCountries.includes(country.id)))
                            .flatMap(country => country.marketTeams.filter(team => selectedMarketTeams.includes(team.id)))
                            .flatMap(team => team.markets.filter(market => selectedMarkets.includes(market.id)))
                            .flatMap(market => market.stores)
                            .map(store => (
                                <li key={store}>
                                    <input
                                        type="checkbox"
                                        id={`store-${store}`}
                                        checked={selectedStores.includes(store)}
                                        onChange={() => handleStoreChange(store)}
                                    />
                                    <label htmlFor={`store-${store}`}>{store}</label>
                                </li>
                            ))}
                    </ul>
                )}
            </div>

            {/* Selected column */}
            <div className="geo-column">
                <h2>Selected</h2>
                <p>{getSelectedDisplay()}</p>
            </div>
        </div>
    );
};

export default GeoSelector;

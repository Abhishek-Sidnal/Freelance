import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getUniqueCombinations } from '../../data';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [selectedCountries, setSelectedCountries] = useState(["all"]);
    const [selectedWaysToBuy, setSelectedWaysToBuy] = useState(["all"]);
    const [selectedDate, setSelectedDate] = useState("");
    const [countryFilter, setCountryFilter] = useState([]);
    const [wbFilter, setWBFilter] = useState([]);
    const [dates, setDates] = useState([]);
    const [filters, setFilters] = useState([]);

    const apiFilter = import.meta.env.VITE_API_FILTER;

    // Fetch filters 
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get("/Reports_Geo_Dropdown");
                setFilters(response.data.result);
            } catch (error) {
                console.log('Failed to load filters');
            }
        };

        fetchFilters();
    }, []);



    const uniqueResult = getUniqueCombinations(filters);

    useEffect(() => {
        setCountryFilter(uniqueResult.countries);
        setWBFilter(uniqueResult.waysToBuy);
        let tempDate = uniqueResult.dates.map((date => date.replaceAll("-", "/")));

        setDates(tempDate);
        setSelectedDate(tempDate[tempDate.length - 1]);
        setDisplayedFilters({
            countries: selectedCountries,
            ways: selectedWaysToBuy,
            date: tempDate[tempDate.length - 1],
        });
    }, [filters]);

    const [displayedFilters, setDisplayedFilters] = useState({
        countries: ["all"],
        ways: ["all"],
        date: selectedDate,
    });

    const applyFilters = () => {
        setDisplayedFilters({
            countries: selectedCountries,
            ways: selectedWaysToBuy,
            date: selectedDate,
        });
    };


    return (
        <FilterContext.Provider value={{
            selectedCountries, setSelectedCountries,
            selectedWaysToBuy, setSelectedWaysToBuy,
            selectedDate, setSelectedDate,
            countryFilter, setCountryFilter,
            wbFilter, setWBFilter,
            dates, setDates,
            filters, setFilters,
            displayedFilters, setDisplayedFilters,
            applyFilters
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => useContext(FilterContext);
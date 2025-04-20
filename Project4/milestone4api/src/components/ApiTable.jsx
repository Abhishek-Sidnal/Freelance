import React, { useEffect, useState } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';
import { useFilters } from './context/FilterContext';
import { groupData } from '../data';
import axios from 'axios';

const FilterHeader = () => {
    const {
        selectedCountries, setSelectedCountries,
        selectedWaysToBuy, setSelectedWaysToBuy,
        selectedDate, setSelectedDate,
        countryFilter, setCountryFilter,
        wbFilter, setWBFilter,
        dates, setDates,
        displayedFilters, applyFilters
    } = useFilters();

    const apiUrl = import.meta.env.VITE_API_DATA;
    const [result, setReuslt] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(apiUrl);
                const result = response.data.result;
                setReuslt(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, [apiUrl]);

    const formattedData2 = groupData(result);
    console.log(formattedData2);


    // Prepare data for table rendering
    useEffect(() => {
        const tableRows = [];
        formattedData2.forEach(row => {
            row.Day_Desc.forEach(day => {
                Object.keys(day).forEach(dayDescKey => {
                    Object.keys(day[dayDescKey]).forEach(bagStatus => {
                        const bagData = day[dayDescKey][bagStatus];
                        tableRows.push({
                            country: row.Country,
                            waysToBuy: row.Ways_To_Buy,
                            dayDesc: dayDescKey,
                            bagStatus,
                            GBI_Cnt: bagData.GBI_Cnt,
                            AOS_Cnt: bagData.AOS_Cnt,
                            FSI_Cnt: bagData.FSI_Cnt
                        });
                    });
                });
            });
        });
        setTableData(tableRows);  // Set table data to state
    }, [formattedData2]);

    return (
        <>
            <div className="filter-header">
                <div className="filter">
                    <label htmlFor="">Country</label>
                    <MultiSelectDropdown
                        options={countryFilter} // Dynamically passed country options
                        selectedValues={selectedCountries}
                        onChange={setSelectedCountries}
                        label="Country"
                    />
                </div>

                <div className="filter">
                    <label htmlFor="">Ways to Buy</label>
                    <MultiSelectDropdown
                        options={wbFilter} // Dynamically passed ways to buy options
                        selectedValues={selectedWaysToBuy}
                        onChange={setSelectedWaysToBuy}
                        label="Ways to Buy"
                    />
                </div>

                <div className="filter">
                    <label htmlFor="">As of Date</label>
                    <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)} // Update selected date
                        className="select"
                        style={{
                            padding: '10px',
                            width: '150px',
                            fontSize: '14px',
                            appearance: 'none',
                        }}
                    >
                        {dates.map((date, i) => (
                            <option key={i} value={date}>
                                {date}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={applyFilters}>Apply</button>
            </div>

            {/* Render the table */}
            <div className="">
                <table border="1">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Ways to Buy</th>
                            <th>Bag Status</th>
                            {/* Render Day Columns Dynamically */}
                            {Array.from(new Set(tableData.map(row => row.dayDesc))).map((dayDesc, index) => (
                                <th key={index}>{dayDesc}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => {
                            const isFirstOfGroup = index === 0 || tableData[index - 1].country !== row.country || tableData[index - 1].waysToBuy !== row.waysToBuy;
                            const rowspan = isFirstOfGroup ? tableData.filter(r => r.country === row.country && r.waysToBuy === row.waysToBuy).length : 1;

                            return (
                                <tr key={index}>
                                    {isFirstOfGroup && (
                                        <>
                                            <td rowSpan={rowspan}>{row.country}</td>
                                            <td rowSpan={rowspan}>{row.waysToBuy}</td>
                                        </>
                                    )}
                                    <td>{row.bagStatus}</td>

                                    {/* Render dynamically for each day */}
                                    {Array.from(new Set(tableData.map(r => r.dayDesc))).map((dayDesc, dayIndex) => {
                                        const filteredRow = tableData.find(r => r.dayDesc === dayDesc && r.country === row.country && r.waysToBuy === row.waysToBuy && r.bagStatus === row.bagStatus);
                                        return (
                                            <td key={dayIndex}>
                                                <table border="1">
                                                    <tbody>
                                                        <tr>
                                                            <td>{filteredRow ? filteredRow.GBI_Cnt : "N/A"}</td>
                                                            <td>{filteredRow ? filteredRow.AOS_Cnt : "N/A"}</td>
                                                            <td>{filteredRow ? filteredRow.FSI_Cnt : "N/A"}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                {/* {filteredRow ? filteredRow.GBI_Cnt : "N/A"} / {filteredRow ? filteredRow.AOS_Cnt : "N/A"} / {filteredRow ? filteredRow.FSI_Cnt : "N/A"} */}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>


            </div>
        </>
    );
};

export default FilterHeader;


import React, { useState, useEffect, useRef } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";


// Function to generate last 8 days 
const generateLast8Days = () => {
    const dates = [];
    for (let i = 0; i < 8; i++) {
        let date = new Date();
        date.setDate(date.getDate() - i);
        dates.push({
            id: date.toISOString().split("T")[0],
            label: date.toLocaleDateString("en-US"),
        });
    }
    return dates;
};

const Dtable = () => {
    const defaultDate = generateLast8Days()[0].id;
    const [selectedCountries, setSelectedCountries] = useState(["all"]);
    const [selectedWaysToBuy, setSelectedWaysToBuy] = useState(["all"]);
    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [dates, setDates] = useState(generateLast8Days());

    const [appliedFilters, setAppliedFilters] = useState({
        countries: ["c1", "c2", "c3", "c4"],
        ways: ["w1", "w2", "w3", "w4"],
        date: defaultDate,
    });

    const filter1Options = [
        { id: "c1", label: "c1" },
        { id: "c2", label: "c2" },
        { id: "c3", label: "c3" },
        { id: "c4", label: "c4" },
    ];

    const filter2Options = [
        { id: "w1", label: "w1" },
        { id: "w2", label: "w2" },
        { id: "w3", label: "w3" },
        { id: "w4", label: "w4" },
    ];

    const bagStatuses = [
        "Bags Approved",
        "Bags Pending",
        "Bags Declined",
        "Total Bags Created",
        "Bags Deleted",
        "Mass Deleted",
        "Total Bags Deleted",
        "Bags Ordered",
        "Payments Failed",
        "Total Bags Ordered",
        "Open Bags",
    ];

    const filteredDates = dates.filter((date) => date.id <= appliedFilters.date);

    const applyFilters = () => {
        setAppliedFilters({
            countries: selectedCountries.includes("all") ? ["c1", "c2", "c3", "c4"] : selectedCountries,
            ways: selectedWaysToBuy.includes("all") ? ["w1", "w2", "w3", "w4"] : selectedWaysToBuy,
            date: selectedDate,
        });
    };

    const generateRows = () => {
        const rows = [];

        appliedFilters.countries.forEach((country) => {
            appliedFilters.ways.forEach((way) => {
                rows.push(
                    <tr key={`group-${country}-${way}`}>
                        <td colSpan="3" className="mainHeader">
                            <table border="1">
                                <tbody>
                                    {bagStatuses.map((status, index) => (
                                        <tr key={`${country}-${way}-${status}`}>
                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="bodyHeader">
                                                    {country}
                                                </td>
                                            )}

                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="bodyHeader">
                                                    {way}
                                                </td>
                                            )}

                                            <td
                                                className={`bodyHeader ${status === "Total Bags Created" ||
                                                    status === "Total Bags Deleted" ||
                                                    status === "Total Bags Ordered"
                                                    ? "blueHeader"
                                                    : status === "Open Bags"
                                                        ? "lightGreenHeader"
                                                        : ""
                                                    }`}
                                            >
                                                {status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>

                        {filteredDates.map((date) => (
                            <td colSpan="3" key={`${country}-${way}-${date.id}`}>
                                <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                        {bagStatuses.map((status, index) => (
                                            <tr
                                                key={`${country}-${way}-${status}-data-${date.id}`}
                                                className={`bodyHeader ${status === "Total Bags Created" ||
                                                    status === "Total Bags Deleted" ||
                                                    status === "Total Bags Ordered"
                                                    ? "blueHeader"
                                                    : status === "Open Bags"
                                                        ? "lightGreenHeader"
                                                        : ""
                                                    }`}
                                            >
                                                <td>{Math.round(Math.random() * 10000)}</td> {/* GBI */}
                                                <td>{Math.round(Math.random() * 10000)}</td> {/* AOS */}
                                                <td>{Math.round(Math.random() * 10000)}</td> {/* FSI */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        ))}
                    </tr>
                );
            });
        });

        return rows;
    };

    return (
        <div className="container">
            {/* Filter  */}
            <div className="filter-header">
                <div className="filter">
                    <label htmlFor="">Country</label>
                    <MultiSelectDropdown
                        options={filter1Options}
                        selectedValues={selectedCountries}
                        onChange={setSelectedCountries}
                        label="Country"
                    />
                </div>

                <div className="filter">
                    <label htmlFor="">Ways to Buy</label>
                    <MultiSelectDropdown
                        options={filter2Options}
                        selectedValues={selectedWaysToBuy}
                        onChange={setSelectedWaysToBuy}
                        label="Ways to Buy"
                    />
                </div>

                <div className="filter">
                    <label htmlFor="">As of Date</label>
                    <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                        {dates.map((date) => (
                            <option key={date.id} value={date.id}>
                                {date.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={applyFilters}>Apply</button>
            </div>

            {/* Table */}
            <div className="table">
                <table className="" >
                    <thead>
                        <tr>
                            <th colSpan="3" className="mainHeader" >
                                <table border="1" >
                                    <tbody>
                                        <tr>
                                            <td >Country</td>
                                            <td >Ways to Buy</td>
                                            <td >As of Date</td>
                                        </tr>
                                        <tr>
                                            <td className="headerHighlight" >{selectedCountries}</td>
                                            <td className="headerHighlight" >{selectedWaysToBuy}</td>
                                            <td className="headerHighlight" >{selectedDate}</td>
                                        </tr>
                                        <tr>
                                            <th className="blueHeader" >Country</th>
                                            <th className="blueHeader" >ways to buy</th>
                                            <th className="blueHeader" >Bags Status</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </th>

                            {filteredDates.map((date, index) => (
                                <th key={date.id} colSpan="3" >
                                    <table border="1" className="tbody" >
                                        <tbody>
                                            <tr>
                                                <td colSpan="3" >{`Till Day  ${8 - index} (EOD) - ${date.label}`}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" >
                                                    {selectedDate} - {date.label}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="blueHeader">GBI</th>
                                                <th className="blueHeader" >AOS</th>
                                                <th className="blueHeader" >FSI</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </th>
                            ))}
                        </tr>

                    </thead>
                    <tbody>
                        {generateRows().map((row) => (
                            <>
                                {row}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dtable;


import React, { useState, useEffect, useRef } from "react";

// MultiSelectDropdown Component
const MultiSelectDropdown = ({ options = [], selectedValues, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (id) => {
        let updatedSelection = selectedValues.includes(id)
            ? selectedValues.filter((item) => item !== id)
            : [...selectedValues, id];

        onChange(updatedSelection);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabels = selectedValues.length === 0
        ? "Select " + label
        : options
            .filter((opt) => selectedValues.includes(opt.id))
            .map((opt) => opt.label)
            .join(", ");

    return (
        <div className="multi-select-dropdown" ref={dropdownRef}>
            <div className="dropdown-header" onClick={toggleDropdown}>
                {selectedLabels}
                <span className="arrow">{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
                <ul className="dropdown-list">
                    {options.map((option) => (
                        <li
                            key={option.id}
                            className={selectedValues.includes(option.id) ? "selected" : ""}
                            onClick={() => handleOptionClick(option.id)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Function to generate last 8 days (including today)
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

// Main Component with Apply Button
const TableWithBody = () => {
    const defaultDate = generateLast8Days()[0].id; // Today's date
    const [selectedCountries, setSelectedCountries] = useState(["all"]);
    const [selectedWaysToBuy, setSelectedWaysToBuy] = useState(["all"]);
    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [dates, setDates] = useState(generateLast8Days());

    // Set default applied filters
    const [appliedFilters, setAppliedFilters] = useState({
        countries: ["c1", "c2", "c3", "c4"],
        ways: ["w1", "w2", "w3", "w4"],
        date: defaultDate,
    });

    const filter1Options = [
        { id: "all", label: "All" },
        { id: "c1", label: "c1" },
        { id: "c2", label: "c2" },
        { id: "c3", label: "c3" },
        { id: "c4", label: "c4" },
    ];

    const filter2Options = [
        { id: "all", label: "All" },
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

    const generateCombinations = (arr) => {
        let result = [];

        // Generate descending ordered subsets
        for (let i = arr.length; i > 0; i--) {
            result.push(arr.slice(0, i));
        }

        // Ensure single items are explicitly included
        arr.forEach(item => {
            if (!result.some(combo => combo.length === 1 && combo[0] === item)) {
                result.push([item]);
            }
        });

        return result;
    };


    const generateRows = () => {
        const rows = [];

        appliedFilters.countries.forEach((country) => {
            const waysCombinations = generateCombinations(appliedFilters.ways);

            waysCombinations.forEach((wayCombo) => {
                rows.push(
                    <tr key={`group-${country}-${wayCombo.join("-")}`}>
                        {/* First Table (Country, Ways to Buy, Bag Status) */}
                        <td colSpan="3" className="mainHeader" >
                            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                    {bagStatuses.map((status, index) => (
                                        <tr key={`${country}-${wayCombo.join("-")}-${status}`}>
                                            {/* Country spans all bag statuses */}
                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="bodyHeader" style={{ backgroundColor: "#f8f8f8", textAlign: "center" }}>
                                                    {country}
                                                </td>
                                            )}

                                            {/* Ways to Buy spans all bag statuses */}
                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="bodyHeader" style={{ backgroundColor: "#f8f8f8", textAlign: "center" }}>
                                                    {wayCombo.join(", ")}
                                                </td>
                                            )}

                                            {/* Bag Status */}
                                            <td className={`bodyHeader ${status === "Total Bags Created" ||
                                                    status === "Total Bags Deleted" ||
                                                    status === "Total Bags Ordered"
                                                    ? "blueHeader"
                                                    : status === "Open Bags"
                                                        ? "lightGreenHeader"
                                                        : ""
                                                }`}>{status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>

                        {/* Second Table (GBI, AOS, FSI Data for Each Bag Status & Date) */}
                        {filteredDates.map((date) => (
                            <td colSpan="3" key={`${country}-${wayCombo.join("-")}-${date.id}`}>
                                <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                        {bagStatuses.map((status, index) => (
                                            <tr key={`${country}-${wayCombo.join("-")}-${status}-data-${date.id}`}  
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
        <div>
            {/* Filter Header */}
            <div className="filter-header"
                style={{ marginBottom: "20px", display: "flex", gap: "10px", whiteSpace: "nowrap" }}
            >
                <MultiSelectDropdown
                    options={filter1Options}
                    selectedValues={selectedCountries}
                    onChange={setSelectedCountries}
                    label="Country"
                />
                <MultiSelectDropdown
                    options={filter2Options}
                    selectedValues={selectedWaysToBuy}
                    onChange={setSelectedWaysToBuy}
                    label="Ways to Buy"
                />
                <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                    {dates.map((date) => (
                        <option key={date.id} value={date.id}>
                            {date.label}
                        </option>
                    ))}
                </select>
                <button onClick={applyFilters}>Apply</button>
            </div>

            {/* Table */}
            <table style={{ width: "100%" }}>
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
                            <th key={date.id} colSpan="3">
                                <table border="1" className="tbody" >
                                    <tbody>
                                        <tr>
                                            <td colSpan="3" >{`Till Day  ${8 - index} (EOD) - ${date.label}`}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" >
                                                09/09/2024 - 09/16/2024
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
                <tbody>{generateRows().map((row) => (
                    <>
                        {row}
                    </>
                ))}</tbody>
            </table>
        </div>
    );
};

export default TableWithBody;


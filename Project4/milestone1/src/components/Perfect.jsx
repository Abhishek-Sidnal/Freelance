import React, { useState, useEffect, useRef } from "react";
import './MultiSelectDropdown.scss'
import '../index2.scss'
// MultiSelectDropdown Component
const MultiSelectDropdown = ({ options = [], selectedValues, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (id) => {
        if (id === "all") {
            let updatedSelection = selectedValues.includes(id) ? [] : options.map((opt) => opt.id);
            onChange(updatedSelection);
        } else {
            let updatedSelection = selectedValues.includes(id)
                ? selectedValues.filter((item) => item !== id)
                : [...selectedValues, id];

            if (updatedSelection.length === options.length) {
                updatedSelection = ["all", ...updatedSelection.filter((item) => item !== "all")];
            }

            if (updatedSelection.length < options.length && updatedSelection.includes("all")) {
                updatedSelection = updatedSelection.filter(item => item !== "all");
            }

            onChange(updatedSelection);
        }
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

    const selectedLabels = selectedValues.includes("all")
        ? "All " + label
        : selectedValues.length === 0
            ? "Select " + label
            : options
                .filter((opt) => selectedValues.includes(opt.id))
                .map((opt) => opt.label)
                .join(", ");

    return (
        <div className="multi-select-dropdown" ref={dropdownRef}>
            <div className="dropdown-header" onClick={toggleDropdown}>
                {selectedLabels}
                <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
                <ul className="dropdown-options-list">
                    <li
                        key="all"
                        className={selectedValues.includes("all") ? "option-selected" : ""}
                        onClick={() => handleOptionClick("all")}
                    >
                        All
                    </li>
                    {options.map((option) => (
                        <li
                            key={option.id}
                            className={selectedValues.includes(option.id) ? "option-selected" : ""}
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

    const generateCombinations = (arr) => {
        let result = [];
        for (let i = arr.length; i > 0; i--) {
            result.push(arr.slice(0, i));
        }
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
                    <tr key={`group-${country}-${wayCombo.join("-")}`} className="table-row">
                        {/* First Table (Country, Ways to Buy, Bag Status) */}
                        <td colSpan="3" className="table-main-header">
                            <table border="1" className="table-inner">
                                <tbody>
                                    {bagStatuses.map((status, index) => (
                                        <tr key={`${country}-${wayCombo.join("-")}-${status}`} className="table-row-status">
                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="body-header">
                                                    {country}
                                                </td>
                                            )}

                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="body-header">
                                                    {wayCombo.join(", ")}
                                                </td>
                                            )}

                                            <td className={`body-header ${status === "Total Bags Created" || status === "Total Bags Deleted" || status === "Total Bags Ordered"
                                                ? "blue-header"
                                                : status === "Open Bags"
                                                    ? "light-green-header"
                                                    : ""}`}>{status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>

                        {/* Second Table (GBI, AOS, FSI Data for Each Bag Status & Date) */}
                        {filteredDates.map((date) => (
                            <td colSpan="3" key={`${country}-${wayCombo.join("-")}-${date.id}`} className="table-inner-cell">
                                <table border="1" className="table-inner">
                                    <tbody>
                                        {bagStatuses.map((status, index) => (
                                            <tr key={`${country}-${wayCombo.join("-")}-${status}-data-${date.id}`}
                                                className={`body-header ${status === "Total Bags Created" || status === "Total Bags Deleted" || status === "Total Bags Ordered"
                                                    ? "blue-header"
                                                    : status === "Open Bags"
                                                        ? "light-green-header"
                                                        : ""}`}
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
        <div className="table-container">
            <div className="filters-header">
                <div className="filter-item">
                    <label htmlFor="country-select">Country</label>
                    <MultiSelectDropdown
                        options={filter1Options}
                        selectedValues={selectedCountries}
                        onChange={setSelectedCountries}
                        label="Country"
                    />
                </div>

                <div className="filter-item">
                    <label htmlFor="ways-select">Ways to Buy</label>
                    <MultiSelectDropdown
                        options={filter2Options}
                        selectedValues={selectedWaysToBuy}
                        onChange={setSelectedWaysToBuy}
                        label="Ways to Buy"
                    />
                </div>

                <div className="filter-item">
                    <label htmlFor="date-select">As of Date</label>
                    <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} id="date-select">
                        {dates.map((date) => (
                            <option key={date.id} value={date.id}>
                                {date.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={applyFilters} className="apply-filters-btn">Apply</button>
            </div>

            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="3" className="table-main-header">
                                <table border="1" className="table-inner">
                                    <tbody>
                                        <tr >
                                            <td  >Country</td>
                                            <td>Ways to Buy</td>
                                            <td>As of Date</td>
                                        </tr>
                                        <tr>
                                            <td className="header-highlight">{selectedCountries}</td>
                                            <td className="header-highlight">{selectedWaysToBuy}</td>
                                            <td className="header-highlight">{selectedDate}</td>
                                        </tr>
                                        <tr>
                                            <th className="blue-header">Country</th>
                                            <th className="blue-header">Ways to Buy</th>
                                            <th className="blue-header">Bags Status</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </th>

                            {filteredDates.map((date, index) => (
                                <th key={date.id} colSpan="3" className="table-header-date">
                                    <table border="1" className="table-inner">
                                        <tbody>
                                            <tr>
                                                <td colSpan="3">{`Till Day ${8 - index} (EOD) - ${date.label}`}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3">
                                                    {selectedDate} - {date.label}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="blue-header">GBI</th>
                                                <th className="blue-header">AOS</th>
                                                <th className="blue-header">FSI</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {generateRows().map((row) => row)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableWithBody;

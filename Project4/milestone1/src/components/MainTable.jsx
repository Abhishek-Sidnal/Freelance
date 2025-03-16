import React, { useState, useEffect, useRef } from "react";
import "./MultiSelectDropdown.scss";

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

// Function to generate all combinations of ways to buy
const generateCombinations = (selectedValues) => {
    const combinations = [];
    const len = selectedValues.length;

    for (let i = 1; i <= len; i++) {
        const currentCombination = [];
        const combine = (start, depth) => {
            if (depth === i) {
                combinations.push(currentCombination.slice());
                return;
            }
            for (let j = start; j < len; j++) {
                currentCombination.push(selectedValues[j]);
                combine(j + 1, depth + 1);
                currentCombination.pop();
            }
        };
        combine(0, 0);
    }

    return combinations;
};

// Main Component with Table and Filter Header
const TableWithBody = () => {
    const [selectedFilter1, setSelectedFilter1] = useState(["all"]);
    const [selectedFilter2, setSelectedFilter2] = useState(["all"]);

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

    // The statuses for the "Bags Status" column
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

    const generateRows = () => {
        const rows = [];
        // Determine selected countries and ways to buy
        const filter1Selected = selectedFilter1.includes("all") ? ["c1", "c2", "c3", "c4"] : selectedFilter1;
        const filter2Selected = selectedFilter2.includes("all") ? ["w1", "w2", "w3", "w4"] : selectedFilter2;

        // Generate combinations of selected Ways to Buy
        const combinations = generateCombinations(filter2Selected);

        // Loop through each selected country
        filter1Selected.forEach((country) => {
            // Loop through each combination of selected ways to buy
            combinations.forEach((ways) => {
                const waysText = ways.join(", ");
                // For each combination of country and ways to buy, loop through all bag statuses
                bagStatuses.forEach((status) => {
                    rows.push(
                        <tr key={`${country}-${waysText}-${status}`} >
                            <td>{country}</td>
                            <td>{waysText}</td>
                            <td>{status}</td>
                            <td>{Math.round(Math.random() * 10000)}</td>
                            <td>{Math.round(Math.random() * 10000)}</td>
                            <td>{Math.round(Math.random() * 10000)}</td>
                            <td>{Math.round(Math.random() * 10000)}</td>
                            <td>{Math.round(Math.random() * 10000)}</td>
                            <td>{Math.round(Math.random() * 10000)}</td>
                            <td>{Math.round(Math.random() * 10000)}</td>
                            <td>{Math.round(Math.random() * 10000)}</td>
                            <td>{Math.round(Math.random() * 10000)}</td>

                        </tr>
                    );
                });
            });
        });
        return rows;
    };

    return (
        <div>
            {/* Filter Header */}
            <div className="filter-header" style={{ marginBottom: "20px" }}>
                <MultiSelectDropdown
                    options={filter1Options}
                    selectedValues={selectedFilter1}
                    onChange={setSelectedFilter1}
                    label="Country"
                />
                <MultiSelectDropdown
                    options={filter2Options}
                    selectedValues={selectedFilter2}
                    onChange={setSelectedFilter2}
                    label="Ways to Buy"
                />
            </div>

            {/* Table */}
            <table border="1" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th colSpan="3" style={{ backgroundColor: 'yellow' }}>
                            <table border="1" style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '33.33%' }}>Country</td>
                                        <td style={{ width: '33.33%' }}>Ways to Buy</td>
                                        <td style={{ width: '33.33%' }}>As of Date</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'center' }}>[ALL]</td>
                                        <td style={{ textAlign: 'center' }}>[ALL]</td>
                                        <td style={{ textAlign: 'center' }}>09/16/2024</td>
                                    </tr>
                                </tbody>
                            </table>
                        </th>
                        <th colSpan="3">
                            <table border="1" style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>Till Day 8 (EOD)</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>
                                            09/09/2024 - 09/16/2024
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </th>
                        <th colSpan="3">
                            <table border="1" style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>Till Day 7 (EOD)</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>
                                            09/09/2024 - 09/15/2024
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </th>
                        <th colSpan="3">
                            <table border="1" style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>Till Day 6 (EOD)</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>
                                            09/09/2024 - 09/14/2024
                                        </td>
                                    </tr>
                                </tbody>
                            </table >
                        </th>
                    </tr>
                    <tr style={{ backgroundColor: '#0070C0', color: 'white' }}>
                        <td>Country</td>
                        <td>Ways to Buy</td>
                        <td>Bags Status</td>
                        <td>GBI</td>
                        <td>AOS</td>
                        <td>FSI</td>
                        <td>GBI</td>
                        <td>AOS</td>
                        <td>FSI</td>
                        <td>GBI</td>
                        <td>AOS</td>
                        <td>FSI</td>
                    </tr>
                </thead>
                <tbody>
                    {generateRows()}
                </tbody>
            </table>
        </div>
    );
};

export default TableWithBody;


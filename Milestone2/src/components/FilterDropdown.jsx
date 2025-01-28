import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";

const FilterDropdown = ({ label, options, selectedOptions, onFilterChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref for the dropdown

    // Toggle Dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Close Dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button
                className="dropdown-toggle"
                aria-label={`Filter by ${label}`}
                onClick={toggleDropdown}
            >
                <FaFilter />
            </button>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    {options.length > 0 ? (
                        options.map((option) => (
                            <label key={option}>
                                <input
                                    type="checkbox"
                                    checked={!selectedOptions.includes(option)}
                                    onChange={() => onFilterChange(option)}
                                />
                                {option}
                            </label>
                        ))
                    ) : (
                        <div>No options available</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;

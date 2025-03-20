import React, { useEffect, useRef, useState } from 'react'
import './MultiSelectDropdown.scss'

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
                <span className="arrow">{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
                <ul className="dropdown-list">
                    <li
                        key="all"
                        className={selectedValues.includes("all") ? "selected" : ""}
                        onClick={() => handleOptionClick("all")}
                    >
                        All
                    </li>
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

export default MultiSelectDropdown
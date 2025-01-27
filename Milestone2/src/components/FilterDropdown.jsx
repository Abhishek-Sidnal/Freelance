import React from 'react'
import { FaFilter } from 'react-icons/fa';

const FilterDropdown = ({ label, options, selectedOptions, onFilterChange }) => (
    <div className="dropdown-container">
        <button className="dropdown-toggle" aria-label={`Filter by ${label}`}>
            <FaFilter />
        </button>
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
    </div>
);

export default FilterDropdown
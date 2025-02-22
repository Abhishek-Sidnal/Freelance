import React, { useState } from "react";
// import "./MultiSelectDropdown.scss";

const MultiSelectDropdown = () => {

    const options=["suv","hatchback","sedan"]

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="multi-select-dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedOptions.length > 0
          ? selectedOptions.join(", ")
          : "Select Options"}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li
              key={index}
              className={`dropdown-item ${
                selectedOptions.includes(option) ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionClick(option)}
              />
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;

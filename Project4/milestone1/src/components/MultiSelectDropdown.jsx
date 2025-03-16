import React, { useState, useRef, useEffect } from "react";
import "./MultiSelectDropdown.scss";



const MultiSelectDropdown = ({ options = [
  { id: "all", label: "All" },
  { id: 1, label: "Option 1" },
  { id: 2, label: "Option 2" },
  { id: 3, label: "Option 3" },
  { id: 4, label: "Option 4" },
] }) => {
  const [selectedOptions, setSelectedOptions] = useState(["all"]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (id) => {
    if (id === "all") {
      setSelectedOptions(["all"]); // Select all when "All" is clicked
    } else {
      let updatedSelection = selectedOptions.includes(id)
        ? selectedOptions.filter((item) => item !== id)
        : [...selectedOptions.filter((item) => item !== "all"), id];

      if (updatedSelection.length === 0) {
        updatedSelection = ["all"]; // If none selected, select "All"
      } else if (updatedSelection.length === options.length - 1) {
        updatedSelection = ["all"]; // If all are selected, set to "All"
      }

      setSelectedOptions(updatedSelection);
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

  const selectedLabels =
    selectedOptions.includes("all") ? "All" : options
      .filter((opt) => selectedOptions.includes(opt.id))
      .map((opt) => opt.label)
      .join(", ");

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      {selectedOptions}
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedLabels}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li
              key={option.id}
              className={selectedOptions.includes(option.id) ? "selected" : ""}
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

export default MultiSelectDropdown;

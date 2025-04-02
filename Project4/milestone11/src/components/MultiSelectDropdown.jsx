import React, { useEffect, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import './MultiSelectDropdown.scss';

const MultiSelectDropdown = ({ options = [], selectedValues = [], onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Handle selection logic
  const handleOptionClick = (id) => {
    let updatedSelection;

    if (id === 'all') {
      // If "All" is selected, select all options and remove individual selections
      updatedSelection = selectedValues.includes('all') ? [] : ['all'];
    } else {
      // If an individual option is clicked, toggle its selection
      if (selectedValues.includes(id)) {
        updatedSelection = selectedValues.filter((item) => item !== id); // Deselect item
      } else {
        updatedSelection = [...selectedValues, id]; // Select item
      }

      // If any option is selected, deselect "All"
      updatedSelection = updatedSelection.filter((item) => item !== 'all');
    }

    // Pass the updated selection to the parent component
    onChange(updatedSelection);
  };

  // Handle clicks outside the dropdown to close it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoizing the selected labels
  const selectedLabels = React.useMemo(() => {
    if (selectedValues.includes('all')) {
      return 'All';
    }
    return selectedValues.length == 0 ? `Select ${label}` : selectedValues.length == 1 ? selectedValues[0] : "{multiple}";
  }, [selectedValues, label]);

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span className="selected-label" title={selectedLabels} >{selectedLabels}</span>
        <span className="arrow">{isOpen ? <FaAngleUp /> : <FaAngleDown />}</span>
      </div>

      {isOpen && (
        <ul className="dropdown-list">
          {/* "All" option */}
          <li
            key="all"
            className={selectedValues.includes('all') ? 'selected' : ''}
            onClick={() => handleOptionClick('all')}
          >
            All
          </li>
          {/* Individual options */}
          {options.map((option) => (
            <li
              key={option.id}
              className={selectedValues.includes(option.id) ? 'selected' : ''}
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

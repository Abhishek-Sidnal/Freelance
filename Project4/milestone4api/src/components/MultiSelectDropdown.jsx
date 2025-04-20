import React, { useEffect, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import './MultiSelectDropdown.scss';

const MultiSelectDropdown = ({ options = [], selectedValues = [], onChange, label }) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (id) => {
    let updatedSelection;

    if (id === 'all') {
      updatedSelection = selectedValues.includes('all') ? [] : ['all'];
    } else {
      if (selectedValues.includes(id)) {
        updatedSelection = selectedValues.filter((item) => item !== id);
      } else {
        updatedSelection = [...selectedValues, id];
      }

      updatedSelection = updatedSelection.filter((item) => item !== 'all');
    }

    onChange(updatedSelection);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedLabels = React.useMemo(() => {
    if (selectedValues.includes('all')) {
      return 'All';
    }

    if (selectedValues.length === 0) {
      return `Select ${label}`;
    }

    // Map selectedValues (IDs) to their labels
    const selectedOptionLabels = selectedValues
      .map((id) => {
        const option = options.find((opt) => opt.id === id);
        return option ? option.label : null;
      })
      .filter((label) => label !== null); // Filter out any nulls if no matching option was found

    return selectedOptionLabels.length === 1
      ? selectedOptionLabels[0]
      : "[multiple]";
  }, [selectedValues, options, label]);

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span className="selected-label" title={selectedLabels} >{selectedLabels}</span>
        <span className="arrow">{isOpen ? <FaAngleUp /> : <FaAngleDown />}</span>
      </div>

      {isOpen && (
        <ul className="dropdown-list">
          <li
            key="all"
            className={selectedValues.includes('all') ? 'selected' : ''}
            onClick={() => handleOptionClick('all')}
          >
            All
          </li>
          {options.map((option) => (
            <li
              key={option.id}
              className={selectedValues.includes(option.id) ? 'selected' : ''}
              onClick={() => handleOptionClick(option.id)}
              title={option.label}
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

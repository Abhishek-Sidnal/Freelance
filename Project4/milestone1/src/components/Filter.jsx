import React, { useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown"; // Import your MultiSelectDropdown component

// Filter component that contains both dropdowns
const Filter = () => {
  const [selectedC, setSelectedC] = useState(["all"]); // for c1, c2, c3, c4
  const [selectedW, setSelectedW] = useState(["all"]); // for w1, w2, w3, w4

  // Function to handle changes in the first dropdown (c1, c2, c3, c4)
  const handleCChange = (selectedValues) => {
    setSelectedC(selectedValues);
  };

  // Function to handle changes in the second dropdown (w1, w2, w3, w4)
  const handleWChange = (selectedValues) => {
    setSelectedW(selectedValues);
  };

  return (
    <div>
      {/* Filter Header */}
      <h3>Filter</h3>

      {/* First MultiSelect Dropdown (c1, c2, c3, c4) */}
      <div className="filter-dropdown">
        <label>Category:</label>
        <MultiSelectDropdown
          options={[
            { id: "all", label: "All" },
            { id: "c1", label: "c1" },
            { id: "c2", label: "c2" },
            { id: "c3", label: "c3" },
            { id: "c4", label: "c4" },
          ]}
          selectedOptions={selectedC}
          onSelect={handleCChange} // Passing the selected values from this dropdown
        />
      </div>

      {/* Second MultiSelect Dropdown (w1, w2, w3, w4) */}
      <div className="filter-dropdown">
        <label>Ways to Buy:</label>
        <MultiSelectDropdown
          options={[
            { id: "all", label: "All" },
            { id: "w1", label: "w1" },
            { id: "w2", label: "w2" },
            { id: "w3", label: "w3" },
            { id: "w4", label: "w4" },
          ]}
          selectedOptions={selectedW}
          onSelect={handleWChange} // Passing the selected values from this dropdown
        />
      </div>

      {/* Displaying selected filter options */}
      <div>
        <p>Selected Categories: {selectedC.join(", ")}</p>
        <p>Selected Ways to Buy: {selectedW.join(", ")}</p>
      </div>
    </div>
  );
};

export default Filter;

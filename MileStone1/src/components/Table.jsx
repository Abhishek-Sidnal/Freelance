import React, { useState } from "react";
import { countries } from "../data";

const Table = () => {
  const [expandedRows, setExpandedRows] = useState([]); 
  const [expandAll, setExpandAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleRow = (id) => {
    if (expandAll) return;

    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
    if (!expandAll) {
      // Expand all rows
      setExpandedRows(countries.map((country) => country.id));
    } else {
      // Collapse all rows
      setExpandedRows([]);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCountries =
    searchQuery.length < 3
      ? countries
      : countries.filter((country) => {
          const countryMatch = country.name.toLowerCase().includes(searchQuery);
          const stateMatch = country.states.some((state) =>
            state.toLowerCase().includes(searchQuery)
          );
          return countryMatch || stateMatch;
        });

  return (
    <div className="w-full flex flex-col items-center p-4 min-h-screen gap-2 sm:gap-4">
      {/* Header with Expand All and Search */}
      <div className="mb-4 w-full flex flex-col sm:flex-row items-center gap-2">
        <button
          onClick={toggleExpandAll}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-nowrap w-full sm:w-fit"
        >
          {expandAll ? "Collapse All" : "Expand All"}
        </button>
        <input
          type="text"
          placeholder="Search by country or state"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-300"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="table-auto border-collapse text-nowrap border w-full text-sm text-gray-300 shadow-lg">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Country</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Population</th>
              <th className="border border-gray-300 px-4 py-2 text-left">State</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center border border-gray-300 px-4 py-2 text-red-500"
                >
                  No matches found.
                </td>
              </tr>
            ) : (
              filteredCountries.map((country, index) => (
                <React.Fragment key={country.id}>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{country.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {country.population.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {expandAll || expandedRows.includes(country.id) ? (
                        <span className="flex items-center">
                          <em>States listed below</em>
                          {!expandAll && (
                            <button
                              className="ml-auto underline cursor-pointer"
                              onClick={() => toggleRow(country.id)}
                            >
                              Collapse View
                            </button>
                          )}
                        </span>
                      ) : (
                        <button
                          aria-label={`Expand View for ${country.name}`}
                          className="underline cursor-pointer"
                          onClick={() => toggleRow(country.id)}
                        >
                          Click to View
                        </button>
                      )}
                    </td>
                  </tr>
                  {(expandAll || expandedRows.includes(country.id)) &&
                    country.states.map((state, stateIndex) => (
                      <tr key={`${country.id}-${stateIndex}`}>
                        <td className="border border-gray-300 px-4 py-2"></td>
                        <td className="border border-gray-300 px-4 py-2"></td>
                        <td className="border border-gray-300 px-4 py-2"></td>
                        <td className="border border-gray-300 px-4 py-2">{state}</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

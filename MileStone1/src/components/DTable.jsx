import React, { useContext } from "react";
import FilterDropdown from "./FilterDropdown";
import TableRow from "./TableRow";
import Modal from "./Modal";
import { DTableContext } from "../context/DTableContext";


const DTable = () => {
    const {
        disabledItems,
        expandedRows,
        expandAll,
        searchQuery,
        modalData,
        filters,
        countries,
        modalInputs,
        toggleRow,
        toggleExpandAll,
        handleSearch,
        handleActionClick,
        handleModalInputChange,
        handleAddOrUpdateState,
        closeModal,
        toggleFilter,
        filteredCountries,
    } = useContext(DTableContext);

    return (
        <>
            <div className="dtable-header">
                <button onClick={toggleExpandAll} className="expand-button">
                    {expandAll ? "Collapse All" : "Expand All"}
                </button>
                <input
                    type="text"
                    placeholder="Search by country or state"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>

            <div className="dtable-container">
                <table className="dtable" border="1">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Action Type</th>
                            <th>
                                Country
                                <FilterDropdown
                                    items={countries.map((c) => c.Country_Name)}
                                    filteredItems={filters.countries}
                                    disabledItems={disabledItems("countries")}
                                    onToggleItem={(item) => toggleFilter("countries", item)}
                                    title="Countries"
                                />
                            </th>
                            <th>
                                State{" "}
                                <FilterDropdown
                                    items={countries.flatMap((c) => c.states.map((s) => s.name))}
                                    filteredItems={filters.states}
                                    disabledItems={disabledItems("states")}
                                    onToggleItem={(item) => toggleFilter("states", item)}
                                    title="States"
                                />
                            </th>
                            <th>
                                Capital{" "}
                                <FilterDropdown
                                    items={countries.flatMap((c) => c.states.map((s) => s.capital))}
                                    filteredItems={filters.capitals}
                                    disabledItems={disabledItems("capitals")}
                                    onToggleItem={(item) => toggleFilter("capitals", item)}
                                    title="Capitals"
                                />
                            </th>
                            <th>
                                Population{" "}
                                <FilterDropdown
                                    items={countries.flatMap((c) => c.states.map((s) => s.population))}
                                    filteredItems={filters.populations}
                                    disabledItems={disabledItems("populations")}
                                    onToggleItem={(item) => toggleFilter("populations", item)}
                                    title="Population"
                                />
                            </th>
                            <th>
                                HDI{" "}
                                <FilterDropdown
                                    items={countries.flatMap((c) => c.states.map((s) => s.hdi))}
                                    filteredItems={filters.hdis}
                                    disabledItems={disabledItems("hdis")}
                                    onToggleItem={(item) => toggleFilter("hdis", item)}
                                    title="HDI"
                                />

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCountries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-matches">
                                    No matches found.
                                </td>
                            </tr>
                        ) : (
                            filteredCountries.map((country, index) => (
                                <TableRow
                                    expandedRows={expandedRows}
                                    key={index}
                                    index={index}
                                    country={country}
                                    handleActionClick={handleActionClick}
                                    toggleRow={toggleRow}
                                    expandAll={expandAll}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            {modalData && (
                <Modal
                    isVisible={!!modalData}
                    modalData={modalData}
                    modalInputs={modalInputs}
                    onInputChange={handleModalInputChange}
                    onSubmit={() =>
                        handleAddOrUpdateState(
                            modalInputs.stateName,
                            modalInputs.capital,
                            modalInputs.population,
                            modalInputs.hdi
                        )
                    }
                    onClose={closeModal}
                />
            )}

        </>
    );
};

export default DTable;

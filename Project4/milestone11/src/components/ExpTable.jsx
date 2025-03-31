import React, { useState, useMemo } from "react";
import * as XLSX from 'xlsx';
import MultiSelectDropdown from "./MultiSelectDropdown";
import { bagStatuses, filter1Options, filter2Options } from "../data";

// Function to generate last 8 days 
const generateLast8Days = () => {
    const dates = [];
    for (let i = 0; i < 8; i++) {
        let date = new Date();
        date.setDate(date.getDate() - i);
        dates.push({
            id: date.toISOString().split("T")[0],
            label: date.toLocaleDateString("en-US"),
        });
    }
    return dates;
};

const Dtable = () => {
    const defaultDate = generateLast8Days()[0].id;
    const [selectedCountries, setSelectedCountries] = useState(["all"]);
    const [selectedWaysToBuy, setSelectedWaysToBuy] = useState(["all"]);
    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [dates, setDates] = useState(generateLast8Days());
    const [appliedFilters, setAppliedFilters] = useState({
        countries: ["c1", "c2", "c3", "c4"],
        ways: ["w1", "w2", "w3", "w4"],
        date: defaultDate,
    });

    // State to toggle columns
    const [toggleColumn, setToggleColumn] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const filteredDates = dates.filter((date) => date.id <= appliedFilters.date);

    // Export to Excel function
    const exportToExcel = () => {
        setIsExporting(true);
        try {
            // Prepare data for export
            const exportData = [];
    
            // Add multi-row header
            exportData.push([
                'Country', 'Ways to Buy', 'As of Date',
                ...filteredDates.flatMap(() => toggleColumn 
                    ? ['GBI', '▲(AOS-GBI)', 'AOS', '▲(AOS-FSI)', 'FSI']
                    : ['GBI', 'AOS', 'FSI']
                )
            ]);
    
            // Add selected filter information
            exportData.push([
                selectedCountries.includes('all') ? 'All' : 
                    (selectedCountries.length === 1 ? selectedCountries[0] : 'Multiple'),
                selectedWaysToBuy.includes('all') ? 'All' : 
                    (selectedWaysToBuy.length === 1 ? selectedWaysToBuy[0] : 'Multiple'),
                selectedDate,
                ...filteredDates.flatMap(() => toggleColumn 
                    ? ['', '', '', '', '']
                    : ['', '', '']
                )
            ]);
    
            // Add header row
            exportData.push([
                'Country', 'Ways to Buy', 'Bags Status',
                ...filteredDates.flatMap(date => 
                    toggleColumn 
                    ? [`Till Day - ${date.label}`, '', '', '', '']
                    : [`Till Day - ${date.label}`, '', '']
                )
            ]);
    
            // Generate data rows
            const rows = [];
            const summaryData = {};
    
            // Check if multiple countries AND ways selected
            const isMultipleCountries = appliedFilters.countries.length > 1;
            const isMultipleWays = appliedFilters.ways.length > 1;
    
            // Initialize summary data structure
            if (isMultipleCountries && isMultipleWays) {
                filteredDates.forEach((date) => {
                    summaryData[date.id] = {};
                    bagStatuses.forEach((status) => {
                        summaryData[date.id][status] = { GBI: 0, AOS: 0, FSI: 0 };
                    });
                });
            }
    
            // Generate detailed data rows
            appliedFilters.countries.forEach((country) => {
                appliedFilters.ways.forEach((way) => {
                    bagStatuses.forEach((status) => {
                        const rowData = [country, way, status];
    
                        // Add data for each date
                        filteredDates.forEach((date) => {
                            const GBI = Math.round(Math.random() * 10000);
                            const AOS = Math.round(Math.random() * 10000);
                            const FSI = Math.round(Math.random() * 10000);
    
                            // Accumulate for summary if multiple countries and ways
                            if (isMultipleCountries && isMultipleWays) {
                                summaryData[date.id][status].GBI += GBI;
                                summaryData[date.id][status].AOS += AOS;
                                summaryData[date.id][status].FSI += FSI;
                            }
    
                            // Add data for the date
                            if (toggleColumn) {
                                const AOS_GBI = AOS - GBI;
                                const AOS_FSI = AOS - FSI;
                                rowData.push(GBI, AOS_GBI, AOS, AOS_FSI, FSI);
                            } else {
                                rowData.push(GBI, AOS, FSI);
                            }
                        });
    
                        exportData.push(rowData);
                    });
                });
            });
    
            // Add summary row if applicable
            if (isMultipleCountries && isMultipleWays) {
                const summaryRow = ['Multiple', 'Multiple', 'Summary'];
    
                filteredDates.forEach((date) => {
                    bagStatuses.forEach((status) => {
                        const { GBI, AOS, FSI } = summaryData[date.id][status];
                        
                        if (toggleColumn) {
                            const AOS_GBI = AOS - GBI;
                            const AOS_FSI = AOS - FSI;
                            summaryRow.push(GBI, AOS_GBI, AOS, AOS_FSI, FSI);
                        } else {
                            summaryRow.push(GBI, AOS, FSI);
                        }
                    });
                });
    
                exportData.push(summaryRow);
            }
    
            // Create worksheet
            const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    
            // Adjust column widths
            worksheet['!cols'] = [
                { wch: 15 },   // Country
                { wch: 15 },   // Ways to Buy
                { wch: 20 },   // Bags Status
                ...filteredDates.flatMap(() => 
                    toggleColumn 
                    ? [{ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }]
                    : [{ wch: 10 }, { wch: 10 }, { wch: 10 }]
                )
            ];
    
            // Create workbook and add worksheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
            // Generate Excel file
            XLSX.writeFile(workbook, `Table_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error("Export to Excel failed:", error);
            alert("Failed to export to Excel. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const applyFilters = () => {
        setAppliedFilters({
            countries: selectedCountries.includes("all") ? ["c1", "c2", "c3", "c4"] : selectedCountries,
            ways: selectedWaysToBuy.includes("all") ? ["w1", "w2", "w3", "w4"] : selectedWaysToBuy,
            date: selectedDate,
        });
    };

    const generateRows = useMemo(() => {
        const rows = [];
        const summaryData = {};

        // Check if multiple countries AND ways selected
        const isMultipleCountries = appliedFilters.countries.length > 1;
        const isMultipleWays = appliedFilters.ways.length > 1;

        // Initialize summary data structure
        if (isMultipleCountries && isMultipleWays) {
            filteredDates.forEach((date) => {
                summaryData[date.id] = {};
                bagStatuses.forEach((status) => {
                    summaryData[date.id][status] = { GBI: 0, AOS: 0, FSI: 0 };
                });
            });
        }

        appliedFilters.countries.forEach((country) => {
            appliedFilters.ways.forEach((way) => {
                rows.push(
                    <tr key={`group-${country}-${way}`}>
                        <td colSpan="3" className="mainHeader">
                            <table border="1">
                                <tbody>
                                    {bagStatuses.map((status, index) => (
                                        <tr key={`${country}-${way}-${status}`}>
                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="bodyHeader">
                                                    {country}
                                                </td>
                                            )}
                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="bodyHeader">
                                                    {way}
                                                </td>
                                            )}
                                            <td
                                                className={`bodyHeader ${status === "Total Bags Created" ||
                                                    status === "Total Bags Deleted" ||
                                                    status === "Total Bags Ordered"
                                                    ? "blueHeader"
                                                    : status === "Open Bags"
                                                        ? "lightGreenHeader"
                                                        : ""
                                                    }`}
                                            >
                                                {status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>

                        {filteredDates.map((date) => (
                            <td colSpan="3" key={`${country}-${way}-${date.id}`}>
                                <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                        {bagStatuses.map((status) => {
                                            const GBI = Math.round(Math.random() * 10000);
                                            const AOS = Math.round(Math.random() * 10000);
                                            const FSI = Math.round(Math.random() * 10000);

                                            const AOS_GBI = toggleColumn ? AOS - GBI : null;
                                            const AOS_FSI = toggleColumn ? AOS - FSI : null;

                                            // Accumulate for summary
                                            if (isMultipleCountries && isMultipleWays) {
                                                summaryData[date.id][status].GBI += GBI;
                                                summaryData[date.id][status].AOS += AOS;
                                                summaryData[date.id][status].FSI += FSI;
                                            }

                                            return (
                                                <tr
                                                    key={`${country}-${way}-${status}-data-${date.id}`}
                                                    className={`bodyHeader ${status === "Total Bags Created" ||
                                                        status === "Total Bags Deleted" ||
                                                        status === "Total Bags Ordered"
                                                        ? "blueHeader"
                                                        : status === "Open Bags"
                                                            ? "lightGreenHeader"
                                                            : ""
                                                        }`}
                                                >
                                                    <td>{GBI}</td>
                                                    {toggleColumn && <td>{AOS_GBI}</td>}
                                                    <td>{AOS}</td>
                                                    {toggleColumn && <td>{AOS_FSI}</td>}
                                                    <td>{FSI}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </td>
                        ))}
                    </tr>
                );
            });
        });

        // Insert summary row at the top
        if (isMultipleCountries && isMultipleWays) {
            const summaryRow = (
                <tr key="summary-row">
                    <td colSpan="3" className="mainHeader">
                        <table border="1">
                            <tbody>
                                {bagStatuses.map((status, index) => (
                                    <tr key={`summary-${status}`}>
                                        {index === 0 && (
                                            <td rowSpan={bagStatuses.length} className="bodyHeader">
                                                Multiple
                                            </td>
                                        )}
                                        {index === 0 && (
                                            <td rowSpan={bagStatuses.length} className="bodyHeader">
                                                Multiple
                                            </td>
                                        )}
                                        <td className={`bodyHeader ${status.includes("Total") ? "blueHeader" : status === "Open Bags" ? "lightGreenHeader" : ""}`}>
                                            {status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>
                    {filteredDates.map((date) => (
                        <td colSpan="3" key={`summary-data-${date.id}`}>
                            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                    {bagStatuses.map((status) => {
                                        const { GBI, AOS, FSI } = summaryData[date.id][status];
                                        const AOS_GBI = toggleColumn ? AOS - GBI : null;
                                        const AOS_FSI = toggleColumn ? AOS - FSI : null;

                                        return (
                                            <tr
                                                key={`summary-${status}-${date.id}`}
                                                className={`bodyHeader ${status.includes("Total") ? "blueHeader" : status === "Open Bags" ? "lightGreenHeader" : ""}`}
                                            >
                                                <td>{GBI}</td>
                                                {toggleColumn && <td>{AOS_GBI}</td>}
                                                <td>{AOS}</td>
                                                {toggleColumn && <td>{AOS_FSI}</td>}
                                                <td>{FSI}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </td>
                    ))}
                </tr>
            );

            // Add it at the start of rows
            rows.unshift(summaryRow);
        }

        return rows;
    }, [appliedFilters, filteredDates, toggleColumn]);

    const renderSelectionWithTooltip = (selectedItems, type) => {
        if (selectedItems.includes("all")) {
            return <span>All</span>;
        }
        if (selectedItems.length === 1) {
            return <span>{selectedItems[0]}</span>;
        }
        return (
            <span
                className="multiple-selection"
                data-tooltip={selectedItems.join(", ")} // This is the tooltip content
                style={{ position: "relative", cursor: "pointer" }}
            >
                Multiple
            </span>
        );
    };

    return (
        <div className="container">
            {/* Filter  */}
            <div className="filter-header">
                <div className="filter">
                    <label htmlFor="">Country</label>
                    <MultiSelectDropdown
                        options={filter1Options}
                        selectedValues={selectedCountries}
                        onChange={setSelectedCountries}
                        label="Country"
                    />
                </div>

                <div className="filter">
                    <label htmlFor="">Ways to Buy</label>
                    <MultiSelectDropdown
                        options={filter2Options}
                        selectedValues={selectedWaysToBuy}
                        onChange={setSelectedWaysToBuy}
                        label="Ways to Buy"
                    />
                </div>

                <div className="filter">
                    <label htmlFor="">As of Date</label>
                    <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                        {dates.map((date) => (
                            <option key={date.id} value={date.id}>
                                {date.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Toggle Button */}
                <div className="toggle-container">
                    <label>Toggle Column</label>
                    <button onClick={() => setToggleColumn(!toggleColumn)}>
                        {toggleColumn ? "Disable ▲ Columns" : "Enable ▲ Columns"}
                    </button>
                </div>

                {/* Export Button with Loading State */}
                <button 
                    onClick={exportToExcel} 
                    disabled={isExporting}
                >
                    {isExporting ? "Exporting..." : "Export to Excel"}
                </button>

                <button onClick={applyFilters}>Apply</button>
            </div>

            {/* Table */}
            <div className="table">
                <table className="">
                    <thead>
                        <tr>
                            <th colSpan="3" className="mainHeader">
                                <table border="1">
                                    <tbody>
                                        <tr>
                                            <td>Country</td>
                                            <td>Ways to Buy</td>
                                            <td>As of Date</td>
                                        </tr>
                                        <tr>
                                            <td className="headerHighlight">
                                                {renderSelectionWithTooltip(selectedCountries, "Country")}
                                            </td>
                                            <td className="headerHighlight">
                                                {renderSelectionWithTooltip(selectedWaysToBuy, "Ways to Buy")}
                                            </td>
                                            <td className="headerHighlight">{selectedDate}</td>
                                        </tr>

                                        <tr>
                                            <th className="blueHeader">Country</th>
                                            <th className="blueHeader">Ways to Buy</th>
                                            <th className="blueHeader">Bags Status</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </th>

                            {filteredDates.map((date, index) => (
                                <th key={date.id} colSpan="3">
                                    <table border="1" className="tbody">
                                        <tbody>
                                            <tr>
                                                <td colSpan={toggleColumn ? "5" : "3"} >{`Till Day  ${8 - index} (EOD) - ${date.label}`}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={toggleColumn ? "5" : "3"}>{selectedDate} - {date.label}</td>
                                            </tr>
                                            <tr>
                                                <th className="blueHeader">GBI</th>

                                                {toggleColumn && (
                                                    <th className="blueHeader">▲(AOS-GBI)</th>
                                                )}

                                                <th className="blueHeader">AOS</th>

                                                {toggleColumn && (
                                                    <th className="blueHeader">▲(AOS-FSI)</th>
                                                )}

                                                <th className="blueHeader">FSI</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {generateRows}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dtable;
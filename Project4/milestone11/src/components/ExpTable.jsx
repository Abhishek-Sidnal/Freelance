import React, { useState, useMemo, useRef } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { bagStatuses, filter1Options, filter2Options } from "../data";
import * as XLSX from "xlsx";
import html2pdf from 'html2pdf.js';
import { PiSwapLight } from "react-icons/pi";
import { BiExport } from "react-icons/bi";
import { MdLocalPrintshop } from "react-icons/md";

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
    const tableRef = useRef(null);
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

    const filteredDates = dates.filter((date) => date.id <= appliedFilters.date);

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
                        <td colSpan="3" className="sticky-header">
                            <table border="1" className="inner-table" >
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
                            <td colSpan="3" key={`${country}-${way}-${date.id}`}  >
                                <table border="1" className="inner-table" >
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
                    <td colSpan="3" className="sticky-header">
                        <table border="1" className="inner-table" >
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
                                        <td className={`bodyHeader ${status.includes("Total") ? "blueHeader" : status === "Open Bags" ? "lightGreenHeader" : ""}`} >
                                            {status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>
                    {filteredDates.map((date) => (
                        <td colSpan="3" key={`summary-data-${date.id}`} className="" >
                            <table border="1" className="inner-table" >
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

    const exportToExcel = () => {
        // Prepare the data for export
        const exportData = [];
        // Add date headers
        const headerRow1 = ['Country', 'Ways to Buy', 'As of Date']
        const headerRow2 = [
            renderSelectionWithTooltip(selectedCountries, "Country").props.children,
            renderSelectionWithTooltip(selectedWaysToBuy, "Ways to Buy").props.children,
            selectedDate
        ];
        const headerRow3 = ['Country', 'Ways to Buy', 'Bags Status']
        const dateHeaders = ['', '', ''];
        const subDateHeaders = ['', '', ''];
        const columnHeaders = ['', '', ''];

        filteredDates.forEach((date, index) => {
            const dayNumber = 8 - index;

            // Add date headers dynamically, like "Till Day 8 (EOD) - 2025-03-28"
            dateHeaders.push(`Till Day ${dayNumber} (EOD) - ${date.label}`);
            if (toggleColumn) {
                dateHeaders.push('', '', '', '');  // Add extra columns for toggle
            } else {
                dateHeaders.push('', '');  // Add only two columns without toggle
            }

            // Add sub-date headers like "2025-03-28 - 2025-03-28"
            subDateHeaders.push(`${selectedDate} - ${date.label}`);
            if (toggleColumn) {
                subDateHeaders.push('', '', '', '');
            } else {
                subDateHeaders.push('', '');
            }

            // Add column headers (GBI, AOS, FSI, possibly difference columns)
            columnHeaders.push('GBI');
            columnHeaders.push('AOS');
            columnHeaders.push('FSI');
            if (toggleColumn) {
                columnHeaders.push('▲(AOS-GBI)');
                columnHeaders.push('▲(AOS-FSI)');
            }
        });

        // Add date headers, sub-date headers, and column headers to exportData
        exportData.push(headerRow1.concat(dateHeaders.slice(3)));
        exportData.push(headerRow2.concat(subDateHeaders.slice(3)));
        exportData.push(headerRow3.concat(columnHeaders.slice(3)));

        // Calculate summary data if multiple selections
        const isMultipleCountries = appliedFilters.countries.length > 1;
        const isMultipleWays = appliedFilters.ways.length > 1;
        const summaryData = {};

        if (isMultipleCountries && isMultipleWays) {
            filteredDates.forEach((date) => {
                summaryData[date.id] = {};
                bagStatuses.forEach((status) => {
                    summaryData[date.id][status] = { GBI: 0, AOS: 0, FSI: 0 };
                });
            });

            // Pre-calculate summary data for multiple countries and ways
            appliedFilters.countries.forEach(country => {
                appliedFilters.ways.forEach(way => {
                    bagStatuses.forEach(status => {
                        filteredDates.forEach(date => {
                            const GBI = Math.round(Math.random() * 10000);
                            const AOS = Math.round(Math.random() * 10000);
                            const FSI = Math.round(Math.random() * 10000);

                            summaryData[date.id][status].GBI += GBI;
                            summaryData[date.id][status].AOS += AOS;
                            summaryData[date.id][status].FSI += FSI;
                        });
                    });
                });
            });

            // Add summary rows first
            bagStatuses.forEach((status) => {
                const row = ['Multiple', 'Multiple', status];
                filteredDates.forEach(date => {
                    const { GBI, AOS, FSI } = summaryData[date.id][status];
                    row.push(GBI, AOS, FSI);

                    // If toggle is enabled, add the difference columns
                    if (toggleColumn) {
                        row.push(AOS - GBI);  // AOS-GBI
                        row.push(AOS - FSI);  // AOS-FSI
                    }
                });
                exportData.push(row);
            });
        }

        // Add regular data rows
        appliedFilters.countries.forEach(country => {
            appliedFilters.ways.forEach(way => {
                bagStatuses.forEach(status => {
                    const row = [country, way, status];
                    filteredDates.forEach(date => {
                        const GBI = Math.round(Math.random() * 10000);
                        const AOS = Math.round(Math.random() * 10000);
                        const FSI = Math.round(Math.random() * 10000);

                        row.push(GBI, AOS, FSI);

                        // If toggle is enabled, add the difference columns
                        if (toggleColumn) {
                            row.push(AOS - GBI);  // AOS-GBI
                            row.push(AOS - FSI);  // AOS-FSI
                        }
                    });
                    exportData.push(row);
                });
            });
        });

        // Create workbook and add the data
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(exportData);
        console.log(exportData);


        // Add some styling to merged cells (for date headers, etc.)
        const merge = [
            // Merge date headers
            ...filteredDates.map((_, index) => ({
                s: { r: 0, c: 3 + (index * (toggleColumn ? 5 : 3)) },
                e: { r: 0, c: 3 + (index * (toggleColumn ? 5 : 3)) + (toggleColumn ? 4 : 2) }
            })),
            // Merge sub-date headers
            ...filteredDates.map((_, index) => ({
                s: { r: 1, c: 3 + (index * (toggleColumn ? 5 : 3)) },
                e: { r: 1, c: 3 + (index * (toggleColumn ? 5 : 3)) + (toggleColumn ? 4 : 2) }
            }))
        ];

        ws['!merges'] = merge;

        XLSX.utils.book_append_sheet(wb, ws, "Table Data");

        // Save the file
        XLSX.writeFile(wb, "table-data.xlsx");
    };


    const exportToPDF = () => {
        const element = tableRef.current;
        const opt = {
            margin: 1,
            filename: 'table-data.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                logging: true,
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a2',
                orientation: 'landscape'
            }
        };

        html2pdf().set(opt).from(element).save();
    };

    const printTable = () => {
        const printWindow = window.open("", "_blank");
    
        // Grab the current styles from the document
        const styles = Array.from(document.styleSheets)
            .map(sheet => {
                try {
                    return Array.from(sheet.cssRules || [])
                        .map(rule => rule.cssText)
                        .join("\n");
                } catch (e) {
                    return ""; // If there's a security error, return an empty string
                }
            })
            .join("\n");
    
        // Write the HTML content into the new print window
        printWindow.document.write("<html><head><title>Print Table</title>");
        printWindow.document.write("<style>" + styles + "</style>"); // Embed the styles
        printWindow.document.write("</head><body>");
        printWindow.document.write(tableRef.current.outerHTML); // Insert the table content
        printWindow.document.write("</body></html>");
        printWindow.document.close();
    
        // Wait for the document to be fully loaded before printing
        printWindow.onload = () => {
            printWindow.print(); // Trigger the print dialog
        };
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

                <button onClick={applyFilters}>Apply</button>


                <div className="export">
                    <button onClick={() => setToggleColumn(!toggleColumn)}
                        className={`${toggleColumn ? "active-Toggle" : ""} btn`}
                    >
                        <PiSwapLight />
                    </button>
                    <button onClick={exportToExcel}
                        className="btn"
                    > <BiExport /> </button>
                    <button onClick={printTable} className="btn"> <MdLocalPrintshop />  </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-container" ref={tableRef}>
                <table className="main-table">
                    <thead>
                        <tr>
                            <th colSpan="3" className="table-header sticky-header" id="table-header" style={{ width: "100%", maxWidth: "400px" }} >
                                <table border="1" className="inner-table" >
                                    <thead>
                                        <tr>
                                            <th>Country</th>
                                            <th>Ways to Buy</th>
                                            <th>As of Date</th>
                                        </tr>
                                        <tr>
                                            <th className="headerHighlight">
                                                {renderSelectionWithTooltip(selectedCountries, "Country")}
                                            </th>
                                            <th className="headerHighlight">
                                                {renderSelectionWithTooltip(selectedWaysToBuy, "Ways to Buy")}
                                            </th>
                                            <th className="headerHighlight">{selectedDate}</th>
                                        </tr>

                                        <tr>
                                            <th className="blueHeader">Country</th>
                                            <th className="blueHeader">Ways to Buy</th>
                                            <th className="blueHeader">Bags Status</th>
                                        </tr>
                                    </thead>
                                </table>
                            </th>

                            {filteredDates.map((date, index) => (
                                <th key={date.id} colSpan="3" className="table-header EOD-Header" >
                                    <table border="1" className="inner-table">
                                        <thead>
                                            <tr>
                                                <th colSpan={toggleColumn ? "5" : "3"} >{`Till Day  ${8 - index} (EOD) - ${date.label}`}</th>
                                            </tr>
                                            <tr>
                                                <th colSpan={toggleColumn ? "5" : "3"}>{selectedDate} - {date.label}</th>
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
                                        </thead>
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
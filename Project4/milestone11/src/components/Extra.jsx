import React, { useState, useMemo, useRef } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { bagStatuses, filter1Options, filter2Options, generateLast8Days } from "../data";
import * as XLSX from "xlsx";
import html2pdf from 'html2pdf.js';
import { PiSwapLight } from "react-icons/pi";
import { BiExport } from "react-icons/bi";
import { MdLocalPrintshop } from "react-icons/md";
import { LuTriangle } from "react-icons/lu";

const Dtable = () => {
    const tableRef = useRef(null);
    const defaultDate = generateLast8Days()[0].id;
    const [selectedCountries, setSelectedCountries] = useState(["all"]);
    const [selectedWaysToBuy, setSelectedWaysToBuy] = useState(["all"]);
    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [dates, setDates] = useState(generateLast8Days());
    const [appliedFilters, setAppliedFilters] = useState({
        countries: filter1Options.map(country => country.label),
        ways: filter1Options.map(wob => wob.label),
        date: defaultDate,
    });

    // State to toggle columns
    const [toggleColumn, setToggleColumn] = useState(false);

    const filteredDates = dates.filter((date) => date.id <= appliedFilters.date);

    const applyFilters = () => {
        setAppliedFilters({
            countries: selectedCountries.includes("all") ? filter1Options.map(country => country.label) : selectedCountries,
            ways: selectedWaysToBuy.includes("all") ? filter1Options.map(wob => wob.label) : selectedWaysToBuy,
            date: selectedDate,
        });
    };

    const generateRows = useMemo(() => {
        const rows = [];
        const summaryData = {};
    
        const isMultipleCountries = appliedFilters.countries.length > 1;
        const isMultipleWays = appliedFilters.ways.length > 1;
    
        // Initialize summary data structure if necessary for multiple countries and ways
        if ((isMultipleCountries && !isMultipleWays) || (!isMultipleCountries && isMultipleWays) || (isMultipleCountries && isMultipleWays)) {
            filteredDates.forEach((date) => {
                summaryData[date.id] = {};
                bagStatuses.forEach((status) => {
                    summaryData[date.id][status] = { GBI: 0, AOS: 0, FSI: 0 };
                });
            });
        }
    
        // Generating rows for each combination of country and way
        appliedFilters.countries.forEach((country) => {
            appliedFilters.ways.forEach((way) => {
                rows.push(
                    <tr key={`group-${country}-${way}`} className="data-group-row">
                        <td colSpan="3" className="group-cell">
                            <table border="1" className="inner-table">
                                <tbody>
                                    {bagStatuses.map((status, index) => (
                                        <tr key={`${country}-${way}-${status}`} className="bag-status-row">
                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="country-cell">
                                                    {country}
                                                </td>
                                            )}
                                            {index === 0 && (
                                                <td rowSpan={bagStatuses.length} className="way-cell">
                                                    {way}
                                                </td>
                                            )}
                                            <td className={`bodyHeader ${status === "Total Bags Created" ||
                                                status === "Total Bags Deleted" ||
                                                status === "Total Bags Ordered"
                                                ? "blue-header"
                                                : status === "Open Bags"
                                                    ? "lightGreenHeader"
                                                    : ""
                                                }`}>{status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
    
                        {filteredDates.map((date) => (
                            <td colSpan="3" key={`${country}-${way}-${date.id}`} className="summary-date-cell">
                                <table border="1" className="inner-table">
                                    <tbody>
                                        {bagStatuses.map((status) => {
                                            const GBI = Math.round(Math.random() * 10000);
                                            const AOS = Math.round(Math.random() * 10000);
                                            const FSI = Math.round(Math.random() * 10000);
                                            const AOS_GBI = toggleColumn ? AOS - GBI : null;
                                            const AOS_FSI = toggleColumn ? AOS - FSI : null;
    
                                            // Accumulate for summary
                                            if ((isMultipleCountries && !isMultipleWays) || (!isMultipleCountries && isMultipleWays) || (isMultipleCountries && isMultipleWays)) {
                                                summaryData[date.id][status].GBI += GBI;
                                                summaryData[date.id][status].AOS += AOS;
                                                summaryData[date.id][status].FSI += FSI;
                                            }
    
                                            return (
                                                <tr key={`${country}-${way}-${status}-data-${date.id}`}
                                                    className={`bodyHeader ${status === "Total Bags Created" ||
                                                        status === "Total Bags Deleted" ||
                                                        status === "Total Bags Ordered"
                                                        ? "blue-header"
                                                        : status === "Open Bags"
                                                            ? "lightGreenHeader"
                                                            : ""
                                                    }`}>
                                                    <td className="gbi-cell">{GBI}</td>
                                                    {toggleColumn && <td className="aos-gbi-cell">{AOS_GBI}</td>}
                                                    <td className="aos-cell">{AOS}</td>
                                                    {toggleColumn && <td className="aos-fsi-cell">{AOS_FSI}</td>}
                                                    <td className="fsi-cell">{FSI}</td>
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
    
        // Summary Row: Add the summary row at the top if multiple countries and/or ways are selected
        if ((isMultipleCountries && !isMultipleWays) || (!isMultipleCountries && isMultipleWays) || (isMultipleCountries && isMultipleWays)) {
            const summaryRow = (
                <tr key="summary-row" className="summary-row">
                    <td colSpan="3" className="summary-cell">
                        <table border="1" className="inner-table">
                            <tbody>
                                {bagStatuses.map((status, index) => (
                                    <tr key={`summary-${status}`} className="summary-status-row">
                                        {index === 0 && (
                                            <td rowSpan={bagStatuses.length} className="country-cell">
                                                [Multiple]
                                            </td>
                                        )}
                                        {index === 0 && (
                                            <td rowSpan={bagStatuses.length} className="summary-way-cell">
                                                [Multiple]
                                            </td>
                                        )}
                                        <td className={`bodyHeader ${status === "Total Bags Created" ||
                                            status === "Total Bags Deleted" ||
                                            status === "Total Bags Ordered"
                                            ? "blue-header"
                                            : status === "Open Bags"
                                                ? "lightGreenHeader"
                                                : ""
                                        }`}>{status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>
                    {filteredDates.map((date) => (
                        <td colSpan="3" key={`summary-data-${date.id}`} className="summary-date-cell">
                            <table border="1" className="inner-table">
                                <tbody>
                                    {bagStatuses.map((status) => {
                                        const { GBI, AOS, FSI } = summaryData[date.id][status];
                                        const AOS_GBI = toggleColumn ? AOS - GBI : null;
                                        const AOS_FSI = toggleColumn ? AOS - FSI : null;
    
                                        return (
                                            <tr key={`summary-${status}-${date.id}`}
                                                className={`bodyHeader ${status === "Total Bags Created" ||
                                                    status === "Total Bags Deleted" ||
                                                    status === "Total Bags Ordered"
                                                    ? "blue-header"
                                                    : status === "Open Bags"
                                                        ? "lightGreenHeader"
                                                        : ""
                                                }`}>
                                                <td className="summary-gbi-cell">{GBI}</td>
                                                {toggleColumn && <td className="summary-aos-gbi-cell">{AOS_GBI}</td>}
                                                <td className="summary-aos-cell">{AOS}</td>
                                                {toggleColumn && <td className="summary-aos-fsi-cell">{AOS_FSI}</td>}
                                                <td className="summary-fsi-cell">{FSI}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </td>
                    ))}
                </tr>
            );
    
            // Insert the summary row at the start of rows
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
        if (selectedItems.length === 0) {
            return <span>
                {`{Select Ways to Buy}`}
            </span>;
        }
        return (
            <div
                className="tooltip"
            >
                {`[Multiple]`}
                <ul className="bottom" >
                    {selectedItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                    <i></i>
                </ul>
            </div>
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


                <div className="btn-group">
                    <button onClick={() => setToggleColumn(!toggleColumn)}
                        className={`btn ${toggleColumn ? "active-toggle" : ""} `}
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
            <div ref={tableRef} className="table-container">
                <table className="main-table">
                    <thead className="main-table-header">
                        <tr className="header-row">
                            <th colSpan="3" className="table-header">
                                <table border="1" className="inner-table sticky ">
                                    <thead>
                                        <tr className="column-header">
                                            <th>Country</th>
                                            <th>Ways to Buy</th>
                                            <th>As of Date</th>
                                        </tr>
                                        <tr className="filter-row">
                                            <th>{renderSelectionWithTooltip(selectedCountries, "Country")}</th>
                                            <th>{renderSelectionWithTooltip(selectedWaysToBuy, "Ways to Buy")}</th>
                                            <th>{selectedDate}</th>
                                        </tr>
                                        <tr className="sub-header">
                                            <th>Country</th>
                                            <th>Ways to Buy</th>
                                            <th>Bags Status</th>
                                        </tr>
                                    </thead>
                                </table>
                            </th>

                            {filteredDates.map((date, index) => (
                                <th key={date.id} colSpan="3" className="date-header">
                                    <table border="1" className="inner-table">
                                        <thead>
                                            <tr className="date-row">
                                                <th colSpan={toggleColumn ? "5" : "3"}>
                                                    {`Till Day ${8 - index} (EOD)`}
                                                </th>
                                            </tr>
                                            <tr className="date-row-2">
                                                <th colSpan={toggleColumn ? "5" : "3"}>
                                                    {selectedDate} - {date.label}
                                                </th>
                                            </tr>
                                            <tr className="metrics-header sub-header ">
                                                <th>GBI</th>
                                                {toggleColumn && <th className="delta-header" > <LuTriangle />  (AOS-GBI)</th>}
                                                <th>AOS</th>
                                                {toggleColumn && <th className="delta-header"><LuTriangle /> (AOS-FSI)</th>}
                                                <th>FSI</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="table-body">
                        {generateRows}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Dtable;
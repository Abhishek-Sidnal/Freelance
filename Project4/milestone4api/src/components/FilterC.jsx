import React, { useEffect, useRef, useState } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';
import { useFilters } from './context/FilterContext';
import { bagData, getBagStatusSumsByDay, groupDataByCountryAndWaysToBuy } from './data';
import axios from 'axios';
import { PiSwapLight } from 'react-icons/pi';
import { BiExport } from 'react-icons/bi';
import { MdLocalPrintshop } from 'react-icons/md';
import { LuTriangle } from 'react-icons/lu';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import Loader from './Loader';

const FilterHeader = () => {
    const {
        selectedCountries, setSelectedCountries,
        selectedWaysToBuy, setSelectedWaysToBuy,
        selectedDate, setSelectedDate,
        countryFilter, setCountryFilter,
        wbFilter, setWBFilter,
        dates, setDates,
        displayedFilters, applyFilters
    } = useFilters();
    const apiUrl = import.meta.env.VITE_API_DATA;
    const [toggleColumn, setToggleColumn] = useState(false);
    const [loading, setLoading] = useState(true)
    const [result, setReuslt] = useState([]);
    const [error, setError] = useState(null);

    const filteredDates = dates.filter((date) => date <= displayedFilters.date);
    const tableRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true)
            const requestData = {
                "dimensions": [],
                "filters": {
                    "COUNTRY_CD": displayedFilters.countries,
                    "WAYS_TO_BUY_CD": displayedFilters.ways,
                    "REPORTING_DATE": filteredDates
                }
            };
            console.log(requestData);

            try {
                const response = await axios.post("/api-data", requestData);
                const result = response.data.result;

                setReuslt(result);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false)
            }
        };

        fetchUserData();
    }, [apiUrl, displayedFilters]);

    const formattedData3 = groupDataByCountryAndWaysToBuy(result);

    const summaryData = getBagStatusSumsByDay(formattedData3)

    const renderDayDesc = (row) => {
        return filteredDates.map((date, index) => {
            const dayDescription = row.Day_Desc.find(day => {
                const name = Object.keys(day)[0];
                return name === `Till Day ${filteredDates.length - index} (EOD)`;  // Use filteredDates for day matching
            });

            const bagStatuses = dayDescription ? dayDescription[`Till Day ${filteredDates.length - index} (EOD)`] : [];

            const dayStatusMap = new Map();
            bagStatuses.forEach((bag) => {
                dayStatusMap.set(bag.Bag_Status, bag);
            });


            return (
                <td key={index} colSpan="3" className='data-cell'  >
                    <table className='data-table' border="1" >
                        <tbody>
                            {bagData.map((status, idx) => {
                                const statusData = dayStatusMap.get(status);
                                const gbiCount = statusData ? statusData.GBI_Cnt : "-";
                                const aosCount = statusData ? statusData.AOS_Cnt : "-";
                                const fsiCount = statusData ? statusData.FSI_Cnt : "-";
                                const aos_gbi = aosCount - gbiCount;
                                const aos_fsi = aosCount - fsiCount;
                                return (
                                    <tr key={idx}
                                        className={`bodyHeader ${status === "Total Bags Created" ||
                                            status === "Total Bags Deleted" ||
                                            status === "Total Bags Ordered"
                                            ? "blue-header"
                                            : status === "Open Bags"
                                                ? "lightGreenHeader"
                                                : ""
                                            }`}
                                    >
                                        <td>{gbiCount}</td>
                                        {toggleColumn && <td className="aos-gbi-cell">{Number.isNaN(aos_gbi) ? "-" : aos_gbi}</td>}
                                        <td>{aosCount}</td>
                                        {toggleColumn && <td className="aos-gbi-cell">{Number.isNaN(aos_fsi) ? "-" : aos_fsi}</td>}
                                        <td>{fsiCount}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </td>
            );
        });
    };

    const renderSelectionWithTooltip = (selectedItems, type) => {
        // If "all" is selected, display "All"
        if (selectedItems.includes("all")) {
            return <span>All</span>;
        }

        // If only one item is selected, display it directly
        if (selectedItems.length === 1) {
            const option = (type === "Country" ? countryFilter : wbFilter).find(option => option.id === selectedItems[0]);
            const label = option ? option.label : selectedItems[0];  // Fallback to the ID if label is not found
            return <span>{label}</span>;
        }

        // If no item is selected, display a placeholder message
        if (selectedItems.length === 0) {
            return <span>{`{Select ${type}}`}</span>;
        }

        // If multiple items are selected, map the selected items to their labels
        return (
            <div className="tooltip">
                {`[Multiple]`}
                <ul className="bottom">
                    {selectedItems.map((item, index) => {
                        const option = (type === "Country" ? countryFilter : wbFilter).find(option => option.id === item);
                        const label = option ? option.label : item;
                        return <li key={index}>{label}</li>;
                    })}
                    <i></i>
                </ul>
            </div>
        );
    };

    const isMultipleCountries = displayedFilters.countries.includes("all") || displayedFilters.countries.length > 1;
    const isMultipleWays = displayedFilters.ways.includes("all") || displayedFilters.ways.length > 1;



    return (
        <>
            <div className="filter-header">
                <div className="filters">
                    <div className="filter">
                        <label htmlFor="">Country</label>
                        <MultiSelectDropdown
                            options={countryFilter}
                            selectedValues={selectedCountries}
                            onChange={setSelectedCountries}
                            label="Country"
                        />
                    </div>

                    <div className="filter">
                        <label htmlFor="">Ways to Buy</label>
                        <MultiSelectDropdown
                            options={wbFilter}
                            selectedValues={selectedWaysToBuy}
                            onChange={setSelectedWaysToBuy}
                            label="Ways to Buy"
                        />
                    </div>

                    <div className="filter">
                        <label htmlFor="">As of Date</label>
                        <select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="select"
                        >
                            {dates.map((date, i) => (
                                <option key={i} value={date}>
                                    {date}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick={() => applyFilters()}>Apply</button>
                </div>

                <div className="btn-group">
                    <button onClick={() => setToggleColumn(!toggleColumn)}
                        className={`btn ${toggleColumn ? "active-toggle" : ""} `}
                    >
                        <PiSwapLight />
                    </button>

                    <DownloadTableExcel
                        filename="users table"
                        sheet="users"
                        currentTableRef={tableRef.current}
                    >
                        <button className='btn'> <BiExport /> </button>
                    </DownloadTableExcel>

                    <button
                        onClick={() => window.print()}
                        className="btn"> <MdLocalPrintshop />
                    </button>


                </div>
            </div>
            {loading ? <Loader label={"Applying filters..."} /> :
                error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button className='retry-button' onClick={() => window.location.reload()}>Retry</button>
                    </div>
                ) :
                    (<div className="container">
                        <table className='main-table' ref={tableRef}>
                            <thead>
                                <tr>
                                    <th colSpan="3" className='header sticky-header zind'  >
                                        <table className='inner-table'>
                                            <thead>
                                                <tr>
                                                    <th>country</th>
                                                    <th>ways to buy</th>
                                                    <th>As of date</th>
                                                </tr>
                                                <tr>
                                                    <th>{renderSelectionWithTooltip(displayedFilters.countries, "Country")} </th>
                                                    <th
                                                        style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                                                    >{renderSelectionWithTooltip(displayedFilters.ways, "Ways to Buy")}</th>
                                                    <th>{displayedFilters.date}</th>
                                                </tr>
                                                <tr className='sub-header' >
                                                    <th>country</th>
                                                    <th>ways to buy</th>
                                                    <th>Bag status</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </th>
                                    {filteredDates.reverse().map((date, i) => (
                                        <th key={i} colSpan="3" className='header'  >
                                            <table className='inner-table'>
                                                <thead>
                                                    <tr>
                                                        <th colSpan={toggleColumn ? "5" : "3"}>Till day {filteredDates.length - i} EOD</th>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan={toggleColumn ? "5" : "3"}> {displayedFilters.date} - {date} </th>
                                                    </tr>
                                                    <tr className='sub-header'>
                                                        <th>GBI</th>
                                                        {toggleColumn && <th className="delta-header" > <LuTriangle />  (AOS-GBI)</th>}
                                                        <th>AOS</th>
                                                        {toggleColumn && <th className="delta-header"><LuTriangle /> (AOS-FSI)</th>}
                                                        <th>FSI   </th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Summary Row */}
                                {((isMultipleCountries && !isMultipleWays) || (!isMultipleCountries && isMultipleWays) || (isMultipleCountries && isMultipleWays)) &&
                                    <tr>
                                        <td className="header sticky-header" colSpan="3">
                                            <table border={1}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ padding: "5px" }}>
                                                            <strong> {(displayedFilters.countries.includes("all") || displayedFilters.countries.length > 1) ? "{Multiple}" : formattedData3[0].Country} </strong>
                                                        </td>
                                                        <td style={{ padding: "5px" }}>
                                                            <strong> {(displayedFilters.ways.includes("all") || displayedFilters.ways.length > 1) ? "{Multiple}" : formattedData3[0].Ways_To_Buy} </strong>
                                                        </td>
                                                        <td  >
                                                            <table border="1">
                                                                <tbody>
                                                                    {bagData.map((bag, i) => (
                                                                        <tr
                                                                            key={`bag -${i}-${bag}`}
                                                                            className={`bodyHeader ${bag === "Total Bags Created" ||
                                                                                bag === "Total Bags Deleted" ||
                                                                                bag === "Total Bags Ordered"
                                                                                ? "blue-header"
                                                                                : bag === "Open Bags"
                                                                                    ? "lightGreenHeader"
                                                                                    : ""
                                                                                }`}

                                                                        > <td style={{ padding: "6px" }}>
                                                                                {bag}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>

                                        {/* Summary Data for Each Date (DayX) */}
                                        {filteredDates.map((date, index) => {
                                            const dayLabel = `Till Day ${filteredDates.length - index} (EOD)`;
                                            const daySummary = summaryData[dayLabel] || {};

                                            return (
                                                <td key={index} colSpan="3" className="data-cell">
                                                    <table className="data-table" border="1" >
                                                        <tbody>
                                                            {bagData.map((status, idx) => {
                                                                const counts = daySummary[status] || {};
                                                                const gbi = counts.GBI_Cnt || 0;
                                                                const aos = counts.AOS_Cnt || 0;
                                                                const fsi = counts.FSI_Cnt || 0;
                                                                const aos_gbi = aos - gbi;
                                                                const aos_fsi = aos - fsi;
                                                                return (
                                                                    <tr key={idx}
                                                                        className={`bodyHeader ${status === "Total Bags Created" ||
                                                                            status === "Total Bags Deleted" ||
                                                                            status === "Total Bags Ordered"
                                                                            ? "blue-header"
                                                                            : status === "Open Bags"
                                                                                ? "lightGreenHeader"
                                                                                : ""
                                                                            }`}
                                                                    >
                                                                        <td>{gbi}</td>
                                                                        {toggleColumn && <td className="aos-gbi-cell">{Number.isNaN(aos_gbi) ? "-" : aos_gbi}</td>}
                                                                        <td>{aos}</td>
                                                                        {toggleColumn && <td className="aos-gbi-cell">{Number.isNaN(aos_fsi) ? "-" : aos_fsi}</td>}
                                                                        <td>{fsi}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                }


                                {formattedData3.map(row => (
                                    <tr key={row.Country + row.Ways_To_Buy}>
                                        <td className='header sticky-header' colSpan="3"  >
                                            <table border={1} >
                                                <tbody>
                                                    <tr>
                                                        <td style={{ padding: "5px" }} className='label' >{row.Country}</td>
                                                        <td style={{ padding: "5px" }} className='label' >{row.Ways_To_Buy}</td>
                                                        <td >
                                                            <table border="1">
                                                                <tbody>
                                                                    {bagData.map((bag, i) => (
                                                                        <tr
                                                                            key={`bag -${i}-${bag}`}
                                                                            className={`bodyHeader ${bag === "Total Bags Created" ||
                                                                                bag === "Total Bags Deleted" ||
                                                                                bag === "Total Bags Ordered"
                                                                                ? "blue-header"
                                                                                : bag === "Open Bags"
                                                                                    ? "lightGreenHeader"
                                                                                    : ""
                                                                                }`}

                                                                        > <td style={{ padding: "6px" }}>
                                                                                {bag}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        {renderDayDesc(row)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>)
            }
        </>
    );
};

export default FilterHeader;
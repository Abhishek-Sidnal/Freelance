import React, { useState, useCallback, lazy, Suspense, useMemo, useEffect, useContext } from "react";
import { metrics as initialMetrics } from "../constant/Data";
import MetricRow from "./MetricRow";
import ExpandedRow from "./ExpandedRow";
import { GeoContext } from "../context/GeoContext";
import FilterDropdown from "./FilterDropdown";

const MetricModal = lazy(() => import("./MetricModal"));

const TableComponent = () => {
    const { resetAll } = useContext(GeoContext);

    const [metrics, setMetrics] = useState(initialMetrics);
    const [expandedMetrics, setExpandedMetrics] = useState(new Set());
    const [modalState, setModalState] = useState({ isOpen: false, activeMetricID: null });
    const [expandAll, setExpandAll] = useState(false);

    const [filters, setFilters] = useState({
        geoFilter: [],
        lobFilter: [],
        rtmFilter: [],
        metricIDFilter: [],
        metricNameFilter: [],
        sameDayDomesticFilter: [],
    });

    // Compute filtered metrics based on metricIDFilter and metricNameFilter
    const filteredMetrics = useMemo(
        () =>
            metrics.filter(
                (metric) =>
                    (!filters.metricIDFilter.length || !filters.metricIDFilter.includes(metric.metricID)) &&
                    (!filters.metricNameFilter.length || !filters.metricNameFilter.includes(metric.metricName))
            ),
        [metrics, filters]
    );

    // Compute filter options dynamically from filtered metrics
    const allGeos = useMemo(
        () =>
            Array.from(
                new Set(
                    filteredMetrics.flatMap((metric) => metric.rows?.map((row) => row.geo) || [])
                )
            ),
        [filteredMetrics]
    );
    const allLobs = useMemo(
        () =>
            Array.from(
                new Set(
                    filteredMetrics.flatMap((metric) => metric.rows?.map((row) => row.lob) || [])
                )
            ),
        [filteredMetrics]
    );
    const allRtms = useMemo(
        () =>
            Array.from(
                new Set(
                    filteredMetrics.flatMap((metric) => metric.rows?.map((row) => row.rtm) || [])
                )
            ),
        [filteredMetrics]
    );
    const allSameDayDomestic = useMemo(
        () =>
            Array.from(
                new Set(
                    filteredMetrics.flatMap((metric) => metric.rows?.map((row) => row.sameDayDomestic) || [])
                )
            ),
        [filteredMetrics]
    );

    // Automatically reset filters when data changes
    useEffect(() => {
        setFilters({
            geoFilter: [],
            lobFilter: [],
            rtmFilter: [],
            metricIDFilter: [],
            metricNameFilter: [],
            sameDayDomesticFilter: [],
        });
    }, [metrics]);

    // Reusable filter change handler
    const handleFilterChange = (filterKey, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: prevFilters[filterKey].includes(value)
                ? prevFilters[filterKey].filter((f) => f !== value)
                : [...prevFilters[filterKey], value],
        }));
    };

    // Helper to check if all metrics are expanded
    const allMetricsExpanded = useMemo(
        () => expandedMetrics.size === metrics.length,
        [expandedMetrics, metrics]
    );

    // Expand/collapse state management
    const toggleExpandState = (metricID = null) => {
        setExpandedMetrics((prev) => {
            if (metricID === null) {
                return allMetricsExpanded ? new Set() : new Set(metrics.map((metric) => metric.metricID));
            }
            const newSet = new Set(prev);
            if (newSet.has(metricID)) newSet.delete(metricID);
            else newSet.add(metricID);
            return newSet;
        });
    };

    const toggleExpand = (metricID) => toggleExpandState(metricID);

    const toggleExpandAll = () => {
        setExpandAll((prev) => !prev);
        toggleExpandState();
    };

    // Modal open/close
    const handleOpenModal = (metric) => setModalState({ isOpen: true, activeMetricID: metric.metricID });
    const handleCloseModal = () => {
        resetAll();
        setModalState({ isOpen: false, activeMetricID: null });
    };

    // Add rows to a metric
    const handleAddRows = useCallback(
        (metricID, newRows) => {
            setMetrics((prevMetrics) =>
                prevMetrics.map((metric) =>
                    metric.metricID === metricID ? { ...metric, rows: [...(metric.rows || []), ...newRows] } : metric
                )
            );
            setExpandedMetrics((prev) => new Set(prev).add(metricID));
            handleCloseModal();
        },
        [handleCloseModal]
    );

    if (metrics.length === 0) {
        return <div>No metrics available</div>;
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Metrics Table</h1>
                <button
                    className="toggle-expand-collapse"
                    onClick={toggleExpandAll}
                    aria-expanded={allMetricsExpanded}
                    aria-label={allMetricsExpanded ? "Collapse all metrics" : "Expand all metrics"}
                >
                    {allMetricsExpanded ? "Collapse All" : "Expand All"}
                </button>
            </div>

            <div className="table-container">
                <table className="metrics-table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th className="metric-id-header">
                                <div className="header">
                                    Metric ID
                                    <FilterDropdown
                                        label="Filter"
                                        options={Array.from(new Set(metrics.map((m) => m.metricID)))}
                                        selectedOptions={filters.metricIDFilter}
                                        onFilterChange={(value) => handleFilterChange("metricIDFilter", value)}
                                    />
                                </div>
                            </th>
                            <th className="metric-name-header">
                                <div className="header">
                                    Metric Name
                                    <FilterDropdown
                                        label="Filter"
                                        options={Array.from(new Set(metrics.map((m) => m.metricName)))}
                                        selectedOptions={filters.metricNameFilter}
                                        onFilterChange={(value) => handleFilterChange("metricNameFilter", value)}
                                    />
                                </div>
                            </th>
                            <th className="geo-header">
                                <div className="header">
                                    Geo
                                    <FilterDropdown
                                        label="Filter"
                                        options={allGeos}
                                        selectedOptions={filters.geoFilter}
                                        onFilterChange={(value) => handleFilterChange("geoFilter", value)}
                                    />
                                </div>
                            </th>
                            <th className="lob-header">
                                <div className="header">
                                    LOB
                                    <FilterDropdown
                                        label="Filter"
                                        options={allLobs}
                                        selectedOptions={filters.lobFilter}
                                        onFilterChange={(value) => handleFilterChange("lobFilter", value)}
                                    />
                                </div>
                            </th>
                            <th className="rtm-header">
                                <div className="header">
                                    RTM
                                    <FilterDropdown
                                        label="Filter"
                                        options={allRtms}
                                        selectedOptions={filters.rtmFilter}
                                        onFilterChange={(value) => handleFilterChange("rtmFilter", value)}
                                    />
                                </div>
                            </th>
                            <th className="same-day-domestic-header">
                                <div className="header">
                                    Same Day Domestic
                                    <FilterDropdown
                                        label="Filter"
                                        options={allSameDayDomestic}
                                        selectedOptions={filters.sameDayDomesticFilter}
                                        onFilterChange={(value) =>
                                            handleFilterChange("sameDayDomesticFilter", value)
                                        }
                                    />
                                </div>
                            </th>
                            <th>Metric Type</th>
                            <th>Metric Floor</th>
                            <th>Metric Ceiling</th>
                            <th>Metric Weightage</th>
                            <th>Benchmark Value</th>
                            <th>Benchmark Ceiling</th>
                            <th>Benchmark Logic Type</th>
                            <th>Metric Sign</th>
                            <th>Ranking Metric</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMetrics.length === 0 ? (
                            <tr>
                                <td colSpan="16" style={{ textAlign: "center" }}>
                                    No results match the selected filters.
                                </td>
                            </tr>
                        ) : (
                            filteredMetrics.map((metric) => {
                                const isExpanded = expandedMetrics.has(metric.metricID);

                                const filteredRows = metric.rows
                                    ? metric.rows.filter(
                                          (row) =>
                                              !filters.geoFilter.includes(row.geo) &&
                                              !filters.lobFilter.includes(row.lob) &&
                                              !filters.rtmFilter.includes(row.rtm) &&
                                              !filters.sameDayDomesticFilter.includes(row.sameDayDomestic)
                                      )
                                    : [];

                                return (
                                    <React.Fragment key={metric.metricID}>
                                        <MetricRow
                                            metric={metric}
                                            isExpanded={isExpanded}
                                            onToggleExpand={() => toggleExpand(metric.metricID)}
                                            onOpenModal={handleOpenModal}
                                        />
                                        {isExpanded &&
                                            (filteredRows.length > 0 ? (
                                                filteredRows.map((row, index) => (
                                                    <ExpandedRow
                                                        key={`${metric.metricID}-${index}`}
                                                        row={row}
                                                    />
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="16" style={{ textAlign: "center" }}>
                                                        No rows match the selected filters.
                                                    </td>
                                                </tr>
                                            ))}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {modalState.isOpen && (
                <Suspense fallback={<div>Loading...</div>}>
                    <MetricModal
                        open={modalState.isOpen}
                        onClose={handleCloseModal}
                        metric={metrics.find((m) => m.metricID === modalState.activeMetricID)}
                        onAddRows={handleAddRows}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default TableComponent;

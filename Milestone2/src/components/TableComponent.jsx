import React, { useState, useCallback, lazy, Suspense } from "react";
import { metrics as initialMetrics } from "../constant/Data";
import MetricRow from "./MetricRow";
import ExpandedRow from "./ExpandedRow";
import { tHeader } from "../constant/Data2";

// Lazy load the MetricModal
const MetricModal = lazy(() => import("./MetricModal"));

const TableComponent = () => {
    const [metrics, setMetrics] = useState(initialMetrics);
    const [expandedMetrics, setExpandedMetrics] = useState(new Set());
    const [openModal, setOpenModal] = useState(false);
    const [activeMetricID, setActiveMetricID] = useState(null);

    // Toggle expanded state for a metric
    const toggleExpand = useCallback((metricID) => {
        setExpandedMetrics((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(metricID)) newSet.delete(metricID);
            else newSet.add(metricID);
            return newSet;
        });
    }, []);

    // Open modal for a specific metric
    const handleOpenModal = useCallback((metric) => {
        setActiveMetricID(metric.metricID);
        setOpenModal(true);
    }, []);

    // Close modal
    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
        setActiveMetricID(null);
    }, []);

    // Add rows to a metric
    const handleAddRows = useCallback((metricID, newRows) => {
        setMetrics((prevMetrics) =>
            prevMetrics.map((metric) =>
                metric.metricID === metricID
                    ? { ...metric, rows: [...(metric.rows || []), ...newRows] }
                    : metric
            )
        );
        setExpandedMetrics((prev) => new Set(prev).add(metricID));
        handleCloseModal();
    }, [handleCloseModal]);

    return (
        <div className="table-container">
            <h1>Metrics Table</h1>
            <table className="metrics-table">
                <thead>
                    <tr>
                        {tHeader.map((tHead, i) => (
                            <th key={i}>{tHead}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {metrics.map((metric) => {
                        const isExpanded = expandedMetrics.has(metric.metricID);
                        return (
                            <React.Fragment key={metric.metricID}>
                                <MetricRow
                                    metric={metric}
                                    isExpanded={isExpanded}
                                    onToggleExpand={toggleExpand}
                                    onOpenModal={handleOpenModal}
                                />
                                {isExpanded &&
                                    (metric.rows && metric.rows.length > 0 ? (
                                        metric.rows.map((row, index) => (
                                            <ExpandedRow key={`${metric.metricID}-${index}`} row={row} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={16} style={{ textAlign: "center" }}>
                                                No rows available.
                                            </td>
                                        </tr>
                                    ))}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            {openModal && (
                <Suspense fallback={<div>Loading...</div>}>
                    <MetricModal
                        open={openModal}
                        onClose={handleCloseModal}
                        metric={metrics.find((m) => m.metricID === activeMetricID)}
                        onAddRows={handleAddRows}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default TableComponent;

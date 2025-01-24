import React, { createContext, useState } from "react";

// Create the context
export const MetricContext = createContext();

// Create the provider component
export const MetricProvider = ({ children }) => {
    const [selectedGeos, setSelectedGeos] = useState([]);
    const [lobSelection, setLobSelection] = useState([]);
    const [rtmSelection, setRtmSelection] = useState("");
    const [sameDayDomestic, setSameDayDomestic] = useState("");
    const [metricType, setMetricType] = useState("");
    const [metricCeiling, setMetricCeiling] = useState("");
    const [benchmarkCeiling, setBenchmarkCeiling] = useState("");
    const [benchmarkValue, setBenchmarkValue] = useState("");
    const [metricFloor, setMetricFloor] = useState("");
    const [benchmarkLogicType, setBenchmarkLogicType] = useState("");
    const [metricWeight, setMetricWeight] = useState("");
    const [metricSign, setMetricSign] = useState("");
    const [rankingMetric, setRankingMetric] = useState("");
    const [existingMetrics, setExistingMetrics] = useState([
        "Automotive Brand 1 - SUV",
        "Automotive Brand 1 - Sedan",
    ]); // Example existing metrics
    const [previewMetrics, setPreviewMetrics] = useState([]);

    return (
        <MetricContext.Provider
            value={{
                selectedGeos,
                setSelectedGeos,
                lobSelection,
                setLobSelection,
                rtmSelection,
                setRtmSelection,
                sameDayDomestic,
                setSameDayDomestic,
                metricType,
                setMetricType,
                metricCeiling,
                setMetricCeiling,
                benchmarkCeiling,
                setBenchmarkCeiling,
                benchmarkValue,
                setBenchmarkValue,
                metricFloor,
                setMetricFloor,
                benchmarkLogicType,
                setBenchmarkLogicType,
                metricWeight,
                setMetricWeight,
                metricSign,
                setMetricSign,
                rankingMetric,
                setRankingMetric,
                existingMetrics,
                setExistingMetrics,
                previewMetrics,
                setPreviewMetrics,
            }}
        >
            {children}
        </MetricContext.Provider>
    );
};

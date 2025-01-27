import React, { useContext, useState } from "react";
import { GeoContext } from "../context/GeoContext";
import GeoSelector from "./GeoSelector";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { tHeader } from "../constant/Data";
import ExpandedRow from "./ExpandedRow"
import THead from "./THead";
const MetricModal = ({ open, onClose, metric, onAddRows }) => {
    const { selectedColumns, resetAll } = useContext(GeoContext);
    const [activeStep, setActiveStep] = useState(0);
    const [selectedLob, setSelectedLob] = useState([]);
    const [isLobDropdownOpen, setIsLobDropdownOpen] = useState(false);
    const [rtm, setRtm] = useState("drop-in");
    const [sameDayDomestic, setSameDayDomestic] = useState("yes");
    const [metricType, setMetricType] = useState("");
    const [metricCeiling, setMetricCeiling] = useState("");
    const [benchmarkCeiling, setBenchmarkCeiling] = useState("");
    const [benchmarkValue, setBenchmarkValue] = useState("");
    const [metricFloor, setMetricFloor] = useState("");
    const [benchmarkLogicType, setBenchmarkLogicType] = useState("slope");
    const [metricWeight, setMetricWeight] = useState("");
    const [metricSign, setMetricSign] = useState("");
    const [rankingMetric, setRankingMetric] = useState("yes");
    const [previewRows, setPreviewRows] = useState([]);
    const [alreadyExist, setAlreadyExist] = useState([]); // Existing rows



    // Toggle LOB dropdown
    const toggleLobDropdown = () => {
        setIsLobDropdownOpen((prev) => !prev);
    };

    // Handle LOB selection
    const handleLobSelection = (lob) => {
        if (selectedLob.includes(lob)) {
            setSelectedLob(selectedLob.filter((item) => item !== lob));
        } else {
            setSelectedLob([...selectedLob, lob]);
        }
    };

    // Generate rows for preview
    const generateRows = () => {
        const newRows = [];
        const existingRows = [];

        // Iterate over finalSelected Geo and selected LOB to generate rows
        selectedColumns.forEach((geo) => {
            selectedLob.forEach((lob) => {
                const newRow = {
                    name: `${metric.metricName} - ${lob}`,
                    geo,
                    lob,
                    rtm,
                    sameDayDomestic,
                    metricType,
                    metricFloor,
                    metricCeiling,
                    metricWeight,
                    benchmarkValue,
                    benchmarkCeiling,
                    benchmarkLogicType,
                    metricSign,
                    rankingMetric,
                };

                // Check if row already exists
                if (
                    metric.rows.some(
                        (row) =>
                            row.name === newRow.name && row.geo === newRow.geo
                    )
                ) {
                    existingRows.push(newRow);
                } else {
                    newRows.push(newRow);
                }
            });
        });

        setPreviewRows(newRows);
        setAlreadyExist(existingRows);
    };

    const handleCreateRows = () => {
        onAddRows(metric.metricID, previewRows);
        onClose();
    };

    const handleNext = () => {
        if (activeStep === 0) {
            generateRows();
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{metric.metricName}</h2>
                <div className="stepper">
                    <div className={activeStep === 0 ? "step active" : "step"}>Configure</div>
                    <div className={activeStep === 1 ? "step active" : "step"}>Preview</div>
                </div>
                {activeStep === 0 && (
                    <div className="configure-step">
                        <GeoSelector />
                        <div className="metric-container">
                            <div className="right-metric" >
                                <div className="field" >
                                    <label>LOB:</label>
                                    <div className="multi-select-dropdown">
                                        <div className="dropdown-header">
                                            {selectedLob.length > 0 ? `${selectedLob.join(", ")} (${selectedLob.length})` : "Select LOB"}
                                            <span className="dropdown-arrow">
                                                <FaAngleDown />
                                            </span>
                                        </div>
                                        <ul className="dropdown-menu">
                                            {["SUV", "Hatchback", "Sedan"].map((lob) => (
                                                <li
                                                    key={lob}
                                                    className={`dropdown-item ${selectedLob.includes(lob) ? "selected" : ""}`}
                                                    onClick={() => handleLobSelection(lob)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLob.includes(lob)}
                                                        onChange={() => handleLobSelection(lob)}
                                                    />
                                                    {lob}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                                <div className="field">
                                    <label>RTM:</label>
                                    <select value={rtm} onChange={(e) => setRtm(e.target.value)}>
                                        <option value="drop-in">Drop-In</option>
                                        <option value="drop-out">Drop-Out</option>
                                    </select>
                                </div>
                                <div className="field" >
                                    <label>Same Day Domestic:</label>
                                    <select
                                        value={sameDayDomestic}
                                        onChange={(e) => setSameDayDomestic(e.target.value)}
                                    >
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>

                            <div className="left-metric">
                                <div className="field" >
                                    <label htmlFor="metriType" >Metric Type:</label>
                                    <input
                                        id="metriType"
                                        type="text"
                                        value={metricType}
                                        onChange={(e) => setMetricType(e.target.value)}
                                    />
                                </div>
                                <div className="field" >
                                    <label htmlFor="Metric_Ceiling">Metric Ceiling:</label>
                                    <input
                                        id="Metric_Ceiling"
                                        type="text"
                                        value={metricCeiling}
                                        onChange={(e) => setMetricCeiling(e.target.value)}
                                    />
                                </div>
                                <div className="field" >
                                    <label htmlFor="Benchmark_Ceiling">Benchmark Ceiling:</label>
                                    <input
                                        id="Benchmark_Ceiling"
                                        type="text"
                                        value={benchmarkCeiling}
                                        onChange={(e) => setBenchmarkCeiling(e.target.value)}
                                    />
                                </div>
                                <div className="field" >
                                    <label htmlFor="Benchmark_Value" >Benchmark Value:</label>
                                    <input
                                        id="Benchmark_Value"
                                        type="text"
                                        value={benchmarkValue}
                                        onChange={(e) => setBenchmarkValue(e.target.value)}
                                    />
                                </div>
                                <div className="field" >
                                    <label htmlFor="Metric_Floor">Metric Floor:</label>
                                    <input
                                        id="Metric_Floor"
                                        type="text"
                                        value={metricFloor}
                                        onChange={(e) => setMetricFloor(e.target.value)}
                                    />
                                </div>
                                <div className="field" >
                                    <label>Benchmark Logic Type:</label>
                                    <select
                                        value={benchmarkLogicType}
                                        onChange={(e) => setBenchmarkLogicType(e.target.value)}
                                    >
                                        <option value="slope">Slope</option>
                                        <option value="a">A</option>
                                        <option value="b">B</option>
                                    </select>
                                </div>
                                <div className="field" >
                                    <label htmlFor="Metric_Weight">Metric Weight:</label>
                                    <input
                                        id="Metric_Weight"
                                        type="text"
                                        value={metricWeight}
                                        onChange={(e) => setMetricWeight(e.target.value)}
                                    />
                                </div>
                                <div className="field" >
                                    <label htmlFor="Metric_Sign">Metric Sign:</label>
                                    <input
                                        id="Metric_Sign"
                                        type="text"
                                        value={metricSign}
                                        onChange={(e) => setMetricSign(e.target.value)}
                                    />
                                </div>
                                <div className="field" >
                                    <label >Ranking Metric:</label>
                                    <select
                                        value={rankingMetric}
                                        onChange={(e) => setRankingMetric(e.target.value)}
                                    >
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeStep === 1 && (
                    <div className="preview-step">

                        <h3>Ready to Create ( {previewRows.length} ) </h3>
                        <div className="preview-step-table">
                            {previewRows.length > 0 && (
                                <table border="1" className="metrics-table" >
                                    <thead>
                                        <tr>
                                            <THead tHeader={tHeader} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewRows.map((row, index) => (
                                            <ExpandedRow
                                                key={index}
                                                row={row}
                                                preview={true}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <h3>Already Exist ( {alreadyExist.length} )</h3>
                        {alreadyExist.length > 0 && (

                            <div className="preview-step-table">
                                <table border="1" className="metrics-table" >
                                    <thead>
                                        <THead tHeader={tHeader} />
                                    </thead>
                                    <tbody>
                                        {alreadyExist.map((row, index) => (
                                            <ExpandedRow
                                                key={index}
                                                row={row}
                                                preview={true}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                        )}
                    </div>
                )}

                <div className="modal-footer">
                    <button onClick={onClose} className="cancel-button" >Cancel</button>
                    {activeStep > 0 && <button onClick={handleBack} className="back-button" >Back</button>}
                    {activeStep === 1 ? (
                        <button onClick={handleCreateRows}>Create Rows</button>
                    ) : (
                        <button onClick={handleNext} className="next-button" >Next</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MetricModal;

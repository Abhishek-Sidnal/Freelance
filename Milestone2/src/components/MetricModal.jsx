import React, { useContext, useState, useEffect, useRef } from "react";
import { GeoContext } from "../context/GeoContext";
import GeoSelector from "./GeoSelector";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { tHeader } from "../constant/Data";
import ExpandedRow from "./ExpandedRow";
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
    const [error, setError] = useState(""); // Validation error
    const [showCancelConfirm, setShowCancelConfirm] = useState(false); // Cancel confirmation
    const dropdownRef = useRef(null); // Ref for the dropdown

    // Toggle LOB dropdown
    const toggleLobDropdown = () => {
        setIsLobDropdownOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsLobDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

                if (
                    metric.rows.some(
                        (row) => row.name === newRow.name && row.geo === newRow.geo
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
            if (selectedColumns.length === 0) {
                setError("Please select at least one Geo.");
                return;
            }
            if (selectedLob.length === 0) {
                setError("Please select at least one LOB.");
                return;
            }
            setError(""); // Clear error if validation passes
            generateRows();
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleCancel = () => {
        setShowCancelConfirm(true);
    };

    const confirmCancel = (confirm) => {
        if (confirm) {
            resetAll();
            onClose();
        }
        setShowCancelConfirm(false);
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
                        {error && <p className="error-message">{error}</p>}
                        <GeoSelector />
                        <div className="metric-container">
                            <div className="right-metric">
                                <div className="field">
                                    <label>LOB:</label>
                                    <div className="multi-select-dropdown" ref={dropdownRef}>
                                        <div
                                            className="dropdown-header"
                                            onClick={toggleLobDropdown}
                                        >
                                            {selectedLob.length > 0
                                                ? `${selectedLob.join(", ")} (${selectedLob.length})`
                                                : "Select LOB"}
                                            <span className="dropdown-arrow">
                                                {isLobDropdownOpen ? (
                                                    <FaAngleUp />
                                                ) : (
                                                    <FaAngleDown />
                                                )}
                                            </span>
                                        </div>
                                        {isLobDropdownOpen && (
                                            <ul className="dropdown-menu">
                                                {["SUV", "Hatchback", "Sedan"].map((lob) => (
                                                    <li
                                                        key={lob}
                                                        className={`dropdown-item ${selectedLob.includes(lob)
                                                            ? "selected"
                                                            : ""
                                                            }`}
                                                        onClick={() =>
                                                            handleLobSelection(lob)
                                                        }
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedLob.includes(lob)}
                                                            onChange={() =>
                                                                handleLobSelection(lob)
                                                            }
                                                        />
                                                        {lob}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className="field">
                                    <label>RTM:</label>
                                    <select value={rtm} onChange={(e) => setRtm(e.target.value)}>
                                        <option value="drop-in">Drop-In</option>
                                        <option value="drop-out">Drop-Out</option>
                                    </select>
                                </div>
                                <div className="field">
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
                                <div className="field">
                                    <label htmlFor="metricType">Metric Type:</label>
                                    <input
                                        id="metricType"
                                        type="text"
                                        value={metricType}
                                        onChange={(e) => setMetricType(e.target.value)}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="metricCeiling">Metric Ceiling:</label>
                                    <input
                                        id="metricCeiling"
                                        type="text"
                                        value={metricCeiling}
                                        onChange={(e) => setMetricCeiling(e.target.value)}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="benchmarkCeiling">Benchmark Ceiling:</label>
                                    <input
                                        id="benchmarkCeiling"
                                        type="text"
                                        value={benchmarkCeiling}
                                        onChange={(e) => setBenchmarkCeiling(e.target.value)}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="benchmarkValue">Benchmark Value:</label>
                                    <input
                                        id="benchmarkValue"
                                        type="text"
                                        value={benchmarkValue}
                                        onChange={(e) => setBenchmarkValue(e.target.value)}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="metricFloor">Metric Floor:</label>
                                    <input
                                        id="metricFloor"
                                        type="text"
                                        value={metricFloor}
                                        onChange={(e) => setMetricFloor(e.target.value)}
                                    />
                                </div>
                                <div className="field">
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
                                <div className="field">
                                    <label htmlFor="metricWeight">Metric Weight:</label>
                                    <input
                                        id="metricWeight"
                                        type="text"
                                        value={metricWeight}
                                        onChange={(e) => setMetricWeight(e.target.value)}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="metricSign">Metric Sign:</label>
                                    <input
                                        id="metricSign"
                                        type="text"
                                        value={metricSign}
                                        onChange={(e) => setMetricSign(e.target.value)}
                                    />
                                </div>
                                <div className="field">
                                    <label>Ranking Metric:</label>
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
                        <h3>Ready to Create ({previewRows.length})</h3>
                        {previewRows.length > 0 && (
                            <div className="preview-step-table">
                                <table border="1" className="metrics-table">
                                    <thead>
                                        <tr>
                                            <THead tHeader={tHeader} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewRows.map((row, index) => (
                                            <ExpandedRow key={index} row={row} preview={true} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <h3>Already Exist ({alreadyExist.length})</h3>
                        {alreadyExist.length > 0 && (
                            <div className="preview-step-table">

                                <table border="1" className="metrics-table">
                                    <thead>
                                        <tr>
                                            <THead tHeader={tHeader} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alreadyExist.map((row, index) => (
                                            <ExpandedRow key={index} row={row} preview={true} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                <div className="modal-footer">
                    <button onClick={handleCancel} className="cancel-button">
                        Cancel
                    </button>
                    {activeStep > 0 && (
                        <button onClick={handleBack} className="back-button">
                            Back
                        </button>
                    )}
                    {activeStep === 1 ? (
                        <button onClick={handleCreateRows}>Create Rows</button>
                    ) : (
                        <button onClick={handleNext} className="next-button">
                            Next
                        </button>
                    )}
                </div>
            </div>

            {/* Cancel confirmation popup */}
            {showCancelConfirm && (
                <>
                    <div className="cancel-overlay"></div>
                    <div className="cancel-confirmation-popup">
                        <p>Are you sure you want to cancel?</p>
                        <div className="confirmation-buttons">
                            <button
                                className="confirm-button"
                                onClick={() => confirmCancel(true)}
                            >
                                Yes
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => confirmCancel(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MetricModal;

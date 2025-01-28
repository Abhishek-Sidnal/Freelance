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
    const [isLobDropdownOpen, setIsLobDropdownOpen] = useState(false);
    const [previewRows, setPreviewRows] = useState([]);
    const [alreadyExist, setAlreadyExist] = useState([]);
    const [error, setError] = useState("");
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const dropdownRef = useRef(null);

    // Consolidated state for fields
    const [fields, setFields] = useState({
        selectedLob: [],
        rtm: "drop-in",
        sameDayDomestic: "yes",
        metricType: "",
        metricCeiling: "",
        benchmarkCeiling: "",
        benchmarkValue: "",
        metricFloor: "",
        benchmarkLogicType: "slope",
        metricWeight: "",
        metricSign: "",
        rankingMetric: "yes",
    });

    // Update field dynamically
    const updateField = (field, value) => {
        setFields((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Toggle LOB selection
    const toggleLobSelection = (lob) => {
        setFields((prev) => {
            const isSelected = prev.selectedLob.includes(lob);
            return {
                ...prev,
                selectedLob: isSelected
                    ? prev.selectedLob.filter((item) => item !== lob)
                    : [...prev.selectedLob, lob],
            };
        });
    };

    // Reset fields to initial values
    const resetFields = () => {
        setFields({
            selectedLob: [],
            rtm: "drop-in",
            sameDayDomestic: "yes",
            metricType: "",
            metricCeiling: "",
            benchmarkCeiling: "",
            benchmarkValue: "",
            metricFloor: "",
            benchmarkLogicType: "slope",
            metricWeight: "",
            metricSign: "",
            rankingMetric: "yes",
        });
    };

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

    // Generate rows for preview
    const generateRows = () => {
        const newRows = [];
        const existingRows = [];

        selectedColumns.forEach((geo) => {
            fields.selectedLob.forEach((lob) => {
                const newRow = {
                    name: `${metric.metricName} - ${lob}`,
                    geo,
                    lob,
                    rtm: fields.rtm,
                    sameDayDomestic: fields.sameDayDomestic,
                    metricType: fields.metricType,
                    metricFloor: fields.metricFloor,
                    metricCeiling: fields.metricCeiling,
                    metricWeight: fields.metricWeight,
                    benchmarkValue: fields.benchmarkValue,
                    benchmarkCeiling: fields.benchmarkCeiling,
                    benchmarkLogicType: fields.benchmarkLogicType,
                    metricSign: fields.metricSign,
                    rankingMetric: fields.rankingMetric,
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
            if (fields.selectedLob.length === 0) {
                setError("Please select at least one LOB.");
                return;
            }
            setError("");
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
            resetFields();
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
                    <div className={activeStep > 0 ? "step active filled" : "step active"}>
                        <span className="step-number">1</span>
                        <span className="step-label">Configure</span>
                    </div>
                    <div className={activeStep >= 1 ? "step active" : "step"}>
                        <span className="step-number">2</span>
                        <span className="step-label">Preview</span>
                    </div>
                </div>

                <div className="stepper-body">
                    {activeStep === 0 && (
                        <div className="configure-step">
                            {error && <p className="error-message">{error}</p>}
                            <label>Geo</label>

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
                                                {fields.selectedLob.length > 0
                                                    ? `${fields.selectedLob.join(", ")} (${fields.selectedLob.length})`
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
                                                            className={`dropdown-item ${fields.selectedLob.includes(lob)
                                                                ? "selected"
                                                                : ""
                                                                }`}
                                                            onClick={() =>
                                                                toggleLobSelection(lob)
                                                            }
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={fields.selectedLob.includes(lob)}
                                                                onChange={() =>
                                                                    toggleLobSelection(lob)
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
                                        <select
                                            value={fields.rtm}
                                            onChange={(e) => updateField("rtm", e.target.value)}
                                        >
                                            <option value="drop-in">Drop-In</option>
                                            <option value="drop-out">Drop-Out</option>
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label>Same Day Domestic:</label>
                                        <select
                                            value={fields.sameDayDomestic}
                                            onChange={(e) =>
                                                updateField("sameDayDomestic", e.target.value)
                                            }
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="left-metric">
                                    {[
                                        { label: "Metric Type", key: "metricType" },
                                        { label: "Metric Ceiling", key: "metricCeiling" },
                                        { label: "Benchmark Ceiling", key: "benchmarkCeiling" },
                                        { label: "Benchmark Value", key: "benchmarkValue" },
                                        { label: "Metric Floor", key: "metricFloor" },
                                        { label: "Metric Weight", key: "metricWeight" },
                                        { label: "Metric Sign", key: "metricSign" },
                                    ].map(({ label, key }) => (
                                        <div className="field" key={key}>
                                            <label htmlFor={key}>{label}:</label>
                                            <input
                                                id={key}
                                                type="text"
                                                value={fields[key]}
                                                onChange={(e) => updateField(key, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                    <div className="field">
                                        <label>Benchmark Logic Type:</label>
                                        <select
                                            value={fields.benchmarkLogicType}
                                            onChange={(e) =>
                                                updateField("benchmarkLogicType", e.target.value)
                                            }
                                        >
                                            <option value="slope">Slope</option>
                                            <option value="a">A</option>
                                            <option value="b">B</option>
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label>Ranking Metric:</label>
                                        <select
                                            value={fields.rankingMetric}
                                            onChange={(e) =>
                                                updateField("rankingMetric", e.target.value)
                                            }
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
                </div>

                <div className="modal-footer">
                    <button onClick={handleCancel} className="">
                        Cancel
                    </button>
                    {activeStep > 0 && (
                        <button onClick={handleBack} className="">
                            Back
                        </button>
                    )}
                    {activeStep === 1 ? (
                        <button onClick={handleCreateRows} className="btn">
                            Create Rows
                        </button>
                    ) : (
                        <button onClick={handleNext} className="btn">
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

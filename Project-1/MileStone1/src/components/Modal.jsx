import React, { useState } from "react";

const Modal = ({
    isVisible,
    modalData,
    modalInputs,
    onInputChange,
    onSubmit,
    onClose,
}) => {
    const [errors, setErrors] = useState({
        stateName: "",
        capital: "",
        population: "",
        hdi: "",
    });

    if (!isVisible) return null;

    const validateInputs = () => {
        const newErrors = {};

        // Validate stateName
        if (!modalInputs.stateName.trim()) {
            newErrors.stateName = "State name is required.";
        }

        // Validate capital (must be alphabetic only)
        if (!modalInputs.capital.trim()) {
            newErrors.capital = "Capital is required.";
        } else if (!/^[A-Za-z\s]+$/.test(modalInputs.capital.trim())) {
            newErrors.capital = "Capital must only contain alphabets.";
        }

        // Validate population
        if (!modalInputs.population || modalInputs.population <= 0) {
            newErrors.population = "Population must be a positive number. for eg: 87743";
        }

        // Validate HDI
        if (
            modalInputs.hdi === "" ||
            modalInputs.hdi < 0 ||
            modalInputs.hdi > 1
        ) {
            newErrors.hdi = "HDI must be a number between 0 and 1.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = () => {
        if (validateInputs()) {
            onSubmit();
        }
    };

    const handleCapitalChange = (e) => {
        const { value } = e.target;

        // Allow only alphabetic characters and spaces
        if (/^[A-Za-z\s]*$/.test(value)) {
            onInputChange(e);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add/Update State for {modalData.Country_Name}</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="stateName">State Name</label>
                        <select
                            id="stateName"
                            value={modalInputs.stateName}
                            onChange={onInputChange}
                        >
                            <option value="">Add New State</option>
                            {modalData.allStates.map((state) => (
                                <option key={state.name} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                        {errors.stateName && <p className="error">{errors.stateName}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="capital">Capital</label>
                        <input
                            id="capital"
                            type="text"
                            value={modalInputs.capital}
                            placeholder="Capital"
                            onChange={handleCapitalChange}
                        />
                        {errors.capital && <p className="error">{errors.capital}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="population">Population</label>
                        <input
                            id="population"
                            type="number"
                            value={modalInputs.population || ""}
                            placeholder="Population"
                            onChange={onInputChange}
                        />
                        {errors.population && (
                            <p className="error">{errors.population}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="hdi">HDI</label>
                        <input
                            id="hdi"
                            type="number"
                            step="0.01"
                            value={modalInputs.hdi || ""}
                            placeholder="HDI"
                            onChange={onInputChange}
                        />
                        {errors.hdi && <p className="error">{errors.hdi}</p>}
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleFormSubmit}>Add/Update</button>
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

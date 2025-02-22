import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

const FilterDropdown = ({ items, filteredItems, disabledItems = [], onToggleItem, title }) => {
    const [visible, setVisible] = useState(false);
    const dropdownRef = useRef(null);

    const handleOutsideClick = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setVisible(false);
        }
    };

    useEffect(() => {
        if (visible) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [visible]);

    return (
        <div className="filter-dropdown-container" ref={dropdownRef}>
            <button className="filter-button" onClick={() => setVisible(!visible)}>
                <FaFilter />
            </button>

            {visible && (
                <div className="filter-dropdown">
                    <div className="filter-header">
                        <h4>{`Filter ${title}`}</h4>
                        <button className="close-button" onClick={() => setVisible(false)}>
                            <IoIosClose />
                        </button>
                    </div>

                    <ul>
                        {items.map((item, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="checkbox"
                                        disabled={disabledItems.includes(item)}
                                        checked={
                                            !filteredItems.includes(item) &&
                                            !disabledItems.includes(item)
                                        }
                                        onChange={() =>
                                            !disabledItems.includes(item) && onToggleItem(item)
                                        }
                                    />
                                    <span
                                        style={{
                                            color: disabledItems.includes(item) ? "gray" : "inherit",
                                        }}
                                    >
                                        {item || "N/A"}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;

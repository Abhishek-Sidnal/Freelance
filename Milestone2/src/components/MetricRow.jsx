import React, { memo } from "react";
import { FaCaretDown, FaCaretRight, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

const MetricRow = memo(({ metric, isExpanded, onToggleExpand, onOpenModal }) => (
    <tr className="main-row" >
        <td>
            <button className="modal-button" onClick={() => onOpenModal(metric)}>
                <FaCirclePlus />
            </button>
        </td>
        <td>
            <div className="expand-column">
                <button className="modal-button" onClick={() => onToggleExpand(metric.metricID)}>
                    {isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                </button>{" "}
                {metric.metricID}
            </div>
        </td>
        <td>{metric.metricName} </td>
        <td colSpan="16"></td>
    </tr>
));

export default MetricRow;

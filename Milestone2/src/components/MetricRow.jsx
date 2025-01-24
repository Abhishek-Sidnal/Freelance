import React, { memo } from "react";
import { FaPlus, FaChevronDown, FaChevronRight } from "react-icons/fa";

const MetricRow = memo(({ metric, isExpanded, onToggleExpand, onOpenModal }) => (
    <tr>
        <td>
            <button className="modal-button" onClick={() => onOpenModal(metric)}>
                <FaPlus />
            </button>
        </td>
        <td>
            <div className="expand-column">
                <button onClick={() => onToggleExpand(metric.metricID)}>
                    {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                </button>{" "}
                {metric.metricID}
            </div>
        </td>
        <td>{metric.metricName}</td>
        {Array(13).fill("").map((_, i) => (
            <td key={i}></td>
        ))}
    </tr>
));

export default MetricRow;

import React, { memo } from "react";

const ExpandedRow = memo(({ row }) => (
    <tr>
        <td></td>
        <td></td>
        <td>{row.name}</td>
        <td>{row.geo}</td>
        <td>{row.lob}</td>
        <td>{row.rtm}</td>
        <td>{row.sameDayDomestic}</td>
        <td>{row.metricType}</td>
        <td>{row.metricFloor}</td>
        <td>{row.metricCeiling}</td>
        <td>{row.metricWeight}</td>
        <td>{row.benchmarkValue}</td>
        <td>{row.benchmarkCeiling}</td>
        <td>{row.benchmarkLogicType}</td>
        <td>{row.metricSign}</td>
        <td>{row.rankingMetric}</td>
    </tr>
));

export default ExpandedRow;

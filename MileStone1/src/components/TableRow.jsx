import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

const TableRow = ({
  country,
  index,
  expandedRows,
  expandAll,
  toggleRow,
  handleActionClick,
}) => {
  const isExpanded = expandAll || expandedRows.includes(index);

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>
          <button className="action-button" onClick={() => handleActionClick(country)}>
            <FaPlusCircle />
          </button>
        </td>
        <td onClick={() => toggleRow(index)}>
          {isExpanded ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
          {country.Country_Name}
        </td>
        <td colSpan={4}></td>
      </tr>
      {isExpanded &&
        country.states.map((state, stateIndex) => (
          <tr key={`${index}-${stateIndex}`}>
            <td></td>
            <td></td>
            <td></td>
            <td>{state.name}</td>
            <td>{state.capital}</td>
            <td>{state.population?.toLocaleString() || "-"}</td>
            <td>{state.hdi || "-"}</td>
          </tr>
        ))}
    </>
  );
};

export default TableRow;

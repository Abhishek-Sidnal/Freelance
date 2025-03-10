// DataTable.js
import React from 'react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import './DataTable.scss'
import { TbCaretUpDownFilled } from 'react-icons/tb';
const DataTable = ({ displayedKeys, sortedData, sortConfig, handleSort }) => {
    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    {displayedKeys.map(key => (
                        <th key={key} onClick={() => handleSort(key)}>
                            {key}
                            {sortConfig.key === key ? (
                                sortConfig.direction === "asc" ? <FaCaretUp /> : <FaCaretDown />
                            ) : (
                                <TbCaretUpDownFilled style={{ opacity: 0.5 }} />
                            )}
                        </th>
                    ))}
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map(product => (
                    <tr key={product.productName}>
                        <td>{product.productName}</td>
                        {displayedKeys.map(key => <td key={key}>{product[key]}</td>)}
                        <td>{displayedKeys.reduce((sum, key) => sum + product[key], 0)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
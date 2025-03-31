import React from 'react';
import * as XLSX from 'xlsx';

const Tableeee = () => {
  const exportToExcel = () => {
    // Get the table element
    const table = document.getElementById('table-to-excel');
    
    // Convert the table to a worksheet
    const ws = XLSX.utils.table_to_sheet(table);
    
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Export the workbook to an Excel file
    XLSX.writeFile(wb, 'exported_table.xlsx');
  };

  return (
    <div>
      <button onClick={exportToExcel}>Export as Excel</button>
      <table id="table-to-excel" border="1">
        <thead>
          <tr>
            <th colSpan="3">name</th>
          </tr>
          <tr>
            <th colSpan="3">aaa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Abhi</td>
            <td>apsi@gmail.com</td>
            <td>9876543210</td>
          </tr>
          <tr>
            <td>Abhi</td>
            <td>apsi@gmail.com</td>
            <td>9876543210</td>
          </tr>
          <tr>
            <td>Abhi</td>
            <td>apsi@gmail.com</td>
            <td>9876543210</td>
          </tr>
          <tr>
            <td>Abhi</td>
            <td>apsi@gmail.com</td>
            <td>9876543210</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Tableeee;

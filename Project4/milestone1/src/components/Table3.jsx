import React from 'react';
import './TableWithBody.css'; // Assuming you have an external CSS file

const generateRandomValue = () => Math.round(Math.random() * 10000);

const DataRow = ({ label }) => (
  <tr>
    <td>{label}</td>
    <td>{generateRandomValue()}</td>
    <td>{generateRandomValue()}</td>
    <td>{generateRandomValue()}</td>
    <td>{generateRandomValue()}</td>
    <td>{generateRandomValue()}</td>
    <td>{generateRandomValue()}</td>
    <td>{generateRandomValue()}</td>
    <td>{generateRandomValue()}</td>
    <td>{generateRandomValue()}</td>
  </tr>
);

function TableWithBody() {
  return (
    <table border="1" className="full-width-table">
      <thead>
        <tr>
          <th colSpan="3" className="header-table">
            <table border="1" className="full-width-table">
              <tbody>
                <tr>
                  <td>Country</td>
                  <td>Ways to Buy</td>
                  <td>As of Date</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>[ALL]</td>
                  <td style={{ textAlign: 'center' }}>[ALL]</td>
                  <td style={{ textAlign: 'center' }}>09/16/2024</td>
                </tr>
              </tbody>
            </table>
          </th>
          <th colSpan="3">
            <table border="1" className="full-width-table">
              <tbody>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>Till Day 8 (EOD)</td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    09/09/2024 - 09/16/2024
                  </td>
                </tr>
              </tbody>
            </table>
          </th>
          <th colSpan="3">
            <table border="1" className="full-width-table">
              <tbody>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>Till Day 7 (EOD)</td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    09/09/2024 - 09/15/2024
                  </td>
                </tr>
              </tbody>
            </table>
          </th>
          <th colSpan="3">
            <table border="1" className="full-width-table">
              <tbody>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>Till Day 6 (EOD)</td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    09/09/2024 - 09/14/2024
                  </td>
                </tr>
              </tbody>
            </table>
          </th>
        </tr>
        <tr className="header-row">
          <td>Country</td>
          <td>Ways to Buy</td>
          <td>Bags Status</td>
          <td>GBI</td>
          <td>AOS</td>
          <td>FSI</td>
          <td>GBI</td>
          <td>AOS</td>
          <td>FSI</td>
          <td>GBI</td>
          <td>AOS</td>
          <td>FSI</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowSpan={12}>row.country</td>
          <td rowSpan={12}>row.waysToBuy</td>
        </tr>
        <DataRow label="Bags Approved" />
        <DataRow label="Bags Pending" />
        <DataRow label="Bags Declined" />
        <DataRow label="Total Bags Created" />
        <DataRow label="Bags Deleted" />
        <DataRow label="Mass Deleted" />
        <DataRow label="Total Bags Deleted" />
        <DataRow label="Bags Ordered" />
        <DataRow label="Payments Failed" />
        <DataRow label="Total Bags Ordered" />
        <DataRow label="Open Bags" />
      </tbody>
    </table>
  );
}

export default TableWithBody;

import React from 'react';

const Table = () => {
  return (
    <div>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: '#F1C40F', textAlign: 'center' }}>Country</th>
            <th style={{ backgroundColor: '#F1C40F', textAlign: 'center' }}>ways to buy </th>
            <th style={{ backgroundColor: '#F1C40F', textAlign: 'center' }}>as of date</th>
          </tr>
          <tr>
            <th style={{ backgroundColor: '#F39C12', textAlign: 'center' }}>[ALL]</th>
            <th style={{ backgroundColor: '#F39C12', textAlign: 'center' }}>[ALL]</th>
            <th style={{ backgroundColor: '#F39C12', textAlign: 'center' }}>09/16/2024</th>
          </tr>
          <tr>
            <th style={{ backgroundColor: '#F1C40F', textAlign: 'center' }}>Country</th>
            <th style={{ backgroundColor: '#F1C40F', textAlign: 'center' }}>Ways to Buy</th>
            <th style={{ backgroundColor: '#F1C40F', textAlign: 'center' }}>Bags Status</th>
          </tr>
        </thead>


        <tbody>
          <tr>
            <td rowSpan="11" style={{ verticalAlign: 'top', textAlign: 'center' }}>[ALL]</td>
            <td rowSpan="11" style={{ verticalAlign: 'top', textAlign: 'center' }}>[ALL]</td>
            <td>
              <table style={{ width: '100%' }} border="1">
                <tbody>
                  <tr><td>Bags Approved</td></tr>
                  <tr><td>Bags Pending</td></tr>
                  <tr><td>Bags Declined</td></tr>
                  <tr><td>Total Bags Created</td></tr>
                  <tr><td>Bags Deleted</td></tr>
                  <tr><td>Mass Deleted</td></tr>
                  <tr><td>Total Bags Deleted</td></tr>
                  <tr><td>Bags Ordered</td></tr>
                  <tr><td>Payments Failed</td></tr>
                  <tr><td>Total Bags Ordered</td></tr>
                  <tr><td>Open Bags</td></tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;

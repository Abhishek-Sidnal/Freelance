import React from 'react';
import Filter from './Filter';

function TableWithBody() {


    return (
        <div className="">
            {/* <Filter/> */}
            <table border="1" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th colSpan="3" style={{ backgroundColor: 'yellow' }}>
                            <table border="1" style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '33.33%' }}>Country</td>
                                        <td style={{ width: '33.33%' }}>Ways to Buy</td>
                                        <td style={{ width: '33.33%' }}>As of Date</td>
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
                            <table border="1" style={{ width: '100%' }}>
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
                            <table border="1" style={{ width: '100%' }}>
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
                            <table border="1" style={{ width: '100%' }}>
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
                            </table >
                        </th>
                    </tr>
                    <tr style={{ backgroundColor: '#0070C0', color: 'white' }}>
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
                        <td rowSpan={11}>row.country</td>
                        <td rowSpan={11} >row.waysToBuy</td>
                        <td>Bags Approved</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>Bags Pending</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>Bags Declined</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>	Total Bags Created</td>
                        <td>	{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>	Bags Deleted</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>Mass Deleted</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>Total Bags Deleted</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>Bags Ordered</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>Payments Failed</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>Total Bags Ordered</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>
                    <tr>
                        <td>Open Bags</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                        <td>{Math.round(Math.random() * 10000)}</td>
                    </tr>

                </tbody>
            </table >
            
        </div>
    );
}

export default TableWithBody;
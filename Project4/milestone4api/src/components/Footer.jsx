import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Footer = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [timestamps, setTimestamps] = useState({
        lastRefreshTime: '',
        aosLastSnapshotTime: '',
        gbiLastSnapshotTime: '',
        fsiLastSnapshotTime: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(apiUrl);
                console.log('Response:', response.data);  // Log the whole response to check it
                const result = response.data.result[0];  // Extract the first record from result
                if (result) {
                    setTimestamps({
                        lastRefreshTime: result.Last_Refresh_Time,
                        aosLastSnapshotTime: result.AOS_Last_Snapshot_Time,
                        gbiLastSnapshotTime: result.GBI_Last_Snapshot_Time,
                        fsiLastSnapshotTime: result.FSI_Last_Snapshot_Time
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, [apiUrl]); // Add apiUrl as a dependency

    return (
        <div className='footer' >

            <div className="timestamp">
                <p>Last Refresh Time (PST) :</p>
                <p> {timestamps.lastRefreshTime}</p>
            </div>

            <div className="timestamp">
                <p>
                    AOS Last Snapshot Time (PST) :
                </p>
                <p>
                    {timestamps.aosLastSnapshotTime}
                </p>
            </div>

            <div className="timestamp">
                <p>

                    GBI Last Snapshot Time (PST) :
                </p>
                <p>
                    {timestamps.gbiLastSnapshotTime}
                </p>
            </div>

            <div className="timestamp">
                <p>
                    FSI Last Snapshot Time (PST) :
                </p>
                <p>
                    {timestamps.fsiLastSnapshotTime}
                </p>
            </div>

        </div>
    );
}

export default Footer;

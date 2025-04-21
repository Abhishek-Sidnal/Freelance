import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import Loader from './Loader';

// Custom hook for fetching the timestamp data
const useFetchTimestamps = (apiUrl) => {
    const [timestamps, setTimestamps] = useState({
        lastRefreshTime: '',
        aosLastSnapshotTime: '',
        gbiLastSnapshotTime: '',
        fsiLastSnapshotTime: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null); // Reset previous errors
            const response = await axios.get("/Reports_Refresh_Timestamp");
            const result = response.data.result[0];
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
            setError('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    // Trigger the data fetch only if necessary
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    return { timestamps, loading, error };
};

const Footer = () => {
    const apiUrl = import.meta.env.VITE_API_FOOTER;
    const { timestamps, loading, error } = useFetchTimestamps(apiUrl);

    return (
        <div className='footer'>
            {loading ? (
                <Loader />
            ) : error ? (
                <div>
                    <p className='error-message '>{error}</p>
                    <button className='retry-button' onClick={() => window.location.reload()}>Retry</button>
                </div>
            ) : (
                <>
                    <div className="timestamp">
                        <p>Last Refresh Time (PST) :</p>
                        <p>{timestamps.lastRefreshTime}</p>
                    </div>

                    <div className="timestamp">
                        <p>AOS Last Snapshot Time (PST) :</p>
                        <p>{timestamps.aosLastSnapshotTime}</p>
                    </div>

                    <div className="timestamp">
                        <p>GBI Last Snapshot Time (PST) :</p>
                        <p>{timestamps.gbiLastSnapshotTime}</p>
                    </div>

                    <div className="timestamp">
                        <p>FSI Last Snapshot Time (PST) :</p>
                        <p>{timestamps.fsiLastSnapshotTime}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Footer;

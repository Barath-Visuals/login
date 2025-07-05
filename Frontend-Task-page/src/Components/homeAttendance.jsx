import React from 'react';
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/homeAttendance.module.scss"
import axios from 'axios';

export default function HomeAttendance() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [token, setToken] = useState(localStorage.getItem('token'));
    console.log("Username:", username);


    useEffect(() =>{
        const fetchLogs = async () =>{
            try {
                const response = await axios.get(`http://localhost:8000/attendance_logs/${username}`, {
                        headers: {Authorization: `Bearer ${token}`,
                    }
                });
                setLogs(response.data.logs);
            } catch (error) {
                setError(error.response.data?.detail || "error fetching logs");
            } finally{
                setLoading(false);
            }
        }

        if(token) {
            fetchLogs();
        } else{
            setError("user not found")
            setLoading(false);
        }
    }, [username, token]);

    if (loading) return <div>logging logs....</div>
    if (error) return <div>Error {error}</div>

    return(
        <div className={styles.Container}>
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Session</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => {
                        return(
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{new Date(log.login_time).toLocaleDateString()}</td>
                                <td>{new Date(log.login_time).toLocaleTimeString()}</td>
                                <td>{log.arrival_status}</td>
                                <td>{log.login_type}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
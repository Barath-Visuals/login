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
    //console.log("Username:", username);

    const formStatus = (status) =>{
       if(!status) return "";
       return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase()); 
    }

    const formatIst = (isoString) => {
    // Force parse to correct timestamp
        const timestamp = Date.parse(isoString);
        const date = new Date();

        const formatDate = new Intl.DateTimeFormat('en-IN', {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata",
        }).format(date).toUpperCase();

        const formatTime = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata",
        }).format(date);

        return { formatTime, formatDate };
    };


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
            <table className={styles.table}>
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
                    {logs
                    // this line changes the table element to descending order
                        // .sort((a,b) => new Date(b.login_time) - new Date(a.login_time))
                        .map((log, index) => {
                            const { formatDate, formatTime } = formatIst(log.login_time);
                            return(
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate}</td>
                                    <td>{formatTime}</td>
                                    <td
                                        className={log.arrival_status === "on_time" ? styles.onTime : log.arrival_status === "late" ? styles.late : log.arrival_status === "leave" ? styles.leave : ""}
                                    >
                                        <span className={styles.statusText}>{formStatus(log.arrival_status)}</span>
                                        <span className={styles.statusDot}></span>
                                    </td>
                                    <td className={styles.Session}>
                                        <span className={styles.fullText}>
                                            {log.login_type === "morning" ? "Morning" : log.login_type === "afternoon" ? "Afternoon" : "Leave"}
                                        </span>
                                        <span className={styles.shortText}>
                                            {log.login_type === "morning" ? "FN" : log.login_type === "afternoon" ? "AN" : "-L-"}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
    )
}
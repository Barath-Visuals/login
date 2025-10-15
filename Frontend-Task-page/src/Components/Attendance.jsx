import React from 'react';
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/Attendance.module.scss"
import axios from 'axios';
import clsx from "clsx";

export default function Attendance() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [name, setName] = useState('')
    
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
        if (!isoString) return { formatTime: "-", formatDate: "-" };

        const date = new Date(isoString);

        if (isNaN(date.getTime())) {
            return { formatTime: "-", formatDate: "-" };
        }

        const formatDate = new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(date);

        const formatTime = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(date);

        console.log("✅ Displaying IST:", formatDate, formatTime);
        return { formatTime, formatDate };
    };

    useEffect(() =>{
        const fetchLogs = async () =>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}attendance_logs/${username}`, {
                        headers: {Authorization: `Bearer ${token}`,
                    }
                });
                //console.log("welcome",response.data.name)
                setLogs(response.data.logs || []);
                setName(response.data.name || "")
            } catch (error) {
                setError(error.response?.data?.detail || "Error fetching logs");
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
        <>
            <div className={styles.homeAttendance_name}>
                <span className={styles.homeAttendance_title}>Attendance Logs for {name}</span>
            </div>

            <div className={styles.homeAttendance_container}>
                <table className={styles.homeAttendance_table}>
                    <thead className={styles.homeAttendance_thead}>
                    <tr className={styles.homeAttendance_tr}>
                        <th className={styles.homeAttendance_th}>S.No</th>
                        <th className={styles.homeAttendance_th}>Date</th>
                        <th className={styles.homeAttendance_th}>Sign In</th>
                        <th className={styles.homeAttendance_th}>Sign Out</th>
                        <th className={styles.homeAttendance_th}>Status</th>
                        <th className={styles.homeAttendance_th}>Session</th>
                    </tr>
                    </thead>
                    <tbody className={styles.homeAttendance_tbody}>
                    {(Array.isArray(logs) ? logs : []).map((log, index) => {
                        const { formatDate, formatTime: loginTime } = log.login_time
                        ? formatIst(log.login_time)
                        : { formatDate: "-", formatTime: "-" };

                        const logoutTime = log.logout_time
                        ? formatIst(log.logout_time).formatTime
                        : "-";

                        return (
                        <tr key={index} className={styles.homeAttendance_tr}>
                            <td className={styles.homeAttendance_td}>{index + 1}</td>
                            <td className={styles.homeAttendance_td}><span className={styles.homeAttendance_dates}>{formatDate}</span></td>
                            <td className={styles.homeAttendance_td}><span className={styles.homeAttendance_dates}>{loginTime}</span></td>
                            <td className={styles.homeAttendance_td}><span className={styles.homeAttendance_dates}>{logoutTime}</span></td>

                            <td
                            className={`${styles.homeAttendance_td} ${
                                log.arrival_status === "on_time"
                                ? styles.homeAttendance_onTime
                                : log.arrival_status === "late"
                                ? styles.homeAttendance_late
                                : log.arrival_status === "leave"
                                ? styles.homeAttendance_leave
                                : ""
                            }`}
                            >
                            <span className={styles.homeAttendance_statusText}>
                                {formStatus(log.arrival_status)}
                            </span>
                            <span className={styles.homeAttendance_statusDot}></span>
                            </td>

                            <td
                            className={`${styles.homeAttendance_td} ${styles.homeAttendance_session}`}
                            >
                            <span className={styles.homeAttendance_fullText}>
                                {log.login_type === "morning"
                                ? "Morning"
                                : log.login_type === "afternoon"
                                ? "Afternoon"
                                : "Leave"}
                            </span>
                            <span className={styles.homeAttendance_shortText}>
                                {log.login_type === "morning"
                                ? "FN"
                                : log.login_type === "afternoon"
                                ? "AN"
                                : "-L-"}
                            </span>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

        </>
    )
}
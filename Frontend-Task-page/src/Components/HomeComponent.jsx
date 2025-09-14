import React from "react";
import { useEffect, useState } from 'react';
import Dashboard from "./dashboard.jsx";
import HomeAttendance from "./homeAttendance.jsx";
import HomeEntry from "./HomeEntry.jsx";
import styles from "../StyleSCSS/joint.module.scss"
import axios from "axios";

export default function HomeComponent ({role}) {
    const [attendanceSummary, setAttendanceSummary] = useState(null);
    const [logs, setLogs] = useState([]);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
        try {
            const summaryRes = await axios.get(
            "http://127.0.0.1:8000/attendance_summary",
            { headers: { Authorization: `Bearer ${token}` } }
            );
            setAttendanceSummary(summaryRes.data);

            const logsRes = await axios.get(
            `http://localhost:8000/attendance_logs/${username}`,
            { headers: { Authorization: `Bearer ${token}` } }
            );
            setLogs(logsRes.data.logs);

            if (role === "Designer") {
            const entriesRes = await axios.get(`http://localhost:8000/clientDashboard`, {
                params: { limit: 16 },
            });
            setEntries(entriesRes.data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
        };

        if (token) fetchData();
    }, [role, token, username]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    return(
        <div className={styles.contentArea}>
            <div className={styles.content}>
                <h1 className={styles.sty}>DashBoard</h1>
                <Dashboard summary={attendanceSummary}/>
            </div>
            <div className={styles.contentSpace}>
                <div className={styles.contents}>
                    <h1 className={styles.sty}>Attendance</h1>
                    <HomeAttendance logs={logs}/>
                </div>
                { role === "Designer" &&(
                   <div className={styles.contents}>
                        <h1 className={styles.sty}>Entries</h1>
                        <HomeEntry entries={entries}/>
                    </div> 
                )}
                
            </div>
        </div>
    )
}
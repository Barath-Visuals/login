import React from "react";
import { useEffect, useState } from 'react';
import axios from "axios";
import styles from "../StyleSCSS/dashboard.module.scss";

export default function HomeEntry () {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardEntries = async () => {
        try{

            const response = await axios.get(`http://localhost:8000/clientDashboard`, {
                params: {
                    limit : 10
                }
            })
            setEntries(response.data);
        }catch (error){
            console.log(error);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardEntries();
    }, []);

    if (loading) return <p className="">Loading...</p>;
    return(
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Client Name</th>
                        <th>Design Type</th>
                        <th>Folder Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.client_name}</td>
                            <td>{entry.design_type}</td>
                            <td>{entry.folder_type}</td>
                            <td>{entry.start_date}</td>
                            <td>{entry.end_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
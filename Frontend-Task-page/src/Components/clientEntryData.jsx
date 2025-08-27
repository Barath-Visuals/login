import React from "react";
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/data.module.scss"
import axios from "axios";

export default function ClientEntryData ({ searchText, reload}) {
    const [clientData, setClientData] = useState([])
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const fetchClientData = async () =>{
        setLoading(true);
        const StartTime = Date.now()
        try {
            const response = await axios.get(`http://localhost:8000/clientDashboard`,{
                    headers: {Authorization: `Bearer ${token}`,
                },
                params: {
                    //client_name: clientNameSearchText || undefined,
                    //folder_type: folderTypeSearchText || undefined,
                    search: searchText || undefined,
                    skip: 0,
                    limit: undefined
                }
            });

            const elasped = Date.now() - StartTime;
            const timeTaken = Math.max(0, 800 - elasped)
            await new Promise(resolve => setTimeout(resolve, timeTaken));
            setClientData(response.data)
        } catch(error){
            console.log(error.response?.data?.detail || "fetch error")
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchClientData();

    },[token, reload, searchText]);

    const formatIST = (isoString) => {
        const date = new Date(isoString); // use the passed value
        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata"
        }).format(date);
    };

    
    return(
        <div className={styles.entryTable__container}>
            <table className={styles.entryTable__table}>
                <thead className={styles.entryTable__thead}>
                <tr className={styles.entryTable__theadRow}>
                    <th className={styles.entryTable__th}>S.No</th>
                    <th className={styles.entryTable__th}>Client</th>
                    <th className={styles.entryTable__th}>Folder</th>
                    <th className={styles.entryTable__th}>Design</th>
                    <th className={styles.entryTable__th}>Start Date</th>
                    <th className={styles.entryTable__th}>End date</th>
                </tr>
                </thead>
                <tbody className={styles.entryTable__tbody}>
                    {loading ? (
                        <div className={styles.loader_wrapper}>
                            <div className={styles.loader}>
                                <div></div><div></div><div></div><div></div>
                                <div></div><div></div><div></div><div></div>
                            </div>
                        </div>
                    ) : (
                        clientData.length === 0 ? (
                            <tr className={styles.entryTable__emptyRow}>
                            <td className={styles.entryTable__emptyCell} colSpan="6">No data available</td>
                            </tr>
                        ) : (
                            clientData.map((entry, index) => (
                                <tr className={styles.entryTable__row} key={index}>
                                    <td className={styles.entryTable__td}>{index + 1}</td>
                                    <td className={styles.entryTable__td}>{entry.client_name}</td>
                                    <td className={styles.entryTable__td}>{entry.folder_type}</td>
                                    <td className={styles.entryTable__td}>{entry.design_type}</td>
                                    <td className={styles.entryTable__td}>{formatIST(entry.start_date)}</td>
                                    <td className={styles.entryTable__td}>{formatIST(entry.end_date)}</td>
                                </tr>
                            ))
                        )
                    )}
                </tbody>
            </table>
        </div>
    )
}
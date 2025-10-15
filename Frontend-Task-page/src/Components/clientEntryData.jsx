import React from "react";
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/data.module.scss"
import clsx from "clsx";
import useDebounce from "../hooks/debounceDearch";
import axios from "axios";

export default function ClientEntryData ({onEntryUpdated, searchText, reload, startDate, endDate}) {
    const [clientData, setClientData] = useState([])
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [editingClient, setEditingClient] = useState(null);
    const [editStart, setEditStart] = useState("");
    const [editEnd, setEditEnd] = useState("");
    const debounceSearch = useDebounce(searchText, 2000);

    useEffect(() => {
        if (!token) return;

        const controller = new AbortController();
        fetchClientData(debounceSearch, controller.signal);
        return() => controller.abort()

    },[token, reload, debounceSearch]);

    const fetchClientData = async (debouncedValue, signal) =>{
        setLoading(true);
        const StartTime = Date.now()
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_PATH}clientDashboard`,{
                    headers: {Authorization: `Bearer ${token}`,
                },
                params: {
                    //client_name: clientNameSearchText || undefined,
                    //folder_type: folderTypeSearchText || undefined,
                    start_date : startDate || undefined,
                    end_date : endDate || undefined,
                    search: debouncedValue || undefined,
                    skip: 0,
                    limit: undefined
                },
                signal,
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

    const handleUpdate = async(client) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_PATH}clientEntry/${client.entry_id}`, {
                start_date: editStart,
                end_date: editEnd
            }, 
            {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setClientData(
                (prev) => prev.map(
                    (c) => c.entry_id === client.entry_id ? 
                    {...c, start_date : editStart, end_date : editEnd} : 
                c
                )
            )

            setEditingClient(null);
            setEditStart("");
            setEditEnd("");

            if (onEntryUpdated) onEntryUpdated("Edited Successfully", 200)
            
        } catch(err) {
            console.error("update error", err)

            if (onEntryUpdated) onEntryUpdated("Update Failed", 500);
        }
    }
    

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
                    <th className={styles.entryTable__th}>Action</th>
                </tr>
                </thead>
                <tbody className={styles.entryTable__tbody}>
                    {loading ? (
                        <tr>
                            <td>
                                <div className={styles.loader_wrapper}>
                                    <div className={styles.loader}>
                                        <div></div><div></div><div></div><div></div>
                                        <div></div><div></div><div></div><div></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        clientData.length === 0 ? (
                            <tr className={styles.entryTable__emptyRow}>
                            <td className={styles.entryTable__emptyCell} style={{textAlign : "center", padding : "10px"}} colSpan="7"><span className={styles.empty}>No data available</span></td>
                            </tr>
                        ) : (
                            clientData.map((entry, index) => {
                                const isEditing = editingClient === entry.entry_id;
                                return(

                                <tr className={styles.entryTable__row} key={index}>
                                    <td className={styles.entryTable__td}>{index + 1}</td>
                                    <td className={styles.entryTable__td}>{entry.client_name}</td>
                                    <td className={styles.entryTable__td}>{entry.folder_type}</td>
                                    <td className={styles.entryTable__td}>{entry.design_type}</td>
                                    <td className={clsx(styles.entryTable__td, styles.start_date)}>
                                        {isEditing ? 
                                            (
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={editStart}
                                                    onChange={(e) => setEditStart(e.target.value)}
                                                />
                                            ) : (
                                                <>
                                                    <span className={styles.editingStartDate}>
                                                        {formatIST(entry.start_date)}
                                                    </span>
                                                </>
                                            )
                                        }
                                    </td>
                                    <td className={clsx(styles.entryTable__td, styles.end_date)}>
                                        {isEditing ? (
                                           <input
                                                type="date"
                                                value={editEnd}
                                                onChange={(e) => setEditEnd(e.target.value)}
                                            />
                                        ) : (
                                            <>
                                                <span className={styles.editingStartDate}>
                                                    {entry.end_date ? formatIST(entry.end_date): "-"}
                                                </span>
                                            </>
                                        )}
                                    </td>
                                    <td className={styles.entryTable__td}>
                                        {isEditing ? (
                                                <>
                                                    <div className={styles.saveableButton}>
                                                        <button className={styles.saveButton} onClick={() => handleUpdate(entry)} 
                                                            disabled={editStart === (entry.start_date ? entry.start_date.split("T")[0] : "") && editEnd === (entry.end_date ? entry.end_date.split("T")[0] : "")}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                                                                <mask 
                                                                    id={`mask0_${entry.client_id}`}
                                                                    style={{ maskType: "luminance" }}
                                                                    maskUnits="userSpaceOnUse"
                                                                    x="0" y="0" width="20" height="20"
                                                                >
                                                                    <path d="M1 2.5C1 2.10218 1.15804 1.72064 1.43934 1.43934C1.72064 1.15804 2.10218 1 2.5 1H15.1405L19 4.6035V17.5C19 17.8978 18.842 18.2794 18.5607 18.5607C18.2794 18.842 17.8978 19 17.5 19H2.5C2.10218 19 1.72064 18.842 1.43934 18.5607C1.15804 18.2794 1 17.8978 1 17.5V2.5Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.004 1L10 4.6925C10 4.8625 9.776 5 9.5 5H5.5C5.224 5 5 4.8625 5 4.6925V1" fill="black"/>
                                                                    <path d="M10.004 1L10 4.6925C10 4.8625 9.776 5 9.5 5H5.5C5.224 5 5 4.8625 5 4.6925V1H10.004Z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
                                                                    <path d="M2.5 1H15.1405" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                    <path d="M5 11H15M5 15H10.004" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </mask>
                                                                <g mask={`url(#mask0_${entry.client_id})`}>
                                                                    <path d="M-2 -2H22V22H-2V-2Z" fill="#5CE65C"/>
                                                                </g>
                                                            </svg>
                                                        </button>
                                                        <button className={styles.cancleableButton} onClick={() => {
                                                            setEditingClient(null)
                                                            setEditStart(entry.start_date ? entry.start_date.split("T")[0] : "");
                                                            setEditEnd(entry.end_date ? entry.end_date.split("T")[0] : "");
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                                                                <path d="M16 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18 1.46957 17.7893 0.960859 17.4142 0.585786C17.0391 0.210714 16.5304 0 16 0ZM12.6 14L9 10.4L5.4 14L4 12.6L7.6 9L4 5.4L5.4 4L9 7.6L12.6 4L14 5.4L10.4 9L14 12.6L12.6 14Z" fill="#FF2C2C"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <button className={styles.editableButton}
                                                    onClick={() => {
                                                    setEditingClient(entry.entry_id);
                                                    setEditStart(entry.start_date ? entry.start_date.split("T")[0] : "");
                                                    setEditEnd(entry.end_date ? entry.end_date.split("T")[0] : "");
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                                                        <path d="M16 0C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V16C18 16.5304 17.7893 17.0391 17.4142 17.4142C17.0391 17.7893 16.5304 18 16 18H2C1.46957 18 0.960859 17.7893 0.585786 17.4142C0.210714 17.0391 0 16.5304 0 16V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H16ZM13.7 6.35C13.92 6.14 13.92 5.79 13.7 5.58L12.42 4.3C12.3705 4.24765 12.3108 4.20594 12.2446 4.17744C12.1784 4.14895 12.1071 4.13425 12.035 4.13425C11.9629 4.13425 11.8916 4.14895 11.8254 4.17744C11.7592 4.20594 11.6995 4.24765 11.65 4.3L10.65 5.3L12.7 7.35L13.7 6.35ZM4 11.94V14H6.06L12.12 7.94L10.06 5.88L4 11.94Z" fill="#9747FF"/>
                                                    </svg>
                                                </button>
                                            )
                                        }
                                    </td>
                                </tr>
                                )
                            })
                        )
                    )}
                </tbody>
            </table>
        </div>
    )
}
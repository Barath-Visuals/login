import React from "react";
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/Client.module.scss"
import ClientForm from "./ClentEntryForm.jsx"
import ClientEntryData from "./clientEntryData.jsx"
import { getUserRole } from "../utils/auth.jsx";
//import axios from 'axios';
import AlertMessage from "./Alert_Msg.jsx";

export default function ClientEntry({}) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [reloadData, setReloadData] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [statusCode, setStatusCode] = useState(200);


    const handleShowPopUp = () =>{
        setShowPopUp(true);
    }

    const handleClosePopUp = () =>{
        setShowPopUp(false);
    }

    const handleSearch = (e) =>{
        setSearchText(e.target.value)
    }

    const handleEntryAdded = (message, status) =>{
        setReloadData(prev => !prev);
        handleClosePopUp();
        setShowAlert(false)

        setTimeout (() => {
            setStatusCode(status);
            setAlertMessage(message);
            setShowAlert(true);
        }, 100)
    }

    const handleFilterToggle = () => setShowFilter((prev) => !prev);


    const role = getUserRole()


    return(
        <div className={styles.Container}>
            <div className={styles.Header}>
                <div className={styles.title}>
                    <h1>Entries</h1>
                </div>
                    <div className={styles.leftContent}>
                        <div className={styles.container_header}>

                            <div className={styles.search}>
                                <input
                                type="text"
                                placeholder="Search Entries..."
                                onChange={handleSearch}
                                />
                                <button className={styles.button}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 27 27" fill="none">
                                        <path d="M24.9 27L15.45 17.55C14.7 18.15 13.8375 18.625 12.8625 18.975C11.8875 19.325 10.85 19.5 9.75 19.5C7.025 19.5 4.719 18.556 2.832 16.668C0.945001 14.78 0.00100079 12.474 7.93651e-07 9.75C-0.000999206 7.026 0.943001 4.72 2.832 2.832C4.721 0.944 7.027 0 9.75 0C12.473 0 14.7795 0.944 16.6695 2.832C18.5595 4.72 19.503 7.026 19.5 9.75C19.5 10.85 19.325 11.8875 18.975 12.8625C18.625 13.8375 18.15 14.7 17.55 15.45L27 24.9L24.9 27ZM9.75 16.5C11.625 16.5 13.219 15.844 14.532 14.532C15.845 13.22 16.501 11.626 16.5 9.75C16.499 7.874 15.843 6.2805 14.532 4.9695C13.221 3.6585 11.627 3.002 9.75 3C7.873 2.998 6.2795 3.6545 4.9695 4.9695C3.6595 6.2845 3.003 7.878 3 9.75C2.997 11.622 3.6535 13.216 4.9695 14.532C6.2855 15.848 7.879 16.504 9.75 16.5Z" fill="black"/>
                                    </svg>
                                </button>
                            </div>

                            <div className={styles.filterWrapper}>
                                <button className={styles.filter} onClick={handleFilterToggle}>
                                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 18 20" fill="none">
                                        <path d="M9 17H1M17 3L14 3M17 17H13M10 3H1M4 10H1M17 10H8" stroke="white" stroke-linecap="round"/>
                                        <path d="M13 17C13 15.8954 12.1046 15 11 15C9.89543 15 9 15.8954 9 17C9 18.1046 9.89543 19 11 19C12.1046 19 13 18.1046 13 17Z" stroke="white" stroke-linecap="round"/>
                                        <path d="M8 10C8 8.89543 7.10457 8 6 8C4.89543 8 4 8.89543 4 10C4 11.1046 4.89543 12 6 12C7.10457 12 8 11.1046 8 10Z" stroke="white" stroke-linecap="round"/>
                                        <path d="M14 3C14 1.89543 13.1046 1 12 1C10.8954 1 10 1.89543 10 3C10 4.10457 10.8954 5 12 5C13.1046 5 14 4.10457 14 3Z" stroke="white" stroke-linecap="round"/>
                                    </svg>
                                </button>

                                {showFilter && (
                                    <div className={`${styles.filterDropdown} ${showFilter ? styles.show : ""}`}>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                        <div className={styles.button_Containers}>
                                            <button className={styles.applyFilterBtn} onClick={() => setReloadData((prev) => !prev)}>
                                                Apply
                                            </button>
                                            <button className={styles.reload_Button} onClick={() => {
                                                    setStartDate("");
                                                    setEndDate("");
                                                    setReloadData((prev) => !prev);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
                                                    <path d="M16.9331 10.0409C16.7442 11.4809 16.167 12.8423 15.2632 13.9791C14.3595 15.1159 13.1633 15.9853 11.803 16.4939C10.4427 17.0026 8.96964 17.1314 7.54172 16.8665C6.1138 16.6016 4.78492 15.953 3.69761 14.9902C2.6103 14.0275 1.80557 12.7869 1.36973 11.4016C0.933892 10.0162 0.88338 8.53838 1.22362 7.12651C1.56385 5.71464 2.282 4.42202 3.30104 3.38728C4.32007 2.35254 5.60156 1.61471 7.00806 1.25292C10.9071 0.252923 14.9431 2.25992 16.4331 5.99992" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M17 1V6H12" stroke="#ffffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {role !== "Manager" && role !== "HR" ? (
                            <button className={styles.addEntry} onClick={handleShowPopUp}>
                                <span className={styles.icon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 26 26" fill="none">
                                        <path d="M11.1665 14.8333H0.166504V11.1667H11.1665V0.166656H14.8332V11.1667H25.8332V14.8333H14.8332V25.8333H11.1665V14.8333Z" fill="#6c63ff"/>
                                    </svg>
                                </span>
                                <span className={styles.buttonTitle}>Add Entries</span>
                            </button>
                        ) : null }
                    </div>
            </div>
            <div className={styles.client}>
                <ClientEntryData onEntryUpdated={handleEntryAdded}  searchText={searchText} reload={reloadData} startDate={startDate} endDate={endDate} />
            </div>

            {showPopUp && (
                <div className={styles.popUpBoxContain}>
                    <div className={styles.popUpBox}>
                        <div className={styles.button}>
                            <button className={styles.close} onClick={handleClosePopUp}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14 14" fill="none">
                                    <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="black"/>
                                </svg>
                            </button>
                        </div>
                        <ClientForm onEntryAdded={handleEntryAdded}/>
                    </div>
                </div>
            )}

            {showAlert && (
                <AlertMessage
                    message={alertMessage}
                    statusCode={statusCode}
                    duration={3000}
                    onClose={() => setShowAlert(false)}
                />
            )}
        </div>
    )
}
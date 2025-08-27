import React from "react";
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/Client.module.scss"
import ClientForm from "./ClentEntryForm.jsx"
import ClientEntryData from "./clientEntryData.jsx"
//import axios from 'axios';

export default function ClientEntry({}) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [reloadData, setReloadData] = useState(false);

    const handleShowPopUp = () =>{
        setShowPopUp(true);
    }

    const handleClosePopUp = () =>{
        setShowPopUp(false);
    }

    const handleSearch = (e) =>{
        setSearchText(e.target.value)
    }

    const handleEntryAdded = () =>{
        setReloadData(prev => !prev);
        handleClosePopUp();
    }

    const role = localStorage.getItem('role');


    return(
        <div className={styles.Container}>
            <div className={styles.Header}>
                <div className={styles.title}>
                    <h1>Entries</h1>
                </div>
                {role !== "Manager" && role !== "HR" ? (
                    <div className={styles.leftContent}>
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
                        {/* <button className={styles.filter}>
                            <span className={styles.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 27 17" fill="none">
                                    <path d="M5.0625 6.8H21.9375V10.2H5.0625V6.8ZM0 0H27V3.4H0V0ZM10.125 13.6H16.875V17H10.125V13.6Z" fill="#9747FF"/>
                                </svg>
                            </span>
                        </button> */}
                        <button className={styles.addEntry} onClick={handleShowPopUp}>
                            <span className={styles.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 26 26" fill="none">
                                    <path d="M11.1665 14.8333H0.166504V11.1667H11.1665V0.166656H14.8332V11.1667H25.8332V14.8333H14.8332V25.8333H11.1665V14.8333Z" fill="#9747FF"/>
                                </svg>
                            </span>
                            <span className={styles.buttonTitle}>Add Entries</span>
                        </button>
                    </div>
                ) : null }
            </div>
            <div className={styles.client}>
                <ClientEntryData searchText={searchText} reload={reloadData} />
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
        </div>
    )
}
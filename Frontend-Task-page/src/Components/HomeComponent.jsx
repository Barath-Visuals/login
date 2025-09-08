import React from "react";
import { useEffect, useState } from 'react';
import Dashboard from "./dashboard.jsx";
import HomeAttendance from "./homeAttendance.jsx";
import HomeEntry from "./HomeEntry.jsx";
import styles from "../StyleSCSS/joint.module.scss"

export default function HomeComponent ({role}) {
    // console.log("ROLE", role)
    return(
        <div className={styles.contentArea}>
            <div className={styles.content}>
                <h1 className={styles.sty}>DashBoard</h1>
                <Dashboard />
            </div>
            <div className={styles.contentSpace}>
                <div className={styles.contents}>
                    <h1 className={styles.sty}>Attendance</h1>
                    <HomeAttendance />
                </div>
                { role === "Designer" &&(
                   <div className={styles.contents}>
                        <h1 className={styles.sty}>Entries</h1>
                        <HomeEntry />
                    </div> 
                )}
                
            </div>
        </div>
    )
}
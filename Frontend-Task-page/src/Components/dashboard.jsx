import React from 'react';
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/dashboard.module.scss";
import Late from "./Late.jsx";
import Absent from './Absent.jsx';
import Time from './onTime.jsx';
import TotalDay from "./totalDay.jsx"

export default function dashboard({summary}) {
    return(
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardSub}>
                <TotalDay total={summary?.total_days || 0}/>
            </div>
            <div className={styles.dashboardSub}>
                <Time onTime={summary?.on_time_count || 0}/>
            </div>
            <div className={styles.dashboardSub}>
                <Absent absent={summary?.leave_days || 0}/>
            </div>
            <div className={styles.dashboardSub}>
                <Late late={summary?.late_count || 0}/>
            </div>
        </div>
    )
}
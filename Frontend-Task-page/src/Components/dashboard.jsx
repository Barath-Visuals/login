import React from 'react';
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/dashboard.module.scss";
import Late from "./Late.jsx";
import Absent from './Absent.jsx';
import Time from './onTime.jsx';
import TotalDay from "./totalDay.jsx"

export default function dashboard() {
    return(
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardSub}>
                <TotalDay/>
            </div>
            <div className={styles.dashboardSub}>
                <Time/>
            </div>
            <div className={styles.dashboardSub}>
                <Absent/>
            </div>
            <div className={styles.dashboardSub}>
                <Late/>
            </div>
        </div>
    )
}
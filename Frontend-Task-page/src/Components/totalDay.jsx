import React from 'react';
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/dashboard.module.scss";

export default function TotalDays() {
    return(
        <div className={styles.Container}>
            <div className={styles.text}>
                <h1 className={styles.h1}>30</h1>
                <span className={styles.span}>Total Days</span>
            </div>
            <div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="51" height="57" viewBox="0 0 51 57" fill="none">
                        <path d="M14.6665 1.41666V12.25M36.3332 1.41666V12.25" stroke="#9747FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M44.4583 6.83333H6.54167C3.55012 6.83333 1.125 9.25845 1.125 12.25V50.1667C1.125 53.1582 3.55012 55.5833 6.54167 55.5833H44.4583C47.4499 55.5833 49.875 53.1582 49.875 50.1667V12.25C49.875 9.25845 47.4499 6.83333 44.4583 6.83333Z" stroke="#9747FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1.125 23.0833H49.875M14.6667 33.9167H14.6938M25.5 33.9167H25.5271M36.3333 33.9167H36.3604M14.6667 44.75H14.6938M25.5 44.75H25.5271M36.3333 44.75H36.3604" stroke="#9747FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}
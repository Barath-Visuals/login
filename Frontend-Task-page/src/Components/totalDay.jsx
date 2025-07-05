import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../StyleSCSS/dashboard.module.scss";

export default function TotalDays() {
    const [totalDays, setTotalDays] = useState(0);

    useEffect(() => {
        const fetchTotalDays = async () =>{
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/attendance_summary', {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setTotalDays(response.data.total_days)
            } catch (error) {
                console.error('Error fetching total days:', error)
            }
        }
        fetchTotalDays();
    }, []);
    return(
        <div className={styles.Container}>
            <div className={styles.text}>
                <h1 className={styles.h1}>{totalDays}</h1>
                <span className={styles.span}>Total Days</span>
            </div>
            <div className={styles.icon}>
                <div className={styles.icon_n}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="40" viewBox="0 0 36 40" fill="none">
                        <path d="M10.6665 1.66667V9M25.3332 1.66667V9" stroke="#9747FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M30.8333 5.33333H5.16667C3.14162 5.33333 1.5 6.97495 1.5 9V34.6667C1.5 36.6917 3.14162 38.3333 5.16667 38.3333H30.8333C32.8584 38.3333 34.5 36.6917 34.5 34.6667V9C34.5 6.97495 32.8584 5.33333 30.8333 5.33333Z" stroke="#9747FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1.5 16.3333H34.5M10.6667 23.6667H10.685M18 23.6667H18.0183M25.3333 23.6667H25.3517M10.6667 31H10.685M18 31H18.0183M25.3333 31H25.3517" stroke="#9747FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}
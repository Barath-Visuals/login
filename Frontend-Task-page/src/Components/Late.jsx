import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../StyleSCSS/dashboard.module.scss";


export default function LateArrival() {
    const [late, setLate] = useState([0]);

    useEffect(() => {
        const fetchLate = async () => {
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/attendance_summary', {
                    headers: {Authorization: `Bearer ${token}`}
                })
                setLate(response.data.late_count)

            } catch (error) {
                console.error('Error fetching total days:', error)
            }
        }
        fetchLate();
    }, []);
    return(
        <div className={styles.Container}>
            <div className={styles.text}>
                <span className={styles.span}>Late Arrival</span>
                <h1 className={styles.h1}>{late || 0}</h1>
            </div>
            <div className={styles.icon}>
                <div className={styles.icon_n}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="37" height="41" viewBox="0 0 37 41" fill="none">
                        <path d="M18.98 35.5017C19.1633 36.7667 19.5667 37.9583 20.135 39.0217C19.1267 39.2233 18.0817 39.3333 17 39.3333C12.6239 39.3333 8.42709 37.5949 5.33274 34.5006C2.23839 31.4062 0.5 27.2094 0.5 22.8333C0.5 18.4573 2.23839 14.2604 5.33274 11.1661C8.42709 8.07172 12.6239 6.33333 17 6.33333C20.8867 6.33333 24.4617 7.69 27.3033 10L29.9067 7.36C30.8417 8.16667 31.6667 9.01 32.4917 9.945L29.8883 12.5483C32.2278 15.4656 33.5019 19.0938 33.5 22.8333V23.475C32.3267 23.0717 31.1167 22.8333 29.8333 22.8333C29.8333 15.7383 24.095 10 17 10C9.905 10 4.16667 15.7383 4.16667 22.8333C4.16667 29.9283 9.905 35.6667 17 35.6667C17.6783 35.6667 18.32 35.5933 18.98 35.5017ZM15.1667 24.6667H18.8333V13.6667H15.1667V24.6667ZM22.5 0.833334H11.5V4.5H22.5V0.833334ZM36.3233 29.9467L33.72 27.3617L29.8333 31.2483L25.9467 27.3617L23.3617 29.9467L27.2483 33.8333L23.3617 37.72L25.9467 40.3233L29.8333 36.4183L33.72 40.3233L36.3233 37.72L32.4183 33.8333L36.3233 29.9467Z" fill="#000000ff"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}
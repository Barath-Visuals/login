import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../StyleSCSS/dashboard.module.scss";


export default function Absent() {
    const [absent, setAbsent] = useState([0]);

    useEffect(() => {
        const fetchAbsent = async () => {
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/attendance_summary', {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setAbsent(response.data.leave_days)
            } catch (error) {
                console.error('Error fetching attendance summary:', error)
            };
        }
        fetchAbsent();
    }, []);
    return(
        <div className={styles.Container}>
            <div className={styles.text}>
                <span className={styles.span}>Absent</span>
                <h1 className={styles.h1}>{absent || 0}</h1>
            </div>
            <div className={styles.icon}>
                <div className={styles.icon_n}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="37" viewBox="0 0 42 37" fill="none">
                        <path d="M35.3002 36.4333L30.4418 31.6667H10.9168C8.10572 31.6667 5.72239 30.6889 3.76683 28.7333C1.81127 26.7778 0.833496 24.3944 0.833496 21.5833C0.833496 19.2367 1.56072 17.1467 3.01516 15.3133C4.46961 13.4678 6.33961 12.2883 8.62516 11.775C8.72294 11.5306 8.81461 11.2922 8.90016 11.06C9.02239 10.8278 9.11405 10.5772 9.17516 10.3083L1.56683 2.7L4.1335 0.133333L37.8668 33.8667M10.9168 28H26.7752L12.0168 13.2417C11.9557 13.5839 11.9129 13.92 11.8885 14.25C11.8518 14.5311 11.8335 14.8367 11.8335 15.1667H10.9168C9.14461 15.1667 7.63516 15.7961 6.3885 17.055C5.12961 18.3017 4.50016 19.8111 4.50016 21.5833C4.50016 23.3556 5.12961 24.8833 6.3885 26.1667C7.63516 27.3889 9.14461 28 10.9168 28ZM38.6002 29.375L35.9418 26.8083C36.4674 26.3806 36.8585 25.8856 37.1152 25.3233C37.3718 24.7611 37.5002 24.1256 37.5002 23.4167C37.5002 22.1333 37.0541 21.0517 36.1618 20.1717C35.2818 19.2794 34.2002 18.8333 32.9168 18.8333H30.1668V15.1667C30.1668 12.6367 29.2746 10.4733 27.4902 8.67666C25.7057 6.89222 23.5424 6 21.0002 6C20.1813 6 19.3868 6.09778 18.6168 6.29333C17.8468 6.50111 17.1135 6.81889 16.4168 7.24667L13.7585 4.58833C14.8341 3.855 15.9707 3.29278 17.1685 2.90167C18.3785 2.52278 19.6557 2.33333 21.0002 2.33333C24.5813 2.33333 27.6124 3.58 30.0935 6.07333C32.5868 8.55444 33.8335 11.5856 33.8335 15.1667C35.9479 15.4111 37.6957 16.3278 39.0768 17.9167C40.4702 19.4811 41.1668 21.3144 41.1668 23.4167C41.1668 24.6389 40.9407 25.745 40.4885 26.735C40.0241 27.7617 39.3946 28.6417 38.6002 29.375Z" fill="#000000ff"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}
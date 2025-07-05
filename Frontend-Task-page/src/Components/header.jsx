import React, { useState, useEffect } from "react";
import styles from "../StyleSCSS/header.module.scss";
import axios from "axios";

export default function header() {
    const [user, setUser] = useState({});
    
    useEffect(() => {
        const getUser = async () =>{
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/user/profile', {
                    headers: {Authorization: `Bearer ${token}`}
                })
                setUser(response.data);
            } catch (error) {
                console.log(error);
            } 
        }
        getUser(); 
    }, []);

    return(
        <header className={styles.MainContainer}>
            <div className={styles.Container}>
                <div className={styles.LogoIcon}>
                    <div className={styles.Logo}></div>
                </div>
                <div className={styles.ProfileContainer}>
                    <h1 className={styles.EmployeeId}>{user.name ? user.name : "Staff"}</h1>
                    <div className={styles.EmployeeIcon}></div>
                </div>
            </div>
        </header>

    )
}
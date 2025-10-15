import React, { useState, useEffect } from "react";
import styles from "../StyleSCSS/header.module.scss";
import SignInOutComponent from "./SignInOut";
import AttendanceReport from "./Send_Report";
import axios from "axios";
import { getUserRole } from "../utils/auth";

export default function Header() {
    const [user, setUser] = useState({});
    const role = getUserRole();

    // console.log(role)
    
    useEffect(() => {
        const getUser = async () =>{
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/user/profile`, {
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
                    <div className={styles.Logo}>
                        
                    </div>
                </div>
                <div className={styles.header_Container}> 
                    {role !== "admin" ? (
                        <>
                            <SignInOutComponent/>
                        </>
                    ) : (
                        <>
                            <AttendanceReport/>
                        </>
                    )}
                    <div className={styles.ProfileContainer}>
                        <div className={styles.nametagContainer}>
                        <span className={styles.EmployeeId}>{user.name ? user.name : user.username ? user.username : "Staff"}</span>
                        <span className={styles.roles}>{role}</span>
                        </div>
                        <div className={styles.EmployeeIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99998 1.09873e-10C11.3132 -6.15562e-06 12.6136 0.258646 13.8268 0.761189C15.0401 1.26373 16.1425 2.00032 17.0711 2.92891C17.9996 3.85749 18.7362 4.95988 19.2388 6.17314C19.7413 7.3864 20 8.68676 20 9.99998C20 15.5228 15.5228 20 9.99998 20C4.47717 20 0 15.5228 0 9.99998C0 4.47717 4.47717 1.09873e-10 9.99998 1.09873e-10ZM11 11H8.99999C6.52429 11 4.39884 12.4994 3.48211 14.6398C4.93261 16.6737 7.31142 18 9.99998 18C12.6885 18 15.0673 16.6737 16.5179 14.6396C15.6012 12.4994 13.4757 11 11 11ZM9.99998 3C8.34313 3 6.99998 4.34315 6.99998 6C6.99998 7.65684 8.34313 8.99999 9.99998 8.99999C11.6568 8.99999 13 7.65684 13 6C13 4.34315 11.6569 3 9.99998 3Z" fill="#000000ff"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}
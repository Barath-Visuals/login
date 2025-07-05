import React from 'react';
import { useEffect, useState } from 'react';
import Header from "../Components/header.jsx";
import Dashboard from "../Components/dashboard.jsx";
import SideBar from "../Components/sidebar.jsx";
import HomeAttendancePage from "../Components/homeAttendance.jsx";
import styles from "../StyleSCSS/styles.module.scss"

export default function Home({ user, onLogout }) {
    const [localUser, setLocalUser] = useState(user);

    // Use `localUser` in your component
    return (
        <div className={styles.Container}>
            <Header/>
            <div className={styles.mainLayout}>
                <SideBar onLogout={onLogout}/>
                <div className={styles.contentArea}>
                    <Dashboard/>
                    <HomeAttendancePage/>
                </div>
            </div>
            {/* <h1>Welcome, {localUser?.name}</h1> */}
            {/* <button onClick={onLogout}>Logout</button> */}
        </div>
    );
}



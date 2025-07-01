import React from 'react';
import { useEffect, useState } from 'react';
import Header from "../Components/header.jsx";
import SideBar from "../Components/sidebar.jsx";
import DashBoard from "../Components/dashboard.jsx";
import styles from '../StyleSCSS/styles.module.scss';

export default function Home({ user, onLogout }) {
    const [localUser, setLocalUser] = useState(user);

    // Use `localUser` in your component
    return (
        <>
            <Header/>
            <div className={styles.container}>
                <SideBar onLogout={onLogout}/>
                <DashBoard/>
            </div>
            {/* <h1>Welcome, {localUser?.name}</h1> */}
            {/* <button onClick={onLogout}>Logout</button> */}
        </>
    );
}



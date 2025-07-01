import React from 'react';
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/hero.module.scss"
import SideBar from './sidebar.jsx';
import DashBoard from './dashboard.jsx';

export default function Hero({ onLogout }) {

    return (
        <div className={styles.container}>
            <SideBar onLogout={onLogout}/>
            <div>
                <DashBoard/>    
            </div>
        </div>
    );
}
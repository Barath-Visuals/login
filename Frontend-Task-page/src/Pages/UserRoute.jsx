import React from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/user.module.scss"
import UserHeader from "../Components/header.jsx";
import UserSideBar from "../Components/sidebar.jsx";
import DashBoard from "../Components/HomeComponent.jsx"
import AttendanceLog from "../Components/Attendance.jsx"
import ClientEntry from "../Components/ClientEntry.jsx"

export default function UserPage({ onLogout }) {
    const role = localStorage.getItem("role")
    return(
        <div className={styles.user_layout}>
            <UserHeader/>
            <div className={styles.user_main}>
                <UserSideBar role={role} onLogout={onLogout}/>
                <div className={styles.user_content}>
                    <Routes>
                        <Route path='/dashboard' element={<DashBoard role={role}/>}/>
                        <Route path='/attendance_logs' element={<AttendanceLog/>}/>
                        <Route path='/cliententry' element={<ClientEntry/>}/>
                        <Route path='*' element={<Navigate to="dashboard" replace />}/>
                    </Routes>
                </div>
            </div>
        </div>
    )
}
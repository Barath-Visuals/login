import React from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/user.module.scss"
import UserHeader from "../Components/header.jsx";
import UserSideBar from "../Components/AdminSidebar.jsx";
import DashBoard from "../Components/HomeComponent.jsx"
import AttendanceLog from "../Components/Attendance.jsx"
import ClientEntry from "../Components/ClientEntry.jsx"
import { getUserRole } from '../utils/auth.jsx';

export default function UserPage({ onLogout }) {
    const role = getUserRole()
    return(
        <div className={styles.user_layout}>
            <UserHeader/>
            <div className={styles.user_main}>
                <UserSideBar role={role} onLogout={onLogout}/>
                <div className={styles.user_content}>
                    <Routes>
                        <Route path='/Home' element={<DashBoard role={role}/>}/>
                        <Route path='/attendance' element={<AttendanceLog/>}/>
                        <Route path='/clientView' element={<ClientEntry/>}/>
                        <Route path='*' element={<Navigate to="Home" replace />}/>
                    </Routes>
                </div>
            </div>
        </div>
    )
}
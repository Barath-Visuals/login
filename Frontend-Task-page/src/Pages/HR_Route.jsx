import React from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import HRHeader from "../Components/header.jsx";
import StaffUsers from '../Components/userList.jsx';
import HRSideBar from "../Components/AdminSidebar.jsx";
import HRClientView from "../Components/ClientEntry.jsx"
import SignupStaff from "../Components/Signup.jsx";
import StaffAssigns from "../Components/Staff_Admin.jsx"
import styles from "../StyleSCSS/admin.module.scss"

export default function HRStaff({ user, onLogout }) {
    return(
        <div className={styles.admin_layout}>
            <HRHeader/>
            <div className={styles.admin_main}>
                <HRSideBar onLogout={onLogout}/>
                <div className={styles.admin_content}>
                    <Routes>
                        <Route path="/hrhome" element={<StaffAssigns />} />
                        <Route path="/clientview" element={<HRClientView />} />
                        <Route path='/signupstaff' element={<SignupStaff/>}/>
                        <Route path='/staffmembers' element={<StaffUsers/>}/>
                        <Route path="*" element={<Navigate to="hrhome" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}
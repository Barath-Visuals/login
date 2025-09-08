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
import DashBoard from "../Components/HomeComponent.jsx"
import { getUserRole } from '../utils/auth.jsx';
import AttendanceLog from "../Components/Attendance.jsx"


export default function HRStaff({ user, onLogout }) {

    const role = getUserRole()
    return(
        <div className={styles.admin_layout}>
            <HRHeader/>
            <div className={styles.admin_main}>
                <HRSideBar onLogout={onLogout}/>
                <div className={styles.admin_content}>
                    <Routes>
                        <Route path='/Home' element={<DashBoard role={role}/>}/>
                        <Route path="/staffManagement" element={<StaffAssigns />} />
                        <Route path="/clientView" element={<HRClientView />} />
                        <Route path='/createStaff' element={<SignupStaff/>}/>
                        <Route path='/attendance' element={<AttendanceLog/>}/>
                        <Route path='/viewStaffDetails' element={<StaffUsers/>}/>
                        <Route path="*" element={<Navigate to="Home" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}
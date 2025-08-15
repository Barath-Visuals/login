import React from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import AdminHeader from "../Components/header.jsx";
import StaffUsers from '../Components/userList.jsx';
import AdminSideBar from "../Components/AdminSidebar.jsx";
import AdminClientView from "../Components/ClientEntry.jsx"
import SignupStaff from "../Components/Signup.jsx";
import StaffAssigns from "../Components/Staff_Admin.jsx"
import styles from "../StyleSCSS/admin.module.scss"

export default function Admin({ user, onLogout }) {
    return(
        <div className={styles.admin_layout}>
            <AdminHeader/>
            <div className={styles.admin_main}>
                <AdminSideBar onLogout={onLogout}/>
                <div className={styles.admin_content}>
                    <Routes>
                        <Route path="/adminhome" element={<StaffAssigns />} />
                        <Route path="/clientview" element={<AdminClientView />} />
                        <Route path='/signupstaff' element={<SignupStaff/>}/>
                        <Route path='/staffmembers' element={<StaffUsers/>}/>
                        <Route path="*" element={<Navigate to="adminhome" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}
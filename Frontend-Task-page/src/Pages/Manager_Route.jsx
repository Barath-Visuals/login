import React from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import HRHeader from "../Components/header.jsx";
import StaffUsers from '../Components/userList.jsx';
import HRSideBar from "../Components/AdminSidebar.jsx";
import ManagerClientView from "../Components/ClientEntry.jsx"

import StaffAssigns from "../Components/Staff_Admin.jsx"
import styles from "../StyleSCSS/admin.module.scss"

export default function managerStaff({ user, onLogout }) {
    return(
        <div className={styles.admin_layout}>
            <HRHeader/>
            <div className={styles.admin_main}>
                <HRSideBar onLogout={onLogout}/>
                <div className={styles.admin_content}>
                    <Routes>
                        <Route path="/Home" element={<StaffAssigns />} />
                        <Route path="/clientView" element={<ManagerClientView />} />
                        <Route path='/viewStaffDetails' element={<StaffUsers/>}/>
                        <Route path="*" element={<Navigate to="Home" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}
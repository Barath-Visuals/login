//import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../StyleSCSS/admin.module.scss"
import { useLocation } from 'react-router-dom';
import clsx from "clsx";
import { getUserRole } from '../utils/auth';
import Alert from "./Alert_Msg.jsx";
//import { use } from 'react';

export default function Staff_Admin() {
    const [firstLoad, setFirstLoad] = useState(true);
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editRole, setEditRole] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [confirmUser, setConfirmUser] = useState(null);
    const token = localStorage.getItem("token");
    const role = getUserRole()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [statusCode, setStatusCode] = useState(200);
    const [reload, setReload] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleSize = () => setIsMobile(window.innerWidth <= 500)
        window.addEventListener("resize", handleSize)
        return () => window.removeEventListener("resize", handleSize)
    }, [])

    const deleteUser = async (username) => {
        try{
            const response = await axios.delete(`http://localhost:8000/users/${username}`,{
                headers: { "Authorization": `Bearer ${token}`}
            });
            if (response.status === 200) {
                setStaff(
                    prevStaff => prevStaff.filter(user => user.username !== username)
                )
            };

            const cacheData = JSON.parse(sessionStorage.getItem("staffData")) || [];
            const updateData = cacheData.filter(user => user.username !== username);

            sessionStorage.setItem("staffData", JSON.stringify(updateData));
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdate = async (username) => {
        try{
            const response = await axios.post(`http://localhost:8000/update-role`, {
                username: username,
                role : editRole,
                isStatus : editStatus
            })

            setShowAlert(false)
            if (response.status === 200) {
                setTimeout(() => {
                    setAlertMessage("User updated successfully!")
                    setShowAlert(true)
                    setStatusCode(200)
    
                    setStaff (prevStaff => prevStaff.map(user => 
                        user.username === username ? {...user, role : response.data.role, isStatus : response.data.isStatus, inactive_date : response.data.inactive_date} : user)
                    )
    
                    const cacheData = JSON.parse(sessionStorage.getItem("staffData")) || [];
                    const updateData = cacheData.map(user => user.username === username ? {...user, role : response.data.role, isStatus : response.data.isStatus, inactive_date : response.data.inactive_date} : user )
    
                    sessionStorage.setItem("staffData", JSON.stringify(updateData));
    
    
                    setEditingUser(null);
                    setEditRole("")
                    setEditStatus("")
                    console.log("working")
                },100)
            }
        } catch (error) {
            setShowAlert(false)
            setTimeout(() => {

                const backendStatus = error.response?.status || 500 ;
                setAlertMessage(error.response?.data?.detail || "Update Failed")
    
                if (backendStatus === 400 || backendStatus === 404) {
                    setAlertMessage(backendStatus)
                } else {
                    setStatusCode(500)
                }
    
                setShowAlert(true);
            }, 100)
        }
    }

    const fetchStaff = async () => {
        if(firstLoad) setLoading(true)

        const newUserCreated = sessionStorage.getItem("newUserCreated");

        if (newUserCreated){
            sessionStorage.removeItem("newUserCreated");
        } else {
            const cachedData = sessionStorage.getItem("staffData");
            if (cachedData){
                setStaff(JSON.parse(cachedData));
                setLoading(false);
                return;
            }
        }

        const startTime = Date.now()
        try{
            const response = await axios.get(`http://localhost:8000/getUser`, {
                headers: { "Authorization": `Bearer ${token}`}
            });

            sessionStorage.setItem("staffData", JSON.stringify(response.data))
            // console.log("Fetched staff data:", response.data);
            if(firstLoad){
                const elasped = Date.now() - startTime;
                const remainig = Math.max(0, 2000 - elasped)
                await new Promise(resolve => setTimeout(resolve, remainig))
            }
            setStaff(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
            setFirstLoad(false)
        }
    }
    

    useEffect (() => {
        if (token) {
            fetchStaff();
        } else {
            setStaff([]);
        }
    }, [reload, token, location.key])

    return(
        <>
            <div className={styles.title}><span>Staff Management</span></div>
            <div className={styles["staffTable-container"]}>
                {/* {loading && (
                    <div className={styles.loader_wrapper}>
                        <div className={styles.loader}>
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>
                    </div>
                )} */}
                    <table className={styles.staffTable}>
                        <thead className={styles.staffTable__thead}>
                        <tr className={styles.staffTable__tr}>
                            <th className={styles.staffTable__th}>Staff</th>
                            <th className={styles.staffTable__th}>Aadhaar</th>
                            <th className={styles.staffTable__th}>Date</th>
                            <th className={styles.staffTable__th}>Role</th>
                            <th className={styles.staffTable__th}>Status</th>
                            <th className={styles.staffTable__th}>Deactivated</th>
                            {role === "admin" || role === "HR"? (
                                <>
                                    <th className={styles.staffTable__th}>Edit</th>
                                    {role === "admin" ? (
                                        <>
                                            <th className={styles.staffTable__th}>Delete</th>
                                        </>
                                    ) : null}
                                </>
                            ): (
                                null
                            )}
                        </tr>
                        </thead>
                        <tbody className={styles.staffTable__tbody}>
                            {loading ? (
                                <tr className={styles.loaderRow}>
                                    <td colSpan={role === "admin" ? 6 : 4} style={{ textAlign: "center" }}>
                                        <div className={styles.loader_wrapper}>
                                        <div className={styles.loader}>
                                            <div></div><div></div><div></div><div></div>
                                            <div></div><div></div><div></div><div></div>
                                        </div>
                                        </div>
                                    </td>
                                </tr>

                                ) : staff.length > 0 ? (
                                staff.map((user, index) => {
                                    const isEditing = editingUser === user.username;
                                    return (
                                    <tr className={styles.staffTable__tr} key={index}>
                                        <td className={styles.staffTable__td}>
                                            <div className={clsx(styles.staffTable__userConatiiner, styles.staff_name)}>
                                                <div className={styles.staffTable__user}>
                                                    <div className={styles.staffTable__userIcon}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M10 0C11.3132 0 12.6136 0.258646 13.8268 0.761189C15.0401 1.26373 16.1425 2.00032 17.0711 2.92891C17.9996 3.85749 18.7362 4.95988 19.2388 6.17314C19.7413 7.3864 20 8.68676 20 10C20 15.5228 15.5228 20 10 20C4.47717 20 0 15.5228 0 10C0 4.47717 4.47717 0 10 0ZM11 11H9C6.52429 11 4.39884 12.4994 3.48211 14.6398C4.93261 16.6737 7.31142 18 10 18C12.6885 18 15.0673 16.6737 16.5179 14.6396C15.6012 12.4994 13.4757 11 11 11ZM10 3C8.34313 3 7 4.34315 7 6C7 7.65684 8.34313 9 10 9C11.6568 9 13 7.65684 13 6C13 4.34315 11.6569 3 10 3Z" fill="#000"/>
                                                        </svg>
                                                    </div>
                                                    <span className={styles.staffTable__username}>{user.name ? user.name : user.username }</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className={styles.staffTable__td}>
                                            <div className={styles.staffTable__userConatiiner}>
                                                <div className={styles.staffTable__user}>
                                                    <div className={styles.staffTable__roleContainer}>
                                                        <span className={styles.staffTable__role} >{(user.aadhaar_profile?.aadhaar)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className={styles.staffTable__td}>
                                            <div className={styles.staffTable__userConatiiner}>
                                                <div className={styles.staffTable__user}>
                                                    <div className={styles.staffTable__roleContainer}>
                                                        <span className={styles.staffTable__role} style={{whiteSpace : "nowrap"}}>{new Date(user.created_at).toLocaleDateString("en-GB", {day : "2-digit", month : "short", year : "numeric"})}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className={styles.staffTable__td}>
                                            {isEditing && role === "admin" ? (
                                                <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value)}
                                                className={styles.staffTable__select}
                                                >
                                                <option value="HR">HR</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Designer">Designer</option>
                                                <option value="Worker">Worker</option>
                                                </select>
                                            ) : (
                                                <>
                                                    <div className={styles.staffTable__userConatiiner}>
                                                        <div className={styles.staffTable__user}>
                                                            <div className={styles.staffTable__roleContainer}>
                                                                <div className={styles.staffTable__role}>
                                                                    {user.role}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        
                                                </>
                                            )}
                                        </td>
            
                                        <td className={styles.staffTable__td}>
                                            {isEditing && role === "admin" ? (
                                                <select
                                                value={editStatus}
                                                onChange={(e) => setEditStatus(e.target.value)}
                                                className={styles.staffTable__select}
                                                >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                </select>
                                            ) : (
                                                <>
                                                    <div className={styles.staffTable__userConatiiner}>
                                                        <div className={styles.staffTable__user}>
                                                            <div className={styles.staffTable__statusContainer}>
                                                                <div className={styles.staffTable__status}>
                                                                    {user.isStatus === "Active" ? "Active" : "Inactive"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                        
                                        <td className={styles.staffTable__td}>
                                            <div className={styles.staffTable__userConatiiner}>
                                                <div className={styles.staffTable__user}>
                                                    <div className={styles.staffTable__roleContainer}>
                                                        <span className={styles.staffTable__role} style={{whiteSpace : "nowrap"}}>
                                                            {
                                                                user.inactive_date ? 
                                                                (
                                                                    new Date(user.inactive_date).toLocaleDateString("en-GB", {day : "2-digit", month : "short", year : "numeric"})
                                                                ) :
                                                                ""
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {role === "admin" || role === "HR"? (
                                            <>
                                                <td className={styles.staffTable__td}>
                                                    {isEditing  ? (
                                                        <>
                                                                    <div className={styles.staffTable__buttons}>
                                                                        <button
                                                                            className={styles.staffTable__btnSave}
                                                                            disabled={editRole === user.role && editStatus === user.isStatus}
                                                                            onClick={() => handleUpdate(user.username)}
                                                                            style={{
                                                                            opacity: (editRole === user.role && editStatus === user.isStatus) ? 0.5 : 1,
                                                                            }}
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            className={styles.staffTable__btnCancel}
                                                                            onClick={() => {
                                                                            setEditingUser(null);
                                                                            setEditRole("");
                                                                            setEditStatus("");
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                        </>
                                                    ) : (
                                                        <div className={styles.staffTable__userConatiiner}>
                                                            <div className={styles.staffTable__user}>
                                                                <button
                                                                className={styles.staffTable__btnEdit}
                                                                onClick={() => {
                                                                    setEditRole(user.role);
                                                                    setEditStatus(user.isStatus);
                                                                    setEditingUser(user.username);
                                                                }}
                                                                >
                                                                Edit
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                {role === "admin" ? (
                                                    <>
                                                        <td className={styles.staffTable__td}>
                                                            <div className={styles.staffTable__userConatiiner}>
                                                                <div className={styles.staffTable__user}>
                                                                    <button
                                                                        className={styles.staffTable__btnDelete}
                                                                        onClick={() => setConfirmUser(user.username)}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                                                        <path d="M3 18C2.45 18 1.97934 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3C0.71667 3 0.479337 2.904 0.288004 2.712C0.0966702 2.52 0.000670115 2.28267 3.44827e-06 2C-0.000663218 1.71733 0.0953369 1.48 0.288004 1.288C0.48067 1.096 0.718003 1 1 1H5C5 0.716667 5.096 0.479333 5.288 0.288C5.48 0.0966668 5.71734 0.000666667 6 0H10C10.2833 0 10.521 0.0960001 10.713 0.288C10.905 0.48 11.0007 0.717333 11 1H15C15.2833 1 15.521 1.096 15.713 1.288C15.905 1.48 16.0007 1.71733 16 2C15.9993 2.28267 15.9033 2.52033 15.712 2.713C15.5207 2.90567 15.2833 3.00133 15 3V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM6 14C6.28334 14 6.521 13.904 6.713 13.712C6.905 13.52 7.00067 13.2827 7 13V6C7 5.71667 6.904 5.47933 6.712 5.288C6.52 5.09667 6.28267 5.00067 6 5C5.71734 4.99933 5.48 5.09533 5.288 5.288C5.096 5.48067 5 5.718 5 6V13C5 13.2833 5.096 13.521 5.288 13.713C5.48 13.905 5.71734 14.0007 6 14ZM10 14C10.2833 14 10.521 13.904 10.713 13.712C10.905 13.52 11.0007 13.2827 11 13V6C11 5.71667 10.904 5.47933 10.712 5.288C10.52 5.09667 10.2827 5.00067 10 5C9.71734 4.99933 9.48 5.09533 9.288 5.288C9.096 5.48067 9 5.718 9 6V13C9 13.2833 9.096 13.521 9.288 13.713C9.48 13.905 9.71734 14.0007 10 14Z" fill="#EA3B10"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : null}
                                            </>
                                        ) : (
                                            null
                                        )}
            
                                        
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
                                        No staff found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
            </div>

            {confirmUser && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmBox}>
                        <span className={styles.confirmTitle}>Delete Staff</span>
                        <p>Are you sure you want to delete <strong>{confirmUser}</strong>?</p>
                        <hr className={styles.confirmDivider} />
                        <div className={styles.confirmButtons}>
                        <button
                            className={styles.confirmYes}
                            onClick={() => {
                            deleteUser(confirmUser);
                            setConfirmUser(null);
                            }}
                        >
                            Yes, Delete
                        </button>
                        <button
                            className={styles.confirmNo}
                            onClick={() => setConfirmUser(null)}
                        >
                            No, Cancel
                        </button>
                        </div>
                    </div>
                    </div>

            )}
            
            {showAlert && (
                <Alert
                    message={alertMessage}
                    statusCode={statusCode}
                    duration={4000}
                    onClose = {() => setShowAlert(false)}
                />
            )}
        </>
    )
}
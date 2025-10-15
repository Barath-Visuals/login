//import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import DetailCard from "./usersDetail.jsx";
//import { jwtDecode } from "jwt-decode";
import styles from "../StyleSCSS/userdetail.module.scss"

export default function UserList() {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token")


    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_PATH}admin/all_users`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUsers(res.data);
            console.log("userList: ", res.data);
        }
        fetchUsers();
    }, []);

    return(
        <div className={styles.fetchStaff_container}>
            {users.map((user, i) =>(
                <DetailCard key={i} user={user} />
            ))}
        </div>
    )
}
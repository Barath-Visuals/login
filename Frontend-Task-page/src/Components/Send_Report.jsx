import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../StyleSCSS/header.module.scss";
import { getUserRole } from "../utils/auth";

export default function SendReport() {
    const [message, setMessage] = useState("");
    const role = getUserRole()

    const token = getUserRole()

    const CheckSendReport = async () => {
        try{
            const res = await axios.get("http://127.0.0.1:8000/report/send-report", {
                headers : {"Authorization" : `Bearer ${token}`}
            })
            setMessage(res.data.message)
        } catch (error) {
            console.error(error);
            setMessage("Failed to send report");
        }
    }

    if (!["admin", "HR", "Manager"].includes(role)) {
    return null;
  }
    return (
        <div className={styles.signinout_container}>
            <button onClick={CheckSendReport} className={styles.signinout}>
                Report
            </button>
        </div>
    )
}
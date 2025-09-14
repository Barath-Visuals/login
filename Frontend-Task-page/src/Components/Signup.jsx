import React from "react";
import { useEffect, useState } from 'react';
import axios from "axios";
import styles from "../StyleSCSS/signup.module.scss";
import AlertMessage from "./Alert_Msg";

export default function Signup () {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [statusCode, setStatusCode] = useState(200);

    const handleChanges = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:8000/signup', formData)

            if (res.status === 200 || res.data?.message) {
                setShowAlert(false)
                setTimeout(() => {
                setAlertMessage(res.data.message || "Staff created successfully!");
                setStatusCode(200);
                setShowAlert(true);

                //sessionStorage.setItem("newUserCreated", "true");
                setFormData({ username: "", password: "" });
            }, 50);
            }
        } catch (error) {
            setShowAlert(false);
            setTimeout(() => {
                const backendStatus = error.response?.status || 500; // get actual status
                setAlertMessage(error.response?.data?.detail || "Signup failed");

                // Map backend status to correct icon/message
                if (backendStatus === 400 || backendStatus === 404) {
                    setStatusCode(backendStatus); // show warningSVG
                } else {
                    setStatusCode(500); // fallback to error icon
                }

                setShowAlert(true);
            }, 50);
        }
    }

    return(
        <div className={styles.signupcontainer}>
            <div className={styles.signupcard}>
                <h2 className={styles.signuptitle}>Create a Staff</h2>
                <form onSubmit={handleSubmit} className={styles.signupform}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChanges}
                        autoComplete="username"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChanges}
                        autoComplete="current-password"
                        required
                    />
                    <button type="submit">Create Staff</button>
                </form>
                {showAlert && (
                <AlertMessage
                    statusCode={statusCode}
                    message={alertMessage}
                    duration={3000}
                    onClose={() => setShowAlert(false)}
                />
            )}
            </div>
        </div>
    )
}
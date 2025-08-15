import React from "react";
import { useEffect, useState } from 'react';
import axios from "axios";
import styles from "../StyleSCSS/signup.module.scss"

export default function signup () {
    const [formData, setFormData] = useState({username: "", password : ""});
    const [message, setMessage] = useState("")

    const handleChanges = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:8000/signup', formData)
            setMessage(res.data.message)

        } catch (error) {
            if (error.message && error.respose && error.respose.data && error.respose.data.detail) {
                setMessage("Error: " + error.response.data.detail)
            } else {
                setMessage("Signup failed")
            }
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
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChanges}
                        required
                    />
                    <button type="submit">Create Staff</button>
                </form>
                {message && <p className={styles.signupmessage}>{message}</p>}
            </div>
        </div>
    )
}
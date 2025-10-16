import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../StyleSCSS/header.module.scss";

export default function SignInOut() {
    const [signedIn, setSignedIn] = useState(false);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token")
    // console.log("signinout")

    useEffect(() => {
        const checkStatus = async () => {
            try{
                const res = await axios.get(`${import.meta.env.VITE_API_PATH}auth/status`, {
                    headers : {"Authorization" : `Bearer ${token}`}
                })
                setSignedIn(res.data.signed_in)
            } catch (error) {
                setSignedIn(false)
            }
        }

        if(token) {
            checkStatus();
        }
    }, [token])

    const handleClick = async () =>{

        try {
            if (!signedIn){
                const res = await axios.post(`${import.meta.env.VITE_API_PATH}auth/signin`, {}, {
                        headers : {"Authorization" : `Bearer ${token}`,
                    },
                })
        
                setMessage(res.data.message);
                setSignedIn(true);
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_PATH}auth/signout`,{}, { 
                    headers : {"Authorization" : `Bearer ${token}`}
                })
        
                setMessage(res.data.message);
                setSignedIn(false);
            }
        } catch (error) { 
            setMessage(err.response?.data?.detail || "Action Failed")
        }
    }
    return (
        <div className={styles.signinout_container}>
            <button onClick={handleClick} className={styles.signinout}>
                {signedIn ? "Sign Out" : "Sign In"}
            </button>
        </div>
    )
}
import React from "react";
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/Form.module.scss"
import axios from 'axios';
import AlertMessage from "./Alert_Msg";

export default function ClientEntryForm ({ onEntryAdded }) {

    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [statusCode, setStatusCode] = useState(200);
    

    const [formData, setFormdata] = useState({
        client_name: "",
        folder_type: "",
        design_type: "",
        start_date: '',
        end_date: ''
    })

    const handleChange = (e) => {
        setFormdata({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            //const token = localStorage.getItem("token")
            const response = await axios.post("http://127.0.0.1:8000/clientEntry", formData);
            console.log(response.data.message);


            setFormdata({
                client_name: "",
                folder_type: "",
                design_type: "",
                start_date: '',
                end_date: ''
            })

            if (response.status === 200) {
                if (onEntryAdded) onEntryAdded("Successfully Added", 200);
            }

        } catch (error) {
            console.error("Error creating client entry:", error);

            const backendStatus = error.response?.status || 500;
            const backendMessage = error.response?.data?.message || "Entry Failed";

            if (onEntryAdded) {
                onEntryAdded(backendMessage, backendStatus);
            }
        }
    }

    return(
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.container}>
                <div className={styles.textField}>
                    <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} placeholder="Client Name" className={styles.input} />
                    <input type="text" name="folder_type" value={formData.folder_type} onChange={handleChange} placeholder="Folder Name" className={styles.input} />
                    <input type="text" name="design_type" value={formData.design_type} onChange={handleChange} placeholder="Design Type" className={styles.input} />
                </div>
                <div className={styles.dateField}>
                    <input className={styles.dates}name="start_date" value={formData.start_date} onChange={handleChange} type="date" />
                    <input className={styles.dates}name="end_date" value={formData.end_date} onChange={handleChange} type="date" />
                </div>
                <button type="submit">Add</button>
            </div>
            {/* {showAlert && (
                <AlertMessage 
                    message={alertMessage}
                    statusCode={statusCode}
                    duration={3000}
                    onClose ={() => setShowAlert(false)}
                />
            )} */}
        </form>
    )
}
import React from "react";
import { useEffect, useState } from 'react';
import styles from "../StyleSCSS/Form.module.scss"
import axios from 'axios';

export default function ClientEntryForm ({ onEntryAdded }) {

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
            alert("client entry added successfully")

            setFormdata({
                client_name: "",
                folder_type: "",
                design_type: "",
                start_date: '',
                end_date: ''
            })

            if (onEntryAdded) onEntryAdded() 
        } catch (error) {
            console.error("Error creating client entry:", error);
            alert("Failed to create client entry.");
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
        </form>
    )
}
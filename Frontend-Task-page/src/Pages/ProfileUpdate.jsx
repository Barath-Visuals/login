import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../StyleSCSS/PU.module.scss"

const ProfileUpdate = ({ onProfileComplete }) => {
    const [userDetails, setUserDetails] = useState({
        username: "",
        name: "",
        age: "",
        phone: "",
        address: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("access_token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8000/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserDetails(response.data); // Set the existing user details here
            } catch (error) {
                console.error("Error fetching user details", error);
            }
        };
        fetchUserDetails();
    },[token]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUserDetails((preDetails) => ({
            ...preDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put("http://localhost:8000/user/profile", userDetails, {
            headers: { Authorization: `Bearer ${token}` },
            });

            // Assuming response.data contains updated user profile
            const updatedUser = response.data;

            // Update localStorage user with updated data and mark profileComplete true
            localStorage.setItem("user", JSON.stringify({ ...updatedUser, profileComplete: true }));

            setMessage("Profile updated successfully!");

            // Call a callback if needed to update parent state
            onProfileComplete?.();

            // Navigate to home after update
            navigate("/home");
        } catch (err) {
            setError("Failed to update profile. Please try again.");
        }
    };



    return (
        <div className={styles.ProfileUpdateContainer}>
            <h2 className={styles.profile}>Profile</h2>
            {message && <p className={styles.successfull}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={userDetails.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={userDetails.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        value={userDetails.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default ProfileUpdate;
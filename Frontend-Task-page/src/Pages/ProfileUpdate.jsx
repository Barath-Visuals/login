import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../StyleSCSS/PU.module.scss"
import { getUserRole } from "../utils/auth";

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

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

     useEffect(() => {

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8000/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserDetails(response.data); // Set the existing user details here
            } catch (error) {
                console.error("Error fetching user details", error);
                if(error.response?.status === 401) { 
                    localStorage.removeItem("token")
                    navigate("/login")
                }
            }
        };
        fetchUserDetails();
    },[token, navigate]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUserDetails((preDetails) => ({
            ...preDetails,
            [name]: value,
        }));
    };
    const role = getUserRole()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/update_profile", userDetails, {
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
            if (role === "admin") {
                navigate("/admin")
            }
            else {navigate("/home")}
            
        } catch (err) {
            setError("Failed to update profile. Please try again.");
        }
    };



    return (
        <main style={{width: "100vw", height: "100vh", backgroundColor: "black" }}>
            <div className={styles.ProfileUpdateContainer}>
                    <div className={styles.container}>
                        <h2 className={styles.profile}>Profile</h2>
                        {message && <p className={styles.successfull}>{message}</p>}
                        {error && <p className={styles.error}>{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formgroup}>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Full Name"
                                    value={userDetails.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formgroup}>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    placeholder="Age"
                                    value={userDetails.age || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formgroup}>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="Phone"
                                    value={userDetails.phone || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formgroup}>
                                <textarea
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    value={userDetails.address || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.button}>
                                Update Profile
                            </button>
                        </form>
                    </div>
                </div>
        </main>
    );
};

export default ProfileUpdate;
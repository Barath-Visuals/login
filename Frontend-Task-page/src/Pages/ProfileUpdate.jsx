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

    const token = localStorage.getItem("token");
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
            navigate("/home");
        } catch (err) {
            setError("Failed to update profile. Please try again.");
        }
    };



    return (
        <main style={{width: "100vw", height: "100vh", backgroundColor: "white" }}>
            <div className={styles.gradientContainer}>
                <div className={styles.gradient1} style={{ width: "100vw", height: "100vh" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="1024" viewBox="0 0 986 1024" fill="none">
                        <g filter="url(#filter0_f_233_2)">
                            <path d="M665.603 277.203C722.595 413.729 646.143 861.289 509.616 918.28C373.09 975.272 228.189 620.114 171.197 483.588C114.205 347.061 178.681 190.184 315.208 133.192C451.734 76.2008 608.611 140.677 665.603 277.203Z" fill="url(#paint0_linear_233_2)" />
                        </g>
                        <g filter="url(#filter1_f_233_2)">
                            <path d="M506.194 862.213C399.812 802.378 222.264 472.542 282.098 366.159C341.933 259.777 616.492 417.134 722.875 476.968C829.257 536.803 866.992 671.549 807.157 777.931C747.322 884.313 612.577 922.048 506.194 862.213Z" fill="url(#paint1_linear_233_2)" />
                        </g>
                        <defs>
                            <filter id="filter0_f_233_2" x="0.453339" y="-37.5513" width="834.191" height="1111.97" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_233_2" />
                            </filter>
                            <filter id="filter1_f_233_2" x="120.078" y="180.142" width="865.496" height="860.487" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_233_2" />
                            </filter>
                            <linearGradient id="paint0_linear_233_2" x1="315.205" y1="133.193" x2="623.148" y2="870.887" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FFD07F" />
                                <stop offset="1" stopColor="white" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_233_2" x1="807.158" y1="777.929" x2="232.341" y2="454.624" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#C06AFE" />
                                <stop offset="1" stopColor="white" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
            <div className={styles.ProfileUpdateContainer}>
                    <div className={styles.container}>
                        <h2 className={styles.profile}>Profile</h2>
                        {message && <p className={styles.successfull}>{message}</p>}
                        {error && <p className={styles.error}>{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formgroup}>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={userDetails.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formgroup}>
                                <label htmlFor="age">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={userDetails.age || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formgroup}>
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={userDetails.phone || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formgroup}>
                                <label htmlFor="address">Address</label>
                                <textarea
                                    id="address"
                                    name="address"
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
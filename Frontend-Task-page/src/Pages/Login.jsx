import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../StyleSCSS/Login.module.scss';

export default function Login({ onLogin }) {

    const [showPassword, setShowPassword] = useState(false);
    const[password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/login", { username, password });
            const { access_token, user } = response.data;

            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem('username', user.username);


            onLogin({ user, token: access_token });

            // Check if profile complete here (example: user.profileComplete flag)
            if (user.profileComplete) navigate("/home");
            else navigate("/profile-update");


            setPassword("");
        } catch (error) {
            //alert(error.response?.data?.detail || "login failed");
            console.error("Login error:", error);
        }
    };


    useEffect(() => {
        const userStored = localStorage.getItem("user");
        if (userStored) {
            const userObj = JSON.parse(userStored);
            const isProfileComplete = userObj.name && userObj.age && userObj.phone && userObj.address;

            if (isProfileComplete) {
                navigate("/home");
            } else {
                navigate("/profile-update");
            }
        }
    }, []); // ✅ FIX: empty array prevents infinite loop




    return(
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
            <div className={styles.login}>
                <form className={styles.loginContainer} onSubmit={handleLogin}>
                    <div className={styles.head}>
                        <h1>
                            LGSS
                        </h1>
                        <p>
                            Login to take attendance
                        </p>
                    </div>
                    <div className={styles.inputContainer}>
                        <input type='text' placeholder='UserName.' autoComplete='username' className={styles.input} value={username} onChange={(e) => setUserName(e.target.value)} />
                        <div className={styles.password}>
                            <input type={showPassword ? 'text' : 'password'} placeholder='Password.' className={styles.input} value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
                            <span onClick = {() => {setShowPassword ( prev => !prev)}}>
                                {showPassword ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="19" viewBox="0 0 14 19" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M2 5.00007C1.99832 3.7819 2.44142 2.60502 3.24608 1.69043C4.05074 0.775847 5.16162 0.186482 6.37009 0.0330137C7.57855 -0.120454 8.80148 0.172533 9.80921 0.856955C10.8169 1.54138 11.5401 2.57015 11.843 3.75007C11.9093 4.00694 11.8709 4.27962 11.7361 4.50813C11.6014 4.73664 11.3814 4.90227 11.1245 4.96857C10.8676 5.03488 10.595 4.99643 10.3664 4.86168C10.1379 4.72694 9.9723 4.50694 9.906 4.25007C9.72444 3.54194 9.29056 2.92446 8.68586 2.51365C8.08117 2.10284 7.34728 1.92696 6.62206 2.01905C5.89685 2.11115 5.23021 2.46488 4.74739 3.01379C4.26457 3.56271 3.9988 4.26903 4 5.00007V8.00007H12.4C13.28 8.00007 14 8.72007 14 9.60007V16.6001C14 17.9201 12.92 19.0001 11.6 19.0001H2.4C1.08 19.0001 0 17.9201 0 16.6001V9.60007C0 8.72007 0.72 8.00007 1.6 8.00007H2V5.00007ZM7 10.2501C6.60234 10.2497 6.21639 10.3847 5.90573 10.6329C5.59507 10.8812 5.37822 11.2278 5.2909 11.6158C5.20357 12.0037 5.25098 12.4099 5.42531 12.7673C5.59965 13.1247 5.89051 13.4121 6.25 13.5821V16.0001C6.25 16.199 6.32902 16.3898 6.46967 16.5304C6.61032 16.6711 6.80109 16.7501 7 16.7501C7.19891 16.7501 7.38968 16.6711 7.53033 16.5304C7.67098 16.3898 7.75 16.199 7.75 16.0001V13.5821C8.10949 13.4121 8.40035 13.1247 8.57469 12.7673C8.74902 12.4099 8.79643 12.0037 8.7091 11.6158C8.62178 11.2278 8.40493 10.8812 8.09427 10.6329C7.78361 10.3847 7.39766 10.2497 7 10.2501Z" fill="white"/>
                                            </svg>
                                        </>
                                
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="19" viewBox="0 0 14 19" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M2 5C2 2.238 4.238 0 7 0C9.762 0 12 2.238 12 5V8H12.4C13.28 8 14 8.72 14 9.6V16.6C14 17.92 12.92 19 11.6 19H2.4C1.08 19 0 17.92 0 16.6V9.6C0 8.72 0.72 8 1.6 8H2V5ZM10 5V8H4V5C4 3.342 5.342 2 7 2C8.658 2 10 3.342 10 5ZM7 10.25C6.60234 10.2496 6.21639 10.3846 5.90573 10.6329C5.59507 10.8811 5.37822 11.2278 5.2909 11.6157C5.20357 12.0037 5.25098 12.4098 5.42531 12.7672C5.59965 13.1246 5.89051 13.412 6.25 13.582V16C6.25 16.1989 6.32902 16.3897 6.46967 16.5303C6.61032 16.671 6.80109 16.75 7 16.75C7.19891 16.75 7.38968 16.671 7.53033 16.5303C7.67098 16.3897 7.75 16.1989 7.75 16V13.582C8.10949 13.412 8.40035 13.1246 8.57469 12.7672C8.74902 12.4098 8.79643 12.0037 8.7091 11.6157C8.62178 11.2278 8.40493 10.8811 8.09427 10.6329C7.78361 10.3846 7.39766 10.2496 7 10.25Z" fill="white"/>
                                            </svg>
                                        </>
                                        
                                    )
                                }
                            </span>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                            <button className={styles.button} onClick={handleLogin}>Login.</button>
                    </div>
                </form>
            </div>
        </main>
    )
}
import React, { useEffect, useState } from "react";
import styles from "../StyleSCSS/user.module.scss";

export default function AlertMessage({ statusCode, message, duration = 3000 }) {
    const [visible, setVisible] = useState(true);
    const [hide, setHide] = useState(false);

    useEffect(() => {
    const timer = setTimeout(() => setHide(true), duration - 500); 
    const removeTimer = setTimeout(() => setVisible(false), duration); 
    return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
    };
    }, [duration]);

    if (!visible) return null;

    const getStyle = () => {
        switch (statusCode) {
        case 200:
            return styles.success;
        case 400:
        case 404:
            return styles.warning;
        case 500:
            return styles.error;
        default:
            return styles.info;
        }
    };

    const successSVG = (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <g>
            <path
            d="M8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5Z"
            stroke="#4BB543"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: "0px, 47.13px", animation: "circleAnim 1.2s linear forwards" }}
            />
            <path
            d="M5 8.14307L6.8829 10.026L11 5.85742"
            stroke="#4BB543"
            strokeLinecap="round"
            style={{ strokeDasharray: "0px, 8.64px", animation: "checkAnim 1.2s linear forwards" }}
            />
        </g>
        <style>{`
            @keyframes circleAnim {
            0% { stroke-dasharray: 0px, 47.13px; stroke-dashoffset: 0; }
            50% { stroke-dasharray: 23.565px, 23.565px; stroke-dashoffset: -23.565px; }
            100% { stroke-dasharray: 47.13px, 0; stroke-dashoffset: -47.13px; }
            }
            @keyframes checkAnim {
            0% { stroke-dasharray: 0px, 8.644px; stroke-dashoffset: 0; }
            50% { stroke-dasharray: 4.322px, 4.322px; stroke-dashoffset: -4.322px; }
            100% { stroke-dasharray: 8.644px, 0; stroke-dashoffset: -8.644px; }
            }
        `}</style>
        </svg>
    );

    const warningSVG = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
            <g>
            <path
                d="M7.11621 1.66938C7.49182 0.959893 8.50818 0.959894 8.88379 1.66938L15.2229 13.6432C15.5755 14.3092 15.0927 15.1111 14.3391 15.1111H1.6609C0.90733 15.1111 0.424529 14.3092 0.777117 13.6432L7.11621 1.66938Z"
                stroke="#FFB300"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeDasharray: "0px, 46.06px", animation: "warningAnim0 1.25s linear forwards" }}
            />
            <path
                d="M8 6.22168V9.77724"
                stroke="#FFB300"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeDasharray: "0px, 3.56px", animation: "warningAnim1 1.25s linear forwards" }}
            />
            <path
                d="M8 12.4443V12.4542"
                stroke="#FFB300"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeDasharray: "0px, 0.01px", animation: "warningAnim2 1.25s linear forwards" }}
            />
            </g>
            <style>{`
            @keyframes warningAnim0 {
                0% { stroke-dasharray: 0px, 46.06px; stroke-dashoffset: 0; }
                50% { stroke-dasharray: 23.03px, 23.03px; stroke-dashoffset: -23.03px; }
                100% { stroke-dasharray: 46.06px, 0px; stroke-dashoffset: -46.06px; }
            }
            @keyframes warningAnim1 {
                0% { stroke-dasharray: 0px, 3.56px; stroke-dashoffset: 0; }
                50% { stroke-dasharray: 1.78px, 1.78px; stroke-dashoffset: -1.78px; }
                100% { stroke-dasharray: 3.56px, 0px; stroke-dashoffset: -3.56px; }
            }
            @keyframes warningAnim2 {
                0% { stroke-dasharray: 0px, 0.01px; stroke-dashoffset: 0; }
                50% { stroke-dasharray: 0.005px, 0.005px; stroke-dashoffset: -0.005px; }
                100% { stroke-dasharray: 0.01px, 0px; stroke-dashoffset: -0.01px; }
            }
            `}</style>
        </svg>
    );
    
    const errorSVG = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
        >
            <g>
            <path
                d="M8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5Z"
                stroke="#FF0000"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                strokeDasharray: "0px, 47.13px",
                animation: "circleErrorAnim 1.2s linear forwards",
                }}
            />
            <path
                d="M8 5V8.5556"
                stroke="#FF0000"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                strokeDasharray: "0px, 3.56px",
                animation: "lineErrorAnim 1.2s linear forwards",
                }}
            />
            <path
                d="M8 11.2227V11.2325"
                stroke="#FF0000"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                strokeDasharray: "0px, 0.01px",
                animation: "dotErrorAnim 1.2s linear forwards",
                }}
            />
            </g>
            <style>{`
            @keyframes circleErrorAnim {
                0% { stroke-dasharray: 0px, 47.13px; stroke-dashoffset: 0; }
                50% { stroke-dasharray: 23.565px, 23.565px; stroke-dashoffset: -23.565px; }
                100% { stroke-dasharray: 47.13px, 0; stroke-dashoffset: -47.13px; }
            }
            @keyframes lineErrorAnim {
                0% { stroke-dasharray: 0px, 3.56px; stroke-dashoffset: 0; }
                50% { stroke-dasharray: 1.78px, 1.78px; stroke-dashoffset: -1.78px; }
                100% { stroke-dasharray: 3.56px, 0; stroke-dashoffset: -3.56px; }
            }
            @keyframes dotErrorAnim {
                0% { stroke-dasharray: 0px, 0.01px; stroke-dashoffset: 0; }
                50% { stroke-dasharray: 0.005px, 0.005px; stroke-dashoffset: -0.005px; }
                100% { stroke-dasharray: 0.01px, 0; stroke-dashoffset: -0.01px; }
            }
            `}</style>
        </svg>
    );



    return (
        <div className={`${styles.alert_msg} ${getStyle()}`}>
            <div className={styles.icon_alert_S}>
                {statusCode === 200 && successSVG}
                {(statusCode === 400 || statusCode === 404) && warningSVG}
                {statusCode === 500 && errorSVG}
            </div>
            <span className={styles.message}>
                {message ||
                    (statusCode === 200
                        ? "Success!"
                        : statusCode === 400
                        ? "Bad Request."
                        : statusCode === 404
                        ? "Not Found."
                        : "Something happened."
                    )
                }
            </span>
        </div>
    );
}

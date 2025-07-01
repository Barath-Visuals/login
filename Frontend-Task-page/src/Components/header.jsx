import React, { useState, useEffect } from "react";
import styles from "../StyleSCSS/header.module.scss";

export default function header() {
    return(
        <header className={styles.MainContainer}>
            <div className={styles.Container}>
                <div className={styles.LogoIcon}>
                    <div className={styles.Logo}></div>
                </div>
                <div className={styles.ProfileContainer}>
                    <h1 className={styles.EmployeeId}>Staff</h1>
                    <div className={styles.EmployeeIcon}></div>
                </div>
            </div>
        </header>

    )
}
import styles from "../StyleSCSS/homeAttendance.module.scss"


export default function HomeAttendance({logs}) {

    const formStatus = (status) =>{
       if(!status) return "";
       return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase()); 
    }

    const formatIst = (isoString) => {
        if (!isoString) return { formatTime: "-", formatDate: "-" };

        const date = new Date(isoString); // ✅ use backend timestamp

        if (isNaN(date.getTime())) {
            return { formatTime: "-", formatDate: "-" };
        }

        const formatDate = new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata",
        }).format(date).toUpperCase();

        const formatTime = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata",
        }).format(date);

        return { formatTime, formatDate };
    };
 
    return(
        <div className={styles.attendance_container}>
            <table className={styles.attendance_table}>
                <thead className={styles.attendance_thead}>
                <tr className={styles.attendance_tr}>
                    <th className={styles.attendance_th}>S.No</th>
                    <th className={styles.attendance_th}>Date</th>
                    <th className={styles.attendance_th}>Time</th>
                    <th className={styles.attendance_th}>Status</th>
                    <th className={styles.attendance_th}>Session</th>
                </tr>
                </thead>
                <tbody className={styles.attendance_tbody}>
                {logs.map((log, index) => {
                    const { formatDate, formatTime } = formatIst(log.login_time);
                    return (
                    <tr key={index} className={styles.attendance_tr}>
                        <td className={styles.attendance_td}>{index + 1}</td>
                        <td className={styles.attendance_td}>{formatDate}</td>
                        <td className={styles.attendance_td}>{formatTime}</td>
                        <td
                        className={`${styles.attendance_td} ${
                            log.arrival_status === "on_time"
                            ? styles.attendance_onTime
                            : log.arrival_status === "late"
                            ? styles.attendance_late
                            : log.arrival_status === "leave"
                            ? styles.attendance_leave
                            : ""
                        }`}
                        >
                        <span className={styles.attendance_statusText}>
                            {formStatus(log.arrival_status)}
                        </span>
                        <span className={styles.attendance_statusDot}></span>
                        </td>
                        <td className={`${styles.attendance_td} ${styles.attendance_session}`}>
                        <span className={styles.attendance_fullText}>
                            {log.login_type === "morning"
                            ? "Morning"
                            : log.login_type === "afternoon"
                            ? "Afternoon"
                            : "Leave"}
                        </span>
                        <span className={styles.attendance_shortText}>
                            {log.login_type === "morning"
                            ? "FN"
                            : log.login_type === "afternoon"
                            ? "AN"
                            : "-L-"}
                        </span>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    )
}
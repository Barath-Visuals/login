import styles from "../StyleSCSS/dashboard.module.scss";

export default function HomeEntry ({entries}) {

    return(
        <div className={styles.homeEntry_container}>
            <table className={styles.homeEntry_table}>
                <thead className={styles.homeEntry_thead}>
                <tr className={styles.homeEntry_tr}>
                    <th className={styles.homeEntry_th}>S.No</th>
                    <th className={styles.homeEntry_th}>Client Name</th>
                    <th className={styles.homeEntry_th}>Design Type</th>
                    <th className={styles.homeEntry_th}>Folder Type</th>
                    <th className={styles.homeEntry_th}>Start Date</th>
                    <th className={styles.homeEntry_th}>End Date</th>
                </tr>
                </thead>
                <tbody className={styles.homeEntry_tbody}>
                {entries.map((entry, index) => (
                    <tr key={index} className={styles.homeEntry_tr}>
                    <td className={styles.homeEntry_td}>{index + 1}</td>
                    <td className={styles.homeEntry_td}>{entry.client_name}</td>
                    <td className={styles.homeEntry_td}>{entry.design_type}</td>
                    <td className={styles.homeEntry_td}>{entry.folder_type}</td>
                    <td className={styles.homeEntry_td}>{entry.start_date}</td>
                    <td className={styles.homeEntry_td}>{entry.end_date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    )
}
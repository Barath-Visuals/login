// components/CalendarModal.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import styles from '../StyleSCSS/CalendarModal.module.scss';
import 'react-calendar/dist/Calendar.css'; // Required default styles

const CalendarModal = ({ username, onClose }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/attendance_logs/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setLogs(res.data.logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    if (username) fetchLogs();
  }, [username]);

  const getStatusForDate = (date) => {
    if (!Array.isArray(logs)) return null;

    const dateStr = date.toLocaleDateString('en-CA', {timeZone : 'Asia/Kolkata',});
    
    const match = logs.find((log) => {
      const logdate = new Date(log.login_time).toLocaleDateString('en-CA', {timeZone : 'Asia/Kolkata',});
      return logdate === dateStr;
    })

    if(!match) return null;
    if (match.arrival_status === "on_time") return "Present";
    if (match.arrival_status === "late") return "Late";
    return "Absent";
  };

  const getDotColorClass = (status) => {
    if (status === 'Present') return styles.dot_green;
    if (status === 'Late') return styles.dot_orange;
    if (status === 'Absent') return styles.dot_red;
    return '';
  };

  return (
    <div className={styles.calendar_modal}>
      <div className={styles.header}>
        <h2>Logs for {username}</h2>
      </div>
      <Calendar
        className={`${styles.custom_calendar}`}
        tileContent={({ date }) => {
          const status = getStatusForDate(date);
          return status ? (
            <div className={`${styles.dot} ${getDotColorClass(status)}`} />
          ) : null;
        }}
      />
    </div>
  );
};

export default CalendarModal;

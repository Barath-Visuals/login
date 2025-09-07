import pandas as pd
import calendar
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
from database import login_logs_collection
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import os
from utils.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

def build_attendance_dataFrame(year, month):
    start_of_month = datetime(year, month, 1, tzinfo=timezone.utc)
    if month == 12:
        start_of_next_month = datetime(year + 1, 1, 1, tzinfo=timezone.utc)
    else:
        start_of_next_month = datetime(year, month + 1, 1, tzinfo=timezone.utc)
    
    records = list(login_logs_collection.find({"login_time" : {"$gte" : start_of_month, "$lt" : start_of_next_month}}))

    usernames = login_logs_collection.distinct("username")

    _, num_days = calendar.monthrange(year, month)
    days = list(range(1, num_days + 1))

    df = pd.DataFrame("Absent", index=usernames, columns=days)

    user_with_record = set()

    for record in records:

        username = record["username"]
        login_type = record["login_type"]
        login_time = record.get("login_time")
        logout_time = record.get("logout_time")

        user_with_record.add(username)

        day = login_time.astimezone(ZoneInfo("Asia/Kolkata")).day

        if login_type == "absent":
            cell_value = "Absent"
        else :
            login_str = login_time.astimezone(ZoneInfo("Asia/Kolkata")).strftime("%H:%M")
            if logout_time :
                logout_str = logout_time.astimezone(ZoneInfo("Asia/Kolkata")).strftime("%H:%M")
            else :
                logout_str = "-"
            
            cell_value = f"Login : {login_str}\n Logout : {logout_str}"

        df.at[username, day] = cell_value

    for username in usernames:
        if username not in user_with_record :
            df.loc[username, :] = "No attendance or data available."
    
    return df


def save_attendance_to_excel(df, year, month, output_dir = "reports"):

    #does the folder is exists
    os.makedirs(output_dir, exist_ok=True)

    #create the filename and filepath
    filename = f"attendance_report_{year}_{month:02d}.xlsx"
    filepath = os.path.join(output_dir, filename)

    df.to_excel(filepath, sheet_name = f"{year}-{month:02d}")
    print(f"✅ Attendance report saved at: {filepath}")

    return filepath

def send_attendance_report(filepath, recipient_email):
    sender_email = "barathbm2003@gmail.com"
    sender_password = "muxe qnlx tlem ljgq"

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = "Monthly Attendance Report"

    body = "Please find attached the attendance report."

    msg.attach(MIMEText(body, "plain"))

    with open(filepath, "rb") as f:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(filepath)}")
        msg.attach(part)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.send_message(msg)

    print(f"📧 Report sent to {recipient_email}")

@router.get("/send-report")
def send_report(current_user: dict = Depends(get_current_user)):

    if current_user["role"] not in ["admin", "HR", "Manager"]:
        raise HTTPException(status_code= 403, detail= "Not Authorized to get report")
    now = datetime.now(ZoneInfo("Asia/Kolkata"))

    year, month = now.year, now.month

    df = build_attendance_dataFrame(year, month)
    file_path = f"attendance_report_{year}_{month}.xlsx"
    df.to_excel(file_path)

    send_attendance_report(file_path, "lgss.acrylics@gmail.com")

    return {"message": "Report generated and sent successfully!"}
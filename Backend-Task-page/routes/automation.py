import pandas as pd
import calendar
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
from database import (login_logs_collection, cliententry_collection, client_collection, design_collection, inactive_history)
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import os
from utils.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

def build_attendance_dataFrame(year, month):
    start_of_month = datetime(year, month, 1, tzinfo=timezone.utc)
    start_of_next_month = datetime(year + (month // 12), (month % 12) + 1, 1, tzinfo=timezone.utc)
    
    records = list(login_logs_collection.find({"login_time" : {"$gte" : start_of_month, "$lt" : start_of_next_month}}))

    usernames = login_logs_collection.distinct("username")

    _, num_days = calendar.monthrange(year, month)
    days = list(range(1, num_days + 1))

    df = pd.DataFrame("Absent", index=usernames, columns=days)

    user_with_record = set()

    for record in records:

        username = record["username"]
        login_type = record.get("login_type", "")
        login_time = record.get("login_time")
        logout_time = record.get("logout_time")

        if not isinstance(login_time, datetime):
            continue

        user_with_record.add(username)
        login_time_ist = login_time.astimezone(ZoneInfo("Asia/Kolkata"))
        day = login_time_ist.day

        if login_type == "absent":
            cell_value = "Absent"
        else :
            login_str = login_time.astimezone(ZoneInfo("Asia/Kolkata")).strftime("%H:%M")
            logout_str = logout_time.astimezone(ZoneInfo("Asia/Kolkata")).strftime("%H:%M") if logout_time else "-"
            cell_value = f"Login: {login_str}\nLogout: {logout_str}"

        df.at[username, day] = cell_value

    for username in usernames:
        if username not in user_with_record :
            df.loc[username, :] = "No attendance or data available."
    
    return df

def build_client_entry_df(year, month):
    start_of_month = datetime(year, month, 1, tzinfo=timezone.utc)
    start_of_next_month = datetime(year + (month // 12), (month % 12) + 1, 1, tzinfo=timezone.utc)
    
    records = list(cliententry_collection.find({"start_date" : {"$gte" : start_of_month, "$lt" : start_of_next_month}}))
    clients = client_collection.distinct("client_name")
    _,num_days = calendar.monthrange(year, month)
    days = list(range(1, num_days + 1))
    df = pd.DataFrame("", index=clients, columns = days)

    #design_map = {d["design_id"] : d["design_id"] for d in design_collection.find({})}

    for record in records:
        client_name = record.get("client_name", "Unknown")
        design_type = record.get("design_type", "Unknown")
        folder_type = record.get("folder_type", "")
        start_date = record.get("start_date")

        if not isinstance(start_date, datetime):
            continue

        day = start_date.astimezone(ZoneInfo("Asia/Kolkata")).day
        value = f"{design_type} ({folder_type})" if folder_type else design_type
        current_value = df.at[client_name, day]

        df.at[client_name, day] = f"{current_value}, {value}" if current_value.strip() else value
        
    df.replace("", "-", inplace=True)
    df.columns = [f"{day:02d}-{month:02d}-{year}" for day in days]

    return df

def built_inactive_user_df(year, month):
    start_of_month = datetime(year, month, 1, tzinfo=timezone.utc)
    start_of_next_month = datetime(year + (month // 12), (month % 12) + 1, 1, tzinfo=timezone.utc)
    
    records = list(inactive_history.find({}))
    if not records:
        return pd.DataFrame(columns=["Username", "Status", "Inactive Date"])
    
    df = pd.DataFrame(records)

    def parse_timestamp(ts):
        if isinstance(ts, datetime):
            return ts
        if isinstance(ts, str):
            try:
                return datetime.fromisoformat(ts)
            except:
                return None
        return None
    
    df["parsed_timestamp"] = df["timestamp"].apply(parse_timestamp)
    df = df[df["parsed_timestamp"].notnull()]
    df["parsed_timestamp_local"] = df["parsed_timestamp"].apply(
        lambda ts: ts.astimezone(ZoneInfo("Asia/Kolkata"))
    )
    df = df[
        (df["parsed_timestamp_local"] >= start_of_month)
        & (df["parsed_timestamp_local"]< start_of_next_month)
    ]
    if df.empty:
        return pd.DataFrame(columns=["Username", "Status", "Inactive Date"])

    df = df[["username", "status", "parsed_timestamp_local"]]
    df.rename(columns={
        "username" : "Username",
        "status"  : "Status",
        "parsed_timestamp_local" : "Inactive Date"
    }, inplace = True)

    df["Inactive Date"] = df["Inactive Date"].apply(
        lambda ts: ts.strftime("%d-%m-%Y %H:%M:%S")
    )

    return df

def save_attendance_to_excel(attendance_df, client_df, inactive_df, year, month, output_dir="reports"):

    #does the folder is exists
    os.makedirs(output_dir, exist_ok=True)

    files = {}

    attendance_path = os.path.join(output_dir, f"attendance_report_{year}_{month:02d}.xlsx")
    client_path = os.path.join(output_dir, f"Client_Entries_report_{year}_{month:02d}.xlsx")
    inactive_path = os.path.join(output_dir, f"inactive_report_{year}_{month:02d}.xlsx")

    attendance_df.to_excel(attendance_path)
    client_df.to_excel(client_path)
    inactive_df.to_excel(inactive_path, index=False)

    files["attendance"] = attendance_path
    files["client"] = client_path
    files["inactive"] = inactive_path

    return files

def send_attendance_report(filepaths: dict, recipient_email: str):
    sender_email = "barathbm2003@gmail.com"
    sender_password = "ogof ejzr eqqv mnvm"

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = "Monthly Attendance Report & Clent Report"

    body = "Please find attached the attendance report."

    msg.attach(MIMEText(body, "plain"))

    for label, path in filepaths.items():
        with open(path, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(path)}")
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

    attendance_df = build_attendance_dataFrame(year, month)
    client_df = build_client_entry_df(year, month)
    inactive_df = built_inactive_user_df(year, month)

    files = save_attendance_to_excel(attendance_df, client_df, inactive_df, year, month)

    send_attendance_report(files, "barathbm2003@gmail.com")

    return {"message": "Report generated and sent successfully!"}
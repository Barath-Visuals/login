from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Optional
from database import login_logs_collection, user_collection, profile_collection
from utils.auth import get_current_user

router = APIRouter()


@router.get("/attendance_logs/{username}")
def get_attendance_logs(username: str, limit: Optional[int] = 10, current_user: dict = Depends(get_current_user)):
    query= login_logs_collection.find({"username": username}).sort("login_time", -1).limit(limit)
    get_username = profile_collection.find_one({"username" : username})
    if limit and limit > 0:
        query = query.limit(limit)

    logs = []
    for log in query:
        login_time = log.get("login_time")
        if isinstance(login_time, str):
            try:
                login_time = datetime.fromisoformat(login_time)
            except ValueError:
                login_time = None
        logs.append({
            "login_time": login_time.astimezone(ZoneInfo("Asia/Kolkata")).isoformat(),
            "login_type": log.get("login_type", ""),
            "arrival_status": log.get("arrival_status", ""),
            "logout_time": log.get("logout_time")
        })

    logs = logs[::-1]  
    return {"logs": logs, "name" : get_username.get("name")}


@router.get("/attendance_summary")
def attendance_summary(current_user: dict = Depends(get_current_user)):
    user = user_collection.find_one({"username": current_user["username"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    signup_date = user.get("signup_date")
    if not signup_date:
        raise HTTPException(status_code=400, detail="Signup date not found")
    
    if isinstance(signup_date, str):
        signup_date = datetime.fromisoformat(signup_date).date()
    elif isinstance(signup_date, datetime): 
        signup_date = signup_date.date()
    
    today = datetime.now(ZoneInfo('Asia/Kolkata')).date()
    total_days = (today - signup_date).days + 1
    attendance_days = login_logs_collection.count_documents({"username": current_user["username"]})
    leave_days = (total_days - attendance_days)
    attendance_percentage = (attendance_days / total_days) * 100 if total_days > 0 else 0

    on_time_count = login_logs_collection.count_documents({
        "username": current_user["username"],
        "arrival_status": "on_time"
    })
    late_count = login_logs_collection.count_documents({
        "username": current_user["username"],
        "arrival_status": "late"
    })

    return {
        "username": current_user["username"],
        "signup_date": signup_date,
        "total_days": total_days,
        "leave_days": leave_days,
        "attendance_days": attendance_days,
        "attendance_percentage": round(attendance_percentage, 2),
        "on_time_count": on_time_count,
        "late_count": late_count
    }

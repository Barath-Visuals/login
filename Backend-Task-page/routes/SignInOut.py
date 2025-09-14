from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta, time, timezone
from zoneinfo import ZoneInfo
#MongoDB
from database import login_logs_collection 
from utils.auth import get_current_user

router = APIRouter()

def finalize_unclosed_signins():
    now_ist = datetime.now(ZoneInfo("Asia/Kolkata"))
    today_start = datetime(now_ist.year, now_ist.month, now_ist.day, tzinfo=ZoneInfo("Asia/Kolkata"))
    yesterday_start = today_start - timedelta(days=1)
    yesterday_end = today_start - timedelta(microseconds=1)

    yesterday_start_utc = yesterday_start.astimezone(timezone.utc)
    yesterday_end_utc = yesterday_end.astimezone(timezone.utc)

    unclosed_logs = login_logs_collection.find({"login_time": {"$gte": yesterday_start_utc, "$lte": yesterday_end_utc},
        "logout_time": None
    })

    for log in unclosed_logs:
        login_logs_collection.update_one(
            {"_id": log["_id"]},
            {"$set": {"arrival_status": "absent"}}
        )

@router.post("/signin")
def signin (current_user : dict = Depends(get_current_user)):
    finalize_unclosed_signins()
    username = current_user["username"]

    #Checks existing signin
    existing_signin = login_logs_collection.find_one(
        {
            "username" : username,
            "logout_time" : None
        }
    )

    if existing_signin:
        raise HTTPException(status_code = 401, details = "You are already signed in")
    
    now_ist = datetime.now(ZoneInfo("Asia/Kolkata"))
    current_time = now_ist.time()
    
    morning_cutoff = time(9, 0)       # 9:00 AM cutoff
    afternoon_cutoff = time(14, 0)    # 2:00 PM cutoff

    if current_time <= morning_cutoff:
        login_type = "morning"
        arrival_status = "on_time"
    elif current_time <= afternoon_cutoff:
        login_type = "afternoon"
        arrival_status = "late"
    else:
        login_type = "absent"
        arrival_status = "leave"

    start_of_day_ist = datetime(now_ist.year, now_ist.month, now_ist.day, tzinfo=ZoneInfo("Asia/Kolkata"))
    end_of_day_ist = start_of_day_ist + timedelta(days=1)
    start_of_day_utc = start_of_day_ist.astimezone(timezone.utc)
    end_of_day_utc = end_of_day_ist.astimezone(timezone.utc)

    already_today = login_logs_collection.find_one({
        "username": username,
        "login_time": {"$gte": start_of_day_utc, "$lt": end_of_day_utc}
    })

    if already_today and current_user["role"] not in ["admin", "HR", "Manager"]:
        raise HTTPException(status_code = 403, detail = "You have already signed in today")
    
    now_utc = now_ist.astimezone(timezone.utc)
    login_logs_collection.insert_one({
        "username": username,
        "login_time": now_utc,
        "login_type": login_type,
        "arrival_status": arrival_status,
        "logout_time": None
    })

    return {
        "message": "Signed in successfully",
        "login_time": now_ist.isoformat(),
        "login_type": login_type,
        "arrival_status": arrival_status
    }

@router.post("/signout")
def signout(current_user : dict = Depends(get_current_user)):
    username = current_user["username"]

    now_ist = datetime.now(ZoneInfo("Asia/Kolkata"))
    cut_off = time(22, 00)

    record = login_logs_collection.find_one({"username" : username, "logout_time" : None})

    if not record:
        raise HTTPException(status_code=400, detail="No active sign-in found")
    
    if now_ist.time() >= cut_off:
        final_status = "leave"
    else:
        final_status = record.get("arrival_status", "on_time")

    

    result = login_logs_collection.update_one(
        {"_id": record["_id"]},
        {"$set": {
            "logout_time": now_ist.astimezone(timezone.utc),
            "arrival_status": final_status
        }}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code = 400, detail = "No active sign-in found")
    
    return{"message" : "Signed Out Successfully"}

@router.get("/status")
def signin_status(current_user : dict = Depends(get_current_user)):
    username = current_user["username"]

    check_signin_active = login_logs_collection.find_one({"username" : username, "logout_time" : None})

    return{"signed_in" : bool(check_signin_active)}
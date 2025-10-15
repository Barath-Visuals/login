from fastapi import APIRouter, HTTPException, Depends, Query, Request
from typing import Optional
from datetime import datetime
from zoneinfo import ZoneInfo
from pydantic import BaseModel
from pymongo import DESCENDING
from database import (
    user_collection, 
    profile_collection, 
    login_logs_collection, 
    cliententry_collection, 
    inactive_history
)

from utils.auth import get_current_user

router = APIRouter()

class get_User(BaseModel):
    username : str
    role : str
    isStatus : str

class get_ClientData(BaseModel):
    client_name: str
    design_type: str
    folder_type: str
    start_date: str
    end_date: str

@router.get("/getUser")
def get_user():
    user_get = user_collection.find({ "role": {"$ne" : "admin"}})
    result = []
    for user in user_get:
        user["_id"] = str(user["_id"])

        profile = profile_collection.find_one({"username" : user["username"]})

        aadhaar_profile = None
        if profile and "aadhaar" in profile:
            aadhaar_profile = profile_collection.find_one({"aadhaar" : profile["aadhaar"]})
            if aadhaar_profile and "_id" in aadhaar_profile:
                aadhaar_profile["_id"] = str(aadhaar_profile["_id"])

        result.append({
            "username": user["username"],
            "role": user["role"],
            "isStatus": user.get("isStatus"),
            "name": profile["name"] if profile else None,
            "created_at" : user["created_at"],
            "aadhaar_profile" : {
                "aadhaar": aadhaar_profile.get("aadhaar") if aadhaar_profile else None,
                "name": aadhaar_profile.get("name") if aadhaar_profile else None
            } if aadhaar_profile else None,
            "inactive_date" : user.get("inactive_date")
        })

    return result


@router.delete("/users/{username}")
def delete_user(username: str):
    result = user_collection.delete_one({"username": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    login_logs_collection.delete_many({"username" : username})
    profile_collection.delete_many({"username" : username})
    return {"message": "User deleted successfully","username": username}


@router.post("/update-role")
async def update_role(data: get_User):
    user = user_collection.find_one({"username" : data.username})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_fields = {
        "role" : data.role,
        "isStatus" : data.isStatus
    }

    if data.isStatus == "Inactive":
        now = datetime.now(ZoneInfo("Asia/Kolkata")).isoformat()
        update_fields["inactive_date"] = now

        inactive_history.insert_one({
            "username": data.username,
            "status": "Inactive",
            "timestamp": now
        })
    elif data.isStatus == "Active":
        update_fields ["inactive_date"] = None

    result = user_collection.update_one(
        {"username": data.username},
        {"$set": update_fields}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not updated")
    
    updated_user = user_collection.find_one({"username" : data.username})
    return {
        "message": "Role/status updated successfully",
        "username": updated_user["username"],
        "role": updated_user["role"],
        "isStatus": updated_user["isStatus"],
        "inactive_date": updated_user.get("inactive_date")
    }


@router.get("/Client_data")
def get_client_data(
    client_name: Optional[str] = Query(None),
    design_type: Optional[str] = Query(None),
    folder_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: Optional[int] = Query(None, ge=1),
    skip: int = Query(0, ge=0),
):
    query = {}

    if client_name:
        query["client_name"] = { "$regex": client_name, "$options": "i" }
    if design_type:
        query["design_type"] = { "$regex": design_type, "$options": "i" }
    if folder_type:
        query["folder_type"] = { "$regex": folder_type, "$options": "i"}

    if search :
        query["$or"] = [
            {"client_name" : {"$regex": search, "$options": "i"}},
            {"design_type" : {"$regex": search, "$options": "i"}},
            {"folder_type" : {"$regex": search, "$options": "i"}},
        ]
    
    cursor = cliententry_collection.find(query).sort("start_date",DESCENDING).skip(skip)
    if limit is not None:
        cursor = cursor.limit(limit)

    result = []

    for entry in cursor:
        result.append({
            "client_name": entry["client_name"],
            "design_type": entry["design_type"],
            "folder_type": entry["folder_type"],
            "start_date": entry["start_date"].strftime("%Y-%m-%d"),
            "end_date": entry["end_date"].strftime("%Y-%m-%d"),
        })
    
    return result


@router.get("/User_attendance_log")
def get_user_attendance_log(current_user : dict = Depends(get_current_user)):
    users = list(profile_collection.find({}, {"username": 1, "name": 1, "_id": 0}))
    all_logs = []
    for user in users:
        username = user["username"]
        name = user["name"]
        logs = login_logs_collection.find_one({"username": username})
        for log in logs:
            login_time = log["login_time"]
            if isinstance(login_time, str):
                try: 
                    login_time = datetime.fromisoformat(login_time)
                except ValueError: 
                    login_time = login_time.astimezone(ZoneInfo ('Asia/Kolkata')).isoformat()
            all_logs.append({
                "username": username,
                "name": name,
                "login_time": login_time,
                "login_type": log.get("login_type", ""),
                "arrival_status": log.get("arrival_status", ""),
                "logout_time": log.get("logout_time")
            })
    return {'logs': all_logs}


@router.get("/admin/all_users")
def get_all_users(current_user : dict = Depends(get_current_user)):
    if current_user.get("role") not in ["admin", "HR", "Manager"]:
        raise HTTPException(status_code= 403, detail="You are not authorized to access this route")
    
    user_cursor = profile_collection.find({"role": {"$ne" : "admin"}})
    users = []
    for user in user_cursor:
        user["_id"] = str(user["_id"])
        users.append(user)
    return users

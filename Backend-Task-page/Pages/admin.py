from fastapi import APIRouter, HTTPException, Query, Request
from jose import JWTError, jwt
from typing import Optional, List
from fastapi import Depends
from datetime import datetime
from bson import ObjectId
from zoneinfo import ZoneInfo
from pydantic import BaseModel
from pymongo import MongoClient, DESCENDING
from utils.auth import get_current_user
# from schema.schemas import help_user
# from main import get_current_user

router = APIRouter()

SECRET_KEY = "mytask73391638281111042110@!@#$%^&*()_+=-<>?/.,][{]"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

client = MongoClient("mongodb://localhost:27017")
db = client["task_app"]
user_collection = db["tasks"]
profile_collection = db["profile"]
login_logs_collection = db["login_logs"]
settings_collection = db["settings"]
cliententry_collection = db["ClientEntries"]
client_collection = db["client"]
design_collection = db["design"]

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


def get_current_admin(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        found_admin = user_collection.find_one({"username": username})
        if not found_admin["role"] == "admin":
            raise HTTPException(status_code=401, detail="Unauthorized Admin")
        
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@router.get("/getUser")
def get_user():
    # found_user = user_collection.find_one({"username": request_user.username})
    # if not found_user:
    #     raise HTTPException(status_code=401, detail="invalid username or password")
    # if not request_user.role == "admin":
    #     raise HTTPException(status_code=401, detail="Unauthorized User")
    # if not request_user.status == "active":
    #     raise HTTPException(status_code=401, detail="User is inactive")
    
    user_get = user_collection.find({ "role": {"$ne" : "admin"}})
    result = []
    for user in user_get:
        user["_id"] = str(user["_id"])
        result.append({
            "username": user["username"],
            "role": user["role"],
            "isStatus": user.get("isStatus")
        })
    return result

@router.delete("/users/{username}")
def delete_user(username: str):
    result = user_collection.delete_one({"username": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "message": "User deleted successfully",
        "username": username
    }

@router.post("/update-role")
async def update_role(data: get_User):
    result = user_collection.update_one(
        {"username": data.username},
        {"$set": {"role": data.role, "isStatus": data.isStatus}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "message": "Role updated successfully",
        "username": data.username,
        "role": data.role,
        "isStatus": data.isStatus
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
    print("DEBUG current_user:", current_user) 
    if current_user.get("role") not in ["admin"]:
        raise HTTPException(status_code= 403, detail="You are not authorized to access this route")
    
    user_cursor = profile_collection.find({"role": {"$ne" : "admin"}})
    users = []

    for user in user_cursor:
        user["_id"] = str(user["_id"])
        users.append(user)

    return users

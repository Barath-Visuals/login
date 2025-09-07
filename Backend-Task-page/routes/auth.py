from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import bcrypt
from jose import jwt
from datetime import datetime, timedelta, timezone, time
from zoneinfo import ZoneInfo
from typing import Optional
from datetime import datetime
from database import user_collection, login_logs_collection, settings_collection, profile_collection
from utils.auth import SECRET_KEY, ALGORITHM
from utils.auth import get_current_user

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 240

class User(BaseModel):
    username: str
    password: str


def help_user(user) -> dict:
    return{
        "id": str(user["_id"]),
        "username": user["username"],
        "role": user.get("role", "staff"),
        "signup_date": user.get("signup_date"),
        "created_at": user.get("created_at")
    }


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({ "exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


#signup endpoint 
@router.post("/signup")
def signup(user : User):
    if user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="user already exists")

    admin_exists = settings_collection.find_one({"admin_created": True})
    role = "admin" if not admin_exists else "staff"

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    signup_date = datetime.now(ZoneInfo('Asia/Kolkata'))
    result = user_collection.insert_one({
        "username": user.username,
        "password": hashed_password.decode('utf-8'),
        "role": role,
        "isStatus": "Active",
        "signup_date": signup_date.isoformat(),
        "created_at": datetime.now(ZoneInfo('Asia/Kolkata')).isoformat()
    })

    if role == "admin":
        settings_collection.insert_one({"admin_created": True})

    new_user = user_collection.find_one({"_id": result.inserted_id})
    return{
        "message": "user created successfully",
        "user": help_user(new_user)
    }


#login endpoint
@router.post("/login")
def login(user: User):
    found_user = user_collection.find_one({"username": user.username})
    if not found_user:
        raise HTTPException(status_code=401, detail="invalid username or password")
    
    if not bcrypt.checkpw(user.password.encode('utf-8'), found_user["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="invalid username or password")
    
    check_admin = found_user["role"] == "admin"
    if not check_admin:
        if not found_user ["isStatus"] == "Active":
            raise HTTPException(status_code=401, detail="user is inactive")
    
    access_token = create_access_token(
        data={
            "sub": found_user["username"],
            "role": found_user.get("role", "staff")
        },
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    profile_exists = bool(found_user.get("name"))
    
    return {
        "message": "logged in successfully",
        "access_token": access_token,
        "user": help_user(found_user),
        "token_type": "bearer",
        "profile_exists": profile_exists
    }


#logout
@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user)):
    logout_time = datetime.utcnow()
    result = login_logs_collection.update_one(
        {"username": current_user["username"], "logout_time": None},
        {"$set": {"logout_time": logout_time}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="No active login session found")
    return {"message": "Logout recorded successfully", "logout_time": logout_time}

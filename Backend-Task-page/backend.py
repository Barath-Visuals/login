from fastapi import FastAPI, HTTPException, Request
from fastapi import Depends
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta, time, date, timezone
from zoneinfo import ZoneInfo
from typing import Optional
from Pages.clientEntries import router as clientEntriesRouter
from Pages.admin import router as adminRouter

app = FastAPI()

app.include_router(clientEntriesRouter)
app.include_router(adminRouter)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "mytask73391638281111042110@!@#$%^&*()_+=-<>?/.,][{]"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


#MongoDb Setup
client = MongoClient("mongodb://localhost:27017")
db = client["task_app"]
user_collection = db["tasks"]
profile_collection = db["profile"]
login_logs_collection = db["login_logs"]
settings_collection = db["settings"]

#Models
class User(BaseModel):
    username: str
    password: str


class UserDetails(BaseModel):
    username : str
    name: str
    age: str
    phone: str
    address: str
    aadhaar: Optional[str] = None

class AdminUserDetailUpdate(UserDetails):
    username : str
    aadhaar: Optional[str] = None

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


#sign up endpoint 
@app.post("/signup")
def signup(user : User):
    
    if user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="user already exists")

    admin_exists = settings_collection.find_one({"admin_created": True})
    role = "admin" if not admin_exists else "staff"


    #hashed the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    signup_date = datetime.now(ZoneInfo('Asia/Kolkata'))
    print("time", signup_date)
    #insert the new user and password
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
@app.post("/login")
def login(user: User):
    found_user = user_collection.find_one({"username": user.username})
    if not found_user:
        raise HTTPException(status_code=401, detail="invalid username or password")
    
    if not bcrypt.checkpw(user.password.encode('utf-8'), found_user["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="invalid username or password")
    
    #isActive = user_collection.find_one({"isStatus": "active"})
    check_admin = found_user["role"] == "admin"
    if not check_admin:
        if not found_user ["isStatus"] == "Active":
            raise HTTPException(status_code=401, detail="user is inactive")

        now_Kolkata = datetime.now(ZoneInfo("Asia/Kolkata"))
        print(f"Current time in Kolkata: {now_Kolkata.strftime('%Y-%m-%d %H:%M:%S')}")

        current_time = now_Kolkata.time()
        morning_time = time(23, 59)
        afternoon_start = time(13, 00)
        afternoon_end = time(13, 30)

        if current_time <= morning_time:
            login_type = "morning"
            arrival_status = "on_time"
        elif afternoon_start <= current_time <= afternoon_end:
            login_type = "afternoon"
            arrival_status = "late"
        else:
            #raise HTTPException(status_code=403, detail="Login only allowed before 10:30AM or between 1–2PM")
            print("hello")
        
        start_of_date = datetime(now_Kolkata.year, now_Kolkata.month, now_Kolkata.day, tzinfo=ZoneInfo("Asia/Kolkata"))
        end_of_date = start_of_date + timedelta(days=1)

        start_of_utc = start_of_date.astimezone(timezone.utc)
        end_of_utc = end_of_date.astimezone(timezone.utc)

        now_utc = datetime.now(timezone.utc)
        print("IST", now_utc)

        existing_logs = login_logs_collection.find_one({
            "username": user.username,
            "login_time": {"$gte": start_of_utc, "$lt": end_of_utc }
        })
        if existing_logs:
            raise HTTPException(status_code=403, detail="You have already logged in today")
        
        login_logs_collection.insert_one({
            "username": user.username,
            "login_time": now_utc,
            "login_type": login_type,
            "arrival_status": arrival_status,
            "logout_time": None
        })

        on_time_count = login_logs_collection.count_documents({
            "username": user.username,
            "arrival_status": "on_time"
        })

        late_count = login_logs_collection.count_documents({
            "username": user.username,
            "arrival_status": "late"
        })
    else:
        now_utc = datetime.now(timezone.utc)
        login_type = None
        arrival_status = None
        on_time_count = None
        late_count = None
    
    access_token = create_access_token(
        data={
            "sub": found_user["username"],
            "role": found_user.get("role", "staff")
        },
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Check if profile details exist (example: check if 'name' field exists)
    profile_exists = bool(found_user.get("name"))

    login_time_ist = now_utc.astimezone(ZoneInfo("Asia/Kolkata")).isoformat()
    print("DEBUG - login_time (IST):", login_time_ist)
    
    return {
        "message": "logged in successfully",
        "access_token": access_token,
        "user": help_user(found_user),
        "token_type": "bearer",
        "profile_exists": profile_exists,
        "login_time": login_time_ist,
        "arrival_status": arrival_status,  # Add this
        "on_time_count": on_time_count,
        "late_count": late_count,
        "logout_time": None
    }


def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("JWT Payload : ", payload)
        username = payload.get("sub")
        role = payload.get("role")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return {
            "username": username,
            "role" : role
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/attendance_logs/{username}")
def get_attendance_logs(username: str, limit: Optional[int] = 10, current_user: dict = Depends(get_current_user)):
    #if username != current_user["username"]:
        #raise HTTPException(status_code=403, detail="You are not authorized to view this user's")
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

    logs = logs[::-1]  # Oldest to newest
    return {"logs": logs, "name" : get_username.get("name")}


@app.post("/update_profile")
def update_profile(details: UserDetails, current_user: dict = Depends(get_current_user)):
    print(current_user["username"])
    print(details)
    #if current_user["username"] != details.username:
        #raise HTTPException(status_code=403, detail="Forbidden")
    
    username = current_user["username"]
    role = current_user.get('role',"staff")

    found_user = user_collection.find_one({"username": current_user["username"]})
    if not found_user:
        raise HTTPException(status_code=404, detail="user not found")
    
    # Update the user collection with the new details
    profile_data = {
        "username": current_user["username"],
        "name": details.name,
        "age": details.age,
        "phone": details.phone,
        "address": details.address
    }
    found_profile = profile_collection.find_one({"username": username})

    if found_profile:
        # Update profile
        result = profile_collection.update_one(
            {"username": username},
            {"$set": profile_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="profile not found")
        message = "Profile updated successfully"
    else:
        # Create new profile
        profile_collection.insert_one(profile_data)
        message = "Profile created successfully"

    return {"message": message}

@app.get("/user/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    print("Current user from token:", current_user)

    username = current_user["username"]
    role = current_user.get('role',"staff")

    user = profile_collection.find_one({"username": current_user["username"]})

    if not user:
        return {
            "profileComplete": False,
            "username": current_user["username"],  # Always return the username from token
            "name": None,
            "age": None,
            "phone": None,
            "address": None,
            "aadhaar": None if role in ["admin", "hr"] else None
        }

    # Check if essential profile info is present (e.g., "name")
    required_field = ["name", "age", "phone", "address"]
    profile_complete = all(user.get(field) for field in required_field)

    return {
        "profileComplete": profile_complete,
        "username": user.get("username"),
        "name": user.get("name"),
        "age": user.get("age"),
        "phone": user.get("phone"),
        "address": user.get("address"),
        "aadhaar": user.get("aadhar") if role in ["admin", "hr"] else None
    }

@app.post("/logout")
def logout(current_user: dict = Depends(get_current_user)):
     
    logout_time = datetime.utcnow()

    result = login_logs_collection.update_one(
        {"username": current_user["username"], "logout_time": None},
        {"$set": {"logout_time": logout_time}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="No active login session found")
    
    return {"message": "Logout recorded successfully", "logout_time": logout_time}


@app.get("/attendance_summary")
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

@app.post("/admin/profile/update")
def admin_update_user_profile(details : AdminUserDetailUpdate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admin can update user profile")
    
    target_user = profile_collection.find_one({"username" : details.username})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {
        "username": details.username,
        "name": details.name,
        "age" : details.age,
        "phone" : details.phone,
        "address" : details.address,
    }

    if details.aadhaar:
        update_data["aadhaar"] = details.aadhaar

    result = profile_collection.update_one({"username" : details.username}, {"$set": update_data})
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"Profile for '{details.username}' updated successfully."}
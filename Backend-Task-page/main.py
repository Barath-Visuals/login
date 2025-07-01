from fastapi import FastAPI, HTTPException, Request
from fastapi import Depends
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta, time
from zoneinfo import ZoneInfo
from Pages.clientEntries import router as clientEntriesRouter

app = FastAPI()

app.include_router(clientEntriesRouter)

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

client = MongoClient("mongodb://localhost:27017")
db = client["task_app"]
user_collection = db["tasks"]
profile_collection = db["profile"]
login_logs_collection = db["login_logs"]


class User(BaseModel):
    username: str
    password: str


class UserDetails(BaseModel):
    name: str
    age: str
    phone: str
    address: str

def help_user(user) -> dict:
    return{
        "id": str(user["_id"]),
        "username": user["username"]
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

    #hashed the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    #insert the new user and password
    result = user_collection.insert_one({
        "username": user.username,
        "password": hashed_password.decode('utf-8')
    })
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
    
    #now_Kolkata = datetime.now(ZoneInfo("Asia/Kolkata"))
    
    #current_time = now_Kolkata.time()
    #morning_time = time(10, 30)
    #afternoon_start = time(13, 0)
    #afternoon_end = time(13, 30)

    #if current_time <= morning_time:
        #login_type = "morning"
    #elif afternoon_start <= current_time <= afternoon_end:
        #login_type = "afternoon"
    #else:
        #raise HTTPException(status_code=403, detail="Login only allowed before 10:30AM or between 1–2PM")
    
    #start_of_date = datetime(now_Kolkata.year, now_Kolkata.month, now_Kolkata.day, tzinfo=ZoneInfo("Asia/Kolkata"))
    #end_of_date = start_of_date + timedelta(days=1)

    # existing_logs = login_logs_collection.find_one({
    #     "username": user.username,
    #     "login_time": {"$gte": start_of_date, "$lt": end_of_date }
    # })
    # if existing_logs:
    #     raise HTTPException(status_code=403, detail="You have already logged in today")
    
    # login_logs_collection.insert_one({
    #     "username": user.username,
    #     "login_time": now_Kolkata,
    #     "login_type": login_type,
    #     "logout_time": None
    # })
    access_token = create_access_token(
        data={"sub": found_user["username"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Check if profile details exist (example: check if 'name' field exists)
    profile_exists = bool(found_user.get("name"))
    
    return {
        "message": "logged in successfully",
        "access_token": access_token,
        "user": help_user(found_user),
        "token_type": "bearer",
        "profile_exists": profile_exists   # Add this flag here
    }

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")



@app.post("/update_profile")
def update_profile(details: UserDetails, current_user: dict = Depends(get_current_user)):
    print(current_user["username"])
    print(details)
    #if current_user["username"] != details.username:
        #raise HTTPException(status_code=403, detail="Forbidden")

    found_user = user_collection.find_one({"username": current_user["username"]})
    if not found_user:
        raise HTTPException(status_code=404, detail="user not found")
    
    # Update the user collection with the new details
    profile_collection.insert_one(
        {
            "username": current_user["username"],
            "name": details.name,
            "age": details.age,
            "phone": details.phone,
            "address": details.address
        }
    )
   
    return{
        "message": "profile updated successfully",
    }


@app.get("/user/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    user = profile_collection.find_one({"username": current_user["username"]})

    if not user:
        return {"profileComplete": False}

    # Check if essential profile info is present (e.g., "name")
    profile_complete = bool(user.get("name"))



    return {
        "profileComplete": profile_complete,
        "username": user.get("username"),
        "name": user.get("name"),
        "age": user.get("age"),
        "phone": user.get("phone"),
        "address": user.get("address"),
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
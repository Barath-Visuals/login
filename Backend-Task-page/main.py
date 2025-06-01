from fastapi import FastAPI, HTTPException, Request
from fastapi import Depends
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta

app = FastAPI()


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


class User(BaseModel):
    username: str
    password: str


class UserDetails(BaseModel):
    username: str
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
        "message": "unser created successfully",
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
    
    Login_time = datetime.utcnow()
    user_collection.update_one(
        {"_id": found_user["_id"]},
        {"$push": {"attendance": {"timestamp": Login_time}}}
    )

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
    if current_user["username"] != details.username:
        raise HTTPException(status_code=403, detail="Forbidden")

    found_user = user_collection.find_one({"username": current_user["username"]})
    if not found_user:
        raise HTTPException(status_code=404, detail="user not found")
    
    update_fields = {
        "name": details.name,
        "age": details.age,
        "phone": details.phone,
        "address": details.address
    }

    user_collection.update_one(
        {"_id": found_user["_id"]},
        {"$set": update_fields}
    )

    return{
        "message": "profile updated successfully",
        "profile": update_fields
    }


@app.get("/user/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    user = user_collection.find_one({"username": current_user["username"]})

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
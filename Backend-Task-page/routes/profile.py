from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import profile_collection, user_collection
from utils.auth import get_current_user

router = APIRouter()

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


@router.post("/update_profile")
def update_profile(details: UserDetails, current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    role = current_user.get('role',"staff")

    found_user = user_collection.find_one({"username": current_user["username"]})
    if not found_user:
        raise HTTPException(status_code=404, detail="user not found")
    
    profile_data = {
        "username": current_user["username"],
        "name": details.name,
        "age": details.age,
        "phone": details.phone,
        "address": details.address
    }
    found_profile = profile_collection.find_one({"username": username})

    if found_profile:
        result = profile_collection.update_one({"username": username}, {"$set": profile_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="profile not found")
        message = "Profile updated successfully"
    else:
        profile_collection.insert_one(profile_data)
        message = "Profile created successfully"

    return {"message": message}


@router.get("/user/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    role = current_user.get('role',"staff")

    user = profile_collection.find_one({"username": current_user["username"]})

    if not user:
        return {
            "profileComplete": False,
            "username": current_user["username"],
            "name": None,
            "age": None,
            "phone": None,
            "address": None,
            "aadhaar": None if role in ["admin", "hr"] else None
        }

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


@router.post("/admin/profile/update")
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

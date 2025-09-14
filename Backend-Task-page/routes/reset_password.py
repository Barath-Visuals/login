from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from bson import ObjectId
from database import user_collection
from utils.auth import get_current_user

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

class ResetPasswordRequest(BaseModel):
    username : str
    newPassword : str

@router.post("/admin/reset-password")
def reset_password(data : ResetPasswordRequest, current_user : dict = Depends(get_current_user)):
    if current_user.get("role") not in ["admin", "HR"]:
        raise HTTPException(status_code = 403, detail = "Not authorized")
    
    hashed_password = pwd_context.hash(data.newPassword)

    result = user_collection.update_one(
        {"username" : data.username},
        {"$set" : {"password" : hashed_password}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": f"Password reset successfully for {data.username}"}
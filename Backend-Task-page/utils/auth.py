from fastapi import Request, HTTPException
from jose import jwt, JWTError

SECRET_KEY = "mytask73391638281111042110@!@#$%^&*()_+=-<>?/.,][{]"
ALGORITHM = "HS256"

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
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

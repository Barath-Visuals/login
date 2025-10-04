from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, profile, attendance, admin, clientEntries, automation
from routes import SignInOut, reset_password
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(attendance.router)
app.include_router(SignInOut.router, prefix="/auth", tags=["Auth"])
app.include_router(automation.router, prefix="/report", tags=["Report"])
app.include_router(admin.router)
app.include_router(clientEntries.router)
app.include_router(reset_password.router)

origins = os.getenv("CORS_ORIGINS", "").split(",")
if origins == [""]:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

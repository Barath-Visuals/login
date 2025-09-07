from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, profile, attendance, admin, clientEntries, automation
from routes import SignInOut

app = FastAPI()

# Routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(attendance.router)
app.include_router(SignInOut.router, prefix="/auth", tags=["Auth"])
app.include_router(automation.router, prefix="/report", tags=["Report"])
app.include_router(admin.router)
app.include_router(clientEntries.router)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routes import auth, profile, attendance, admin, clientEntries, automation
from routes import SignInOut, reset_password
import os
from dotenv import load_dotenv
import uvicorn

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

# ------------------
# Root endpoint
# ------------------
@app.get("/")
def root():
    return {"message": "API is running!"}

# ------------------
# Static files
# ------------------
if not os.path.exists("static"):
    os.makedirs("static")  # create folder if it doesn't exist

# Mount /static for general static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve robots.txt directly at /robots.txt
@app.get("/robots.txt")
def robots():
    return FileResponse("static/robots.txt")

# ------------------
# Start server (Railway dynamic port)
# ------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
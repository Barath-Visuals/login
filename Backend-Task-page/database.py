import os
import urllib.parse
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from dotenv import load_dotenv

load_dotenv()  # loads root .env

user = os.getenv("MONGO_USER")
password = os.getenv("MONGO_PASSWORD")
db_name = os.getenv("MONGO_DB")

if not user or not password or not db_name:
    raise ValueError("❌ Missing MongoDB credentials in .env!")

user_encoded = urllib.parse.quote_plus(user)
password_encoded = urllib.parse.quote_plus(password)

uri = f"mongodb+srv://{user_encoded}:{password_encoded}@cluster0.vvpxa.mongodb.net/{db_name}?retryWrites=true&w=majority"

client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())
db = client.get_database(db_name)


# Collections
user_collection = db["tasks"]
profile_collection = db["profile"]
login_logs_collection = db["login_logs"]
settings_collection = db["settings"]
cliententry_collection = db["ClientEntries"]
client_collection = db["client"]
design_collection = db["design"]
inactive_history = db["inactive_records"]

try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB Atlas (database.py)")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
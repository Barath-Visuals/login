from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["task_app"]

# Collections
user_collection = db["tasks"]
profile_collection = db["profile"]
login_logs_collection = db["login_logs"]
settings_collection = db["settings"]
cliententry_collection = db["ClientEntries"]
client_collection = db["client"]
design_collection = db["design"]
inactive_history = db["inactive_records"]
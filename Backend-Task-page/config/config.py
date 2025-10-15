import os
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 240))
ADMIN_SETUP_KEY = os.getenv("ADMIN_SETUP_KEY")
user = os.getenv("MONGO_USER")
password = os.getenv("MONGO_PASSWORD")
db_name = os.getenv("MONGO_DB")
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key_123!@#")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
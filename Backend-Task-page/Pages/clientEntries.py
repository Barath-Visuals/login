import uuid
from fastapi import FastAPI,APIRouter, HTTPException, Request, Query
from fastapi import Depends
from pydantic import BaseModel
from pymongo import MongoClient, DESCENDING
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime
from typing import Optional

router = APIRouter()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

client = MongoClient("mongodb://localhost:27017")
db = client["task_app"]
cliententry_collection = db["ClientEntries"]
client_collection = db["client"]
design_collection = db["design"]

class ClientEntry(BaseModel):
    client_id: Optional [str] = None
    client_name: str
    design_id: Optional [str] = None
    design_type: str
    folder_type: str
    start_date: str
    end_date: str


@router.post("/clientEntry")
def create_client_entry(client_entry: ClientEntry):
    client_entry_dictc = client_entry.dict()


    if not client_entry_dictc.get("client_id"):
        get_client = client_collection.find_one({"client_name": client_entry_dictc["client_name"]})

        if not get_client:
            #generate the uuid for client id
            client_id = str(uuid.uuid4())
            client_name = client_entry_dictc["client_name"]
            client_collection.insert_one(
                {
                    "client_id": client_id,
                    "client_name": client_name,
                }
            )
        else:
            client_id = get_client["client_id"]
            client_name = get_client["client_name"]
    else:
        client_id = client_entry_dictc["client_id"]
        client_name = client_entry_dictc["client_name"]

    
    if not client_entry_dictc.get("design_id"):
        get_details = design_collection.find_one({"design_type": client_entry_dictc["design_type"]})

        if not get_details:
            #generate the uuid for design id
            design_id = str(uuid.uuid4())
            design_type = client_entry_dictc["design_type"]
            design_collection.insert_one(
                {
                    "design_id": design_id,
                    "design_type": design_type,
                }
            )
        else:
            design_id = get_details["design_id"]
            design_type = get_details["design_type"]
    else:
        design_id = client_entry_dictc["design_id"]
        design_type = client_entry_dictc["design_type"]

    client_entry_dictc["start_date"] = datetime.strptime(client_entry_dictc["start_date"], "%Y-%m-%d")
    client_entry_dictc["end_date"] = datetime.strptime(client_entry_dictc["end_date"], "%Y-%m-%d")

    cliententry_collection.insert_one(
        {
            "client_id": client_id,
            "client_name": client_name,
            "design_id": design_id,
            "design_type": design_type,
            "folder_type": client_entry_dictc["folder_type"],
            "start_date": client_entry_dictc["start_date"],
            "end_date": client_entry_dictc["end_date"],
        }
    )
    return {"message": "Client entry created successfully"}

@router.get("/clientDashboard")
def get_client_dashboard(
    client_name: Optional[str] = Query(None),
    design_type: Optional[str] = Query(None),
    folder_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: Optional[int] = Query(None, ge=1),
    skip: int = Query(0, ge=0),
):
    query = {}

    if client_name:
        query["client_name"] = {"$regex": client_name, "$options": "i"}
    if design_type:
        query["design_type"] = {"$regex": design_type, "$options": "i"}
    if folder_type:
        query["folder_type"] = {"$regex": folder_type, "$options": "i"}

    if search:
        query["$or"] = [
            {"client_name": {"$regex" : search, "$options" : "i"}},
            {"folder_type" : {"$regex" : search, "$options" : "i"}},
            {"design_type": {"$regex": search, "$options": "i"}},
        ]
    # entries = cliententry_collection.find(query)\
    #     .sort("start_date", DESCENDING)\
    #     .skip(skip)\
    #     .limit(limit)
    
    cursor = cliententry_collection.find(query).sort("start_date", DESCENDING).skip(skip)
    if limit is not None:
        cursor = cursor.limit(limit)

    result = []

    for entry in cursor:
        result.append({
            "client_name": entry["client_name"],
            "design_type": entry["design_type"],
            "folder_type": entry["folder_type"],
            "start_date": entry["start_date"].strftime("%Y-%m-%d"),
            "end_date": entry["end_date"].strftime("%Y-%m-%d"),
        })


    return result
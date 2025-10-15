import uuid
from fastapi import FastAPI,APIRouter, HTTPException, Request, Query
from fastapi import Depends
from pydantic import BaseModel
from pymongo import MongoClient, DESCENDING
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime
from typing import Optional
from database import (cliententry_collection, client_collection, design_collection)
from utils.auth import get_current_user

router = APIRouter()

class ClientEntry(BaseModel):
    client_id: Optional [str] = None
    client_name: str
    design_id: Optional [str] = None
    design_type: str
    folder_type: str
    start_date: str
    end_date: Optional [str] = None

class UpdateClientEntry(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None



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

    start_date = datetime.strptime(client_entry_dictc["start_date"], "%Y-%m-%d")
    end_date = None
    entry_id = str(uuid.uuid4())

    cliententry_collection.insert_one(
        {
            "entry_id": entry_id,
            "client_id": client_id,
            "client_name": client_name,
            "design_id": design_id,
            "design_type": design_type,
            "folder_type": client_entry_dictc["folder_type"],
            "start_date": start_date,
            "end_date": end_date,
        }
    )
    return {
        "message": "Client entry created successfully",
        "entry_id": entry_id,
        "client_id": client_id,
        "client_name": client_entry_dictc["client_name"],
        "design_id": design_id,
        "design_type": client_entry_dictc["design_type"],
        "folder_type": client_entry_dictc["folder_type"],
        "start_date": start_date,
        "end_date": end_date,
    }


@router.get("/clientDashboard")
def get_client_dashboard(
    client_name: Optional[str] = Query(None),
    design_type: Optional[str] = Query(None),
    folder_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    start_date : Optional[str] = Query(None),
    end_date : Optional[str] = Query(None),
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

    if start_date and end_date:
        start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        end_dt = datetime.strptime(end_date, "%Y-%m-%d")

        query["$and"] = [
            {"start_date" : {"$gte" : start_dt}},
            {"end_date" : {"$lte" : end_dt}}
        ]
    
    elif start_date and not end_date:
        target_dt = datetime.strptime(start_date, "%Y-%m-%d")
        query["$and"] = [
            {"start_date": {"$lte": target_dt}},
            {"end_date": {"$gte": target_dt}},
        ]
    
    elif end_date and not start_date:
        target_dt = datetime.strptime(end_date, "%Y-%m-%d")
        query["end_date"] ={"$lte" : target_dt} 

    cursor = cliententry_collection.find(query).sort("start_date", DESCENDING).skip(skip)
    if limit is not None:
        cursor = cursor.limit(limit)
    

    result = []

    for entry in cursor:
        result.append({
            "entry_id": entry["entry_id"],
            "client_name": entry["client_name"],
            "design_type": entry["design_type"],
            "folder_type": entry["folder_type"],
            "start_date": entry["start_date"].strftime("%Y-%m-%d") if entry.get("start_date") else None,
            "end_date": entry["end_date"].strftime("%Y-%m-%d") if entry.get("end_date") else None,
        })


    return result


@router.put("/clientEntry/{entry_id}")
def updateDates(entry_id: str, updated_entry : UpdateClientEntry):
    entry = cliententry_collection.find_one({"entry_id" : entry_id})

    if not entry:
        raise HTTPException(status_code=404, detail="Client entry not found")
    
    updated_data = updated_entry.dict(exclude_unset = True)

    if "start_date" in updated_data:
        updated_data["start_date"] = datetime.strptime(updated_data["start_date"], "%Y-%m-%d")
    if "end_date" in updated_data:
        updated_data["end_date"] = datetime.strptime(updated_data["end_date"], "%Y-%m-%d")

    cliententry_collection.update_one(
        {"entry_id" : entry_id},
        {"$set" : updated_data}
    )

    return{"message": "Client entry updated successfully"}
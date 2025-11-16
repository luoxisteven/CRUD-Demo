import json
import os
from pymongo import MongoClient
from bson.objectid import ObjectId


_mongo_client = None


def _get_db():
    global _mongo_client
    if _mongo_client is None:
        mongo_url = os.environ.get("MONGO_URL") or os.environ.get("DB_HOST")
        if not mongo_url:
            raise RuntimeError("Missing MONGO_URL")
        _mongo_client = MongoClient(mongo_url)
    db_name = os.environ.get("MONGO_DB_NAME") or os.environ.get("DB_NAME") or "test"
    return _mongo_client[db_name]


def _resp(status, obj):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(obj, ensure_ascii=False),
    }


def lambda_handler(event, context):
    try:
        data = event if isinstance(event, dict) else {}
        title = (data.get("Title") or data.get("title") or "").strip()
        if not title:
            return _resp(400, {"message": "Title is required."})

        description = (data.get("Description") or data.get("description") or "") or ""
        status = (data.get("Status") or data.get("status") or "To Do") or "To Do"

        db = _get_db()
        res = db["Tasks"].insert_one({
            "Title": title,
            "Description": description,
            "Status": status,
        })

        return _resp(201, {
            "Id": str(res.inserted_id),
            "Title": title,
            "Description": description,
            "Status": status,
        })
    except Exception as e:
        print(f"ERROR: {e}")
        return _resp(500, {"message": "Internal Server Error"})




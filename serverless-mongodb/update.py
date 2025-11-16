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


def _resolve_id(event):
    if isinstance(event, dict):
        if "id" in event:
            try:
                return ObjectId(str(event["id"]))
            except Exception:
                return None
        if "Id" in event:
            try:
                return ObjectId(str(event["Id"]))
            except Exception:
                return None
    path_params = event.get("pathParameters") or {}
    query_params = event.get("queryStringParameters") or {}
    if "id" in path_params:
        try:
            return ObjectId(str(path_params["id"]))
        except Exception:
            return None
    if "id" in query_params:
        try:
            return ObjectId(str(query_params["id"]))
        except Exception:
            return None
    return None


def lambda_handler(event, context):
    try:
        oid = _resolve_id(event)
        if oid is None:
            return _resp(400, {"message": "Missing or invalid 'id' parameter."})

        data = event if isinstance(event, dict) else {}
        title = data.get("Title") if "Title" in data or "title" in data else None
        if title is None and "title" in data:
            title = data.get("title")
        description = data.get("Description") if "Description" in data or "description" in data else None
        if description is None and "description" in data:
            description = data.get("description")
        status = data.get("Status") if "Status" in data or "status" in data else None
        if status is None and "status" in data:
            status = data.get("status")

        update_fields = {}
        if title is not None:
            update_fields["Title"] = title
        if description is not None:
            update_fields["Description"] = description
        if status is not None:
            update_fields["Status"] = status

        if not update_fields:
            return _resp(400, {"message": "No fields to update."})

        db = _get_db()
        res = db["Tasks"].update_one({"_id": oid}, {"$set": update_fields})
        if res.matched_count == 0:
            return _resp(404, {"message": "Not found."})

        doc = db["Tasks"].find_one(
            {"_id": oid},
            {"Title": 1, "Description": 1, "Status": 1},
        )
        if not doc:
            return _resp(404, {"message": "Not found."})

        return _resp(200, {
            "Id": str(oid),
            "Title": doc.get("Title", ""),
            "Description": doc.get("Description", ""),
            "Status": doc.get("Status", ""),
        })
    except Exception as e:
        print(f"ERROR: {e}")
        return _resp(500, {"message": "Internal Server Error"})




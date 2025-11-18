import json
import os
from urllib.parse import quote_plus
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId

_mongo_client = None

def _get_db_collection():
    global _mongo_client
    if _mongo_client is None:
        mongo_url = os.environ.get("MONGO_URL")
        if not mongo_url:
            host = os.environ.get("MONGO_HOST")
            port = os.environ.get("MONGO_PORT", "27017")
            user = os.environ.get("MONGO_USER")
            password = os.environ.get("MONGO_PASSWORD")
            auth_source = os.environ.get("MONGO_AUTH_SOURCE", "admin")
            if user and password:
                user_enc = quote_plus(user)
                pass_enc = quote_plus(password)
                mongo_url = f"mongodb://{user_enc}:{pass_enc}@{host}:{port}/?authSource={auth_source}"
            else:
                mongo_url = f"mongodb://{host}:{port}"
        _mongo_client = MongoClient(mongo_url)
    db_name = os.environ.get("MONGO_DB_NAME")
    db = _mongo_client[db_name]
    collection_name = os.environ.get("MONGO_COLLECTION")
    if not collection_name:
        raise ValueError("MONGO_COLLECTION is required")
    return db[collection_name]


def _resp(status, obj):
    # Access Control Headers should be included to avoid CORS errors
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        "body": json.dumps(obj, ensure_ascii=False),
    }

def _parse_event(event):
    if isinstance(event, dict):
        if "body" in event:
            body = event.get("body")
            if not body:
                return {}
            if isinstance(body, (bytes, bytearray)):
                body = body.decode("utf-8")
            try:
                return json.loads(body)
            except Exception:
                return {}
        return event
    return {}


def lambda_handler(event, context):
    try:
        action = event.get("action")
        
        col = _get_db_collection()

        if action == "get":
            id_str = event.get("id") or event.get("Id")
            try:
                oid = ObjectId(id_str)
            except Exception:
                return _resp(400, {"message": "Missing or invalid 'id'."})
            doc = col.find_one({"_id": oid}, {"title": 1, "description": 1, "status": 1})
            if not doc:
                return _resp(404, {"message": "Not found."})
            return _resp(200, {
                "Id": str(oid),
                "title": doc.get("title", ""),
                "description": doc.get("description", ""),
                "status": doc.get("status", ""),
            })
        elif action == "create":
            title = event.get("title")
            description = event.get("description", "")
            status = event.get("status", "To Do")
            if not title:
                return _resp(400, {"message": "Title is required."})
            res = col.insert_one({
                "title": title,
                "description": description,
                "status": status,
            })
            return _resp(201, {
                "Id": str(res.inserted_id),
                "title": title,
                "description": description,
                "status": status,
            })
        elif action == "update":
            id_str = event.get("id")
            oid = ObjectId(id_str)
            update_doc = {}
            if "title" in event:
                update_doc["title"] = event.get("title")
            if "description" in event:
                update_doc["description"] = event.get("description")
            if "status" in event:
                update_doc["status"] = event.get("status")
            if not update_doc:
                return _resp(400, {"message": "No fields to update."})
            res = col.update_one({"_id": oid}, {"$set": update_doc})
            if res.matched_count == 0:
                return _resp(404, {"message": "Not found."})
            doc = col.find_one({"_id": oid}, {"title": 1, "description": 1, "status": 1})
            return _resp(200, {
                "Id": str(oid),
                "title": doc.get("title", ""),
                "description": doc.get("description", ""),
                "status": doc.get("status", ""),
            })
        elif action == "delete":
            id_str = event.get("id")
            res = col.delete_one({"_id": ObjectId(id_str)})
            if res.deleted_count == 0:
                return _resp(404, {"message": "Not found."})
            return _resp(200, {"deleted": True})
        else:
            cur = col.find(
                {}, # filter
                {"title": 1, "description": 1, "status": 1}, # projection (which columns to return)
            ).sort([("_id", DESCENDING)])
            rows = [{
                "Id": str(doc["_id"]),
                "title": doc.get("title", ""),
                "description": doc.get("description", ""),
                "status": doc.get("status", ""),
            } for doc in cur]
            return _resp(200, rows)

        # Unknown or missing action
        return _resp(400, {"message": "Missing or invalid 'action'. Use one of: list, get, create, update, delete."})

    except ValueError as ve:
        return _resp(400, {"message": str(ve)})
    except Exception as e:
        print(f"ERROR: {e}")
        return _resp(500, {"message": "Internal Server Error"})



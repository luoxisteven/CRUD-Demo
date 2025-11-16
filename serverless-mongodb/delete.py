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

        db = _get_db()
        res = db["Tasks"].delete_one({"_id": oid})

        if res.deleted_count == 0:
            return _resp(404, {"message": "Not found."})

        return _resp(200, {"deleted": True})
    except Exception as e:
        print(f"ERROR: {e}")
        return _resp(500, {"message": "Internal Server Error"})




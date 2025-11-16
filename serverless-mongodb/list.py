import json
import os
from pymongo import MongoClient, ASCENDING, DESCENDING
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
        db = _get_db()
        cur = db["Tasks"].find(
            {},
            {
                "Title": 1,
                "Description": 1,
                "Status": 1,
            },
        ).sort([("_id", DESCENDING)])

        rows = []
        for doc in cur:
            rows.append({
                "Id": str(doc["_id"]),
                "Title": doc.get("Title", ""),
                "Description": doc.get("Description", ""),
                "Status": doc.get("Status", ""),
            })

        return _resp(200, rows)
    except Exception as e:
        print(f"ERROR: {e}")
        return _resp(500, {"message": "Internal Server Error"})




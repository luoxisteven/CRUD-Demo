import json
import os
from urllib.parse import quote_plus
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId

_mongo_client = None

def _get_db():
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
    collection_name = os.environ.get("MONGO_COLLECTION")
    return _mongo_client[db_name][collection_name]


def _resp(status, obj):
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


def lambda_handler(event, context):
    try:
        payload = json.loads(event.get("body"))
        action = payload.get("action").lower()
        col = _get_db()

        if action == "list":
            cur = col.find(
                {},
                {"title": 1, "description": 1, "status": 1},
            ).sort([("_id", DESCENDING)])
            rows = [{
                "Id": str(doc["_id"]),
                "title": doc.get("title", ""),
                "description": doc.get("description", ""),
                "status": doc.get("status", ""),
            } for doc in cur]
            return _resp(200, rows)

        elif action == "get":
            id_str = payload.get("id")
            oid = ObjectId(id_str)
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
            title = payload.get("title")

            if not title:
                return _resp(400, {"message": "Title is required."})
            description = payload.get("description", "")
            status = payload.get("status", "To Do")
            if len(title) > 100 or len(description) > 200 or len(status) > 50:
                return _resp(400, {"message": "Input length exceeds limits."})
                
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
            id_str = payload.get("id")
            oid = ObjectId(id_str)
            update_doc = {}
            limits = {"title": 100, "description": 200, "status": 50}
            for key, max_len in limits.items():
                if key in payload:
                    value = payload.get(key)
                    if len(value) > max_len:
                        return _resp(400, {"message": "Input length exceeds limits."})
                    update_doc[key] = value
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
            id_str = payload.get("id")
            oid = ObjectId(id_str)
            res = col.delete_one({"_id": oid})
            if res.deleted_count == 0:
                return _resp(404, {"message": "Not found."})
            return _resp(200, {"deleted": True})

        # Unknown or missing action
        return _resp(400, {"message": "Missing or invalid 'action'. Use one of: list, get, create, update, delete."})

    except Exception as e:
        print(f"ERROR: {e}")
        return _resp(500, {"message": "Internal Server Error"})
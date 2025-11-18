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
    return _mongo_client[db_name]


def _resp(status, obj):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(obj, ensure_ascii=False),
    }

def _parse_event(event):
    # Accept raw JSON event or API Gateway proxy with body
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


def _to_oid(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return None


def lambda_handler(event, context):
    try:
        payload = _parse_event(event)
        action = (payload.get("action") or payload.get("Action") or payload.get("method") or payload.get("op") or "").lower()

        db = _get_db()
        collection_name = os.environ.get("MONGO_COLLECTION")
        col = db[collection_name]

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

        if action == "get":
            id_str = payload.get("id") or payload.get("Id")
            oid = _to_oid(id_str)
            if not oid:
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

        if action == "create":
            title = (payload.get("Title") or payload.get("title") or "").strip()
            if not title:
                return _resp(400, {"message": "Title is required."})
            description = payload.get("Description") or payload.get("description") or ""
            status = payload.get("Status") or payload.get("status") or "To Do"
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

        if action == "update":
            id_str = payload.get("id") or payload.get("Id")
            oid = _to_oid(id_str)
            if not oid:
                return _resp(400, {"message": "Missing or invalid 'id'."})
            update_doc = {}
            if "Title" in payload or "title" in payload:
                update_doc["title"] = payload.get("Title") if "Title" in payload else payload.get("title")
            if "Description" in payload or "description" in payload:
                update_doc["description"] = payload.get("Description") if "Description" in payload else payload.get("description")
            if "Status" in payload or "status" in payload:
                update_doc["status"] = payload.get("Status") if "Status" in payload else payload.get("status")
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

        if action == "delete":
            id_str = payload.get("id") or payload.get("Id")
            oid = _to_oid(id_str)
            if not oid:
                return _resp(400, {"message": "Missing or invalid 'id'."})
            res = col.delete_one({"_id": oid})
            if res.deleted_count == 0:
                return _resp(404, {"message": "Not found."})
            return _resp(200, {"deleted": True})

        # Unknown or missing action
        return _resp(400, {"message": "Missing or invalid 'action'. Use one of: list, get, create, update, delete."})

    except Exception as e:
        print(f"ERROR: {e}")
        return _resp(500, {"message": "Internal Server Error"})

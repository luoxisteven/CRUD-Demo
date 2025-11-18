import json
import os
from pymongo import MongoClient
from bson.objectid import ObjectId
from urllib.parse import quote_plus, urlparse


_mongo_client = None


def _build_mongo_url() -> str:
    mongo_url = os.environ.get("MONGO_URL")
    if mongo_url:
        return mongo_url
    host = os.environ.get("MONGO_HOST") or os.environ.get("DB_HOST") or "localhost"
    port = os.environ.get("MONGO_PORT", "27017")
    user = os.environ.get("MONGO_USER")
    password = os.environ.get("MONGO_PASSWORD")
    auth_source = os.environ.get("MONGO_AUTH_SOURCE", "admin")
    if user and password:
        user_enc = quote_plus(user)
        pass_enc = quote_plus(password)
        return f"mongodb://{user_enc}:{pass_enc}@{host}:{port}/?authSource={auth_source}"
    return f"mongodb://{host}:{port}"


def _get_client() -> MongoClient:
    global _mongo_client
    if _mongo_client is None:
        _mongo_client = MongoClient(_build_mongo_url())
    return _mongo_client


def _get_db():
    db_name = os.environ.get("MONGO_DB_NAME") or os.environ.get("DB_NAME") or "test"
    return _get_client()[db_name], db_name


def _resp(status, obj):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(obj, ensure_ascii=False),
    }


def _redact_url(url: str) -> str:
    try:
        p = urlparse(url)
        if p.username or p.password:
            auth = p.username or ""
            if auth:
                auth = quote_plus(auth)
            # mask password if present
            return f"{p.scheme}://{auth}:{'***'}@{p.hostname}:{p.port}{p.path or ''}{'?' + p.query if p.query else ''}"
        return url
    except Exception:
        return url


def lambda_handler(event, context):
    try:
        url = _build_mongo_url()
        client = _get_client()
        ping_ok = False
        try:
            client.admin.command("ping")
            ping_ok = True
        except Exception:
            ping_ok = False

        db, db_name = _get_db()
        collection_env = os.environ.get("MONGO_COLLECTION") or "Tasks"
        collection_lower = collection_env.lower()

        collections = sorted(db.list_collection_names())

        counts = {}
        samples = {}
        for cname in {collection_env, collection_lower}:
            try:
                counts[cname] = db[cname].count_documents({})
                cur = db[cname].find({}, {"Title": 1, "Description": 1, "Status": 1, "title": 1, "description": 1, "status": 1}).limit(3)
                s = []
                for d in cur:
                    s.append({
                        "Id": str(d.get("_id")),
                        "Title": d.get("Title") or d.get("title"),
                        "Description": d.get("Description") or d.get("description"),
                        "Status": d.get("Status") or d.get("status"),
                    })
                samples[cname] = s
            except Exception as e:
                counts[cname] = f"error: {e.__class__.__name__}"
                samples[cname] = []

        result = {
            "connected": ping_ok,
            "mongo": {
                "url": _redact_url(url),
                "dbName": db_name,
                "collectionEnv": collection_env,
            },
            "collections": collections[:50],
            "docCounts": counts,
            "sample": samples,
        }
        return _resp(200, result)
    except Exception as e:
        print(f"ERROR: {e}")
        return _resp(500, {"message": "Internal Server Error"})
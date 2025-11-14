import json
import os
import pymysql

def _conn():
    return pymysql.connect(
        host=os.environ["DB_HOST"],
        port=int(os.environ.get("DB_PORT", "3306")),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
    )


def _resolve_id(event):
    # Prefer raw JSON event: {"id": 123}
    if isinstance(event, dict):
        if "id" in event:
            try:
                return int(event["id"])
            except Exception:
                return None
        if "Id" in event:
            try:
                return int(event["Id"])
            except Exception:
                return None
    # Fallback: API Gateway styles
    path_params = event.get("pathParameters") or {}
    query_params = event.get("queryStringParameters") or {}
    if "id" in path_params:
        try:
            return int(path_params["id"])
        except Exception:
            return None
    if "id" in query_params:
        try:
            return int(query_params["id"])
        except Exception:
            return None
    return None


def lambda_handler(event, context):
    try:
        _id = _resolve_id(event)
        if _id is None:
            return {"message": "Missing or invalid 'id' parameter."}

        with _conn() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM Tasks WHERE Id = %s", (_id,))
                affected = cur.rowcount

        if affected == 0:
            return {"message": "Not found."}

        return {"deleted": True}

    except Exception as e:
        print(f"ERROR: {e}")
        return {"message": "Internal Server Error"}



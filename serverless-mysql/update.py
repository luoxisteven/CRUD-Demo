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


def _resp(status, obj):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(obj, ensure_ascii=False),
    }


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
            return _resp(400, {"message": "Missing or invalid 'id' parameter."})

        # Accept raw JSON event as payload
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

        set_parts = []
        params = []
        if title is not None:
            set_parts.append("Title = %s")
            params.append(title)
        if description is not None:
            set_parts.append("Description = %s")
            params.append(description)
        if status is not None:
            set_parts.append("Status = %s")
            params.append(status)

        if not set_parts:
            return _resp(400, {"message": "No fields to update."})

        with _conn() as conn:
            with conn.cursor() as cur:
                sql = f"UPDATE Tasks SET {', '.join(set_parts)} WHERE Id = %s"
                cur.execute(sql, (*params, _id))

            with conn.cursor() as cur:
                cur.execute(
                    "SELECT Id, Title, Description, Status FROM Tasks WHERE Id = %s",
                    (_id,),
                )
                row = cur.fetchone()

        if not row:
            return _resp(404, {"message": "Not found."})

        return _resp(200, row)

    except Exception as e:
        print(f"ERROR: {e}")
        return _resp(500, {"message": "Internal Server Error"})



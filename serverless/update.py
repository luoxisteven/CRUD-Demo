import json
import os
import base64
import pymysql


def _headers():
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
    }


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


def _parse_body(event):
    body = event.get("body")
    if not body:
        return {}
    if event.get("isBase64Encoded"):
        body = base64.b64decode(body).decode("utf-8")
    try:
        return json.loads(body)
    except Exception:
        return {}


def _resolve_id(event):
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
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 204, "headers": _headers(), "body": ""}

    try:
        _id = _resolve_id(event)
        if _id is None:
            return {
                "statusCode": 400,
                "headers": _headers(),
                "body": json.dumps({"message": "Missing or invalid 'id' parameter."}),
            }

        data = _parse_body(event)
        title = data.get("Title") if "Title" in data or "title" in data else None
        if title is None and "title" in data:
            title = data.get("title")
        description = (
            data.get("Description") if "Description" in data or "description" in data else None
        )
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
            return {
                "statusCode": 400,
                "headers": _headers(),
                "body": json.dumps({"message": "No fields to update."}),
            }

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
            return {
                "statusCode": 404,
                "headers": _headers(),
                "body": json.dumps({"message": "Not found."}),
            }

        return {"statusCode": 200, "headers": _headers(), "body": json.dumps(row)}

    except Exception as e:
        print(f"ERROR: {e}")
        return {
            "statusCode": 500,
            "headers": _headers(),
            "body": json.dumps({"message": "Internal Server Error"}),
        }



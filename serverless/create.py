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


def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 204, "headers": _headers(), "body": ""}

    try:
        data = _parse_body(event)
        title = (data.get("Title") or data.get("title") or "").strip()
        if not title:
            return {
                "statusCode": 400,
                "headers": _headers(),
                "body": json.dumps({"message": "Title is required."}),
            }

        description = (data.get("Description") or data.get("description") or "") or ""
        status = (data.get("Status") or data.get("status") or "To Do") or "To Do"

        with _conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO Tasks (Title, Description, Status)
                    VALUES (%s, %s, %s)
                    """,
                    (title, description, status),
                )
                new_id = cur.lastrowid

        created = {
            "Id": int(new_id),
            "Title": title,
            "Description": description,
            "Status": status,
        }
        return {"statusCode": 201, "headers": _headers(), "body": json.dumps(created)}

    except Exception as e:
        # Optional: print for CloudWatch logs
        print(f"ERROR: {e}")
        return {
            "statusCode": 500,
            "headers": _headers(),
            "body": json.dumps({"message": "Internal Server Error"}),
        }



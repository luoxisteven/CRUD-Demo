import json
import os
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
    )


def lambda_handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 204, "headers": _headers(), "body": ""}

    try:
        with _conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT Id, Title, Description, Status FROM Tasks ORDER BY Id DESC"
                )
                rows = cur.fetchall() or []

        return {"statusCode": 200, "headers": _headers(), "body": json.dumps(rows)}
    except Exception as e:
        print(f"ERROR: {e}")
        return {
            "statusCode": 500,
            "headers": _headers(),
            "body": json.dumps({"message": "Internal Server Error"}),
        }



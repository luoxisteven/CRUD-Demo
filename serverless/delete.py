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
        autocommit=True,
    )


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

        with _conn() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM Tasks WHERE Id = %s", (_id,))
                affected = cur.rowcount

        if affected == 0:
            return {
                "statusCode": 404,
                "headers": _headers(),
                "body": json.dumps({"message": "Not found."}),
            }

        return {"statusCode": 204, "headers": _headers(), "body": ""}

    except Exception as e:
        print(f"ERROR: {e}")
        return {
            "statusCode": 500,
            "headers": _headers(),
            "body": json.dumps({"message": "Internal Server Error"}),
        }



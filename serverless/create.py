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
    
def lambda_handler(event, context):
    try:
        # Accept direct raw JSON event
        data = event if isinstance(event, dict) else {}
        title = (data.get("Title") or data.get("title") or "").strip()
        if not title:
            return {"message": "Title is required."}

        description = (data.get("Description") or data.get("description") or "") or ""
        status = (data.get("Status") or data.get("status") or "To Do") or "To Do"

        with _conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO Tasks (Id, Title, Description, Status)
                    VALUES (NULL, %s, %s, %s)
                    """,
                    (title, description, status),
                )
                new_id = cur.lastrowid

        return {
            "Id": int(new_id),
            "Title": title,
            "Description": description,
            "Status": status,
        }

    except Exception as e:
        print(f"ERROR: {e}")
        return {"message": "Internal Server Error"}



import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
    "Access-Control-Max-Age": "86400",
}

def handler(event: dict, context) -> dict:
    """Возвращает список пользователей для ленты знакомств (кроме текущего)."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
    if not token:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE session_token = %s", (token,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия устарела"})}
    current_id = row[0]

    cur.execute("""
        SELECT id, name, age, city, about, interests, avatar_url
        FROM users
        WHERE id != %s AND name IS NOT NULL AND name != ''
        ORDER BY id DESC
        LIMIT 50
    """, (current_id,))

    rows = cur.fetchall()
    conn.close()

    users = []
    for r in rows:
        uid, name, age, city, about, interests, avatar_url = r
        users.append({
            "id": uid,
            "name": name or "",
            "age": age or 0,
            "city": city or "",
            "about": about or "",
            "interests": [i.strip() for i in (interests or "").split(",") if i.strip()],
            "avatar_url": avatar_url or "",
            "verified": False,
            "online": False,
            "match": 75,
        })

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"users": users}),
    }

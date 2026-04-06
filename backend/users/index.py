import json
import os
import math
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
    "Access-Control-Max-Age": "86400",
}

def haversine(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    return round(R * 2 * math.asin(math.sqrt(a)))

def get_token(event):
    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
    if not token:
        token = (event.get("queryStringParameters") or {}).get("token", "")
    return token

def handler(event: dict, context) -> dict:
    """Список пользователей для ленты; сохранение геолокации текущего пользователя."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    token = get_token(event)
    if not token:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute("SELECT id, lat, lng FROM users WHERE session_token = %s", (token,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия устарела"})}
    current_id, my_lat, my_lng = row
    params = event.get("queryStringParameters") or {}

    # POST — сохранить координаты
    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        lat = body.get("lat")
        lng = body.get("lng")
        if lat is not None and lng is not None:
            cur.execute("UPDATE users SET lat=%s, lng=%s WHERE id=%s", (lat, lng, current_id))
            conn.commit()
            my_lat, my_lng = lat, lng
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # GET ?user_id=X — один пользователь по ID
    user_id_param = params.get("user_id")
    if user_id_param:
        cur.execute("""
            SELECT id, name, age, city, about, interests, avatar_url
            FROM users WHERE id = %s
        """, (int(user_id_param),))
        r = cur.fetchone()
        conn.close()
        if not r:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Не найден"})}
        uid, name, age, city, about, interests, avatar_url = r
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"user": {
            "id": uid, "name": name or "", "age": age or 0, "city": city or "",
            "about": about or "", "avatar_url": avatar_url or "",
            "interests": [i.strip() for i in (interests or "").split(",") if i.strip()],
        }})}

    # GET — список пользователей
    cur.execute("""
        SELECT id, name, age, city, about, interests, avatar_url, lat, lng
        FROM users
        WHERE id != %s AND name IS NOT NULL AND name != ''
        ORDER BY id DESC
        LIMIT 50
    """, (current_id,))

    rows = cur.fetchall()
    conn.close()

    users = []
    for r in rows:
        uid, name, age, city, about, interests, avatar_url, lat, lng = r
        distance = None
        if my_lat and my_lng and lat and lng:
            distance = haversine(my_lat, my_lng, lat, lng)
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
            "distance": distance,
        })

    # сортируем: с геолокацией первыми (по расстоянию), остальные в конец
    users.sort(key=lambda u: u["distance"] if u["distance"] is not None else 99999)

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"users": users}),
    }
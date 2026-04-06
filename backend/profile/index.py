import json
import os
import psycopg2

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def get_user_by_token(cur, token):
    cur.execute("SELECT id, name, email, city, about, interests, age FROM users WHERE session_token = %s", (token,))
    return cur.fetchone()

def handler(event: dict, context) -> dict:
    """Получение и обновление профиля пользователя приложения Цепь."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
    if not token:
        return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "Не авторизован"})}

    conn = get_conn()
    cur = conn.cursor()
    row = get_user_by_token(cur, token)
    if not row:
        conn.close()
        return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "Сессия устарела"})}

    user_id, name, email, city, about, interests, age = row

    if event.get("httpMethod") == "GET":
        conn.close()
        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({
                "id": user_id, "name": name, "email": email,
                "city": city or "", "about": about or "",
                "interests": interests or "", "age": age or 0
            })
        }

    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        new_name = body.get("name", name).strip()
        new_city = body.get("city", city or "").strip()
        new_about = body.get("about", about or "").strip()
        new_interests = body.get("interests", interests or "").strip()
        new_age = int(body.get("age", age or 0))

        if not new_name:
            conn.close()
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Имя не может быть пустым"})}

        cur.execute(
            "UPDATE users SET name=%s, city=%s, about=%s, interests=%s, age=%s WHERE id=%s",
            (new_name, new_city, new_about, new_interests, new_age, user_id)
        )
        conn.commit()
        conn.close()
        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({
                "ok": True,
                "user": {"id": user_id, "name": new_name, "email": email,
                         "city": new_city, "about": new_about,
                         "interests": new_interests, "age": new_age}
            })
        }

    conn.close()
    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Метод не поддерживается"})}

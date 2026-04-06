import json
import os
import hashlib
import secrets
import psycopg2

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Авторизация: регистрация и вход пользователей приложения Цепь."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")  # "register" | "login"

    conn = get_conn()
    cur = conn.cursor()

    if action == "register":
        name = body.get("name", "").strip()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not name or not email or not password:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Заполни все поля"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Пароль должен быть не менее 6 символов"})}

        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": cors, "body": json.dumps({"error": "Этот email уже зарегистрирован"})}

        token = secrets.token_hex(32)
        pw_hash = hash_password(password)
        cur.execute(
            "INSERT INTO users (name, email, password_hash, session_token) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, email, pw_hash, token)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"ok": True, "token": token, "user": {"id": user_id, "name": name, "email": email}})
        }

    elif action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not email or not password:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Введи email и пароль"})}

        pw_hash = hash_password(password)
        cur.execute("SELECT id, name, email FROM users WHERE email = %s AND password_hash = %s", (email, pw_hash))
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "Неверный email или пароль"})}

        user_id, name, email = row
        token = secrets.token_hex(32)
        cur.execute("UPDATE users SET session_token = %s WHERE id = %s", (token, user_id))
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"ok": True, "token": token, "user": {"id": user_id, "name": name, "email": email}})
        }

    conn.close()
    return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Неизвестное действие"})}

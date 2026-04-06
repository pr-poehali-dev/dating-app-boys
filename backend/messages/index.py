import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
    "Access-Control-Max-Age": "86400",
}

def get_token(event):
    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
    if not token:
        token = (event.get("queryStringParameters") or {}).get("token", "")
    return token

def handler(event: dict, context) -> dict:
    """Социальные функции: симпатии, совпадения, список чатов, переписка, отправка сообщений."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    token = get_token(event)
    if not token:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE session_token = %s", (token,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия устарела"})}
    me = row[0]

    method = event.get("httpMethod")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    # GET ?action=likes
    if method == "GET" and action == "likes":
        cur.execute("""
            SELECT u.id, u.name, u.age, u.city, u.avatar_url
            FROM likes l JOIN users u ON u.id = l.to_user_id
            WHERE l.from_user_id = %s
        """, (me,))
        my_likes = [{"id": r[0], "name": r[1], "age": r[2] or 0, "city": r[3] or "", "avatar_url": r[4] or ""} for r in cur.fetchall()]

        cur.execute("""
            SELECT u.id, u.name, u.age, u.city, u.avatar_url
            FROM likes l1
            JOIN likes l2 ON l1.from_user_id = l2.to_user_id AND l1.to_user_id = l2.from_user_id
            JOIN users u ON u.id = l1.to_user_id
            WHERE l1.from_user_id = %s
        """, (me,))
        matches = [{"id": r[0], "name": r[1], "age": r[2] or 0, "city": r[3] or "", "avatar_url": r[4] or ""} for r in cur.fetchall()]

        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"my_likes": my_likes, "matches": matches})}

    # POST ?action=like
    if method == "POST" and action == "like":
        body = json.loads(event.get("body") or "{}")
        to_user_id = body.get("to_user_id")
        like_action = body.get("action", "like")

        if not to_user_id:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Нет to_user_id"})}

        if like_action == "unlike":
            cur.execute("DELETE FROM likes WHERE from_user_id = %s AND to_user_id = %s", (me, to_user_id))
        else:
            cur.execute("""
                INSERT INTO likes (from_user_id, to_user_id) VALUES (%s, %s)
                ON CONFLICT (from_user_id, to_user_id) DO NOTHING
            """, (me, to_user_id))

        cur.execute("SELECT id FROM likes WHERE from_user_id = %s AND to_user_id = %s", (to_user_id, me))
        is_match = cur.fetchone() is not None
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "is_match": is_match})}

    # GET ?action=chats
    if method == "GET" and action == "chats":
        cur.execute("""
            SELECT DISTINCT ON (other_id)
                other_id,
                u.name, u.age, u.city, u.avatar_url,
                m.text, m.created_at, m.from_user_id,
                (SELECT COUNT(*) FROM messages
                 WHERE to_user_id = %s AND from_user_id = other_id AND is_read = FALSE) as unread
            FROM (
                SELECT CASE WHEN from_user_id = %s THEN to_user_id ELSE from_user_id END as other_id,
                       id, text, created_at, from_user_id
                FROM messages
                WHERE from_user_id = %s OR to_user_id = %s
            ) m
            JOIN users u ON u.id = other_id
            ORDER BY other_id, m.created_at DESC
        """, (me, me, me, me))

        chats = []
        for r in cur.fetchall():
            other_id, name, age, city, avatar_url, last_text, created_at, from_uid, unread = r
            chats.append({
                "user_id": other_id,
                "name": name or "",
                "age": age or 0,
                "city": city or "",
                "avatar_url": avatar_url or "",
                "last_message": last_text,
                "last_time": created_at.strftime("%H:%M") if created_at else "",
                "is_mine": from_uid == me,
                "unread": int(unread),
            })
        chats.sort(key=lambda x: x["last_time"], reverse=True)
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"chats": chats})}

    # GET ?action=history&with_user=ID
    if method == "GET" and action == "history":
        other_id = int(params.get("with_user", 0))
        if not other_id:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Нет with_user"})}

        cur.execute("""
            UPDATE messages SET is_read = TRUE
            WHERE to_user_id = %s AND from_user_id = %s AND is_read = FALSE
        """, (me, other_id))

        cur.execute("""
            SELECT id, from_user_id, text, created_at
            FROM messages
            WHERE (from_user_id = %s AND to_user_id = %s)
               OR (from_user_id = %s AND to_user_id = %s)
            ORDER BY created_at ASC LIMIT 100
        """, (me, other_id, other_id, me))

        msgs = [{"id": r[0], "from": "me" if r[1] == me else "them", "text": r[2], "time": r[3].strftime("%H:%M")} for r in cur.fetchall()]
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"messages": msgs})}

    # POST ?action=send
    if method == "POST" and action == "send":
        body = json.loads(event.get("body") or "{}")
        to_user_id = body.get("to_user_id")
        text = (body.get("text") or "").strip()

        if not to_user_id or not text:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Нет получателя или текста"})}

        cur.execute("""
            INSERT INTO messages (from_user_id, to_user_id, text)
            VALUES (%s, %s, %s) RETURNING id, created_at
        """, (me, to_user_id, text))
        msg_id, created_at = cur.fetchone()
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "ok": True, "id": msg_id, "time": created_at.strftime("%H:%M")
        })}

    conn.close()
    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}

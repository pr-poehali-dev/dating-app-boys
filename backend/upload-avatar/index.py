import json
import os
import base64
import uuid
import psycopg2
import boto3

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

def handler(event: dict, context) -> dict:
    """Загрузка фото профиля пользователя в S3 и сохранение CDN URL в БД."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
    if not token:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    body = json.loads(event.get("body") or "{}")
    image_b64 = body.get("image")
    content_type = body.get("contentType", "image/jpeg")

    if not image_b64:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Нет изображения"})}

    if len(image_b64) > 5 * 1024 * 1024 * 4 // 3:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Файл слишком большой (макс. 5 МБ)"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE session_token = %s", (token,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия устарела"})}
    user_id = row[0]

    ext = "jpg" if "jpeg" in content_type else content_type.split("/")[-1]
    key = f"avatars/{user_id}/{uuid.uuid4().hex}.{ext}"
    image_data = base64.b64decode(image_b64)

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=key, Body=image_data, ContentType=content_type)

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    cur.execute("UPDATE users SET avatar_url = %s WHERE id = %s", (cdn_url, user_id))
    conn.commit()
    conn.close()

    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "url": cdn_url})}
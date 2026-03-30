from flask import Blueprint, request, jsonify
from db import get_db_connection
import json

schemes_bp = Blueprint("schemes_admin", __name__)


# ==========================================
# ➕ ADD NEW SCHEME
# ==========================================
@schemes_bp.route("/add", methods=["POST"])
def add_scheme():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        data = request.get_json()

        # ✅ BASIC VALIDATION
        if not data:
            return jsonify({"error": "No data received"}), 400

        title = data.get("title")
        name = data.get("name")
        name_hi = data.get("name_hi")
        category = data.get("category")
        category_hi = data.get("category_hi")
        description = data.get("description")
        description_long = data.get("description_long")
        description_hi = data.get("description_hi")
        official_url = data.get("official_url")
        image = data.get("image")

        # 🔥 Convert arrays → JSON string
        documents = data.get("documents", [])
        documents_hi = data.get("documents_hi", [])
        # ✅ OPTIONAL VALIDATION
        if not title or not name or not category:
            return jsonify({"error": "Missing required fields"}), 400

        query = """
            INSERT INTO schemes (
                title, name, name_hi, category, category_hi,
                description, description_long, description_hi,
                documents, documents_hi, official_url, image
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cur.execute(query, (
            title,
            name,
            name_hi,
            category,
            category_hi,
            description,
            description_long,
            description_hi,
            documents,
            documents_hi,
            official_url,
            image
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": "✅ Scheme added successfully"
        }), 201

    except Exception as e:
        print("🔥 ERROR IN ADD SCHEME:", str(e))  # ✅ debug log
        return jsonify({"error": str(e)}), 500
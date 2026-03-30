from flask import Blueprint, request, jsonify
from db import get_db_connection

import os
import time
from werkzeug.utils import secure_filename

tool_requests_bp = Blueprint("tool_requests", __name__)

# ==========================================
# 📁 CORRECT PATH SETUP
# ==========================================
BASE_DIR = os.getcwd()
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads", "tools")  # ✅ FIXED


@tool_requests_bp.route("/request", methods=["POST"])
def create_tool_request():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        name = request.form.get("name")
        type_ = request.form.get("type")
        location = request.form.get("location")
        price = request.form.get("price")
        description = request.form.get("description")

        print("FILES RECEIVED:", request.files)

        # ==========================================
        # 🖼️ IMAGE HANDLING
        # ==========================================
        image = None

        if "image" in request.files:
            image_file = request.files["image"]

            if image_file and image_file.filename != "":

                safe_name = secure_filename(name) if name else "tool"
                filename = secure_filename(image_file.filename)

                unique_name = f"{safe_name}_{int(time.time())}_{filename}"

                # ✅ Ensure folder exists
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)

                save_path = os.path.join(UPLOAD_FOLDER, unique_name)

                print("Saving image to:", save_path)

                # ✅ Save file
                image_file.save(save_path)

                # ✅ STORE ONLY RELATIVE PATH
                image = f"tools/{unique_name}"

        # ==========================================
        # DATABASE INSERT
        # ==========================================
        query = """
            INSERT INTO tool_requests (name, type, location, price, description, image)
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        cur.execute(query, (name, type_, location, price, description, image))
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "message": "Tool request submitted successfully",
            "image_path": image
        }), 201

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
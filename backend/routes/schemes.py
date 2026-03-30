import sys
import os
import json

# Add project root to path so db module can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, jsonify
from db import get_db_connection

schemes_bp = Blueprint('schemes', __name__)

# Resolve path to local fallback JSON file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL_FILE = os.path.join(BASE_DIR, "data", "schemes.json")


# ✅ PUBLIC ROUTE → /api/schemes
@schemes_bp.route("/", methods=["GET"])
def get_schemes():
    try:
        # =========================
        # FETCH FROM DATABASE
        # =========================
        conn = get_db_connection()
        cur = conn.cursor()

        # 👉 Only approved schemes for users (IMPORTANT)
        cur.execute("SELECT * FROM schemes;")

        columns = [desc[0] for desc in cur.description]
        rows = cur.fetchall()

        schemes = [dict(zip(columns, row)) for row in rows]

        cur.close()
        conn.close()

        return jsonify({
            "source": "database",
            "data": schemes
        }), 200

    except Exception as db_error:
        print("❌ Database fetch failed:", db_error)

        try:
            # =========================
            # FALLBACK → LOCAL JSON
            # =========================
            with open(LOCAL_FILE, "r", encoding="utf-8") as file:
                local_data = json.load(file)

            return jsonify({
                "source": "local",
                "message": "Database unavailable. Showing offline data.",
                "data": local_data
            }), 200

        except Exception as file_error:
            print("❌ Local file read failed:", file_error)

            return jsonify({
                "source": "error",
                "message": "Unable to fetch schemes data",
                "data": []
            }), 500
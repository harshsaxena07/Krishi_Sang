import sys
import os
import json

# Add project root to path so db module can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, jsonify
from db import get_db_connection

tools_bp = Blueprint('tools', __name__)

# Resolve path to local fallback JSON file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL_FILE = os.path.join(BASE_DIR, "data", "tools.json")


@tools_bp.route("/tools", methods=["GET"])
def get_tools():
    try:
        # Fetch from database
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM tools;")

        columns = [desc[0] for desc in cur.description]
        rows = cur.fetchall()

        tools = [dict(zip(columns, row)) for row in rows]

        cur.close()
        conn.close()

        return jsonify({
            "source": "database",
            "data": tools
        }), 200

    except Exception as db_error:
        print("Database fetch failed:", db_error)

        try:
            # Fallback to local JSON
            with open(LOCAL_FILE, "r") as file:
                local_data = json.load(file)

            return jsonify({
                "source": "local",
                "message": "Database unavailable. Showing offline data.",
                "data": local_data
            }), 200

        except Exception as file_error:
            print("Local file read failed:", file_error)

            return jsonify({
                "source": "error",
                "message": "Unable to fetch tools data",
                "data": []
            }), 500
import sys
import os
import json
import math

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, jsonify, request
from db import get_db_connection

stores_bp = Blueprint('stores', __name__)

# Local fallback file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL_FILE = os.path.join(BASE_DIR, "data", "stores.json")


#Haversine Distance Function
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) ** 2)

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


@stores_bp.route("/stores", methods=["GET"])
def get_nearby_stores():
    try:
        # Get user location from query params
        user_lat = float(request.args.get("lat"))
        user_lng = float(request.args.get("lng"))

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM agri_stores;")

        columns = [desc[0] for desc in cur.description]
        rows = cur.fetchall()

        stores = [dict(zip(columns, row)) for row in rows]

        cur.close()
        conn.close()

        nearby_stores = []

        for store in stores:
            distance = calculate_distance(
                user_lat,
                user_lng,
                store["latitude"],
                store["longitude"]
            )

            if distance <= 30:
                store["distance"] = round(distance, 2)
                nearby_stores.append(store)

        # Sort by nearest
        nearby_stores.sort(key=lambda x: x["distance"])

        return jsonify({
            "source": "database",
            "count": len(nearby_stores),
            "data": nearby_stores
        }), 200

    except Exception as db_error:
        print("Database fetch failed:", db_error)

        try:
            # Fallback to local JSON
            with open(LOCAL_FILE, "r", encoding="utf-8") as file:
                local_data = json.load(file)

            # If no location passed → return all
            if not request.args.get("lat"):
                return jsonify({
                    "source": "local",
                    "data": local_data
                }), 200

            user_lat = float(request.args.get("lat"))
            user_lng = float(request.args.get("lng"))

            nearby_stores = []

            for store in local_data:
                distance = calculate_distance(
                    user_lat,
                    user_lng,
                    store["latitude"],
                    store["longitude"]
                )

                if distance <= 30:
                    store["distance"] = round(distance, 2)
                    nearby_stores.append(store)

            nearby_stores.sort(key=lambda x: x["distance"])

            return jsonify({
                "source": "local",
                "count": len(nearby_stores),
                "data": nearby_stores
            }), 200

        except Exception as file_error:
            print("Local file failed:", file_error)

            return jsonify({
                "source": "error",
                "message": "Unable to fetch stores",
                "data": []
            }), 500
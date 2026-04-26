import sys
import os
import json
import ast

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, jsonify, request
from db import get_db_connection
from math import radians, cos, sin, asin, sqrt

marketplace_bp = Blueprint('marketplace', __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL_FILE = os.path.join(BASE_DIR, "data", "marketplace.json")


# ================================
# PARSE POSTGRES ARRAY SAFELY
# ================================
def parse_pg_array(value):
    try:
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            return ast.literal_eval(value.replace('{', '[').replace('}', ']'))
    except:
        return []
    return []


# ================================
# DISTANCE FUNCTION (HAVERSINE)
# ================================
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # KM

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))

    return R * c


# ================================
# GET ALL PRODUCTS
# ================================
@marketplace_bp.route("/marketplace", methods=["GET"])
def get_marketplace():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM marketplace;")

        columns = [desc[0] for desc in cur.description]
        rows = cur.fetchall()

        products = [dict(zip(columns, row)) for row in rows]

        cur.close()
        conn.close()

        return jsonify({
            "source": "database",
            "count": len(products),
            "data": products
        }), 200

    except Exception as e:
        print("DB error:", e)

        try:
            with open(LOCAL_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)

            return jsonify({
                "source": "local",
                "data": data
            }), 200

        except Exception as e2:
            print("Local error:", e2)

            return jsonify({
                "source": "error",
                "data": []
            }), 500


# ================================
# GET NEARBY PRODUCTS (FINAL)
# ================================
@marketplace_bp.route("/marketplace/nearby", methods=["GET"])
def get_nearby_products():
    try:
        lat = request.args.get("lat")
        lng = request.args.get("lng")

        if not lat or not lng:
            return jsonify({
                "message": "lat and lng required",
                "data": []
            }), 400

        lat = float(lat)
        lng = float(lng)

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT 
                m.id,
                m.name,
                m.name_hi,
                m.company,
                m.type,
                m.price,
                m.rating,
                m.reviews,
                m.platform,
                m.benefits,
                m.benefits_hi,
                m.description,
                m.description_hi,
                m.image,
                m.link,
                s.name,
                s.city,
                s.latitude,
                s.longitude
            FROM marketplace m
            JOIN agri_stores s ON m.store_id = s.id
        """)

        rows = cur.fetchall()
        result = []

        for row in rows:
            try:
                distance = calculate_distance(lat, lng, row[17], row[18])

                result.append({
                    "id": row[0],
                    "name": row[1],
                    "name_hi": row[2],
                    "company": row[3],
                    "type": row[4].strip() if row[4] else "",
                    "price": row[5],
                    "rating": float(row[6]) if row[6] else 0,
                    "reviews": int(row[7]) if row[7] else 0,
                    "platform": row[8],
                    "benefits": parse_pg_array(row[9]),
                    "benefits_hi": parse_pg_array(row[10]),
                    "description": row[11],
                    "description_hi": row[12],
                    "image": row[13],
                    "link": row[14],
                    "store": row[15],
                    "city": row[16],
                    "distance": round(distance, 2)
                })

            except Exception as inner_error:
                print("Row error:", inner_error)

        cur.close()
        conn.close()

        # ================================
        # FINAL LOGIC
        # ================================

        # Sort by nearest distance
        result.sort(key=lambda x: x["distance"])

        # Take top 6 nearest (clean UI)
        nearby = result[:6]

        return jsonify({
            "count": len(nearby),
            "data": nearby
        }), 200

    except Exception as e:
        print("Nearby error:", e)

        return jsonify({
            "message": "Failed",
            "data": []
        }), 500
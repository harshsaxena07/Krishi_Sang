from flask import Blueprint, request, jsonify
from db import get_db_connection

loans_bp = Blueprint("loans_admin", __name__)


# ==========================================
# ➕ ADD NEW LOAN
# ==========================================
@loans_bp.route("/add", methods=["POST"])
def add_loan():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        data = request.get_json()

        # ✅ VALIDATION
        if not data:
            return jsonify({"error": "No data received"}), 400

        name = data.get("name")
        name_hi = data.get("name_hi")
        bank = data.get("bank")

        purpose = data.get("purpose")
        purpose_hi = data.get("purpose_hi")

        eligibility = data.get("eligibility")
        eligibility_hi = data.get("eligibility_hi")

        official_website = data.get("official_website")
        image = data.get("image")

        # ✅ IMPORTANT: ARRAY (NO json.dumps)
        documents = data.get("documents", [])
        documents_hi = data.get("documents_hi", [])

        # ✅ REQUIRED FIELD CHECK
        if not name or not bank or not purpose:
            return jsonify({"error": "Missing required fields"}), 400

        # ==========================================
        # 💾 INSERT QUERY
        # ==========================================
        query = """
            INSERT INTO loans (
                name, name_hi, bank,
                purpose, purpose_hi,
                eligibility, eligibility_hi,
                documents, documents_hi,
                official_website, image
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cur.execute(query, (
            name,
            name_hi,
            bank,
            purpose,
            purpose_hi,
            eligibility,
            eligibility_hi,
            documents,        # ✅ ARRAY
            documents_hi,     # ✅ ARRAY
            official_website,
            image
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": "✅ Loan added successfully"
        }), 201

    except Exception as e:
        print("🔥 ERROR IN ADD LOAN:", str(e))
        return jsonify({"error": str(e)}), 500
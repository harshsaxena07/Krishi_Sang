from flask import Blueprint, jsonify
from db import get_db_connection

loan_approval_bp = Blueprint("loan_approval", __name__)


# -----------------------------------
# 📥 GET ALL PENDING LOAN REQUESTS
# -----------------------------------
@loan_approval_bp.route("/", methods=["GET"])
def get_pending_loans():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM loan_requests ORDER BY id DESC;")
        rows = cur.fetchall()

        columns = [desc[0] for desc in cur.description]

        result = []
        for row in rows:
            loan = dict(zip(columns, row))

            # ✅ FORCE FRONTEND IMAGE PATH
            if loan.get("image"):
                filename = loan["image"].split("/")[-1]
                loan["image"] = f"/images/{filename}"

            result.append(loan)

        cur.close()
        conn.close()

        return jsonify(result), 200

    except Exception as e:
        print("GET ERROR:", e)
        return jsonify({"error": str(e)}), 500


# -----------------------------------
# ✅ APPROVE LOAN
# -----------------------------------
@loan_approval_bp.route("/approve/<int:loan_id>", methods=["POST"])
def approve_loan(loan_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM loan_requests WHERE id = %s;", (loan_id,))
        row = cur.fetchone()

        if not row:
            return jsonify({"error": "Loan not found"}), 404

        columns = [desc[0] for desc in cur.description]
        loan = dict(zip(columns, row))

        # ✅ FIX IMAGE PATH BEFORE INSERT
        if loan.get("image"):
            filename = loan["image"].split("/")[-1]
            loan["image"] = f"/images/{filename}"

        cur.execute("""
            INSERT INTO loans 
            (name, name_hi, bank, purpose, purpose_hi, eligibility, eligibility_hi, documents, documents_hi, official_website, image)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (
            loan["name"],
            loan["name_hi"],
            loan["bank"],
            loan["purpose"],
            loan["purpose_hi"],
            loan["eligibility"],
            loan["eligibility_hi"],
            loan["documents"],
            loan["documents_hi"],
            loan["official_website"],
            loan["image"]
        ))

        cur.execute("DELETE FROM loan_requests WHERE id = %s;", (loan_id,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Approved"}), 200

    except Exception as e:
        print("APPROVE ERROR:", e)
        return jsonify({"error": str(e)}), 500


# -----------------------------------
# ❌ REJECT LOAN
# -----------------------------------
@loan_approval_bp.route("/reject/<int:loan_id>", methods=["DELETE"])
def reject_loan(loan_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM loan_requests WHERE id = %s;", (loan_id,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Rejected"}), 200

    except Exception as e:
        print("REJECT ERROR:", e)
        return jsonify({"error": str(e)}), 500
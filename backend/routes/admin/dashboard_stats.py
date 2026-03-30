from flask import Blueprint, jsonify
from db import get_db_connection

admin_stats_bp = Blueprint("admin_stats", __name__)


@admin_stats_bp.route("/dashboard-stats", methods=["GET"])
def get_dashboard_stats():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # ---------------------------
        # 📊 COUNT DATA
        # ---------------------------

        # Pending Tools
        cur.execute("SELECT COUNT(*) FROM tool_requests;")
        pending_tools = cur.fetchone()[0]

        # Pending Loans
        cur.execute("SELECT COUNT(*) FROM loan_requests;")
        pending_loans = cur.fetchone()[0]

        # Active Schemes
        cur.execute("SELECT COUNT(*) FROM schemes;")
        active_schemes = cur.fetchone()[0]

        cur.close()
        conn.close()

        return jsonify({
            "pendingTools": pending_tools,
            "pendingLoans": pending_loans,
            "activeSchemes": active_schemes
        }), 200

    except Exception as e:
        print("DASHBOARD STATS ERROR:", e)
        return jsonify({"error": str(e)}), 500
from flask import Blueprint, jsonify
from db import get_db_connection

tool_approval_bp = Blueprint("tool_approval", __name__)

# ==========================================
# 🔹 GET ALL PENDING TOOLS
# ==========================================
@tool_approval_bp.route("/pending", methods=["GET"])
def get_pending_tools():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT id, name, type, location, price, description, image, status
            FROM tool_requests
            WHERE status = 'pending'
            ORDER BY id DESC
        """)

        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]

        tools = [dict(zip(columns, row)) for row in rows]

        cur.close()
        conn.close()

        return jsonify(tools)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# 🔹 APPROVE TOOL (MOVE TO tools TABLE)
# ==========================================
@tool_approval_bp.route("/approve/<int:tool_id>", methods=["POST"])
def approve_tool(tool_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1️⃣ Get tool from tool_requests
        cur.execute("SELECT * FROM tool_requests WHERE id = %s", (tool_id,))
        row = cur.fetchone()

        if not row:
            return jsonify({"error": "Tool not found"}), 404

        columns = [desc[0] for desc in cur.description]
        tool = dict(zip(columns, row))

        # 2️⃣ Insert into tools table
        cur.execute("""
            INSERT INTO tools (
                name, type, price_per_day, rating, available,
                location, owner, image
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            tool["name"],
            tool["type"],
            tool["price"],          # map price → price_per_day
            4.5,                    # default rating
            True,                   # available
            tool["location"],
            tool.get("owner", "Admin"),
            f"/uploads/{tool['image']}" if tool["image"] else None
        ))

        # 3️⃣ Delete from tool_requests
        cur.execute("DELETE FROM tool_requests WHERE id = %s", (tool_id,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": "Tool approved and moved to tools table"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ==========================================
# 🔹 REJECT TOOL (DELETE ONLY)
# ==========================================
@tool_approval_bp.route("/reject/<int:tool_id>", methods=["POST"])
def reject_tool(tool_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # ❌ Delete from tool_requests
        cur.execute("""
            DELETE FROM tool_requests
            WHERE id = %s
        """, (tool_id,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "message": "Tool rejected and removed",
            "tool_id": tool_id
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
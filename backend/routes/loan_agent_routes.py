from flask import Blueprint, jsonify
from services.ai_agents import run_all_agents

loan_agent_bp = Blueprint('loan_agent', __name__)

@loan_agent_bp.route("/loan-agent/run", methods=["GET"])
def run_agent():
    try:
        print("Running loan agent...")

        inserted = run_all_agents() or 0

        return jsonify({
            "message": "Loan agent executed successfully",
            "inserted": inserted
        }), 200

    except Exception as e:
        print("Agent error:", e)

        return jsonify({
            "error": "Agent failed",
            "details": str(e)
        }), 500
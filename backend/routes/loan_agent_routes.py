from flask import Blueprint, jsonify
from services.loan_agent import run_loan_agent

loan_agent_bp = Blueprint('loan_agent', __name__)

@loan_agent_bp.route("/loan-agent/run", methods=["GET"])
def run_agent():
    try:
        inserted = run_loan_agent()
        return jsonify({
            "message": "Loan agent executed successfully",
            "inserted": inserted
        }), 200
    except Exception as e:
        print("Agent error:", e)
        return jsonify({"error": "Agent failed"}), 500
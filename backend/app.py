from flask import Flask, send_from_directory
from flask_cors import CORS
import os

# ================================
#  Import Routes
# ================================
from routes.loans import loans_bp
from routes.ai_routes import ai_bp
from routes.tools import tools_bp
from routes.schemes import schemes_bp
from routes.loan_agent_routes import loan_agent_bp
from routes.marketplace import marketplace_bp
from routes.stores import stores_bp

# Admin Routes
from routes.admin.tool_requests import tool_requests_bp
from routes.admin.tool_approval import tool_approval_bp
from routes.admin.schemes import schemes_bp as admin_schemes_bp
from routes.admin.loans import loans_bp as admin_loans_bp
from routes.admin.loan_approval import loan_approval_bp
from routes.admin.dashboard_stats import admin_stats_bp



def create_app():
    app = Flask(__name__)

    # ================================
    # CONFIG
    # ================================
    CORS(app)
    app.config["JSON_SORT_KEYS"] = False
    app.json.ensure_ascii = False

    # ================================
    # FILE PATH SETUP (STABLE)
    # ================================
    BASE_DIR = os.getcwd()
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

    # Ensure uploads folder exists
    os.makedirs(os.path.join(UPLOAD_FOLDER, "tools"), exist_ok=True)

    # ================================
    # Public APIs
    # ================================
    app.register_blueprint(loans_bp, url_prefix="/api")
    app.register_blueprint(ai_bp, url_prefix="/api")
    app.register_blueprint(tools_bp, url_prefix="/api")
    app.register_blueprint(loan_agent_bp, url_prefix="/api")
    app.register_blueprint(schemes_bp, url_prefix="/api/schemes")
    app.register_blueprint(marketplace_bp, url_prefix="/api")
    app.register_blueprint(stores_bp, url_prefix="/api")

    # ================================
    # Admin APIs
    # ================================
    app.register_blueprint(tool_requests_bp, url_prefix="/api/admin/tool-requests")
    app.register_blueprint(tool_approval_bp, url_prefix="/api/admin/tools")
    app.register_blueprint(admin_schemes_bp, url_prefix="/api/admin/schemes")
    app.register_blueprint(admin_loans_bp, url_prefix="/api/admin/loans")
    app.register_blueprint(loan_approval_bp, url_prefix="/api/admin/loan-approval")
    app.register_blueprint(admin_stats_bp, url_prefix="/api/admin")

    # ================================
    #SERVE UPLOADED IMAGES
    # ================================
    @app.route('/uploads/<path:filename>')
    def serve_uploads(filename):
        try:
            return send_from_directory(UPLOAD_FOLDER, filename)
        except Exception as e:
            return {"error": str(e)}, 404

    # ================================
    #Root Route
    # ================================
    @app.route("/")
    def home():
        return "KrishiSangh Backend Running 🚀"

    return app


# ================================
# Run Server
# ================================
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5001, use_reloader=False)
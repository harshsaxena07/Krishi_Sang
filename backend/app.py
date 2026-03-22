from flask import Flask
from flask_cors import CORS

# Import routes
from routes.loans import loans_bp
from routes.ai_routes import ai_bp
from routes.schemes import schemes_bp
from routes.tools import tools_bp
from routes.loan_agent_routes import loan_agent_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["JSON_SORT_KEYS"] = False

    # Register Blueprints
    app.register_blueprint(loans_bp, url_prefix="/api")
    app.register_blueprint(ai_bp, url_prefix="/api")
    app.register_blueprint(schemes_bp, url_prefix="/api")
    app.register_blueprint(tools_bp, url_prefix="/api")
    app.register_blueprint(loan_agent_bp, url_prefix="/api")

    @app.route("/")
    def home():
        return "KrishiSangh Backend Running 🚀"

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
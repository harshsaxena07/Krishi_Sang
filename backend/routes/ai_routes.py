import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify
import tensorflow as tf
import joblib
import numpy as np
from PIL import Image
import io
import os

ai_bp = Blueprint("ai", __name__)

print("Loading models...")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

disease_model_path = os.path.join(BASE_DIR, "models", "plant_disease_model.keras")
crop_model_path = os.path.join(BASE_DIR, "models", "crop_recommendation_model.joblib")

print("Disease model path:", disease_model_path)
print("Crop model path:", crop_model_path)

disease_model = tf.keras.models.load_model(disease_model_path)
crop_model = joblib.load(crop_model_path)

print("✅ Models loaded successfully")


@ai_bp.route("/ai/disease-detection", methods=["POST"])
def disease_detection():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        image = Image.open(io.BytesIO(file.read())).convert("RGB")
        image = image.resize((128, 128))

        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = disease_model.predict(img_array)
        predicted_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]) * 100)

        return jsonify({
            "predicted_disease": f"Disease Class {predicted_index}",
            "confidence": f"{confidence:.2f}%",
            "description": "This plant may have a disease. Please take proper care."
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Detection failed"}), 500


@ai_bp.route("/ai/crop-recommendation", methods=["POST"])
def crop_recommendation():
    try:
        data = request.get_json()

        N = float(data.get("N"))
        P = float(data.get("P"))
        K = float(data.get("K"))
        ph = float(data.get("ph"))

        temp = 25
        humidity = 60
        rainfall = 0

        features = [N, P, K, temp, humidity, ph, rainfall]

        prediction = crop_model.predict([features])[0]

        return jsonify({
            "recommended_crop": prediction,
            "description": f"{prediction} is suitable for your soil."
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Recommendation failed"}), 500
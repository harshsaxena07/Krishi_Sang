import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify
import tensorflow as tf
import joblib
import numpy as np
from PIL import Image
import io

ai_bp = Blueprint("ai", __name__)

print("Loading models...")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

disease_model_path = os.path.join(BASE_DIR, "models", "plant_disease_model.keras")
crop_model_path = os.path.join(BASE_DIR, "models", "crop_recommendation_model.joblib")

disease_model = tf.keras.models.load_model(disease_model_path)
crop_model = joblib.load(crop_model_path)

print("✅ Models loaded successfully")


# ============================
# CLASS → DISEASE NAME
# ============================
CLASS_LABELS = {
    0: "Apple Scab",
    1: "Apple Black Rot",
    2: "Apple Cedar Rust",
    3: "Healthy Apple",
    4: "Corn Rust",
    5: "Corn Leaf Blight",
    6: "Healthy Corn",
    7: "Grape Black Rot",
    8: "Grape Esca",
    9: "Healthy Grape",
    10: "Potato Early Blight",
    11: "Potato Late Blight",
    12: "Healthy Potato",
    13: "Tomato Early Blight",
    14: "Tomato Late Blight",
    15: "Tomato Leaf Mold",
    16: "Tomato Septoria Leaf Spot",
    17: "Tomato Spider Mites",
    18: "Tomato Target Spot",
    19: "Tomato Yellow Leaf Curl Virus",
    20: "Tomato Mosaic Virus",
    21: "Healthy Tomato"
}


DISEASE_INFO = {

    # ================= APPLE =================
    "Apple___Apple_scab": {
        "description": "Fungal disease causing dark lesions on leaves and fruits.",
        "symptoms": "Olive-green spots on leaves, cracked fruit surface.",
        "treatment": "Apply fungicides like Mancozeb or Captan.",
        "prevention": "Ensure proper air circulation and remove infected leaves."
    },

    "Apple___Black_rot": {
        "description": "Fungal disease affecting fruits and leaves.",
        "symptoms": "Brown spots on leaves, rotting fruit.",
        "treatment": "Use fungicides and remove infected parts.",
        "prevention": "Maintain orchard hygiene and prune regularly."
    },

    "Apple___Cedar_apple_rust": {
        "description": "Fungal disease requiring cedar trees as alternate host.",
        "symptoms": "Yellow-orange spots on leaves.",
        "treatment": "Apply sulfur-based fungicide.",
        "prevention": "Avoid planting near cedar trees."
    },

    "Apple___healthy": {
        "description": "Plant is healthy.",
        "symptoms": "No visible symptoms.",
        "treatment": "No treatment required.",
        "prevention": "Continue regular care."
    },

    # ================= CORN =================
    "Corn_(maize)___Common_rust_": {
        "description": "Fungal disease common in humid environments.",
        "symptoms": "Reddish-brown pustules on leaves.",
        "treatment": "Use fungicides and resistant varieties.",
        "prevention": "Maintain proper plant spacing."
    },

    "Corn_(maize)___Northern_Leaf_Blight": {
        "description": "Leaf disease reducing crop yield.",
        "symptoms": "Long gray-green lesions.",
        "treatment": "Apply fungicides like Azoxystrobin.",
        "prevention": "Use resistant seeds."
    },

    "Corn_(maize)___healthy": {
        "description": "Healthy corn plant.",
        "symptoms": "No disease signs.",
        "treatment": "No treatment needed.",
        "prevention": "Maintain proper nutrients."
    },

    # ================= GRAPE =================
    "Grape___Black_rot": {
        "description": "Fungal disease affecting grape leaves and fruits.",
        "symptoms": "Brown spots, shriveled fruit.",
        "treatment": "Apply fungicides like Myclobutanil.",
        "prevention": "Remove infected plant debris."
    },

    "Grape___Esca_(Black_Measles)": {
        "description": "Chronic fungal disease in grapevines.",
        "symptoms": "Dark streaks on leaves and fruits.",
        "treatment": "Remove infected wood.",
        "prevention": "Avoid pruning during wet weather."
    },

    "Grape___healthy": {
        "description": "Healthy grape plant.",
        "symptoms": "No visible symptoms.",
        "treatment": "No treatment needed.",
        "prevention": "Regular maintenance."
    },

    # ================= POTATO =================
    "Potato___Early_blight": {
        "description": "Common fungal disease in potatoes.",
        "symptoms": "Brown spots with concentric rings.",
        "treatment": "Use fungicides like Chlorothalonil.",
        "prevention": "Crop rotation and avoid wet leaves."
    },

    "Potato___Late_blight": {
        "description": "Highly destructive disease spreading rapidly.",
        "symptoms": "Dark lesions on leaves and stems.",
        "treatment": "Apply fungicides immediately.",
        "prevention": "Use certified seeds and avoid excess moisture."
    },

    "Potato___healthy": {
        "description": "Healthy potato plant.",
        "symptoms": "No disease symptoms.",
        "treatment": "No treatment required.",
        "prevention": "Maintain proper irrigation."
    },

    # ================= TOMATO =================
    "Tomato___Early_blight": {
        "description": "Fungal disease affecting tomato leaves.",
        "symptoms": "Brown spots with rings.",
        "treatment": "Apply fungicides regularly.",
        "prevention": "Remove infected leaves early."
    },

    "Tomato___Late_blight": {
        "description": "Severe disease in wet conditions.",
        "symptoms": "Dark water-soaked patches.",
        "treatment": "Use copper-based fungicides.",
        "prevention": "Avoid overcrowding."
    },

    "Tomato___Leaf_Mold": {
        "description": "Fungal disease in humid conditions.",
        "symptoms": "Yellow spots on upper leaf surface.",
        "treatment": "Improve ventilation and apply fungicide.",
        "prevention": "Reduce humidity."
    },

    "Tomato___Septoria_leaf_spot": {
        "description": "Fungal disease affecting leaves.",
        "symptoms": "Small circular spots.",
        "treatment": "Use fungicides.",
        "prevention": "Avoid overhead watering."
    },

    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "description": "Pest infestation damaging leaves.",
        "symptoms": "Yellow speckles and webbing.",
        "treatment": "Use neem oil or insecticidal soap.",
        "prevention": "Maintain plant health."
    },

    "Tomato___Target_Spot": {
        "description": "Fungal disease affecting leaves.",
        "symptoms": "Circular lesions with rings.",
        "treatment": "Apply fungicides.",
        "prevention": "Crop rotation."
    },

    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "description": "Viral disease spread by whiteflies.",
        "symptoms": "Yellow curled leaves.",
        "treatment": "Remove infected plants.",
        "prevention": "Control whiteflies."
    },

    "Tomato___Tomato_mosaic_virus": {
        "description": "Viral disease affecting plant growth.",
        "symptoms": "Mosaic patterns on leaves.",
        "treatment": "Remove infected plants.",
        "prevention": "Use virus-free seeds."
    },

    "Tomato___healthy": {
        "description": "Healthy tomato plant.",
        "symptoms": "No disease symptoms.",
        "treatment": "No treatment needed.",
        "prevention": "Regular care."
    }
}

DEFAULT_INFO = {
    "description": "Information not available",
    "symptoms": "N/A",
    "treatment": "Consult expert",
    "prevention": "Maintain hygiene"
}

# ============================
# DISEASE DETECTION
# ============================
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
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]) * 100)

        # Convert class → name
        disease_name = CLASS_LABELS.get(predicted_index, "Unknown Disease")

        #Get info
        info = DISEASE_INFO.get(disease_name, DEFAULT_INFO)

        return jsonify({
            "class_id": predicted_index,
            "disease": disease_name,
            "confidence": f"{confidence:.2f}%",
            "description": info["description"],
            "symptoms": info["symptoms"],
            "treatment": info["treatment"],
            "prevention": info["prevention"]
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Detection failed"}), 500


# ============================
# CROP RECOMMENDATION
# ============================
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
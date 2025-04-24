from flask import Flask, jsonify, request
import pickle
import pandas as pd

app = Flask(__name__)

# Load trained model
with open("adaboost_model.pkl", "rb") as f:
    model = pickle.load(f)

# Load scaler if it exists
try:
    with open("scaler.pkl", "rb") as f:
        scaler = pickle.load(f)
    use_scaler = True
except FileNotFoundError:
    use_scaler = False
    scaler = None

# Feature columns
feature_columns = ["HighBP","HighChol","BMI","Stroke","HeartDiseaseorAttack","PhysActivity","HvyAlcoholConsump","GenHlth","MentHlth","PhysHlth","DiffWalk","Age","Income"
]



@app.route("/")
def home():
    return "ML model API is running!!!"


@app.route("/predict", methods=['POST'])
def predict():
    try:
        if not request.is_json:
            return jsonify(({"error": "Request must be JSON"}), 415)

        data = request.get_json()
        print(data)

        # Check for missing features
        missing_features = [feature for feature in feature_columns if feature not in data]
        if missing_features:
            return jsonify({"error": f"Missing required features: {missing_features}"}), 400

        # Convert input data to DataFrame and ensure correct column order
        input_df = pd.DataFrame([data], columns=feature_columns)

        # Scale the input features if a scaler exists
        if use_scaler:
            input_scaled = pd.DataFrame(scaler.transform(input_df), columns=feature_columns)
        else:
            input_scaled = input_df

        # Make prediction
        probability = model.predict_proba(input_scaled) if hasattr(model, "predict_proba") else None

        response = {
            # "probability": probability.tolist() if probability is not None else None
            "probability": probability[0][0] if probability is not None else None
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

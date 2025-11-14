from flask import Flask, request, jsonify
import joblib
import pandas as pd
import json
import numpy as np # Make sure numpy is imported

print("Starting Flask API...")

# --- This function MUST be here ---
def flatten_data(X):
    return X.ravel()
# -----------------------------------

app = Flask(__name__)

# --- Load Model and Labels ---
try:
    pipeline = joblib.load('model.joblib')
    print("Model pipeline loaded successfully.")
except FileNotFoundError:
    print("Error: 'model.joblib' not found.")
    pipeline = None

try:
    with open('label_classes.json', 'r') as f:
        label_classes = json.load(f)
    print("Label classes loaded successfully.")
except FileNotFoundError:
    print("Error: 'label_classes.json' not found.")
    label_classes = []

# --- UPDATED Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if not pipeline:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json
    print(f"Received data for prediction: {data}")
    
    try:
        input_data = {
            'Degree': data.get('degree'),
            'Major': data.get('major'),
            'Specialization': data.get('specialization'),
            'CGPA': float(data.get('cgpa')),
            'Skills': data.get('skills'),
            'Certification': data.get('certifications'),
            'Years of Experience': float(data.get('experience')),
            'Preferred Industry': data.get('industry')
        }
        
        input_df = pd.DataFrame([input_data])

        # --- THIS IS THE BIG CHANGE ---
        
        # 1. Get probabilities for ALL 15 classes
        # This returns something like: [[0.1, 0.05, 0.8, ...]]
        all_probabilities = pipeline.predict_proba(input_df)[0]
        
        # 2. Get the indices of the top 4
        # This gives us the index numbers of the 4 highest scores, in order
        top_4_indices = np.argsort(all_probabilities)[-4:][::-1]

        # 3. Create a list of results to send back
        predictions_list = []
        for i in top_4_indices:
            role = label_classes[i]
            probability_score = all_probabilities[i]
            
            predictions_list.append({
                "role": role,
                "score": probability_score
            })
            
        print(f"Top 4 Predictions: {predictions_list}")

        # 4. Return the full list
        return jsonify({"predictions": predictions_list})
        # --- END OF CHANGE ---

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 400

# --- Run the Flask App ---
if __name__ == '__main__':
    app.run(port=5000, debug=False)
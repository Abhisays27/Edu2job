#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Install Node.js Dependencies
npm install

# 2. Install Python Dependencies
pip3 install -r requirements.txt

# 3. Train the AI Model
# This runs *only* during the build, creating your model.joblib
echo "Training AI Model..."
python3 train_model.py
echo "Model training complete."
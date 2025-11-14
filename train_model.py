import pandas as pd
import numpy as np
import joblib
import json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder, FunctionTransformer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from ml_utils import flatten_data # <-- ADD THIS IMPORT

print("Script started...")


# --- Your Full Dropdown Vocabulary ---
# We use this to teach the model all possible words it might see.
skillOptions = [
    'A/B Testing', 'Accessibility', 'Adobe XD', 'After Effects', 'Agile', 'Analytics', 'AWS', 'Azure', 'Big Data', 'Bootstrap', 'Branding', 
    'Business Intelligence', 'C', 'C++', 'Canva', 'Classroom Management', 'Cloud Deployment', 'Cloud Security', 'Communication', 'Computer Vision', 
    'Content Writing', 'Copywriting', 'CorelDRAW', 'Creativity', 'Critical Thinking', 'Cryptography', 'CSS', 'Curriculum Development', 
    'Cyber Threat Analysis', 'Data Analytics', 'Data Cleaning', 'Data Visualization', 'Deep Learning', 'Design Thinking', 'DevOps Tools', 'Django', 
    'Docker', 'EDA', 'Educational Tools', 'Ethical Hacking', 'Excel', 'Express.js', 'Feature Engineering', 'Figma', 'Finance Modeling', 'Firewalls', 
    'Git', 'Google Analytics', 'Graphic Layout', 'Hadoop', 'HTML', 'Illustrator', 'InDesign', 'Java', 'JavaScript', 'JIRA', 'Keras', 'Kubernetes', 
    'Linux', 'Logo Design', 'Machine Learning', 'Market Analysis', 'Marketing Strategy', 'Matplotlib', 'Mentoring', 'ML Ops', 'Model Deployment', 
    'MongoDB', 'Motion Graphics', 'MySQL', 'Neural Networks', 'Networking', 'NLP', 'Node.js', 'NumPy', 'Pandas', 'Penetration Testing', 'PHP', 
    'Photoshop', 'Power BI', 'Premiere Pro', 'Presentation', 'Problem Solving', 'Product Strategy', 'Prototyping', 'PyTorch', 'Python', 'R', 
    'React', 'Reinforcement Learning', 'Research', 'REST API', 'Risk Assessment', 'Roadmapping', 'Scikit-learn', 'SEO', 'SIEM Tools', 
    'Social Media Marketing', 'Spark', 'Spring Boot', 'SQL', 'Statistics', 'Subject Expertise', 'Tableau', 'Teaching', 'TensorFlow', 'Terraform', 
    'Typography', 'UI Design', 'UI Flow', 'Usability Testing', 'User Journey', 'User Research', 'UX', 'UX Research', 'UX Strategy', 'Virtualization', 
    'Visual Design', 'Vue.js', 'Wireframing', 'WordPress'
]

certOptions = [
    'HackerRank SQL', 'Google Cloud Basics', 'NPTEL Python', 'Coursera Web Dev', 'Udemy Java', 'Infosys Springboard', 'Oracle Cloud Infrastructure', 
    'AWS Certified Solutions Architect', 'Google Data Analytics', 'Google Cloud Engineer', 'AWS Cloud Practitioner', 'Microsoft Azure Fundamentals', 
    'Coursera Data Analyst Certificate', 'IBM Data Science', 'LinkedIn Learning Cloud Course', 'IBM Design Thinking', 'UI/UX Bootcamp by Udemy', 
    'Graphic Design Masterclass', 'Motion Design Certification', 'Google UX Design', 'Coursera Graphic Design', 'Adobe Certified Expert', 
    'Nielsen Norman UX Certificate', 'Coursera UX Fundamentals', 'Canva Pro Certification', 'CFA Level 1', 'None', 'Financial Analyst Certification', 
    'FRM', 'CFA Level 2', 'Scrum Master', 'Google PM Certificate', 'Product Management Certificate', 'Agile Certification', 'Copywriting Certification', 
    'HubSpot Content Marketing', 'SEO Certification', 'Social Media Strategy', 'Google Digital Marketing', 'NET Qualification', 'Coursera Teaching Skills', 
    'Teaching Certification', 'Educational Technology', 'Research Methodology', 'Academic Writing Certification', 'Excel Certification', 
    'Power BI Certification', 'SQL Certification', 'Tableau Certification', 'Business Analytics Certification', 'CISSP', 'CEH (Certified Ethical Hacker)', 
    'CCNA Security', 'Cybersecurity Fundamentals', 'ISO 27001 Certification', 'CompTIA Security+', 'Udemy SEO Expert', 'Google Ads', 
    'Data Analytics Certificate', 'HubSpot Marketing', 'Meta Blueprint', 'Coursera Marketing', 'Excel Advanced', 'AWS ML Specialty', 
    'Deep Learning Specialization', 'TensorFlow Developer', 'Azure AI Engineer', 'Coursera ML by Andrew Ng'
]
# --- END OF VOCABULARY ---


# --- 1. Load Real Data ---
try:
    df = pd.read_excel("JobRole.xlsx") # Reads your Excel file
    print(f"Loaded {len(df)} real rows from JobRole.xlsx")
except FileNotFoundError:
    print("Error: The file 'JobRole.xlsx' was not found.")
    exit()

# --- 2. Define Features (X) and Target (y) ---
# We are ONLY using the real data from your Excel file.
TARGET_COLUMN = 'Job Role'
FEATURES = [
    'Degree', 'Major', 'Specialization', 'CGPA', 'Skills', 
    'Certification', 'Years of Experience', 'Preferred Industry'
]
df.dropna(subset=[TARGET_COLUMN], inplace=True)
X = df[FEATURES]
y = df[TARGET_COLUMN]

# --- 3. Preprocess Target Variable ---
le = LabelEncoder()
y_encoded = le.fit_transform(y)
label_classes = le.classes_.tolist()
with open('label_classes.json', 'w') as f:
    json.dump(label_classes, f)
print(f"Saved {len(label_classes)} label classes to 'label_classes.json'")

# --- 4. Define Preprocessing Pipeline ---
numeric_features = ['CGPA', 'Years of Experience']
categorical_features = ['Degree', 'Major', 'Specialization', 'Preferred Industry']

numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='None')),
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

# --- THIS IS THE FIX ---
# We pass the full vocabulary list to the CountVectorizer.
# It now knows about "Adobe XD" etc., even if it's not in the training data.
skills_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='')),
    ('flatten', FunctionTransformer(flatten_data)),
    ('vect', CountVectorizer(ngram_range=(1, 2), vocabulary=skillOptions, lowercase=False))
])

cert_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='')),
    ('flatten', FunctionTransformer(flatten_data)),
    ('vect', CountVectorizer(vocabulary=certOptions, lowercase=False))
])
# --- END OF FIX ---

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features),
        ('skills', skills_transformer, ['Skills']),
        ('certs', cert_transformer, ['Certification'])
    ],
    remainder='drop' 
)
print("Preprocessing pipeline defined.")

# --- 5. Split Data ---
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded)
print(f"Data split: {len(X_train)} train samples, {len(X_test)} test samples.")

# --- 6. Train the Model ---
print("\nTraining 'Smart' Random Forest model...")
final_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])
final_pipeline.fit(X_train, y_train)

# --- 7. Check Model Accuracy ---
print("Evaluating model...")
y_pred = final_pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy on Test Data: {accuracy * 100:.2f}%")
print("\n--- Classification Report ---")
print(classification_report(y_test, y_pred, target_names=le.classes_, zero_division=0))
print("------------------------------")

# --- 8. Save the Final Model ---
print("\nRetraining model on ALL data for deployment...")
final_pipeline.fit(X, y_encoded) 
print("Final model trained on all data.")

joblib.dump(final_pipeline, 'model.joblib')
print("✅ Final 'Smart' pipeline saved to 'model.joblib'")
print("\nScript finished successfully.")
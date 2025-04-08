from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import os
import tempfile
import requests
import json
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

# Load the trained model
MODEL_PATH = os.path.join('Trained-Model', 'model', 'model.h5')
model = tf.keras.models.load_model(MODEL_PATH)

# Deepseek R1 API Configuration
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# Disease information cache to minimize API calls
disease_info_cache = {}

def preprocess_image(img_path):
    """Process the image into the right format for the model"""
    img = image.load_img(img_path, target_size=(150, 150))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Normalize pixel values between 0 and 1
    return img_array

@app.route('/')
def index():
    """Serve the frontend"""
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('frontend', path)

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to predict dog skin diseases"""
    try:
        # Check if the post request has the file part
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        
        # If user does not select file, browser might submit an empty file
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        # Save the uploaded file to a temporary file
        temp = tempfile.NamedTemporaryFile(delete=False)
        file.save(temp.name)
        
        # Preprocess the image and make prediction
        processed_image = preprocess_image(temp.name)
        predictions = model.predict(processed_image)
        predicted_class = np.argmax(predictions, axis=1)[0]
        
        # Get confidence score (probability of the predicted class)
        confidence_score = float(predictions[0][predicted_class]) * 100
        
        # Map the index to the disease name
        disease_map = {
            0: "Bacterial Dermatitis",
            1: "Fungal Infection",
            2: "Healthy"
        }
        
        result = disease_map.get(predicted_class, "Unknown")
        
        # Clean up the temporary file
        temp.close()
        os.unlink(temp.name)
        
        return jsonify({
            'prediction': result,
            'confidence': round(confidence_score, 2)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/disease-info', methods=['GET'])
def get_disease_info():
    """Endpoint to get information about a specific disease"""
    disease = request.args.get('disease', '')
    
    if not disease:
        return jsonify({'error': 'Disease parameter is required'}), 400
    
    # Check cache first
    if disease in disease_info_cache:
        return jsonify(disease_info_cache[disease])
    
    try:
        # Get information from Deepseek API or fallback to local information
        disease_info = get_disease_info_from_api(disease)
        
        # Cache the response
        disease_info_cache[disease] = disease_info
        
        return jsonify(disease_info)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_disease_info_from_api(disease):
    """Get disease information from Deepseek R1 API"""
    # If API key is not set or empty, return fallback information
    if not DEEPSEEK_API_KEY:
        print("No Deepseek API key found. Using fallback information.")
        return get_fallback_disease_info(disease)
    
    prompt = f"""
    Provide information about the dog skin condition: {disease}. 
    Return the response in JSON format with the following structure:
    {{
        "description": "A detailed paragraph describing the condition, its causes, and symptoms",
        "remedies": ["Remedy 1", "Remedy 2", "Remedy 3", "Remedy 4"]
    }}
    
    Keep the description concise but informative (100-150 words). Include 4-5 practical remedies or actions pet owners can take.
    """
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 500
    }
    
    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, data=json.dumps(payload))
        
        if response.status_code == 200:
            response_json = response.json()
            content = response_json["choices"][0]["message"]["content"]
            
            # Parse the JSON content
            disease_info = json.loads(content)
            return disease_info
        else:
            print(f"Deepseek API returned status code {response.status_code}: {response.text}")
            return get_fallback_disease_info(disease)
    
    except Exception as e:
        # If any error occurs, return fallback information
        print(f"Error fetching from Deepseek API: {str(e)}")
        return get_fallback_disease_info(disease)

def get_fallback_disease_info(disease):
    """Fallback information when API is not available"""
    if "Bacterial" in disease:
        return {
            "description": "Bacterial dermatitis is a skin infection caused by bacteria. It often presents as red, inflamed areas that may have discharge or crusting. In dogs, it's commonly caused by Staphylococcus bacteria, which can enter through breaks in the skin due to scratching, allergies, or other irritations. Symptoms include redness, itching, hair loss, pustules, and in some cases, an unpleasant odor.",
            "remedies": [
                "Consult a veterinarian for proper diagnosis and prescription antibiotics",
                "Keep the affected area clean and dry",
                "Use veterinarian-recommended medicated shampoos",
                "Prevent your dog from licking or scratching the affected area",
                "Address any underlying allergies or skin conditions"
            ]
        }
    elif "Fungal" in disease:
        return {
            "description": "Fungal skin infections in dogs are commonly caused by dermatophytes (ringworm) or yeast (Malassezia). They typically appear as circular lesions, scaly patches, or itchy, inflamed skin. Ringworm is contagious to humans and other pets, while yeast infections often develop in moist areas like skin folds, ears, and paws. Both can cause intense itching, hair loss, and discomfort for your pet.",
            "remedies": [
                "Consult a veterinarian for proper diagnosis and antifungal medication",
                "Isolate your pet to prevent spread to other animals or humans if ringworm is suspected",
                "Use medicated shampoos specifically formulated for fungal infections",
                "Keep your dog's living environment clean and disinfected",
                "Make sure to complete the full course of prescribed treatment even if symptoms improve"
            ]
        }
    elif "Healthy" in disease:
        return {
            "description": "Your dog's skin appears healthy with no visible signs of disease. Healthy dog skin is typically smooth, with good elasticity and no excessive flaking, redness, or irritation. The coat should be shiny and without bald patches. Maintaining skin health is important as the skin acts as a barrier against infections and environmental hazards.",
            "remedies": [
                "Continue regular grooming and skin checks",
                "Maintain a balanced diet rich in omega fatty acids for skin health",
                "Regular bathing with dog-appropriate shampoo (not human shampoo)",
                "Schedule routine veterinary check-ups",
                "Provide flea and tick prevention as recommended by your vet"
            ]
        }
    else:
        return {
            "description": "Information about this specific condition is not available. Please consult a veterinarian for proper diagnosis and treatment options for your dog's skin condition.",
            "remedies": [
                "Consult a veterinarian for proper diagnosis",
                "Take clear photos of the affected areas to show your vet",
                "Note any changes in your dog's behavior or comfort level",
                "Prevent your dog from scratching or licking the affected area",
                "Follow your veterinarian's treatment recommendations"
            ]
        }

if __name__ == '__main__':
    app.run(debug=True) 
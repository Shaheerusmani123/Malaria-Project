# app.py
# Flask backend for PyTorch malaria detection model

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from PIL import Image
import io
import torchvision.transforms as transforms
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# IMPORTANT: Replace this with YOUR actual model architecture
class MalariaModel(nn.Module):
    def __init__(self):
        super(MalariaModel, self).__init__()
        # Example CNN architecture - REPLACE with your actual architecture
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 8 * 8, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

# Load model
MODEL_PATH = 'public/malaria_model.pth'
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

print("Loading model...")
try:
    model = MalariaModel().to(device)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.eval()
    print("✓ Model loaded successfully!")
except Exception as e:
    print(f"✗ Error loading model: {str(e)}")
    model = None

# Image preprocessing - adjust size to match your model's input
transform = transforms.Compose([
    transforms.Resize((64, 64)),  # Change to 128x128 or 224x224 if needed
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Malaria Detector API',
        'status': 'running',
        'endpoints': {
            'predict': '/api/predict (POST)',
            'health': '/health (GET)'
        }
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read and preprocess image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Transform image
        input_tensor = transform(image).unsqueeze(0).to(device)
        
        # Make prediction
        with torch.no_grad():
            output = model(input_tensor)
            probability = output.item()
        
        # Interpret results (adjust threshold if needed)
        is_infected = probability > 0.5
        confidence = probability if is_infected else 1 - probability
        
        result = {
            'success': True,
            'prediction': 'Parasitized' if is_infected else 'Uninfected',
            'confidence': f"{confidence * 100:.2f}",
            'probability': f"{probability:.4f}"
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'device': str(device)
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)

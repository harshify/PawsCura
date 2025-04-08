const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up Express app
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));
app.use(express.json());

// Mock model prediction since we can't use TensorFlow directly in this simple Express app
// In a real-world scenario, you'd either:
// 1. Create a Python microservice for ML predictions
// 2. Use TensorFlow.js to run the model in Node.js
// 3. Use a third-party ML API service

// Image prediction endpoint
app.post('/predict', upload.single('image'), (req, res) => {
  // Check if we received a file
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    // For demo purposes, we'll return a random prediction
    // In a real app, you would use the model to analyze the image
    const diseases = ["Bacterial Dermatitis", "Fungal Infection", "Healthy"];
    const randomIndex = Math.floor(Math.random() * diseases.length);
    const prediction = diseases[randomIndex];
    
    // Generate a random confidence score between 80% and 99%
    const confidence = Math.floor(Math.random() * 20) + 80;
    
    // Simulate processing delay
    setTimeout(() => {
      res.json({
        prediction: prediction,
        confidence: confidence
      });
    }, 1500);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
});

// Disease information endpoint
app.get('/disease-info', (req, res) => {
  const disease = req.query.disease || '';
  
  // Serve disease information based on the prediction
  let response = {
    description: 'No specific information available for this condition.',
    remedies: []
  };
  
  if (disease.includes('Bacterial')) {
    response = {
      description: 'Bacterial dermatitis is a skin infection caused by bacteria. It often presents as red, inflamed areas that may have discharge or crusting. In dogs, it\'s commonly caused by Staphylococcus bacteria, which can enter through breaks in the skin due to scratching, allergies, or other irritations. Symptoms include redness, itching, hair loss, pustules, and in some cases, an unpleasant odor.',
      remedies: [
        'Consult a veterinarian for proper diagnosis and prescription antibiotics',
        'Keep the affected area clean and dry',
        'Use veterinarian-recommended medicated shampoos',
        'Prevent your dog from licking or scratching the affected area',
        'Address any underlying allergies or skin conditions'
      ]
    };
  } else if (disease.includes('Fungal')) {
    response = {
      description: 'Fungal skin infections in dogs are commonly caused by dermatophytes (ringworm) or yeast (Malassezia). They typically appear as circular lesions, scaly patches, or itchy, inflamed skin. Ringworm is contagious to humans and other pets, while yeast infections often develop in moist areas like skin folds, ears, and paws. Both can cause intense itching, hair loss, and discomfort for your pet.',
      remedies: [
        'Consult a veterinarian for proper diagnosis and antifungal medication',
        'Isolate your pet to prevent spread to other animals or humans if ringworm is suspected',
        'Use medicated shampoos specifically formulated for fungal infections',
        'Keep your dog\'s living environment clean and disinfected',
        'Make sure to complete the full course of prescribed treatment even if symptoms improve'
      ]
    };
  } else if (disease.includes('Healthy')) {
    response = {
      description: 'Your dog\'s skin appears healthy with no visible signs of disease. Healthy dog skin is typically smooth, with good elasticity and no excessive flaking, redness, or irritation. The coat should be shiny and without bald patches. Maintaining skin health is important as the skin acts as a barrier against infections and environmental hazards.',
      remedies: [
        'Continue regular grooming and skin checks',
        'Maintain a balanced diet rich in omega fatty acids for skin health',
        'Regular bathing with dog-appropriate shampoo (not human shampoo)',
        'Schedule routine veterinary check-ups',
        'Provide flea and tick prevention as recommended by your vet'
      ]
    };
  }
  
  res.json(response);
});

// Serve static files (for development only, Vercel will handle this in production)
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

// Add API prefix routes to maintain compatibility with Vercel config
app.post('/api/predict', upload.single('image'), (req, res) => {
  // Instead of using app.handle which is causing issues, implement the handler directly
  // Check if we received a file
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    // For demo purposes, we'll return a random prediction
    // In a real app, you would use the model to analyze the image
    const diseases = ["Bacterial Dermatitis", "Fungal Infection", "Healthy"];
    const randomIndex = Math.floor(Math.random() * diseases.length);
    const prediction = diseases[randomIndex];
    
    // Generate a random confidence score between 80% and 99%
    const confidence = Math.floor(Math.random() * 20) + 80;
    
    // Simulate processing delay
    setTimeout(() => {
      res.json({
        prediction: prediction,
        confidence: confidence
      });
    }, 1500);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
});

app.get('/api/disease-info', (req, res) => {
  // Instead of using app.handle, implement the handler directly
  const disease = req.query.disease || '';
  
  // Serve disease information based on the prediction
  let response = {
    description: 'No specific information available for this condition.',
    remedies: []
  };
  
  if (disease.includes('Bacterial')) {
    response = {
      description: 'Bacterial dermatitis is a skin infection caused by bacteria. It often presents as red, inflamed areas that may have discharge or crusting. In dogs, it\'s commonly caused by Staphylococcus bacteria, which can enter through breaks in the skin due to scratching, allergies, or other irritations. Symptoms include redness, itching, hair loss, pustules, and in some cases, an unpleasant odor.',
      remedies: [
        'Consult a veterinarian for proper diagnosis and prescription antibiotics',
        'Keep the affected area clean and dry',
        'Use veterinarian-recommended medicated shampoos',
        'Prevent your dog from licking or scratching the affected area',
        'Address any underlying allergies or skin conditions'
      ]
    };
  } else if (disease.includes('Fungal')) {
    response = {
      description: 'Fungal skin infections in dogs are commonly caused by dermatophytes (ringworm) or yeast (Malassezia). They typically appear as circular lesions, scaly patches, or itchy, inflamed skin. Ringworm is contagious to humans and other pets, while yeast infections often develop in moist areas like skin folds, ears, and paws. Both can cause intense itching, hair loss, and discomfort for your pet.',
      remedies: [
        'Consult a veterinarian for proper diagnosis and antifungal medication',
        'Isolate your pet to prevent spread to other animals or humans if ringworm is suspected',
        'Use medicated shampoos specifically formulated for fungal infections',
        'Keep your dog\'s living environment clean and disinfected',
        'Make sure to complete the full course of prescribed treatment even if symptoms improve'
      ]
    };
  } else if (disease.includes('Healthy')) {
    response = {
      description: 'Your dog\'s skin appears healthy with no visible signs of disease. Healthy dog skin is typically smooth, with good elasticity and no excessive flaking, redness, or irritation. The coat should be shiny and without bald patches. Maintaining skin health is important as the skin acts as a barrier against infections and environmental hazards.',
      remedies: [
        'Continue regular grooming and skin checks',
        'Maintain a balanced diet rich in omega fatty acids for skin health',
        'Regular bathing with dog-appropriate shampoo (not human shampoo)',
        'Schedule routine veterinary check-ups',
        'Provide flea and tick prevention as recommended by your vet'
      ]
    };
  }
  
  res.json(response);
});

// Start server (for local development)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app for Vercel serverless function
module.exports = app; 
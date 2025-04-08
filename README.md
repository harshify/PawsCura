# PawsCura: Dog Skin Disease Detection

An AI-powered web application that detects common skin diseases in dogs from uploaded images.

## Features

- Upload dog skin images for instant disease detection
- Detection of bacterial and fungal skin infections
- User-friendly interface with responsive design
- Real-time predictions with visual indicators
- Detailed results page with disease information and treatment recommendations
- AI-generated descriptions and remedies for each condition
- Confidence level indicator for predictions

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript with Tailwind CSS
- **Backend**: Flask (Python)
- **AI Model**: TensorFlow/Keras deep learning model

## Setup and Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation Steps

1. Clone the repository or download the source code

2. Install the required Python packages:

   ```
   pip install -r requirements.txt
   ```

3. Run the application:

   ```
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

1. Navigate to the "Check your furs health" section
2. Click on "Choose Image" to upload a photo of your dog's skin
3. Click "Check for Disease" to get the prediction
4. View the results displayed below the button

## Model Information

The model is trained to identify three categories:

- Bacterial Dermatitis
- Fungal Infection
- Healthy

## Project Structure

```
PawsCura/
├── app.py                # Flask application
├── requirements.txt      # Python dependencies
├── Trained-Model/        # Contains the trained model files
│   └── model/
│       └── model.h5      # The main model file
└── frontend/            # Frontend files
    ├── index.html        # Main HTML file
    ├── styles.css        # CSS styles
    ├── script.js         # JavaScript functionality
    └── images/           # Image assets
```

## License

This project is licensed under the MIT License.

## Deepseek R1 API Integration

The application can use the Deepseek R1 API to provide detailed information about detected skin conditions. To use this feature:

1. Create a `.env` file at the root of the project (or copy `.env.example` to `.env`)
2. Add your Deepseek API key to the `.env` file:
   ```
   DEEPSEEK_API_KEY="your_api_key_here"
   ```
3. Restart the application

**Security Note**: The `.env` file is included in `.gitignore` to prevent accidental exposure of your API key. Never commit your actual API keys to version control.

If no API key is provided, the application will fall back to using pre-defined descriptions and remedies.

---

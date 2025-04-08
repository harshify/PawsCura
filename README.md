# PawsCura

PawsCura is an AI-powered web application for detecting skin diseases in dogs using machine learning.

## Project Overview

The application allows users to upload images of their dog's skin and get instant predictions about potential skin conditions. It uses a trained machine learning model to analyze the images and provide detailed information about the detected conditions.

## Deployment Guide

This guide will help you deploy PawsCura to Vercel.

### Step 1: Set Up GitHub Repository

1. **Create a GitHub Repository**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   ```

2. **Create a new repository on GitHub**, then push your local repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/pawscura.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign up/in to Vercel**

   - Go to [vercel.com](https://vercel.com) and sign up or log in with your GitHub account

2. **Create a New Project**

   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Vercel will automatically detect that it's a Node.js project

3. **Configuration**

   - Vercel should automatically detect the correct build settings based on the vercel.json file
   - No additional environment variables are needed for basic functionality

4. **Deploy**

   - Click "Deploy"
   - Vercel will build and deploy your application

5. **Access Your Live Site**
   - Once deployment is complete, you can access your site at the URL provided by Vercel

## Local Development

To run the project locally:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. **Access the application**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/frontend` - Contains all frontend HTML, CSS, and JavaScript files
- `/api` - Contains the Express.js backend
- `vercel.json` - Configuration for Vercel deployment
- `package.json` - Node.js dependencies and scripts

## Features

- Upload dog skin images for analysis
- AI-powered disease detection
- Detailed information about detected conditions
- Recommended actions for treatment
- Mobile-responsive design with dark mode

## Technical Details

- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Backend**: Express.js
- **Deployment**: Vercel
- **Image Processing**: Node.js

## Notes

- The current version uses a mock prediction service that returns random results
- In a production environment, you would integrate with a real machine learning model

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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

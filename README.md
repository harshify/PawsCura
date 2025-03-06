# Dog Skin Disease Prediction using Transfer Learning

This repository contains an **AI-powered system** to detect and classify **skin diseases in dogs** using **Convolutional Neural Networks (CNN)** with **Transfer Learning leveraging InceptionV3**.

The project was developed as part of the **PawsCura project** and is designed to assist **pet owners, veterinarians, and researchers** in identifying common skin conditions in dogs based on images.

---

## 📑 Project Overview

The **Dog Skin Disease Prediction** project leverages **deep learning** to classify dog skin conditions into the following categories:

- **Healthy Skin**
- **Fungal Infection**
- **Bacterial Infection**

The project employs **Transfer Learning** using the **Inception V3 model**, pre-trained on the ImageNet dataset. Transfer learning allows us to benefit from the powerful feature extraction capabilities of Inception V3 while adapting the model to our specific dataset of dog skin diseases.

Since the dataset is relatively small, transfer learning helps improve generalization and prevents overfitting, ensuring the model performs well even on unseen data.

---

## 🛠️ Project Structure

```
src/
    Train/                  # Training images (Healthy, Fungal, Bacterial subfolders)
    Validation/             # Validation images (Healthy, Fungal, Bacterial subfolders)
    Test/                   # Test images (for final predictions)
    TransferLearning/       # Contains InceptionV3 model (pre-trained on ImageNet)

model/
    model.h5                 # Saved trained model in H5 format
    optimized_model.tflite   # Optimized model for mobile/embedded devices
    tfjs/                    # TensorFlow.js version for web applications

notebooks/
    model_train.ipynb        # Jupyter Notebook for training & exporting

main.py                      # Script to select images and predict disease via file dialog
```

---

## 🧰 Technologies Used

- **Python 3.9**
- **TensorFlow 2.12.0**
- **Keras**
- **NumPy**
- **Matplotlib**
- **Pillow (PIL)**
- **OpenCV (cv2)**
- **Tkinter (for GUI-based file selection)**
- **GitHub LFS** (for handling large files such as images and models)

---

## ⚙️ Setup and Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/harshify/DogSkinDiseasePrediction.git

cd DogSkinDiseasePrediction
```

### 2️⃣ Create Python Environment

```bash
conda create -n dog_skin_env python=3.9

conda activate dog_skin_env
```

### 3️⃣ Install Dependencies

```bash
pip install tensorflow==2.12.0 pillow numpy matplotlib opencv-python tk
```

### 4️⃣ Optional: Setup Git LFS (for large files)

```bash
git lfs install
```

---

## 📊 Model Description

### Architecture

- Base Model: **Inception V3** (pre-trained on ImageNet)
- Custom Layers: Added fully connected layers after Inception V3
- Output Layer: **Softmax with 3 classes** (Healthy, Fungal, Bacterial)

### Data Augmentation

To enhance generalization, the training images undergo augmentation:

- Rotation
- Width and height shifting
- Shear transformation
- Zooming
- Horizontal flipping

### Loss and Optimizer

- **Loss:** `categorical_crossentropy`
- **Optimizer:** Adam

---

## 🔬 Training Process

- **Dataset:** 75 training images as of now (Will be adding more to train it further), 30 validation images (3 classes)
- **Epochs:** 50-100 (with early stopping at 90% validation accuracy)
- **Batch Size:** 5
- **Steps per Epoch:** 15
- **Validation Steps:** 6

The training process includes **callbacks** to monitor performance and stop training once satisfactory accuracy is achieved. The model is continuously evaluated on the validation set to ensure **generalization**.

### Training Stopping Criteria

The training process is **stopped automatically once 90% validation accuracy is reached**, using **early stopping callbacks** to avoid overfitting.

---

## 🧪 Model Evaluation

The model is evaluated using:

- **Accuracy**
- **Precision, Recall, F1-Score** (in further analysis)
- **Confusion Matrix** (optional)

The trained model achieves **high accuracy and robustness** despite the limited dataset size, thanks to **transfer learning** and aggressive augmentation strategies.

---

## 🚀 Exported Formats

Once training is completed, the model is exported into the following formats:

- **H5 format** (for use with Keras and TensorFlow)
- **TFLite format** (for mobile and embedded deployment)
- **TensorFlow.js format** (for web-based inference)

These formats ensure maximum flexibility in deploying the model across different platforms.

---

## 📥 Usage

### 1️⃣ Train the Model

The training process can be run using the provided notebook:

```bash
jupyter notebook notebooks/model_train.ipynb
```

### 2️⃣ Predict Skin Disease (GUI-based Prediction)

- Run the prediction script using:
  ```bash
  python main.py
  ```
- A **file picker window (Tkinter)** opens to let you select an image.
- The system predicts and displays whether the skin is **Healthy, Fungal, or Bacterial**.

---

## 🐾 Sample Output

```
Predicted Class: Fungal Infection
```

---

## 📉 Challenges Faced

- **Small Dataset:** Only 75 training images, requiring data augmentation to enhance robustness.
- **Class Imbalance:** Carefully monitored during training to avoid bias toward the majority class.
- **Image Variability:** Handled through augmentation techniques to enhance generalization.
- **Environment Compatibility:** TensorFlow 2.12.0 requires Python 3.10, which was tricky to configure initially.
- **Transition to GUI:** Moved from CLI-based file selection to **drag-and-drop GUI** for improved user experience.

---

## 🌐 Future Scope

- Expand dataset to improve generalization across breeds and environments.
- Enhance UI to support **drag-and-drop image upload**.
- Develop a **Flask/Streamlit web interface** for wider accessibility.
- Integrate real-time **tele-consultation with veterinarians**.
- Package the system into a **mobile app** (Android/iOS).
- Implement **continuous training** to allow for dataset expansion over time.

---

## 📜 License

This project is licensed under the **MIT License**, allowing commercial and non-commercial use, modification, and distribution.

---

from tensorflow.keras.preprocessing import image
import tensorflow as tf
import numpy as np
import tkinter as tk
from tkinter import filedialog
import os

def preprocess_image(file_path):
    img = image.load_img(file_path, target_size=(150, 150))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Normalize pixel values between 0 and 1
    return img_array

def predict_image(file_path):
    prepimg = preprocess_image(file_path)
    predictions = model.predict(prepimg)
    predicted_class = np.argmax(predictions, axis=1)
    index = predicted_class[0]
    result = "Healthy" if index == 2 else "Fungal" if index == 1 else "Bacterial"
    print(f"Predicted class: {result}")

# Load model
model = tf.keras.models.load_model('./model/model.h5')

# Create a file picker window
root = tk.Tk()
root.withdraw()  # Hide the root window

file_path = filedialog.askopenfilename(
    title="Select an Image for Prediction",
    filetypes=[("Image files", "*.jpg *.jpeg *.png *.bmp *.tiff")]
)

if file_path:
    predict_image(file_path)
else:
    print("No file selected.")

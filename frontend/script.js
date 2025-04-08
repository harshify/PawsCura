// DOM Elements
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const preview = document.getElementById('preview');
const uploadForm = document.getElementById('uploadForm');
const checkButton = document.getElementById('checkButton');
const loader = document.getElementById('loader');
const result = document.getElementById('result');
const predictionText = document.getElementById('predictionText');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const chooseAnotherButton = document.getElementById('chooseAnotherButton');

// Event Listeners
imageInput.addEventListener('change', handleImageSelect);
checkButton.addEventListener('click', checkDisease);
hamburgerMenu.addEventListener('click', toggleMobileMenu);
chooseAnotherButton.addEventListener('click', resetImageUpload);

// Mobile Menu Functionality
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

// Choose Another Image functionality
function resetImageUpload() {
    // Hide the preview
    imagePreview.classList.add('hidden');
    // Show the upload form
    uploadForm.classList.remove('hidden');
    // Clear the file input
    imageInput.value = '';
}

// Image Preview Functionality
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            uploadForm.classList.add('hidden'); // Hide the upload form when image is selected
        };
        reader.readAsDataURL(file);
    }
}

// Toast Notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Disease Check Functionality
async function checkDisease() {
    const file = imageInput.files[0];
    
    if (!file) {
        showToast('Please select an image first');
        return;
    }

    // Show loader
    loader.classList.remove('hidden');
    checkButton.disabled = true;
    checkButton.classList.add('opacity-50');

    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:3000/api/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Network response was not ok');
        }

        const data = await response.json();
        
        // Get image data URL for passing to results page
        const imageDataUrl = await getImageDataUrl(file);
        
        // Store image in localStorage instead of passing in URL
        localStorage.setItem('pawscura_image', imageDataUrl);
        
        // Redirect to results page with only prediction and confidence parameters
        window.location.href = `results.html?prediction=${encodeURIComponent(data.prediction)}&confidence=${encodeURIComponent(data.confidence || 90)}`;
        
    } catch (error) {
        console.error('Error:', error);
        showToast(error.message || 'Error processing image. Please try again.');
        loader.classList.add('hidden');
        checkButton.disabled = false;
        checkButton.classList.remove('opacity-50');
    }
}

// Convert file to data URL for passing to results page
function getImageDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target.result;
            
            // Check if the data URL is too large for localStorage (typically 5-10MB limit)
            if (dataUrl.length > 5000000) { // Limit to ~5MB
                // If too large, resize the image
                const resizedDataUrl = await resizeImage(dataUrl, 800); // Resize to max 800px width
                resolve(resizedDataUrl);
            } else {
                resolve(dataUrl);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Function to resize an image to reduce its size
function resizeImage(dataUrl, maxWidth) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions while maintaining aspect ratio
            if (width > maxWidth) {
                height = Math.floor(height * (maxWidth / width));
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get the resized image as data URL (adjust quality if needed)
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(resizedDataUrl);
        };
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !hamburgerMenu.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu after clicking a link
            mobileMenu.classList.add('hidden');
        }
    });
}); 
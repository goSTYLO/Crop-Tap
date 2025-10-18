// Image Handling Utilities
import { Utils } from '../core/utils.js';

export class ImageHandler {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    }

    // Setup image preview for file input
    setupImagePreview(fileInput, previewElement, options = {}) {
        if (!fileInput || !previewElement) return;

        const {
            maxSize = this.maxFileSize,
            allowedTypes = this.allowedTypes,
            onError = null,
            onSuccess = null
        } = options;

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) {
                this.clearPreview(previewElement);
                return;
            }

            try {
                // Validate file
                const validation = this.validateFile(file, maxSize, allowedTypes);
                if (!validation.valid) {
                    if (onError) onError(validation.message);
                    else console.error(validation.message);
                    return;
                }

                // Read and display image
                const dataURL = await Utils.readFileAsDataURL(file);
                this.showPreview(previewElement, dataURL);
                
                if (onSuccess) onSuccess(dataURL, file);
            } catch (error) {
                const message = 'Failed to load image';
                if (onError) onError(message);
                else console.error(message, error);
            }
        });
    }

    // Validate uploaded file
    validateFile(file, maxSize = this.maxFileSize, allowedTypes = this.allowedTypes) {
        if (!file) {
            return { valid: false, message: 'No file selected' };
        }

        if (!allowedTypes.includes(file.type)) {
            return { 
                valid: false, 
                message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
            };
        }

        if (file.size > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
            return { 
                valid: false, 
                message: `File too large. Maximum size: ${maxSizeMB}MB` 
            };
        }

        return { valid: true };
    }

    // Show image preview
    showPreview(previewElement, dataURL) {
        if (previewElement.tagName === 'IMG') {
            previewElement.src = dataURL;
            previewElement.style.display = 'block';
        } else {
            previewElement.style.backgroundImage = `url(${dataURL})`;
            previewElement.style.backgroundSize = 'cover';
            previewElement.style.backgroundPosition = 'center';
        }
    }

    // Clear image preview
    clearPreview(previewElement) {
        if (previewElement.tagName === 'IMG') {
            previewElement.src = '';
            previewElement.style.display = 'none';
        } else {
            previewElement.style.backgroundImage = '';
        }
    }

    // Resize image to specific dimensions
    async resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                const dataURL = canvas.toDataURL('image/jpeg', quality);
                
                resolve(dataURL);
            };

            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    // Get image dimensions
    getImageDimensions(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    // Convert file to base64 data URL
    async fileToDataURL(file, options = {}) {
        const { resize = false, maxWidth = 800, maxHeight = 600, quality = 0.8 } = options;
        
        if (resize) {
            return await this.resizeImage(file, maxWidth, maxHeight, quality);
        } else {
            return await Utils.readFileAsDataURL(file);
        }
    }

    // Create image placeholder
    createPlaceholder(width = 150, height = 150, text = '🌾', backgroundColor = '#f3f4f6') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Fill background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        
        // Add text/emoji
        ctx.font = `${Math.min(width, height) * 0.3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(text, width / 2, height / 2);
        
        return canvas.toDataURL();
    }

    // Setup drag and drop for image upload
    setupDragAndDrop(dropZone, fileInput, previewElement, options = {}) {
        if (!dropZone || !fileInput) return;

        const {
            onError = null,
            onSuccess = null,
            maxSize = this.maxFileSize,
            allowedTypes = this.allowedTypes
        } = options;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('drag-over');
        }

        function unhighlight(e) {
            dropZone.classList.remove('drag-over');
        }

        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);

        async function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                const file = files[0];
                
                try {
                    const validation = this.validateFile(file, maxSize, allowedTypes);
                    if (!validation.valid) {
                        if (onError) onError(validation.message);
                        return;
                    }

                    // Update file input
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;

                    // Trigger change event
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                    if (onSuccess) onSuccess(file);
                } catch (error) {
                    if (onError) onError('Failed to process dropped file');
                }
            }
        }
    }
}

// Create global instance
export const imageHandler = new ImageHandler();

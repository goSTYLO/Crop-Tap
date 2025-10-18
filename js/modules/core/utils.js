// Utility Functions - OOP Approach (No Server Required)

class Utils {
    // Format currency
    static formatCurrency(amount, currency = '₱') {
        return `${currency}${parseFloat(amount).toFixed(2)}`;
    }

    // Format date
    static formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
    }

    // Format date and time
    static formatDateTime(date) {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Generate unique ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Validate email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate phone number
    static isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone);
    }

    // Sanitize HTML
    static sanitizeHtml(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // Capitalize first letter
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Convert to title case
    static toTitleCase(str) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // Get file extension
    static getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    // Check if file is image
    static isImageFile(filename) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const extension = this.getFileExtension(filename).toLowerCase();
        return imageExtensions.includes(extension);
    }

    // Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Deep clone object
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Merge objects
    static mergeObjects(...objects) {
        return Object.assign({}, ...objects);
    }

    // Get random color
    static getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Scroll to element
    static scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Copy text to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }

    // Show loading spinner
    static showLoading(element) {
        if (element) {
            element.style.opacity = '0.6';
            element.style.pointerEvents = 'none';
        }
    }

    // Hide loading spinner
    static hideLoading(element) {
        if (element) {
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
        }
    }
}

// Export for ES6 modules
export { Utils };
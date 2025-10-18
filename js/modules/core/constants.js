// Application Constants - OOP Approach (No Server Required)

// App configuration constants
const APP_CONFIG = {
    // API endpoints (if needed in future)
    API_BASE_URL: '/api',
    
    // Local storage keys
    STORAGE_KEYS: {
        USERS: 'crop_tap_users',
        PRODUCTS: 'crop_tap_products',
        ORDERS: 'crop_tap_orders',
        CART: 'crop_tap_cart',
        PAYMENTS: 'crop_tap_payments',
        SESSION: 'crop_tap_session',
        LANGUAGE: 'crop_tap_language'
    },
    
    // User roles
    USER_ROLES: {
        ADMIN: 'admin',
        FARMER: 'farmer',
        BUYER: 'buyer'
    },
    
    // Product categories
    PRODUCT_CATEGORIES: [
        'Vegetables',
        'Fruits',
        'Grains',
        'Herbs',
        'Root Crops',
        'Leafy Greens'
    ],
    
    // Toast notification settings
    TOAST: {
        DURATION: 3000,
        POSITION: 'top-right'
    },
    
    // Form validation rules
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 6,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/
    },
    
    // Image settings
    IMAGE: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
};

// Export for ES6 modules
export { APP_CONFIG };
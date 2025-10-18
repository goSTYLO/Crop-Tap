// Main Application Entry Point - GitHub Pages Compatible
// This file coordinates all modules and provides a clean interface

// Import core modules
import { APP_CONFIG } from './core/constants.js';
import { Utils } from './core/utils.js';

// Import UI modules
import { toast } from './ui/toast.js';
import { modal } from './ui/modal.js';

// Import event handlers
import { AuthEventHandlers } from './events/auth-events.js';

// Global application state
class App {
    constructor() {
        this.currentUser = null;
        this.currentPage = null;
        this.modules = new Map();
        this.init();
    }

    init() {
        this.detectCurrentPage();
        this.initializeModules();
        this.setupGlobalErrorHandling();
        this.setupGlobalEventListeners();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        this.currentPage = filename.replace('.html', '');
        console.log('Current page:', this.currentPage);
    }

    initializeModules() {
        // Always initialize core modules
        this.initializeCoreModules();
        
        // Initialize page-specific modules
        this.initializePageModules();
    }

    initializeCoreModules() {
        // Core modules are imported via ES6 modules
        this.modules.set('toast', toast);
        this.modules.set('modal', modal);
        this.modules.set('utils', Utils);
        this.modules.set('config', APP_CONFIG);
    }

    initializePageModules() {
        switch (this.currentPage) {
            case 'index':
                this.initializeLandingPage();
                break;
            case 'admin_dashboard':
                this.initializeAdminDashboard();
                break;
            case 'user_dashboard':
                this.initializeUserDashboard();
                break;
            case 'login':
                this.initializeLoginPage();
                break;
            case 'signup':
                this.initializeSignupPage();
                break;
            default:
                console.log('Unknown page, initializing basic functionality');
        }
    }

    async initializeLandingPage() {
        console.log('Initializing landing page...');
        
        // Load legacy services dynamically
        await this.loadLegacyServices();
        
        // Initialize product loading
        this.loadProducts();
        
        // Initialize search functionality
        this.initializeSearch();
        
        // Initialize contact form
        this.initializeContactForm();
        
        // Auto-logout when landing page loads
        if (window.auth && window.auth.isLoggedIn()) {
            window.auth.logout();
        }
    }

    async initializeAdminDashboard() {
        console.log('Initializing admin dashboard...');
        
        // Load legacy services
        await this.loadLegacyServices();
        
        // Initialize admin dashboard specific functionality
        if (window.adminDashboard) {
            this.modules.set('adminDashboard', window.adminDashboard);
            window.adminDashboard.init();
        }
    }

    async initializeUserDashboard() {
        console.log('Initializing user dashboard...');
        
        // Load legacy services
        await this.loadLegacyServices();
        
        // Initialize user dashboard specific functionality
        if (window.userDashboard) {
            this.modules.set('userDashboard', window.userDashboard);
            window.userDashboard.init();
        }
    }

    async initializeLoginPage() {
        console.log('Initializing login page...');
        
        // Load legacy services first
        await this.loadLegacyServices();
        
        // Wait a bit to ensure services are fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Initialize auth event handlers
        const authEvents = new AuthEventHandlers();
        this.modules.set('authEvents', authEvents);
        console.log('Auth events initialized for login page');
        
        // Verify auth service is available
        if (window.auth) {
            console.log('Auth service is available');
        } else {
            console.error('Auth service is not available');
        }
    }

    async initializeSignupPage() {
        console.log('Initializing signup page...');
        
        // Load legacy services first
        await this.loadLegacyServices();
        
        // Wait a bit to ensure services are fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Initialize auth event handlers
        const authEvents = new AuthEventHandlers();
        this.modules.set('authEvents', authEvents);
        console.log('Auth events initialized for signup page');
        
        // Verify auth service is available
        if (window.auth) {
            console.log('Auth service is available');
        } else {
            console.error('Auth service is not available');
        }
    }

    async loadLegacyServices() {
        // Dynamically load legacy services as ES6 modules
        try {
            const { default: storage } = await import('../storage.js');
            const { default: auth } = await import('../auth.js');
            const { default: productService } = await import('../products.js');
            const { default: cartService } = await import('../cart.js');
            
            // Make them globally available (both window and global scope for compatibility)
            window.storage = storage;
            window.auth = auth;
            window.productService = productService;
            window.cartService = cartService;
            
            // Also make them available in global scope like original scripts
            globalThis.storage = storage;
            globalThis.auth = auth;
            globalThis.productService = productService;
            globalThis.cartService = cartService;
            
            console.log('Legacy services loaded successfully');
        } catch (error) {
            console.error('Error loading legacy services:', error);
        }
    }

    loadProducts() {
        if (window.productService) {
            const products = window.productService.getAllProducts();
            this.renderProducts(products);
        }
    }

    renderProducts(products) {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;

        productGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = this.createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'pricing-card';
        card.innerHTML = `
            <img src="${product.image || 'assets/placeholder.jpg'}" alt="${product.name}" style="width:100%; height:200px; object-fit:cover; border-radius:8px 8px 0 0;">
            <div class="pricing-content">
                <h3>${product.name}</h3>
                <p class="price">₱${product.price.toFixed(2)} per ${product.unit}</p>
                <p class="description">${product.description || 'Fresh, high-quality produce'}</p>
                <p class="stock">Stock: ${product.quantity} ${product.unit}</p>
            </div>
        `;
        return card;
    }

    initializeSearch() {
        const searchInput = document.getElementById('productSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (window.productService) {
                const products = window.productService.searchProducts(query);
                this.renderProducts(products);
            }
        });
    }

    initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name') || contactForm.querySelector('input[type="text"]').value,
                email: formData.get('email') || contactForm.querySelector('input[type="email"]').value,
                message: formData.get('message') || contactForm.querySelector('textarea').value
            };

            // Show success message
            toast.success('Message sent successfully! We\'ll get back to you soon.');

            // Reset form
            contactForm.reset();
        });
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            toast.error('An error occurred. Please try again.');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            toast.error('An error occurred. Please try again.');
        });
    }

    setupGlobalEventListeners() {
        // Global event listeners that work across all pages
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, app initialized');
        });
    }

    // Utility methods
    getCurrentUser() {
        if (window.auth) {
            return window.auth.getCurrentUser();
        }
        return null;
    }

    getModule(name) {
        return this.modules.get(name);
    }

    // Navigation helper
    navigateTo(page) {
        window.location.href = `${page}.html`;
    }

    // Authentication helpers
    isLoggedIn() {
        if (window.auth) {
            return window.auth.isLoggedIn();
        }
        return false;
    }

    logout() {
        if (window.auth) {
            window.auth.logout();
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    console.log('Crop-Tap Application initialized for GitHub Pages');
});

// Make App class globally available
window.App = App;
// Authentication system for Crop-Tap
// Simple client-side authentication using localStorage

class AuthService {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const session = storage.getSession();
        if (session) {
            this.currentUser = storage.getUserById(session.user_id);
            this.updateUI();
        }
    }

    // Register new user
    async register(userData) {
        try {
            // Validate required fields
            if (!userData.name || !userData.email || !userData.password || !userData.role) {
                throw new Error('All fields are required');
            }

            // Check if email already exists
            const existingUser = storage.getUserByEmail(userData.email);
            if (existingUser) {
                throw new Error('Email already in use');
            }

            // Create user
            const newUser = storage.createUser(userData);
            
            // Auto-login after registration
            this.login(userData.email, userData.password);
            
            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Login user
    async login(email, password) {
        try {
            const user = storage.getUserByEmail(email);
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Simple password check (in real app, use proper hashing)
            if (user.password !== password) {
                throw new Error('Invalid credentials');
            }

            // Set session
            this.currentUser = user;
            storage.setSession(user);
            this.updateUI();
            
            return { success: true, user: user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        storage.clearSession();
        this.updateUI();
        
        // Redirect to home page
        window.location.href = 'index.html';
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Update UI based on authentication status
    updateUI() {
        const isLoggedIn = this.isLoggedIn();
        const user = this.getCurrentUser();

        // Show/hide navigation elements
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const logoutLink = document.getElementById('logout-link');
        const cartLink = document.getElementById('cart-link');
        const farmerDashboardLink = document.getElementById('farmer-dashboard-link');
        const buyerOrdersLink = document.getElementById('buyer-orders-link');

        if (isLoggedIn) {
            // Hide login/register links
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            
            // Show logout and cart links
            if (logoutLink) logoutLink.style.display = 'block';
            if (cartLink) cartLink.style.display = 'block';
            
            // Show role-specific links
            if (user.role === 'farmer' && farmerDashboardLink) {
                farmerDashboardLink.style.display = 'block';
            }
            if (user.role === 'buyer' && buyerOrdersLink) {
                buyerOrdersLink.style.display = 'block';
            }
        } else {
            // Show login/register links
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            
            // Hide logout and cart links
            if (logoutLink) logoutLink.style.display = 'none';
            if (cartLink) cartLink.style.display = 'none';
            if (farmerDashboardLink) farmerDashboardLink.style.display = 'none';
            if (buyerOrdersLink) buyerOrdersLink.style.display = 'none';
        }
    }

    // Require authentication for protected pages
    requireAuth(requiredRole = null) {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }

        if (requiredRole && !this.hasRole(requiredRole)) {
            showNotification('Access denied. Insufficient permissions.', 'error');
            window.location.href = 'index.html';
            return false;
        }

        return true;
    }
}

// Create global instance
const auth = new AuthService();

// Global logout function for HTML onclick
function logout() {
    auth.logout();
}

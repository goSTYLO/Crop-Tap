// User Dashboard - Main Controller
// Coordinates all dashboard modules

class UserDashboard {
    constructor() {
        this.currentUser = null;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // Check authentication
        if (!auth.isLoggedIn() || !auth.isBuyer()) {
            alert('Access denied. Buyers only.');
            window.location.href = 'index.html';
            return;
        }
        
        this.currentUser = auth.getCurrentUser();
        this.initializeModules();
        this.initializeApp();
        this.loadInitialData();
    }

    initializeModules() {
        // Initialize all dashboard modules
        this.ui = new UserDashboardUI(this);
        this.products = new UserDashboardProducts(this);
        this.cart = new UserDashboardCart(this);
        this.orders = new UserDashboardOrders(this);
        this.profile = new UserDashboardProfile(this);
        this.farmer = new UserDashboardFarmer(this);
    }

    initializeApp() {
        // Initialize user info
        this.ui.initializeUserInfo(this.currentUser);
        this.ui.updateWelcomeMessage();
        
        // Setup profile image handling
        this.profile.setupConsumerProfileImage();
        
        // Update user info
        this.profile.updateUserInfo();
    }

    loadInitialData() {
        // Load initial dashboard data
        this.products.loadProducts();
        this.orders.renderOrders();
        this.cart.updateCartUI();
        this.profile.loadConsumerProfileData();
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.userDashboard = new UserDashboard();
});
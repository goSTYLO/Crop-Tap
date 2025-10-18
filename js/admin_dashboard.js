// Admin Dashboard - Main Controller
// Coordinates all dashboard modules

class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.currentUserRole = 'farmer';
        this.init();
    }

    init() {
    // Check authentication
    if (!auth.isLoggedIn() || !auth.isFarmer()) {
        alert('Access denied. Farmers only.');
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
        this.ui = new AdminDashboardUI(this);
        this.products = new AdminDashboardProducts(this);
        this.orders = new AdminDashboardOrders(this);
        this.users = new AdminDashboardUsers(this);
        this.payments = new AdminDashboardPayments(this);
        this.logs = new AdminDashboardLogs(this);
        this.profile = new AdminDashboardProfile(this);
        this.stats = new AdminDashboardStats(this);
    }

    initializeApp() {
        // Initialize user info
        this.ui.initializeUserInfo(this.currentUser);
        
        // Load farmer profile data
        this.profile.loadFarmerProfileData();
    }

    loadInitialData() {
        // Load initial dashboard data
        this.products.loadProductsTable();
        this.orders.loadOrdersTable();
        this.stats.updateDashboardStats();
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
});
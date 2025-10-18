// Admin Dashboard UI Management
// Handles navigation, mobile menu, and general UI interactions

class AdminDashboardUI {
    constructor(adminDashboard) {
        this.adminDashboard = adminDashboard;
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupFormHandlers();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
    }

    setupMobileMenu() {
        const menuBtn = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
    }

    setupFormHandlers() {
        // Product form
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.adminDashboard.products.handleProductSubmit(e));
        }

        // Order form
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => this.adminDashboard.orders.handleOrderSubmit(e));
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.adminDashboard.profile.handleProfileSubmit(e));
        }
    }

    navigateToPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show selected page
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Load page-specific data
        switch (page) {
            case 'products':
                this.adminDashboard.products.loadProductsTable();
                break;
            case 'orders':
                this.adminDashboard.orders.loadOrdersTable();
                break;
            case 'users':
                this.adminDashboard.users.loadUsersTable();
                break;
            case 'payments':
                this.adminDashboard.payments.loadPaymentsTable();
                break;
            case 'logs':
                this.adminDashboard.logs.loadLogsTable();
                break;
            case 'profile':
                this.adminDashboard.profile.loadFarmerProfileData();
                break;
        }
    }

    initializeUserInfo(currentUser) {
        // Set user info
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = 'Farmer';
        const avatar = document.getElementById('userAvatar');
        const topbarAvatar = document.getElementById('topbarAvatar');
        if (currentUser.avatar_url) {
            if (avatar) {
                avatar.src = currentUser.avatar_url;
                avatar.style.display = 'block';
            }
            if (topbarAvatar) {
                topbarAvatar.src = currentUser.avatar_url;
                topbarAvatar.style.display = 'inline-block';
            }
        }
    }
}

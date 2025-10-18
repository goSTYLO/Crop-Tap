// User Dashboard UI Management
// Handles navigation, mobile menu, and general UI interactions

class UserDashboardUI {
    constructor(userDashboard) {
        this.userDashboard = userDashboard;
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupEventListeners();
    }

    setupNavigation() {
        // Navigation items
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

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.userDashboard.products.searchProducts(e.target.value);
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.userDashboard.products.filterProducts(category);
            });
        });
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
                this.userDashboard.products.loadProducts();
                break;
            case 'cart':
                this.userDashboard.cart.updateCartUI();
                break;
            case 'orders':
                this.userDashboard.orders.renderOrders();
                break;
            case 'profile':
                this.userDashboard.profile.loadConsumerProfileData();
                break;
            case 'farmer':
                this.userDashboard.farmer.loadFarmerSection();
                break;
        }
    }

    initializeUserInfo(currentUser) {
        // Set user info
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = 'Consumer';
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

    updateWelcomeMessage() {
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement && this.userDashboard.currentUser) {
            welcomeElement.textContent = `Welcome back, ${this.userDashboard.currentUser.name}!`;
        }
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

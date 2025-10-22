// Cross-Tab Synchronization System for Crop-Tap
// Enables real-time updates across browser tabs using Storage Events

class TabSync {
    constructor() {
        this.isInitialized = false;
        this.notificationQueue = [];
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            this.handleStorageChange(e);
        });

        // Listen for custom events from the same tab
        window.addEventListener('tabSync', (e) => {
            this.handleCustomEvent(e);
        });

        this.isInitialized = true;
        console.log('🔄 TabSync initialized - listening for cross-tab updates');
    }

    handleStorageChange(e) {
        // Storage events only fire in OTHER tabs, not the tab that made the change
        if (!e.key || !e.newValue) return;

        // Debounce rapid changes
        clearTimeout(this._changeTimeout);
        this._changeTimeout = setTimeout(() => {
            console.log(`📡 Storage change detected: ${e.key}`, e.newValue);

            switch (e.key) {
                case 'products':
                    this.handleProductsChange(e);
                    break;
                case 'orders':
                    this.handleOrdersChange(e);
                    break;
                case 'cart_items':
                    this.handleCartChange(e);
                    break;
                case 'order_items':
                    this.handleOrderItemsChange(e);
                    break;
                case 'users':
                    this.handleUsersChange(e);
                    break;
            }
        }, 50);
    }

    handleCustomEvent(e) {
        // Handle events from the same tab
        const { type, data } = e.detail;
        console.log(`📡 Custom event: ${type}`, data);

        switch (type) {
            case 'product_updated':
                this.showNotification('Product updated!', 'success');
                break;
            case 'order_placed':
                this.showNotification('New order received!', 'info');
                break;
            case 'cart_updated':
                this.showNotification('Cart updated!', 'info');
                break;
        }
    }

    handleProductsChange(e) {
        try {
            const newProducts = JSON.parse(e.newValue);
            const oldProducts = e.oldValue ? JSON.parse(e.oldValue) : [];

            console.log('🔄 Products changed:', {
                oldCount: oldProducts.length,
                newCount: newProducts.length,
                currentPage: this.getCurrentPage()
            });

            // Determine what changed
            if (newProducts.length > oldProducts.length) {
                this.showNotification('New product added!', 'success');
            } else if (newProducts.length < oldProducts.length) {
                this.showNotification('Product removed!', 'warning');
            } else {
                this.showNotification('Product updated!', 'info');
            }

            // Trigger page-specific refresh
            this.triggerRefresh('products', newProducts);
        } catch (error) {
            console.error('Error parsing products change:', error);
        }
    }

    handleOrdersChange(e) {
        try {
            const newOrders = JSON.parse(e.newValue);
            const oldOrders = e.oldValue ? JSON.parse(e.oldValue) : [];

            if (newOrders.length > oldOrders.length) {
                this.showNotification('New order received!', 'success');
            } else {
                this.showNotification('Order status updated!', 'info');
            }

            this.triggerRefresh('orders', newOrders);
        } catch (error) {
            console.error('Error parsing orders change:', error);
        }
    }

    handleCartChange(e) {
        try {
            const newCartItems = JSON.parse(e.newValue);
            const oldCartItems = e.oldValue ? JSON.parse(e.oldValue) : [];

            if (newCartItems.length > oldCartItems.length) {
                this.showNotification('Item added to cart!', 'info');
            } else if (newCartItems.length < oldCartItems.length) {
                this.showNotification('Item removed from cart!', 'warning');
            } else {
                this.showNotification('Cart updated!', 'info');
            }

            this.triggerRefresh('cart', newCartItems);
        } catch (error) {
            console.error('Error parsing cart change:', error);
        }
    }

    handleOrderItemsChange(e) {
        try {
            const newOrderItems = JSON.parse(e.newValue);
            this.triggerRefresh('order_items', newOrderItems);
        } catch (error) {
            console.error('Error parsing order items change:', error);
        }
    }

    handleUsersChange(e) {
        try {
            const newUsers = JSON.parse(e.newValue);
            this.triggerRefresh('users', newUsers);
        } catch (error) {
            console.error('Error parsing users change:', error);
        }
    }

    triggerRefresh(dataType, data) {
        // Call page-specific refresh functions if they exist
        const currentPage = this.getCurrentPage();
        console.log(`🔄 Triggering refresh for ${dataType} on ${currentPage}`, {
            dataType,
            currentPage,
            hasRefreshFunction: typeof window[`refresh${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`] === 'function'
        });
        
        switch (currentPage) {
            case 'landing':
                this.refreshLandingPage(dataType, data);
                break;
            case 'user_dashboard':
                this.refreshUserDashboard(dataType, data);
                break;
            case 'admin_dashboard':
                this.refreshAdminDashboard(dataType, data);
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename === 'index.html' || filename === '') {
            return 'landing';
        } else if (filename === 'user_dashboard.html') {
            return 'user_dashboard';
        } else if (filename === 'admin_dashboard.html') {
            return 'admin_dashboard';
        }
        
        return 'unknown';
    }

    refreshLandingPage(dataType, data) {
        // Refresh landing page components
        if (typeof window.refreshProducts === 'function') {
            window.refreshProducts();
        }
        if (typeof window.refreshCart === 'function') {
            window.refreshCart();
        }
        if (typeof window.updateCartBadge === 'function') {
            window.updateCartBadge();
        }
    }

    refreshUserDashboard(dataType, data) {
        // Refresh user dashboard components
        if (typeof window.refreshProducts === 'function') {
            window.refreshProducts();
        }
        if (typeof window.refreshOrderHistory === 'function') {
            window.refreshOrderHistory();
        }
        if (typeof window.refreshCart === 'function') {
            window.refreshCart();
        }
        if (typeof window.updateCartBadge === 'function') {
            window.updateCartBadge();
        }
    }

    refreshAdminDashboard(dataType, data) {
        // Refresh admin dashboard components
        if (typeof window.refreshProductList === 'function') {
            window.refreshProductList();
        }
        if (typeof window.refreshOrderList === 'function') {
            window.refreshOrderList();
        }
        if (typeof window.refreshDashboardStats === 'function') {
            window.refreshDashboardStats();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `tab-sync-notification tab-sync-${type}`;
        notification.innerHTML = `
            <div class="tab-sync-content">
                <span class="tab-sync-icon">${this.getIcon(type)}</span>
                <span class="tab-sync-message">${message}</span>
                <button class="tab-sync-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);

        // Add CSS if not already added
        this.addNotificationCSS();
    }

    getIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            case 'info': 
            default: return 'ℹ️';
        }
    }

    addNotificationCSS() {
        if (document.getElementById('tab-sync-styles')) return;

        const style = document.createElement('style');
        style.id = 'tab-sync-styles';
        style.textContent = `
            .tab-sync-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                min-width: 300px;
                max-width: 400px;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                animation: tabSyncSlideIn 0.3s ease-out;
            }

            .tab-sync-success {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
            }

            .tab-sync-info {
                background: #d1ecf1;
                border: 1px solid #bee5eb;
                color: #0c5460;
            }

            .tab-sync-warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
            }

            .tab-sync-error {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
            }

            .tab-sync-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .tab-sync-icon {
                font-size: 16px;
            }

            .tab-sync-message {
                flex: 1;
                font-weight: 500;
            }

            .tab-sync-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                opacity: 0.7;
                transition: opacity 0.2s;
            }

            .tab-sync-close:hover {
                opacity: 1;
            }

            @keyframes tabSyncSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Utility method to trigger custom events
    static triggerEvent(type, data) {
        window.dispatchEvent(new CustomEvent('tabSync', {
            detail: { type, data }
        }));
    }

    // Utility method to notify other tabs of changes
    static notifyChange(key, newValue) {
        // This will trigger storage events in other tabs
        localStorage.setItem(key, JSON.stringify(newValue));
    }
}

// Initialize TabSync when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tabSync = new TabSync();
});

// Global utility functions for easy use
window.TabSync = TabSync;

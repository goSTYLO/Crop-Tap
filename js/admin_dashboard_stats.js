// Admin Dashboard Statistics Management
// Handles all statistics and dashboard data

class AdminDashboardStats {
    constructor(adminDashboard) {
        this.adminDashboard = adminDashboard;
    }

    updateDashboardStats() {
        const products = productService.getAllProducts();
        const orders = storage.getData('orders') || [];
        const users = storage.getData('users') || [];
        const payments = storage.getData('payments') || [];

        // Update stats
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalRevenue').textContent = `₱${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`;

        // Update recent orders
        this.updateRecentOrders(orders.slice(-5));
    }

    updateRecentOrders(recentOrders) {
        const container = document.getElementById('recentOrders');
        if (!container) return;

        container.innerHTML = '';
        
        recentOrders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';
            orderElement.innerHTML = `
                <div class="order-info">
                    <h4>Order #${order.id}</h4>
                    <p>${order.customer_name} - ₱${order.total.toFixed(2)}</p>
                </div>
                <div class="order-status">
                    <span class="status ${order.status}">${order.status}</span>
                </div>
            `;
            container.appendChild(orderElement);
        });
    }
}

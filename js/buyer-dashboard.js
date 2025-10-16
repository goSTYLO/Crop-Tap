// Buyer Dashboard functionality for Crop-Tap
// Handles order history and tracking for buyers

class BuyerDashboard {
    constructor() {
        this.currentUser = null;
        this.orders = [];
    }

    init() {
        this.currentUser = auth.getCurrentUser();
        this.loadOrders();
        this.updateStats();
        this.renderOrders();
    }

    // Load buyer's orders
    loadOrders() {
        this.orders = storage.getOrdersByBuyer(this.currentUser.user_id);
        // Sort by creation date (newest first)
        this.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Update dashboard statistics
    updateStats() {
        document.getElementById('total-orders').textContent = this.orders.length;
        
        const totalSpent = this.orders
            .filter(order => order.status === 'paid' || order.status === 'completed')
            .reduce((sum, order) => sum + order.total_amount, 0);
        document.getElementById('total-spent').textContent = utils.formatCurrency(totalSpent);
        
        const pendingOrders = this.orders.filter(order => 
            order.status === 'pending_payment' || order.status === 'paid' || order.status === 'shipped'
        ).length;
        document.getElementById('pending-orders').textContent = pendingOrders;
        
        const completedOrders = this.orders.filter(order => order.status === 'completed').length;
        document.getElementById('completed-orders').textContent = completedOrders;
    }

    // Render orders list
    renderOrders() {
        const container = document.getElementById('orders-list');
        if (!container) return;

        if (this.orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h5>No orders yet</h5>
                    <p>Your order history will appear here once you make your first purchase.</p>
                    <a href="index.html" class="btn btn-success">Start Shopping</a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.orders.map(order => {
            const orderItems = storage.getData('order_items').filter(item => 
                item.order_id === order.order_id
            );
            const products = storage.getProducts();
            
            const orderItemsWithProducts = orderItems.map(item => {
                const product = products.find(p => p.product_id === item.product_id);
                return { ...item, product };
            }).filter(item => item.product);

            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-3">
                                <h6 class="mb-1">Order #${order.order_id}</h6>
                                <small class="text-muted">${utils.formatDate(order.created_at)}</small>
                            </div>
                            <div class="col-md-4">
                                <div class="small">
                                    ${orderItemsWithProducts.slice(0, 2).map(item => `
                                        <div>${item.product.name} (${item.quantity})</div>
                                    `).join('')}
                                    ${orderItemsWithProducts.length > 2 ? 
                                        `<div class="text-muted">+${orderItemsWithProducts.length - 2} more items</div>` : 
                                        ''
                                    }
                                </div>
                            </div>
                            <div class="col-md-2">
                                <span class="badge status-${order.status.replace('_', '-')}">${this.formatStatus(order.status)}</span>
                            </div>
                            <div class="col-md-2">
                                <strong>$${order.total_amount.toFixed(2)}</strong>
                            </div>
                            <div class="col-md-1">
                                <button class="btn btn-outline-primary btn-sm" onclick="buyerDashboard.viewOrderDetails('${order.order_id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Format order status for display
    formatStatus(status) {
        const statusMap = {
            'pending_payment': 'Pending Payment',
            'paid': 'Paid',
            'shipped': 'Shipped',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }

    // View order details
    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.order_id === orderId);
        if (!order) return;

        const orderItems = storage.getData('order_items').filter(item => 
            item.order_id === order.order_id
        );
        const products = storage.getProducts();
        const users = storage.getData('users');
        
        const orderItemsWithProducts = orderItems.map(item => {
            const product = products.find(p => p.product_id === item.product_id);
            const farmer = users.find(u => u.user_id === item.farmer_id);
            return { ...item, product, farmer };
        }).filter(item => item.product);

        const container = document.getElementById('order-details');
        container.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Order Information</h6>
                    <table class="table table-sm">
                        <tr>
                            <td><strong>Order ID:</strong></td>
                            <td>${order.order_id}</td>
                        </tr>
                        <tr>
                            <td><strong>Order Date:</strong></td>
                            <td>${utils.formatDate(order.created_at)}</td>
                        </tr>
                        <tr>
                            <td><strong>Status:</strong></td>
                            <td><span class="badge status-${order.status.replace('_', '-')}">${this.formatStatus(order.status)}</span></td>
                        </tr>
                        <tr>
                            <td><strong>Total Amount:</strong></td>
                            <td><strong>$${order.total_amount.toFixed(2)}</strong></td>
                        </tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>Order Items</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Farmer</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderItemsWithProducts.map(item => `
                                    <tr>
                                        <td>${item.product.name}</td>
                                        <td>${item.farmer ? item.farmer.name : 'Unknown'}</td>
                                        <td>${item.quantity}</td>
                                        <td>$${item.price.toFixed(2)}</td>
                                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            ${this.getOrderStatusMessage(order.status)}
        `;

        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
    }

    // Get status-specific message
    getOrderStatusMessage(status) {
        const messages = {
            'pending_payment': `
                <div class="alert alert-warning mt-3">
                    <i class="fas fa-clock"></i>
                    <strong>Payment Pending:</strong> Your order is waiting for payment confirmation.
                </div>
            `,
            'paid': `
                <div class="alert alert-info mt-3">
                    <i class="fas fa-check-circle"></i>
                    <strong>Payment Confirmed:</strong> Your order has been paid and is being processed by the farmers.
                </div>
            `,
            'shipped': `
                <div class="alert alert-primary mt-3">
                    <i class="fas fa-truck"></i>
                    <strong>Order Shipped:</strong> Your order is on its way to you.
                </div>
            `,
            'completed': `
                <div class="alert alert-success mt-3">
                    <i class="fas fa-check-double"></i>
                    <strong>Order Completed:</strong> Your order has been delivered successfully.
                </div>
            `,
            'cancelled': `
                <div class="alert alert-danger mt-3">
                    <i class="fas fa-times-circle"></i>
                    <strong>Order Cancelled:</strong> This order has been cancelled.
                </div>
            `
        };

        return messages[status] || '';
    }

    // Refresh dashboard data
    refresh() {
        this.loadOrders();
        this.updateStats();
        this.renderOrders();
    }
}

// Create global instance
const buyerDashboard = new BuyerDashboard();

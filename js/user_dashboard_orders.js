// User Dashboard Order Management
// Handles order display and tracking

class UserDashboardOrders {
    constructor(userDashboard) {
        this.userDashboard = userDashboard;
    }

    renderOrders() {
        const orders = storage.getData('orders') || [];
        const userOrders = orders.filter(order => order.user_id === this.userDashboard.currentUser.user_id);
        
        const container = document.getElementById('ordersContainer');
        if (!container) return;

        if (userOrders.length === 0) {
            container.innerHTML = '<div class="no-orders">No orders found</div>';
            return;
        }

        container.innerHTML = userOrders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>Order #${order.id}</h3>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
                    <p><strong>Items:</strong> ${order.items.length}</p>
                    <p><strong>Payment:</strong> ${order.payment_method}</p>
                </div>
                <div class="order-actions">
                    <button onclick="userDashboard.orders.viewOrderDetails(${order.id})">View Details</button>
                    ${order.status === 'pending' ? 
                        `<button onclick="userDashboard.orders.cancelOrder(${order.id})">Cancel Order</button>` : 
                        ''
                    }
                </div>
            </div>
        `).join('');
    }

    viewOrderDetails(orderId) {
        const orders = storage.getData('orders') || [];
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Create order details modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>Order #${order.id} Details</h2>
                <div class="order-details">
                    <div class="detail-section">
                        <h3>Order Information</h3>
                        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                        <p><strong>Status:</strong> <span class="status ${order.status}">${order.status}</span></p>
                        <p><strong>Payment Method:</strong> ${order.payment_method}</p>
                        <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Delivery Address</h3>
                        <p>${order.address}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Items</h3>
                        <div class="order-items">
                            ${order.items.map(item => {
                                const product = productService.getProductById(item.product_id);
                                return `
                                    <div class="order-item">
                                        <span>${product ? product.name : 'Unknown Product'}</span>
                                        <span>${item.quantity} x ₱${product ? product.price.toFixed(2) : '0.00'}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    cancelOrder(orderId) {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        const orders = storage.getData('orders') || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;

        orders[orderIndex].status = 'cancelled';
        storage.saveData('orders', orders);
        
        alert('Order cancelled successfully!');
        this.renderOrders();
    }
}

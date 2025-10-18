// User Dashboard Farmer Section
// Handles farmer-specific functionality for users who are also farmers

class UserDashboardFarmer {
    constructor(userDashboard) {
        this.userDashboard = userDashboard;
    }

    loadFarmerSection() {
        // Check if user is also a farmer
        if (this.userDashboard.currentUser.role !== 'farmer') {
            const farmerSection = document.getElementById('farmerSection');
            if (farmerSection) {
                farmerSection.innerHTML = '<p>You are not registered as a farmer.</p>';
            }
            return;
        }

        // Load farmer-specific data
        this.loadFarmerProducts();
        this.loadFarmerOrders();
        this.updateFarmerStats();
    }

    loadFarmerProducts() {
        const products = productService.getAllProducts();
        const farmerProducts = products.filter(p => p.farmer_id === this.userDashboard.currentUser.user_id);
        
        const container = document.getElementById('farmerProducts');
        if (!container) return;

        if (farmerProducts.length === 0) {
            container.innerHTML = '<div class="no-products">No products found. <a href="admin_dashboard.html">Add products</a></div>';
            return;
        }

        container.innerHTML = farmerProducts.map(product => `
            <div class="farmer-product-card">
                <div class="product-image">
                    ${product.image_url ? 
                        `<img src="${product.image_url}" alt="${product.name}">` :
                        `<span>🌾</span>`
                    }
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>₱${product.price.toFixed(2)} per ${product.unit}</p>
                    <p>Stock: ${product.quantity} ${product.unit}</p>
                    <p>Category: ${product.category}</p>
                </div>
                <div class="product-actions">
                    <button onclick="userDashboard.farmer.editProduct(${product.id})">Edit</button>
                    <button onclick="userDashboard.farmer.deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    loadFarmerOrders() {
        const orders = storage.getData('orders') || [];
        const farmerOrders = orders.filter(order => {
            // Check if any item in the order belongs to this farmer
            return order.items.some(item => {
                const product = productService.getProductById(item.product_id);
                return product && product.farmer_id === this.userDashboard.currentUser.user_id;
            });
        });
        
        const container = document.getElementById('farmerOrders');
        if (!container) return;

        if (farmerOrders.length === 0) {
            container.innerHTML = '<div class="no-orders">No orders found</div>';
            return;
        }

        container.innerHTML = farmerOrders.map(order => `
            <div class="farmer-order-card">
                <div class="order-header">
                    <h3>Order #${order.id}</h3>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p><strong>Customer:</strong> ${order.customer_name || 'Unknown'}</p>
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
                </div>
                <div class="order-actions">
                    <button onclick="userDashboard.farmer.viewFarmerOrderDetails(${order.id})">View Details</button>
                    ${order.status === 'pending' ? 
                        `<button onclick="userDashboard.farmer.updateOrderStatus(${order.id}, 'processing')">Process</button>` : 
                        ''
                    }
                </div>
            </div>
        `).join('');
    }

    updateFarmerStats() {
        const products = productService.getAllProducts();
        const farmerProducts = products.filter(p => p.farmer_id === this.userDashboard.currentUser.user_id);
        
        const orders = storage.getData('orders') || [];
        const farmerOrders = orders.filter(order => {
            return order.items.some(item => {
                const product = productService.getProductById(item.product_id);
                return product && product.farmer_id === this.userDashboard.currentUser.user_id;
            });
        });

        const totalRevenue = farmerOrders.reduce((sum, order) => sum + order.total, 0);

        // Update stats display
        const totalProductsElement = document.getElementById('farmerTotalProducts');
        const totalOrdersElement = document.getElementById('farmerTotalOrders');
        const totalRevenueElement = document.getElementById('farmerTotalRevenue');

        if (totalProductsElement) totalProductsElement.textContent = farmerProducts.length;
        if (totalOrdersElement) totalOrdersElement.textContent = farmerOrders.length;
        if (totalRevenueElement) totalRevenueElement.textContent = `₱${totalRevenue.toFixed(2)}`;
    }

    editProduct(productId) {
        // Redirect to admin dashboard for product editing
        window.location.href = `admin_dashboard.html#products`;
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            const result = productService.deleteProduct(productId);
            if (result.success) {
                alert('Product deleted successfully!');
                this.loadFarmerProducts();
                this.updateFarmerStats();
            } else {
                alert('Error deleting product: ' + result.message);
            }
        }
    }

    viewFarmerOrderDetails(orderId) {
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
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${order.customer_name || 'Unknown'}</p>
                        <p><strong>Email:</strong> ${order.customer_email || 'Unknown'}</p>
                        <p><strong>Phone:</strong> ${order.customer_phone || 'Unknown'}</p>
                        <p><strong>Address:</strong> ${order.address}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Order Information</h3>
                        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                        <p><strong>Status:</strong> <span class="status ${order.status}">${order.status}</span></p>
                        <p><strong>Payment Method:</strong> ${order.payment_method}</p>
                        <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Items</h3>
                        <div class="order-items">
                            ${order.items.map(item => {
                                const product = productService.getProductById(item.product_id);
                                if (product && product.farmer_id === this.userDashboard.currentUser.user_id) {
                                    return `
                                        <div class="order-item">
                                            <span>${product.name}</span>
                                            <span>${item.quantity} x ₱${product.price.toFixed(2)}</span>
                                        </div>
                                    `;
                                }
                                return '';
                            }).filter(item => item).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    updateOrderStatus(orderId, status) {
        const orders = storage.getData('orders') || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;

        orders[orderIndex].status = status;
        storage.saveData('orders', orders);
        
        alert('Order status updated!');
        this.loadFarmerOrders();
    }
}

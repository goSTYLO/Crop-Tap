// Farmer Dashboard functionality for Crop-Tap
// Handles product management and order tracking for farmers

class FarmerDashboard {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.orders = [];
        this.editingProduct = null;
    }

    init() {
        this.currentUser = auth.getCurrentUser();
        this.loadData();
        this.setupEventListeners();
    }

    // Load farmer's data
    loadData() {
        this.products = storage.getProductsByFarmer(this.currentUser.user_id);
        this.orders = storage.getOrdersByFarmer(this.currentUser.user_id);
        this.updateStats();
        this.renderProducts();
        this.renderOrders();
    }

    // Update dashboard statistics
    updateStats() {
        document.getElementById('total-products').textContent = this.products.length;
        document.getElementById('total-orders').textContent = this.orders.length;
        
        const totalRevenue = this.orders
            .filter(order => order.status === 'paid' || order.status === 'completed')
            .reduce((sum, order) => sum + order.total_amount, 0);
        document.getElementById('total-revenue').textContent = utils.formatCurrency(totalRevenue);
        
        const pendingOrders = this.orders.filter(order => 
            order.status === 'pending_payment' || order.status === 'paid'
        ).length;
        document.getElementById('pending-orders').textContent = pendingOrders;
    }

    // Render products list
    renderProducts() {
        const container = document.getElementById('products-list');
        if (!container) return;

        if (this.products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-seedling"></i>
                    <h5>No products yet</h5>
                    <p>Add your first product to start selling!</p>
                    <button class="btn btn-success" onclick="farmerDashboard.showAddProductModal()">
                        Add Product
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.products.map(product => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            ${product.image_url ? 
                                `<img src="${product.image_url}" class="img-fluid rounded" alt="${product.name}" style="height: 80px; object-fit: cover;">` :
                                `<div class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 80px;">
                                    <i class="fas fa-image text-muted"></i>
                                </div>`
                            }
                        </div>
                        <div class="col-md-6">
                            <h6 class="mb-1">${product.name}</h6>
                            <p class="text-muted small mb-1">${product.description || 'No description'}</p>
                            <small class="text-muted">Created: ${utils.formatDate(product.created_at)}</small>
                        </div>
                        <div class="col-md-2">
                            <div class="text-center">
                                <div class="fw-bold text-success">$${product.price.toFixed(2)}</div>
                                <small class="text-muted">per ${product.unit}</small>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="text-center">
                                <div class="fw-bold">${product.quantity}</div>
                                <small class="text-muted">in stock</small>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="btn-group-vertical btn-group-sm">
                                <button class="btn btn-outline-primary" onclick="farmerDashboard.editProduct('${product.product_id}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-outline-danger" onclick="farmerDashboard.deleteProduct('${product.product_id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
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
                    <p>Orders for your products will appear here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.orders.map(order => {
            const orderItems = storage.getData('order_items').filter(item => 
                item.order_id === order.order_id && item.farmer_id === this.currentUser.user_id
            );
            const products = storage.getProducts();
            
            const orderItemsWithProducts = orderItems.map(item => {
                const product = products.find(p => p.product_id === item.product_id);
                return { ...item, product };
            }).filter(item => item.product);

            const totalAmount = orderItemsWithProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
                                    ${orderItemsWithProducts.map(item => `
                                        <div>${item.product.name} (${item.quantity} x $${item.price.toFixed(2)})</div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="col-md-2">
                                <span class="badge status-${order.status.replace('_', '-')}">${order.status.replace('_', ' ')}</span>
                            </div>
                            <div class="col-md-2">
                                <strong>$${totalAmount.toFixed(2)}</strong>
                            </div>
                            <div class="col-md-1">
                                ${this.getOrderStatusControls(order)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Get order status controls
    getOrderStatusControls(order) {
        const statusControls = {
            'pending_payment': '<span class="text-muted">Waiting for payment</span>',
            'paid': `
                <select class="form-select form-select-sm" onchange="farmerDashboard.updateOrderStatus('${order.order_id}', this.value)">
                    <option value="paid" selected>Paid</option>
                    <option value="shipped">Shipped</option>
                </select>
            `,
            'shipped': `
                <select class="form-select form-select-sm" onchange="farmerDashboard.updateOrderStatus('${order.order_id}', this.value)">
                    <option value="shipped" selected>Shipped</option>
                    <option value="completed">Completed</option>
                </select>
            `,
            'completed': '<span class="text-success">Completed</span>'
        };

        return statusControls[order.status] || '<span class="text-muted">Unknown</span>';
    }

    // Show add product modal
    showAddProductModal() {
        this.editingProduct = null;
        document.getElementById('productModalTitle').textContent = 'Add Product';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        document.getElementById('image-preview').style.display = 'none';
        
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }

    // Edit product
    editProduct(productId) {
        const product = this.products.find(p => p.product_id === productId);
        if (!product) return;

        this.editingProduct = product;
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        document.getElementById('product-id').value = product.product_id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-unit').value = product.unit;
        document.getElementById('product-description').value = product.description || '';
        
        if (product.image_url) {
            document.getElementById('preview-img').src = product.image_url;
            document.getElementById('image-preview').style.display = 'block';
        } else {
            document.getElementById('image-preview').style.display = 'none';
        }
        
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }

    // Save product
    async saveProduct() {
        const form = document.getElementById('product-form');
        const formData = new FormData(form);
        
        const productData = {
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            quantity: parseInt(document.getElementById('product-quantity').value),
            unit: document.getElementById('product-unit').value,
            description: document.getElementById('product-description').value
        };

        // Handle image upload
        const imageFile = document.getElementById('product-image').files[0];
        if (imageFile) {
            productData.image_url = await this.convertImageToBase64(imageFile);
        } else if (this.editingProduct && this.editingProduct.image_url) {
            productData.image_url = this.editingProduct.image_url;
        }

        try {
            if (this.editingProduct) {
                // Update existing product
                const updated = storage.updateProduct(this.editingProduct.product_id, productData);
                if (updated) {
                    showNotification('Product updated successfully!', 'success');
                }
            } else {
                // Create new product
                const created = storage.createProduct(productData);
                if (created) {
                    showNotification('Product created successfully!', 'success');
                }
            }

            // Close modal and refresh data
            const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
            modal.hide();
            this.loadData();
            
        } catch (error) {
            showNotification('Error saving product: ' + error.message, 'error');
        }
    }

    // Convert image to base64
    convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Delete product
    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            const success = storage.deleteProduct(productId);
            if (success) {
                showNotification('Product deleted successfully!', 'success');
                this.loadData();
            }
        }
    }

    // Update order status
    updateOrderStatus(orderId, newStatus) {
        const updated = storage.updateOrderStatus(orderId, newStatus);
        if (updated) {
            showNotification('Order status updated!', 'success');
            this.loadData();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Image preview
        document.getElementById('product-image').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('preview-img').src = e.target.result;
                    document.getElementById('image-preview').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Create global instance
const farmerDashboard = new FarmerDashboard();

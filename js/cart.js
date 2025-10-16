// Shopping cart functionality for Crop-Tap
// Handles cart operations and checkout process

class CartService {
    constructor() {
        this.cartItems = [];
        this.init();
    }

    init() {
        this.loadCartItems();
        this.renderCart();
    }

    // Load cart items for current user
    loadCartItems() {
        if (!auth.isLoggedIn()) {
            this.cartItems = [];
            return;
        }

        const user = auth.getCurrentUser();
        this.cartItems = storage.getCartItems(user.user_id);
    }

    // Render cart page
    renderCart() {
        const container = document.getElementById('cart-container');
        if (!container) return;

        if (!auth.isLoggedIn()) {
            container.innerHTML = `
                <div class="text-center">
                    <h3>Please login to view your cart</h3>
                    <a href="login.html" class="btn btn-primary">Login</a>
                </div>
            `;
            return;
        }

        if (this.cartItems.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                    <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }

        const total = this.calculateTotal();
        
        container.innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <h3>Shopping Cart</h3>
                    <div id="cart-items-list">
                        ${this.cartItems.map(item => this.renderCartItem(item)).join('')}
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h5>Order Summary</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>$${total.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Tax:</span>
                                <span>$0.00</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between mb-3">
                                <strong>Total:</strong>
                                <strong class="cart-total">$${total.toFixed(2)}</strong>
                            </div>
                            <button class="btn btn-success w-100" onclick="cartService.proceedToCheckout()">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render individual cart item
    renderCartItem(item) {
        return `
            <div class="cart-item" data-product-id="${item.product_id}">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        ${item.product.image_url ? 
                            `<img src="${item.product.image_url}" class="img-fluid rounded" alt="${item.product.name}" style="height: 60px; object-fit: cover;">` :
                            `<div class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 60px;">
                                <i class="fas fa-image text-muted"></i>
                            </div>`
                        }
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${item.product.name}</h6>
                        <small class="text-muted">$${item.product.price.toFixed(2)} per ${item.product.unit}</small>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary" type="button" onclick="cartService.updateQuantity('${item.product_id}', ${item.quantity - 1})">-</button>
                            <input type="number" class="form-control text-center" value="${item.quantity}" min="1" max="${item.product.quantity}" onchange="cartService.updateQuantity('${item.product_id}', this.value)">
                            <button class="btn btn-outline-secondary" type="button" onclick="cartService.updateQuantity('${item.product_id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <strong>$${(item.product.price * item.quantity).toFixed(2)}</strong>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-outline-danger btn-sm" onclick="cartService.removeItem('${item.product_id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        if (!auth.isLoggedIn()) return;

        const user = auth.getCurrentUser();
        const quantity = parseInt(newQuantity);
        
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        // Check if quantity exceeds available stock
        const product = storage.getProducts().find(p => p.product_id === productId);
        if (product && quantity > product.quantity) {
            showNotification(`Only ${product.quantity} items available`, 'warning');
            return;
        }

        storage.updateCartItemQuantity(user.user_id, productId, quantity);
        this.loadCartItems();
        this.renderCart();
        productService.updateCartCount();
    }

    // Remove item from cart
    removeItem(productId) {
        if (!auth.isLoggedIn()) return;

        const user = auth.getCurrentUser();
        storage.updateCartItemQuantity(user.user_id, productId, 0);
        this.loadCartItems();
        this.renderCart();
        productService.updateCartCount();
        showNotification('Item removed from cart', 'success');
    }

    // Calculate cart total
    calculateTotal() {
        return this.cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (!auth.requireAuth('buyer')) return;

        if (this.cartItems.length === 0) {
            showNotification('Your cart is empty', 'warning');
            return;
        }

        // Create order
        const user = auth.getCurrentUser();
        const order = storage.createOrder(user.user_id, this.cartItems);
        
        // Clear cart
        storage.clearCart(user.user_id);
        
        // Redirect to payment page
        window.location.href = `checkout.html?orderId=${order.order_id}`;
    }

    // Refresh cart (useful after login/logout)
    refresh() {
        this.loadCartItems();
        this.renderCart();
    }
}

// Create global instance
const cartService = new CartService();

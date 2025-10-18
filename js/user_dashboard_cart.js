// User Dashboard Cart Management
// Handles cart operations and checkout

class UserDashboardCart {
    constructor(userDashboard) {
        this.userDashboard = userDashboard;
    }

    addToCart(productId) {
        const result = cartService.addToCart(this.userDashboard.currentUser.user_id, productId, 1);
        
        if (result.success) {
            this.updateCartUI();
            
            // Show brief notification
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Added!';
            btn.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 1000);
        } else {
            alert('Error adding to cart: ' + result.message);
        }
    }

    updateCartUI() {
        const cartItems = cartService.getCartItems(this.userDashboard.currentUser.user_id);
        const cartSummary = cartService.getCartSummary(this.userDashboard.currentUser.user_id);
        
        // Update cart count
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = cartSummary.totalItems;
        }
        
        // Update cart items display
        const cartItemsContainer = document.getElementById('cartItems');
        if (cartItemsContainer) {
            this.renderCartItems(cartItems, cartItemsContainer);
        }
        
        // Update cart summary
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = `₱${cartSummary.totalPrice.toFixed(2)}`;
        }
    }

    renderCartItems(cartItems, container) {
        if (cartItems.length === 0) {
            container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            return;
        }

        container.innerHTML = cartItems.map(item => {
            const product = productService.getProductById(item.product_id);
            if (!product) return '';

            return `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${product.name}</h4>
                        <p>₱${product.price.toFixed(2)} per ${product.unit}</p>
                    </div>
                    <div class="item-controls">
                        <button onclick="userDashboard.cart.updateQuantity('${item.product_id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="userDashboard.cart.updateQuantity('${item.product_id}', ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="userDashboard.cart.removeFromCart('${item.product_id}')">Remove</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const result = cartService.updateCartItem(this.userDashboard.currentUser.user_id, productId, newQuantity);
        if (result.success) {
            this.updateCartUI();
        } else {
            alert('Error updating quantity: ' + result.message);
        }
    }

    removeFromCart(productId) {
        const result = cartService.removeFromCart(this.userDashboard.currentUser.user_id, productId);
        if (result.success) {
            this.updateCartUI();
        } else {
            alert('Error removing from cart: ' + result.message);
        }
    }

    clearCart() {
        const result = cartService.clearCart(this.userDashboard.currentUser.user_id);
        if (result.success) {
            this.updateCartUI();
        } else {
            alert('Error clearing cart: ' + result.message);
        }
    }

    proceedToCheckout() {
        const cartItems = cartService.getCartItems(this.userDashboard.currentUser.user_id);
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Show checkout modal
        this.showCheckoutModal();
    }

    showCheckoutModal() {
        const cartSummary = cartService.getCartSummary(this.userDashboard.currentUser.user_id);
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>Checkout</h2>
                <div class="checkout-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-item">
                        <span>Total Items:</span>
                        <span>${cartSummary.totalItems}</span>
                    </div>
                    <div class="summary-item">
                        <span>Total Price:</span>
                        <span>₱${cartSummary.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                <form id="checkoutForm">
                    <div class="form-group">
                        <label>Delivery Address:</label>
                        <textarea name="address" required>${this.userDashboard.currentUser.address || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Payment Method:</label>
                        <select name="paymentMethod" required>
                            <option value="cash">Cash on Delivery</option>
                            <option value="gcash">GCash</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>
                    <button type="submit">Place Order</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle checkout form submission
        const form = modal.querySelector('#checkoutForm');
        form.addEventListener('submit', (e) => this.handleCheckout(e));
    }

    handleCheckout(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const orderData = {
            user_id: this.userDashboard.currentUser.user_id,
            address: formData.get('address'),
            payment_method: formData.get('paymentMethod'),
            items: cartService.getCartItems(this.userDashboard.currentUser.user_id),
            total: cartService.getCartSummary(this.userDashboard.currentUser.user_id).totalPrice
        };

        const result = this.createOrder(orderData);
        if (result.success) {
            alert('Order placed successfully!');
            this.clearCart();
            e.target.closest('.modal').remove();
            this.userDashboard.orders.renderOrders();
        } else {
            alert('Error placing order: ' + result.message);
        }
    }

    createOrder(orderData) {
        try {
            const orders = storage.getData('orders') || [];
            const newOrder = {
                id: Date.now(),
                ...orderData,
                status: 'pending',
                date: new Date().toISOString()
            };
            
            orders.push(newOrder);
            storage.saveData('orders', orders);
            
            return { success: true, order: newOrder };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

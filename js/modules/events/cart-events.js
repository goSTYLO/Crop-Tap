// Cart Event Handlers
import { cartService } from '../../cart.js';
import { toast } from '../ui/toast.js';
import { modal } from '../ui/modal.js';

export class CartEventHandlers {
    constructor() {
        this.currentUser = null;
        this.setupCartEvents();
    }

    // Set current user (should be called when user logs in)
    setCurrentUser(user) {
        this.currentUser = user;
    }

    // Setup all cart-related events
    setupCartEvents() {
        this.setupAddToCartEvents();
        this.setupCartToggleEvents();
        this.setupQuantityUpdateEvents();
        this.setupCheckoutEvents();
        this.setupCartSidebarEvents();
    }

    // Setup add to cart events
    setupAddToCartEvents() {
        // Global add to cart function
        window.addToCart = (productId) => this.addToCart(productId);
        
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn') || 
                e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                const btn = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
                const productId = btn.dataset.productId || btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (productId) {
                    this.addToCart(productId);
                }
            }
        });
    }

    // Setup cart toggle events
    setupCartToggleEvents() {
        // Global cart toggle function
        window.toggleCart = () => this.toggleCart();
        
        // Cart button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-btn') || 
                e.target.closest('.cart-btn')) {
                e.preventDefault();
                this.toggleCart();
            }
        });
    }

    // Setup quantity update events
    setupQuantityUpdateEvents() {
        // Global quantity update functions
        window.updateQuantity = (productId, newQuantity) => this.updateQuantity(productId, newQuantity);
        window.removeFromCart = (productId) => this.removeFromCart(productId);
        
        // Quantity control buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                e.preventDefault();
                const btn = e.target;
                const productId = btn.dataset.productId;
                const action = btn.dataset.action;
                
                if (productId && action) {
                    this.handleQuantityAction(productId, action);
                }
            }
        });
    }

    // Setup checkout events
    setupCheckoutEvents() {
        // Global checkout function
        window.proceedToCheckout = () => this.proceedToCheckout();
        
        // Checkout form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckout(e));
        }
    }

    // Setup cart sidebar events
    setupCartSidebarEvents() {
        // Click outside to close cart
        document.addEventListener('click', (e) => {
            const cartSidebar = document.getElementById('cartSidebar');
            const cartBtn = document.querySelector('.cart-btn');
            
            if (cartSidebar && cartBtn && 
                !cartSidebar.contains(e.target) && 
                !cartBtn.contains(e.target) && 
                cartSidebar.classList.contains('open')) {
                this.toggleCart();
            }
        });
    }

    // Add item to cart
    addToCart(productId) {
        if (!this.currentUser) {
            toast.error('Error', 'Please log in to add items to your cart.');
            window.location.href = 'login.html';
            return;
        }

        if (this.currentUser.role !== 'consumer') {
            toast.error('Error', 'Only buyers can add items to cart.');
            return;
        }

        const result = cartService.addToCart(this.currentUser.user_id, productId, 1);
        
        if (result.success) {
            this.updateCartUI();
            
            // Show brief notification on button
            const btn = event?.target;
            if (btn && btn.classList.contains('add-to-cart-btn')) {
                const originalText = btn.textContent;
                btn.textContent = 'Added!';
                btn.style.background = '#10b981';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 1000);
            }
            
            toast.success('Added to Cart', 'Product added to your cart successfully!', 2000);
        } else {
            toast.error('Error', result.message);
        }
    }

    // Update cart UI
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItemsList = document.getElementById('cartItemsList');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!this.currentUser) return;
        
        const cartSummary = cartService.getCartSummary(this.currentUser.user_id);
        
        if (cartCount) cartCount.textContent = cartSummary.totalItems;
        if (cartTotal) cartTotal.textContent = `₱${cartSummary.totalAmount.toFixed(2)}`;
        
        if (cartItemsList) {
            if (cartSummary.isEmpty) {
                cartItemsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">Your cart is empty</p>';
            } else {
                cartItemsList.innerHTML = cartSummary.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            ${item.product.image_url ? 
                                `<img src="${item.product.image_url}" alt="${item.product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` :
                                `🌾`
                            }
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.product.name}</div>
                            <div class="cart-item-price">₱${item.product.price.toFixed(2)} / ${item.product.unit}</div>
                            <div class="quantity-control">
                                <button class="qty-btn" data-product-id="${item.product_id}" data-action="decrease">-</button>
                                <input type="number" class="qty-input" value="${item.quantity}" readonly>
                                <button class="qty-btn" data-product-id="${item.product_id}" data-action="increase">+</button>
                                <button class="qty-btn" data-product-id="${item.product_id}" data-action="remove" style="margin-left: auto; color: #ef4444;">✕</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Toggle cart sidebar
    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('open');
        }
    }

    // Handle quantity action
    handleQuantityAction(productId, action) {
        if (!this.currentUser) return;

        let newQuantity;
        const currentItem = cartService.getCartItems(this.currentUser.user_id)
            .find(item => item.product_id === productId);
        
        if (!currentItem) return;

        switch (action) {
            case 'increase':
                newQuantity = currentItem.quantity + 1;
                break;
            case 'decrease':
                newQuantity = Math.max(0, currentItem.quantity - 1);
                break;
            case 'remove':
                newQuantity = 0;
                break;
            default:
                return;
        }

        this.updateQuantity(productId, newQuantity);
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        if (!this.currentUser) return;

        const result = cartService.updateCartItemQuantity(this.currentUser.user_id, productId, newQuantity);
        if (result.success) {
            this.updateCartUI();
        } else {
            toast.error('Error', result.message);
        }
    }

    // Remove item from cart
    removeFromCart(productId) {
        if (!this.currentUser) return;

        const result = cartService.removeFromCart(this.currentUser.user_id, productId);
        if (result.success) {
            this.updateCartUI();
        } else {
            toast.error('Error', result.message);
        }
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (!this.currentUser) return;

        const cartSummary = cartService.getCartSummary(this.currentUser.user_id);
        
        if (cartSummary.isEmpty) {
            toast.error('Error', 'Your cart is empty!');
            return;
        }

        this.toggleCart();
        modal.open('checkoutModal');
    }

    // Handle checkout form submission
    handleCheckout(e) {
        e.preventDefault();
        
        if (!this.currentUser) return;
        
        // Create order
        const result = cartService.createOrderFromCart(this.currentUser.user_id);
        
        if (result.success) {
            toast.success('Order Placed', 'Order placed successfully! You will receive a confirmation email shortly.');
            this.updateCartUI();
            modal.close('checkoutModal');
            
            // Trigger order update event for other components
            document.dispatchEvent(new CustomEvent('orderCreated', { 
                detail: { order: result.order } 
            }));
        } else {
            toast.error('Error', result.message);
        }
    }

    // Get cart item count
    getCartItemCount() {
        if (!this.currentUser) return 0;
        return cartService.getCartItemCount(this.currentUser.user_id);
    }

    // Check if cart is empty
    isCartEmpty() {
        if (!this.currentUser) return true;
        return cartService.isCartEmpty(this.currentUser.user_id);
    }

    // Clear cart
    clearCart() {
        if (!this.currentUser) return;

        const result = cartService.clearCart(this.currentUser.user_id);
        if (result.success) {
            this.updateCartUI();
            toast.success('Success', 'Cart cleared successfully!');
        } else {
            toast.error('Error', result.message);
        }
    }
}

// Create global instance
export const cartEvents = new CartEventHandlers();

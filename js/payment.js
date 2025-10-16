// Payment processing for Crop-Tap
// Handles Stripe integration and order completion

class PaymentService {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.currentOrder = null;
        this.init();
    }

    init() {
        // Initialize Stripe (using test publishable key)
        this.stripe = Stripe('pk_test_51234567890abcdef'); // Replace with your test key
        
        // Create elements
        this.elements = this.stripe.elements();
        this.cardElement = this.elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
            },
        });
    }

    // Load order details for checkout
    loadOrderDetails(orderId) {
        const orders = storage.getOrders();
        const order = orders.find(o => o.order_id === orderId);
        
        if (!order) {
            showNotification('Order not found', 'error');
            window.location.href = 'index.html';
            return;
        }

        this.currentOrder = order;
        this.renderOrderSummary();
        this.setupPaymentForm();
    }

    // Render order summary
    renderOrderSummary() {
        const container = document.getElementById('order-summary');
        if (!container || !this.currentOrder) return;

        const orderItems = storage.getData('order_items').filter(item => 
            item.order_id === this.currentOrder.order_id
        );
        const products = storage.getProducts();

        const orderItemsWithProducts = orderItems.map(item => {
            const product = products.find(p => p.product_id === item.product_id);
            return { ...item, product };
        }).filter(item => item.product);

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5>Order #${this.currentOrder.order_id}</h5>
                    <small class="text-muted">Placed on ${utils.formatDate(this.currentOrder.created_at)}</small>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            ${orderItemsWithProducts.map(item => `
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <strong>${item.product.name}</strong>
                                        <br>
                                        <small class="text-muted">${item.quantity} x $${item.price.toFixed(2)}</small>
                                    </div>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                            <hr>
                            <div class="d-flex justify-content-between">
                                <strong>Total:</strong>
                                <strong class="text-success">$${this.currentOrder.total_amount.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Setup payment form
    setupPaymentForm() {
        const cardElementContainer = document.getElementById('card-element');
        if (cardElementContainer && this.cardElement) {
            this.cardElement.mount(cardElementContainer);
            
            // Handle real-time validation errors from the card Element
            this.cardElement.on('change', ({error}) => {
                const displayError = document.getElementById('card-errors');
                if (error) {
                    displayError.textContent = error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }

        // Handle form submission
        const form = document.getElementById('payment-form');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.processPayment();
            });
        }
    }

    // Process payment
    async processPayment() {
        if (!this.currentOrder) {
            showNotification('No order found', 'error');
            return;
        }

        const submitButton = document.getElementById('submit-payment');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');

        // Show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'inline-block';

        try {
            // For demo purposes, we'll simulate a successful payment
            // In a real application, you would create a PaymentIntent on your server
            const {error, paymentMethod} = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.cardElement,
            });

            if (error) {
                throw new Error(error.message);
            }

            // Simulate payment processing
            await this.simulatePaymentProcessing(paymentMethod);

            // Update order status
            storage.updateOrderStatus(this.currentOrder.order_id, 'paid');
            
            // Create payment record
            storage.createPayment(this.currentOrder.order_id, {
                amount: this.currentOrder.total_amount,
                status: 'completed',
                payment_method: 'card',
                transaction_id: paymentMethod.id
            });

            showNotification('Payment successful! Your order has been placed.', 'success');
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = `order-confirmation.html?orderId=${this.currentOrder.order_id}`;
            }, 2000);

        } catch (error) {
            console.error('Payment error:', error);
            showNotification(error.message || 'Payment failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    }

    // Simulate payment processing (for demo)
    async simulatePaymentProcessing(paymentMethod) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve(paymentMethod);
                } else {
                    reject(new Error('Payment was declined. Please try a different card.'));
                }
            }, 2000);
        });
    }

    // Get payment history for user
    getPaymentHistory(userId) {
        const payments = storage.getData('payments') || [];
        const orders = storage.getOrders();
        
        // Get orders for this user
        const userOrders = orders.filter(order => order.buyer_id === userId);
        const userOrderIds = userOrders.map(order => order.order_id);
        
        // Get payments for user's orders
        return payments.filter(payment => userOrderIds.includes(payment.order_id));
    }
}

// Create global instance
const paymentService = new PaymentService();

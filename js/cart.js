// Cart Service for Crop-Tap
// Handles shopping cart functionality

class CartService {
    constructor() {
        this.storage = storage; // Use the global storage instance
        this.productService = productService; // Use the global product service
    }

    // Add item to cart
    addToCart(userId, productId, quantity = 1) {
        try {
            // Check if user is logged in
            if (!userId) {
                return {
                    success: false,
                    message: 'Please log in to add items to your cart.'
                };
            }

            // Check if product exists
            const product = this.productService.getProductById(productId);
            if (!product) {
                return {
                    success: false,
                    message: 'Product not found.'
                };
            }

            // Check if product is available
            if (product.quantity < quantity) {
                return {
                    success: false,
                    message: `Only ${product.quantity} items available.`
                };
            }

            // Add to cart
            const success = this.storage.addToCart(userId, productId, quantity);
            
            if (success) {
                return {
                    success: true,
                    message: 'Item added to cart successfully!',
                    cartItem: {
                        product: product,
                        quantity: quantity
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to add item to cart.'
                };
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            return {
                success: false,
                message: 'Failed to add item to cart. Please try again.'
            };
        }
    }

    // Get cart items for user
    getCartItems(userId) {
        try {
            if (!userId) {
                return [];
            }

            return this.storage.getCartItems(userId);
        } catch (error) {
            console.error('Get cart items error:', error);
            return [];
        }
    }

    // Update cart item quantity
    updateCartItemQuantity(userId, productId, quantity) {
        try {
            if (!userId) {
                return {
                    success: false,
                    message: 'Please log in to update your cart.'
                };
            }

            if (quantity < 0) {
                return {
                    success: false,
                    message: 'Quantity cannot be negative.'
                };
            }

            // Check product availability if increasing quantity
            if (quantity > 0) {
                const product = this.productService.getProductById(productId);
                if (!product) {
                    return {
                        success: false,
                        message: 'Product not found.'
                    };
                }

                if (product.quantity < quantity) {
                    return {
                        success: false,
                        message: `Only ${product.quantity} items available.`
                    };
                }
            }

            const success = this.storage.updateCartItemQuantity(userId, productId, quantity);
            
            if (success) {
                const message = quantity === 0 ? 'Item removed from cart.' : 'Cart updated successfully!';
                return {
                    success: true,
                    message: message
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to update cart item.'
                };
            }
        } catch (error) {
            console.error('Update cart item error:', error);
            return {
                success: false,
                message: 'Failed to update cart item. Please try again.'
            };
        }
    }

    // Remove item from cart
    removeFromCart(userId, productId) {
        return this.updateCartItemQuantity(userId, productId, 0);
    }

    // Clear entire cart
    clearCart(userId) {
        try {
            if (!userId) {
                return {
                    success: false,
                    message: 'Please log in to clear your cart.'
                };
            }

            const success = this.storage.clearCart(userId);
            
            if (success) {
                return {
                    success: true,
                    message: 'Cart cleared successfully!'
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to clear cart.'
                };
            }
        } catch (error) {
            console.error('Clear cart error:', error);
            return {
                success: false,
                message: 'Failed to clear cart. Please try again.'
            };
        }
    }

    // Get cart summary
    getCartSummary(userId) {
        try {
            const cartItems = this.getCartItems(userId);
            
            let totalItems = 0;
            let totalAmount = 0;
            
            cartItems.forEach(item => {
                totalItems += item.quantity;
                totalAmount += item.product.price * item.quantity;
            });

            return {
                items: cartItems,
                totalItems: totalItems,
                totalAmount: totalAmount,
                isEmpty: cartItems.length === 0
            };
        } catch (error) {
            console.error('Get cart summary error:', error);
            return {
                items: [],
                totalItems: 0,
                totalAmount: 0,
                isEmpty: true
            };
        }
    }

    // Check if cart is empty
    isCartEmpty(userId) {
        const cartItems = this.getCartItems(userId);
        return cartItems.length === 0;
    }

    // Get cart item count
    getCartItemCount(userId) {
        const summary = this.getCartSummary(userId);
        return summary.totalItems;
    }

    // Validate cart before checkout
    validateCart(userId) {
        try {
            const cartItems = this.getCartItems(userId);
            
            if (cartItems.length === 0) {
                return {
                    isValid: false,
                    message: 'Your cart is empty.'
                };
            }

            // Check if all products are still available
            for (const item of cartItems) {
                const product = this.productService.getProductById(item.product_id);
                
                if (!product) {
                    return {
                        isValid: false,
                        message: `Product "${item.product.name}" is no longer available.`
                    };
                }

                if (product.quantity < item.quantity) {
                    return {
                        isValid: false,
                        message: `Only ${product.quantity} items available for "${product.name}".`
                    };
                }
            }

            return {
                isValid: true,
                message: 'Cart is valid for checkout.'
            };
        } catch (error) {
            console.error('Validate cart error:', error);
            return {
                isValid: false,
                message: 'Failed to validate cart.'
            };
        }
    }

    // Create order from cart
    createOrderFromCart(userId) {
        try {
            // Validate cart first
            const validation = this.validateCart(userId);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.message
                };
            }

            const cartItems = this.getCartItems(userId);
            
            // Create order
            const order = this.storage.createOrder(userId, cartItems);
            
            if (order) {
                // Clear cart after successful order creation
                this.clearCart(userId);
                
                return {
                    success: true,
                    message: 'Order created successfully!',
                    order: order
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to create order.'
                };
            }
        } catch (error) {
            console.error('Create order error:', error);
            return {
                success: false,
                message: 'Failed to create order. Please try again.'
            };
        }
    }
}

// Create global instance
const cartService = new CartService();

// Export for ES6 modules
export default cartService;
// localStorage Service for Crop-Tap
// Simple data management for the frontend-only application

class StorageService {
    constructor() {
        this.initializeStorage();
    }

    // Initialize localStorage with empty arrays if they don't exist
    initializeStorage() {
        const defaultData = {
            users: [
                {
                    id: 1,
                    name: "Juan Dela Cruz",
                    email: "juan@example.com",
                    password: "password123",
                    role: "consumer",
                    phone: "09123456789",
                    address: "123 Main St, Manila",
                    avatar_url: null
                },
                {
                    id: 2,
                    name: "Maria Santos",
                    email: "maria@example.com",
                    password: "password123",
                    role: "farmer",
                    phone: "09876543210",
                    address: "456 Farm Road, Laguna",
                    avatar_url: null
                }
            ],
            products: [],
            carts: [],
            cart_items: [],
            orders: [],
            order_items: [],
            payments: []
            // Note: session is now handled by sessionStorage, not localStorage
        };

        Object.keys(defaultData).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(defaultData[key]));
            }
        });
        
        // Clean up any old session data from localStorage
        if (localStorage.getItem('session')) {
            localStorage.removeItem('session');
        }
    }

    // Reset storage with default test users (useful for testing)
    resetToDefaults() {
        const defaultData = {
            users: [
                {
                    id: 1,
                    name: "Juan Dela Cruz",
                    email: "juan@example.com",
                    password: "password123",
                    role: "consumer",
                    phone: "09123456789",
                    address: "123 Main St, Manila",
                    avatar_url: null
                },
                {
                    id: 2,
                    name: "Maria Santos",
                    email: "maria@example.com",
                    password: "password123",
                    role: "farmer",
                    phone: "09876543210",
                    address: "456 Farm Road, Laguna",
                    avatar_url: null
                }
            ],
            products: [],
            carts: [],
            cart_items: [],
            orders: [],
            order_items: [],
            payments: []
        };

        Object.keys(defaultData).forEach(key => {
            localStorage.setItem(key, JSON.stringify(defaultData[key]));
        });
        
        // Clear session
        sessionStorage.clear();
        
        console.log('Storage reset to defaults with test users');
    }

    // Generic get data method
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting data for key ${key}:`, error);
            return null;
        }
    }

    // Generic save data method
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving data for key ${key}:`, error);
            return false;
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // User management
    createUser(userData) {
        const users = this.getData('users') || [];
        const newUser = {
            user_id: this.generateId(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // Simple storage - in real app, hash this
            role: userData.role,
            phone: userData.phone || null,
            address: userData.address || null,
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        this.saveData('users', users);
        return newUser;
    }

    getUserByEmail(email) {
        const users = this.getData('users') || [];
        return users.find(user => user.email === email);
    }

    getUserById(userId) {
        const users = this.getData('users') || [];
        return users.find(user => user.user_id === userId);
    }

    // Product management
    createProduct(productData) {
        const products = this.getData('products') || [];
        const newProduct = {
            product_id: this.generateId(),
            farmer_id: productData.farmer_id,
            name: productData.name,
            description: productData.description,
            price: parseFloat(productData.price),
            unit: productData.unit || 'piece',
            quantity: parseInt(productData.quantity),
            image_url: productData.image_url || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        products.push(newProduct);
        this.saveData('products', products);
        return newProduct;
    }

    getProducts() {
        return this.getData('products') || [];
    }

    getProductsByFarmer(farmerId) {
        const products = this.getProducts();
        return products.filter(product => product.farmer_id === farmerId);
    }

    updateProduct(productId, updateData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.product_id === productId);
        
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...updateData,
                updated_at: new Date().toISOString()
            };
            this.saveData('products', products);
            return products[index];
        }
        return null;
    }

    deleteProduct(productId) {
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.product_id !== productId);
        this.saveData('products', filteredProducts);
        return true;
    }

    // Cart management
    getOrCreateCart(userId) {
        const carts = this.getData('carts') || [];
        let cart = carts.find(c => c.buyer_id === userId);
        
        if (!cart) {
            cart = {
                cart_id: this.generateId(),
                buyer_id: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            carts.push(cart);
            this.saveData('carts', carts);
        }
        
        return cart;
    }

    addToCart(userId, productId, quantity = 1) {
        const cart = this.getOrCreateCart(userId);
        const cartItems = this.getData('cart_items') || [];
        
        // Check if item already exists in cart
        const existingItem = cartItems.find(item => 
            item.cart_id === cart.cart_id && item.product_id === productId
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const newItem = {
                cart_item_id: this.generateId(),
                cart_id: cart.cart_id,
                product_id: productId,
                quantity: quantity,
                created_at: new Date().toISOString()
            };
            cartItems.push(newItem);
        }
        
        this.saveData('cart_items', cartItems);
        return true;
    }

    getCartItems(userId) {
        const cart = this.getOrCreateCart(userId);
        const cartItems = this.getData('cart_items') || [];
        const products = this.getProducts();
        
        return cartItems
            .filter(item => item.cart_id === cart.cart_id)
            .map(item => {
                const product = products.find(p => p.product_id === item.product_id);
                return {
                    ...item,
                    product: product
                };
            })
            .filter(item => item.product); // Only return items with valid products
    }

    updateCartItemQuantity(userId, productId, quantity) {
        const cart = this.getOrCreateCart(userId);
        const cartItems = this.getData('cart_items') || [];
        const item = cartItems.find(item => 
            item.cart_id === cart.cart_id && item.product_id === productId
        );
        
        if (item) {
            if (quantity <= 0) {
                // Remove item
                const filteredItems = cartItems.filter(i => i.cart_item_id !== item.cart_item_id);
                this.saveData('cart_items', filteredItems);
            } else {
                item.quantity = quantity;
                this.saveData('cart_items', cartItems);
            }
            return true;
        }
        return false;
    }

    clearCart(userId) {
        const cart = this.getOrCreateCart(userId);
        const cartItems = this.getData('cart_items') || [];
        const filteredItems = cartItems.filter(item => item.cart_id !== cart.cart_id);
        this.saveData('cart_items', filteredItems);
        return true;
    }

    // Order management
    createOrder(userId, cartItems) {
        const orders = this.getData('orders') || [];
        const orderItems = this.getData('order_items') || [];
        
        const order = {
            order_id: this.generateId(),
            buyer_id: userId,
            total_amount: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
            status: 'pending_payment',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        orders.push(order);
        
        // Create order items
        cartItems.forEach(cartItem => {
            const orderItem = {
                order_item_id: this.generateId(),
                order_id: order.order_id,
                product_id: cartItem.product_id,
                farmer_id: cartItem.product.farmer_id,
                quantity: cartItem.quantity,
                price: cartItem.product.price,
                created_at: new Date().toISOString()
            };
            orderItems.push(orderItem);
        });
        
        this.saveData('orders', orders);
        this.saveData('order_items', orderItems);
        
        return order;
    }

    getOrders() {
        return this.getData('orders') || [];
    }

    getOrdersByBuyer(buyerId) {
        const orders = this.getOrders();
        return orders.filter(order => order.buyer_id === buyerId);
    }

    getOrdersByFarmer(farmerId) {
        const orders = this.getOrders();
        const orderItems = this.getData('order_items') || [];
        
        // Get order IDs that contain products from this farmer
        const farmerOrderIds = orderItems
            .filter(item => item.farmer_id === farmerId)
            .map(item => item.order_id);
        
        return orders.filter(order => farmerOrderIds.includes(order.order_id));
    }

    updateOrderStatus(orderId, status) {
        const orders = this.getOrders();
        const order = orders.find(o => o.order_id === orderId);
        
        if (order) {
            order.status = status;
            order.updated_at = new Date().toISOString();
            this.saveData('orders', orders);
            return order;
        }
        return null;
    }

    // Payment management
    createPayment(orderId, paymentData) {
        const payments = this.getData('payments') || [];
        const payment = {
            payment_id: this.generateId(),
            order_id: orderId,
            amount: paymentData.amount,
            status: paymentData.status,
            payment_method: paymentData.payment_method || 'stripe',
            transaction_id: paymentData.transaction_id,
            created_at: new Date().toISOString()
        };
        
        payments.push(payment);
        this.saveData('payments', payments);
        return payment;
    }

    // Session management (using sessionStorage for auto-logout on browser close)
    setSession(user) {
        const session = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            avatar_url: user.avatar_url,
            login_time: new Date().toISOString()
        };
        // Use sessionStorage instead of localStorage for session data
        try {
            sessionStorage.setItem('session', JSON.stringify(session));
        } catch (error) {
            console.error('Error saving session:', error);
        }
        return session;
    }

    getSession() {
        try {
            const data = sessionStorage.getItem('session');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    }

    clearSession() {
        try {
            sessionStorage.removeItem('session');
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    }

    isLoggedIn() {
        return this.getSession() !== null;
    }

    getCurrentUser() {
        const session = this.getSession();
        if (session) {
            // Return the full user data from users array, not just session data
            const fullUser = this.getUserById(session.user_id);
            return fullUser || session; // Fallback to session if user not found
        }
        return null;
    }
}

// Create global instance
const storage = new StorageService();
console.log('Storage service initialized successfully');
// Make storage globally available
window.storage = storage;

// Export for ES6 modules
export default storage;
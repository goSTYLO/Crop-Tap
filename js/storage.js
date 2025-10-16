// localStorage Service for Crop-Tap
// Simple data management for the frontend-only application

class StorageService {
    constructor() {
        this.initializeStorage();
    }

    // Initialize localStorage with empty arrays if they don't exist
    initializeStorage() {
        const defaultData = {
            users: [],
            products: [],
            carts: [],
            cart_items: [],
            orders: [],
            order_items: [],
            payments: [],
            session: null
        };

        Object.keys(defaultData).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(defaultData[key]));
            }
        });
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

    // Session management
    setSession(user) {
        const session = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            login_time: new Date().toISOString()
        };
        this.saveData('session', session);
        return session;
    }

    getSession() {
        return this.getData('session');
    }

    clearSession() {
        this.saveData('session', null);
    }

    isLoggedIn() {
        return this.getSession() !== null;
    }

    getCurrentUser() {
        const session = this.getSession();
        if (session) {
            return this.getUserById(session.user_id);
        }
        return null;
    }
}

// Create global instance
const storage = new StorageService();

 // Sample Data
 const products = [
    { id: 1, name: 'Organic Tomatoes', price: 85, unit: 'kg', stock: 50, category: 'vegetables', emoji: '🍅', description: 'Fresh organic tomatoes from local farms' },
    { id: 2, name: 'Sweet Corn', price: 120, unit: 'kg', stock: 30, category: 'vegetables', emoji: '🌽', description: 'Sweet and tender corn kernels' },
    { id: 3, name: 'Fresh Lettuce', price: 65, unit: 'head', stock: 45, category: 'vegetables', emoji: '🥬', description: 'Crisp and fresh lettuce heads' },
    { id: 4, name: 'Red Onions', price: 95, unit: 'kg', stock: 60, category: 'vegetables', emoji: '🧅', description: 'Pungent red onions perfect for cooking' },
    { id: 5, name: 'Carrots', price: 70, unit: 'kg', stock: 55, category: 'vegetables', emoji: '🥕', description: 'Fresh carrots rich in vitamins' },
    { id: 6, name: 'Ripe Bananas', price: 50, unit: 'dozen', stock: 80, category: 'fruits', emoji: '🍌', description: 'Sweet ripe bananas' },
    { id: 7, name: 'Rice', price: 45, unit: 'kg', stock: 200, category: 'grains', emoji: '🌾', description: 'Premium white rice' },
    { id: 8, name: 'Fresh Basil', price: 35, unit: 'bunch', stock: 25, category: 'herbs', emoji: '🌿', description: 'Aromatic basil leaves' }
];

const orders = [
    { id: 'ORD-001', date: '2025-10-15', items: ['Tomatoes (2kg)', 'Lettuce (3 heads)'], total: 365, status: 'delivered' },
    { id: 'ORD-002', date: '2025-10-14', items: ['Rice (5kg)', 'Onions (1kg)'], total: 320, status: 'transit' },
    { id: 'ORD-003', date: '2025-10-13', items: ['Bananas (2 dozen)', 'Carrots (3kg)'], total: 310, status: 'confirmed' },
    { id: 'ORD-004', date: '2025-10-12', items: ['Sweet Corn (2kg)'], total: 240, status: 'pending' }
];

let cart = [];
let currentFilter = 'all';

// Initialize
function init() {
    renderProducts('featuredProducts', products.slice(0, 4));
    renderProducts('allProducts', products);
    renderOrders();
    updateCartUI();
}

// Render Products
function renderProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    container.innerHTML = productList.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <span>${product.emoji}</span>
                <span class="stock-badge">${product.stock} in stock</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <div>
                        <div class="product-price">₱${product.price}</div>
                        <div class="product-unit">per ${product.unit}</div>
                    </div>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Products
function filterProducts(category) {
    currentFilter = category;
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    renderProducts('allProducts', filtered);
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    
    // Show brief notification
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.background = '#10b981';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1000);
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `₱${totalPrice.toFixed(2)}`;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">Your cart is empty</p>';
    } else {
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.emoji}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₱${item.price} / ${item.unit}</div>
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="qty-btn" onclick="removeFromCart(${item.id})" style="margin-left: auto; color: #ef4444;">✕</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Toggle Cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// Show Product Detail
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('productModal');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductContent = document.getElementById('modalProductContent');
    
    modalProductName.textContent = product.name;
    modalProductContent.innerHTML = `
        <div style="text-align: center; font-size: 5rem; margin: 2rem 0;">
            ${product.emoji}
        </div>
        <p style="margin-bottom: 1rem;"><strong>Price:</strong> ₱${product.price} per ${product.unit}</p>
        <p style="margin-bottom: 1rem;"><strong>Available Stock:</strong> ${product.stock} ${product.unit}</p>
        <p style="margin-bottom: 1rem;"><strong>Category:</strong> ${product.category}</p>
        <p style="margin-bottom: 1.5rem;">${product.description}</p>
        <button class="btn-primary" onclick="addToCart(${product.id}); closeModal('productModal')">Add to Cart</button>
    `;
    
    modal.classList.add('open');
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
}

// Proceed to Checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    toggleCart();
    document.getElementById('checkoutModal').classList.add('open');
}

// Handle Checkout Form
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate order placement
    alert('Order placed successfully! You will receive a confirmation email shortly.');
    
    // Clear cart
    cart = [];
    updateCartUI();
    
    // Close modal
    closeModal('checkoutModal');
    
    // Show orders section
    showSection('orders');
});

// Render Orders
function renderOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #6b7280;">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">${order.id}</div>
                    <div style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">${order.date}</div>
                </div>
                <span class="status-badge status-${order.status}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span class="order-total">₱${order.total}</span>
                <button class="btn-primary" onclick="trackOrder('${order.id}')">Track Order</button>
            </div>
        </div>
    `).join('');
}

// Track Order
function trackOrder(orderId) {
    alert(`Tracking order ${orderId}. This will integrate with your delivery tracking system.`);
}

// Show Section
function showSection(section) {
    // Hide all sections
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('ordersSection').style.display = 'none';
    document.getElementById('profileSection').style.display = 'none';
    
    // Show selected section
    if (section === 'home') {
        document.getElementById('homeSection').style.display = 'block';
    } else if (section === 'products') {
        document.getElementById('productsSection').style.display = 'block';
    } else if (section === 'orders') {
        document.getElementById('ordersSection').style.display = 'block';
    } else if (section === 'profile') {
        document.getElementById('profileSection').style.display = 'block';
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event?.target?.classList.add('active');
}

// Show Profile
function showProfile() {
    showSection('profile');
}

// Toggle Mobile Navigation
function toggleMobileNav() {
    document.getElementById('navMenu').classList.toggle('open');
}

// Search Functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    
    if (document.getElementById('productsSection').style.display !== 'none') {
        renderProducts('allProducts', filtered);
    }
});

// Click outside to close cart
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBtn = document.querySelector('.cart-btn');
    
    if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target) && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});

// Click outside to close modals
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });
});

// Initialize app
init();
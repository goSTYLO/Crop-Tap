// Current user and data
let currentUser = null;
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isLoggedIn() || !auth.isBuyer()) {
        alert('Access denied. Buyers only.');
        window.location.href = '../HTML/landing_page.html';
        return;
    }
    
    currentUser = auth.getCurrentUser();
    init();
});

function init() {
    loadProducts();
    renderOrders();
    updateCartUI();
    updateUserInfo();
    setupConsumerProfileImage();
}

// Load products from localStorage
function loadProducts() {
    const products = productService.getAllProducts();
    const availableProducts = products.filter(p => p.quantity > 0);
    
    // Render featured products (first 4)
    renderProducts('featuredProducts', availableProducts.slice(0, 4));
    // Render all products
    renderProducts('allProducts', availableProducts);
}

// Render Products
function renderProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (productList.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>No products available</h3>
                <p>Check back later for fresh products from our farmers!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productList.map(product => `
        <div class="product-card" onclick="showProductDetail('${product.product_id}')">
            <div class="product-image" style="background: linear-gradient(135deg, #4a7c2c 0%, #6ba83d 100%);">
                ${product.image_url ? 
                    `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<span>🌾</span>`
                }
                <span class="stock-badge">${product.quantity} in stock</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <div>
                        <div class="product-price">₱${product.price.toFixed(2)}</div>
                        <div class="product-unit">per ${product.unit}</div>
                    </div>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${product.product_id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Products
function filterProducts(category) {
    currentFilter = category;
    const allProducts = productService.getAllProducts().filter(p => p.quantity > 0);
    const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
    renderProducts('allProducts', filtered);
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Add to Cart
function addToCart(productId) {
    const result = cartService.addToCart(currentUser.user_id, productId, 1);
    
    if (result.success) {
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
    } else {
        alert(result.message);
    }
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!currentUser) return;
    
    const cartSummary = cartService.getCartSummary(currentUser.user_id);
    
    cartCount.textContent = cartSummary.totalItems;
    cartTotal.textContent = `₱${cartSummary.totalAmount.toFixed(2)}`;
    
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
                        <button class="qty-btn" onclick="updateQuantity('${item.product_id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="updateQuantity('${item.product_id}', ${item.quantity + 1})">+</button>
                        <button class="qty-btn" onclick="removeFromCart('${item.product_id}')" style="margin-left: auto; color: #ef4444;">✕</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Update Quantity
function updateQuantity(productId, newQuantity) {
    const result = cartService.updateCartItemQuantity(currentUser.user_id, productId, newQuantity);
    if (result.success) {
        updateCartUI();
    } else {
        alert(result.message);
    }
}

// Remove from Cart
function removeFromCart(productId) {
    const result = cartService.removeFromCart(currentUser.user_id, productId);
    if (result.success) {
        updateCartUI();
    } else {
        alert(result.message);
    }
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
    if (!ordersList) return;
    
    const buyerOrders = storage.getOrdersByBuyer(currentUser.user_id);
    const orderItems = storage.getData('order_items') || [];
    const allProducts = productService.getAllProducts();
    
    if (buyerOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #6b7280;">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = buyerOrders.map(order => {
        const items = orderItems.filter(item => item.order_id === order.order_id);
        const productNames = items.map(item => {
            const product = allProducts.find(p => p.product_id === item.product_id);
            return product ? `${item.quantity} x ${product.name}` : 'Unknown Product';
        });
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">#${order.order_id}</div>
                        <div style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">${new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <span class="status-badge status-${order.status}">
                        ${order.status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
                <div class="order-items">
                    ${productNames.map(item => `
                        <div class="order-item">
                            <span>${item}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <span class="order-total">₱${order.total_amount.toFixed(2)}</span>
                    <button class="btn-primary" onclick="trackOrder('${order.order_id}')">Track Order</button>
                </div>
            </div>
        `;
    }).join('');
}

// Update User Info
function updateUserInfo() {
    const headerAvatar = document.getElementById('headerAvatar');
    if (headerAvatar) {
        if (currentUser && currentUser.avatar_url) {
            headerAvatar.src = currentUser.avatar_url;
            headerAvatar.style.display = 'inline-block';
        } else {
            headerAvatar.style.display = 'none';
        }
    }
}

// Profile image upload + preview for consumer
function setupConsumerProfileImage() {
    const fileInput = document.getElementById('consumerProfileImage');
    const preview = document.getElementById('consumerProfileImagePreview');
    if (!fileInput || !preview) return;

    // Load existing avatar if present
    if (currentUser && currentUser.avatar_url) {
        preview.src = currentUser.avatar_url;
        preview.style.display = 'inline-block';
    }

    fileInput.addEventListener('change', function() {
        const file = this.files && this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    });

    const form = document.getElementById('consumerProfileForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const updated = {
                name: document.querySelector('#profileSection input[type="text"]').value,
                email: document.querySelector('#profileSection input[type="email"]').value,
                phone: document.querySelector('#profileSection input[type="tel"]').value,
                address: document.querySelector('#profileSection textarea').value
            };

            const file = fileInput.files && fileInput.files[0];
            if (file) {
                const r = new FileReader();
                r.onload = () => {
                    updated.avatar_url = r.result; // base64 data URL
                    saveConsumerProfile(updated);
                };
                r.readAsDataURL(file);
            } else {
                saveConsumerProfile(updated);
            }
        });
    }
}

function saveConsumerProfile(updateData) {
    const result = auth.updateProfile(currentUser.user_id, updateData);
    if (result.success) {
        currentUser = result.user;
        showNotification('Profile updated successfully!', 'success');
    } else {
        showNotification(result.message, 'error');
    }
}

// Track Order
function trackOrder(orderId) {
    alert(`Tracking order ${orderId}. This will integrate with your delivery tracking system.`);
}

// Checkout
function checkout() {
    if (!currentUser) return;
    
    const cartSummary = cartService.getCartSummary(currentUser.user_id);
    
    if (cartSummary.isEmpty) {
        alert('Your cart is empty!');
        return;
    }
    
    // Validate cart before checkout
    const validation = cartService.validateCart(currentUser.user_id);
    if (!validation.isValid) {
        alert(validation.message);
        return;
    }
    
    // Create order
    const result = cartService.createOrderFromCart(currentUser.user_id);
    
    if (result.success) {
        alert('Order placed successfully!');
        updateCartUI();
        renderOrders();
        closeModal('checkoutModal');
    } else {
        alert(result.message);
    }
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

// Export user data function
function exportUserData() {
    try {
        const result = dataManager.downloadData();
        if (result.success) {
            showNotification('Your data has been exported successfully!', 'success');
        } else {
            showNotification('Failed to export data: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting data', 'error');
    }
}

// Initialize app
init();
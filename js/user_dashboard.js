// Current user and data
let currentUser = null;
let currentFilter = 'all';
let currentProductForCart = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isLoggedIn() || !auth.isBuyer()) {
        alert('Access denied. Buyers only.');
        window.location.href = 'index.html';
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
    updateSubscriptionStatus();
    loadSubscriptionDetails();
    setupConsumerProfileImage();
    loadConsumerProfileData();
    updateWelcomeMessage();
    updateDashboardStats();
    setupDashboardInteractions();
}

// Global refresh functions for TabSync
window.refreshProducts = function() {
    console.log('🔄 refreshProducts called in user dashboard - reloading product display');
    loadProducts();
};

window.refreshOrderHistory = function() {
    renderOrders();
    updateDashboardStats();
};

window.refreshCart = function() {
    updateCartUI();
};

window.updateCartBadge = function() {
    updateCartUI();
};

// Load products from localStorage
function loadProducts() {
    const products = productService.getAllProducts();
    // Show all products, not just available ones - let the UI handle out-of-stock display
    const allProducts = products; // Don't filter by quantity
    console.log('🔄 loadProducts called in user dashboard - refreshing product display with', allProducts.length, 'total products');
    
    // Debug: Log products and their categories
    console.log('All products loaded:', products.length);
    console.log('Available products:', products.filter(p => p.quantity > 0).length);
    console.log('Out of stock products:', products.filter(p => p.quantity === 0).length);
    console.log('Product categories:', [...new Set(products.map(p => p.category))]);
    
    // Render featured products (first 5 available)
    const availableProducts = products.filter(p => p.quantity > 0);
    renderProducts('featuredProducts', availableProducts.slice(0, 5));
    // Render all products (including out of stock)
    renderProducts('allProducts', allProducts);
}

// Render Products
function renderProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.log(`❌ Container ${containerId} not found - cannot render products`);
        return;
    }
    console.log(`🔄 Rendering ${productList.length} products in container ${containerId}`);

    if (productList.length === 0) {
        container.innerHTML = `<div class="no-products" data-i18n-dynamic="no_products"></div>`;
        translateDynamicText(); // Translate immediately
        return;
    }

    // Debug: Log first product details to see if data is fresh
    if (productList.length > 0) {
        console.log('🔄 First product data:', {
            name: productList[0].name,
            quantity: productList[0].quantity,
            is_available: productList[0].is_available,
            updated_at: productList[0].updated_at
        });
    }

    container.innerHTML = productList.map(product => {
        const imageSrc = product.image_url; // Direct use since it's Base64
        
        console.log(`🖼️ User Dashboard - Product: ${product.name}, Image URL: ${product.image_url ? 'Base64 data' : 'null'}`);
        
        return `
        <div class="product-card">
            <div class="product-image" style="background: linear-gradient(135deg, #4a7c2c 0%, #6ba83d 100%);">
                ${product.image_url ? 
                    `<img src="${imageSrc}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="console.error('Failed to load image:', this.src); this.style.display='none'; this.nextElementSibling.style.display='inline';"><span style="display:none;">🌾</span>` :
                    `<span>🌾</span>`
                }
                <span class="stock-badge ${product.is_available === false ? 'out-of-stock' : ''}">
                    ${product.is_available === false ? 'No Stock' : `${product.quantity} in stock`}
                </span>
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
                <button class="add-to-cart-btn ${product.is_available === false ? 'disabled' : ''}" 
                    onclick="${product.is_available === false ? 'showOutOfStockMessage()' : `addToCart('${product.product_id}')`}"
                    ${product.is_available === false ? 'disabled' : ''}>
                    ${product.is_available === false ? 'No Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>`;
    }).join('');

    translateDynamicText(); // Translate dynamic content
}

// Filter Products
function filterProducts(category, event) {
    console.log('Filtering products by category:', category);
    currentFilter = category;
    const allProducts = productService.getAllProducts().filter(p => p.quantity > 0 && p.is_available !== false);
    const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
    
    console.log('Total products:', allProducts.length);
    console.log('Filtered products:', filtered.length);
    console.log('Products in category "' + category + '":', filtered.map(p => p.name));
    
    renderProducts('allProducts', filtered);
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Fallback: find button by category
        const targetButton = document.querySelector(`[onclick*="filterProducts('${category}')"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
    }
}

// Show Quantity Modal
function showQuantityModal(productId) {
    const product = productService.getProductById(productId);
    if (!product) {
        showToast('Error', 'Product not found', 'error');
        return;
    }
    
    currentProductForCart = product;
    
    const modalContent = document.getElementById('quantityModalContent');
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">
                ${product.image_url ? 
                    `<img src="${product.image_url}" alt="${product.name}" style="max-width: 100px; height: auto; border-radius: 8px;">` :
                    '🌾'
                }
            </div>
            <h3 style="margin-bottom: 0.5rem;">${product.name}</h3>
            <p style="color: #6b7280; margin-bottom: 1rem;">${product.description}</p>
            <p style="font-size: 1.25rem; font-weight: 600; color: #059669;">₱${product.price.toFixed(2)} per ${product.unit}</p>
            <p style="color: #6b7280; font-size: 0.875rem;">Available: ${product.quantity} ${product.unit}</p>
        </div>
        
        <div class="form-group">
            <label class="form-label">Quantity</label>
            <div style="display: flex; align-items: center; gap: 1rem; justify-content: center;">
                <button id="decreaseBtn" class="qty-btn" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #d1d5db; background: white; font-size: 1.25rem; cursor: pointer;">-</button>
                <input type="number" id="quantityInput" class="form-input" value="1" min="1" max="${product.quantity}" style="width: 80px; text-align: center;">
                <button id="increaseBtn" class="qty-btn" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #d1d5db; background: white; font-size: 1.25rem; cursor: pointer;">+</button>
            </div>
        </div>
        
        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
            <button id="addToCartBtn" class="btn-primary" style="flex: 1;">Add to Cart</button>
            <button id="cancelBtn" class="btn-secondary" style="flex: 1; border: 2px solid #d1d5db; background: white; color: #374151;">Cancel</button>
        </div>
    `;
    
    // Add event listeners after the HTML is inserted
    setTimeout(() => {
        document.getElementById('decreaseBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            adjustQuantity(-1);
        });
        
        document.getElementById('increaseBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            adjustQuantity(1);
        });
        
        document.getElementById('addToCartBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            addToCartWithQuantity();
        });
        
        document.getElementById('cancelBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal('quantityModal');
        });
        
        // Enable typing in quantity input
        document.getElementById('quantityInput').addEventListener('input', (e) => {
            e.stopPropagation();
            const value = parseInt(e.target.value) || 1;
            const maxValue = currentProductForCart.quantity;
            if (value > maxValue) {
                e.target.value = maxValue;
            } else if (value < 1) {
                e.target.value = 1;
            }
        });
    }, 10);
    
    document.getElementById('quantityModal').classList.add('open');
}

// Adjust quantity in modal
function adjustQuantity(change) {
    const input = document.getElementById('quantityInput');
    const currentValue = parseInt(input.value) || 1;
    const newValue = Math.max(1, Math.min(currentProductForCart.quantity, currentValue + change));
    input.value = newValue;
}

// Add to cart with specified quantity
function addToCartWithQuantity() {
    const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
    
    if (quantity < 1) {
        showToast('Error', 'Please enter a valid quantity', 'error');
        return;
    }
    
    if (quantity > currentProductForCart.quantity) {
        showToast('Error', `Only ${currentProductForCart.quantity} ${currentProductForCart.unit} available`, 'error');
        return;
    }
    
    const result = cartService.addToCart(currentUser.user_id, currentProductForCart.product_id, quantity);
    
    if (result.success) {
        updateCartUI();
        closeModal('quantityModal');
        showToast('Added to Cart', `${quantity} ${currentProductForCart.unit} of ${currentProductForCart.name} added to your cart!`, 'success', 3000);
    } else {
        showToast('Error', result.message, 'error');
    }
}

// Add to Cart (legacy function - now opens quantity modal)
function addToCart(productId) {
    showQuantityModal(productId);
}

// Show out of stock message
function showOutOfStockMessage() {
    showToast('Out of Stock', 'This product is currently out of stock and cannot be added to cart.', 'warning');
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
        cartItemsList.innerHTML = cartSummary.items.map((item, index) => `
            <div class="cart-item" data-product-id="${item.product_id}">
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
                        <button class="qty-btn cart-decrease-btn" data-product-id="${item.product_id}" data-current-qty="${item.quantity}">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn cart-increase-btn" data-product-id="${item.product_id}" data-current-qty="${item.quantity}">+</button>
                        <button class="qty-btn cart-remove-btn" data-product-id="${item.product_id}" style="margin-left: auto; color: #ef4444;">✕</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for cart quantity controls
        setTimeout(() => {
            // Decrease quantity buttons
            document.querySelectorAll('.cart-decrease-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const productId = btn.getAttribute('data-product-id');
                    const currentQty = parseInt(btn.getAttribute('data-current-qty'));
                    updateQuantity(productId, currentQty - 1);
                });
            });
            
            // Increase quantity buttons
            document.querySelectorAll('.cart-increase-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const productId = btn.getAttribute('data-product-id');
                    const currentQty = parseInt(btn.getAttribute('data-current-qty'));
                    updateQuantity(productId, currentQty + 1);
                });
            });
            
            // Remove item buttons
            document.querySelectorAll('.cart-remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const productId = btn.getAttribute('data-product-id');
                    removeFromCart(productId);
                });
            });
        }, 10);
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
    const product = productService.getProductById(productId);
    if (!product) {
        alert('Product not found');
        return;
    }
    
    const modal = document.getElementById('productModal');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductContent = document.getElementById('modalProductContent');
    
    modalProductName.textContent = product.name;
    modalProductContent.innerHTML = `
        <div style="text-align: center; font-size: 5rem; margin: 2rem 0;">
            ${product.image_url ? 
                `<img src="${product.image_url}" alt="${product.name}" style="max-width: 100%; height: auto;">` :
                '🌾'
            }
        </div>
        <p style="margin-bottom: 1rem;"><strong>Price:</strong> ₱${product.price.toFixed(2)} per ${product.unit}</p>
        <p style="margin-bottom: 1rem;"><strong>Available Stock:</strong> ${product.quantity} ${product.unit}</p>
        <p style="margin-bottom: 1rem;"><strong>Category:</strong> ${product.category}</p>
        <p style="margin-bottom: 1.5rem;">${product.description}</p>
        <button class="btn-primary" onclick="addToCart('${product.product_id}'); closeModal('productModal')">Add to Cart</button>
    `;
    
    modal.classList.add('open');
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
}

// Proceed to Checkout
function proceedToCheckout() {
    const cartSummary = cartService.getCartSummary(currentUser.user_id);
    
    if (cartSummary.isEmpty) {
        alert('Your cart is empty!');
        return;
    }
    toggleCart();
    document.getElementById('checkoutModal').classList.add('open');
}

// Handle Checkout Form
document.getElementById('checkoutForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Create order
    const result = cartService.createOrderFromCart(currentUser.user_id);
    
    if (result.success) {
        showToast('Order Placed', 'Order placed successfully! You will receive a confirmation email shortly.', 'success');
        updateCartUI();
        renderOrders();
        closeModal('checkoutModal');
        showSection('orders');
    } else {
        showToast('Error', result.message, 'error');
    }
});

// Render Orders
function renderOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    // Check if currentUser exists
    if (!currentUser) {
        console.log('⚠️ No current user found, skipping order rendering');
        ordersList.innerHTML = '<p style="text-align: center; color: #6b7280;">Please log in to view orders</p>';
        return;
    }
    
    const buyerOrders = storage.getOrdersByBuyer(currentUser.user_id);
    const orderItems = storage.getData('order_items') || [];
    const allProducts = productService.getAllProducts();
    const allUsers = storage.getData('users') || [];
    
    if (buyerOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #6b7280;">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = buyerOrders.map(order => {
        const items = orderItems.filter(item => item.order_id === order.order_id);
        
        // Group items by farmer
        const itemsByFarmer = {};
        items.forEach(item => {
            const product = allProducts.find(p => p.product_id === item.product_id);
            if (product) {
                const farmerId = product.farmer_id;
                if (!itemsByFarmer[farmerId]) {
                    itemsByFarmer[farmerId] = [];
                }
                itemsByFarmer[farmerId].push({
                    product: product,
                    quantity: item.quantity
                });
            }
        });
        
        // Create farmer sections
        const farmerSections = Object.keys(itemsByFarmer).map(farmerId => {
            const farmer = allUsers.find(u => u.user_id == farmerId);
            const farmerName = farmer ? farmer.name : 'Unknown Farmer';
            const farmerItems = itemsByFarmer[farmerId];
            
            const productList = farmerItems.map(item => 
                `${item.quantity} x ${item.product.name}`
            ).join(', ');
            
            return `
                <div class="farmer-section" style="margin-bottom: 1rem; padding: 0.75rem; background: #f8f9fa; border-radius: 0.5rem; border-left: 3px solid #10b981;">
                    <div style="font-weight: 600; color: #059669; margin-bottom: 0.5rem;">
                        👨‍🌾 ${farmerName}
                    </div>
                    <div style="color: #6b7280; font-size: 0.875rem;">
                        ${productList}
                    </div>
                </div>
            `;
        }).join('');
        
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
                    ${farmerSections}
                </div>
                <div class="order-footer">
                    <span class="order-total">₱${order.total_amount.toFixed(2)}</span>
                    <button class="btn-primary" onclick="trackOrder('${order.order_id}')">Track Order</button>
                </div>
            </div>
        `;
    }).join('');
}

// Update Dashboard Stats
function updateDashboardStats() {
    // Get user's order stats
    const userOrders = storage.getOrdersByBuyer(currentUser.user_id);
    const activeOrders = userOrders.filter(o => ['pending_payment', 'confirmed', 'transit'].includes(o.status));
    
    // Calculate total spent
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total_amount, 0);
    
    // Get current cart items count
    const cartItems = cartService.getCartItems();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update the stat cards
    const statCards = document.querySelectorAll('#homeSection .stat-card');
    if (statCards.length >= 3) {
        statCards[0].querySelector('h3').textContent = activeOrders.length;
        statCards[1].querySelector('h3').textContent = `₱${totalSpent.toFixed(2)}`;
        statCards[2].querySelector('h3').textContent = cartCount;
    }
}

// Setup Dashboard Interactions
function setupDashboardInteractions() {
    const statCards = document.querySelectorAll('#homeSection .stat-card');
    
    // Make "Active Orders" card clickable to go to orders
    if (statCards[0]) {
        statCards[0].addEventListener('click', () => {
            showSection('orders');
        });
        statCards[0].style.cursor = 'pointer';
    }
    
    // Make "Items in Cart" card clickable to open cart
    if (statCards[2]) {
        statCards[2].addEventListener('click', () => {
            toggleCart();
        });
        statCards[2].style.cursor = 'pointer';
    }
}

// ========== FARMERS SECTION ==========

// Render Farmers Section
function renderFarmers() {
    console.log('Rendering farmers section...');
    const farmersContainer = document.getElementById('farmersContainer');
    if (!farmersContainer) return;
    
    // Get all farmers (users with role 'farmer')
    const allUsers = storage.getData('users') || [];
    const farmers = allUsers.filter(user => user.role === 'farmer');
    
    console.log('All users:', allUsers.length);
    console.log('Farmers found:', farmers.length);
    console.log('Farmers:', farmers.map(f => ({ id: f.user_id, name: f.name, email: f.email })));
    
    if (farmers.length === 0) {
        farmersContainer.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No farmers available</p>';
        return;
    }
    
    // Get all products
    const allProducts = productService.getAllProducts();
    console.log('All products for farmers:', allProducts.length);
    
    // Render each farmer with their products
    farmersContainer.innerHTML = farmers.map(farmer => {
        // Get products for this farmer (ensure both IDs are numbers for comparison)
        const farmerProducts = allProducts.filter(p => p.farmer_id === farmer.user_id && p.quantity > 0);
        console.log(`Farmer ${farmer.name} (ID: ${farmer.user_id}) has ${farmerProducts.length} products:`, farmerProducts.map(p => p.name));
        
        return `
            <div class="farmer-section">
                <div class="farmer-header">
                    <div class="farmer-info">
                        <div class="farmer-avatar">👨‍🌾</div>
                        <div>
                            <h3 class="farmer-name">${farmer.name}'s Farm</h3>
                            <p class="farmer-meta">${farmerProducts.length} products available</p>
                        </div>
                    </div>
                </div>
                
                <div class="farmer-filter-bar">
                    <button class="filter-btn active" data-farmer-id="${farmer.user_id}" data-category="all">All Products</button>
                    <button class="filter-btn" data-farmer-id="${farmer.user_id}" data-category="vegetables">Vegetables</button>
                    <button class="filter-btn" data-farmer-id="${farmer.user_id}" data-category="fruits">Fruits</button>
                    <button class="filter-btn" data-farmer-id="${farmer.user_id}" data-category="grains">Grains</button>
                    <button class="filter-btn" data-farmer-id="${farmer.user_id}" data-category="herbs">Herbs</button>
                </div>
                
                <div class="products-grid" id="farmer-products-${farmer.user_id}">
                    ${renderFarmerProducts(farmerProducts)}
                </div>
            </div>
        `;
    }).join('');
    
    // Add event delegation for farmer filter buttons
    setTimeout(() => {
        const farmersContainer = document.getElementById('farmersContainer');
        if (farmersContainer) {
            farmersContainer.addEventListener('click', function(e) {
                if (e.target.classList.contains('filter-btn') && e.target.hasAttribute('data-farmer-id')) {
                    const farmerId = e.target.getAttribute('data-farmer-id');
                    const category = e.target.getAttribute('data-category');
                    console.log('Farmer filter clicked:', { farmerId, category });
                    filterFarmerProducts(farmerId, category, e);
                }
            });
        }
    }, 100);
}


// Render farmer products
function renderFarmerProducts(products) {
    if (products.length === 0) {
        return '<p style="text-align: center; color: #6b7280; padding: 2rem; grid-column: 1/-1;">No products in this category</p>';
    }
    
    return products.map(product => {
        const imageSrc = product.image_url; // Direct use since it's Base64
        
        console.log(`🖼️ Farmer Products - Product: ${product.name}, Image URL: ${product.image_url ? 'Base64 data' : 'null'}`);
        
        return `
        <div class="product-card">
            <div class="product-image" style="background: linear-gradient(135deg, #4a7c2c 0%, #6ba83d 100%);">
                ${product.image_url ? 
                    `<img src="${imageSrc}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="console.error('Failed to load image:', this.src); this.style.display='none'; this.nextElementSibling.style.display='inline';"><span style="display:none;">🌾</span>` :
                    `<span>🌾</span>`
                }
                <span class="stock-badge ${product.is_available === false ? 'out-of-stock' : ''}">
                    ${product.is_available === false ? 'No Stock' : `${product.quantity} in stock`}
                </span>
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
                <button class="add-to-cart-btn ${product.is_available === false ? 'disabled' : ''}" 
                    onclick="${product.is_available === false ? 'showOutOfStockMessage()' : `addToCart('${product.product_id}')`}"
                    ${product.is_available === false ? 'disabled' : ''}>
                    ${product.is_available === false ? 'No Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>`;
    }).join('');
}

// Filter farmer products by category
function filterFarmerProducts(farmerId, category, event) {
    console.log('Filtering farmer products:', { farmerId, category });
    
    // Convert farmerId to number since it comes as string from data attribute
    const farmerIdNum = parseInt(farmerId);
    console.log('Converted farmerId to number:', farmerIdNum);
    
    const allProducts = productService.getAllProducts();
    
    // Debug: Show data types and sample farmer_ids
    console.log('Sample product farmer_ids:', allProducts.slice(0, 3).map(p => ({ id: p.farmer_id, type: typeof p.farmer_id })));
    console.log('Looking for farmerId:', farmerIdNum, 'type:', typeof farmerIdNum);
    
    const farmerProducts = allProducts.filter(p => p.farmer_id === farmerIdNum && p.quantity > 0);
    const filtered = category === 'all' ? farmerProducts : farmerProducts.filter(p => p.category === category);
    
    console.log('Farmer products for farmer', farmerId, ':', farmerProducts.length);
    console.log('Filtered products for category "' + category + '":', filtered.length);
    console.log('Products in category:', filtered.map(p => p.name));
    
    const container = document.getElementById(`farmer-products-${farmerId}`);
    if (container) {
        container.innerHTML = renderFarmerProducts(filtered);
    }
    
    // Update filter buttons for this farmer section
    const farmerSection = container.closest('.farmer-section');
    if (farmerSection) {
        farmerSection.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Find and activate the clicked button
        if (event && event.target) {
            event.target.classList.add('active');
        } else {
            // Fallback: find button by data attributes
            const targetButton = farmerSection.querySelector(`[data-farmer-id="${farmerId}"][data-category="${category}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
        }
    }
}

// ========== END FARMERS SECTION ==========

// Update User Info
function updateUserInfo() {
    const headerAvatar = document.getElementById('headerAvatar');
    const headerPlaceholder = document.getElementById('headerAvatarPlaceholder');

    if (!headerAvatar || !headerPlaceholder) return;

    if (currentUser && currentUser.avatar_url) {
        headerAvatar.src = currentUser.avatar_url;
        headerAvatar.style.display = 'inline-block';
        headerPlaceholder.style.display = 'none';
    } else {
        // Show initials or default icon in placeholder
        let initials = '';
        if (currentUser && currentUser.name) {
            const parts = currentUser.name.trim().split(/\s+/);
            initials = parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('');
        }
        headerPlaceholder.textContent = initials || '👤';
        headerPlaceholder.style.display = 'flex';
        headerAvatar.style.display = 'none';
    }
}

// Update Subscription Status
function updateSubscriptionStatus() {
    const subscriptionBadge = document.getElementById('subscriptionBadge');
    if (!subscriptionBadge || !currentUser) return;

    const subscription = storage.getSubscriptionByUserId(currentUser.user_id);
    
    if (!subscription) {
        subscriptionBadge.textContent = 'Free Trial';
        subscriptionBadge.className = 'subscription-badge';
        return;
    }

    const now = new Date();
    const dueDate = new Date(subscription.due_date);
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntilDue <= 0) {
        subscriptionBadge.textContent = 'Expired';
        subscriptionBadge.className = 'subscription-badge expired';
    } else if (daysUntilDue <= 3) {
        subscriptionBadge.textContent = `${daysUntilDue} Days Left`;
        subscriptionBadge.className = 'subscription-badge warning';
    } else {
        const planText = subscription.plan === 'yearly' ? 'Yearly' : 'Monthly';
        subscriptionBadge.textContent = `${planText} Plan`;
        subscriptionBadge.className = 'subscription-badge';
    }
}

// Logout function with confirmation
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
        window.location.href = 'index.html';
    }
}

// Load Subscription Details
function loadSubscriptionDetails() {
    const subscription = storage.getSubscriptionByUserId(currentUser.user_id);
    
    const planElement = document.getElementById('subscriptionPlan');
    const statusElement = document.getElementById('subscriptionStatus');
    const startDateElement = document.getElementById('subscriptionStartDate');
    const dueDateElement = document.getElementById('subscriptionDueDate');
    const upgradeBtn = document.getElementById('upgradeBtn');
    const renewBtn = document.getElementById('renewBtn');
    
    if (!subscription) {
        // No subscription - show free trial
        planElement.textContent = 'Free Trial';
        statusElement.textContent = 'Active';
        statusElement.className = 'subscription-value active';
        startDateElement.textContent = 'N/A';
        dueDateElement.textContent = 'N/A';
        upgradeBtn.style.display = 'inline-block';
        renewBtn.style.display = 'none';
        return;
    }
    
    // Format dates
    const startDate = new Date(subscription.start_date);
    const dueDate = new Date(subscription.due_date);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    
    // Update plan
    const planText = subscription.plan === 'yearly' ? 'Yearly Plan' : 'Monthly Plan';
    planElement.textContent = planText;
    
    // Update status
    if (daysUntilDue <= 0) {
        statusElement.textContent = 'Expired';
        statusElement.className = 'subscription-value expired';
        renewBtn.style.display = 'inline-block';
        upgradeBtn.style.display = 'none';
    } else if (daysUntilDue <= 3) {
        statusElement.textContent = 'Expiring Soon';
        statusElement.className = 'subscription-value warning';
        renewBtn.style.display = 'inline-block';
        upgradeBtn.style.display = 'none';
    } else {
        statusElement.textContent = 'Active';
        statusElement.className = 'subscription-value active';
        renewBtn.style.display = 'none';
        upgradeBtn.style.display = 'none';
    }
    
    // Update dates
    startDateElement.textContent = startDate.toLocaleDateString();
    dueDateElement.textContent = dueDate.toLocaleDateString();
}

// Subscription Actions
function upgradeSubscription() {
    if (confirm('Subscribe to Crop-Tap service?\n\nMonthly Plan: ₱100/month\nYearly Plan: ₱1,000/year (Save 17%)\n\nChoose your plan:')) {
        const plan = prompt('Enter your preferred plan:\n1. monthly (₱100/month)\n2. yearly (₱1,000/year)\n\nType "monthly" or "yearly":');
        
        if (plan && (plan.toLowerCase() === 'monthly' || plan.toLowerCase() === 'yearly')) {
            const selectedPlan = plan.toLowerCase();
            const startDate = new Date().toISOString();
            const dueDate = storage.calculateDueDate(startDate, selectedPlan);
            
            // Create subscription
            const subscription = storage.createSubscription({
                user_id: currentUser.user_id,
                plan: selectedPlan,
                start_date: startDate,
                due_date: dueDate
            });
            
            if (subscription) {
                showNotification(`Successfully subscribed to ${selectedPlan} plan!`, 'success');
                loadSubscriptionDetails();
                updateSubscriptionStatus();
            } else {
                showNotification('Failed to create subscription. Please try again.', 'error');
            }
        } else if (plan) {
            alert('Invalid plan selection. Please enter "monthly" or "yearly".');
        }
    }
}

function renewSubscription() {
    const subscription = storage.getSubscriptionByUserId(currentUser.user_id);
    if (!subscription) {
        alert('No subscription found. Please subscribe first.');
        return;
    }
    
    if (confirm(`Renew your ${subscription.plan} subscription?\n\nThis will extend your subscription for another period.`)) {
        const startDate = new Date().toISOString();
        const dueDate = storage.calculateDueDate(startDate, subscription.plan);
        
        // Update existing subscription
        const updatedSubscription = storage.updateSubscription(subscription.id, {
            start_date: startDate,
            due_date: dueDate,
            status: 'active'
        });
        
        if (updatedSubscription) {
            showNotification(`Successfully renewed ${subscription.plan} subscription!`, 'success');
            loadSubscriptionDetails();
            updateSubscriptionStatus();
        } else {
            showNotification('Failed to renew subscription. Please try again.', 'error');
        }
    }
}

function updateWelcomeMessage() {
    const welcomeTitle = document.getElementById('welcomeTitle');
    if (welcomeTitle && currentUser && currentUser.name) {
        // Get first name from full name
        const firstName = currentUser.name.trim().split(/\s+/)[0];
        welcomeTitle.textContent = `Welcome back, ${firstName}!`;
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
    
    // Also update dashboard stats if home section is visible
    if (document.getElementById('homeSection').style.display !== 'none') {
        updateDashboardStats();
    }
}

function loadConsumerProfileData() {
    if (!currentUser) return;
    
    // Load existing profile data into form fields
    const nameInput = document.querySelector('#profileSection input[type="text"]');
    const emailInput = document.querySelector('#profileSection input[type="email"]');
    const phoneInput = document.querySelector('#profileSection input[type="tel"]');
    const addressInput = document.querySelector('#profileSection textarea');
    
    if (nameInput) nameInput.value = currentUser.name || '';
    if (emailInput) emailInput.value = currentUser.email || '';
    if (phoneInput) phoneInput.value = currentUser.phone || '';
    if (addressInput) addressInput.value = currentUser.address || '';
}

function saveConsumerProfile(updateData) {
    const result = auth.updateProfile(currentUser.user_id, updateData);
    if (result.success) {
        currentUser = result.user;
        updateUserInfo(); // reflect changes in header immediately
        updateWelcomeMessage(); // update welcome message with new name
        showToast('Profile Updated', 'Your profile has been updated successfully!', 'success');
    } else {
        showToast('Error', result.message, 'error');
    }
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
    document.getElementById('farmersSection').style.display = 'none';
    document.getElementById('ordersSection').style.display = 'none';
    document.getElementById('profileSection').style.display = 'none';
    document.getElementById('settingsSection').style.display = 'none';
    
    // Show selected section
    if (section === 'home') {
        document.getElementById('homeSection').style.display = 'block';
        updateDashboardStats(); // Refresh stats when home section is shown
        loadProducts(); // Refresh featured products
    } else if (section === 'products') {
        document.getElementById('productsSection').style.display = 'block';
    } else if (section === 'farmers') {
        document.getElementById('farmersSection').style.display = 'block';
        renderFarmers(); // Load farmers when section is shown
    } else if (section === 'orders') {
        document.getElementById('ordersSection').style.display = 'block';
        renderOrders(); // Refresh orders when section is shown
    } else if (section === 'profile') {
        document.getElementById('profileSection').style.display = 'block';
        loadConsumerProfileData(); // Refresh profile data when section is shown
    } else if (section === 'settings') {
        document.getElementById('settingsSection').style.display = 'block';
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

// Close mobile nav when clicking a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
        }
    });
});

// Search Functionality
// Desktop search input
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const allProducts = productService.getAllProducts().filter(p => p.quantity > 0);
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    
    if (document.getElementById('productsSection').style.display !== 'none') {
        renderProducts('allProducts', filtered);
    }
});

// Mobile search input
document.getElementById('mobileSearchInput')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();

    // keep desktop search in sync if present
    const desktopInput = document.getElementById('searchInput');
    if (desktopInput) desktopInput.value = e.target.value;

    const allProducts = productService.getAllProducts().filter(p => p.quantity > 0);
    const filtered = allProducts.filter(p => 
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


// Toast Notification System
function showToast(title, message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast(this.parentElement)">×</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Auto remove
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

function removeToast(toast) {
    if (!toast) return;
    
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

// Show notification helper (legacy - now uses toast)
function showNotification(message, type = 'info') {
    showToast(type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info', message, type);
}


// Initialize app
init();
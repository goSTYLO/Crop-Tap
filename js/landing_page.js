// Mobile menu toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
});

// Add scroll effect to navigation
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'linear-gradient(135deg, #1a3309 0%, #2d5016 100%)';
    } else {
        nav.style.background = 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)';
    }
});

// Initialize marketplace functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    loadProducts();
    setupProductSearch();
    updateCartBadge();
});

// Global refresh functions for TabSync
window.refreshProducts = function() {
    console.log('🔄 refreshProducts called - reloading product display');
    loadProducts();
    setupProductSearch();
};

window.refreshCart = function() {
    updateCartBadge();
};

window.updateCartBadge = function() {
    const cartBadge = document.getElementById('cartBadge');
    if (!cartBadge) return;

    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'consumer') {
        cartBadge.style.display = 'none';
        return;
    }

    const cartItems = cart.getCartItems(currentUser.user_id);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = 'inline-block';
    } else {
        cartBadge.style.display = 'none';
    }
};

// Initialize authentication state
function initializeAuth() {
    const authButtons = document.getElementById('authButtons');
    const currentUser = auth.getCurrentUser();
    
    if (currentUser) {
        // User is logged in
        authButtons.innerHTML = `
            <span class="user-welcome">Welcome, ${currentUser.name} (${currentUser.role})</span>
            <a href="#" class="btn btn-login" onclick="logout()">Logout</a>
            ${currentUser.role === 'farmer' ? 
                '<a href="admin_dashboard.html" class="btn btn-signup">Farmer Dashboard</a>' : 
                '<a href="user_dashboard.html" class="btn btn-signup">Buyer Dashboard</a>'
            }
        `;
    } else {
        // User is not logged in
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-login">Login</a>
            <a href="signup.html" class="btn btn-signup">Sign Up</a>
        `;
    }
}

// Load products into the marketplace
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    const products = productService.getAllProducts();
    console.log('🔄 loadProducts called - refreshing product grid with', products.length, 'products');
    
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products">
                <h3>No products available yet</h3>
                <p>Be the first to add products to our marketplace!</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = products.map(product => {
        const imageSrc = product.image_url ? 
            (typeof getImagePath === 'function' ? getImagePath(product.image_url) : product.image_url) : 
            null;
        
        console.log(`🖼️ Product: ${product.name}, Original URL: ${product.image_url}, Final URL: ${imageSrc}`);
        
        return `
        <div class="price-card" data-product-id="${product.product_id}">
            <div class="product-image">
                ${product.image_url ? 
                    `<img src="${imageSrc}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" onerror="console.error('Failed to load image:', this.src); this.style.display='none'; this.nextElementSibling.style.display='block';"><div class="placeholder-image" style="display:none;">🌾</div>` :
                    `<div class="placeholder-image">🌾</div>`
                }
            </div>
            <h3>${product.name}</h3>
            <div class="price">₱${product.price.toFixed(2)} / ${product.unit}</div>
            <ul>
                <li>${product.description}</li>
                <li>Available: ${product.quantity} ${product.unit}</li>
                <li>Fresh from farm</li>
            </ul>
            ${auth.isLoggedIn() && auth.isBuyer() ? 
                `<button class="btn add-to-cart-btn" onclick="addToCart('${product.product_id}')">Add to Cart</button>` :
                `<button class="btn" onclick="alert('Please log in as a buyer to add items to cart')">Login to Buy</button>`
            }
        </div>`;
    }).join('');
}

// Setup product search functionality
function setupProductSearch() {
    const searchInput = document.getElementById('productSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const productGrid = document.getElementById('productGrid');
        
        if (!productGrid) return;

        const products = productService.searchProducts(query);
        
        if (products.length === 0) {
            productGrid.innerHTML = `
                <div class="no-products">
                    <h3>No products found</h3>
                    <p>Try searching with different keywords</p>
                </div>
            `;
            return;
        }

        productGrid.innerHTML = products.map(product => {
            const imageSrc = product.image_url ? 
                (typeof getImagePath === 'function' ? getImagePath(product.image_url) : product.image_url) : 
                null;
            
            console.log(`🔍 Search - Product: ${product.name}, Original URL: ${product.image_url}, Final URL: ${imageSrc}`);
            
            return `
            <div class="price-card" data-product-id="${product.product_id}">
                <div class="product-image">
                    ${product.image_url ? 
                        `<img src="${imageSrc}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" onerror="console.error('Failed to load image:', this.src); this.style.display='none'; this.nextElementSibling.style.display='block';"><div class="placeholder-image" style="display:none;">🌾</div>` :
                        `<div class="placeholder-image">🌾</div>`
                    }
                </div>
                <h3>${product.name}</h3>
                <div class="price">₱${product.price.toFixed(2)} / ${product.unit}</div>
                <ul>
                    <li>${product.description}</li>
                    <li>Available: ${product.quantity} ${product.unit}</li>
                    <li>Fresh from farm</li>
                </ul>
                ${auth.isLoggedIn() && auth.isBuyer() ? 
                    `<button class="btn add-to-cart-btn" onclick="addToCart('${product.product_id}')">Add to Cart</button>` :
                    `<button class="btn" onclick="alert('Please log in as a buyer to add items to cart')">Login to Buy</button>`
                }
            </div>`;
        }).join('');
    });
}

// Add to cart function
function addToCart(productId) {
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser) {
        alert('Please log in to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }

    if (currentUser.role !== 'consumer') {
        alert('Only buyers can add items to cart.');
        return;
    }

    const result = cartService.addToCart(currentUser.user_id, productId, 1);
    
    if (result.success) {
        alert(result.message);
        updateCartBadge();
    } else {
        alert(result.message);
    }
}

// Update cart badge (if you add one to the navigation)
function updateCartBadge() {
    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.role === 'consumer') {
        const cartCount = cartService.getCartItemCount(currentUser.user_id);
        // You can add a cart badge to the navigation here
        console.log(`Cart has ${cartCount} items`);
    }
}

// Logout function
function logout() {
    const result = auth.logout();
    if (result.success) {
        alert(result.message);
        window.location.reload();
    } else {
        alert(result.message);
    }
}
// Product management for Crop-Tap
// Handles product display, search, and farmer product management

class ProductService {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.init();
    }

    init() {
        this.loadProducts();
        this.renderProducts();
    }

    // Load products from localStorage
    loadProducts() {
        this.products = storage.getProducts();
        this.filteredProducts = [...this.products];
    }

    // Render products on the page
    renderProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        if (this.filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <i class="fas fa-seedling"></i>
                        <h3>No products found</h3>
                        <p>No products match your search criteria.</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredProducts.map(product => {
            const farmer = storage.getUserById(product.farmer_id);
            const farmerName = farmer ? farmer.name : 'Unknown Farmer';
            
            return `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card product-card h-100">
                        ${product.image_url ? 
                            `<img src="${product.image_url}" class="card-img-top product-image" alt="${product.name}">` :
                            `<div class="product-image d-flex align-items-center justify-content-center bg-light">
                                <i class="fas fa-image text-muted" style="font-size: 3rem;"></i>
                            </div>`
                        }
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted small">${product.description || 'No description available'}</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="product-price">$${product.price.toFixed(2)}</span>
                                    <span class="product-quantity">${product.quantity} ${product.unit}</span>
                                </div>
                                <p class="card-text small text-muted">Sold by: ${farmerName}</p>
                                ${this.canAddToCart(product) ? 
                                    `<button class="btn btn-success btn-sm w-100" onclick="productService.addToCart('${product.product_id}')">
                                        Add to Cart
                                    </button>` :
                                    `<button class="btn btn-outline-secondary btn-sm w-100" disabled>
                                        ${product.quantity === 0 ? 'Out of Stock' : 'Login to Buy'}
                                    </button>`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Check if user can add product to cart
    canAddToCart(product) {
        const user = auth.getCurrentUser();
        return user && user.role === 'buyer' && product.quantity > 0;
    }

    // Add product to cart
    addToCart(productId) {
        if (!auth.requireAuth('buyer')) return;

        const product = this.products.find(p => p.product_id === productId);
        if (!product) {
            showNotification('Product not found', 'error');
            return;
        }

        if (product.quantity <= 0) {
            showNotification('Product is out of stock', 'error');
            return;
        }

        const user = auth.getCurrentUser();
        storage.addToCart(user.user_id, productId, 1);
        
        showNotification(`${product.name} added to cart!`, 'success');
        this.updateCartCount();
    }

    // Update cart count in navigation
    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement && auth.isLoggedIn()) {
            const user = auth.getCurrentUser();
            const cartItems = storage.getCartItems(user.user_id);
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // Search products
    searchProducts(query) {
        if (!query || query.trim() === '') {
            this.filteredProducts = [...this.products];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredProducts = this.products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        this.renderProducts();
    }

    // Create new product (for farmers)
    createProduct(productData) {
        if (!auth.requireAuth('farmer')) return false;

        const user = auth.getCurrentUser();
        const newProduct = storage.createProduct({
            ...productData,
            farmer_id: user.user_id
        });

        this.loadProducts();
        this.renderProducts();
        return newProduct;
    }

    // Update product (for farmers)
    updateProduct(productId, updateData) {
        if (!auth.requireAuth('farmer')) return false;

        const user = auth.getCurrentUser();
        const product = storage.getProducts().find(p => p.product_id === productId);
        
        if (!product || product.farmer_id !== user.user_id) {
            showNotification('Product not found or access denied', 'error');
            return false;
        }

        const updatedProduct = storage.updateProduct(productId, updateData);
        this.loadProducts();
        this.renderProducts();
        return updatedProduct;
    }

    // Delete product (for farmers)
    deleteProduct(productId) {
        if (!auth.requireAuth('farmer')) return false;

        const user = auth.getCurrentUser();
        const product = storage.getProducts().find(p => p.product_id === productId);
        
        if (!product || product.farmer_id !== user.user_id) {
            showNotification('Product not found or access denied', 'error');
            return false;
        }

        storage.deleteProduct(productId);
        this.loadProducts();
        this.renderProducts();
        showNotification('Product deleted successfully', 'success');
        return true;
    }

    // Get products by farmer
    getProductsByFarmer(farmerId) {
        return storage.getProductsByFarmer(farmerId);
    }

    // Refresh products (useful after login/logout)
    refresh() {
        this.loadProducts();
        this.renderProducts();
        this.updateCartCount();
    }
}

// Create global instance
const productService = new ProductService();

// Global search function for HTML onclick
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        productService.searchProducts(searchInput.value);
    }
}

// Handle search input events
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            productService.searchProducts(this.value);
        });
    }
});

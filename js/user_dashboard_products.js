// User Dashboard Product Management
// Handles product display, filtering, and search

class UserDashboardProducts {
    constructor(userDashboard) {
        this.userDashboard = userDashboard;
        this.currentFilter = 'all';
    }

    loadProducts() {
        const products = productService.getAllProducts();
        const availableProducts = products.filter(p => p.quantity > 0);
        
        // Render featured products (first 4)
        this.renderProducts('featuredProducts', availableProducts.slice(0, 4));
        // Render all products
        this.renderProducts('allProducts', availableProducts);
    }

    renderProducts(containerId, productList) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (productList.length === 0) {
            container.innerHTML = `<div class="no-products" data-i18n-dynamic="no_products"></div>`;
            translateDynamicText(); // Translate immediately
            return;
        }

        container.innerHTML = productList.map(product => `
            <div class="product-card" onclick="userDashboard.products.showProductDetail('${product.product_id}')">
                <div class="product-image" style="background: linear-gradient(135deg, #4a7c2c 0%, #6ba83d 100%);">
                    ${product.image_url ? 
                        `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                        `<span>🌾</span>`
                    }
                    <span class="stock-badge" data-i18n-dynamic="stock_in" data-count="${product.quantity}"></span>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <div>
                            <div class="product-price">₱${product.price.toFixed(2)}</div>
                            <div class="product-unit" data-i18n-dynamic="unit_per" data-unit="${product.unit}"></div>
                        </div>
                    </div>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); userDashboard.cart.addToCart('${product.product_id}')"
                        data-i18n-dynamic="add_to_cart"></button>
                </div>
            </div>
        `).join('');

        translateDynamicText(); // Translate dynamic content
    }

    filterProducts(category) {
        this.currentFilter = category;
        const allProducts = productService.getAllProducts().filter(p => p.quantity > 0);
        const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
        this.renderProducts('allProducts', filtered);
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    searchProducts(query) {
        const allProducts = productService.getAllProducts().filter(p => p.quantity > 0);
        const filtered = allProducts.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        this.renderProducts('allProducts', filtered);
    }

    showProductDetail(productId) {
        const product = productService.getProductById(productId);
        if (!product) return;

        // Create product detail modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <div class="product-detail">
                    <div class="product-image">
                        ${product.image_url ? 
                            `<img src="${product.image_url}" alt="${product.name}">` :
                            `<span>🌾</span>`
                        }
                    </div>
                    <div class="product-info">
                        <h2>${product.name}</h2>
                        <p class="description">${product.description}</p>
                        <div class="price">₱${product.price.toFixed(2)} per ${product.unit}</div>
                        <div class="stock">Stock: ${product.quantity} ${product.unit}</div>
                        <div class="category">Category: ${product.category}</div>
                        <button class="add-to-cart-btn" onclick="userDashboard.cart.addToCart('${product.product_id}'); this.parentElement.parentElement.parentElement.remove();">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

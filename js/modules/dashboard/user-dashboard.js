// User Dashboard Management
import { auth } from '../../auth.js';
import { productService } from '../../products.js';
import { storage } from '../../storage.js';
import { cartEvents } from '../events/cart-events.js';
import { toast } from '../ui/toast.js';
import { modal } from '../ui/modal.js';
import { imageHandler } from '../ui/image-handler.js';
import { navigation } from '../ui/navigation.js';
import { Utils } from '../core/utils.js';

export class UserDashboard {
    constructor() {
        this.currentUser = null;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // Check authentication
        if (!auth.isLoggedIn() || !auth.isBuyer()) {
            toast.error('Access Denied', 'Buyers only.');
            window.location.href = 'index.html';
            return;
        }
        
        this.currentUser = auth.getCurrentUser();
        cartEvents.setCurrentUser(this.currentUser);
        
        this.initializeApp();
        this.setupEventListeners();
        this.loadInitialData();
    }

    initializeApp() {
        this.setupNavigation();
        this.setupImageHandlers();
        this.setupSearchHandlers();
        this.setupSectionHandlers();
    }

    setupNavigation() {
        // Register sections
        this.registerSections();
        
        // Setup navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navigation.setupNavigationLinks(navLinks);
    }

    registerSections() {
        const sections = [
            'homeSection',
            'productsSection', 
            'farmersSection',
            'ordersSection',
            'profileSection',
            'settingsSection'
        ];

        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                navigation.registerSection(sectionId, element, 
                    () => this.onSectionShow(sectionId),
                    () => this.onSectionHide(sectionId)
                );
            }
        });
    }

    onSectionShow(sectionId) {
        switch (sectionId) {
            case 'farmersSection':
                this.renderFarmers();
                break;
            case 'profileSection':
                this.loadConsumerProfileData();
                break;
        }
    }

    onSectionHide(sectionId) {
        // Handle section hide if needed
    }

    setupImageHandlers() {
        // Profile image upload
        const fileInput = document.getElementById('consumerProfileImage');
        const preview = document.getElementById('consumerProfileImagePreview');
        if (fileInput && preview) {
            imageHandler.setupImagePreview(fileInput, preview);
        }
    }

    setupSearchHandlers() {
        // Desktop search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Mobile search
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', (e) => {
                // Keep desktop search in sync
                if (searchInput) searchInput.value = e.target.value;
                this.handleSearch(e.target.value);
            });
        }
    }

    setupSectionHandlers() {
        // Global section navigation
        window.showSection = (section) => navigation.showSection(section + 'Section');
    }

    loadInitialData() {
        this.loadProducts();
        this.renderOrders();
        this.updateCartUI();
        this.updateUserInfo();
        this.updateWelcomeMessage();
    }

    // Product Management
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
            if (window.translateDynamicText) window.translateDynamicText();
            return;
        }

        container.innerHTML = productList.map(product => `
            <div class="product-card" onclick="userDashboard.showProductDetail('${product.product_id}')">
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
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); cartEvents.addToCart('${product.product_id}')"
                        data-i18n-dynamic="add_to_cart"></button>
                </div>
            </div>
        `).join('');

        if (window.translateDynamicText) window.translateDynamicText();
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

    handleSearch(query) {
        const searchTerm = query.toLowerCase();
        const allProducts = productService.getAllProducts().filter(p => p.quantity > 0);
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
        
        if (document.getElementById('productsSection').style.display !== 'none') {
            this.renderProducts('allProducts', filtered);
        }
    }

    showProductDetail(productId) {
        const product = productService.getProductById(productId);
        if (!product) {
            toast.error('Error', 'Product not found');
            return;
        }
        
        const modalContent = document.getElementById('modalProductContent');
        if (modalContent) {
            modalContent.innerHTML = `
                <div style="text-align: center; font-size: 5rem; margin: 2rem 0;">
                    ${product.image_url ? 
                        `<img src="${product.image_url}" alt="${product.name}" style="max-width: 100%; height: auto;">` :
                        '🌾'
                    }
                </div>
                <p style="margin-bottom: 1rem;"><strong>Price:</strong> ₱${product.price.toFixed(2)} per ${product.unit}</p>
                <p style="margin-bottom: 1rem;"><strong>Available Stock:</strong> ${product.quantity} ${product.unit}</p>
                <p style="margin-bottom: 1rem;"><strong>Category:</strong> ${product.category || 'General'}</p>
                <p style="margin-bottom: 1.5rem;">${product.description}</p>
                <button class="btn-primary" onclick="cartEvents.addToCart('${product.product_id}'); modal.close('productModal')">Add to Cart</button>
            `;
        }
        
        const modalTitle = document.getElementById('modalProductName');
        if (modalTitle) modalTitle.textContent = product.name;
        
        modal.open('productModal');
    }

    // Farmers Section
    renderFarmers() {
        const farmersContainer = document.getElementById('farmersContainer');
        if (!farmersContainer) return;
        
        const allUsers = storage.getData('users') || [];
        const farmers = allUsers.filter(user => user.role === 'farmer');
        
        if (farmers.length === 0) {
            farmersContainer.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No farmers available</p>';
            return;
        }
        
        const allProducts = productService.getAllProducts();
        
        farmersContainer.innerHTML = farmers.map(farmer => {
            const farmerProducts = allProducts.filter(p => p.farmer_id === farmer.user_id && p.quantity > 0);
            
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
                        <button class="filter-btn active" onclick="userDashboard.filterFarmerProducts('${farmer.user_id}', 'all')">All Products</button>
                        <button class="filter-btn" onclick="userDashboard.filterFarmerProducts('${farmer.user_id}', 'vegetables')">Vegetables</button>
                        <button class="filter-btn" onclick="userDashboard.filterFarmerProducts('${farmer.user_id}', 'fruits')">Fruits</button>
                        <button class="filter-btn" onclick="userDashboard.filterFarmerProducts('${farmer.user_id}', 'grains')">Grains</button>
                        <button class="filter-btn" onclick="userDashboard.filterFarmerProducts('${farmer.user_id}', 'herbs')">Herbs</button>
                    </div>
                    
                    <div class="products-grid" id="farmer-products-${farmer.user_id}">
                        ${this.renderFarmerProducts(farmerProducts)}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderFarmerProducts(products) {
        if (products.length === 0) {
            return '<p style="text-align: center; color: #6b7280; padding: 2rem; grid-column: 1/-1;">No products in this category</p>';
        }
        
        return products.map(product => `
            <div class="product-card" onclick="userDashboard.showProductDetail('${product.product_id}')">
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
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); cartEvents.addToCart('${product.product_id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterFarmerProducts(farmerId, category) {
        const allProducts = productService.getAllProducts();
        const farmerProducts = allProducts.filter(p => p.farmer_id === farmerId && p.quantity > 0);
        const filtered = category === 'all' ? farmerProducts : farmerProducts.filter(p => p.category === category);
        
        const container = document.getElementById(`farmer-products-${farmerId}`);
        if (container) {
            container.innerHTML = this.renderFarmerProducts(filtered);
        }
        
        // Update filter buttons for this farmer section
        const farmerSection = container.closest('.farmer-section');
        if (farmerSection) {
            farmerSection.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
        }
    }

    // Orders Management
    renderOrders() {
        const ordersList = document.getElementById('ordersList');
        if (!ordersList) return;
        
        const buyerOrders = storage.getOrdersByBuyer(this.currentUser.user_id);
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
                            <div style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">${Utils.formatDate(order.created_at)}</div>
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
                        <button class="btn-primary" onclick="userDashboard.trackOrder('${order.order_id}')">Track Order</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    trackOrder(orderId) {
        toast.info('Order Tracking', `Tracking order ${orderId}. This will integrate with your delivery tracking system.`);
    }

    // Profile Management
    updateUserInfo() {
        const headerAvatar = document.getElementById('headerAvatar');
        const headerPlaceholder = document.getElementById('headerAvatarPlaceholder');

        if (!headerAvatar || !headerPlaceholder) return;

        if (this.currentUser && this.currentUser.avatar_url) {
            headerAvatar.src = this.currentUser.avatar_url;
            headerAvatar.style.display = 'inline-block';
            headerPlaceholder.style.display = 'none';
        } else {
            const initials = Utils.getInitials(this.currentUser?.name);
            headerPlaceholder.textContent = initials;
            headerPlaceholder.style.display = 'flex';
            headerAvatar.style.display = 'none';
        }
    }

    updateWelcomeMessage() {
        const welcomeTitle = document.getElementById('welcomeTitle');
        if (welcomeTitle && this.currentUser && this.currentUser.name) {
            const firstName = Utils.getFirstName(this.currentUser.name);
            welcomeTitle.textContent = `Welcome back, ${firstName}!`;
        }
    }

    loadConsumerProfileData() {
        if (!this.currentUser) return;
        
        const nameInput = document.querySelector('#profileSection input[type="text"]');
        const emailInput = document.querySelector('#profileSection input[type="email"]');
        const phoneInput = document.querySelector('#profileSection input[type="tel"]');
        const addressInput = document.querySelector('#profileSection textarea');
        
        if (nameInput) nameInput.value = this.currentUser.name || '';
        if (emailInput) emailInput.value = this.currentUser.email || '';
        if (phoneInput) phoneInput.value = this.currentUser.phone || '';
        if (addressInput) addressInput.value = this.currentUser.address || '';
    }

    saveConsumerProfile(updateData) {
        const result = auth.updateProfile(this.currentUser.user_id, updateData);
        if (result.success) {
            this.currentUser = result.user;
            cartEvents.setCurrentUser(this.currentUser);
            this.updateUserInfo();
            this.updateWelcomeMessage();
            toast.success('Profile Updated', 'Your profile has been updated successfully!');
        } else {
            toast.error('Error', result.message);
        }
    }

    // Cart UI Updates
    updateCartUI() {
        cartEvents.updateCartUI();
    }

    // Event Listeners
    setupEventListeners() {
        // Profile form submission
        const profileForm = document.getElementById('consumerProfileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const updateData = {
                    name: document.querySelector('#profileSection input[type="text"]').value,
                    email: document.querySelector('#profileSection input[type="email"]').value,
                    phone: document.querySelector('#profileSection input[type="tel"]').value,
                    address: document.querySelector('#profileSection textarea').value
                };

                const fileInput = document.getElementById('consumerProfileImage');
                const file = fileInput && fileInput.files && fileInput.files[0];
                
                if (file) {
                    imageHandler.fileToDataURL(file, { resize: true }).then(dataURL => {
                        updateData.avatar_url = dataURL;
                        this.saveConsumerProfile(updateData);
                    });
                } else {
                    this.saveConsumerProfile(updateData);
                }
            });
        }

        // Listen for order creation events
        document.addEventListener('orderCreated', () => {
            this.renderOrders();
        });
    }

    // Global functions for HTML onclick handlers
    static setupGlobalFunctions() {
        window.filterProducts = (category) => userDashboard.filterProducts(category);
        window.filterFarmerProducts = (farmerId, category) => userDashboard.filterFarmerProducts(farmerId, category);
        window.showProductDetail = (productId) => userDashboard.showProductDetail(productId);
        window.trackOrder = (orderId) => userDashboard.trackOrder(orderId);
    }
}

// Create global instance
export const userDashboard = new UserDashboard();

// Setup global functions
UserDashboard.setupGlobalFunctions();

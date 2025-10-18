// Admin Dashboard Management
import { auth } from '../../auth.js';
import { productService } from '../../products.js';
import { storage } from '../../storage.js';
import { toast } from '../ui/toast.js';
import { modal } from '../ui/modal.js';
import { formValidator } from '../ui/form-validator.js';
import { imageHandler } from '../ui/image-handler.js';
import { navigation } from '../ui/navigation.js';

export class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check authentication
        if (!auth.isLoggedIn() || !auth.isFarmer()) {
            toast.error('Access Denied', 'Farmers only.');
            window.location.href = 'index.html';
            return;
        }
        
        this.currentUser = auth.getCurrentUser();
        this.initializeApp();
        this.setupEventListeners();
        this.loadInitialData();
    }

    initializeApp() {
        this.setUserInfo();
        this.setupNavigation();
        this.setupForms();
        this.setupImageHandlers();
        this.hideFarmerRestrictedFeatures();
    }

    setUserInfo() {
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const avatar = document.getElementById('userAvatar');
        const topbarAvatar = document.getElementById('topbarAvatar');

        if (userNameEl) userNameEl.textContent = this.currentUser.name;
        if (userRoleEl) userRoleEl.textContent = 'Farmer';

        if (this.currentUser.avatar_url) {
            if (avatar) {
                avatar.src = this.currentUser.avatar_url;
                avatar.style.display = 'block';
            }
            if (topbarAvatar) {
                topbarAvatar.src = this.currentUser.avatar_url;
                topbarAvatar.style.display = 'inline-block';
            }
        }
    }

    setupNavigation() {
        navigation.setupDashboardNavigation();
    }

    setupForms() {
        // Product form
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
        }

        // Order form
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => this.handleOrderSubmit(e));
        }

        // Profile form
        const profileForm = document.getElementById('farmerProfileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        }
    }

    setupImageHandlers() {
        // Product image preview
        const productImageFile = document.getElementById('productImageFile');
        const productImagePreview = document.getElementById('productImagePreview');
        if (productImageFile && productImagePreview) {
            imageHandler.setupImagePreview(productImageFile, productImagePreview);
        }

        // Profile image preview
        const profileImage = document.getElementById('profileImage');
        const profileImagePreview = document.getElementById('profileImagePreview');
        if (profileImage && profileImagePreview) {
            imageHandler.setupImagePreview(profileImage, profileImagePreview);
        }
    }

    hideFarmerRestrictedFeatures() {
        const userNavItem = document.querySelector('[data-page="users"]');
        const logsNavItem = document.querySelector('[data-page="logs"]');
        if (userNavItem) userNavItem.style.display = 'none';
        if (logsNavItem) logsNavItem.style.display = 'none';
    }

    loadInitialData() {
        this.loadProductsTable();
        this.loadOrdersTable();
        this.updateDashboardStats();
        this.loadFarmerProfileData();
    }

    // Product Management
    loadProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        const farmerProducts = productService.getProductsByFarmer(this.currentUser.user_id);

        if (farmerProducts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                        No products added yet. <a href="#" onclick="modal.open('productModal')">Add your first product</a>
                    </td>
                </tr>
            `;
            return;
        }

        farmerProducts.forEach(product => {
            const row = `
                <tr>
                    <td>
                        ${product.image_url ? 
                            `<img src="${product.image_url}" alt="${product.name}" class="image-preview">` :
                            `<div class="image-preview placeholder">🌾</div>`
                        }
                    </td>
                    <td>${product.name}</td>
                    <td><span class="status-badge status-confirmed">${product.unit}</span></td>
                    <td>₱${product.price.toFixed(2)}</td>
                    <td>${product.quantity}</td>
                    <td>${product.unit}</td>
                    <td>${this.currentUser.name}</td>
                    <td class="action-buttons">
                        <button class="icon-btn" onclick="adminDashboard.editProduct('${product.product_id}')" title="Edit">✏️</button>
                        <button class="icon-btn delete" onclick="adminDashboard.deleteProduct('${product.product_id}')" title="Delete">🗑️</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    handleProductSubmit(e) {
        e.preventDefault();
        
        const productId = document.getElementById('productId').value;
        const productData = {
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            quantity: parseInt(document.getElementById('productQuantity').value),
            unit: document.getElementById('productUnit').value,
            description: document.getElementById('productDescription').value,
            image_url: null,
            farmer_id: this.currentUser.user_id
        };

        // Validate form
        const validation = formValidator.validateForm(e.target, {
            productName: ['required'],
            productPrice: ['required', 'positiveNumber'],
            productQuantity: ['required', 'positiveNumber'],
            productUnit: ['required'],
            productDescription: ['required']
        });

        if (!validation.isValid) {
            Object.values(validation.errors).forEach(error => {
                toast.error('Validation Error', error);
            });
            return;
        }

        // Handle image upload
        const fileInput = document.getElementById('productImageFile');
        const file = fileInput && fileInput.files && fileInput.files[0];

        if (file) {
            imageHandler.fileToDataURL(file, { resize: true }).then(dataURL => {
                productData.image_url = dataURL;
                this.submitProduct(productId, productData);
            });
        } else {
            this.submitProduct(productId, productData);
        }
    }

    submitProduct(productId, productData) {
        let result;
        if (productId) {
            result = productService.updateProduct(productId, productData);
        } else {
            result = productService.createProduct(productData);
        }

        if (result.success) {
            toast.success('Product Saved', result.message);
            this.loadProductsTable();
            this.updateDashboardStats();
            modal.closeFormModal('productModal', true);
        } else {
            toast.error('Error', result.message);
        }
    }

    editProduct(id) {
        const product = productService.getProductById(id);
        if (product) {
            document.getElementById('productId').value = product.product_id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productUnit').value = product.unit;
            document.getElementById('productDescription').value = product.description;
            
            const preview = document.getElementById('productImagePreview');
            if (product.image_url) {
                preview.src = product.image_url;
                preview.style.display = 'inline-block';
            } else {
                preview.src = '';
                preview.style.display = 'none';
            }
            
            modal.openFormModal('productModal', 'Edit Product', {
                productId: product.product_id,
                productName: product.name,
                productPrice: product.price,
                productQuantity: product.quantity,
                productUnit: product.unit,
                productDescription: product.description
            });
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            const result = productService.deleteProduct(id);
            if (result.success) {
                toast.success('Product Deleted', result.message);
                this.loadProductsTable();
                this.updateDashboardStats();
            } else {
                toast.error('Error', result.message);
            }
        }
    }

    // Order Management
    loadOrdersTable() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        const farmerOrders = storage.getOrdersByFarmer(this.currentUser.user_id);
        const orderItems = storage.getData('order_items') || [];
        const allProducts = productService.getAllProducts();
        const allUsers = storage.getData('users') || [];

        if (farmerOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                        No orders received yet.
                    </td>
                </tr>
            `;
            return;
        }

        farmerOrders.forEach(order => {
            const items = orderItems.filter(item => item.order_id === order.order_id);
            const buyer = allUsers.find(u => u.user_id === order.buyer_id);
            
            const productNames = items.map(item => {
                const product = allProducts.find(p => p.product_id === item.product_id);
                return product ? `${item.quantity} x ${product.name}` : 'Unknown Product';
            }).join(', ');

            const row = `
                <tr>
                    <td>#${order.order_id}</td>
                    <td>${buyer ? buyer.name : 'Unknown Buyer'}</td>
                    <td>${productNames}</td>
                    <td>${items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td>₱${order.total_amount.toFixed(2)}</td>
                    <td><span class="status-badge status-${order.status}">${order.status.replace('_', ' ').toUpperCase()}</span></td>
                    <td>${new Date(order.created_at).toLocaleDateString()}</td>
                    <td class="action-buttons">
                        <button class="icon-btn" onclick="adminDashboard.updateOrderStatus('${order.order_id}')" title="Update Status">🔄</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    updateOrderStatus(id) {
        const order = storage.getOrders().find(o => o.order_id === id);
        if (order) {
            modal.openFormModal('orderModal', 'Update Order Status', {
                orderId: order.order_id,
                orderStatus: order.status
            });
        }
    }

    handleOrderSubmit(e) {
        e.preventDefault();
        
        const orderId = document.getElementById('orderId').value;
        const newStatus = document.getElementById('orderStatus').value;

        const result = storage.updateOrderStatus(orderId, newStatus);
        if (result) {
            toast.success('Success', `Order status updated to ${newStatus}`);
            this.loadOrdersTable();
            this.updateDashboardStats();
            modal.closeFormModal('orderModal', true);
        } else {
            toast.error('Error', 'Failed to update order status');
        }
    }

    // Profile Management
    loadFarmerProfileData() {
        if (!this.currentUser) return;
        
        const nameInput = document.getElementById('profileName');
        const emailInput = document.getElementById('profileEmail');
        const phoneInput = document.getElementById('profilePhone');
        const addressInput = document.getElementById('profileAddress');
        
        if (nameInput) nameInput.value = this.currentUser.name || '';
        if (emailInput) emailInput.value = this.currentUser.email || '';
        if (phoneInput) phoneInput.value = this.currentUser.phone || '';
        if (addressInput) addressInput.value = this.currentUser.address || '';
    }

    handleProfileSubmit(e) {
        e.preventDefault();
        const updateData = {
            name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value,
            address: document.getElementById('profileAddress').value
        };

        const fileInput = document.getElementById('profileImage');
        const file = fileInput && fileInput.files && fileInput.files[0];
        
        if (file) {
            imageHandler.fileToDataURL(file, { resize: true }).then(dataURL => {
                updateData.avatar_url = dataURL;
                this.saveFarmerProfile(updateData);
            });
        } else {
            this.saveFarmerProfile(updateData);
        }
    }

    saveFarmerProfile(updateData) {
        const res = auth.updateProfile(this.currentUser.user_id, updateData);
        if (res.success) {
            this.currentUser = res.user;
            this.setUserInfo();
            toast.success('Profile Updated', 'Your profile has been updated successfully!');
        } else {
            toast.error('Error', res.message);
        }
    }

    // Dashboard Stats
    updateDashboardStats() {
        const productStats = productService.getFarmerProductStats(this.currentUser.user_id);
        const farmerOrders = storage.getOrdersByFarmer(this.currentUser.user_id);
        
        const totalProductsEl = document.getElementById('totalProducts');
        const totalOrdersEl = document.getElementById('totalOrders');
        const pendingOrdersEl = document.getElementById('pendingOrders');
        const totalUsersEl = document.getElementById('totalUsers');

        if (totalProductsEl) totalProductsEl.textContent = productStats.totalProducts;
        if (totalOrdersEl) totalOrdersEl.textContent = farmerOrders.length;
        if (pendingOrdersEl) pendingOrdersEl.textContent = farmerOrders.filter(o => o.status === 'pending_payment').length;
        
        // Update total users to show total buyers (for farmer context)
        const allUsers = storage.getData('users') || [];
        const buyers = allUsers.filter(u => u.role === 'consumer');
        if (totalUsersEl) totalUsersEl.textContent = buyers.length;
    }

    // Logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            auth.logout();
            window.location.href = 'index.html';
        }
    }
}

// Create global instance
export const adminDashboard = new AdminDashboard();

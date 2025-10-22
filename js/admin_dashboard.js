// Current user and data
let currentUser = null;
let currentUserRole = 'farmer';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin Dashboard initializing...');
    
    // Check authentication
    if (!auth.isLoggedIn() || !auth.isFarmer()) {
        alert('Access denied. Farmers only.');
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = auth.getCurrentUser();
    console.log('👤 Current user:', currentUser);
    
    initializeApp();
    loadProductsTable();
    loadOrdersTable();
    updateDashboardStats();
    
    // Initialize language system
    if (typeof initLanguageControls === 'function') {
        initLanguageControls();
    }
    
    console.log('✅ Admin Dashboard initialized successfully');
});

function initializeApp() {
    // Set user info
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = 'Farmer';
    const avatar = document.getElementById('userAvatar');
    const topbarAvatar = document.getElementById('topbarAvatar');
    if (currentUser.avatar_url) {
        if (avatar) {
            avatar.src = currentUser.avatar_url;
            avatar.style.display = 'block';
        }
        if (topbarAvatar) {
            topbarAvatar.src = currentUser.avatar_url;
            topbarAvatar.style.display = 'inline-block';
        }
    }
    
    // Load farmer profile data
    loadFarmerProfileData();
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('active');
                    updateMenuVisibility();
                }
            }
        });
    });

    // Mobile/Desktop menu toggle
    const menuBtn = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Control menu button visibility based on sidebar state and viewport
    function updateMenuVisibility() {
        if (!menuBtn || !sidebar) return;
        if (window.innerWidth <= 768) {
            const open = sidebar.classList.contains('active');
            menuBtn.style.display = open ? 'none' : 'inline-block';
        } else {
            const visible = !sidebar.classList.contains('hidden');
            menuBtn.style.display = visible ? 'none' : 'inline-block';
        }
    }

    window.addEventListener('resize', updateMenuVisibility);

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', function() {
            // On small screens use .active to slide in, on larger screens hide completely with .hidden
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                const hidden = sidebar.classList.toggle('hidden');
                // Adjust main content margin when sidebar hidden on desktop
                if (hidden) {
                    mainContent.classList.add('expanded');
                } else {
                    mainContent.classList.remove('expanded');
                }
            }
            updateMenuVisibility();
        });
    }

    // Sidebar close button
    const sidebarClose = document.getElementById('sidebarClose');
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            } else {
                sidebar.classList.add('hidden');
                mainContent.classList.add('expanded');
            }
            updateMenuVisibility();
        });
    }

    // Default: close sidebar on load
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    } else {
        sidebar.classList.add('hidden');
        mainContent.classList.add('expanded');
    }
    updateMenuVisibility();

    // Form submissions
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);

    // Product image preview
    const productImageFile = document.getElementById('productImageFile');
    const productImagePreview = document.getElementById('productImagePreview');
    if (productImageFile) {
        productImageFile.addEventListener('change', function() {
            const file = this.files && this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                productImagePreview.src = e.target.result;
                productImagePreview.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        });
    }

    // Hide user management and logs for farmers
    const userNavItem = document.querySelector('[data-page="users"]');
    const logsNavItem = document.querySelector('[data-page="logs"]');
    if (userNavItem) userNavItem.style.display = 'none';
    if (logsNavItem) logsNavItem.style.display = 'none';
}

// Global refresh functions for TabSync
window.refreshProductList = function() {
    loadProductsTable();
    updateDashboardStats();
};

window.refreshOrderList = function() {
    loadOrdersTable();
    updateDashboardStats();
};

window.refreshDashboardStats = function() {
    updateDashboardStats();
};

function navigateToPage(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.add('hidden');
    });

    // Show selected page
    document.getElementById(`${page}Page`).classList.remove('hidden');
    
    // Load profile data when profile page is shown
    if (page === 'profile') {
        loadFarmerProfileData();
    }
    
    // Initialize language controls when settings page is shown
    if (page === 'settings' && typeof initLanguageControls === 'function') {
        initLanguageControls();
    }

    // Close mobile menu
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        const btn = document.getElementById('menuToggle');
        if (btn) btn.style.display = 'inline-block';
    }
}

function updateDashboardStats() {
    // Get farmer's product stats
    const productStats = productService.getFarmerProductStats(currentUser.user_id);
    
    // Get farmer's orders
    const farmerOrders = storage.getOrdersByFarmer(currentUser.user_id);
    
    document.getElementById('totalProducts').textContent = productStats.totalProducts;
    document.getElementById('totalOrders').textContent = farmerOrders.length;
    document.getElementById('pendingOrders').textContent = farmerOrders.filter(o => o.status === 'pending_payment').length;
    
    // Update total users to show total buyers (for farmer context)
    const allUsers = storage.getData('users') || [];
    const buyers = allUsers.filter(u => u.role === 'consumer');
    document.getElementById('totalUsers').textContent = buyers.length;
}

// Handle farmer profile form submit + avatar
document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('farmerProfileForm');
    if (!profileForm) return;
    profileForm.addEventListener('submit', function(e) {
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
            const reader = new FileReader();
            reader.onload = () => {
                updateData.avatar_url = reader.result; // base64 data URL
                saveFarmerProfile(updateData);
            };
            reader.readAsDataURL(file);
        } else {
            saveFarmerProfile(updateData);
        }
    });
});

function loadFarmerProfileData() {
    if (!currentUser) return;
    
    // Load existing profile data into form fields
    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    const phoneInput = document.getElementById('profilePhone');
    const addressInput = document.getElementById('profileAddress');
    
    if (nameInput) nameInput.value = currentUser.name || '';
    if (emailInput) emailInput.value = currentUser.email || '';
    if (phoneInput) phoneInput.value = currentUser.phone || '';
    if (addressInput) addressInput.value = currentUser.address || '';
}

function saveFarmerProfile(updateData) {
    const res = auth.updateProfile(currentUser.user_id, updateData);
    if (res.success) {
        currentUser = res.user;
        const avatar = document.getElementById('userAvatar');
        const topbarAvatar = document.getElementById('topbarAvatar');
        if (currentUser.avatar_url) {
            if (avatar) {
                avatar.src = currentUser.avatar_url;
                avatar.style.display = 'block';
            }
            if (topbarAvatar) {
                topbarAvatar.src = currentUser.avatar_url;
                topbarAvatar.style.display = 'inline-block';
            }
        }
        showToast('Profile Updated', 'Your profile has been updated successfully!', 'success');
    } else {
        showToast('Error', res.message, 'error');
    }
}

// User Management Functions
function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td><span class="status-badge status-${user.role}">${user.role.toUpperCase()}</span></td>
                <td><span class="status-badge status-delivered">${user.status.toUpperCase()}</span></td>
                <td class="action-buttons">
                    <button class="icon-btn" onclick="editUser(${user.user_id})" title="Edit">✏️</button>
                    <button class="icon-btn delete" onclick="deleteUser(${user.user_id})" title="Delete">🗑️</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function handleUserSubmit(e) {
    e.preventDefault();
    
    const userData = {
        id: document.getElementById('userId').value || Date.now(),
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
        role: document.getElementById('userRole').value,
        address: document.getElementById('userAddress').value,
        status: 'active'
    };

    const existingIndex = users.findIndex(u => u.user_id == userData.user_id);
    if (existingIndex !== -1) {
        users[existingIndex] = userData;
        addLog('UPDATE', 'User', `Updated user: ${userData.name}`);
    } else {
        users.push(userData);
        addLog('CREATE', 'User', `Added new user: ${userData.name}`);
    }

    loadUsersTable();
    updateDashboardStats();
    closeModal('userModal');
    document.getElementById('userForm').reset();
}

function editUser(id) {
    const user = users.find(u => u.user_id === id);
    if (user) {
        document.getElementById('userId').value = user.user_id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPhone').value = user.phone;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userAddress').value = user.address;
        document.getElementById('userModalTitle').textContent = 'Edit User';
        openModal('userModal');
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const user = users.find(u => u.user_id === id);
        users = users.filter(u => u.user_id !== id);
        addLog('DELETE', 'User', `Deleted user: ${user.name}`);
        loadUsersTable();
        updateDashboardStats();
    }
}

// Product Management Functions
function loadProductsTable() {
    const products = productService.getAllProducts();
    console.log('🖼️ Admin Dashboard - Loading products table with', products.length, 'products');
    if (products.length > 0) {
        console.log('🖼️ Admin Dashboard - First product image_url:', products[0].image_url);
    }
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    // Get products for current farmer
    const farmerProducts = productService.getProductsByFarmer(currentUser.user_id);

    if (farmerProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 2rem; color: #666;">
                    No products added yet. <a href="#" onclick="openModal('productModal')">Add your first product</a>
                </td>
            </tr>
        `;
        // Reset bulk actions when no products
        updateBulkActions();
        return;
    }

    farmerProducts.forEach(product => {
        const row = `
            <tr>
                <td>
                    <input type="checkbox" class="product-checkbox" value="${product.product_id}" onchange="updateBulkActions()">
                </td>
                <td>
                    ${product.image_url ? 
                        `<img src="${product.image_url}" alt="${product.name}" class="image-preview" onerror="console.error('Failed to load admin image:', this.src); this.style.display='none'; this.nextElementSibling.style.display='block';"><div class="image-preview placeholder" style="display:none;">🌾</div>` :
                        `<div class="image-preview placeholder">🌾</div>`
                    }
                </td>
                <td>${product.name}</td>
                <td><span class="status-badge status-confirmed">${product.category || 'vegetables'}</span></td>
                <td>₱${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>${product.unit}</td>
                <td>
                    <button class="availability-toggle ${product.is_available !== false ? 'available' : 'unavailable'}" 
                            onclick="toggleProductAvailability('${product.product_id}', ${product.is_available !== false})"
                            title="Click to toggle availability">
                        ${product.is_available !== false ? '✅ Available' : '❌ Out of Stock'}
                    </button>
                </td>
                <td>${currentUser.name}</td>
                <td class="action-buttons">
                    <button class="icon-btn" onclick="editProduct('${product.product_id}')" title="Edit">✏️</button>
                    <button class="icon-btn delete" onclick="deleteProduct('${product.product_id}')" title="Delete">🗑️</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    // Reset bulk actions after loading
    updateBulkActions();
}

function toggleProductAvailability(productId, currentStatus) {
    const newStatus = !currentStatus;
    const success = storage.updateProductAvailability(productId, newStatus);
    
    if (success) {
        showNotification(
            `Product ${newStatus ? 'marked as available' : 'marked as out of stock'}`, 
            'success'
        );
        loadProductsTable();
    } else {
        showNotification('Failed to update product availability', 'error');
    }
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        unit: document.getElementById('productUnit').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        farmer_id: currentUser.user_id
    };

    // If editing existing product, preserve existing image_url
    if (productId) {
        const existingProduct = productService.getProductById(productId);
        if (existingProduct) {
            productData.image_url = existingProduct.image_url;
        }
    } else {
        productData.image_url = null; // New product starts with no image
    }

    // If image file selected, convert to Base64 then submit
    const fileInput = document.getElementById('productImageFile');
    const file = fileInput && fileInput.files && fileInput.files[0];

    if (file) {
        // Create image element for compression
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = (e) => {
            img.onload = () => {
                // Compress using same settings as sample images
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > 800) {
                    height = (height * 800) / width;
                    width = 800;
                }
                
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                
                productData.image_url = canvas.toDataURL('image/jpeg', 0.7);
                submitProduct(productId, productData);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        return;
    }

    submitProduct(productId, productData);
}

function submitProduct(productId, productData) {
    let result;
    if (productId) {
        result = productService.updateProduct(productId, productData);
    } else {
        result = productService.createProduct(productData);
    }

    if (result.success) {
        showToast('Product Saved', result.message, 'success');
        loadProductsTable();
        updateDashboardStats();
        closeModal('productModal');
        document.getElementById('productForm').reset();
        const preview = document.getElementById('productImagePreview');
        if (preview) {
            preview.src = '';
            preview.style.display = 'none';
        }
        document.getElementById('productId').value = '';
    } else {
        showToast('Error', result.message, 'error');
    }
}

function editProduct(id) {
    const product = productService.getProductById(id);
    if (product) {
        document.getElementById('productId').value = product.product_id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productUnit').value = product.unit;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productCategory').value = product.category || 'vegetables';
        
        // Clear file input to prevent confusion
        const fileInput = document.getElementById('productImageFile');
        if (fileInput) {
            fileInput.value = '';
        }
        
        const preview = document.getElementById('productImagePreview');
        if (product.image_url) {
            preview.src = product.image_url;
            preview.style.display = 'inline-block';
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        openModal('productModal');
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const result = productService.deleteProduct(id);
        if (result.success) {
            showToast('Product Deleted', result.message, 'success');
            loadProductsTable();
            updateDashboardStats();
        } else {
            showToast('Error', result.message, 'error');
        }
    }
}

// Bulk Operations Functions
function toggleSelectAllProducts() {
    const selectAllCheckbox = document.getElementById('selectAllProducts');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    
    productCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBulkActions();
}

function updateBulkActions() {
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    const selectedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
    const selectAllCheckbox = document.getElementById('selectAllProducts');
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    const selectedCountValue = selectedCheckboxes.length;
    const totalCount = productCheckboxes.length;
    
    // Update select all checkbox state
    if (selectedCountValue === 0) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    } else if (selectedCountValue === totalCount) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
    }
    
    // Show/hide bulk actions
    if (selectedCountValue > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = `${selectedCountValue} selected`;
        bulkDeleteBtn.disabled = false;
    } else {
        bulkActions.style.display = 'none';
        bulkDeleteBtn.disabled = true;
    }
}

function bulkDeleteProducts() {
    const selectedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
    
    if (selectedIds.length === 0) {
        showToast('No Selection', 'Please select products to delete', 'warning');
        return;
    }
    
    const productNames = selectedIds.map(id => {
        const product = productService.getProductById(id);
        return product ? product.name : 'Unknown Product';
    });
    
    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} product(s)?\n\nProducts to delete:\n${productNames.join('\n')}`;
    
    if (confirm(confirmMessage)) {
        let successCount = 0;
        let errorCount = 0;
        
        selectedIds.forEach(id => {
            const result = productService.deleteProduct(id);
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }
        });
        
        if (successCount > 0) {
            showToast(
                'Bulk Delete Complete', 
                `Successfully deleted ${successCount} product(s)${errorCount > 0 ? `. ${errorCount} failed.` : '.'}`, 
                successCount === selectedIds.length ? 'success' : 'warning'
            );
            loadProductsTable();
            updateDashboardStats();
        } else {
            showToast('Bulk Delete Failed', 'No products were deleted', 'error');
        }
    }
}

// Order Management Functions
function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    // Get orders for current farmer
    const farmerOrders = storage.getOrdersByFarmer(currentUser.user_id);
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
        // Get order items for this order
        const items = orderItems.filter(item => item.order_id === order.order_id);
        const buyer = allUsers.find(u => u.user_id === order.buyer_id);
        
        // Get product names
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
                    <button class="icon-btn" onclick="updateOrderStatus('${order.order_id}')" title="Update Status">🔄</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function updateOrderStatus(id) {
    const order = storage.getOrders().find(o => o.order_id === id);
    if (order) {
        document.getElementById('orderId').value = order.order_id;
        document.getElementById('orderStatus').value = order.status;
        openModal('orderModal');
    }
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const orderId = document.getElementById('orderId').value;
    const newStatus = document.getElementById('orderStatus').value;

    const result = storage.updateOrderStatus(orderId, newStatus);
    if (result) {
        alert(`Order status updated to ${newStatus}`);
        loadOrdersTable();
        updateDashboardStats();
        closeModal('orderModal');
        document.getElementById('orderForm').reset();
    } else {
        alert('Failed to update order status');
    }
}

// Payment Management Functions
function loadPaymentsTable() {
    const tbody = document.getElementById('paymentsTableBody');
    tbody.innerHTML = '';

    payments.forEach(payment => {
        const row = `
            <tr>
                <td>${payment.id}</td>
                <td>#${payment.orderId}</td>
                <td>${payment.customer}</td>
                <td>₱${payment.amount}</td>
                <td>${payment.method}</td>
                <td><span class="status-badge status-${payment.status === 'succeeded' ? 'delivered' : payment.status}">${payment.status.toUpperCase()}</span></td>
                <td>${payment.date}</td>
                <td class="action-buttons">
                    <button class="icon-btn" onclick="viewPayment('${payment.id}')" title="View Details">👁️</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function viewPayment(id) {
    const payment = payments.find(p => p.id === id);
    if (payment) {
        alert(`Payment Details:\n\nID: ${payment.id}\nOrder: #${payment.orderId}\nCustomer: ${payment.customer}\nAmount: ₱${payment.amount}\nMethod: ${payment.method}\nStatus: ${payment.status}\nDate: ${payment.date}`);
    }
}

// Logs Functions
function loadLogsTable() {
    const tbody = document.getElementById('logsTableBody');
    tbody.innerHTML = '';

    logs.forEach(log => {
        const row = `
            <tr>
                <td>${log.timestamp}</td>
                <td>${log.user}</td>
                <td><span class="status-badge status-confirmed">${log.action}</span></td>
                <td>${log.target}</td>
                <td>${log.details}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function addLog(action, target, details) {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    logs.unshift({
        timestamp: timestamp,
        user: currentUserRole === 'admin' ? 'Admin' : 'Juan Dela Cruz',
        action: action,
        target: target,
        details: details
    });

    loadLogsTable();
}

// Settings Functions
function handleSettingsSubmit(e) {
    e.preventDefault();
    addLog('UPDATE', 'Settings', 'Updated site settings');
    alert('Settings saved successfully!');
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    
    // Reset product form when opening for new product (only if productId is empty)
    if (modalId === 'productModal') {
        const productIdField = document.getElementById('productId');
        
        // Only reset if this is for a new product (productId is empty)
        if (!productIdField.value) {
            document.getElementById('productId').value = '';
            document.getElementById('productModalTitle').textContent = 'Add New Product';
            document.getElementById('productForm').reset();
            
            // Clear image preview
            const preview = document.getElementById('productImagePreview');
            if (preview) {
                preview.src = '';
                preview.style.display = 'none';
            }
            
            // Clear file input
            const fileInput = document.getElementById('productImageFile');
            if (fileInput) {
                fileInput.value = '';
            }
        }
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Data Management Functions
function exportData() {
    try {
        const result = dataManager.downloadData();
        if (result.success) {
            showNotification('Data exported successfully!', 'success');
        } else {
            showNotification('Failed to export data: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting data', 'error');
    }
}

function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Please select a file to import', 'warning');
        return;
    }

    dataManager.uploadData(file).then(result => {
        if (result.success) {
            showNotification('Data imported successfully!', 'success');
            // Refresh all data displays
            loadProductsTable();
            loadOrdersTable();
            updateDashboardStats();
            refreshDataStats();
            // Clear file input
            fileInput.value = '';
        } else {
            showNotification('Failed to import data: ' + result.message, 'error');
        }
    });
}

function createSampleData() {
    if (confirm('This will create sample data. Continue?')) {
        try {
            // Create diverse sample products across all categories
            const sampleProducts = [
                // VEGETABLES (5 products)
                {
                    farmer_id: currentUser.user_id,
                    name: 'Kamatis',
                    description: 'Fresh red tomatoes',
                    price: 70.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'vegetables'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Sitaw',
                    description: 'Fresh string beans',
                    price: 15.00,
                    unit: 'kg',
                    quantity: 35,
                    category: 'vegetables'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Kalabasa',
                    description: 'Sweet squash',
                    price: 40.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'vegetables'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Ampalaya',
                    description: 'Bitter gourd',
                    price: 60.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'vegetables'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Pechay',
                    description: 'Chinese cabbage',
                    price: 50.00,
                    unit: 'kg',
                    quantity: 35,
                    category: 'vegetables'
                },
                
                // FRUITS (5 products)
                {
                    farmer_id: currentUser.user_id,
                    name: 'Mangga',
                    description: 'Sweet ripe mangoes',
                    price: 120.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'fruits'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Lakatan',
                    description: 'Sweet bananas',
                    price: 50.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'fruits'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Kalamansi',
                    description: 'Fresh calamansi citrus',
                    price: 30.00,
                    unit: 'kg',
                    quantity: 40,
                    category: 'fruits'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Pinya',
                    description: 'Sweet pineapples',
                    price: 80.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'fruits'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Saging',
                    description: 'Cooking bananas',
                    price: 30.00,
                    unit: 'kg',
                    quantity: 40,
                    category: 'fruits'
                },
                
                // GRAINS (3 products)
                {
                    farmer_id: currentUser.user_id,
                    name: 'Bigas',
                    description: 'Premium white rice',
                    price: 45.00,
                    unit: 'kg',
                    quantity: 100,
                    category: 'grains'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Mais',
                    description: 'Fresh corn kernels',
                    price: 25.00,
                    unit: 'kg',
                    quantity: 50,
                    category: 'grains'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Oats',
                    description: 'Organic rolled oats',
                    price: 150.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'grains'
                },
                
                // HERBS (2 products)
                {
                    farmer_id: currentUser.user_id,
                    name: 'Oregano',
                    description: 'Fresh oregano leaves',
                    price: 200.00,
                    unit: 'kg',
                    quantity: 15,
                    category: 'herbs'
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Basil',
                    description: 'Sweet basil leaves',
                    price: 180.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'herbs'
                }
            ];

                sampleProducts.forEach(productData => {
                    // Ensure all sample products have availability set to true
                    productData.is_available = true;
                    productService.createProduct(productData);
                });

            showNotification('Sample data created successfully!', 'success');
            loadProductsTable();
            updateDashboardStats();
            refreshDataStats();
        } catch (error) {
            console.error('Error creating sample data:', error);
            showNotification('Error creating sample data', 'error');
        }
    }
}

function clearAllData() {
    if (confirm('⚠️ This will permanently delete ALL data. Are you absolutely sure?')) {
        if (confirm('This action cannot be undone. Type "DELETE" to confirm.')) {
            try {
                // Clear all localStorage data
                const keys = ['users', 'products', 'carts', 'cart_items', 'orders', 'order_items', 'payments', 'subscriptions'];
                keys.forEach(key => {
                    localStorage.removeItem(key);
                });
                
                showNotification('All data cleared successfully!', 'success');
                // Refresh displays
                loadProductsTable();
                loadOrdersTable();
                updateDashboardStats();
                refreshDataStats();
            } catch (error) {
                console.error('Error clearing data:', error);
                showNotification('Error clearing data', 'error');
            }
        }
    }
}

function refreshDataStats() {
    try {
        const users = storage.getData('users') || [];
        const products = storage.getData('products') || [];
        const orders = storage.getData('orders') || [];
        const payments = storage.getData('payments') || [];
        
        const statsHtml = `
            <div class="stats-grid">
                <div class="stat-item">
                    <h4>👥 Total Users</h4>
                    <p class="stat-number">${users.length}</p>
                </div>
                <div class="stat-item">
                    <h4>🌱 Total Products</h4>
                    <p class="stat-number">${products.length}</p>
                </div>
                <div class="stat-item">
                    <h4>📦 Total Orders</h4>
                    <p class="stat-number">${orders.length}</p>
                </div>
                <div class="stat-item">
                    <h4>💳 Total Payments</h4>
                    <p class="stat-number">${payments.length}</p>
                </div>
            </div>
        `;
        
        document.getElementById('dataStats').innerHTML = statsHtml;
    } catch (error) {
        console.error('Error refreshing data stats:', error);
        document.getElementById('dataStats').innerHTML = '<p>Error loading statistics</p>';
    }
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
        window.location.href = 'index.html';
    }
}

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

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
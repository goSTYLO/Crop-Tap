// Current user and data
let currentUser = null;
let currentUserRole = 'farmer';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isLoggedIn() || !auth.isFarmer()) {
        alert('Access denied. Farmers only.');
        window.location.href = '../HTML/landing_page.html';
        return;
    }
    
    currentUser = auth.getCurrentUser();
    initializeApp();
    loadProductsTable();
    loadOrdersTable();
    updateDashboardStats();
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
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
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

function saveFarmerProfile(updateData) {
    const res = auth.updateProfile(currentUser.user_id, updateData);
    if (res.success) {
        currentUser = res.user;
        const avatar = document.getElementById('userAvatar');
        if (avatar && currentUser.avatar_url) {
            avatar.src = currentUser.avatar_url;
            avatar.style.display = 'block';
        }
        showNotification('Profile updated successfully!', 'success');
    } else {
        showNotification(res.message, 'error');
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
                    <button class="icon-btn" onclick="editUser(${user.id})" title="Edit">✏️</button>
                    <button class="icon-btn delete" onclick="deleteUser(${user.id})" title="Delete">🗑️</button>
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

    const existingIndex = users.findIndex(u => u.id == userData.id);
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
    const user = users.find(u => u.id === id);
    if (user) {
        document.getElementById('userId').value = user.id;
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
        const user = users.find(u => u.id === id);
        users = users.filter(u => u.id !== id);
        addLog('DELETE', 'User', `Deleted user: ${user.name}`);
        loadUsersTable();
        updateDashboardStats();
    }
}

// Product Management Functions
function loadProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    // Get products for current farmer
    const farmerProducts = productService.getProductsByFarmer(currentUser.user_id);

    if (farmerProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                    No products added yet. <a href="#" onclick="openModal('productModal')">Add your first product</a>
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
                <td>${currentUser.name}</td>
                <td class="action-buttons">
                    <button class="icon-btn" onclick="editProduct('${product.product_id}')" title="Edit">✏️</button>
                    <button class="icon-btn delete" onclick="deleteProduct('${product.product_id}')" title="Delete">🗑️</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
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
        image_url: null,
        farmer_id: currentUser.user_id
    };

    // If image file selected, convert to Base64 then submit
    const fileInput = document.getElementById('productImageFile');
    const file = fileInput && fileInput.files && fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            productData.image_url = reader.result; // base64 Data URL
            submitProduct(productId, productData);
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
        alert(result.message);
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
        alert(result.message);
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
            alert(result.message);
            loadProductsTable();
            updateDashboardStats();
        } else {
            alert(result.message);
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
            // Create sample products
            const sampleProducts = [
                {
                    farmer_id: currentUser.user_id,
                    name: 'Fresh Tomatoes',
                    description: 'Organic, vine-ripened tomatoes',
                    price: 3.50,
                    unit: 'lb',
                    quantity: 50
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Green Lettuce',
                    description: 'Crisp, fresh lettuce heads',
                    price: 2.00,
                    unit: 'head',
                    quantity: 30
                },
                {
                    farmer_id: currentUser.user_id,
                    name: 'Carrots',
                    description: 'Sweet, crunchy carrots',
                    price: 1.75,
                    unit: 'lb',
                    quantity: 40
                }
            ];

            sampleProducts.forEach(productData => {
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
                const keys = ['users', 'products', 'carts', 'cart_items', 'orders', 'order_items', 'payments'];
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
        window.location.href = '../HTML/landing_page.html';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
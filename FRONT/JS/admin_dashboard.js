// Sample Data Storage
let users = [
    {id: 1, name: 'Juan Dela Cruz', email: 'juan@email.com', phone: '09123456789', role: 'farmer', status: 'active', address: 'Pangasinan'},
    {id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '09234567890', role: 'buyer', status: 'active', address: 'Manila'},
    {id: 3, name: 'Pedro Reyes', email: 'pedro@email.com', phone: '09345678901', role: 'farmer', status: 'active', address: 'Pangasinan'}
];

let products = [
    {id: 1, name: 'Organic Tomatoes', category: 'vegetables', price: 80, quantity: 50, unit: 'kg', farmer: 'Juan Dela Cruz', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=100', description: 'Fresh organic tomatoes'},
    {id: 2, name: 'Fresh Lettuce', category: 'vegetables', price: 60, quantity: 30, unit: 'kg', farmer: 'Pedro Reyes', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=100', description: 'Crisp lettuce'},
    {id: 3, name: 'Sweet Corn', category: 'vegetables', price: 40, quantity: 100, unit: 'pcs', farmer: 'Juan Dela Cruz', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=100', description: 'Sweet yellow corn'}
];

let orders = [
    {id: 1001, customer: 'Maria Santos', product: 'Organic Tomatoes', quantity: 10, total: 800, status: 'pending', date: '2025-10-16'},
    {id: 1002, customer: 'Maria Santos', product: 'Fresh Lettuce', quantity: 5, total: 300, status: 'confirmed', date: '2025-10-15'},
    {id: 1003, customer: 'Juan Dela Cruz', product: 'Sweet Corn', quantity: 20, total: 800, status: 'transit', date: '2025-10-14'},
    {id: 1004, customer: 'Pedro Reyes', product: 'Organic Tomatoes', quantity: 15, total: 1200, status: 'delivered', date: '2025-10-13'}
];

let payments = [
    {id: 'PAY-1001', orderId: 1001, customer: 'Maria Santos', amount: 800, method: 'GCash', status: 'pending', date: '2025-10-16'},
    {id: 'PAY-1002', orderId: 1002, customer: 'Maria Santos', amount: 300, method: 'Cash on Delivery', status: 'succeeded', date: '2025-10-15'},
    {id: 'PAY-1003', orderId: 1003, customer: 'Juan Dela Cruz', amount: 800, method: 'Bank Transfer', status: 'succeeded', date: '2025-10-14'}
];

let logs = [
    {timestamp: '2025-10-16 14:30', user: 'Admin', action: 'CREATE', target: 'User', details: 'Added new farmer: Juan Dela Cruz'},
    {timestamp: '2025-10-16 13:15', user: 'Juan Dela Cruz', action: 'UPDATE', target: 'Product', details: 'Updated Organic Tomatoes price'},
    {timestamp: '2025-10-16 12:00', user: 'Admin', action: 'UPDATE', target: 'Order', details: 'Changed order #1001 status to confirmed'},
    {timestamp: '2025-10-16 10:45', user: 'Maria Santos', action: 'CREATE', target: 'Order', details: 'Placed new order #1005'}
];

// Current user role (can be 'admin' or 'farmer')
let currentUserRole = 'admin';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUsersTable();
    loadProductsTable();
    loadOrdersTable();
    loadPaymentsTable();
    loadLogsTable();
    updateDashboardStats();
});

function initializeApp() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Form submissions
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSubmit);

    // Hide user management for farmers
    if (currentUserRole === 'farmer') {
        document.querySelector('[data-page="users"]').style.display = 'none';
        document.querySelector('[data-page="logs"]').style.display = 'none';
    }
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
    }
}

function updateDashboardStats() {
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('pendingOrders').textContent = orders.filter(o => o.status === 'pending').length;
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
    tbody.innerHTML = '';

    const filteredProducts = currentUserRole === 'farmer' 
        ? products.filter(p => p.farmer === 'Juan Dela Cruz') 
        : products;

    filteredProducts.forEach(product => {
        const row = `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" class="image-preview"></td>
                <td>${product.name}</td>
                <td><span class="status-badge status-confirmed">${product.category}</span></td>
                <td>₱${product.price}</td>
                <td>${product.quantity}</td>
                <td>${product.unit}</td>
                <td>${product.farmer}</td>
                <td class="action-buttons">
                    <button class="icon-btn" onclick="editProduct(${product.id})" title="Edit">✏️</button>
                    <button class="icon-btn delete" onclick="deleteProduct(${product.id})" title="Delete">🗑️</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        id: document.getElementById('productId').value || Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        unit: document.getElementById('productUnit').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value || 'https://via.placeholder.com/100',
        farmer: currentUserRole === 'farmer' ? 'Juan Dela Cruz' : 'Admin'
    };

    const existingIndex = products.findIndex(p => p.id == productData.id);
    if (existingIndex !== -1) {
        products[existingIndex] = productData;
        addLog('UPDATE', 'Product', `Updated product: ${productData.name}`);
    } else {
        products.push(productData);
        addLog('CREATE', 'Product', `Added new product: ${productData.name}`);
    }

    loadProductsTable();
    updateDashboardStats();
    closeModal('productModal');
    document.getElementById('productForm').reset();
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productUnit').value = product.unit;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        openModal('productModal');
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const product = products.find(p => p.id === id);
        products = products.filter(p => p.id !== id);
        addLog('DELETE', 'Product', `Deleted product: ${product.name}`);
        loadProductsTable();
        updateDashboardStats();
    }
}

// Order Management Functions
function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    const filteredOrders = currentUserRole === 'farmer'
        ? orders.filter(o => {
            const product = products.find(p => p.name === o.product);
            return product && product.farmer === 'Juan Dela Cruz';
        })
        : orders;

    filteredOrders.forEach(order => {
        const row = `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.product}</td>
                <td>${order.quantity}</td>
                <td>₱${order.total}</td>
                <td><span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></td>
                <td>${order.date}</td>
                <td class="action-buttons">
                    <button class="icon-btn" onclick="updateOrderStatus(${order.id})" title="Update Status">🔄</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function updateOrderStatus(id) {
    const order = orders.find(o => o.id === id);
    if (order) {
        document.getElementById('orderId').value = order.id;
        document.getElementById('orderStatus').value = order.status;
        openModal('orderModal');
    }
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const orderId = parseInt(document.getElementById('orderId').value);
    const newStatus = document.getElementById('orderStatus').value;
    const notes = document.getElementById('orderNotes').value;

    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        addLog('UPDATE', 'Order', `Updated order #${orderId} status to ${newStatus}. ${notes}`);
    }

    loadOrdersTable();
    updateDashboardStats();
    closeModal('orderModal');
    document.getElementById('orderForm').reset();
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

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        alert('Logged out successfully!');
        window.location.reload();
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
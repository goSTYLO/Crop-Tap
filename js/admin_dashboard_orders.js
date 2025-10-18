// Admin Dashboard Order Management
// Handles all order-related operations

class AdminDashboardOrders {
    constructor(adminDashboard) {
        this.adminDashboard = adminDashboard;
    }

    loadOrdersTable() {
        const orders = storage.getData('orders') || [];
        const tbody = document.querySelector('#ordersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const row = this.createOrderRow(order);
            tbody.appendChild(row);
        });
    }

    createOrderRow(order) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${order.customer_email}</td>
            <td>₱${order.total.toFixed(2)}</td>
            <td><span class="status ${order.status}">${order.status}</span></td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="adminDashboard.orders.viewOrder(${order.id})">View</button>
                <button class="btn btn-sm btn-success" onclick="adminDashboard.orders.updateOrderStatus(${order.id}, 'completed')">Complete</button>
            </td>
        `;
        return row;
    }

    handleOrderSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const orderData = {
            customer_name: formData.get('customer_name'),
            customer_email: formData.get('customer_email'),
            customer_phone: formData.get('customer_phone'),
            customer_address: formData.get('customer_address'),
            items: JSON.parse(formData.get('items') || '[]'),
            total: parseFloat(formData.get('total')),
            status: 'pending'
        };

        const result = this.createOrder(orderData);
        if (result.success) {
            alert('Order created successfully!');
            e.target.reset();
            this.loadOrdersTable();
            this.adminDashboard.stats.updateDashboardStats();
        } else {
            alert('Error creating order: ' + result.message);
        }
    }

    createOrder(orderData) {
        try {
            const orders = storage.getData('orders') || [];
            const newOrder = {
                id: Date.now(),
                ...orderData,
                date: new Date().toISOString(),
                farmer_id: this.adminDashboard.currentUser.id
            };
            
            orders.push(newOrder);
            storage.saveData('orders', orders);
            
            return { success: true, order: newOrder };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    viewOrder(id) {
        const orders = storage.getData('orders') || [];
        const order = orders.find(o => o.id === id);
        if (!order) return;

        // Show order details in modal or new page
        alert(`Order Details:\n\nCustomer: ${order.customer_name}\nEmail: ${order.customer_email}\nTotal: ₱${order.total.toFixed(2)}\nStatus: ${order.status}`);
    }

    updateOrderStatus(id, status) {
        const orders = storage.getData('orders') || [];
        const orderIndex = orders.findIndex(o => o.id === id);
        if (orderIndex === -1) return;

        orders[orderIndex].status = status;
        storage.saveData('orders', orders);
        
        alert('Order status updated!');
        this.loadOrdersTable();
    }
}

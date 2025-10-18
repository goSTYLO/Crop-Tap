// Admin Dashboard Payment Management
// Handles all payment-related operations

class AdminDashboardPayments {
    constructor(adminDashboard) {
        this.adminDashboard = adminDashboard;
    }

    loadPaymentsTable() {
        const payments = storage.getData('payments') || [];
        const tbody = document.querySelector('#paymentsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        payments.forEach(payment => {
            const row = this.createPaymentRow(payment);
            tbody.appendChild(row);
        });
    }

    createPaymentRow(payment) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.id}</td>
            <td>${payment.order_id}</td>
            <td>₱${payment.amount.toFixed(2)}</td>
            <td>${payment.method}</td>
            <td><span class="status ${payment.status}">${payment.status}</span></td>
            <td>${new Date(payment.date).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="adminDashboard.payments.viewPayment(${payment.id})">View</button>
            </td>
        `;
        return row;
    }

    viewPayment(id) {
        const payments = storage.getData('payments') || [];
        const payment = payments.find(p => p.id === id);
        if (!payment) return;

        alert(`Payment Details:\n\nOrder ID: ${payment.order_id}\nAmount: ₱${payment.amount.toFixed(2)}\nMethod: ${payment.method}\nStatus: ${payment.status}`);
    }
}

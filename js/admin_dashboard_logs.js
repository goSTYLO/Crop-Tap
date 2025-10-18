// Admin Dashboard Logs Management
// Handles all log-related operations

class AdminDashboardLogs {
    constructor(adminDashboard) {
        this.adminDashboard = adminDashboard;
    }

    loadLogsTable() {
        const logs = storage.getData('logs') || [];
        const tbody = document.querySelector('#logsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        logs.forEach(log => {
            const row = this.createLogRow(log);
            tbody.appendChild(row);
        });
    }

    createLogRow(log) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.id}</td>
            <td>${log.user_id}</td>
            <td>${log.action}</td>
            <td>${log.details}</td>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
        `;
        return row;
    }
}

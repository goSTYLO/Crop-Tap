// Admin Dashboard User Management
// Handles all user-related operations

class AdminDashboardUsers {
    constructor(adminDashboard) {
        this.adminDashboard = adminDashboard;
    }

    loadUsersTable() {
        const users = storage.getData('users') || [];
        const tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = this.createUserRow(user);
            tbody.appendChild(row);
        });
    }

    createUserRow(user) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${new Date(user.created_at || Date.now()).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="adminDashboard.users.viewUser(${user.id})">View</button>
                <button class="btn btn-sm btn-warning" onclick="adminDashboard.users.editUser(${user.id})">Edit</button>
            </td>
        `;
        return row;
    }

    viewUser(id) {
        const users = storage.getData('users') || [];
        const user = users.find(u => u.id === id);
        if (!user) return;

        alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nPhone: ${user.phone || 'N/A'}`);
    }

    editUser(id) {
        const users = storage.getData('users') || [];
        const user = users.find(u => u.id === id);
        if (!user) return;

        const newName = prompt('Enter new name:', user.name);
        const newPhone = prompt('Enter new phone:', user.phone || '');
        
        if (newName && newName !== user.name) {
            user.name = newName;
            user.phone = newPhone;
            storage.saveData('users', users);
            alert('User updated successfully!');
            this.loadUsersTable();
        }
    }
}

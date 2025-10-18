// Admin Dashboard Profile Management
// Handles all profile-related operations

class AdminDashboardProfile {
    constructor(adminDashboard) {
        this.adminDashboard = adminDashboard;
    }

    loadFarmerProfileData() {
        if (!this.adminDashboard.currentUser) return;

        // Fill profile form with current user data
        document.getElementById('profileName').value = this.adminDashboard.currentUser.name;
        document.getElementById('profileEmail').value = this.adminDashboard.currentUser.email;
        document.getElementById('profilePhone').value = this.adminDashboard.currentUser.phone || '';
        document.getElementById('profileAddress').value = this.adminDashboard.currentUser.address || '';
    }

    handleProfileSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profileData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address')
        };

        const result = auth.updateProfile(profileData);
        if (result.success) {
            alert('Profile updated successfully!');
            this.adminDashboard.currentUser = auth.getCurrentUser();
            this.adminDashboard.ui.initializeUserInfo(this.adminDashboard.currentUser);
        } else {
            alert('Error updating profile: ' + result.message);
        }
    }
}

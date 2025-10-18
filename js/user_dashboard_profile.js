// User Dashboard Profile Management
// Handles user profile operations

class UserDashboardProfile {
    constructor(userDashboard) {
        this.userDashboard = userDashboard;
    }

    loadConsumerProfileData() {
        if (!this.userDashboard.currentUser) return;

        // Fill profile form with current user data
        const nameField = document.getElementById('profileName');
        const emailField = document.getElementById('profileEmail');
        const phoneField = document.getElementById('profilePhone');
        const addressField = document.getElementById('profileAddress');

        if (nameField) nameField.value = this.userDashboard.currentUser.name;
        if (emailField) emailField.value = this.userDashboard.currentUser.email;
        if (phoneField) phoneField.value = this.userDashboard.currentUser.phone || '';
        if (addressField) addressField.value = this.userDashboard.currentUser.address || '';
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
            this.userDashboard.currentUser = auth.getCurrentUser();
            this.userDashboard.ui.initializeUserInfo(this.userDashboard.currentUser);
        } else {
            alert('Error updating profile: ' + result.message);
        }
    }

    setupConsumerProfileImage() {
        const profileImageInput = document.getElementById('profileImageInput');
        const profileImagePreview = document.getElementById('profileImagePreview');
        
        if (profileImageInput && profileImagePreview) {
            profileImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profileImagePreview.src = e.target.result;
                        profileImagePreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    updateUserInfo() {
        if (!this.userDashboard.currentUser) return;

        // Update user info display
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        
        if (userNameElement) userNameElement.textContent = this.userDashboard.currentUser.name;
        if (userEmailElement) userEmailElement.textContent = this.userDashboard.currentUser.email;
    }
}

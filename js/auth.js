// Authentication Service for Crop-Tap
// Handles user registration, login, and session management

class AuthService {
    constructor() {
        // Storage will be checked in each method
    }

    getStorage() {
        if (typeof storage === 'undefined') {
            throw new Error('Storage service not available');
        }
        return storage;
    }

    // Register a new user
    register(userData) {
        try {
            // Check if email already exists
            const existingUser = this.getStorage().getUserByEmail(userData.email);
            if (existingUser) {
                return {
                    success: false,
                    message: 'Email already registered. Please use a different email or try logging in.'
                };
            }

            // Validate required fields
            if (!userData.name || !userData.email || !userData.password || !userData.role) {
                return {
                    success: false,
                    message: 'Please fill in all required fields.'
                };
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                return {
                    success: false,
                    message: 'Please enter a valid email address.'
                };
            }

            // Validate password strength
            if (userData.password.length < 6) {
                return {
                    success: false,
                    message: 'Password must be at least 6 characters long.'
                };
            }

            // Create user
            const newUser = this.getStorage().createUser(userData);
            
            return {
                success: true,
                message: 'Registration successful! You can now log in.',
                user: newUser
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Registration failed. Please try again.'
            };
        }
    }

    // Login user
    login(email, password) {
        try {
            const user = this.getStorage().getUserByEmail(email);
            
            if (!user) {
                return {
                    success: false,
                    message: 'No account found with this email address.'
                };
            }

            if (user.password !== password) {
                return {
                    success: false,
                    message: 'Incorrect password. Please try again.'
                };
            }

            // Set session
            this.getStorage().setSession(user);
            
            return {
                success: true,
                message: 'Login successful!',
                user: user
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Login failed. Please try again.'
            };
        }
    }

    // Logout user
    logout() {
        try {
            this.getStorage().clearSession();
            return {
                success: true,
                message: 'Logged out successfully.'
            };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                message: 'Logout failed.'
            };
        }
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getStorage().isLoggedIn();
    }

    // Get current user
    getCurrentUser() {
        return this.getStorage().getCurrentUser();
    }

    // Get current session
    getCurrentSession() {
        return this.getStorage().getSession();
    }

    // Check if current user is a farmer
    isFarmer() {
        const session = this.getCurrentSession();
        return session && session.role === 'farmer';
    }

    // Check if current user is a buyer/consumer
    isBuyer() {
        const session = this.getCurrentSession();
        return session && session.role === 'consumer';
    }

    // Update user profile
    updateProfile(userId, updateData) {
        try {
            const users = this.getStorage().getData('users') || [];
            const userIndex = users.findIndex(u => u.user_id === userId);
            
            if (userIndex === -1) {
                return {
                    success: false,
                    message: 'User not found.'
                };
            }

            // Update user data
            users[userIndex] = {
                ...users[userIndex],
                ...updateData,
                updated_at: new Date().toISOString()
            };

            this.getStorage().saveData('users', users);

            // Update session if it's the current user
            const session = this.getCurrentSession();
            if (session && session.user_id === userId) {
                this.getStorage().setSession(users[userIndex]);
            }

            return {
                success: true,
                message: 'Profile updated successfully.',
                user: users[userIndex]
            };
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                message: 'Profile update failed. Please try again.'
            };
        }
    }

    // Change password
    changePassword(userId, currentPassword, newPassword) {
        try {
            const user = this.getStorage().getUserById(userId);
            
            if (!user) {
                return {
                    success: false,
                    message: 'User not found.'
                };
            }

            if (user.password !== currentPassword) {
                return {
                    success: false,
                    message: 'Current password is incorrect.'
                };
            }

            if (newPassword.length < 6) {
                return {
                    success: false,
                    message: 'New password must be at least 6 characters long.'
                };
            }

            const updateResult = this.updateProfile(userId, { password: newPassword });
            
            if (updateResult.success) {
                return {
                    success: true,
                    message: 'Password changed successfully.'
                };
            } else {
                return updateResult;
            }
        } catch (error) {
            console.error('Password change error:', error);
            return {
                success: false,
                message: 'Password change failed. Please try again.'
            };
        }
    }
}

// Create global instance - wait for storage to be available
let auth;
function initializeAuth() {
    if (typeof storage !== 'undefined') {
        auth = new AuthService();
        console.log('Auth service initialized successfully');
        // Make auth globally available
        window.auth = auth;
    } else {
        console.log('Storage not ready, retrying...');
        // Retry after a short delay
        setTimeout(initializeAuth, 100);
    }
}

// Start initialization
initializeAuth();

// Expose a global logout function for UI buttons
function logout() {
    const result = auth.logout();
    // Redirect to landing page regardless of result to ensure session cleared UX
    window.location.href = 'index.html';
}
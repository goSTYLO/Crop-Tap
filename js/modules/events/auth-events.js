// Authentication Event Handlers - Based on Original Working Scripts
import { toast } from '../ui/toast.js';

export class AuthEventHandlers {
    constructor() {
        this.setupLoginEvents();
        this.setupSignupEvents();
        this.setupPasswordToggleEvents();
        this.setupRoleSelection();
    }

    // Setup login form events
    setupLoginEvents() {
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Mobile login form
        const mobileLoginForm = document.getElementById('mobileLoginForm');
        if (mobileLoginForm) {
            mobileLoginForm.addEventListener('submit', (e) => this.handleMobileLogin(e));
        }
    }

    // Setup signup form events
    setupSignupEvents() {
        const signupForm = document.getElementById('signupFormElement');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
    }

    // Setup password toggle events
    setupPasswordToggleEvents() {
        this.setupPasswordToggle('passwordInput', 'eyeBtn', 'eyeOpen', 'eyeClosed');
        this.setupPasswordToggle('confirmPassword', 'toggleConfirmPassword', 'eyeOpenConfirm', 'eyeClosedConfirm');
    }

    // Handle login form submission - EXACT COPY from original Login.js
    handleLogin(e) {
        e.preventDefault();

        const email = e.target.querySelector('input[type="email"]').value.trim();
        const password = e.target.querySelector('input[type="password"]').value.trim();

        console.log('Login attempt:', { email, password: '***' });

        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Check if auth object exists - use global auth like original
        if (typeof auth === 'undefined') {
            console.error('Auth object not found');
            alert('Authentication service not available. Please refresh the page.');
            return;
        }

        const result = auth.login(email, password);
        console.log('Login result:', result);

        if (result.success) {
            alert(result.message);

            // Redirect based on user role - EXACT COPY from original
            const user = result.user;
            if (user.role === 'farmer') {
                window.location.href = 'admin_dashboard.html';
            } else if (user.role === 'consumer') {
                window.location.href = 'user_dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert(result.message);
        }
    }

    // Handle mobile login form submission - EXACT COPY from original signUp.js
    handleMobileLogin(e) {
        e.preventDefault();
        const email = document.getElementById('mobileEmail').value.trim();
        const password = document.getElementById('mobilePassword').value;
        if (!email || !password) {
            alert('Please enter your email and password.');
            return;
        }
        const loginResult = auth.login(email, password);
        if (loginResult.success) {
            const user = auth.getCurrentUser();
            if (user?.role === 'farmer') {
                window.location.href = 'admin_dashboard.html';
            } else if (user?.role === 'consumer') {
                window.location.href = 'user_dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert(loginResult.message || 'Invalid credentials');
        }
    }

    // Handle signup form submission - EXACT COPY from original signUp.js
    handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('#password').value;
        const confirmPassword = e.target.querySelector('#confirmPassword').value;
        
        // Get selected role - EXACT COPY from original
        const selectedRoleBtn = document.querySelector('.role-btn.active');
        const role = selectedRoleBtn ? selectedRoleBtn.dataset.role : 'farmer';
        
        // Validation - EXACT COPY from original
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        // Check if auth object exists - use global auth like original
        if (typeof auth === 'undefined') {
            console.error('Auth object not found');
            alert('Authentication service not available. Please refresh the page.');
            return;
        }

        // Create user data - EXACT COPY from original
        const userData = {
            name: name,
            email: email,
            password: password,
            role: role,
            phone: '',
            address: ''
        };

        const result = auth.register(userData);
        console.log('Registration result:', result);

        if (result.success) {
            alert(result.message);
            // Redirect to login page
            window.location.href = 'login.html';
        } else {
            alert(result.message);
        }
    }

    // Setup password toggle functionality - EXACT COPY from original Login.js
    setupPasswordToggle(inputId, buttonId, openIconId, closedIconId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        const openIcon = document.getElementById(openIconId);
        const closedIcon = document.getElementById(closedIconId);

        if (input && button) {
            // Show/hide eye button based on input - EXACT COPY from original
            input.addEventListener('input', () => {
                button.style.display = input.value.length > 0 ? 'inline-flex' : 'none';
                
                if (input.value.length === 0) {
                    input.type = 'password';
                    if (openIcon) openIcon.style.display = 'block';
                    if (closedIcon) closedIcon.style.display = 'none';
                }
            });

            button.addEventListener('click', () => {
                if (input.type === 'password') {
                    input.type = 'text';
                    if (openIcon) openIcon.style.display = 'block';
                    if (closedIcon) closedIcon.style.display = 'none';
                } else {
                    input.type = 'password';
                    if (openIcon) openIcon.style.display = 'none';
                    if (closedIcon) closedIcon.style.display = 'block';
                }
            });
        }
    }

    // Setup role selection - EXACT COPY from original signUp.js
    setupRoleSelection() {
        const roleButtons = document.querySelectorAll('.role-btn');
        
        roleButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                roleButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
            });
        });
    }
}
function handleMobileLogin(e) {
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

function mobileForgotPassword() {
    const email = prompt('Enter your registered email to reset password:');
    if (!email) return;
    const users = storage.getData('users') || [];
    const exists = users.some(u => u.email === email);
    if (!exists) {
        alert('No account found with that email.');
        return;
    }
    alert('A password reset link has been sent to your email (simulated).');
}

function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('#password').value;
    const confirmPassword = e.target.querySelector('#confirmPassword').value;
    
    // Get selected role
    const selectedRoleBtn = document.querySelector('.role-btn.active');
    const role = selectedRoleBtn ? selectedRoleBtn.dataset.role : 'farmer';
    
    // Validation
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
    
    // Create user data
    const userData = {
        name: name,
        email: email,
        password: password,
        role: role
    };
    
    const result = auth.register(userData);
    
    if (result.success) {
        alert(result.message);
        
        // Auto-login after successful registration
        const loginResult = auth.login(email, password);
        if (loginResult.success) {
            // Redirect based on user role
            if (role === 'farmer') {
                window.location.href = 'admin_dashboard.html';
            } else if (role === 'consumer') {
                window.location.href = 'user_dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            window.location.href = 'login.html';
        }
    } else {
        alert(result.message);
    }
}

// Role selection functionality
const roleButtons = document.querySelectorAll('.role-btn');
let selectedRole = 'farmer'; // default

roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        roleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedRole = btn.dataset.role;
        console.log('Selected Role:', selectedRole);
    });
});

// Select password inputs and toggle buttons
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClosed = document.getElementById('eyeClosed');

const confirmPasswordInput = document.getElementById('confirmPassword');
const toggleConfirmBtn = document.getElementById('toggleConfirmPassword');
const eyeOpenConfirm = document.getElementById('eyeOpenConfirm');
const eyeClosedConfirm = document.getElementById('eyeClosedConfirm');

// Password rules
const passwordRules = document.getElementById('passwordRules');
const lengthRule = document.getElementById('length');
const caseRule = document.getElementById('case');
const numberRule = document.getElementById('number');

// Function to toggle password visibility
function togglePassword(input, eyeOpenEl, eyeClosedEl) {
    if (input.type === 'password') {
        input.type = 'text';
        eyeOpenEl.style.display = 'none';
        eyeClosedEl.style.display = 'inline';
    } else {
        input.type = 'password';
        eyeOpenEl.style.display = 'inline';
        eyeClosedEl.style.display = 'none';
    }
}

// Show/hide toggle buttons and validate password
function handlePasswordInput(input, toggleBtn, eyeOpenEl, eyeClosedEl) {
    // Show the eye button only if user typed something
    toggleBtn.style.display = input.value.length > 0 ? 'inline-flex' : 'none';

    // Reset input type and eyes if empty
    if (input.value.length === 0) {
        input.type = 'password';
        eyeOpenEl.style.display = 'inline';
        eyeClosedEl.style.display = 'none';
    }
}

// Usage for password input
passwordInput.addEventListener('input', () => {
    handlePasswordInput(passwordInput, togglePasswordBtn, eyeOpen, eyeClosed);
});

// Usage for confirm password input
confirmPasswordInput.addEventListener('input', () => {
    handlePasswordInput(confirmPasswordInput, toggleConfirmBtn, eyeOpenConfirm, eyeClosedConfirm);
});




// Password input event
passwordInput.addEventListener('input', () => {
    const value = passwordInput.value.trim();
    handlePasswordInput(passwordInput, togglePasswordBtn, eyeOpen, eyeClosed);

    // Show rules only when typing
    passwordRules.style.display = value.length > 0 ? 'block' : 'none';

    // Check length
    lengthRule.classList.toggle('valid', value.length >= 6);
    lengthRule.classList.toggle('invalid', value.length < 6);

    // Check uppercase & lowercase
    const hasUpperLower = /[a-z]/.test(value) && /[A-Z]/.test(value);
    caseRule.classList.toggle('valid', hasUpperLower);
    caseRule.classList.toggle('invalid', !hasUpperLower);

    // Check number
    const hasNumber = /\d/.test(value);
    numberRule.classList.toggle('valid', hasNumber);
    numberRule.classList.toggle('invalid', !hasNumber);
});

// Toggle password click
togglePasswordBtn.addEventListener('click', () => {
    togglePassword(passwordInput, eyeOpen, eyeClosed);
});

// Confirm password input event
confirmPasswordInput.addEventListener('input', () => {
    handlePasswordInput(confirmPasswordInput, toggleConfirmBtn, eyeOpenConfirm, eyeClosedConfirm);
});

// Toggle confirm password click
toggleConfirmBtn.addEventListener('click', () => {
    togglePassword(confirmPasswordInput, eyeOpenConfirm, eyeClosedConfirm);
});

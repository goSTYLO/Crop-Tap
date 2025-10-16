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
                window.location.href = '../HTML/landing_page.html';
            }
        } else {
            window.location.href = 'Login.html';
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

// Password validation functionality
const passwordInput = document.getElementById('password');
const passwordRules = document.getElementById('passwordRules');
const lengthRule = document.getElementById('length');
const caseRule = document.getElementById('case');
const numberRule = document.getElementById('number');

passwordInput.addEventListener('input', () => {
    const value = passwordInput.value.trim();

    // Show rules only when typing
    if (value.length > 0) {
        passwordRules.style.display = 'block';
    } else {
        passwordRules.style.display = 'none';
    }

    // Check length
    if (value.length >= 6) {
        lengthRule.classList.add('valid');
        lengthRule.classList.remove('invalid');
    } else {
        lengthRule.classList.add('invalid');
        lengthRule.classList.remove('valid');
    }

    // Check uppercase and lowercase
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) {
        caseRule.classList.add('valid');
        caseRule.classList.remove('invalid');
    } else {
        caseRule.classList.add('invalid');
        caseRule.classList.remove('valid');
    }

    // Check number
    if (/\d/.test(value)) {
        numberRule.classList.add('valid');
        numberRule.classList.remove('invalid');
    } else {
        numberRule.classList.add('invalid');
        numberRule.classList.remove('valid');
    }
});

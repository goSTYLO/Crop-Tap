function handleSignup(e) {
    e.preventDefault();
    alert('Sign up functionality will be connected to your backend here!');
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

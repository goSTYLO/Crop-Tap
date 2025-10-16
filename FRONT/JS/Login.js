// Handle login
function handleLogin(e) {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value.trim();
    const password = e.target.querySelector('input[type="password"]').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    const result = auth.login(email, password);

    if (result.success) {
        alert(result.message);

        // Redirect based on user role
        const user = result.user;
        if (user.role === 'farmer') {
            window.location.href = 'admin_dashboard.html';
        } else if (user.role === 'consumer') {
            window.location.href = 'user_dashboard.html';
        } else {
            window.location.href = '../HTML/landing_page.html';
        }
    } else {
        alert(result.message);
    }
}

// Password input and eye toggle
const passwordInput = document.getElementById('passwordInput');
const eyeBtn = document.getElementById('eyeBtn');

passwordInput.addEventListener('input', () => {
    // Show/hide eye button based on input
    eyeBtn.style.display = passwordInput.value.length > 0 ? 'inline-flex' : 'none';
    
    if (passwordInput.value.length === 0) {
        passwordInput.type = 'password';
        document.getElementById('eyeOpen').style.display = 'inline';
        document.getElementById('eyeClosed').style.display = 'none';
    }
});

function togglePassword() {
    const eyeOpen = document.getElementById('eyeOpen');
    const eyeClosed = document.getElementById('eyeClosed');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'inline';
    } else {
        passwordInput.type = 'password';
        eyeOpen.style.display = 'inline';
        eyeClosed.style.display = 'none';
    }
}

// Make sure the login button always works
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLogin);

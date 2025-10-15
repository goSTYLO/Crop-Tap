function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');
}

function handleLogin(e) {
    e.preventDefault();
    alert('Login functionality would be connected to your backend here!');
}

function handleSignup(e) {
    e.preventDefault();
    alert('Sign up functionality would be connected to your backend here!');
}
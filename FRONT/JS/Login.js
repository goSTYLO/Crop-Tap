function handleLogin(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
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
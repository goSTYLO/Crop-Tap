 // Mobile menu toggle
 const mobileMenu = document.getElementById('mobileMenu');
 const navLinks = document.getElementById('navLinks');

 mobileMenu.addEventListener('click', () => {
     navLinks.classList.toggle('active');
 });

 // Close mobile menu when clicking a link
 document.querySelectorAll('.nav-links a').forEach(link => {
     link.addEventListener('click', () => {
         navLinks.classList.remove('active');
     });
 });

 // Smooth scrolling
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function (e) {
         e.preventDefault();
         const target = document.querySelector(this.getAttribute('href'));
         if (target) {
             target.scrollIntoView({
                 behavior: 'smooth',
                 block: 'start'
             });
         }
     });
 });

 // Form submission
 document.getElementById('contactForm').addEventListener('submit', (e) => {
     e.preventDefault();
     alert('Thank you for your message! We will get back to you soon.');
     e.target.reset();
 });

 // Add scroll effect to navigation
 window.addEventListener('scroll', () => {
     const nav = document.querySelector('nav');
     if (window.scrollY > 50) {
         nav.style.background = 'linear-gradient(135deg, #1a3309 0%, #2d5016 100%)';
     } else {
         nav.style.background = 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)';
     }
 });
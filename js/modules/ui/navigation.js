// Navigation Management System
export class NavigationManager {
    constructor() {
        this.currentSection = 'home';
        this.sections = new Map();
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
    }

    // Setup mobile menu functionality
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenu');
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        // Mobile menu toggle
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        }

        // Dashboard sidebar toggle
        if (menuToggle && sidebar) {
            this.setupSidebarToggle(menuToggle, sidebar, mainContent);
        }
    }

    // Setup sidebar toggle functionality
    setupSidebarToggle(menuBtn, sidebar, mainContent) {
        // Control menu button visibility based on sidebar state and viewport
        const updateMenuVisibility = () => {
            if (!menuBtn || !sidebar) return;
            if (window.innerWidth <= 768) {
                const open = sidebar.classList.contains('active');
                menuBtn.style.display = open ? 'none' : 'inline-block';
            } else {
                const visible = !sidebar.classList.contains('hidden');
                menuBtn.style.display = visible ? 'none' : 'inline-block';
            }
        };

        window.addEventListener('resize', updateMenuVisibility);

        menuBtn.addEventListener('click', () => {
            // On small screens use .active to slide in, on larger screens hide completely with .hidden
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                const hidden = sidebar.classList.toggle('hidden');
                // Adjust main content margin when sidebar hidden on desktop
                if (hidden) {
                    mainContent.classList.add('expanded');
                } else {
                    mainContent.classList.remove('expanded');
                }
            }
            updateMenuVisibility();
        });

        // Sidebar close button
        const sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                } else {
                    sidebar.classList.add('hidden');
                    mainContent.classList.add('expanded');
                }
                updateMenuVisibility();
            });
        }

        // Default: close sidebar on load
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        } else {
            sidebar.classList.add('hidden');
            mainContent.classList.add('expanded');
        }
        updateMenuVisibility();
    }

    // Setup scroll effects
    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (nav) {
                if (window.scrollY > 50) {
                    nav.style.background = 'linear-gradient(135deg, #1a3309 0%, #2d5016 100%)';
                } else {
                    nav.style.background = 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)';
                }
            }
        });
    }

    // Setup smooth scrolling for anchor links
    setupSmoothScrolling() {
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
    }

    // Register a section for navigation
    registerSection(sectionId, element, onShow = null, onHide = null) {
        this.sections.set(sectionId, {
            element,
            onShow,
            onHide
        });
    }

    // Show a specific section
    showSection(sectionId) {
        // Hide all sections
        this.sections.forEach((section, id) => {
            if (id !== sectionId) {
                this.hideSection(id);
            }
        });

        // Show selected section
        const section = this.sections.get(sectionId);
        if (section) {
            section.element.style.display = 'block';
            if (section.onShow) {
                section.onShow();
            }
            this.currentSection = sectionId;
        }
    }

    // Hide a specific section
    hideSection(sectionId) {
        const section = this.sections.get(sectionId);
        if (section) {
            section.element.style.display = 'none';
            if (section.onHide) {
                section.onHide();
            }
        }
    }

    // Get current section
    getCurrentSection() {
        return this.currentSection;
    }

    // Setup navigation links
    setupNavigationLinks(links) {
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.dataset.section || link.getAttribute('href').substring(1);
                this.showSection(sectionId);
                
                // Update active nav links
                this.updateActiveNavLinks(link);
            });
        });
    }

    // Update active navigation links
    updateActiveNavLinks(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link, .nav-item').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Setup dashboard navigation
    setupDashboardNavigation() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
    }

    // Navigate to a specific page (for dashboard)
    navigateToPage(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.add('hidden');
        });

        // Show selected page
        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // Close mobile menu
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            const btn = document.getElementById('menuToggle');
            if (btn) btn.style.display = 'inline-block';
        }
    }

    // Toggle mobile navigation
    toggleMobileNav() {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.toggle('open');
        }
    }
}

// Create global instance
export const navigation = new NavigationManager();

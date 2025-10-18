// Toast Notification System - OOP Approach (No Server Required)

class Toast {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    init() {
        this.createContainer();
        this.setupStyles();
    }

    createContainer() {
        // Check if container already exists
        this.container = document.getElementById('toastContainer');
        
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    setupStyles() {
        // Add styles if not already present
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 400px;
                }
                
                .toast {
                    background: white;
                    border-radius: 8px;
                    padding: 16px 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-left: 4px solid #007bff;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                    position: relative;
                }
                
                .toast.success {
                    border-left-color: #28a745;
                }
                
                .toast.error {
                    border-left-color: #dc3545;
                }
                
                .toast.warning {
                    border-left-color: #ffc107;
                }
                
                .toast.info {
                    border-left-color: #17a2b8;
                }
                
                .toast-icon {
                    font-size: 20px;
                    flex-shrink: 0;
                }
                
                .toast-content {
                    flex: 1;
                }
                
                .toast-title {
                    font-weight: 600;
                    margin: 0 0 4px 0;
                    color: #333;
                }
                
                .toast-message {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #999;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .toast-close:hover {
                    color: #333;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                .toast.slide-out {
                    animation: slideOut 0.3s ease-in forwards;
                }
            `;
            document.head.appendChild(style);
        }
    }

    show(message, type = 'info', title = null, duration = 3000) {
        const id = Date.now().toString();
        const toast = this.createToast(id, message, type, title);
        
        this.container.appendChild(toast);
        this.toasts.set(id, toast);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }

        return id;
    }

    createToast(id, message, type, title) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.dataset.id = id;

        const icon = this.getIcon(type);
        const closeButton = this.createCloseButton(id);

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
        `;

        toast.appendChild(closeButton);
        return toast;
    }

    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    createCloseButton(id) {
        const button = document.createElement('button');
        button.className = 'toast-close';
        button.innerHTML = '×';
        button.onclick = () => this.remove(id);
        return button;
    }

    remove(id) {
        const toast = this.toasts.get(id);
        if (toast) {
            toast.classList.add('slide-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.toasts.delete(id);
            }, 300);
        }
    }

    clear() {
        this.toasts.forEach((toast, id) => {
            this.remove(id);
        });
    }

    // Convenience methods
    success(message, title = null, duration = 3000) {
        return this.show(message, 'success', title, duration);
    }

    error(message, title = null, duration = 5000) {
        return this.show(message, 'error', title, duration);
    }

    warning(message, title = null, duration = 4000) {
        return this.show(message, 'warning', title, duration);
    }

    info(message, title = null, duration = 3000) {
        return this.show(message, 'info', title, duration);
    }
}

// Create and export toast instance
const toast = new Toast();
export { toast };
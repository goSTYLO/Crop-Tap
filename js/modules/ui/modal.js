// Modal Management System - OOP Approach (No Server Required)

class Modal {
    constructor() {
        this.activeModals = new Map();
        this.init();
    }

    init() {
        this.setupStyles();
        this.setupGlobalEventListeners();
    }

    setupStyles() {
        // Add styles if not already present
        if (!document.getElementById('modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .modal-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }
                
                .modal {
                    background: white;
                    border-radius: 8px;
                    padding: 24px;
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                
                .modal-overlay.active .modal {
                    transform: scale(1);
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #eee;
                }
                
                .modal-title {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0;
                    color: #333;
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }
                
                .modal-close:hover {
                    background: #f5f5f5;
                    color: #333;
                }
                
                .modal-body {
                    margin-bottom: 20px;
                }
                
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    padding-top: 16px;
                    border-top: 1px solid #eee;
                }
                
                .modal-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .modal {
                        margin: 20px;
                        max-width: calc(100vw - 40px);
                        max-height: calc(100vh - 40px);
                    }
                    
                    .modal-footer {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupGlobalEventListeners() {
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });

        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                const modalId = e.target.dataset.modalId;
                if (modalId) {
                    this.close(modalId);
                }
            }
        });
    }

    show(content, options = {}) {
        const id = options.id || this.generateId();
        const modal = this.createModal(id, content, options);
        
        document.body.appendChild(modal);
        this.activeModals.set(id, modal);

        // Trigger animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        return id;
    }

    createModal(id, content, options) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.dataset.modalId = id;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.dataset.id = id;

        // Handle different content types
        if (typeof content === 'string') {
            modal.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            modal.appendChild(content);
        } else if (typeof content === 'object' && content.template) {
            modal.innerHTML = this.renderTemplate(content.template, content.data || {});
        }

        // Add close button if not present
        if (!modal.querySelector('.modal-close')) {
            const closeButton = this.createCloseButton(id);
            const header = modal.querySelector('.modal-header') || this.createHeader(modal, options.title);
            header.appendChild(closeButton);
        }

        overlay.appendChild(modal);
        return overlay;
    }

    createHeader(modal, title) {
        let header = modal.querySelector('.modal-header');
        if (!header) {
            header = document.createElement('div');
            header.className = 'modal-header';
            modal.insertBefore(header, modal.firstChild);
        }

        if (title && !header.querySelector('.modal-title')) {
            const titleElement = document.createElement('h3');
            titleElement.className = 'modal-title';
            titleElement.textContent = title;
            header.insertBefore(titleElement, header.firstChild);
        }

        return header;
    }

    createCloseButton(id) {
        const button = document.createElement('button');
        button.className = 'modal-close';
        button.innerHTML = '×';
        button.onclick = () => this.close(id);
        return button;
    }

    renderTemplate(template, data) {
        // Simple template rendering
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || '';
        });
    }

    close(id) {
        const modal = this.activeModals.get(id);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                this.activeModals.delete(id);
            }, 300);
        }
    }

    closeAll() {
        this.activeModals.forEach((modal, id) => {
            this.close(id);
        });
    }

    generateId() {
        return 'modal_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Convenience methods for common modal types
    confirm(message, onConfirm, onCancel = null) {
        const content = `
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-action="cancel">Cancel</button>
                <button type="button" class="btn btn-primary" data-action="confirm">Confirm</button>
            </div>
        `;

        const id = this.show(content, { title: 'Confirm Action' });
        const modal = this.activeModals.get(id);

        modal.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'confirm') {
                if (onConfirm) onConfirm();
                this.close(id);
            } else if (e.target.dataset.action === 'cancel') {
                if (onCancel) onCancel();
                this.close(id);
            }
        });

        return id;
    }

    alert(message, type = 'info') {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const content = `
            <div class="modal-body">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 24px;">${icons[type] || icons.info}</span>
                    <p style="margin: 0;">${message}</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-action="ok">OK</button>
            </div>
        `;

        const id = this.show(content, { title: this.capitalize(type) });
        const modal = this.activeModals.get(id);

        modal.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'ok') {
                this.close(id);
            }
        });

        return id;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Create and export modal instance
const modal = new Modal();
export { modal };
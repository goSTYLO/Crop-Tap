// Form Validation System
import { APP_CONFIG } from '../core/constants.js';
import { Utils } from '../core/utils.js';

export class FormValidator {
    constructor() {
        this.rules = new Map();
        this.setupDefaultRules();
    }

    setupDefaultRules() {
        // Email validation
        this.addRule('email', (value) => {
            if (!value) return { valid: false, message: 'Email is required' };
            if (!Utils.isValidEmail(value)) return { valid: false, message: 'Please enter a valid email address' };
            return { valid: true };
        });

        // Password validation
        this.addRule('password', (value) => {
            if (!value) return { valid: false, message: 'Password is required' };
            const validation = Utils.validatePassword(value);
            if (!validation.isValid) {
                const messages = [];
                if (!validation.length) messages.push('at least 6 characters');
                if (!validation.case) messages.push('uppercase and lowercase letters');
                if (!validation.number) messages.push('at least one number');
                return { valid: false, message: `Password must contain ${messages.join(', ')}` };
            }
            return { valid: true };
        });

        // Required field validation
        this.addRule('required', (value) => {
            if (!value || value.toString().trim() === '') {
                return { valid: false, message: 'This field is required' };
            }
            return { valid: true };
        });

        // Phone validation
        this.addRule('phone', (value) => {
            if (!value) return { valid: true }; // Optional field
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                return { valid: false, message: 'Please enter a valid phone number' };
            }
            return { valid: true };
        });

        // Number validation
        this.addRule('number', (value) => {
            if (!value) return { valid: true }; // Optional field
            const num = parseFloat(value);
            if (isNaN(num)) {
                return { valid: false, message: 'Please enter a valid number' };
            }
            return { valid: true };
        });

        // Positive number validation
        this.addRule('positiveNumber', (value) => {
            if (!value) return { valid: true }; // Optional field
            const num = parseFloat(value);
            if (isNaN(num) || num <= 0) {
                return { valid: false, message: 'Please enter a positive number' };
            }
            return { valid: true };
        });
    }

    addRule(name, validator) {
        this.rules.set(name, validator);
    }

    validateField(value, rules) {
        if (!Array.isArray(rules)) {
            rules = [rules];
        }

        for (const rule of rules) {
            if (typeof rule === 'string') {
                const validator = this.rules.get(rule);
                if (validator) {
                    const result = validator(value);
                    if (!result.valid) {
                        return result;
                    }
                }
            } else if (typeof rule === 'function') {
                const result = rule(value);
                if (!result.valid) {
                    return result;
                }
            }
        }

        return { valid: true };
    }

    validateForm(form, fieldRules) {
        const errors = {};
        let isValid = true;

        Object.keys(fieldRules).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
            if (field) {
                const value = field.value;
                const rules = fieldRules[fieldName];
                const result = this.validateField(value, rules);
                
                if (!result.valid) {
                    errors[fieldName] = result.message;
                    isValid = false;
                }
            }
        });

        return { isValid, errors };
    }

    // Real-time validation for form fields
    setupRealTimeValidation(form, fieldRules) {
        Object.keys(fieldRules).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateAndShowError(field, fieldRules[fieldName]);
                });

                field.addEventListener('input', () => {
                    this.clearFieldError(field);
                });
            }
        });
    }

    validateAndShowError(field, rules) {
        const result = this.validateField(field.value, rules);
        
        if (!result.valid) {
            this.showFieldError(field, result.message);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 12px;
            margin-top: 4px;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Common validation patterns
    static createMinLengthRule(minLength) {
        return (value) => {
            if (!value) return { valid: true };
            if (value.length < minLength) {
                return { valid: false, message: `Must be at least ${minLength} characters` };
            }
            return { valid: true };
        };
    }

    static createMaxLengthRule(maxLength) {
        return (value) => {
            if (!value) return { valid: true };
            if (value.length > maxLength) {
                return { valid: false, message: `Must be no more than ${maxLength} characters` };
            }
            return { valid: true };
        };
    }

    static createRangeRule(min, max) {
        return (value) => {
            if (!value) return { valid: true };
            const num = parseFloat(value);
            if (isNaN(num)) {
                return { valid: false, message: 'Please enter a valid number' };
            }
            if (num < min || num > max) {
                return { valid: false, message: `Must be between ${min} and ${max}` };
            }
            return { valid: true };
        };
    }

    static createMatchRule(targetFieldName, message = 'Fields do not match') {
        return (value, form) => {
            if (!form) return { valid: true };
            const targetField = form.querySelector(`[name="${targetFieldName}"], #${targetFieldName}`);
            if (!targetField) return { valid: true };
            
            if (value !== targetField.value) {
                return { valid: false, message };
            }
            return { valid: true };
        };
    }
}

// Create global instance
export const formValidator = new FormValidator();

/**
 * Contact Form Simulation, Validation, & Persistent Database Engine Hook
 */
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.toastContainer = document.getElementById('toast-container');
        
        if (this.form) {
            this.inputs = this.form.querySelectorAll('.form-input');
            this.submitBtn = this.form.querySelector('.btn-submit');
            this.init();
        }
    }

    init() {
        // Build toast container if missing dynamically
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'toast-container';
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }

        this.bindEvents();
    }

    bindEvents() {
        // Intercept standard form submissions
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Add live input listener validations (clearing error borders on user type)
        this.inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateField(e.target);
            });
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });
        });
    }

    // Individual Input Validations
    validateField(input) {
        const group = input.closest('.form-group');
        if (!group) return true;

        const val = input.value.trim();
        const errorMsgEl = group.querySelector('.form-error-msg');
        let isValid = true;
        let errorText = '';

        // Validation criteria mapping
        if (input.name === 'name') {
            if (val.length === 0) {
                isValid = false;
                errorText = 'Full Name is required.';
            } else if (val.length < 2) {
                isValid = false;
                errorText = 'Name must be at least 2 characters long.';
            }
        } else if (input.name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (val.length === 0) {
                isValid = false;
                errorText = 'Email address is required.';
            } else if (!emailRegex.test(val)) {
                isValid = false;
                errorText = 'Please enter a valid email format (e.g. name@domain.com).';
            }
        } else if (input.name === 'message') {
            if (val.length === 0) {
                isValid = false;
                errorText = 'Message content is required.';
            } else if (val.length < 10) {
                isValid = false;
                errorText = 'Please write a message of at least 10 characters.';
            }
        }

        // Apply visual error classes
        if (!isValid) {
            group.classList.add('error');
            if (errorMsgEl) errorMsgEl.textContent = errorText;
        } else {
            group.classList.remove('error');
            if (errorMsgEl) errorMsgEl.textContent = '';
        }

        return isValid;
    }

    // Submit Trigger
    handleSubmit() {
        let isFormValid = true;

        // Force check all fields
        this.inputs.forEach(input => {
            const check = this.validateField(input);
            if (!check) isFormValid = false;
        });

        if (!isFormValid) {
            this.showToast('Validation Error', 'Please correct the errors in the form before submitting.', 'error');
            return;
        }

        // Form Approved - Trigger Simulated API Dispatch
        this.setLoadingState(true);

        // Fetch inputs data
        const payload = {
            name: this.form.name.value.trim(),
            email: this.form.email.value.trim(),
            message: this.form.message.value.trim()
        };

        // Simulate 1.2s Network Delay (Database connection / Email dispatch)
        setTimeout(() => {
            // Write payload into client DB messages collection!
            window.db.insertMessage(payload);

            this.setLoadingState(false);
            this.showToast(
                'Message Sent Successfully!',
                `Thank you, ${payload.name}! Open the DB Console (bottom-right) to view it inside the database.`,
                'success'
            );

            // Clean form inputs
            this.form.reset();
            
            // Explicitly trigger blur on inputs to float labels back down
            this.inputs.forEach(input => {
                input.dispatchEvent(new Event('placeholder-shown'));
            });
        }, 1200);
    }

    setLoadingState(isLoading) {
        if (!this.submitBtn) return;

        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = `
                <span>Sending Message...</span>
                <svg class="btn-spinner" width="16" height="16" viewBox="0 0 50 50" fill="none" style="animation: spin 1s linear infinite;">
                    <circle cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" stroke-dasharray="80 20" style="opacity: 0.75;"></circle>
                </svg>
            `;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = `
                <span>Send Message</span>
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            `;
        }
    }

    // Dynamic Sliding Toast Builder
    showToast(title, message, type = 'success') {
        if (!this.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const successIcon = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>`;

        const errorIcon = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>`;

        const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;

        toast.innerHTML = `
            ${type === 'success' ? successIcon : errorIcon}
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <div class="toast-close">
                ${closeIcon}
            </div>
            <div class="toast-progress"></div>
        `;

        this.toastContainer.appendChild(toast);

        // Slide in entry trigger
        setTimeout(() => toast.classList.add('active'), 10);

        // Close Bindings
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.dismissToast(toast));

        // Progress Bar timing animation
        const progressBar = toast.querySelector('.toast-progress');
        progressBar.style.transition = 'width 5000ms linear';
        setTimeout(() => progressBar.style.width = '0%', 20);

        // Auto-dismiss after 5s
        const autoDismiss = setTimeout(() => {
            this.dismissToast(toast);
        }, 5000);

        toast.dataset.timeoutId = autoDismiss;
    }

    dismissToast(toast) {
        toast.classList.remove('active');
        clearTimeout(parseInt(toast.dataset.timeoutId));
        
        // Remove node from DOM after transit finishes
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }
}
window.ContactFormHandler = ContactFormHandler;

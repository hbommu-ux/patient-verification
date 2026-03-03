/**
 * Alert Component
 * Based on Natera Design System tokens
 * Variants: filled, outlined
 * Severities: error, warning, info, success
 */

class Alert {
    constructor(options = {}) {
        this.severity = options.severity || 'info';
        this.variant = options.variant || 'filled';
        this.title = options.title || '';
        this.message = options.message || '';
        this.closable = options.closable !== false;
        this.icon = options.icon !== false;
        this.onClose = options.onClose || null;
        this.onClick = options.onClick || null;
        this.element = null;
    }

    // Design tokens for alert colors
    static colors = {
        error: {
            fill: '#fce9e9',       // red-50
            content: '#cd1d1d',    // red-600
            border: '#f9d7d7',     // red-100
            message: '#e85e5e',    // red-400
            icon: '#e23636'        // red-500
        },
        warning: {
            fill: '#ffede5',       // orange-50
            content: '#eb4200',    // orange-600
            border: '#ffded1',     // orange-100
            message: '#ff7b47',    // orange-400
            icon: '#ff5b1a'        // orange-500
        },
        info: {
            fill: '#daf2f6',       // turquoise-100
            content: '#268697',    // turquoise-700
            border: '#b6e4ed',     // turquoise-200
            message: '#2fa7bc',    // turquoise-600
            icon: '#47bcd1'        // turquoise-500
        },
        success: {
            fill: '#ddf3eb',       // basil-100
            content: '#318c6c',    // basil-700
            border: '#bbe7d8',     // basil-200
            message: '#3dae86',    // basil-600
            icon: '#55c39d'        // basil-500
        }
    };

    // SVG icons for each severity
    static icons = {
        error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.57465 3.21665L1.51632 14.5C1.37079 14.7521 1.29379 15.0378 1.29298 15.3288C1.29216 15.6198 1.36756 15.906 1.51167 16.1588C1.65579 16.4117 1.86359 16.6222 2.11456 16.7696C2.36554 16.917 2.65087 16.996 2.94182 17H17.0585C17.3494 16.996 17.6348 16.917 17.8857 16.7696C18.1367 16.6222 18.3445 16.4117 18.4886 16.1588C18.6327 15.906 18.7081 15.6198 18.7073 15.3288C18.7065 15.0378 18.6295 14.7521 18.484 14.5L11.4257 3.21665C11.2766 2.97174 11.0673 2.76925 10.8173 2.62825C10.5674 2.48726 10.2853 2.41272 9.99848 2.41272C9.71168 2.41272 9.42959 2.48726 9.17965 2.62825C8.92971 2.76925 8.72043 2.97174 8.57132 3.21665H8.57465Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 7.5V10.8333M10 14.1667H10.0083" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 13.3333V10M10 6.66667H10.0083" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 10L9 12L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    };

    // Close icon
    static closeIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    getStyles() {
        const colors = Alert.colors[this.severity];
        const isOutlined = this.variant === 'outlined';

        return {
            container: {
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontFamily: "'Roboto', sans-serif",
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.25px',
                backgroundColor: isOutlined ? 'transparent' : colors.fill,
                border: `1px solid ${colors.border}`,
                color: colors.content,
                cursor: this.onClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s ease',
            },
            iconWrapper: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: colors.icon,
            },
            content: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
            },
            title: {
                fontWeight: 500,
                color: colors.content,
            },
            message: {
                color: colors.message,
            },
            closeButton: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: colors.content,
                opacity: 0.7,
                transition: 'opacity 0.2s ease, background-color 0.2s ease',
            }
        };
    }

    render() {
        const styles = this.getStyles();
        const colors = Alert.colors[this.severity];

        // Create container
        this.element = document.createElement('div');
        this.element.className = `alert alert-${this.severity} alert-${this.variant}`;
        this.element.setAttribute('role', 'alert');
        Object.assign(this.element.style, styles.container);

        // Add click handler
        if (this.onClick) {
            this.element.addEventListener('click', (e) => {
                if (!e.target.closest('.alert-close-btn')) {
                    this.onClick(e);
                }
            });
            this.element.addEventListener('mouseenter', () => {
                if (this.variant === 'outlined') {
                    this.element.style.backgroundColor = colors.fill;
                }
            });
            this.element.addEventListener('mouseleave', () => {
                if (this.variant === 'outlined') {
                    this.element.style.backgroundColor = 'transparent';
                }
            });
        }

        // Add icon
        if (this.icon) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'alert-icon';
            Object.assign(iconWrapper.style, styles.iconWrapper);
            iconWrapper.innerHTML = Alert.icons[this.severity];
            this.element.appendChild(iconWrapper);
        }

        // Add content
        const content = document.createElement('div');
        content.className = 'alert-content';
        Object.assign(content.style, styles.content);

        if (this.title) {
            const title = document.createElement('div');
            title.className = 'alert-title';
            Object.assign(title.style, styles.title);
            title.textContent = this.title;
            content.appendChild(title);
        }

        if (this.message) {
            const message = document.createElement('div');
            message.className = 'alert-message';
            Object.assign(message.style, styles.message);
            message.textContent = this.message;
            content.appendChild(message);
        }

        this.element.appendChild(content);

        // Add close button
        if (this.closable) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'alert-close-btn';
            closeBtn.setAttribute('aria-label', 'Close alert');
            Object.assign(closeBtn.style, styles.closeButton);
            closeBtn.innerHTML = Alert.closeIcon;

            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.opacity = '1';
                closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
            });
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.opacity = '0.7';
                closeBtn.style.backgroundColor = 'transparent';
            });
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });

            this.element.appendChild(closeBtn);
        }

        return this.element;
    }

    close() {
        if (this.element) {
            this.element.style.opacity = '0';
            this.element.style.transform = 'translateY(-10px)';
            this.element.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
                if (this.onClose) {
                    this.onClose();
                }
            }, 200);
        }
    }

    // Static method to show alert
    static show(options) {
        const alert = new Alert(options);
        return alert.render();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Alert;
}

// Natera HUB - Patient Verification Interface

// Patient Data Store
const patientsData = {
    'brittney-spears': {
        id: 'brittney-spears',
        firstName: 'Brittney',
        middleName: '',
        lastName: 'Spears',
        alternateLast: '',
        dob: '07/30/1982',
        biologicalSex: 'Female',
        preferredLanguage: '',
        preferredName: '',
        phone: '978-621-2279',
        altPhone: '',
        email: '',
        altEmail: '',
        verificationDate: '03/03/2025',
        authorizedContact: 'Raymond Spears',
        addresses: [
            {
                type: 'primary',
                country: 'United States',
                address: '888 N San Mateo Dr',
                apartment: 'Unit 34B',
                city: 'San Mateo',
                zipcode: '94401',
                state: 'CA'
            },
            {
                type: 'alternate',
                country: 'United States',
                address: '125 Lincoln ave',
                apartment: 'Apartment 12',
                city: 'Miami',
                zipcode: '779032',
                state: 'FL'
            }
        ]
    },
    'nicole-kidman': {
        id: 'nicole-kidman',
        firstName: 'Nicole',
        middleName: 'Mary',
        lastName: 'Kidman',
        alternateLast: '',
        dob: '06/20/1967',
        biologicalSex: 'Female',
        preferredLanguage: 'English',
        preferredName: 'Nic',
        phone: '310-555-0142',
        altPhone: '310-555-0198',
        email: 'nicole.k@email.com',
        altEmail: '',
        verificationDate: '01/15/2026',
        authorizedContact: 'Keith Urban',
        addresses: [
            {
                type: 'primary',
                country: 'United States',
                address: '1200 Beverly Hills Dr',
                apartment: '',
                city: 'Los Angeles',
                zipcode: '90210',
                state: 'CA'
            },
            {
                type: 'alternate',
                country: 'United States',
                address: '450 Music Row',
                apartment: 'Suite 100',
                city: 'Nashville',
                zipcode: '37203',
                state: 'TN'
            }
        ]
    }
};

let currentPatient = 'brittney-spears';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize patient selector
    initPatientSelector();

    // Initialize verification alert based on date
    initVerificationAlert();

    // Initialize form change tracking for Save/Cancel buttons
    initFormChangeTracking();
    // Navigation link active state handling
    const navLinks = document.querySelectorAll('.profile-nav .nav-link');
    const formSections = document.querySelectorAll('.form-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Intersection Observer for scroll spy
    const observerOptions = {
        root: document.querySelector('.form-content'),
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, observerOptions);

    formSections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });

    // Sidebar icon buttons
    const sidebarBtns = document.querySelectorAll('.sidebar-icon-btn');
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sidebarBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            document.querySelector('.activity-timeline').scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Save button
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            if (saveBtn.disabled) return;

            const formData = collectFormData();
            console.log('Saving patient data:', formData);
            showNotification('Patient profile saved successfully!', 'success');

            // After saving, update initial values and disable buttons
            saveInitialFormState();
            setFormButtonsState(false);
        });
    }

    // Cancel button
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (cancelBtn.disabled) return;

            if (confirm('Are you sure you want to discard changes?')) {
                // Restore initial values
                restoreInitialFormState();
                setFormButtonsState(false);
            }
        });
    }

    // Re-verify button
    const reverifyBtn = document.getElementById('reverify-btn');
    if (reverifyBtn) {
        reverifyBtn.addEventListener('click', function() {
            const alertEl = document.getElementById('verification-alert');
            const alertMessage = alertEl?.querySelector('.alert-message');

            // Show verifying state
            if (alertMessage) {
                alertMessage.textContent = 'Verifying patient...';
            }
            reverifyBtn.disabled = true;
            reverifyBtn.textContent = 'VERIFYING...';

            setTimeout(() => {
                const today = new Date();
                const formattedDate = today.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                });

                // Update with new verification date
                if (alertMessage) {
                    alertMessage.textContent = `Patient verified on ${formattedDate}`;
                }

                // Update alert state (newly verified = success/green)
                updateVerificationAlertState(alertEl, today);

                reverifyBtn.disabled = false;
                reverifyBtn.textContent = 'VERIFY';
            }, 1500);
        });
    }

    // New patient button
    const newPatientBtn = document.querySelector('.new-patient-btn');
    if (newPatientBtn) {
        newPatientBtn.addEventListener('click', function() {
            if (confirm('Create a new patient profile?')) {
                clearAllForms();
                showNotification('New patient form ready', 'info');
            }
        });
    }

    // Add address button
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim();
            if (btnText.includes('ADDRESS')) {
                addNewAddress();
            } else if (btnText.includes('INSURANCE')) {
                addNewInsurance();
            } else if (btnText.includes('CONTACT')) {
                addNewContact();
            } else if (btnText.includes('CLINIC')) {
                addNewClinic();
            }
        });
    });

    // Clear buttons in inputs
    document.querySelectorAll('.clear-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                input.focus();
            }
        });
    });

    // Delete buttons for cards (billing, contacts, clinic)
    document.querySelectorAll('.card-wrapper .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.card-wrapper');
            if (card && confirm('Are you sure you want to delete this item?')) {
                card.style.opacity = '0';
                card.style.transform = 'translateX(-20px)';
                card.style.transition = 'all 0.3s ease';
                setTimeout(() => card.remove(), 300);
                showNotification('Item deleted', 'success');
            }
        });
    });

    // Delete buttons for address entries
    document.querySelectorAll('.address-entry[data-address-type="alternate"] .delete-btn').forEach(btn => {
        attachAddressDeleteHandler(btn);
    });

    // Set as primary address checkbox
    document.querySelectorAll('.checkbox-label input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                showNotification('Address will be set as primary on save', 'info');
            }
        });
    });

    // Timeline action buttons
    document.querySelectorAll('.timeline-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle active state for demonstration
            this.classList.toggle('active');
        });
    });

    // Filter button
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            showNotification('Filter options would appear here', 'info');
        });
    }

    // Back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            // In a real app, this would navigate back
            showNotification('Navigation would go back', 'info');
        });
    }
});

// Helper Functions
function collectFormData() {
    const inputs = document.querySelectorAll('.form-content input, .form-content select');
    const data = {};
    inputs.forEach(input => {
        const label = input.closest('.form-group')?.querySelector('label')?.textContent;
        if (label) {
            data[label] = input.value;
        }
    });
    return data;
}

function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                left: 20px;
                padding: 14px 20px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 14px;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            }
            .notification-success {
                background: #0081bd;
                color: white;
            }
            .notification-info {
                background: #268697;
                color: white;
            }
            .notification-error {
                background: #cd1d1d;
                color: white;
            }
            .notification button {
                background: transparent;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0 4px;
                line-height: 1;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

function addNewAddress() {
    const addressesContainer = document.querySelector('.addresses-container');
    if (!addressesContainer) return;

    // Count existing alternate addresses
    const alternateAddresses = addressesContainer.querySelectorAll('[data-address-type="alternate"]');
    const count = alternateAddresses.length + 1;

    const newEntry = document.createElement('div');
    newEntry.className = 'address-entry';
    newEntry.setAttribute('data-address-type', 'alternate');
    newEntry.innerHTML = `
        <div class="address-entry-header">
            <span class="address-label">Alternate Address ${count}</span>
            <button class="delete-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M12 4v8a1 1 0 01-1 1H5a1 1 0 01-1-1V4" stroke="#9CA3AF" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
        <div class="form-grid">
            <div class="form-group full-width">
                <label>Country/Region</label>
                <div class="select-wrapper">
                    <select>
                        <option selected>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                    </select>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
            <div class="form-group full-width">
                <label>Address</label>
                <input type="text" placeholder="Street address">
            </div>
            <div class="form-group full-width">
                <label>Apartment, suite, unit</label>
                <input type="text" placeholder="Apt, suite, unit">
            </div>
            <div class="form-group">
                <label>City</label>
                <input type="text" placeholder="City">
            </div>
            <div class="form-group">
                <label>Zipcode</label>
                <input type="text" placeholder="Zipcode">
            </div>
            <div class="form-group">
                <label>State</label>
                <div class="select-wrapper">
                    <select>
                        <option value="">Select...</option>
                        <option>CA</option>
                        <option>NY</option>
                        <option>TX</option>
                        <option>FL</option>
                    </select>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
        </div>
        <label class="checkbox-label">
            <input type="checkbox">
            <span>Set as Primary Address</span>
        </label>
    `;

    addressesContainer.appendChild(newEntry);
    attachAddressDeleteHandler(newEntry.querySelector('.delete-btn'));
    showNotification('New address added', 'success');
}

function addNewInsurance() {
    const billingSection = document.querySelector('#billing');
    if (!billingSection) return;

    const wrapper = billingSection.querySelector('.card-wrapper');
    if (!wrapper) return;

    const newWrapper = wrapper.cloneNode(true);
    newWrapper.querySelectorAll('input').forEach(input => input.value = '');
    newWrapper.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

    wrapper.after(newWrapper);
    attachDeleteHandler(newWrapper.querySelector('.delete-btn'));
    showNotification('New insurance added', 'success');
}

function addNewContact() {
    const contactsSection = document.querySelector('#contacts');
    if (!contactsSection) return;

    const wrapper = contactsSection.querySelector('.card-wrapper');
    if (!wrapper) return;

    const newWrapper = wrapper.cloneNode(true);
    newWrapper.querySelectorAll('input').forEach(input => input.value = '');
    newWrapper.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

    wrapper.after(newWrapper);
    attachDeleteHandler(newWrapper.querySelector('.delete-btn'));
    showNotification('New contact added', 'success');
}

function addNewClinic() {
    const clinicSection = document.querySelector('#clinic');
    if (!clinicSection) return;

    const wrapper = clinicSection.querySelector('.card-wrapper');
    if (!wrapper) return;

    const newWrapper = wrapper.cloneNode(true);
    newWrapper.querySelectorAll('input').forEach(input => input.value = '');

    wrapper.after(newWrapper);
    attachDeleteHandler(newWrapper.querySelector('.delete-btn'));
    showNotification('New clinic added', 'success');
}

function attachDeleteHandler(btn) {
    if (!btn) return;
    btn.addEventListener('click', function() {
        const card = this.closest('.address-card, .card-wrapper');
        if (card && confirm('Are you sure you want to delete this item?')) {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'all 0.3s ease';
            setTimeout(() => card.remove(), 300);
            showNotification('Item deleted', 'success');
        }
    });
}

function attachAddressDeleteHandler(btn) {
    if (!btn) return;
    btn.addEventListener('click', function() {
        const entry = this.closest('.address-entry');
        if (entry && confirm('Are you sure you want to delete this address?')) {
            entry.style.opacity = '0';
            entry.style.transform = 'translateX(-20px)';
            entry.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                entry.remove();
                // Renumber remaining alternate addresses
                renumberAlternateAddresses();
            }, 300);
            showNotification('Address deleted', 'success');
        }
    });
}

function renumberAlternateAddresses() {
    const alternateAddresses = document.querySelectorAll('.address-entry[data-address-type="alternate"]');
    alternateAddresses.forEach((entry, index) => {
        const label = entry.querySelector('.address-label');
        if (label) {
            label.textContent = `Alternate Address ${index + 1}`;
        }
    });
}

// ===== Patient Selector Functions =====

function initPatientSelector() {
    const dropdownBtn = document.getElementById('patient-dropdown-btn');
    const dropdown = document.getElementById('patient-dropdown');
    const patientOptions = document.querySelectorAll('.patient-option');

    if (!dropdownBtn || !dropdown) return;

    // Toggle dropdown
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdown.classList.remove('open');
    });

    // Prevent dropdown from closing when clicking inside
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Patient option click
    patientOptions.forEach(option => {
        option.addEventListener('click', function() {
            const patientId = this.dataset.patient;
            if (patientId !== currentPatient) {
                switchPatient(patientId);
            }
            dropdown.classList.remove('open');
        });
    });
}

function switchPatient(patientId) {
    const patient = patientsData[patientId];
    if (!patient) return;

    // Update current patient
    currentPatient = patientId;

    // Update active state in dropdown
    document.querySelectorAll('.patient-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.patient === patientId) {
            opt.classList.add('active');
        }
    });

    // Update patient name in header
    document.getElementById('patient-name').textContent = `${patient.firstName} ${patient.lastName}`;

    // Update breadcrumb
    const breadcrumbName = document.getElementById('breadcrumb-patient-name');
    if (breadcrumbName) {
        breadcrumbName.textContent = `${patient.firstName} ${patient.lastName}`;
    }

    // Update patient info row
    updatePatientInfoRow(patient);

    // Update form fields
    updateFormFields(patient);

    // Update verification alert
    updateVerificationDate(patient.verificationDate);

    // Reset form state
    saveInitialFormState();
    setFormButtonsState(false);

    showNotification(`Switched to ${patient.firstName} ${patient.lastName}`, 'info');
}

function updatePatientInfoRow(patient) {
    const infoItems = document.querySelectorAll('.patient-info-row .info-item');

    // Update DOB (first two info items show the same date in the original)
    if (infoItems[0]) {
        infoItems[0].querySelector('span').textContent = patient.dob;
    }
    if (infoItems[1]) {
        infoItems[1].querySelector('span').textContent = patient.dob;
    }

    // Update phone
    if (infoItems[2]) {
        infoItems[2].querySelector('span').textContent = patient.phone;
    }

    // Update authorized contact
    if (infoItems[3]) {
        const contactSpan = infoItems[3].querySelectorAll('span')[0];
        if (contactSpan) {
            contactSpan.textContent = patient.authorizedContact;
        }
    }
}

function updateFormFields(patient) {
    // Demographic Information
    const demographicSection = document.getElementById('demographic');
    if (demographicSection) {
        const inputs = demographicSection.querySelectorAll('input');
        const selects = demographicSection.querySelectorAll('select');

        if (inputs[0]) inputs[0].value = patient.firstName;
        if (inputs[1]) inputs[1].value = patient.middleName;
        if (inputs[2]) inputs[2].value = patient.lastName;
        if (inputs[3]) inputs[3].value = patient.alternateLast;
        if (inputs[4]) inputs[4].value = patient.dob;
        if (inputs[5]) inputs[5].value = patient.preferredName;

        if (selects[0]) {
            selectOptionByText(selects[0], patient.biologicalSex);
        }
        if (selects[1]) {
            selectOptionByText(selects[1], patient.preferredLanguage);
        }
    }

    // Phone & Email
    const phoneSection = document.getElementById('phone-email');
    if (phoneSection) {
        const inputs = phoneSection.querySelectorAll('input');
        if (inputs[0]) inputs[0].value = patient.phone || '';
        if (inputs[1]) inputs[1].value = patient.altPhone || '';
        if (inputs[2]) inputs[2].value = patient.email || '';
        if (inputs[3]) inputs[3].value = patient.altEmail || '';
    }

    // Update addresses
    updateAddresses(patient.addresses);
}

function updateAddresses(addresses) {
    const container = document.querySelector('.addresses-container');
    if (!container) return;

    // Clear existing addresses
    container.innerHTML = '';

    addresses.forEach((addr, index) => {
        const isPrimary = addr.type === 'primary';
        const entry = document.createElement('div');
        entry.className = 'address-entry';
        entry.setAttribute('data-address-type', addr.type);

        entry.innerHTML = `
            <div class="address-entry-header">
                <span class="address-label">${isPrimary ? 'Primary Address' : `Alternate Address ${index}`}</span>
                ${!isPrimary ? `
                    <button class="delete-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M12 4v8a1 1 0 01-1 1H5a1 1 0 01-1-1V4" stroke="#9CA3AF" stroke-width="1.2" stroke-linecap="round"/>
                        </svg>
                    </button>
                ` : ''}
            </div>
            <div class="form-grid">
                <div class="form-group full-width">
                    <label>Country/Region</label>
                    <div class="select-wrapper">
                        <select>
                            <option ${addr.country === 'United States' ? 'selected' : ''}>United States</option>
                            <option ${addr.country === 'Canada' ? 'selected' : ''}>Canada</option>
                            <option ${addr.country === 'Mexico' ? 'selected' : ''}>Mexico</option>
                        </select>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6l4 4 4-4" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label>Address</label>
                    <div class="input-with-clear">
                        <input type="text" value="${addr.address}">
                        <button class="clear-btn">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M4 4l6 6M10 4l-6 6" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label>Apartment, suite, unit</label>
                    <input type="text" value="${addr.apartment}">
                </div>
                <div class="form-group">
                    <label>City</label>
                    <input type="text" value="${addr.city}">
                </div>
                <div class="form-group">
                    <label>Zipcode</label>
                    <input type="text" value="${addr.zipcode}">
                </div>
                <div class="form-group">
                    <label>State</label>
                    <div class="select-wrapper">
                        <select>
                            <option value="">Select...</option>
                            <option ${addr.state === 'CA' ? 'selected' : ''}>CA</option>
                            <option ${addr.state === 'NY' ? 'selected' : ''}>NY</option>
                            <option ${addr.state === 'TX' ? 'selected' : ''}>TX</option>
                            <option ${addr.state === 'FL' ? 'selected' : ''}>FL</option>
                            <option ${addr.state === 'TN' ? 'selected' : ''}>TN</option>
                        </select>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6l4 4 4-4" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>
            </div>
            ${!isPrimary ? `
                <label class="checkbox-label">
                    <input type="checkbox">
                    <span>Set as Primary Address</span>
                </label>
            ` : ''}
        `;

        container.appendChild(entry);

        // Attach delete handler for alternate addresses
        if (!isPrimary) {
            const deleteBtn = entry.querySelector('.delete-btn');
            if (deleteBtn) {
                attachAddressDeleteHandler(deleteBtn);
            }
        }

        // Attach clear button handlers
        entry.querySelectorAll('.clear-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                if (input) {
                    input.value = '';
                    input.focus();
                }
            });
        });
    });
}

function updateVerificationDate(dateString) {
    const alertEl = document.getElementById('verification-alert');
    const alertMessage = alertEl?.querySelector('.alert-message');

    if (alertMessage) {
        alertMessage.textContent = `Patient verified on ${dateString}`;
    }

    // Parse and update alert state
    const dateMatch = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (dateMatch) {
        const [, month, day, year] = dateMatch;
        const verificationDate = new Date(year, month - 1, day);
        updateVerificationAlertState(alertEl, verificationDate);
    }
}

function selectOptionByText(selectElement, text) {
    if (!selectElement || !text) return;

    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text === text) {
            selectElement.selectedIndex = i;
            return;
        }
    }
}

function clearAllForms() {
    document.querySelectorAll('.form-content input').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('.form-content select').forEach(select => {
        select.selectedIndex = 0;
    });
}

// ===== Verification Alert Logic =====

/**
 * Initialize the verification alert based on the verification date
 */
function initVerificationAlert() {
    const alertEl = document.getElementById('verification-alert');
    const alertMessage = alertEl?.querySelector('.alert-message');

    if (!alertEl || !alertMessage) return;

    // Parse the verification date from the message
    // Format: "Patient verified on MM/DD/YYYY"
    const messageText = alertMessage.textContent;
    const dateMatch = messageText.match(/(\d{2})\/(\d{2})\/(\d{4})/);

    if (dateMatch) {
        const [, month, day, year] = dateMatch;
        const verificationDate = new Date(year, month - 1, day);
        updateVerificationAlertState(alertEl, verificationDate);
    }
}

/**
 * Update the verification alert state based on how old the verification is
 * @param {HTMLElement} alertEl - The alert element
 * @param {Date} verificationDate - The date of verification
 */
function updateVerificationAlertState(alertEl, verificationDate) {
    if (!alertEl) return;

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Remove existing state classes
    alertEl.classList.remove('alert-success', 'alert-warning', 'alert-info', 'alert-error');

    // Check if verification is older than 6 months
    if (verificationDate < sixMonthsAgo) {
        // Older than 6 months - warning/orange
        alertEl.classList.add('alert-warning');
        updateAlertIcon(alertEl, 'warning');
    } else {
        // Less than 6 months - success/green
        alertEl.classList.add('alert-success');
        updateAlertIcon(alertEl, 'success');
    }
}

/**
 * Update the alert icon based on state
 * @param {HTMLElement} alertEl - The alert element
 * @param {string} state - 'success' or 'warning'
 */
function updateAlertIcon(alertEl, state) {
    const iconEl = alertEl?.querySelector('.alert-icon');
    if (!iconEl) return;

    if (state === 'warning') {
        // Warning triangle icon
        iconEl.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57465 3.21665L1.51632 14.5C1.37079 14.7521 1.29379 15.0378 1.29298 15.3288C1.29216 15.6198 1.36756 15.906 1.51167 16.1588C1.65579 16.4117 1.86359 16.6222 2.11456 16.7696C2.36554 16.917 2.65087 16.996 2.94182 17H17.0585C17.3494 16.996 17.6348 16.917 17.8857 16.7696C18.1367 16.6222 18.3445 16.4117 18.4886 16.1588C18.6327 15.906 18.7081 15.6198 18.7073 15.3288C18.7065 15.0378 18.6295 14.7521 18.484 14.5L11.4257 3.21665C11.2766 2.97174 11.0673 2.76925 10.8173 2.62825C10.5674 2.48726 10.2853 2.41272 9.99848 2.41272C9.71168 2.41272 9.42959 2.48726 9.17965 2.62825C8.92971 2.76925 8.72043 2.97174 8.57132 3.21665H8.57465Z" fill="currentColor"/>
                <path d="M10 7.5V10.8333" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="10" cy="13.5" r="0.75" fill="white"/>
            </svg>
        `;
    } else {
        // Success checkmark icon
        iconEl.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="currentColor"/>
                <path d="M7 10L9 12L13 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
}

// ===== Form Change Tracking for Save/Cancel Buttons =====

// Store initial form values
let initialFormState = {};

/**
 * Initialize form change tracking
 * Save initial state and set up change listeners
 */
function initFormChangeTracking() {
    // Save initial form state
    saveInitialFormState();

    // Disable Save/Cancel buttons initially
    setFormButtonsState(false);

    // Add change listeners to all form inputs
    const formContent = document.querySelector('.form-content');
    if (!formContent) return;

    // Listen for input changes
    formContent.addEventListener('input', handleFormChange);
    formContent.addEventListener('change', handleFormChange);
}

/**
 * Save the initial state of all form inputs
 */
function saveInitialFormState() {
    initialFormState = {};
    const formContent = document.querySelector('.form-content');
    if (!formContent) return;

    const inputs = formContent.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
        const key = input.id || input.name || `field_${index}`;
        if (input.type === 'checkbox') {
            initialFormState[key] = input.checked;
        } else {
            initialFormState[key] = input.value;
        }
    });
}

/**
 * Restore form to initial state
 */
function restoreInitialFormState() {
    const formContent = document.querySelector('.form-content');
    if (!formContent) return;

    const inputs = formContent.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
        const key = input.id || input.name || `field_${index}`;
        if (initialFormState.hasOwnProperty(key)) {
            if (input.type === 'checkbox') {
                input.checked = initialFormState[key];
            } else {
                input.value = initialFormState[key];
            }
        }
    });
}

/**
 * Check if form has changes compared to initial state
 * @returns {boolean}
 */
function hasFormChanges() {
    const formContent = document.querySelector('.form-content');
    if (!formContent) return false;

    const inputs = formContent.querySelectorAll('input, select, textarea');
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const key = input.id || input.name || `field_${i}`;

        if (initialFormState.hasOwnProperty(key)) {
            if (input.type === 'checkbox') {
                if (input.checked !== initialFormState[key]) return true;
            } else {
                if (input.value !== initialFormState[key]) return true;
            }
        }
    }

    return false;
}

/**
 * Handle form input changes
 */
function handleFormChange() {
    const hasChanges = hasFormChanges();
    setFormButtonsState(hasChanges);
}

/**
 * Enable or disable Save and Cancel buttons
 * @param {boolean} enabled
 */
function setFormButtonsState(enabled) {
    const saveBtn = document.querySelector('.save-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    if (saveBtn) {
        saveBtn.disabled = !enabled;
    }
    if (cancelBtn) {
        cancelBtn.disabled = !enabled;
    }
}


// State Management
let currentStep = 1;
let selectedPlan = null;
const formData = {
    accountName: '',
    displayName: '',
    email: '',
    password: '',
    facilityName: '',
    plan: ''
};

// Plan names mapping
const planNames = {
    light: 'ライト（¥9,800/月）',
    standard: 'スタンダード（¥14,800/月）',
    premium: 'プレミアム（¥19,800/月）'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add input event listeners for real-time validation
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });

    // Terms checkbox listener
    const termsCheckbox = document.getElementById('termsAgree');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = !this.checked;
        });
    }

    // Plan card click handlers
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        card.addEventListener('click', function() {
            const plan = this.dataset.plan;
            selectPlan(plan);
        });
    });
});

// Validate individual input
function validateInput(input) {
    const value = input.value.trim();
    
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            input.style.borderColor = '#ef4444';
            return false;
        }
    }
    
    if (input.type === 'password') {
        if (value && value.length < 8) {
            input.style.borderColor = '#ef4444';
            return false;
        }
    }
    
    if (value) {
        input.style.borderColor = '#10b981';
    } else {
        input.style.borderColor = '#d1d5db';
    }
    
    return true;
}

// Validate step
function validateStep(step) {
    switch(step) {
        case 1:
            const accountName = document.getElementById('accountName').value.trim();
            const displayName = document.getElementById('displayName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!accountName || !displayName || !email || !password) {
                alert('すべての必須項目を入力してください。');
                return false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('有効なメールアドレスを入力してください。');
                return false;
            }
            
            if (password.length < 8) {
                alert('パスワードは8文字以上で入力してください。');
                return false;
            }
            
            // Save form data
            formData.accountName = accountName;
            formData.displayName = displayName;
            formData.email = email;
            formData.password = password;
            
            return true;
            
        case 2:
            const facilityName = document.getElementById('facilityName').value.trim();
            
            if (!facilityName) {
                alert('施設名を入力してください。');
                return false;
            }
            
            formData.facilityName = facilityName;
            return true;
            
        case 3:
            if (!selectedPlan) {
                alert('プランを選択してください。');
                return false;
            }
            
            formData.plan = selectedPlan;
            return true;
            
        default:
            return true;
    }
}

// Navigate to next step
function nextStep(step) {
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    
    // Update step indicator
    updateStepIndicator(step);
    
    // Show next step
    if (step === 4) {
        // Update summary before showing
        updateSummary();
    }
    document.getElementById(`step${step}`).classList.remove('hidden');
    
    currentStep = step;
    
    // Scroll to top of card
    document.querySelector('.signup-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Navigate to previous step
function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.add('hidden');
    
    // Update step indicator
    updateStepIndicator(step);
    
    // Show previous step
    document.getElementById(`step${step}`).classList.remove('hidden');
    
    currentStep = step;
    
    // Scroll to top of card
    document.querySelector('.signup-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Update step indicator
function updateStepIndicator(activeStep) {
    const steps = document.querySelectorAll('.step');
    const lines = document.querySelectorAll('.step-line');
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < activeStep) {
            step.classList.add('completed');
        } else if (stepNum === activeStep || (activeStep === 4 && stepNum === 3)) {
            step.classList.add('active');
        }
    });
    
    lines.forEach((line, index) => {
        line.classList.remove('completed');
        if (index + 1 < activeStep) {
            line.classList.add('completed');
        }
    });
}

// Select plan
function selectPlan(plan) {
    selectedPlan = plan;
    
    // Update UI
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.plan === plan) {
            card.classList.add('selected');
        }
    });
    
    // Move to confirmation step
    setTimeout(() => {
        nextStep(4);
    }, 300);
}

// Update summary
function updateSummary() {
    document.getElementById('summaryAccountName').textContent = formData.accountName;
    document.getElementById('summaryDisplayName').textContent = formData.displayName;
    document.getElementById('summaryEmail').textContent = formData.email;
    document.getElementById('summaryFacilityName').textContent = formData.facilityName;
    document.getElementById('summaryPlan').textContent = planNames[formData.plan] || '-';
}

// Submit form
function submitForm() {
    const termsCheckbox = document.getElementById('termsAgree');
    if (!termsCheckbox.checked) {
        alert('利用規約に同意してください。');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '処理中...';
    
    // Simulate API call
    setTimeout(() => {
        // Hide step 4
        document.getElementById('step4').classList.add('hidden');
        
        // Hide step indicator
        document.querySelector('.step-indicator').style.display = 'none';
        
        // Show completion
        document.getElementById('complete').classList.remove('hidden');
        
        // Log form data (for demo)
        console.log('Form submitted:', formData);
    }, 1500);
}

// Utility: Add ripple effect to buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-plan').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * VERDANT ECOSYSTEMS | 2027 SUSTAINABILITY PLATFORM
 * Client-Side Authentication Engine (Login & Register)
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Password Toggle Eye ---
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      
      const icon = btn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  });

  // --- Demo Credentials Auto-Fill ---
  const fillDemoBtn = document.getElementById('fillDemoCredentials');
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      if (emailInput && passInput) {
        emailInput.value = 'sustainability.director@verdant.eco';
        passInput.value = 'Verdant2027#EcoPass';
        window.showToast('Demo credentials filled!', 'info');
      }
    });
  }

  // --- Login Form Submission ---
  const loginForm = document.getElementById('verdantLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const remember = document.getElementById('rememberMe')?.checked;

      if (!email || !password) {
        window.showToast('Please enter both email and password.', 'error');
        return;
      }

      // Check registered users in localStorage or accept demo login
      const registeredUsers = JSON.parse(localStorage.getItem('verdant_registered_users') || '[]');
      const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      const activeSession = {
        name: user ? user.name : (email.split('@')[0].replace('.', ' ').toUpperCase()),
        email: email,
        loginTime: new Date().toISOString(),
        rememberMe: !!remember
      };

      localStorage.setItem('verdant_active_user', JSON.stringify(activeSession));
      window.showToast('Welcome back to Verdant Ecosystems! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);
    });
  }

  // --- Registration Form Submission ---
  const registerForm = document.getElementById('verdantRegisterForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;
      const terms = document.getElementById('regTerms').checked;

      if (!name || !email || !phone || !password || !confirmPassword) {
        window.showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (password.length < 6) {
        window.showToast('Password must be at least 6 characters.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        window.showToast('Passwords do not match. Please re-enter.', 'error');
        return;
      }

      if (!terms) {
        window.showToast('You must agree to the Terms of Service & Privacy Policy.', 'error');
        return;
      }

      // Save user
      const users = JSON.parse(localStorage.getItem('verdant_registered_users') || '[]');
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        window.showToast('An account with this email already exists. Please log in.', 'error');
        return;
      }

      const newUser = { name, email, phone, password, createdAt: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem('verdant_registered_users', JSON.stringify(users));

      // Auto login
      localStorage.setItem('verdant_active_user', JSON.stringify({
        name: name,
        email: email,
        loginTime: new Date().toISOString()
      }));

      window.showToast('Account created successfully! Welcome to Verdant.', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);
    });
  }

});

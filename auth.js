// Registered users database (stored in localStorage for static site)
// Structure: { email, password, name, verified }

// Initialize EmailJS
emailjs.init('Qun865-3iZq1tZjC7');

class AuthManager {
	constructor() {
		this.currentEmail = null;
		this.currentName = null;
		this.currentVerificationCode = null;
		this.currentResetCode = null;
		this.initializeApp();
	}

	initializeApp() {
		this.setupTabSwitching();
		this.setupFormHandlers();
		this.setupPasswordToggles();
		this.checkExistingLogin();
	}

	// Check if user is already logged in
	checkExistingLogin() {
		const user = localStorage.getItem('loggedInUser');
		if (user) {
			window.location.href = 'index.html';
		}
	}

	// Setup tab switching
	setupTabSwitching() {
		const tabBtns = document.querySelectorAll('.tab-btn');
		tabBtns.forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				this.switchTab(btn.dataset.tab);
			});
		});

		// Forgot password link
		const forgotLink = document.getElementById('forgotPasswordLink');
		if (forgotLink) {
			forgotLink.addEventListener('click', (e) => {
				e.preventDefault();
				this.switchTab('forgotPassword');
			});
		}

		// Back links
		const backLink = document.getElementById('backLink');
		if (backLink) {
			backLink.addEventListener('click', (e) => {
				e.preventDefault();
				this.switchTab('signin');
			});
		}
	}

	// Switch active tab
	switchTab(tabName) {
		// Hide all tabs
		const tabs = document.querySelectorAll('.tab-content');
		tabs.forEach(tab => tab.classList.remove('active'));

		// Remove active from all buttons
		const buttons = document.querySelectorAll('.tab-btn');
		buttons.forEach(btn => btn.classList.remove('active'));

		// Show selected tab
		const selectedTab = document.getElementById(tabName);
		if (selectedTab) {
			selectedTab.classList.add('active');
		}

		// Update back link visibility
		const backLink = document.getElementById('backLink');
		if (tabName === 'verify' || tabName === 'forgotPassword' || tabName === 'resetPassword') {
			backLink.style.display = 'block';
		} else {
			backLink.style.display = 'none';
		}

		// Activate button if it exists
		const button = document.querySelector(`[data-tab="${tabName}"]`);
		if (button && (tabName === 'signin' || tabName === 'signup')) {
			button.classList.add('active');
		}
	}

	// Setup form handlers
	setupFormHandlers() {
		// Sign In Form
		const signinForm = document.getElementById('signinForm');
		if (signinForm) {
			signinForm.addEventListener('submit', (e) => {
				e.preventDefault();
				this.handleSignIn();
			});
		}

		// Sign Up Form
		const signupForm = document.getElementById('signupForm');
		if (signupForm) {
			signupForm.addEventListener('submit', (e) => {
				e.preventDefault();
				this.handleSignUp();
			});
		}

		// Verify Form
		const verifyForm = document.getElementById('verifyForm');
		if (verifyForm) {
			verifyForm.addEventListener('submit', (e) => {
				e.preventDefault();
				this.handleVerification();
			});
		}

		// Forgot Password Form
		const forgotForm = document.getElementById('forgotForm');
		if (forgotForm) {
			forgotForm.addEventListener('submit', (e) => {
				e.preventDefault();
				this.handleForgotPassword();
			});
		}

		// Reset Password Form
		const resetForm = document.getElementById('resetForm');
		if (resetForm) {
			resetForm.addEventListener('submit', (e) => {
				e.preventDefault();
				this.handleResetPassword();
			});
		}
	}

	// Setup password visibility toggles
	setupPasswordToggles() {
		const toggleButtons = document.querySelectorAll('.password-toggle');
		toggleButtons.forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				const targetId = btn.dataset.target;
				const inputField = document.getElementById(targetId);
				
				if (inputField) {
					// Toggle between password and text
					if (inputField.type === 'password') {
						inputField.type = 'text';
						btn.textContent = '🙈';
					} else {
						inputField.type = 'password';
						btn.textContent = '👁️';
					}
				}
			});
		});
	}

	// Generate random 6-digit code
	generateCode() {
		return String(Math.floor(100000 + Math.random() * 900000));
	}

	// Get registered users (from localStorage)
	getUsers() {
		const users = localStorage.getItem('globaffairs_users');
		return users ? JSON.parse(users) : [];
	}

	// Save users to localStorage
	saveUsers(users) {
		localStorage.setItem('globaffairs_users', JSON.stringify(users));
	}

	// Find user by email
	findUserByEmail(email) {
		const users = this.getUsers();
		return users.find(u => u.email.toLowerCase() === email.toLowerCase());
	}

	// Handle Sign In
	handleSignIn() {
		const email = document.getElementById('signin-email').value.trim();
		const password = document.getElementById('signin-password').value.trim();
		const messageDiv = document.getElementById('signin-message');

		// Validation
		if (!email || !password) {
			this.showMessage(messageDiv, 'Please fill in all fields!', 'error');
			return;
		}

		// Check user
		const user = this.findUserByEmail(email);

		if (!user) {
			this.showMessage(messageDiv, 'Email not registered. Please sign up first!', 'error');
			return;
		}

		if (user.password !== password) {
			this.showMessage(messageDiv, 'Invalid password!', 'error');
			return;
		}

		// Login successful
		this.showMessage(messageDiv, 'Login successful! Redirecting...', 'success');
		localStorage.setItem('loggedInUser', JSON.stringify({
			email: user.email,
			name: user.name
		}));

		setTimeout(() => {
			window.location.href = 'index.html';
		}, 1500);
	}

	// Handle Sign Up
	handleSignUp() {
		const name = document.getElementById('signup-name').value.trim();
		const email = document.getElementById('signup-email').value.trim();
		const password = document.getElementById('signup-password').value.trim();
		const confirm = document.getElementById('signup-confirm').value.trim();
		const messageDiv = document.getElementById('signup-message');

		// Validation
		if (!name || !email || !password || !confirm) {
			this.showMessage(messageDiv, 'Please fill in all fields!', 'error');
			return;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			this.showMessage(messageDiv, 'Please enter a valid email!', 'error');
			return;
		}

		// Check password length
		if (password.length < 6) {
			this.showMessage(messageDiv, 'Password must be at least 6 characters!', 'error');
			return;
		}

		// Check passwords match
		if (password !== confirm) {
			this.showMessage(messageDiv, 'Passwords do not match!', 'error');
			return;
		}

		// Check if email already exists
		if (this.findUserByEmail(email)) {
			this.showMessage(messageDiv, 'Email already registered! Please sign in instead.', 'error');
			return;
		}

		// Generate verification code
		this.currentEmail = email;
		this.currentName = name;
		this.currentVerificationCode = this.generateCode();

		// Store temporary data
		sessionStorage.setItem('signup_name', name);
		sessionStorage.setItem('signup_email', email);
		sessionStorage.setItem('signup_password', password);

		// Send verification code via email
		this.sendVerificationEmail(name, email, this.currentVerificationCode, messageDiv);
	}

	// Send verification email using EmailJS
	sendVerificationEmail(name, email, code, messageDiv) {
		const templateParams = {
			to_email: email,
			user_name: name,
			user_email: email,
			verification_code: code
		};

		emailjs.send('service_dipb9c7', 'template_l7kf18s', templateParams)
			.then(() => {
				this.showMessage(messageDiv, 'Verification code sent to your email!', 'success');
				setTimeout(() => {
					this.showVerificationTab();
				}, 1000);
			})
			.catch((error) => {
				console.log('EmailJS Error:', error);
				// Fallback if email service fails
				this.showMessage(messageDiv, 'Code displayed on next screen. (Email service unavailable)', 'success');
				setTimeout(() => {
					this.showVerificationTab();
				}, 1000);
			});
	}

	// Show verification tab
	showVerificationTab() {
		document.getElementById('verify').classList.add('active');
		document.getElementById('signup').classList.remove('active');
		document.getElementById('verification-email').textContent = `Code sent to: ${this.currentEmail}`;

		// Hide tab buttons
		document.querySelectorAll('.tab-btn').forEach(btn => btn.style.display = 'none');

		// Show back link
		document.getElementById('backLink').style.display = 'block';
		document.getElementById('backLink').onclick = (e) => {
			e.preventDefault();
			this.resetVerification();
		};
	}

	// Handle Email Verification
	handleVerification() {
		const code = document.getElementById('verify-code').value.trim();
		const messageDiv = document.getElementById('verify-message');

		if (!code) {
			this.showMessage(messageDiv, 'Please enter the verification code!', 'error');
			return;
		}

		if (code !== this.currentVerificationCode) {
			this.showMessage(messageDiv, 'Invalid verification code!', 'error');
			return;
		}

		// Create account
		const name = sessionStorage.getItem('signup_name');
		const email = sessionStorage.getItem('signup_email');
		const password = sessionStorage.getItem('signup_password');

		const newUser = {
			email: email,
			password: password,
			name: name,
			verified: true,
			createdAt: new Date().toISOString()
		};

		const users = this.getUsers();
		users.push(newUser);
		this.saveUsers(users);

		// Clear session data
		sessionStorage.removeItem('signup_name');
		sessionStorage.removeItem('signup_email');
		sessionStorage.removeItem('signup_password');

		this.showMessage(messageDiv, 'Account created successfully! Logging in...', 'success');

		// Auto login
		setTimeout(() => {
			localStorage.setItem('loggedInUser', JSON.stringify({
				email: email,
				name: name
			}));
			window.location.href = 'index.html';
		}, 1500);
	}

	// Reset verification flow
	resetVerification() {
		document.getElementById('verify').classList.remove('active');
		document.getElementById('signup').classList.add('active');
		document.querySelectorAll('.tab-btn').forEach(btn => btn.style.display = 'block');
		document.getElementById('backLink').style.display = 'none';
		document.getElementById('verify-code').value = '';
		this.currentEmail = null;
		this.currentVerificationCode = null;
	}

	// Handle Forgot Password
	handleForgotPassword() {
		const email = document.getElementById('forgot-email').value.trim();
		const messageDiv = document.getElementById('forgot-message');

		if (!email) {
			this.showMessage(messageDiv, 'Please enter your email!', 'error');
			return;
		}

		const user = this.findUserByEmail(email);
		if (!user) {
			this.showMessage(messageDiv, 'Email not found!', 'error');
			return;
		}

		// Generate reset code
		this.currentResetCode = this.generateCode();
		this.currentEmail = email;

		// Send reset code via email
		this.sendResetEmail(user.name, email, this.currentResetCode, messageDiv);
	}

	// Send reset code email
	sendResetEmail(name, email, code, messageDiv) {
		const templateParams = {
			to_email: email,
			user_name: name,
			user_email: email,
			reset_code: code
		};

		emailjs.send('service_dipb9c7', 'template_t7yk3kj', templateParams)
			.then(() => {
				this.showMessage(messageDiv, 'Reset code sent to your email!', 'success');
				setTimeout(() => {
					this.showResetPasswordTab();
				}, 1000);
			})
			.catch((error) => {
				console.log('EmailJS Error:', error);
				// Fallback if email service fails
				this.showMessage(messageDiv, 'Code displayed on next screen. (Email service unavailable)', 'success');
				setTimeout(() => {
					this.showResetPasswordTab();
				}, 1000);
			});
	}

	// Show reset password tab
	showResetPasswordTab() {
		document.getElementById('forgotPassword').classList.remove('active');
		document.getElementById('resetPassword').classList.add('active');

		// Hide tab buttons
		document.querySelectorAll('.tab-btn').forEach(btn => btn.style.display = 'none');

		// Show back link
		document.getElementById('backLink').style.display = 'block';
		document.getElementById('backLink').onclick = (e) => {
			e.preventDefault();
			this.resetPasswordFlow();
		};
	}

	// Handle Reset Password
	handleResetPassword() {
		const code = document.getElementById('reset-code').value.trim();
		const password = document.getElementById('reset-password').value.trim();
		const confirm = document.getElementById('reset-confirm').value.trim();
		const messageDiv = document.getElementById('reset-message');

		if (!code || !password || !confirm) {
			this.showMessage(messageDiv, 'Please fill in all fields!', 'error');
			return;
		}

		if (code !== this.currentResetCode) {
			this.showMessage(messageDiv, 'Invalid reset code!', 'error');
			return;
		}

		if (password.length < 6) {
			this.showMessage(messageDiv, 'Password must be at least 6 characters!', 'error');
			return;
		}

		if (password !== confirm) {
			this.showMessage(messageDiv, 'Passwords do not match!', 'error');
			return;
		}

		// Update user password
		const users = this.getUsers();
		const userIndex = users.findIndex(u => u.email.toLowerCase() === this.currentEmail.toLowerCase());

		if (userIndex !== -1) {
			users[userIndex].password = password;
			this.saveUsers(users);
		}

		this.showMessage(messageDiv, 'Password reset successfully! Please log in.', 'success');

		setTimeout(() => {
			this.resetPasswordFlow();
			this.switchTab('signin');
		}, 1500);
	}

	// Reset password flow
	resetPasswordFlow() {
		document.getElementById('resetPassword').classList.remove('active');
		document.getElementById('signin').classList.add('active');
		document.querySelectorAll('.tab-btn').forEach(btn => btn.style.display = 'block');
		document.getElementById('backLink').style.display = 'none';
		document.getElementById('reset-code').value = '';
		document.getElementById('reset-password').value = '';
		document.getElementById('reset-confirm').value = '';
		this.currentEmail = null;
		this.currentResetCode = null;
	}

	// Show message helper
	showMessage(element, text, type) {
		element.textContent = text;
		element.className = 'message ' + type;
	}
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	window.authManager = new AuthManager();
});

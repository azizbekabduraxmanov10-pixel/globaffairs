// Firebase Authentication - Login Page Handler
// This file provides simple Firebase authentication for login page

const auth = firebase.auth();
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');
const loginForm = document.getElementById('loginForm');

// Only proceed if form exists on this page
if (loginForm) {
	// Add form submission event listener
	loginForm.addEventListener('submit', function(e) {
		e.preventDefault();
		login();
	});
}

// Login function using Firebase
function login() {
	const email = emailInput.value.trim();
	const password = passwordInput.value.trim();

	// Check if all fields are filled
	if (!email || !password) {
		showMessage('Please fill in all fields!', 'error');
		return;
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		showMessage('Please enter a valid email address!', 'error');
		return;
	}

	// Sign in with Firebase
	auth.signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			const user = userCredential.user;

			// Check if email is verified
			if (!user.emailVerified) {
				showMessage('Please verify your email before logging in. Check your inbox for the verification email.', 'error');
				auth.signOut();
				return;
			}

			// Email verified, login successful
			showMessage('Login successful! Redirecting...', 'success');
			// Redirect to index.html after 1 second
			setTimeout(() => {
				window.location.href = 'index.html';
			}, 1000);
		})
		.catch((error) => {
			const errorMessage = getFirebaseErrorMessage(error.code);
			showMessage(errorMessage, 'error');
			// Clear password field
			passwordInput.value = '';
		});
}

// Convert Firebase error codes to user-friendly messages
function getFirebaseErrorMessage(errorCode) {
	const errors = {
		'auth/user-not-found': 'Email not registered. Please sign up first!',
		'auth/wrong-password': 'Invalid password!',
		'auth/invalid-email': 'Please enter a valid email address!',
		'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
		'auth/user-disabled': 'This account has been disabled.',
		'auth/invalid-credential': 'Invalid email or password.'
	};

	return errors[errorCode] || 'Login failed. Please try again.';
}

// Function to display messages
function showMessage(text, type) {
	messageDiv.textContent = text;
	messageDiv.className = 'message ' + type;
}

// Check if user is already logged in and redirect to home
function checkExistingLogin() {
	auth.onAuthStateChanged((user) => {
		if (user && user.emailVerified) {
			// User is already logged in and verified, redirect to index.html
			window.location.href = 'index.html';
		}
	});
}

// Check on page load
window.addEventListener('load', checkExistingLogin);


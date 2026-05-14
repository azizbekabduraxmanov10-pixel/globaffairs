// Predefined list of allowed users with name, email, and password
const allowedUsers = [
	{ name: "Azizbek Aziz", email: "azizbek@globaffairs.com", password: "mypassword123" },
	{ name: "Admin User", email: "admin@globaffairs.com", password: "admin123" },
	{ name: "John Doe", email: "john@example.com", password: "password123" }
];

// Get form elements
const loginForm = document.getElementById('loginForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');

// Add form submission event listener
loginForm.addEventListener('submit', function(e) {
	e.preventDefault();
	login();
});

// Login function
function login() {
	const name = nameInput.value.trim();
	const email = emailInput.value.trim();
	const password = passwordInput.value.trim();

	// Check if all fields are filled
	if (!name || !email || !password) {
		showMessage('Please fill in all fields!', 'error');
		return;
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		showMessage('Please enter a valid email address!', 'error');
		return;
	}

	// Check credentials against allowed users
	const user = allowedUsers.find(u => u.name === name && u.email === email && u.password === password);

	if (user) {
		// Login successful
		showMessage('Login successful! Redirecting...', 'success');
		// Save logged-in user to localStorage
		localStorage.setItem('loggedInUser', JSON.stringify({name: user.name, email: user.email}));
		// Redirect to index.html after 1 second
		setTimeout(() => {
			window.location.href = 'index.html';
		}, 1000);
	} else {
		// Login failed
		showMessage('Invalid name, email, or password!', 'error');
		// Clear password field
		passwordInput.value = '';
	}
}

// Function to display messages
function showMessage(text, type) {
	messageDiv.textContent = text;
	messageDiv.className = 'message ' + type;
}

// Optional: Check if user is already logged in and redirect to home
function checkExistingLogin() {
	const loggedInUser = localStorage.getItem('loggedInUser');
	if (loggedInUser) {
		// User is already logged in, redirect to index.html
		window.location.href = 'index.html';
	}
}

// Check on page load
window.addEventListener('load', checkExistingLogin);

// Profile page functionality
class ProfileManager {
	constructor() {
		this.currentUser = null;
		this.initializeProfile();
	}

	initializeProfile() {
		this.checkLogin();
		this.displayUserInfo();
		this.setupEventListeners();
		// Update profile UI
		if (window.GlobAffairsAuth) {
			window.GlobAffairsAuth.updateProfileUI();
		}
	}

	checkLogin() {
		const user = localStorage.getItem('loggedInUser');
		if (!user) {
			alert('You must be logged in to view your profile!');
			window.location.href = 'index.html';
			return;
		}
		this.currentUser = JSON.parse(user);
	}

	displayUserInfo() {
		if (!this.currentUser) return;

		const displayName = document.getElementById('displayName');
		const displayEmail = document.getElementById('displayEmail');
		const displayCreatedAt = document.getElementById('displayCreatedAt');

		if (displayName) displayName.textContent = this.currentUser.name;
		if (displayEmail) displayEmail.textContent = this.currentUser.email;

		// Get account creation date from user data
		if (displayCreatedAt) {
			const users = this.getUsers();
			const userData = users.find(u => u.email.toLowerCase() === this.currentUser.email.toLowerCase());
			if (userData && userData.createdAt) {
				const date = new Date(userData.createdAt);
				displayCreatedAt.textContent = date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				});
			} else {
				displayCreatedAt.textContent = 'Unknown';
			}
		}
	}

	setupEventListeners() {
		const deleteBtn = document.getElementById('deleteAccountBtn');
		const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
		const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
		const deleteModal = document.getElementById('deleteModal');

		if (deleteBtn) {
			deleteBtn.addEventListener('click', () => {
				deleteModal.style.display = 'flex';
			});
		}

		if (confirmDeleteBtn) {
			confirmDeleteBtn.addEventListener('click', () => {
				this.deleteAccount();
			});
		}

		if (cancelDeleteBtn) {
			cancelDeleteBtn.addEventListener('click', () => {
				deleteModal.style.display = 'none';
			});
		}

		// Close modal when clicking outside
		if (deleteModal) {
			deleteModal.addEventListener('click', (e) => {
				if (e.target === deleteModal) {
					deleteModal.style.display = 'none';
				}
			});
		}

		// Setup profile dropdown (same as in script.js)
		const profileBtn = document.getElementById('profileBtn');
		const profileDropdown = document.getElementById('profileDropdown');
		const logoutBtn = document.getElementById('logoutBtn');

		if (profileBtn && profileDropdown) {
			profileBtn.addEventListener('click', function(e) {
				e.preventDefault();
				profileDropdown.classList.toggle('show');
			});

			document.addEventListener('click', function(e) {
				if (!e.target.closest('.profile-section')) {
					profileDropdown.classList.remove('show');
				}
			});
		}

		if (logoutBtn) {
			logoutBtn.addEventListener('click', function(e) {
				e.preventDefault();
				window.GlobAffairsAuth.logout();
			});
		}
	}

	deleteAccount() {
		if (!this.currentUser) return;

		// Get all users
		const users = this.getUsers();
		
		// Find and remove the current user
		const filteredUsers = users.filter(u => u.email.toLowerCase() !== this.currentUser.email.toLowerCase());
		
		// Save updated users
		this.saveUsers(filteredUsers);

		// Clear logged in user
		localStorage.removeItem('loggedInUser');

		// Show success message
		const messageDiv = document.getElementById('profileMessage');
		if (messageDiv) {
			messageDiv.className = 'message success';
			messageDiv.textContent = 'Account deleted successfully. Redirecting...';
		}

		// Redirect to home page
		setTimeout(() => {
			window.location.href = 'index.html';
		}, 1500);
	}

	getUsers() {
		const users = localStorage.getItem('globaffairs_users');
		return users ? JSON.parse(users) : [];
	}

	saveUsers(users) {
		localStorage.setItem('globaffairs_users', JSON.stringify(users));
	}
}

// Initialize profile manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	window.profileManager = new ProfileManager();
});

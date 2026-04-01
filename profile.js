// Profile page functionality - Firebase Edition
class ProfileManager {
	constructor() {
		this.auth = firebase.auth();
		this.currentUser = null;
		this.initializeProfile();
	}

	initializeProfile() {
		this.checkLogin();
		this.setupEventListeners();
		// Update profile UI
		if (window.GlobAffairsAuth) {
			window.GlobAffairsAuth.updateProfileUI();
		}
	}

	checkLogin() {
		this.auth.onAuthStateChanged((user) => {
			if (!user) {
				alert('You must be logged in to view your profile!');
				window.location.href = 'index.html';
				return;
			}

			if (!user.emailVerified) {
				alert('Please verify your email to access your profile!');
				window.location.href = 'index.html';
				return;
			}

			this.currentUser = user;
			this.displayUserInfo();
		});
	}

	displayUserInfo() {
		if (!this.currentUser) return;

		const displayName = document.getElementById('displayName');
		const displayEmail = document.getElementById('displayEmail');
		const displayCreatedAt = document.getElementById('displayCreatedAt');

		if (displayName) displayName.textContent = this.currentUser.displayName || 'User';
		if (displayEmail) displayEmail.textContent = this.currentUser.email;

		// Display account creation date from Firebase metadata
		if (displayCreatedAt && this.currentUser.metadata) {
			const createdDate = new Date(this.currentUser.metadata.creationTime);
			displayCreatedAt.textContent = createdDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} else if (displayCreatedAt) {
			displayCreatedAt.textContent = 'Unknown';
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

		const messageDiv = document.getElementById('profileMessage');
		const deleteModal = document.getElementById('deleteModal');

		// Delete user from Firebase
		this.currentUser.delete()
			.then(() => {
				// User deleted successfully
				if (messageDiv) {
					messageDiv.className = 'message success';
					messageDiv.textContent = 'Account deleted successfully. Redirecting...';
				}

				if (deleteModal) {
					deleteModal.style.display = 'none';
				}

				// Redirect to home page
				setTimeout(() => {
					window.location.href = 'index.html';
				}, 1500);
			})
			.catch((error) => {
				// Handle errors (e.g., user needs to have recently authenticated)
				if (error.code === 'auth/requires-recent-login') {
					if (messageDiv) {
						messageDiv.className = 'message error';
						messageDiv.textContent = 'Please log in again before deleting your account.';
					}
					// Sign out and redirect to login
					setTimeout(() => {
						this.auth.signOut();
						window.location.href = 'auth.html';
					}, 2000);
				} else {
					if (messageDiv) {
						messageDiv.className = 'message error';
						messageDiv.textContent = 'Error deleting account. Please try again.';
					}
				}
			});
	}
}

// Initialize profile manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	window.profileManager = new ProfileManager();
});


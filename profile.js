// Profile page functionality - Firebase Edition
const CATEGORY_PROGRESS = [
	{ id: 'international_relations', name: 'International Relations' },
	{ id: 'international_law', name: 'International Law' },
	{ id: 'global_security', name: 'Global Security' },
	{ id: 'diplomacy', name: 'Diplomacy' },
	{ id: 'international_organizations', name: 'International Organizations' },
	{ id: 'global_economics', name: 'Global Economics' },
	{ id: 'human_rights', name: 'Human Rights' },
	{ id: 'environment', name: 'Environment' },
	{ id: 'culture_society', name: 'Culture & Society' },
	{ id: 'geopolitics', name: 'Geopolitics' },
	{ id: 'global_development', name: 'Global Development' },
	{ id: 'global_health', name: 'Global Health' },
	{ id: 'migration_refugee_studies', name: 'Migration & Refugee Studies' },
	{ id: 'peace_conflict_studies', name: 'Peace & Conflict Studies' },
	{ id: 'global_governance', name: 'Global Governance' },
	{ id: 'international_trade', name: 'International Trade' },
	{ id: 'energy_politics', name: 'Energy Politics' },
	{ id: 'technology_global_politics', name: 'Technology & Global Politics' },
	{ id: 'global_finance', name: 'Global Finance' },
	{ id: 'humanitarian_affairs', name: 'Humanitarian Affairs' }
];

const CATEGORY_ID_TO_FIELD = CATEGORY_PROGRESS.reduce((map, category) => {
	map[category.id] = category.name;
	return map;
}, {});

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

		this.loadCategoryProgress();
	}

	getStoredTermViews() {
		const saved = localStorage.getItem('globaffairsTermViews');
		if (!saved) return {};
		try {
			return JSON.parse(saved) || {};
		} catch (error) {
			console.warn('Failed to parse term view data:', error);
			return {};
		}
	}

	async fetchCategoryTotals() {
		const totals = {};
		const requests = CATEGORY_PROGRESS.map(async (category) => {
			try {
				const response = await fetch(`data/${category.id}.json`);
				if (!response.ok) throw new Error('Load failed');
				const data = await response.json();
				totals[category.id] = Array.isArray(data) ? data.length : 0;
			} catch (error) {
				console.warn('Could not load term total for', category.id, error);
				totals[category.id] = 0;
			}
		});
		await Promise.all(requests);
		return totals;
	}

	getBestQuizScoreForCategory(categoryId) {
		const categoryName = CATEGORY_ID_TO_FIELD[categoryId];
		if (!categoryName) return null;
		let bestPercentage = -1;
		let bestScore = null;
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (!key || !key.startsWith('quizHistory:')) continue;
			const keyCategories = key.slice('quizHistory:'.length).split('|');
			if (!keyCategories.includes(categoryName)) continue;
			const saved = localStorage.getItem(key);
			if (!saved) continue;
			try {
				const entries = JSON.parse(saved);
				if (!Array.isArray(entries)) continue;
				entries.forEach((entry) => {
					if (typeof entry.percentage !== 'number') return;
					if (entry.percentage > bestPercentage) {
						bestPercentage = entry.percentage;
						bestScore = entry;
					}
				});
			} catch (error) {
				console.warn('Failed to parse quiz history for', key, error);
			}
		}
		return bestScore;
	}

	async loadCategoryProgress() {
		const progressContainer = document.getElementById('categoryProgressContainer');
		if (!progressContainer) return;

		const allKeys = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			const isQuizHistory = typeof key === 'string' && key.startsWith('quizHistory:');
			allKeys.push({ key, isQuizHistory });
		}
		console.log(`ALL KEYS: ${Object.keys(localStorage).join(', ')}`);
		console.log('ALL KEYS JSON:', JSON.stringify(Object.keys(localStorage)));
		console.log('DEBUG profile loadCategoryProgress quizHistory key details:', allKeys);

		const totals = await this.fetchCategoryTotals();
		const views = this.getStoredTermViews();
		const rows = CATEGORY_PROGRESS.map((category) => {
			const viewedCount = Array.isArray(views[category.id]) ? views[category.id].length : 0;
			const bestAttempt = this.getBestQuizScoreForCategory(category.id);
			return {
				id: category.id,
				name: category.name,
				viewed: viewedCount,
				total: totals[category.id] || 0,
				bestAttempt
			};
		});
		this.renderCategoryProgress(rows);
	}

	renderCategoryProgress(rows) {
		const progressContainer = document.getElementById('categoryProgressContainer');
		if (!progressContainer) return;
		progressContainer.innerHTML = '';

		rows.forEach((row) => {
			const item = document.createElement('div');
			item.className = 'progress-item';

			const left = document.createElement('div');
			left.innerHTML = `<strong>${row.name}</strong>` +
				`<div class="progress-details">Viewed ${row.viewed} of ${row.total} terms</div>`;

			const right = document.createElement('div');
			right.className = 'progress-details';
			right.innerHTML = row.bestAttempt
				? `Best score: ${row.bestAttempt.score}/${row.bestAttempt.totalQuestions} (${row.bestAttempt.percentage}%)`
				: 'No quiz attempts yet';

			item.appendChild(left);
			item.appendChild(right);
			progressContainer.appendChild(item);
		});
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

(function() {
  // Authentication utilities - Firebase Edition
  window.GlobAffairsAuth = {
    auth: firebase.auth(),
    currentUser: null,

    logout: function() {
      this.auth.signOut().then(() => {
        window.location.href = 'index.html';
      }).catch(function(error) {
        console.error('Sign out error:', error);
      });
    },
    
    isLoggedIn: function() {
      return this.currentUser !== null && this.currentUser.emailVerified;
    },
    
    getCurrentUser: function() {
      if (!this.currentUser || !this.currentUser.emailVerified) {
        return null;
      }
      return {
        name: this.currentUser.displayName || 'User',
        email: this.currentUser.email
      };
    },
    
    requireLogin: function() {
      if (!this.isLoggedIn()) {
        alert('You must log in first!');
        window.location.href = 'auth.html';
      }
    },

    updateProfileUI: function() {
      const authLink = document.getElementById('authLink');
      const profileSection = document.getElementById('profileSection');
      const profileName = document.getElementById('profileName');
      
      if (!authLink || !profileSection) return;

      const user = this.getCurrentUser();
      
      if (user) {
        authLink.style.display = 'none';
        profileSection.style.display = 'block';
        profileName.textContent = user.name;
      } else {
        authLink.style.display = 'list-item';
        profileSection.style.display = 'none';
      }
    }
  };

  // Initialize Firebase auth state listener
  window.GlobAffairsAuth.auth.onAuthStateChanged(function(user) {
    window.GlobAffairsAuth.currentUser = user;
    window.GlobAffairsAuth.updateProfileUI();
  });

  // Map field display names to category IDs used in terms.json
  const map = {
    'International Relations': 'international_relations',
    'International Law': 'international_law',
    'Global Security': 'global_security',
    'Diplomacy': 'diplomacy',
    'International Organizations': 'international_organizations',
    'Global Economics': 'global_economics',
    'Human Rights': 'human_rights',
    'Environment': 'environment',
    'Culture & Society': 'culture_society',
    'Geopolitics': 'geopolitics',
    'Global Development': 'global_development',
    'Global Health': 'global_health',
    'Migration & Refugee Studies': 'migration_refugee_studies',
    'Peace & Conflict Studies': 'peace_conflict_studies',
    'Global Governance': 'global_governance',
    'International Trade': 'international_trade',
    'Energy Politics': 'energy_politics',
    'Technology & Global Politics': 'technology_global_politics',
    'Global Finance': 'global_finance',
    'Humanitarian Affairs': 'humanitarian_affairs'
  };

  document.addEventListener('DOMContentLoaded', function() {
    // Update profile UI
    window.GlobAffairsAuth.updateProfileUI();

    // Setup profile button handlers
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileViewBtn = document.getElementById('profileViewBtn');

    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        profileDropdown.classList.toggle('show');
      });

      // Close dropdown when clicking outside
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

    if (profileViewBtn) {
      profileViewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'profile.html';
      });
    }

    // Terminology card handling
    const cards = document.querySelectorAll('.terminology-card');
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function() {
        const field = card.querySelector('.field-name').textContent.trim();
        const category = map[field];
        if (!category) return;
        window.location.href = `terms.html?category=${encodeURIComponent(category)}`;
      });
    });
  });
})();

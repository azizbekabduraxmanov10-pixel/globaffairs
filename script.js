(function() {
  // Authentication utilities - Firebase Edition
  window.GlobAffairsAuth = {
    auth: null,
    currentUser: null,
    firestore: null,
    streakUpdatedToday: false,
    streakMilestones: [7, 30],

    logout: function() {
      if (!this.auth) return;
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

    getLocalDateString: function(date = new Date()) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    getYesterdayDateString: function(todayDateString) {
      const parts = todayDateString.split('-').map(Number);
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      date.setDate(date.getDate() - 1);
      return this.getLocalDateString(date);
    },

    initFirestore: function() {
      if (this.firestore) return true;
      if (typeof firebase === 'undefined' || !firebase.firestore) {
        return false;
      }

      try {
        this.firestore = firebase.firestore();
        return true;
      } catch (error) {
        console.warn('Firestore initialization failed:', error);
        return false;
      }
    },

    getStreakDocRef: function(uid) {
      if (!this.initFirestore()) return null;
      return this.firestore.collection('userStreaks').doc(uid);
    },

    updateStreakDisplay: function(streak) {
      const badge = document.getElementById('streakDisplay');
      if (!badge) return;

      badge.style.display = 'flex';
      badge.textContent = `🔥 ${streak} ${streak === 1 ? 'day' : 'days'} streak`;
    },

    updateProfileStreakUI: function(streak) {
      const profileStreak = document.getElementById('profileStreakValue');
      if (!profileStreak) return;
      profileStreak.textContent = `${streak} ${streak === 1 ? 'day' : 'days'}`;
    },

    showStreakToast: function(message) {
      let toast = document.getElementById('streakToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'streakToast';
        toast.className = 'streak-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.style.opacity = '1';
      toast.style.pointerEvents = 'auto';

      clearTimeout(toast.dismissTimer);
      toast.dismissTimer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.pointerEvents = 'none';
      }, 4200);
    },

    getMilestoneKey: function(streak) {
      return `globaffairsStreakMilestone:${streak}`;
    },

    hasShownMilestone: function(streak) {
      return localStorage.getItem(this.getMilestoneKey(streak)) === 'true';
    },

    markMilestoneShown: function(streak) {
      localStorage.setItem(this.getMilestoneKey(streak), 'true');
    },

    showStreakMilestoneIfNeeded: function(streak) {
      if (!this.streakMilestones.includes(streak)) return;
      if (this.hasShownMilestone(streak)) return;

      const message = streak === 7
        ? '🔥 7-day streak! Great momentum.'
        : '🔥 30-day streak! Incredible dedication.';
      this.showStreakToast(message);
      this.markMilestoneShown(streak);
    },

    recordDailyStreak: function() {
      if (!this.isLoggedIn() || !this.initFirestore() || this.streakUpdatedToday) {
        return;
      }

      const uid = this.currentUser.uid;
      const today = this.getLocalDateString();
      const yesterday = this.getYesterdayDateString(today);
      const streakRef = this.getStreakDocRef(uid);
      if (!streakRef) return;

      streakRef.get()
        .then((doc) => {
          const data = doc.exists ? doc.data() : null;
          let nextStreak = 1;
          let lastActiveDate = today;

          if (data && data.lastActiveDate) {
            const lastDate = data.lastActiveDate;
            const currentStreak = Number(data.currentStreak) || 0;

            if (lastDate === today) {
              nextStreak = currentStreak || 1;
            } else if (lastDate === yesterday) {
              nextStreak = currentStreak + 1;
            } else {
              nextStreak = 1;
            }
          }

          const updatePayload = {
            currentStreak: nextStreak,
            lastActiveDate: lastActiveDate,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          };

          if (!doc.exists || doc.data().currentStreak !== nextStreak || doc.data().lastActiveDate !== lastActiveDate) {
            streakRef.set(updatePayload, { merge: true }).catch((error) => {
              console.warn('Could not save streak data:', error);
            });
          }

          this.streakUpdatedToday = true;
          this.updateStreakDisplay(nextStreak);
          this.updateProfileStreakUI(nextStreak);
          this.showStreakMilestoneIfNeeded(nextStreak);
        })
        .catch((error) => {
          console.warn('Could not load streak data:', error);
        });
    },

    updateProfileUI: function() {
      const authLink = document.getElementById('authLink');
      const profileSection = document.getElementById('profileSection');
      const profileName = document.getElementById('profileName');
      const user = this.getCurrentUser();

      if (user) {
        if (authLink && profileSection && profileName) {
          authLink.style.display = 'none';
          profileSection.style.display = 'block';
          profileName.textContent = user.name;
        }
        this.recordDailyStreak();
      } else if (authLink && profileSection) {
        authLink.style.display = 'list-item';
        profileSection.style.display = 'none';
      }
    }
  };

  // Initialize Firebase auth state listener - safely handle if Firebase is not available
  try {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      window.GlobAffairsAuth.auth = firebase.auth();
      window.GlobAffairsAuth.auth.onAuthStateChanged(function(user) {
        window.GlobAffairsAuth.currentUser = user;
        window.GlobAffairsAuth.updateProfileUI();
      });
    }
  } catch (error) {
    console.warn('Firebase not available:', error);
  }
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

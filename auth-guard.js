// Auth Guard - Firebase Authentication Guard
// Include this script on pages that should require login
// Firebase SDK must be initialized before this script loads

(function() {
	// Function to check if user is logged in via Firebase
	function checkLogin() {
		const auth = firebase.auth();

		// Listen for auth state changes
		auth.onAuthStateChanged(function(user) {
			if (!user) {
				// User not logged in, redirect to auth page
				alert('You must log in first!');
				window.location.href = 'auth.html';
			} else if (!user.emailVerified) {
				// User logged in but email not verified
				alert('Please verify your email before accessing this page.');
				window.location.href = 'auth.html';
			}
			// User is logged in and verified, allow access
		});
	}

	// Check login status when page loads
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', checkLogin);
	} else {
		checkLogin();
	}
})();


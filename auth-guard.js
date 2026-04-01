// Auth guard - Include this script on pages that should require login
// <script src="auth-guard.js"></script>

(function() {
	// Function to check if user is logged in
	function checkLogin() {
		const loggedInUserData = localStorage.getItem('loggedInUser');
		
		if (!loggedInUserData) {
			// User not logged in, show alert and redirect to auth page
			alert('You must log in first!');
			window.location.href = 'auth.html';
		}
	}
	
	// Check login status when page loads
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', checkLogin);
	} else {
		checkLogin();
	}
})();

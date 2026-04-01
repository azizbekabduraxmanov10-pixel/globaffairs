# Firebase Script Tags - Quick Reference

## Firebase Script Tags Required

Add these **two lines** to any HTML file that needs authentication functionality:

```html
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"></script>
```

## Files That Already Have Firebase Scripts Added

✅ **auth.html** - Sign up, login, password reset
✅ **index.html** - Homepage with profile area
✅ **profile.html** - User profile and account management
✅ **terminology.html** - Learning page with auth

## Firebase Configuration Code

Add this **before** your app scripts load:

```html
<script>
    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
</script>
```

## Correct Script Order (in your HTML file)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Page</title>
</head>
<body>
    <!-- Your HTML content -->

    <!-- 1. Firebase SDK Scripts -->
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"></script>

    <!-- 2. Firebase Configuration -->
    <script>
        const firebaseConfig = {
            // Your config here
        };
        firebase.initializeApp(firebaseConfig);
    </script>

    <!-- 3. Your Application Scripts -->
    <script src="your-app.js"></script>
</body>
</html>
```

## Getting Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ Settings > Project Settings
4. Scroll to "Your apps"
5. Copy the `firebaseConfig` object
6. Replace the placeholder values in your HTML files

## Variable Reference

| Variable | Example | Where to Find |
|----------|---------|----------------|
| `apiKey` | `AIzaSyB3...` | Firebase Console → Project Settings |
| `authDomain` | `my-app-12345.firebaseapp.com` | Firebase Console → Project Settings |
| `projectId` | `my-app-12345` | Firebase Console → Project Settings |
| `storageBucket` | `my-app-12345.appspot.com` | Firebase Console → Project Settings |
| `messagingSenderId` | `123456789012` | Firebase Console → Project Settings |
| `appId` | `1:123456789012:web:abcdef123456` | Firebase Console → Project Settings |

## Updated JavaScript Files

All your JavaScript files that handle authentication have been updated to use Firebase:

- **auth.js** - Handles sign up, login, email verification, password reset
- **script.js** - Profile UI, logout functionality
- **profile.js** - User profile display and account deletion
- **login.js** - Simplified login page support
- **auth-guard.js** - Protects pages that require login

## What Changed

### OLD System (localStorage):
```javascript
// OLD - No longer used
const allowedUsers = [
  { name: "John", email: "john@example.com", password: "pass123" }
];
localStorage.setItem('loggedInUser', JSON.stringify({...}));
```

### NEW System (Firebase):
```javascript
// NEW - Better and more secure
firebase.auth().createUserWithEmailAndPassword(email, password);
firebase.auth().signInWithEmailAndPassword(email, password);
firebase.auth().onAuthStateChanged(user => {
  // Handle logged-in user
});
```

## No Breaking Changes!

- ✅ All HTML structure remains the same
- ✅ All CSS styling unchanged
- ✅ All form fields work the same way
- ✅ User interface looks identical
- ✅ Message system (`showMessage()`) works the same way

---

**The only thing you need to change:** Add your Firebase configuration values to the HTML files!

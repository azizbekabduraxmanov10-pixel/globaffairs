# Firebase Script Tags - Exact Code Added

## auth.html

```html
<!-- Firebase SDK (Added to <head>) -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"></script>

<!-- Firebase Configuration (Added before </body>) -->
<script>
    // Firebase Configuration
    // TODO: Replace with your Firebase project config from Firebase Console
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
<script src="auth.js"></script>
```

---

## index.html

```html
<!-- Firebase SDK (Added before </body>) -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"></script>
<script>
    // Firebase Configuration
    // TODO: Replace with your Firebase project config from Firebase Console
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
<script src="script.js"></script>
```

---

## profile.html

```html
<!-- Firebase SDK (Added before </body>) -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"></script>
<script>
    // Firebase Configuration
    // TODO: Replace with your Firebase project config from Firebase Console
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
<script src="script.js"></script>
<script src="profile.js"></script>
```

---

## terminology.html

```html
<!-- Firebase SDK (Added before </body>) -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"></script>
<script>
    // Firebase Configuration
    // TODO: Replace with your Firebase project config from Firebase Console
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
<script src="script.js"></script>
```

---

## Complete Configuration Template

Copy and paste this for any Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

---

## What Was Removed

### From auth.html (in <head>):
```html
<!-- REMOVED -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

This was replaced with Firebase's built-in email functionality.

---

## Important Notes

1. **Keep the same file order:**
   - Firebase App SDK first
   - Firebase Auth SDK second
   - Configuration code third
   - Your app scripts last

2. **Configuration IDs are from Firebase Console:**
   - Start at https://console.firebase.google.com/
   - Go to Project Settings
   - Find "Your apps" section
   - Copy from there

3. **Same configuration in all 4 files:**
   - All 4 HTML files (auth.html, index.html, profile.html, terminology.html) should have the SAME firebaseConfig object

4. **Test each file works:**
   - After adding config, test that features work
   - Check browser console (F12) for errors

---

## Version Info

- Firebase SDK: **10.12.0**
- Compatible with: All modern browsers
- Works on: GitHub Pages, Netlify, Vercel, any static host

---

## No Other HTML Files Need Updates

These files do **NOT** need Firebase scripts:
- articles.html
- article-detail.html
- quiz-selection.html
- quiz.html
- term.html
- login.html (just a redirect)
- Any files in the `/articles/` folder

They work fine without authentication functions.

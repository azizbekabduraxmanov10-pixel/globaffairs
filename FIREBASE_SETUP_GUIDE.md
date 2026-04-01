# Firebase Authentication Setup Guide

## Overview
Your website's authentication system has been successfully updated to use **Firebase Authentication** instead of localStorage. This enables:
- ✅ Global account access across all devices
- ✅ Email verification requirement for login
- ✅ Automatic password reset emails
- ✅ Secure credential storage in Firebase
- ✅ No device-specific storage limitations

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a new project"** or select an existing one
3. Enter your project name (e.g., "GlobAffairs")
4. Accept the Terms and click **"Create project"**
5. Wait for the project to be created and click **"Continue"**

---

## Step 2: Enable Email/Password Authentication

1. In the Firebase Console, go to **Authentication** (left sidebar)
2. Click the **"Sign-in method"** tab
3. Click **"Email/Password"** provider
4. Toggle **"Email/Password"** to **ON**
5. Make sure **"Email link (passwordless sign-in)"** is OFF
6. Click **"Save"**

---

## Step 3: Get Your Firebase Configuration

1. In the Firebase Console, click the **Settings icon** (⚙️) in the top left
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click on the **Web app icon** (</>) to register a web app
5. Enter an app nickname (e.g., "GlobAffairs Web")
6. Check **"Also set up Firebase Hosting"** (optional, for GitHub Pages)
7. Click **"Register app"**
8. You'll see a script with `firebaseConfig` object - **Copy this entire configuration**

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## Step 4: Update Configuration in Your HTML Files

Replace `YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc. in the following files:

### Files to Update:
1. **auth.html** - Find the `firebaseConfig` object and replace with your actual config
2. **index.html** - Find the `firebaseConfig` object and replace with your actual config
3. **profile.html** - Find the `firebaseConfig` object and replace with your actual config
4. **terminology.html** - Find the `firebaseConfig` object and replace with your actual config

### Example of what to replace:
**BEFORE:**
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

**AFTER:** (example with actual values)
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyB3...",
    authDomain: "globaffairs-12345.firebaseapp.com",
    projectId: "globaffairs-12345",
    storageBucket: "globaffairs-12345.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};
```

---

## Step 5: Configure Email Verification (Optional but Recommended)

To customize the email verification message:

1. Go to **Authentication** → **Templates** in Firebase Console
2. Click **"Verification email"**
3. Click the **pencil icon** to edit the email template
4. Customize the subject and HTML message
5. Click **"Save"**

---

## Step 6: Enable Password Reset Email (Already Configured)

The password reset functionality is automatic with Firebase. Users can click "Forgot password?" on the login page and receive a reset email automatically.

---

## Files Modified

### New Firebase Authentication Files:
- **auth.js** - Complete rewrite to use Firebase Auth
- **auth-guard.js** - Updated to check Firebase auth state
- **profile.js** - Updated to use Firebase user data
- **script.js** - Updated GlobAffairsAuth object for Firebase
- **login.js** - Updated to use Firebase Auth
- **auth.html** - Added Firebase script tags
- **index.html** - Added Firebase script tags
- **profile.html** - Added Firebase script tags
- **terminology.html** - Added Firebase script tags

### NO CHANGES TO:
- HTML structure/layout
- CSS styling
- Form fields and labels
- Button layouts

---

## Authentication Flow

### Sign Up:
1. User enters name, email, password
2. System creates Firebase account
3. Verification email automatically sent
4. User clicks verification link in email
5. User can now log in

### Sign In:
1. User enters email and password
2. System checks if email is verified
3. If verified → Login successful → Redirect to index.html
4. If not verified → Error message asking to verify email

### Forgot Password:
1. User clicks "Forgot password?" link
2. User enters their email
3. Firebase sends password reset email
4. User clicks link in email to reset password
5. User logs in with new password

### Logout:
1. User clicks "Logout" in profile menu
2. Firebase signs out user
3. Redirects to index.html

---

## Features

✅ **Email Verification Required** - Prevents unverified accounts from logging in

✅ **No More localStorage** - Uses Firebase secure backend

✅ **Cross-Device Login** - Same account works on any device

✅ **Automatic Password Reset** - Firebase handles email delivery

✅ **Account Deletion** - Users can delete their accounts

✅ **Error Handling** - Clear, user-friendly error messages

---

## Testing Your Setup

1. Open your website and click "Login"
2. Click "Sign Up" tab
3. Enter test user credentials:
   - **Name:** Test User
   - **Email:** test@example.com
   - **Password:** TestPassword123

4. You should see message: *"Account created! Verification email sent..."*

5. Check your email for verification link

6. Click verification link in email

7. Return to website and sign in with email and password

8. Should redirect to index.html with profile showing

---

## Troubleshooting

### "firebaseConfig is not defined" error:
- Make sure you added the Firebase configuration code to your HTML file
- Ensure `firebase.initializeApp(firebaseConfig);` is called

### "Verification email not received":
- Check spam/promotions folder
- Wait a few minutes
- Try signing up with a different email

### "Cannot log in even with correct password":
- Make sure email is verified first
- Check Firebase Console → Authentication → Users to see if user exists

### "User profile not showing after login":
- Wait a few seconds for page to fully load
- Check browser console for errors (F12)
- Ensure Firebase config is correct

---

## Security Notes

⚠️ **Important:**
- Keep your `apiKey` private on production servers
- On GitHub Pages (static), the API key is somewhat exposed but Firebase rules restrict access to authenticated users only
- Set proper Firestore/Realtime Database security rules if you add backend features
- Never hardcode sensitive data in frontend code

---

## Next Steps (Optional)

To enhance your authentication system further:

1. **Add Google/GitHub Sign-in** - In Firebase Console → Authentication → Sign-in method
2. **Save User Profile Data** - Use Firestore to store additional user info
3. **Admin Dashboard** - Create admin functions to manage users
4. **Two-Factor Authentication** - Enable in Firebase Console

---

## Support

For more Firebase Authentication info:
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

---

**Last Updated:** April 1, 2026

# Firebase Migration Checklist

Use this checklist to track your progress in setting up Firebase Authentication.

---

## Phase 1: Firebase Project Setup

- [ ] Create Firebase account at https://firebase.google.com/
- [ ] Create new Firebase project (or select existing)
- [ ] Go to Authentication in Firebase Console
- [ ] Enable "Email/Password" sign-in method
- [ ] Note: Keep "Email Link (passwordless)" OFF

---

## Phase 2: Get Configuration

- [ ] In Firebase Console, go to Project Settings
- [ ] Scroll to "Your apps" section
- [ ] Click Web app icon (</>) if not already registered
- [ ] Copy the entire `firebaseConfig` object
- [ ] Verify you have all 6 fields:
  - [ ] `apiKey`
  - [ ] `authDomain`
  - [ ] `projectId`
  - [ ] `storageBucket`
  - [ ] `messagingSenderId`
  - [ ] `appId`

---

## Phase 3: Update HTML Files

### auth.html
- [ ] Open auth.html in your editor
- [ ] Find the `firebaseConfig` object (near bottom)
- [ ] Replace `YOUR_API_KEY` with your actual apiKey
- [ ] Replace `YOUR_PROJECT_ID` with your actual projectId
- [ ] Replace other fields with actual values from Firebase
- [ ] Verify `firebase.initializeApp(firebaseConfig);` is present
- [ ] Save file

### index.html
- [ ] Open index.html in your editor
- [ ] Find the `firebaseConfig` object (near bottom)
- [ ] Replace `YOUR_API_KEY` with your actual apiKey
- [ ] Replace `YOUR_PROJECT_ID` with your actual projectId
- [ ] Replace other fields with actual values from Firebase
- [ ] Verify `firebase.initializeApp(firebaseConfig);` is present
- [ ] Save file

### profile.html
- [ ] Open profile.html in your editor
- [ ] Find the `firebaseConfig` object (near bottom)
- [ ] Replace `YOUR_API_KEY` with your actual apiKey
- [ ] Replace `YOUR_PROJECT_ID` with your actual projectId
- [ ] Replace other fields with actual values from Firebase
- [ ] Verify `firebase.initializeApp(firebaseConfig);` is present
- [ ] Save file

### terminology.html
- [ ] Open terminology.html in your editor
- [ ] Find the `firebaseConfig` object (near bottom)
- [ ] Replace `YOUR_API_KEY` with your actual apiKey
- [ ] Replace `YOUR_PROJECT_ID` with your actual projectId
- [ ] Replace other fields with actual values from Firebase
- [ ] Verify `firebase.initializeApp(firebaseConfig);` is present
- [ ] Save file

---

## Phase 4: Basic Testing

### Test 1: Sign Up (Create Account)
- [ ] Open your website locally or on a server
- [ ] Navigate to auth.html (or Login link)
- [ ] Click "Sign Up" tab
- [ ] Fill in form:
  - [ ] Name: Test User
  - [ ] Email: testuser@example.com
  - [ ] Password: TestPassword123
  - [ ] Confirm: TestPassword123
- [ ] Click "Continue" button
- [ ] Verify message: "Account created! Verification email sent..."
- [ ] Check your email for verification link
- [ ] Click verification link in email
- [ ] Note: Account creation date should appear in Firebase Console

### Test 2: Verify Email Not Required Before Verification
- [ ] Try to log in with unverified email
- [ ] Should see error: "Please verify your email..."
- [ ] Go back to email and click verification link

### Test 3: Login with Verified Account
- [ ] After email verified, try to log in
- [ ] Enter email and password
- [ ] Click "Login"
- [ ] Should show: "Login successful! Redirecting..."
- [ ] Should redirect to index.html
- [ ] Profile should show in top right with your name
- [ ] ✅ TEST PASSED

### Test 4: View Profile
- [ ] Click profile button (👤 with your name)
- [ ] Click "View Profile"
- [ ] Verify page shows:
  - [ ] Your name
  - [ ] Your email
  - [ ] Account creation date
- [ ] ✅ TEST PASSED

### Test 5: Logout
- [ ] Click profile button (👤 with your name)
- [ ] Click "Logout"
- [ ] Should redirect to index.html
- [ ] Profile button should disappear
- [ ] Login link should reappear
- [ ] ✅ TEST PASSED

### Test 6: Login Again
- [ ] Click "Login" link
- [ ] Go to "Sign In" tab
- [ ] Enter same email and password
- [ ] Should log in successfully
- [ ] Profile should reappear
- [ ] ✅ TEST PASSED

### Test 7: Forgot Password
- [ ] Click "Forgot password?" link
- [ ] Enter your email
- [ ] Click "Send Reset Code"
- [ ] Should see: "Password reset email sent!"
- [ ] Check email for password reset link
- [ ] Click link in email
- [ ] Firebase will provide password reset form
- [ ] Set new password
- [ ] Try logging in with new password
- [ ] Should log in successfully
- [ ] ✅ TEST PASSED

### Test 8: Account Deletion (Optional)
- [ ] Log in to your account
- [ ] Go to View Profile
- [ ] Click "Delete Account" button
- [ ] Confirm deletion
- [ ] Should redirect to home page
- [ ] Try logging in with deleted account
- [ ] Should fail with "Email not registered"
- [ ] ✅ TEST PASSED

---

## Phase 5: Verify Firebase Console

- [ ] Go to Firebase Console
- [ ] Click "Authentication" section
- [ ] Click "Users" tab
- [ ] Verify your test user appears
- [ ] Check user has:
  - [ ] Email address correct
  - [ ] Email verified: YES (or check mark)
  - [ ] Created date shown
- [ ] ✅ ALL USERS SHOWING CORRECTLY

---

## Phase 6: Cross-Device Testing (Important!)

This is the key test to verify the migration worked:

### Test on Different Device/Browser:
- [ ] Open website on different device OR different browser
- [ ] Try to log in with same account from Test 1
- [ ] Enter email and password
- [ ] Should log in successfully (this proves cross-device works!)
- [ ] Profile should show same account information
- [ ] ✅ CROSS-DEVICE LOGIN WORKS

Alternatively, use browser's private/incognito window to simulate different device.

---

## Phase 7: Production Deployment

- [ ] Push all updated files to GitHub (if using GitHub Pages)
- [ ] Or deploy to your hosting provider
- [ ] Wait for site to update (usually 1-2 minutes)
- [ ] Test sign up, login, forgot password on live site
- [ ] Verify Firebase is working on production URL

Deployment checklist:
- [ ] auth.html uploaded with Firebase config
- [ ] index.html uploaded with Firebase config
- [ ] profile.html uploaded with Firebase config
- [ ] terminology.html uploaded with Firebase config
- [ ] auth.js uploaded (new Firebase version)
- [ ] script.js uploaded (updated version)
- [ ] profile.js uploaded (updated version)
- [ ] login.js uploaded (updated version)
- [ ] auth-guard.js uploaded (updated version)

---

## Phase 8: Optional Enhancements

After basic setup works, you can add:

- [ ] Gmail sign-in button (Firebase Console → Authentication → Google)
- [ ] GitHub sign-in button (Firebase Console → Authentication → GitHub)
- [ ] Custom email templates for verification
- [ ] Password reset email customization
- [ ] 2-Factor Authentication (Firebase Console → Authentication)
- [ ] User profile data storage (Firestore)

---

## Troubleshooting

### Issue: "firebaseConfig is not defined"
- [ ] Check Firebase script tags are in HTML file
- [ ] Check firebaseConfig is defined before app scripts
- [ ] Check spelling: exactly `firebaseConfig` (case-sensitive)
- [ ] Check all 6 config fields are filled

### Issue: "Cannot sign up - error"
- [ ] Check Email/Password auth is enabled in Firebase Console
- [ ] Check email is valid format (name@domain.com)
- [ ] Check password is at least 6 characters
- [ ] Check browser console (F12) for error messages

### Issue: "Verification email not received"
- [ ] Check spam/promotions folder
- [ ] Wait 5 minutes
- [ ] Try with different email address
- [ ] Check Firebase Console → Authentication → Email Templates

### Issue: "Can't log in even with correct password"
- [ ] Check email is verified (check email inbox)
- [ ] Check user exists in Firebase Console → Authentication → Users
- [ ] Check password is correct (try forgot password)
- [ ] Check browser console (F12) for errors

### Issue: "Profile doesn't load after login"
- [ ] Wait 5 seconds for page to load
- [ ] Check browser console (F12) for errors
- [ ] Verify Firebase config is correct
- [ ] Try refreshing page
- [ ] Try logging out and back in

---

## Success Criteria ✅

Your migration is **complete and working** when:

- ✅ Sign up creates account and sends verification email
- ✅ Login requires verified email (unverified accounts cannot log in)
- ✅ Profile shows account information
- ✅ Logout works and clears profile
- ✅ Forgot password sends reset email
- ✅ **Same account works on different devices** (⭐ KEY TEST)
- ✅ Account can be deleted
- ✅ Firebase Console shows all users

---

## Files Modified Summary

### JavaScript Files Updated:
- ✅ auth.js (complete rewrite)
- ✅ script.js (updated for Firebase)
- ✅ profile.js (updated for Firebase)
- ✅ login.js (updated for Firebase)
- ✅ auth-guard.js (updated for Firebase)

### HTML Files Updated:
- ✅ auth.html (added Firebase scripts)
- ✅ index.html (added Firebase scripts)
- ✅ profile.html (added Firebase scripts)
- ✅ terminology.html (added Firebase scripts)

### Documentation Created:
- ✅ FIREBASE_SETUP_GUIDE.md (detailed setup)
- ✅ FIREBASE_MIGRATION_SUMMARY.md (what changed)
- ✅ FIREBASE_SCRIPT_TAGS.md (script reference)
- ✅ FIREBASE_CODE_REFERENCE.md (code examples)
- ✅ FIREBASE_MIGRATION_CHECKLIST.md (this file)

---

## Need Help?

1. Read: **FIREBASE_SETUP_GUIDE.md** for detailed instructions
2. Check: **FIREBASE_CODE_REFERENCE.md** for code examples
3. Review: **FIREBASE_SCRIPT_TAGS.md** for script tag info
4. Firebase Docs: https://firebase.google.com/docs/auth
5. Firebase Console: https://console.firebase.google.com/

---

**Last Updated:** April 1, 2026
**Status:** Migration Complete - Ready for Configuration

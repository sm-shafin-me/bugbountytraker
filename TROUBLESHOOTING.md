# Troubleshooting Guide

## Common Issues and Solutions

### 1. Firebase Permission Denied Error

**Error**: `{ "success": false, "error": { "code": "permission-denied", "name": "FirebaseError" } }`

**Solution**:
This happens when Firestore security rules block the operation. Since this app uses **custom Member ID authentication** (not Firebase Auth), the security rules need to be configured differently.

**Steps to fix**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Replace the rules with the contents of `firestore.rules` from this project
5. Click **Publish**

The updated rules allow operations without Firebase Authentication since we're using custom Member IDs.

---

### 2. Database Seeding Fails

**Error**: Cannot write to Firestore when visiting `/api/seed`

**Causes**:
- Firestore rules are too restrictive
- Firebase credentials not set correctly
- Firestore not enabled in Firebase project

**Solution**:
1. Verify `.env.local` has all Firebase credentials
2. Check that Firestore is enabled in Firebase Console
3. Deploy the updated `firestore.rules` (see issue #1 above)
4. Restart dev server: `npm run dev`
5. Try `/api/seed` again

---

### 3. Login Not Working

**Error**: "Invalid Member ID" even with correct ID

**Causes**:
- Member ID not in the valid list
- Case sensitivity issue
- Firestore connection problem

**Solution**:
1. Use one of these exact IDs (case-sensitive):
   ```
   BB-X9R2-ZT, BB-K4W5-PM, BB-Q7L1-VX, BB-N3B8-RD
   BB-J6F9-KS, BB-H2M4-TY, BB-G8S5-QL, BB-V1C7-NZ
   BB-P5D2-JW, BB-Z9T4-HX, BB-A3L6-MR, BB-S7K1-FP
   ```
2. Make sure to type in UPPERCASE
3. Check browser console for errors
4. Verify Firebase connection in Network tab

---

### 4. Device Limit Reached

**Error**: "Maximum 2 devices allowed. Contact admin to reset."

**Solution**:
1. Go to `/admin-gate`
2. Enter admin password (from `.env.local`)
3. Find your Member ID in the table
4. Click **Reset Devices**
5. Try logging in again

---

### 5. Leaderboard Not Updating

**Issue**: Changes in one tab don't appear in another tab

**Causes**:
- Firebase connection issue
- Browser cache
- Firestore rules blocking reads

**Solution**:
1. Check browser console for errors
2. Verify Firestore rules allow reads: `allow read: if true;`
3. Hard refresh both tabs (Ctrl+Shift+R or Cmd+Shift+R)
4. Check Firebase Console → Firestore Database to see if data is there

---

### 6. Node.js Version Error

**Error**: "Node.js version >=20.9.0 is required"

**Solution**:
```bash
# Option 1: Use nvm (recommended)
nvm install 20
nvm use 20

# Option 2: Download from nodejs.org
# Visit https://nodejs.org/ and install Node.js 20 LTS

# Verify version
node --version  # Should show v20.x.x
```

---

### 7. Environment Variables Not Loading

**Issue**: App shows Firebase errors or can't connect

**Solution**:
1. Make sure file is named `.env.local` (not `.env.example`)
2. Restart dev server after changing `.env.local`
3. Verify all variables start with `NEXT_PUBLIC_`
4. Check for typos in variable names
5. No quotes needed around values in `.env.local`

Example:
```env
# ✅ Correct
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123...

# ❌ Wrong
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyAbc123..."
```

---

### 8. Build Fails

**Error**: Various TypeScript or build errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Try build again
npm run build
```

---

### 9. Real-time Updates Not Working

**Issue**: Dashboard doesn't update when tasks are checked

**Causes**:
- Firestore rules blocking writes
- Network connection issue
- Browser blocking WebSocket connections

**Solution**:
1. Check browser console for errors
2. Verify Firestore rules allow writes
3. Check Network tab for WebSocket connections
4. Try in incognito mode to rule out extensions
5. Verify Firebase project is active and not paused

---

### 10. Admin Panel Password Not Working

**Issue**: Admin password rejected

**Solution**:
1. Check `.env.local` has `NEXT_PUBLIC_ADMIN_PASSWORD` set
2. Restart dev server after setting password
3. Password is case-sensitive
4. Try setting a simple password first to test: `admin123`
5. Check browser console for the actual password value:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_ADMIN_PASSWORD)
   ```

---

## Quick Diagnostic Checklist

Before asking for help, verify:

- [ ] Node.js version 20+ installed
- [ ] Firebase project created and Firestore enabled
- [ ] `.env.local` file exists with all credentials
- [ ] Firestore rules deployed from `firestore.rules`
- [ ] Database seeded via `/api/seed`
- [ ] Dev server running without errors
- [ ] Browser console shows no errors
- [ ] Network tab shows successful Firebase connections

---

## Getting More Help

If you're still stuck:

1. **Check browser console**: Press F12 → Console tab
2. **Check Network tab**: Look for failed requests
3. **Check Firebase Console**: Verify data exists in Firestore
4. **Check server logs**: Look at terminal where `npm run dev` is running

**Common Firebase Console checks**:
- Firestore Database → Data: Should see `roadmap` and `members` collections
- Firestore Database → Rules: Should match `firestore.rules` content
- Project Settings → General: Verify credentials match `.env.local`

---

## Security Note

⚠️ **Important**: The current Firestore rules (`allow read, write: if true`) are permissive for ease of development. For production deployment, consider:

1. Adding IP restrictions
2. Implementing rate limiting
3. Adding request validation
4. Using Firebase App Check
5. Restricting write operations to specific fields

The app is designed for a small, trusted group of 12 members, so the current security model is acceptable for that use case.

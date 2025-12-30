# Quick Setup Guide

## Prerequisites
- Node.js 20.9.0 or higher (current system has 18.19.1 - needs upgrade)
- Firebase account

## Setup Steps

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Get your project credentials from Project Settings → General → Your apps

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_PASSWORD=choose_a_secure_password
```

### 3. Deploy Firestore Security Rules

**Important**: This app uses custom Member ID authentication (not Firebase Auth), so the security rules are simplified.

1. Go to Firebase Console → Firestore Database → Rules
2. Copy the contents of `firestore.rules` from this project
3. Paste into the Firebase Console rules editor
4. Click **Publish**

The rules allow:
- ✅ Anyone to read roadmap data
- ✅ Members to create/update their own progress
- ✅ Device tracking and management
- ⚠️ Note: For production, you may want to add more restrictive rules based on your security requirements

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Development Server

```bash
npm run dev
```

### 6. Seed the Database

Once the dev server is running, navigate to:
```
http://localhost:3000/api/seed
```

You should see:
```json
{
  "success": true,
  "message": "Roadmap seeded successfully"
}
```

### 7. Test the Application

1. **Login**: Go to `http://localhost:3000`
   - Use any of the 12 Member IDs (e.g., `BB-X9R2-ZT`)
   
2. **Dashboard**: Check/uncheck tasks to see progress tracking

3. **Leaderboard**: Open in multiple tabs to see real-time updates

4. **Admin Panel**: Go to `/admin-gate`
   - Use the password you set in `.env.local`

## Valid Member IDs

```
BB-X9R2-ZT
BB-K4W5-PM
BB-Q7L1-VX
BB-N3B8-RD
BB-J6F9-KS
BB-H2M4-TY
BB-G8S5-QL
BB-V1C7-NZ
BB-P5D2-JW
BB-Z9T4-HX
BB-A3L6-MR
BB-S7K1-FP
```

## Production Build

⚠️ **Important**: Requires Node.js 20.9.0 or higher

```bash
npm run build
npm start
```

## Troubleshooting

### Node.js Version Error
If you see "Node.js version >=20.9.0 is required":
- Upgrade Node.js: https://nodejs.org/
- Or use nvm: `nvm install 20 && nvm use 20`

### Firebase Connection Issues
- Verify all environment variables are set correctly
- Check Firebase project is active
- Ensure Firestore is enabled

### Database Seeding Fails
- Make sure dev server is running
- Check Firebase credentials in `.env.local`
- Verify Firestore security rules are deployed

## Next Steps

1. Customize the roadmap content in `lib/firebase/seedRoadmap.ts`
2. Adjust theme colors in `app/globals.css`
3. Add/remove member IDs in `lib/constants/memberIds.ts`
4. Deploy to Vercel, Netlify, or your preferred platform

Enjoy tracking your Bug Bounty journey! 🚀

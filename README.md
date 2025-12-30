# Bug Bounty Roadmap Tracker

A professional, high-performance Bug Bounty Roadmap Tracker built with Next.js 15, Tailwind CSS, and Firebase Firestore. Features real-time progress tracking, device security, and a stunning Cyberpunk-themed UI.

## Features

- 🔐 **Secure Authentication**: Secret Member ID login with device fingerprinting (max 2 devices per member)
- 📊 **Real-time Dashboard**: Track progress through a comprehensive 12-week Bug Bounty learning roadmap
- 🏆 **Live Leaderboard**: Real-time progress updates across all members using Firebase onSnapshot
- 👨‍💼 **Admin Panel**: Monitor members, manage devices, and view detailed analytics
- 🎨 **Cyberpunk Theme**: Deep dark background (#0a0a0a) with neon green (#00ff41) and electric blue (#00d4ff) accents
- ⚡ **High Performance**: Built with Next.js 15, optimized for speed and responsiveness

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: Firebase Firestore
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Security**: FingerprintJS for device tracking

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- Firebase project with Firestore enabled

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bug-bounty-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_admin_password
```

4. Deploy Firestore security rules:
   - Go to Firebase Console → Firestore Database → Rules
   - Copy the contents of `firestore.rules` and publish

5. Seed the roadmap data:
```bash
# Option 1: Run the seed script directly
npm run dev
# Then navigate to /api/seed (if you create an API route)

# Option 2: Use Firebase console to manually import data
# Or run the seedRoadmap function from the browser console
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
npm run build
npm start
```

## Member IDs

The following 12 Secret Member IDs are valid for login:

- BB-X9R2-ZT
- BB-K4W5-PM
- BB-Q7L1-VX
- BB-N3B8-RD
- BB-J6F9-KS
- BB-H2M4-TY
- BB-G8S5-QL
- BB-V1C7-NZ
- BB-P5D2-JW
- BB-Z9T4-HX
- BB-A3L6-MR
- BB-S7K1-FP

## Usage

### For Members

1. **Login**: Enter your Secret Member ID on the login page
2. **Dashboard**: View and track your progress through the 12-week roadmap
3. **Leaderboard**: Check your ranking and see other members' progress in real-time

### For Admin

1. Navigate to `/admin-gate`
2. Enter the admin password (set in environment variables)
3. Monitor member activity and reset device logs as needed

## Project Structure

```
/app
  /dashboard        # User dashboard with roadmap
  /leaderboard      # Live leaderboard
  /admin-gate       # Admin command center
  layout.tsx        # Root layout
  page.tsx          # Login page
/components
  /ui               # Shadcn UI components
  WeekCard.tsx      # Week progress card
  LeaderboardTable.tsx  # Real-time leaderboard
/lib
  /firebase
    firebaseConfig.ts   # Firebase initialization
    seedRoadmap.ts      # Roadmap seed data
  /hooks
    useAuth.ts          # Authentication hook
  /store
    authStore.ts        # Zustand auth store
  /utils
    deviceFingerprint.ts  # Device tracking
  /constants
    memberIds.ts        # Valid member IDs
```

## Security Features

- **Device Guard**: Maximum 2 devices per member using browser fingerprinting
- **Firestore Rules**: Users can only update their own progress; admin has full access
- **Admin Protection**: Admin panel secured with environment variable password
- **Client-side Auth**: Authentication state managed with Zustand and persisted locally

## Customization

### Adding New Weeks/Tasks

Edit `lib/firebase/seedRoadmap.ts` and re-run the seed script, or use the admin panel (if roadmap modification UI is implemented).

### Changing Theme Colors

Edit `app/globals.css` under the `.dark` class to customize the Cyberpunk color scheme.

### Modifying Member IDs

Edit `lib/constants/memberIds.ts` to add or remove valid member IDs.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

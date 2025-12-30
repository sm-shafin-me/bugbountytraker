import { seedRoadmap } from './lib/firebase/seedRoadmap';

/**
 * Seed the Firestore database with the initial roadmap data
 * Run this script once after setting up your Firebase project
 * 
 * Usage:
 * 1. Make sure you have set up your .env.local file with Firebase credentials
 * 2. Start the dev server: npm run dev
 * 3. Open your browser console on http://localhost:3000
 * 4. Run: await import('/seed-database.ts').then(m => m.default())
 * 
 * Or create an API route to call this function
 */

export default async function runSeed() {
    console.log('Starting database seed...');
    const result = await seedRoadmap();
    console.log('Seed result:', result);
    return result;
}

// If you want to run this as a standalone script, uncomment below:
// runSeed().then(() => process.exit(0)).catch((err) => {
//   console.error(err);
//   process.exit(1);
// });

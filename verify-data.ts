
import { db } from './lib/firebase/firebaseConfig';
import { doc, getDoc, collection } from 'firebase/firestore';

async function verify() {
    console.log('Verifying roadmap week 1...');
    const week1Ref = doc(collection(db, 'roadmap', 'main', 'weeks'), 'week-1');
    const snap = await getDoc(week1Ref);
    if (snap.exists()) {
        const data = snap.data();
        console.log('Week 1 data:', JSON.stringify(data, null, 2));
    } else {
        console.log('Week 1 not found!');
    }
    process.exit(0);
}

verify().catch(console.error);

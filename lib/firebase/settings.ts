import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface SystemSettings {
    // guestModeEnabled: boolean; // Removed
}

const SETTINGS_DOC_ID = 'settings';
const SYSTEM_COLLECTION = 'system';

export const getSystemSettings = async (): Promise<SystemSettings> => {
    try {
        const docRef = doc(db, SYSTEM_COLLECTION, SETTINGS_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as SystemSettings;
        } else {
            // Default settings if not initialized
            return {} as SystemSettings;
        }
    } catch (error) {
        console.error("Error fetching system settings:", error);
        return {} as SystemSettings;
    }
};

export const updateSystemSettings = async (settings: Partial<SystemSettings>) => {
    try {
        const docRef = doc(db, SYSTEM_COLLECTION, SETTINGS_DOC_ID);
        await setDoc(docRef, settings, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error updating system settings:", error);
        return { success: false, error };
    }
};

export const subscribeToSystemSettings = (callback: (settings: SystemSettings) => void) => {
    const docRef = doc(db, SYSTEM_COLLECTION, SETTINGS_DOC_ID);
    return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data() as SystemSettings);
        } else {
            callback({} as SystemSettings);
        }
    });
};

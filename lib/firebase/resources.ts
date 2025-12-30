import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface Resource {
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export const CATEGORIES = [
    'Tools & Scanners',
    'Learning Platforms',
    'Documentation',
    'Vulnerability Databases',
    'Reports & Writeups',
    'Browser Extensions',
    'Other'
];

/**
 * Add a new resource
 */
export const addResource = async (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const docRef = await addDoc(collection(db, 'resources'), {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding resource:', error);
        return { success: false, error };
    }
};

/**
 * Update an existing resource
 */
export const updateResource = async (id: string, data: Partial<Omit<Resource, 'id' | 'createdAt'>>) => {
    try {
        const docRef = doc(db, 'resources', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString(),
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating resource:', error);
        return { success: false, error };
    }
};

/**
 * Delete a resource
 */
export const deleteResource = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'resources', id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting resource:', error);
        return { success: false, error };
    }
};

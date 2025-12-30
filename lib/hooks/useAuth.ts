'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuthStore } from '../store/authStore';
import { isMemberIdValid, type MemberId } from '../constants/memberIds';
import { generateDeviceFingerprint, getDeviceInfo } from '../utils/deviceFingerprint';

const MAX_DEVICES = 2;

export const useAuth = () => {
    const router = useRouter();
    const { memberId, deviceId, isAuthenticated, setAuth, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Login with Member ID
     */
    const login = async (inputMemberId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            // Validate Member ID
            if (!isMemberIdValid(inputMemberId)) {
                setError('Invalid Member ID');
                setLoading(false);
                return false;
            }

            // Generate device fingerprint
            const fingerprint = await generateDeviceFingerprint();
            const deviceInfo = getDeviceInfo();

            // Check member document
            const memberRef = doc(db, 'members', inputMemberId);
            const memberDoc = await getDoc(memberRef);

            if (!memberDoc.exists()) {
                // Create new member document
                await setDoc(memberRef, {
                    memberId: inputMemberId,
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    deviceCount: 1,
                });

                // Add device
                const devicesRef = collection(db, 'members', inputMemberId, 'devices');
                await setDoc(doc(devicesRef, fingerprint), {
                    deviceId: fingerprint,
                    ...deviceInfo,
                    firstSeen: new Date().toISOString(),
                    lastSeen: new Date().toISOString(),
                });

                setAuth(inputMemberId as MemberId, fingerprint);
                setLoading(false);
                return true;
            }

            // Check if device exists
            const deviceRef = doc(db, 'members', inputMemberId, 'devices', fingerprint);
            const deviceDoc = await getDoc(deviceRef);

            if (deviceDoc.exists()) {
                // Update last seen
                await updateDoc(deviceRef, {
                    lastSeen: new Date().toISOString(),
                });

                await updateDoc(memberRef, {
                    lastLogin: new Date().toISOString(),
                });

                setAuth(inputMemberId as MemberId, fingerprint);
                setLoading(false);
                return true;
            }

            // Check device count
            const devicesRef = collection(db, 'members', inputMemberId, 'devices');
            const devicesSnapshot = await getDocs(devicesRef);

            if (devicesSnapshot.size >= MAX_DEVICES) {
                setError(`Maximum ${MAX_DEVICES} devices allowed. Contact admin to reset.`);
                setLoading(false);
                return false;
            }

            // Add new device
            await setDoc(deviceRef, {
                deviceId: fingerprint,
                ...deviceInfo,
                firstSeen: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
            });

            await updateDoc(memberRef, {
                lastLogin: new Date().toISOString(),
                deviceCount: devicesSnapshot.size + 1,
            });

            setAuth(inputMemberId as MemberId, fingerprint);
            setLoading(false);
            return true;
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');
            setLoading(false);
            return false;
        }
    };

    /**
     * Check if user is authenticated
     */
    const checkAuth = () => {
        return isAuthenticated && memberId && deviceId;
    };

    /**
     * Logout user
     */
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return {
        memberId,
        deviceId,
        isAuthenticated,
        loading,
        error,
        login,
        logout: handleLogout,
        checkAuth,
    };
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MemberId } from '../constants/memberIds';

export interface AuthState {
    memberId: MemberId | null;
    deviceId: string | null;
    isAuthenticated: boolean;

    setAuth: (memberId: MemberId, deviceId: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            memberId: null,
            deviceId: null,
            isAuthenticated: false,

            setAuth: (memberId, deviceId) =>
                set({ memberId, deviceId, isAuthenticated: true }),
            logout: () =>
                set({ memberId: null, deviceId: null, isAuthenticated: false }),
        }),
        {
            name: 'bug-bounty-auth',
        }
    )
);

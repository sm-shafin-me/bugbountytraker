import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

/**
 * Initialize FingerprintJS
 */
const initFingerprint = () => {
    if (!fpPromise) {
        fpPromise = FingerprintJS.load();
    }
    return fpPromise;
};

/**
 * Generate a unique device fingerprint
 */
export const generateDeviceFingerprint = async (): Promise<string> => {
    try {
        const fp = await initFingerprint();
        const result = await fp.get();
        return result.visitorId;
    } catch (error) {
        console.error('Error generating device fingerprint:', error);
        // Fallback to a combination of browser properties
        const fallback = `${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.language}-${new Date().getTimezoneOffset()}`;
        return btoa(fallback);
    }
};

/**
 * Get device information for logging
 */
export const getDeviceInfo = () => {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
};

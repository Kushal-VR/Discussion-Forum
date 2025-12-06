import { Capacitor } from '@capacitor/core';

/**
 * Get the appropriate backend URL based on the platform
 * - Web: http://localhost:5132
 * - Android Emulator: http://10.0.2.2:5132
 * - Production: https://api1.discuza.in (or your production URL)
 */
export const getBackendURL = () => {
    // Check if running in Capacitor (mobile app)
    if (Capacitor.isNativePlatform()) {
        // Running on Android or iOS
        if (Capacitor.getPlatform() === 'android') {
            // Android emulator uses 10.0.2.2 to access host machine's localhost
            return 'http://10.0.2.2:5132';
        } else if (Capacitor.getPlatform() === 'ios') {
            // iOS simulator can use localhost directly
            return 'http://localhost:5132';
        }
    }

    // Running in web browser - use environment variable or default to localhost
    return process.env.REACT_APP_BACKEND_URL || 'http://localhost:5132';
};

export default getBackendURL;

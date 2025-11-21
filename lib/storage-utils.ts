/**
 * LocalStorage utilities for game persistence
 */

/**
 * Check if LocalStorage is available (handles private browsing, disabled storage)
 */
export const isLocalStorageAvailable = (): boolean => {
    try {
        const test = '__dnd_storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
};

/**
 * Get total size of LocalStorage in bytes
 */
export const getStorageSize = (): number => {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return total;
};

/**
 * Format bytes to human-readable size
 */
export const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

/**
 * Custom storage implementation with error handling
 */
export const createSafeStorage = () => {
    return {
        getItem: (name: string): string | null => {
            if (!isLocalStorageAvailable()) return null;
            try {
                return localStorage.getItem(name);
            } catch (error) {
                console.error('[Storage] Error reading from LocalStorage:', error);
                return null;
            }
        },
        setItem: (name: string, value: string): void => {
            if (!isLocalStorageAvailable()) {
                console.warn('[Storage] LocalStorage not available');
                return;
            }
            try {
                localStorage.setItem(name, value);
            } catch (error) {
                console.error('[Storage] Error writing to LocalStorage:', error);
                // Handle quota exceeded error
                if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                    console.error('[Storage] LocalStorage quota exceeded');
                }
            }
        },
        removeItem: (name: string): void => {
            if (!isLocalStorageAvailable()) return;
            try {
                localStorage.removeItem(name);
            } catch (error) {
                console.error('[Storage] Error removing from LocalStorage:', error);
            }
        },
    };
};

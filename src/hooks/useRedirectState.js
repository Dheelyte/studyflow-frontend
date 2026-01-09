import { useCallback } from 'react';

export const useRedirectState = () => {
    /**
     * Saves data to sessionStorage to be retrieved after a redirect.
     * @param {string} key - Unique key for the stored data.
     * @param {any} data - Data to store (will be JSON stringified).
     * @param {string} [elementId] - Optional ID of an element to scroll to after restoration.
     */
    const saveState = useCallback((key, data = null, elementId = null) => {
        if (!key) return;
        
        const state = {
            data,
            elementId,
            timestamp: Date.now()
        };
        
        try {
            sessionStorage.setItem(`studyspotify_state_${key}`, JSON.stringify(state));
        } catch (e) {
            console.warn('Failed to save redirect state:', e);
        }
    }, []);

    /**
     * Retrieves and clears stored data from sessionStorage.
     * @param {string} key - Unique key for the stored data.
     * @returns {object|null} - The stored state object { data, elementId } or null if not found.
     */
    const restoreState = useCallback((key) => {
        if (!key) return null;

        const storageKey = `studyspotify_state_${key}`;
        const storedItem = sessionStorage.getItem(storageKey);

        if (!storedItem) return null;

        try {
            const state = JSON.parse(storedItem);
            
            // Clear state after retrieval to prevent stale data usage
            sessionStorage.removeItem(storageKey);

            // Handle scroll restoration if elementId is present
            if (state.elementId) {
                // serialized timeout to ensure DOM is ready
                setTimeout(() => {
                    const element = document.getElementById(state.elementId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 500);
            }

            return state;
        } catch (e) {
            console.error('Failed to parse redirect state:', e);
            return null;
        }
    }, []);

    return { saveState, restoreState };
};

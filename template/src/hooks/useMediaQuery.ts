import { useState, useEffect } from 'react';

/**
 * Hook to check if a media query matches
 * @param query - Media query string
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        // Set initial value
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        // Create event listener
        const listener = () => setMatches(media.matches);

        // Add listener
        media.addEventListener('change', listener);

        // Clean up
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

// Predefined breakpoints
export function useIsMobile() {
    return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet() {
    return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

export function useIsDesktop() {
    return useMediaQuery('(min-width: 1025px)');
}

import { useEffect, useState } from 'react';

export function useVisualViewport() {
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined' || !window.visualViewport) return;

        const handleResize = () => {
            setHeight(window.visualViewport?.height ?? window.innerHeight);
        };

        window.visualViewport.addEventListener('resize', handleResize);

        // Initial set
        handleResize();

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
        };
    }, []);

    return height;
}

'use client';

import { useState, useEffect } from 'react';

export function useVisualViewport() {
    const [viewportHeight, setViewportHeight] = useState<number>(0);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.visualViewport) {
            setViewportHeight(window.innerHeight);
            return;
        }

        const handleResize = () => {
            const viewport = window.visualViewport!;
            const windowHeight = window.innerHeight;
            const viewportHeightValue = viewport.height;

            setViewportHeight(viewportHeightValue);
            // Keyboard height is the difference between window and visual viewport
            setKeyboardHeight(Math.max(0, windowHeight - viewportHeightValue));
        };

        handleResize(); // Initial call

        window.visualViewport.addEventListener('resize', handleResize);
        window.visualViewport.addEventListener('scroll', handleResize);

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.visualViewport?.removeEventListener('scroll', handleResize);
        };
    }, []);

    return { viewportHeight, keyboardHeight };
}

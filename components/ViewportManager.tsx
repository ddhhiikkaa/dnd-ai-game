'use client';

import { useVisualViewport } from '@/hooks/useVisualViewport';
import { useEffect } from 'react';

export default function ViewportManager() {
    const { viewportHeight, keyboardHeight } = useVisualViewport();

    useEffect(() => {
        if (viewportHeight > 0) {
            document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
            document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
        }
    }, [viewportHeight, keyboardHeight]);

    return null;
}

'use client';

import { useVisualViewport } from '@/hooks/useVisualViewport';
import { useEffect } from 'react';

export default function ViewportFix() {
    const height = useVisualViewport();

    useEffect(() => {
        if (height) {
            document.documentElement.style.setProperty('--app-height', `${height}px`);
        }
    }, [height]);

    return null;
}

'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';

export default function SaveIndicator() {
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
    const gameState = useGameStore((state) => state.gameState);
    const messages = useGameStore((state) => state.messages);

    useEffect(() => {
        // Show "Saved" indicator briefly whenever state changes
        if (gameState.character || messages.length > 0) {
            setSaveStatus('saved');
            const timer = setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [gameState, messages]);

    if (saveStatus === 'idle') return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-1.5 flex items-center gap-2 backdrop-blur-sm">
                <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <span className="text-xs font-medium text-green-300">Saved</span>
            </div>
        </div>
    );
}

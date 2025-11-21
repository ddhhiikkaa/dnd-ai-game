'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { rollDice } from '@/lib/dice';

const DICE_TYPES = [
    { type: 'd4', color: 'bg-red-900' },
    { type: 'd6', color: 'bg-blue-900' },
    { type: 'd8', color: 'bg-green-900' },
    { type: 'd10', color: 'bg-purple-900' },
    { type: 'd12', color: 'bg-orange-900' },
    { type: 'd20', color: 'bg-yellow-900' },
];

export default function DiceTray() {
    const { addMessage } = useGameStore();
    const [rolling, setRolling] = useState<string | null>(null);
    const [result, setResult] = useState<number | null>(null);

    const handleRoll = (diceType: string) => {
        setRolling(diceType);
        setResult(null);

        // Simulate animation time
        setTimeout(() => {
            const { total } = rollDice(`1${diceType}`);
            setResult(total);

            // Add to chat after showing result briefly
            setTimeout(() => {
                addMessage({
                    id: Date.now().toString(),
                    role: 'user',
                    content: `[Rolled ${diceType}: ${total}]`,
                    type: 'roll'
                });
                setRolling(null);
                setResult(null);
            }, 1000);
        }, 600);
    };

    return (
        <div className="p-2 bg-[#1a1a2e] border-t border-gray-800">
            {rolling && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="text-center animate-bounce">
                        <div className={`text-6xl font-bold text-gold ${result ? 'scale-150' : 'animate-spin'}`}>
                            {result ?? '?'}
                        </div>
                        <div className="text-white mt-4 font-display text-xl uppercase tracking-widest">
                            Rolling {rolling}...
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
                {DICE_TYPES.map(({ type, color }) => (
                    <button
                        key={type}
                        onClick={() => handleRoll(type)}
                        className={`${color} w-12 h-12 rounded-lg flex items-center justify-center border border-white/10 hover:scale-105 transition-transform shadow-lg`}
                    >
                        <span className="font-bold text-white text-xs">{type}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useGameStore } from '@/lib/store';
import { rollDice } from '@/lib/dice';

export default function RollPrompt() {
    const { pendingRoll, setPendingRoll, addMessage } = useGameStore();

    if (!pendingRoll) return null;

    const handleRoll = () => {
        const { dice, reason } = pendingRoll;
        const { total } = rollDice(dice);

        addMessage({
            id: Date.now().toString(),
            role: 'user',
            content: `[Rolled ${dice} for ${reason}: ${total}]`,
            type: 'roll'
        });

        setPendingRoll(null);
    };

    return (
        <div className="fixed bottom-28 left-0 right-0 z-40 flex justify-center pointer-events-none animate-slide-up">
            <div className="relative group cursor-pointer pointer-events-auto" onClick={handleRoll}>
                {/* Pulsing Rings */}
                <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />

                {/* Main Button */}
                <button
                    className="relative w-32 h-32 rounded-full bg-[#1a1a2e] border-2 border-purple-500/50 shadow-[0_0_30px_rgba(138,43,226,0.3)] flex flex-col items-center justify-center gap-1 group-hover:scale-105 transition-transform duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-purple-900/30" />

                    <span className="relative z-10 text-[10px] font-bold text-purple-300 uppercase tracking-[0.2em] animate-pulse">
                        Roll For
                    </span>
                    <span className="relative z-10 text-xs font-bold text-white max-w-[90%] text-center leading-tight px-2">
                        {pendingRoll.reason}
                    </span>
                    <div className="relative z-10 text-3xl font-display text-transparent bg-clip-text bg-gradient-to-br from-gold via-yellow-200 to-yellow-600 drop-shadow-sm mt-1">
                        {pendingRoll.dice}
                    </div>

                    <div className="absolute bottom-4 text-[8px] text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        Click
                    </div>
                </button>
            </div>
        </div>
    );
}

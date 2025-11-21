'use client';

import { useGameStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function CombatTracker() {
    const combat = useGameStore((state) => state.gameState.combat);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (combat.isActive) {
            setIsVisible(true);
        } else {
            // Delay hiding for exit animation
            const timer = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(timer);
        }
    }, [combat.isActive]);

    if (!isVisible) return null;

    return (
        <div className={`
            h-full overflow-hidden flex flex-col bg-gray-900/50 border-l border-gray-800
            transition-all duration-500
            ${combat.isActive ? 'opacity-100' : 'opacity-0'}
        `}>
            <div className="p-4 border-b border-red-500/30 bg-red-900/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <div className="flex items-center justify-between">
                    <h3 className="font-display text-red-400 font-bold flex items-center gap-2 text-lg">
                        <span>⚔️</span> Combat Encounter
                    </h3>
                    <span className="text-xs text-gray-400 bg-black/40 px-2 py-1 rounded border border-white/10">
                        Turn {combat.turn}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {combat.enemies.length === 0 ? (
                    <div className="text-xs text-gray-500 text-center py-2 italic">
                        Waiting for enemies...
                    </div>
                ) : (
                    combat.enemies.map((enemy) => {
                        const hpPercent = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));
                        const isDefeated = enemy.status === 'defeated' || enemy.hp <= 0;

                        return (
                            <div
                                key={enemy.id}
                                className={`
                                        relative p-3 rounded-lg border transition-all duration-300
                                        ${isDefeated
                                        ? 'bg-black/60 border-gray-800 opacity-60 grayscale'
                                        : 'bg-black/40 border-white/10 hover:border-red-500/30'
                                    }
                                    `}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`font-bold text-sm ${isDefeated ? 'text-gray-500 line-through' : 'text-white'}`}>
                                        {enemy.name}
                                    </span>
                                    <span className={`text-xs font-mono ${isDefeated ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {enemy.hp}/{enemy.maxHp} HP
                                    </span>
                                </div>

                                {/* HP Bar */}
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${isDefeated ? 'bg-gray-600' : 'bg-gradient-to-r from-red-600 to-red-400'
                                            }`}
                                        style={{ width: `${hpPercent}%` }}
                                    />
                                </div>

                                {/* Status Badge */}
                                {isDefeated && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-lg">
                                        <span className="text-red-500 font-bold text-xs border border-red-500/50 px-2 py-1 rounded bg-black/80 uppercase tracking-wider transform -rotate-12">
                                            Defeated
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

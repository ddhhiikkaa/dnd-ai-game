'use client';

import { useGameStore } from '@/lib/store';
import { getModifier } from '@/lib/dice';
import { useState } from 'react';

export default function CharacterSheet() {
    const character = useGameStore((state) => state.gameState.character);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!character) return null;

    const hpPercent = (character.hp / character.maxHp) * 100;

    return (
        <div className="glass-panel mb-4 transition-all duration-300 ease-in-out overflow-hidden border-b border-white/5">
            {/* Compact Header View */}
            <div
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg border border-white/20">
                        <span className="font-display font-bold text-lg">{character.name[0]}</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-white leading-tight">{character.name}</h2>
                        <p className="text-xs text-gray-400">{character.class} Lv.{character.level}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right w-24">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-red-400 font-bold">HP</span>
                            <span className="text-gray-300">{character.hp}/{character.maxHp}</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                                style={{ width: `${hpPercent}%` }}
                            />
                        </div>
                    </div>
                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} text-gray-500`}>
                        ▼
                    </div>
                </div>
            </div>

            {/* Expanded Stats View */}
            {isExpanded && (
                <div className="p-4 pt-0 border-t border-white/5 animate-fade-in">
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {Object.entries(character.stats).map(([attr, score]) => (
                            <div key={attr} className="bg-black/40 p-2 rounded-lg border border-white/5 text-center hover:border-purple-500/30 transition-colors">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{attr}</div>
                                <div className="font-bold text-white text-lg">{score}</div>
                                <div className="text-xs text-purple-400 font-mono">
                                    {getModifier(score as number) >= 0 ? '+' : ''}{getModifier(score as number)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-2 text-xs text-gray-400">
                        <div className="bg-black/40 px-3 py-1 rounded-full border border-white/5">
                            AC <span className="text-white font-bold ml-1">{10 + getModifier(character.stats.dex)}</span>
                        </div>
                        <div className="bg-black/40 px-3 py-1 rounded-full border border-white/5">
                            Gold <span className="text-gold font-bold ml-1">{useGameStore.getState().gameState.gold}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

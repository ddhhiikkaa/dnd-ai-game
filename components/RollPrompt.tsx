'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { rollDice, parseDiceNotation, getDiceType, getDifficultyLabel } from '@/lib/dice';
import DiceIcon from './DiceIcon';

export default function RollPrompt() {
    const { pendingRoll, setPendingRoll, addMessage } = useGameStore();
    const [isRolling, setIsRolling] = useState(false);
    const [result, setResult] = useState<number | null>(null);

    if (!pendingRoll) return null;

    const parsedDice = parseDiceNotation(pendingRoll.dice);
    const diceType = getDiceType(parsedDice.sides);
    const difficulty = getDifficultyLabel(pendingRoll.reason);

    const handleRoll = () => {
        if (isRolling) return;

        setIsRolling(true);

        // Simulate rolling delay for animation
        setTimeout(() => {
            const { total, rolls } = rollDice(pendingRoll.dice);
            setResult(total);
            setIsRolling(false);

            // Send to chat after brief display
            setTimeout(() => {
                addMessage({
                    id: Date.now().toString(),
                    role: 'user',
                    content: `🎲 Rolled ${pendingRoll.dice} for ${pendingRoll.reason}: **${total}**`,
                    type: 'roll'
                });

                // Reset state
                setPendingRoll(null);
                setResult(null);
            }, 2000);
        }, 1500);
    };

    const difficultyColors: Record<string, string> = {
        green: 'bg-green-500/20 border-green-500/50 text-green-300',
        yellow: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
        orange: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
        red: 'bg-red-500/20 border-red-500/50 text-red-300'
    };

    return (
        <div className="fixed bottom-28 left-0 right-0 z-40 flex justify-center pointer-events-none animate-slide-up">
            <div className="relative group pointer-events-auto max-w-[90%]">
                {/* Pulsing Rings */}
                <div className="absolute inset-0 bg-purple-500/20 rounded-2xl animate-ping" />
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />

                {/* Main Roll Container */}
                <div className="relative bg-[#1a1a2e] border-2 border-purple-500/50 shadow-[0_0_30px_rgba(138,43,226,0.3)] rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-purple-900/30" />

                    <div className="relative z-10 p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                                <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1">
                                    Roll For
                                </div>
                                <div className="text-sm font-bold text-white leading-tight">
                                    {pendingRoll.reason}
                                </div>
                            </div>

                            {/* Difficulty Badge */}
                            <div className={`px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${difficultyColors[difficulty.color]}`}>
                                {difficulty.label}
                            </div>
                        </div>

                        {/* Dice Display */}
                        <div className="flex items-center gap-4">
                            {/* Visual Dice */}
                            <div
                                className="flex-shrink-0 cursor-pointer"
                                onClick={handleRoll}
                            >
                                <DiceIcon
                                    sides={parsedDice.sides}
                                    isRolling={isRolling}
                                    result={result || undefined}
                                />
                            </div>

                            {/* Info Column */}
                            <div className="flex-1 min-w-0">
                                {/* Dice notation */}
                                <div className="text-2xl font-display text-transparent bg-clip-text bg-gradient-to-br from-gold via-yellow-200 to-yellow-600 mb-1">
                                    {pendingRoll.dice}
                                </div>

                                {/* Beginner-friendly label */}
                                <div className="text-xs text-gray-400 mb-2">
                                    {parsedDice.count > 1 ? `${parsedDice.count} ` : ''}
                                    {diceType.split('(')[0].trim()}
                                    {parsedDice.modifier !== 0 && (
                                        <span className="text-purple-400">
                                            {parsedDice.modifier > 0 ? ' +' : ' '}{parsedDice.modifier}
                                        </span>
                                    )}
                                </div>

                                {/* Action Prompt */}
                                {!isRolling && !result && (
                                    <div className="text-xs text-purple-400 font-bold animate-pulse">
                                        👆 Tap to roll
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Result Display */}
                        {result && !isRolling && (
                            <div className="mt-3 pt-3 border-t border-white/10 animate-number-reveal">
                                <div className="text-center">
                                    <div className="text-xs text-gray-400 mb-1">You rolled</div>
                                    <div className="text-4xl font-bold text-white drop-shadow-lg">
                                        {result}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

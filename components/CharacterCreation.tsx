'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Character, Attribute } from '@/lib/types';
import { rollDice, getModifier } from '@/lib/dice';
import { getRandomScenario, formatScenarioText } from '@/lib/starting-scenarios';

const CLASSES = {
    Warrior: { hp: 12, items: ['Longsword', 'Chain Mail', 'Shield'] },
    Mage: { hp: 6, items: ['Staff', 'Robes', 'Spellbook'] },
    Rogue: { hp: 8, items: ['Daggers (2)', 'Leather Armor', 'Thieves Tools'] },
    Cleric: { hp: 10, items: ['Mace', 'Scale Mail', 'Holy Symbol'] },
};

export default function CharacterCreation() {
    const { setGameState, startGame, addMessage } = useGameStore();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [name, setName] = useState('');
    const [charClass, setCharClass] = useState<keyof typeof CLASSES | ''>('');
    const [attributes, setAttributes] = useState<Record<Attribute, number>>({
        STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
    });

    const handleRollStats = () => {
        const newStats = {} as Record<Attribute, number>;
        (['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Attribute[]).forEach(attr => {
            // Roll 4d6 drop lowest
            const result = rollDice('4d6');
            const sorted = result.rolls.sort((a, b) => a - b);
            newStats[attr] = sorted.slice(1).reduce((a, b) => a + b, 0);
        });
        setAttributes(newStats);
    };

    const handleFinish = () => {
        if (!name || !charClass) return;

        const classData = CLASSES[charClass];
        const conMod = getModifier(attributes.CON);
        const maxHp = classData.hp + conMod;

        const newChar: Character = {
            name,
            class: charClass,
            level: 1,
            hp: maxHp,
            maxHp: maxHp,
            xp: 0,
            stats: {
                str: attributes.STR,
                dex: attributes.DEX,
                con: attributes.CON,
                int: attributes.INT,
                wis: attributes.WIS,
                cha: attributes.CHA,
            },
        };

        // Select random starting scenario
        const scenario = getRandomScenario();
        const openingMessage = formatScenarioText(scenario.opening, name, charClass);

        setGameState({
            character: newChar,
            inventory: classData.items,
            gold: 10, // Starting gold
            location: scenario.location,
            time: scenario.timeOfDay,
            scenarioId: scenario.id,
            scenarioAtmosphere: scenario.atmosphere,
        });

        addMessage({
            id: 'init',
            role: 'assistant',
            content: openingMessage
        });

        startGame();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="panel w-full max-w-md space-y-6">
                <h1 className="text-2xl font-display text-gold text-center">Create Hero</h1>

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#1a1a2e] border border-gray-700 rounded p-2 text-white focus:border-purple-500 outline-none"
                                placeholder="Enter name..."
                            />
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!name}
                            className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white p-2 rounded transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <label className="block text-sm text-gray-400 mb-1">Choose Class</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(CLASSES) as Array<keyof typeof CLASSES>).map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCharClass(c)}
                                    className={`p-3 rounded border ${charClass === c
                                        ? 'border-purple-500 bg-purple-900/20 text-white'
                                        : 'border-gray-700 bg-[#1a1a2e] text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(3)}
                            disabled={!charClass}
                            className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white p-2 rounded transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-400">Attributes</label>
                            <button onClick={handleRollStats} className="text-xs text-gold hover:underline">
                                Reroll (4d6 drop lowest)
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                            {Object.entries(attributes).map(([attr, score]) => (
                                <div key={attr} className="bg-[#1a1a2e] p-2 rounded border border-gray-700">
                                    <div className="text-xs text-gray-500">{attr}</div>
                                    <div className="font-bold text-lg">{score}</div>
                                    <div className="text-xs text-gray-400">{getModifier(score) >= 0 ? '+' : ''}{getModifier(score)}</div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleFinish}
                            className="w-full bg-green-700 hover:bg-green-600 text-white p-3 rounded font-bold transition-colors mt-4"
                        >
                            Start Adventure
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

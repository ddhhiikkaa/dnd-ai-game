import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, ChatMessage } from './types';
import { createSafeStorage } from './storage-utils';

interface GameStore {
    gameState: GameState;
    messages: ChatMessage[];
    pendingRoll: { dice: string; reason: string } | null;
    setPendingRoll: (roll: { dice: string; reason: string } | null) => void;
    setGameState: (state: GameState) => void;
    addMessage: (message: ChatMessage) => void;
    updateMessage: (id: string, content: string) => void;
    updateHP: (amount: number) => void;
    addXP: (amount: number) => void;
    updateGold: (amount: number) => void;
    addItem: (item: string) => void;
    removeItem: (item: string) => void;
    isGameStarted: boolean;
    startGame: () => void;
    resetGame: () => void;
    // Combat Actions
    startCombat: () => void;
    endCombat: () => void;
    addEnemy: (name: string, hp: number) => void;
    damageEnemy: (name: string, amount: number) => void;
    defeatEnemy: (name: string) => void;
}

const initialState = {
    gameState: {
        character: null,
        inventory: [],
        gold: 0,
        location: "Unknown",
        time: "Day",
        combat: {
            isActive: false,
            enemies: [],
            turn: 1
        }
    },
    messages: [],
    isGameStarted: false,
};

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            ...initialState,
            pendingRoll: null,

            setPendingRoll: (roll) => set({ pendingRoll: roll }),

            setGameState: (state) => set({ gameState: state }),

            addMessage: (message) =>
                set((state) => ({ messages: [...state.messages, message] })),

            updateMessage: (id, content) =>
                set((state) => ({
                    messages: state.messages.map((msg) =>
                        msg.id === id ? { ...msg, content } : msg
                    ),
                })),

            updateHP: (amount) =>
                set((state) => {
                    if (!state.gameState.character) {
                        console.log('[DEBUG] updateHP called but no character exists');
                        return state;
                    }
                    const currentHP = state.gameState.character.hp;
                    const newHP = Math.min(
                        state.gameState.character.maxHp,
                        Math.max(0, state.gameState.character.hp + amount)
                    );
                    console.log('[DEBUG] HP Update:', {
                        amount,
                        currentHP,
                        newHP,
                        maxHp: state.gameState.character.maxHp
                    });
                    return {
                        gameState: {
                            ...state.gameState,
                            character: { ...state.gameState.character, hp: newHP },
                        },
                    };
                }),

            addXP: (amount) =>
                set((state) => {
                    if (!state.gameState.character) return state;
                    return {
                        gameState: {
                            ...state.gameState,
                            character: {
                                ...state.gameState.character,
                                xp: state.gameState.character.xp + amount,
                            },
                        },
                    };
                }),

            updateGold: (amount) =>
                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        gold: Math.max(0, state.gameState.gold + amount),
                    },
                })),

            addItem: (item) =>
                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        inventory: [...state.gameState.inventory, item],
                    },
                })),

            removeItem: (item) =>
                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        inventory: state.gameState.inventory.filter((i) => i !== item),
                    },
                })),

            startGame: () => set({ isGameStarted: true }),

            resetGame: () => {
                localStorage.removeItem('dnd-game-save');
                set(initialState);
            },

            // Combat Actions
            startCombat: () =>
                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        combat: { isActive: true, enemies: [], turn: 1 }
                    }
                })),

            endCombat: () =>
                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        combat: { isActive: false, enemies: [], turn: 1 }
                    }
                })),

            addEnemy: (name, hp) =>
                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        combat: {
                            ...state.gameState.combat,
                            isActive: true, // Ensure combat is active when enemy added
                            enemies: [
                                ...state.gameState.combat.enemies,
                                {
                                    id: Math.random().toString(36).substr(2, 9),
                                    name,
                                    hp,
                                    maxHp: hp,
                                    status: 'alive'
                                }
                            ]
                        }
                    }
                })),

            damageEnemy: (name, amount) =>
                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        combat: {
                            ...state.gameState.combat,
                            enemies: state.gameState.combat.enemies.map(e =>
                                e.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(e.name.toLowerCase())
                                    ? { ...e, hp: Math.max(0, e.hp - amount) }
                                    : e
                            )
                        }
                    }
                })),

            defeatEnemy: (name) =>
                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        combat: {
                            ...state.gameState.combat,
                            enemies: state.gameState.combat.enemies.map(e =>
                                e.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(e.name.toLowerCase())
                                    ? { ...e, hp: 0, status: 'defeated' }
                                    : e
                            )
                        }
                    }
                })),
        }),
        {
            name: 'dnd-game-save',
            version: 1,
            storage: createJSONStorage(() => createSafeStorage()),
            partialize: (state) => ({
                gameState: state.gameState,
                messages: state.messages,
                isGameStarted: state.isGameStarted,
                // Exclude pendingRoll - it's ephemeral UI state
            }),
        }
    )
);

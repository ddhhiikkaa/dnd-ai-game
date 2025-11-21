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
}

const initialState = {
    gameState: {
        character: null,
        inventory: [],
        gold: 0,
        location: "Unknown",
        time: "Day",
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
                console.log('[Storage] Resetting game state');
                set(initialState);
            },
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

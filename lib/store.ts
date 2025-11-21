import { create } from 'zustand';
import { GameState, Character, ChatMessage } from './types';

interface GameStore extends GameState {
    character: Character | null;
    messages: ChatMessage[];
    isGameStarted: boolean;
    pendingRoll: { dice: string; reason: string } | null;

    setCharacter: (char: Character) => void;
    addMessage: (msg: ChatMessage) => void;
    updateMessage: (id: string, content: string) => void;
    updateHp: (amount: number) => void;
    setPendingRoll: (roll: { dice: string; reason: string } | null) => void;
    startGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
    character: null,
    messages: [],
    isGameStarted: false,
    pendingRoll: null,

    setCharacter: (char) => set({ character: char }),

    addMessage: (msg) => set((state) => ({
        messages: [...state.messages, msg]
    })),

    updateMessage: (id, content) => set((state) => ({
        messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, content } : msg
        )
    })),

    updateHp: (amount) => set((state) => {
        if (!state.character) return {};
        const newHp = Math.min(state.character.maxHp, Math.max(0, state.character.hp + amount));
        return { character: { ...state.character, hp: newHp } };
    }),

    setPendingRoll: (roll) => set({ pendingRoll: roll }),

    startGame: () => set({ isGameStarted: true }),
}));

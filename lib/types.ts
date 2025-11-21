export type Attribute = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface Character {
    name: string;
    class: string;
    level: number;
    hp: number;
    maxHp: number;
    ac: number; // Armor Class
    attributes: Record<Attribute, number>;
    inventory: string[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    type?: 'narrative' | 'action' | 'roll';
    metadata?: any;
}

export interface GameState {
    character: Character | null;
    messages: ChatMessage[];
    isGameStarted: boolean;
}

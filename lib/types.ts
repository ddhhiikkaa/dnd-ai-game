export type Attribute = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface Character {
    name: string;
    class: string;
    stats: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
    hp: number;
    maxHp: number;
    xp: number;
    ac: number;
    level: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    type?: 'narrative' | 'action' | 'roll';
    metadata?: any;
}

export interface Enemy {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    status: 'alive' | 'defeated';
}

export interface CombatState {
    isActive: boolean;
    enemies: Enemy[];
    turn: number;
}

export interface GameState {
    character: Character | null;
    inventory: string[];
    gold: number;
    location: string;
    time: string;
    scenarioId?: string; // Which scenario was selected
    scenarioAtmosphere?: string; // For AI context about the setting
    combat: CombatState;
}

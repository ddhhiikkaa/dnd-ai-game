export function rollDice(notation: string): { total: number; rolls: number[] } {
    const [countStr, sidesStr] = notation.toLowerCase().split('d');
    const count = parseInt(countStr) || 1;
    const sides = parseInt(sidesStr) || 20;

    const rolls: number[] = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }

    return { total, rolls };
}

export function getModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

export interface ParsedDice {
    count: number;
    sides: number;
    modifier: number;
    raw: string;
}

export function parseDiceNotation(notation: string): ParsedDice {
    // Parse formats like "1d20", "2d6+3", "4d6-2"
    const match = notation.match(/(\d+)?d(\d+)([+-]\d+)?/i);

    if (!match) {
        return { count: 1, sides: 20, modifier: 0, raw: notation };
    }

    return {
        count: parseInt(match[1] || '1'),
        sides: parseInt(match[2]),
        modifier: match[3] ? parseInt(match[3]) : 0,
        raw: notation
    };
}

export function getDiceType(sides: number): string {
    const types: Record<number, string> = {
        4: 'd4 (Pyramid)',
        6: 'd6 (Cube)',
        8: 'd8 (Octahedron)',
        10: 'd10 (Pentagonal)',
        12: 'd12 (Dodecahedron)',
        20: 'd20 (Icosahedron)',
        100: 'd100 (Percentile)'
    };
    return types[sides] || `d${sides}`;
}

export interface Difficulty {
    label: string;
    color: string;
    dc: number;
}

export function getDifficultyLabel(reason: string, dc?: number): Difficulty {
    // Extract DC from reason if present
    if (!dc) {
        const dcMatch = reason.match(/DC\s*(\d+)/i);
        dc = dcMatch ? parseInt(dcMatch[1]) : 10; // default medium
    }

    if (dc <= 10) return { label: 'Easy', color: 'green', dc };
    if (dc <= 15) return { label: 'Medium', color: 'yellow', dc };
    if (dc <= 20) return { label: 'Hard', color: 'orange', dc };
    return { label: 'Very Hard', color: 'red', dc };
}

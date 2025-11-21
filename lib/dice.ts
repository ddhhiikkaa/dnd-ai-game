export function rollDice(notation: string): { total: number; rolls: number[]; breakdown: string } {
    // Simple parser for "XdY+Z" format (e.g., "1d20+5")
    const match = notation.match(/^(\d+)d(\d+)(?:([+-])(\d+))?$/);

    if (!match) {
        throw new Error(`Invalid dice notation: ${notation}`);
    }

    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    const modifierSign = match[3];
    const modifierVal = match[4] ? parseInt(match[4], 10) : 0;

    const rolls: number[] = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }

    if (modifierSign === '+') {
        total += modifierVal;
    } else if (modifierSign === '-') {
        total -= modifierVal;
    }

    const breakdown = `[${rolls.join(', ')}]${modifierSign ? ` ${modifierSign} ${modifierVal}` : ''}`;

    return { total, rolls, breakdown };
}

export function getModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

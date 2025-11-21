'use client';

interface DiceIconProps {
    sides: number;
    isRolling: boolean;
    result?: number;
    size?: number;
}

export default function DiceIcon({ sides, isRolling, result, size = 80 }: DiceIconProps) {
    const getDiceEmoji = (sides: number) => {
        const emojis: Record<number, string> = {
            4: '🔺',
            6: '🎲',
            8: '🔷',
            10: '🔟',
            12: '⬢',
            20: '🎯',
            100: '💯'
        };
        return emojis[sides] || '🎲';
    };

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Rolling State */}
            {isRolling && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-dice-tumble">
                        {getDiceEmoji(sides)}
                    </div>
                </div>
            )}

            {/* Result State */}
            {!isRolling && result !== undefined && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-number-reveal">
                    <div className="text-2xl opacity-50 mb-1">
                        {getDiceEmoji(sides)}
                    </div>
                    <div className="text-4xl font-bold text-white drop-shadow-lg">
                        {result}
                    </div>
                </div>
            )}

            {/* Idle State */}
            {!isRolling && result === undefined && (
                <div className="absolute inset-0 flex items-center justify-center opacity-70">
                    <div className="text-5xl">
                        {getDiceEmoji(sides)}
                    </div>
                </div>
            )}
        </div>
    );
}

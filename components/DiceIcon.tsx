'use client';

import Image from 'next/image';

interface DiceIconProps {
    sides: number;
    isRolling: boolean;
    result?: number;
    size?: number;
}

export default function DiceIcon({ sides, isRolling, result, size = 80 }: DiceIconProps) {
    const getDiceImage = (sides: number): string => {
        const images: Record<number, string> = {
            4: '/dice_d4_1763716702991.png',
            6: '/dice_d6_1763716683397.png',
            8: '/dice_d8_1763716725755.png',
            10: '/dice_d10_1763716742366.png',
            12: '/dice_d12_1763716759957.png',
            20: '/dice_d20_1763716663930.png',
        };
        return images[sides] || images[20];
    };

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Rolling State */}
            {isRolling && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-dice-tumble">
                        <Image
                            src={getDiceImage(sides)}
                            alt={`d${sides}`}
                            width={size}
                            height={size}
                            className="drop-shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {/* Result State */}
            {!isRolling && result !== undefined && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-number-reveal">
                    <div className="opacity-40 mb-1" style={{ width: size * 0.6, height: size * 0.6 }}>
                        <Image
                            src={getDiceImage(sides)}
                            alt={`d${sides}`}
                            width={size * 0.6}
                            height={size * 0.6}
                            className="drop-shadow-lg"
                        />
                    </div>
                    <div className="text-4xl font-bold text-white drop-shadow-lg">
                        {result}
                    </div>
                </div>
            )}

            {/* Idle State */}
            {!isRolling && result === undefined && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src={getDiceImage(sides)}
                        alt={`d${sides}`}
                        width={size}
                        height={size}
                        className="opacity-90 drop-shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
}

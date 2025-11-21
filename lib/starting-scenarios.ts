/**
 * Starting scenarios for D&D adventures
 * Inspired by popular D&D campaigns and classic fantasy tropes
 */

export interface Scenario {
    id: string;
    name: string;
    location: string;
    timeOfDay: 'Dawn' | 'Day' | 'Dusk' | 'Night';
    opening: string; // Opening text with {name} and {class} placeholders
    atmosphere: string; // Setting description for AI context
}

export const STARTING_SCENARIOS: Scenario[] = [
    {
        id: 'goblin-ambush',
        name: 'Goblin Ambush',
        location: 'Triboar Trail',
        timeOfDay: 'Day',
        opening: `Welcome, {name} the {class}. You're traveling along the Triboar Trail when arrows suddenly whistle from the treeline. Goblins! Your hand moves to your weapon as shadows dart between the trees. What do you do?`,
        atmosphere: 'Forest road under attack, inspired by Lost Mine of Phandelver. Immediate danger, combat likely.'
    },
    {
        id: 'mysterious-mist',
        name: 'The Mists',
        location: 'Edge of Barovia',
        timeOfDay: 'Dusk',
        opening: `Greetings, {name} the {class}. Thick, unnatural fog surrounds you on all sides. When it finally clears, the land looks... different. The trees are twisted, the sky gray. A gothic castle looms on a distant hill. Where are you?`,
        atmosphere: 'Gothic horror setting inspired by Curse of Strahd. Mysterious, ominous, otherworldly.'
    },
    {
        id: 'tavern-trouble',
        name: 'Tavern Trouble',
        location: 'The Prancing Pony Inn',
        timeOfDay: 'Night',
        opening: `Well met, {name} the {class}. You're enjoying ale at the Prancing Pony when heated voices escalate at a nearby table. Steel rings as swords are drawn. The innkeeper ducks behind the bar. What do you do?`,
        atmosphere: 'Classic D&D tavern brawl. Urban setting, social encounter turning violent.'
    },
    {
        id: 'shipwreck',
        name: 'Shipwreck Shore',
        location: 'Wreckage Beach',
        timeOfDay: 'Dawn',
        opening: `{name} the {class}, you wake on a sandy beach, lungs burning with saltwater. Splintered wood and torn sails litter the shore. Your ship... the storm... You're alive, but stranded. What's your first move?`,
        atmosphere: 'Shipwreck survival scenario inspired by Ghosts of Saltmarsh. Isolation, mystery, exploration.'
    },
    {
        id: 'jungle-tomb',
        name: 'Jungle Tomb',
        location: 'Ancient Chultan Ruins',
        timeOfDay: 'Day',
        opening: `{name} the {class}, thick jungle vines part to reveal weathered stone steps descending into darkness. Ancient glyphs cover the entrance. This tomb has been sealed for centuries... until now. Do you descend?`,
        atmosphere: 'Jungle exploration inspired by Tomb of Annihilation. Ancient mysteries, traps, undead.'
    },
    {
        id: 'city-siege',
        name: 'City Under Siege',
        location: 'Elturel Gates',
        timeOfDay: 'Dusk',
        opening: `Attention, {name} the {class}! Screams echo through the streets as demonic forces breach the city walls. Fire spreads. Citizens flee in terror. A captain shouts for able fighters. This is your moment. What do you do?`,
        atmosphere: 'Epic siege inspired by Descent into Avernus. Chaos, heroism, demonic threat.'
    },
    {
        id: 'frozen-outpost',
        name: 'Frozen Outpost',
        location: 'Bryn Shander',
        timeOfDay: 'Night',
        opening: `{name} the {class}, the blizzard howls outside. The inn's warmth fades as something scratches at the door—too deliberate to be the wind. The other patrons fall silent, hands moving to weapons. What do you do?`,
        atmosphere: 'Icewind Dale-inspired frozen horror. Survival, mystery, cold climate danger.'
    },
    {
        id: 'market-chase',
        name: 'Market Chase',
        location: 'Waterdeep Marketplace',
        timeOfDay: 'Day',
        opening: `{name} the {class}, a hooded figure collides with you in the bustling marketplace, dropping a leather-wrapped package before fleeing. City guards shout and give chase. The package pulses with strange energy. What do you do?`,
        atmosphere: 'Urban intrigue inspired by Waterdeep: Dragon Heist. Mystery, chase, treasure.'
    },
    {
        id: 'dragon-sighting',
        name: 'Dragon Attack',
        location: 'Mountain Village',
        timeOfDay: 'Day',
        opening: `Beware, {name} the {class}! A massive shadow crosses the sun. Leathery wings beat overhead as a dragon circles the village. Villagers scatter, screaming. The beast descends toward the town square. What do you do?`,
        atmosphere: 'Classic dragon encounter. Epic fantasy, immediate danger, heroic opportunity.'
    },
    {
        id: 'prison-break',
        name: 'The Pit',
        location: 'Underground Cells',
        timeOfDay: 'Night',
        opening: `{name} the {class}, you wake in darkness. Chains rattle. Stone walls press close. You don't remember how you got here, but you hear guards approaching. This might be your only chance to escape. What do you do?`,
        atmosphere: 'Dark opening, mystery. Prison break scenario, player must escape and uncover why they were captured.'
    },
    {
        id: 'caravan-defenders',
        name: 'Caravan Guard',
        location: 'Trade Road',
        timeOfDay: 'Day',
        opening: `{name} the {class}, you've been hired to guard a merchant caravan. Three days into the journey, the lead wagon's horse whinnies in alarm. Tracks cross the road—large, clawed, recent. The merchant looks to you nervously. What do you do?`,
        atmosphere: 'Escort mission, classic D&D. Travel, investigation, potential combat with monsters.'
    },
    {
        id: 'festival-chaos',
        name: 'Festival of Chaos',
        location: 'Neverwinter Square',
        timeOfDay: 'Night',
        opening: `{name} the {class}, the Harvest Festival is in full swing—music, dancing, fireworks! Then the explosions turn real. Screams replace laughter as masked figures emerge from the crowd, weapons drawn. What do you do?`,
        atmosphere: 'Celebration turned attack. Urban combat, investigation, conspiracy.'
    }
];

/**
 * Get a random starting scenario
 */
export function getRandomScenario(): Scenario {
    const index = Math.floor(Math.random() * STARTING_SCENARIOS.length);
    return STARTING_SCENARIOS[index];
}

/**
 * Get scenario by ID
 */
export function getScenarioById(id: string): Scenario | undefined {
    return STARTING_SCENARIOS.find(s => s.id === id);
}

/**
 * Replace placeholders in scenario text
 */
export function formatScenarioText(text: string, name: string, charClass: string): string {
    return text
        .replace(/{name}/g, name)
        .replace(/{class}/g, charClass);
}

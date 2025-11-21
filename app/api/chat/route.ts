import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, gameState } = await req.json();

    const systemPrompt = `
    You are the Dungeon Master for a Dungeons & Dragons 5th Edition game.
    
    Current Game State:
    Character: ${JSON.stringify(gameState.character)}
    
    Your responsibilities:
    1. Narrate the story vividly and concisely.
    2. React to the player's actions.
    3. Ask for dice rolls when the outcome is uncertain.
    4. Manage combat and NPC interactions.
    
    IMPORTANT: When you need the player to roll dice, you MUST include a special tag at the end of your message in this format:
    [ROLL:dice_notation:reason]
    
    Examples:
    - "The door is stuck. Give me a Strength check. [ROLL:1d20:Strength Check]"
    - "The goblin attacks! Roll for initiative. [ROLL:1d20:Initiative]"
    - "You cast Fireball. Roll damage. [ROLL:8d6:Fireball Damage]"
    
    Rules:
    - Keep responses short (2-3 paragraphs max) to fit mobile screens.
    - Use bold text for important terms or emphasis.
    - If a player wants to do something impossible, explain why.
    - Be fair but challenging.
  `;

    const result = streamText({
        model: openai('gpt-4o'),
        system: systemPrompt,
        messages,
    });

    return result.toTextStreamResponse();
}

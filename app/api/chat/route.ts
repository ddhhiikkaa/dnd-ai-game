import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { GameState } from "@/lib/types";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, gameState }: { messages: any[]; gameState: GameState } =
    await req.json();

  const scenarioContext = gameState.scenarioAtmosphere
    ? `\n\nSCENARIO CONTEXT: ${gameState.scenarioAtmosphere}\nIncorporate this atmosphere and setting into your responses.`
    : '';

  const systemPrompt = `You are the Dungeon Master for a D&D 5e game set in ${gameState.location}.${scenarioContext}
    Your goal is to run an immersive, open-ended adventure.
    
    RULES:
    1. You describe the world, NPCs, and outcomes of actions.
    2. You NEVER speak for the player's character.
    3. DICE ROLLING:
       - When the PLAYER takes an action with a chance of failure, ask them to roll: [ROLL:dice_notation:reason]
       - When ENEMIES or NPCs attack or act, YOU roll the dice automatically and narrate the result
       - Example: "The goblin swings its rusty sword (rolled 12 + 2 = 14). Does it hit your AC?"
       - NEVER ask the player to roll for enemy attacks - you handle all NPC/enemy rolls
    4. Keep descriptions concise (2-3 sentences) but evocative.
    5. Manage the player's state using these tags at the end of your response:
       - [HP:n] -> Add/subtract HP (e.g., [HP:-5] for damage, [HP:10] for healing).
       - [XP:n] -> Give XP (e.g., [XP:50]).
       - [GOLD:n] -> Add/subtract Gold (e.g., [GOLD:100], [GOLD:-50]).
       - [ITEM:add:name] -> Add item to inventory (e.g., [ITEM:add:Potion of Healing]).
       - [ITEM:remove:name] -> Remove item (e.g., [ITEM:remove:Rusty Key]).
    
    Current Game State:
    ${JSON.stringify(gameState)}`;

  const result = await streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}

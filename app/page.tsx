'use client';

import { useGameStore } from '@/lib/store';
import CharacterSheet from '@/components/CharacterSheet';
import ChatInterface from '@/components/ChatInterface';
import CharacterCreation from '@/components/CharacterCreation';
import RollPrompt from '@/components/RollPrompt';
import SaveIndicator from '@/components/SaveIndicator';
import CombatTracker from "@/components/CombatTracker";

export default function Home() {
  const isGameStarted = useGameStore((state) => state.isGameStarted);

  if (!isGameStarted) {
    return <CharacterCreation />;
  }

  return (
    <main className="h-[100dvh] flex flex-col bg-gray-900 text-gray-100 overflow-hidden">
      <header className="p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur z-10 shrink-0 flex justify-between items-center relative">
        <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          D&D AI Dungeon Master
        </h1>
        <SaveIndicator />
      </header>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        {/* Split Screen Container */}
        <div className="flex-shrink-0 flex border-b border-gray-800/50 bg-gray-900/90 backdrop-blur-md z-10 transition-all duration-500 ease-in-out"
          style={{ height: useGameStore.getState().gameState.combat.isActive ? '40%' : 'auto' }}>

          {/* Character Sheet - Full width or Half width */}
          <div className={`transition-all duration-500 ease-in-out overflow-y-auto custom-scrollbar
              ${useGameStore.getState().gameState.combat.isActive ? 'w-1/2 border-r border-gray-800' : 'w-full'}
          `}>
            <CharacterSheet />
          </div>

          {/* Combat Tracker - Half width when active */}
          {useGameStore.getState().gameState.combat.isActive && (
            <div className="w-1/2 h-full">
              <CombatTracker />
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="flex-1 min-h-0 relative">
          <ChatInterface />
        </div>
      </div>

      <RollPrompt />
    </main>
  );
}

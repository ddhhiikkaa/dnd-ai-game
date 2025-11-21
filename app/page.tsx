'use client';

import { useGameStore } from '@/lib/store';
import CharacterSheet from '@/components/CharacterSheet';
import ChatInterface from '@/components/ChatInterface';
import CharacterCreation from '@/components/CharacterCreation';
import RollPrompt from '@/components/RollPrompt';
import SaveIndicator from '@/components/SaveIndicator';

export default function Home() {
  const { isGameStarted } = useGameStore();

  if (!isGameStarted) {
    return <CharacterCreation />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <header className="flex-shrink-0 p-4 border-b border-gray-800 bg-[#1a1a2e] flex justify-between items-center">
        <h1 className="font-display text-xl text-gold">D&D AI Master</h1>
        <button className="text-xs text-gray-500 hover:text-white">Menu</button>
      </header>

      {/* Fixed Character Sheet */}
      <div className="flex-shrink-0 p-2 bg-[#050505]/90 backdrop-blur-md border-b border-gray-800/50">
        <CharacterSheet />
      </div>

      {/* Scrollable Chat Area */}
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>

      <SaveIndicator />
      <RollPrompt />
    </div>
  );
}

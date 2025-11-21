'use client';

import { useGameStore } from '@/lib/store';
import CharacterSheet from '@/components/CharacterSheet';
import ChatInterface from '@/components/ChatInterface';
import CharacterCreation from '@/components/CharacterCreation';
import RollPrompt from '@/components/RollPrompt';

export default function Home() {
  const { isGameStarted } = useGameStore();

  if (!isGameStarted) {
    return <CharacterCreation />;
  }

  return (
    <>
      <header className="p-4 border-b border-gray-800 bg-[#1a1a2e] flex justify-between items-center">
        <h1 className="font-display text-xl text-gold">D&D AI Master</h1>
        <button className="text-xs text-gray-500 hover:text-white">Menu</button>
      </header>

      <div className="sticky top-0 z-50 p-2 bg-[#050505]/90 backdrop-blur-md">
        <CharacterSheet />
      </div>

      <ChatInterface />
      <RollPrompt />
    </>
  );
}

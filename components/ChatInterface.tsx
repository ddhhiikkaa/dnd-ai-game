'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { ChatMessage } from '@/lib/types';

export default function ChatInterface() {
    const {
        messages,
        addMessage,
        updateMessage,
        setPendingRoll,
        pendingRoll,
        updateHP,
        addXP,
        updateGold,
        addItem,
        removeItem
    } = useGameStore();
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const isProcessingRef = useRef(false);

    useEffect(() => {
        // Immediate scroll
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Delayed scroll to account for spacer transition
        const timeoutId = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [messages, pendingRoll]);

    const generateAIResponse = async (currentMessages: ChatMessage[]) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
                    gameState: useGameStore.getState().gameState
                }),
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiContent = '';
            const aiMsgId = (Date.now() + 1).toString();

            addMessage({
                id: aiMsgId,
                role: 'assistant',
                content: '...',
            });

            const parsedTags = new Set<string>();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                aiContent += chunk;

                updateMessage(aiMsgId, aiContent);

                // Parse Roll Tags
                const rollMatch = aiContent.match(/\[ROLL:([^:]+):([^\]]+)\]/);
                if (rollMatch && !parsedTags.has(rollMatch[0])) {
                    const [, dice, reason] = rollMatch;
                    setPendingRoll({ dice, reason });
                    parsedTags.add(rollMatch[0]);
                }

                // Parse Stat Updates from accumulated content
                // HP
                const hpMatch = aiContent.match(/\[HP:(-?\d+)\]/);
                if (hpMatch && !parsedTags.has(hpMatch[0])) {
                    console.log('[DEBUG] HP tag found:', hpMatch[0], 'Amount:', hpMatch[1]);
                    updateHP(parseInt(hpMatch[1]));
                    parsedTags.add(hpMatch[0]);
                }

                // XP
                const xpMatch = aiContent.match(/\[XP:(\d+)\]/);
                if (xpMatch && !parsedTags.has(xpMatch[0])) {
                    addXP(parseInt(xpMatch[1]));
                    parsedTags.add(xpMatch[0]);
                }

                // Gold
                const goldMatch = aiContent.match(/\[GOLD:(-?\d+)\]/);
                if (goldMatch && !parsedTags.has(goldMatch[0])) {
                    updateGold(parseInt(goldMatch[1]));
                    parsedTags.add(goldMatch[0]);
                }

                // Item Add
                const itemAddMatch = aiContent.match(/\[ITEM:add:([^\]]+)\]/);
                if (itemAddMatch && !parsedTags.has(itemAddMatch[0])) {
                    addItem(itemAddMatch[1]);
                    parsedTags.add(itemAddMatch[0]);
                }

                // Item Remove
                const itemRemoveMatch = aiContent.match(/\[ITEM:remove:([^\]]+)\]/);
                if (itemRemoveMatch && !parsedTags.has(itemRemoveMatch[0])) {
                    removeItem(itemRemoveMatch[1]);
                    parsedTags.add(itemRemoveMatch[0]);
                }
            }
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            isProcessingRef.current = false;
        }
    };

    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.role === 'user' && lastMsg?.type === 'roll' && !isProcessingRef.current) {
            generateAIResponse(messages);
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessingRef.current) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        addMessage(userMsg);
        setInput('');

        await generateAIResponse([...messages, userMsg]);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                {messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    const isRoll = msg.type === 'roll';

                    // Clean content of all tags
                    const cleanContent = msg.content
                        .replace(/\[ROLL:.*?\]/g, '')
                        .replace(/\[HP:.*?\]/g, '')
                        .replace(/\[XP:.*?\]/g, '')
                        .replace(/\[GOLD:.*?\]/g, '')
                        .replace(/\[ITEM:.*?\]/g, '');

                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                            {!isUser && (
                                <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center shrink-0">
                                    <span className="text-xs">DM</span>
                                </div>
                            )}

                            <div
                                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${isUser
                                    ? isRoll
                                        ? 'bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 text-yellow-200'
                                        : 'bg-gradient-to-br from-purple-600 to-blue-700 text-white rounded-tr-none'
                                    : 'bg-[#1a1a2e]/80 border border-white/10 text-gray-200 rounded-tl-none'
                                    }`}
                            >
                                {isRoll && <span className="mr-2 text-lg">🎲</span>}
                                {cleanContent}
                            </div>

                            {isUser && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg">
                                    <span className="text-xs font-bold text-white">ME</span>
                                </div>
                            )}
                        </div>
                    );
                })}
                {/* Spacer for RollPrompt */}
                <div className={`transition-all duration-300 ${pendingRoll ? 'h-72' : 'h-4'}`} />
                <div ref={bottomRef} />
            </div>

            <div className="flex-shrink-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-white/5">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What do you do?"
                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 backdrop-blur-md shadow-xl transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isProcessingRef.current}
                        className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white flex items-center justify-center transition-colors shadow-lg"
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { askAITutor } from '@/services/aiApi';
import { ChatMessage as ChatMessageType } from '@/types/learning';
import { ChatMessage } from './ChatMessage';
import { Bot, Send, Sparkles, HelpCircle, Loader2 } from 'lucide-react';

export const AITutorPanel: React.FC = () => {
  const { circuit } = useQuantum();
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your **Quantum AI Tutor** on QuantamStudio_Bigslayers. I analyze your live quantum circuit state in real-time, explain gate interference, verify Bell inequalities, and guide you through complex quantum algorithms.\n\nHow can I assist your quantum journey today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Explain this circuit',
    'Why is H used here?',
    'Explain the Bloch Sphere',
    'What happens after measurement?',
    'Give me a challenge',
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessageType = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await askAITutor(query, circuit, messages);
      const botMsg: ChatMessageType = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FFFFE3]/40 select-none overflow-hidden text-[#723480]">
      {/* Header */}
      <div className="p-3 border-b border-[#DBD4FF] bg-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#531D5E] flex items-center justify-center text-[#FFFFE3] shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#531D5E]">Quantum AI Tutor</h3>
            <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Circuit Sync
            </span>
          </div>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2 border-b border-[#DBD4FF] bg-white overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none shadow-xs">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 rounded-xl bg-[#FFFFE3] hover:bg-[#531D5E] text-[#723480] hover:text-[#FFFFE3] border border-[#DBD4FF] hover:border-[#531D5E] whitespace-nowrap transition-all flex items-center gap-1 shrink-0 font-bold shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#808034]" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#FFFFE3]/30">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#DBD4FF] text-xs text-[#531D5E] font-mono shadow-xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#531D5E]" />
            <span>AI Tutor is formulating quantum analysis...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Box */}
      <div className="p-2.5 sm:p-3 border-t border-[#DBD4FF] bg-white shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about this circuit or quantum theory..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl px-3 py-2 text-[#531D5E] placeholder-[#723480]/60 focus:outline-none focus:border-[#531D5E] transition-all shadow-inner font-medium min-w-0"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 sm:p-2.5 rounded-xl bg-[#531D5E] hover:bg-[#723480] text-[#FFFFE3] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};


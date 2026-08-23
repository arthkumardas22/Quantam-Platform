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
    <div className="flex-1 flex flex-col h-full bg-slate-50 select-none overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">Quantum AI Tutor</h3>
            <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Circuit State
            </span>
          </div>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2.5 border-b border-slate-200 bg-white overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none shadow-xs">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border border-slate-200 hover:border-cyan-300 whitespace-nowrap transition-all flex items-center gap-1 shrink-0 font-medium shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-cyan-600" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 font-mono shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
            <span>AI Tutor is formulating quantum analysis...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about this circuit or quantum theory..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

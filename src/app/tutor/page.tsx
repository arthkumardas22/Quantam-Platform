'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useQuantum } from '@/context/QuantumContext';
import { askAITutor } from '@/services/aiApi';
import { ChatMessage as ChatMessageType } from '@/types/learning';
import { ChatMessage } from '@/components/ai/ChatMessage';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Loader2,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TutorFullPage() {
  const { circuit } = useQuantum();
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Greetings! I am your **Dedicated Quantum AI Research Assistant** on QuantamStudio_Bigslayers.\n\nI can assist you with:\n- Deriving quantum operator matrices ($H, X, Y, Z, CNOT, SWAP, T$)\n- Analyzing algorithmic complexity for Grover, Shor, and QFT\n- Explaining physical phenomena like phase kickback, quantum teleportation, and decoherence\n- Providing code snippets for Qiskit, Google Cirq, and PennyLane\n\nWhat quantum concept would you like to explore today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const topicPrompts = [
    'How does Grover’s diffusion operator work geometrically?',
    'What is Phase Kickback in the Deutsch-Jozsa algorithm?',
    'Explain the No-Cloning Theorem and why we cannot copy qubits',
    'How does Quantum Teleportation transfer state without faster-than-light signaling?',
    'What is the difference between Qiskit Aer and real superconducting hardware?',
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
    <AppShell>
      <div className="flex flex-col h-full bg-slate-50 max-w-5xl mx-auto p-4 md:p-6 overflow-hidden">
        {/* Tutor Top Banner */}
        <div className="p-4 bg-white border border-slate-200 rounded-3xl flex items-center justify-between mb-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Quantum AI Research Assistant</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Online
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Context-aware theoretical quantum reasoning & circuit assistance
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setMessages([
                {
                  id: 'welcome',
                  role: 'assistant',
                  content: 'Chat history reset. What would you like to explore next?',
                  timestamp: new Date().toISOString(),
                },
              ])
            }
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Clear History
          </Button>
        </div>

        {/* Chat Stream Window */}
        <div className="flex-1 overflow-y-auto p-4 bg-white border border-slate-200 rounded-3xl space-y-4 mb-4 shadow-sm">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
              <span>Synthesizing quantum formalism and theoretical explanation...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Topic Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 shrink-0 scrollbar-none">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1 mr-1" />
          {topicPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="text-[11px] px-3.5 py-1.5 rounded-2xl bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border border-slate-200 hover:border-cyan-300 whitespace-nowrap transition-all shrink-0 font-medium shadow-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-3xl shrink-0 shadow-sm"
        >
          <input
            type="text"
            placeholder="Ask anything about quantum mechanics, gate matrices, or algorithms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-600 shadow-inner transition-all"
          />
          <Button
            type="submit"
            variant="quantum"
            size="md"
            disabled={!input.trim() || isLoading}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Ask AI Tutor
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

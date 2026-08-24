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
  Cpu,
  Key,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { quantumAudio } from '@/utils/quantumAudio';

const AVAILABLE_MODELS = [
  { id: 'gemini-1.5-flash', name: 'Google Gemini 2.0 / 1.5 Flash', provider: 'Google DeepMind', badge: 'Fastest & Best' },
  { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro', provider: 'Google DeepMind', badge: 'Complex Math' },
  { id: 'gpt-4o', name: 'OpenAI GPT-4o', provider: 'OpenAI', badge: 'Multimodal' },
  { id: 'claude-3-7-sonnet', name: 'Anthropic Claude 3.7 Sonnet', provider: 'Anthropic', badge: 'Reasoning' },
  { id: 'native-quantum-reasoner', name: 'QuantamStudio Native Reasoner', provider: 'Built-In Engine', badge: 'Offline / Zero-Key' },
];

export default function TutorFullPage() {
  const { circuit } = useQuantum();
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Greetings! I am your **Dedicated Quantum AI Research Assistant** on QuantamStudio_Bigslayers.\n\nI am connected to advanced quantum reasoning models capable of:\n- Deriving unitary transformation matrices ($H, X, Y, Z, CNOT, SWAP, T, QFT$)\n- Explaining physical phenomena: **wavefunction collapse**, **phase kickback**, **quantum entanglement**, and **decoherence**\n- Generating executable Python code for **Qiskit 1.0**, **Google Cirq**, and **PennyLane**\n- Step-by-step circuit debugging and quantum state analysis\n\nWhat quantum concept or circuit problem would you like to explore today?',
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

    quantumAudio.playGateChime(523.25);

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
      const response = await askAITutor(query, circuit, messages, selectedModel, apiKey);
      const botMsg: ChatMessageType = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      quantumAudio.playCelebration();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-[#FFFFE3] max-w-5xl mx-auto p-3 sm:p-4 md:p-6 overflow-hidden text-[#723480]">
        {/* Tutor Top Banner with Model Switcher */}
        <div className="p-3 sm:p-4 bg-white border-2 border-[#DBD4FF] rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#531D5E] flex items-center justify-center text-[#FFFFE3] shadow-md shadow-[#531D5E]/30 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-[#531D5E] flex items-center gap-2">
                <span>AI Research Assistant</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#DBD4FF] text-[#531D5E] border border-[#531D5E]/30 font-bold hidden xs:inline">
                  Live
                </span>
              </h1>
              <p className="text-[11px] text-[#808034] font-bold">
                Theoretical reasoning & circuit debugging
              </p>
            </div>
          </div>

          {/* Model Selector & Key Input */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Model Dropdown */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl px-2.5 py-1.5 text-[#531D5E] font-bold focus:outline-none focus:border-[#531D5E] shadow-inner cursor-pointer max-w-[180px] sm:max-w-xs truncate"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* Custom API Key Button */}
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                apiKey
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : 'bg-white border-[#DBD4FF] text-[#723480] hover:border-[#531D5E]'
              }`}
              title="Add optional Custom API Key (Gemini / OpenAI)"
            >
              <Key className="w-4 h-4" />
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome',
                    role: 'assistant',
                    content: 'Chat history reset. What would you like to explore next?',
                    timestamp: new Date().toISOString(),
                  },
                ]);
                quantumAudio.playGateChime(440);
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Optional Custom API Key input drawer */}
        {showKeyInput && (
          <div className="p-3 bg-white border-2 border-[#DBD4FF] rounded-2xl mb-3 sm:mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-xs">
            <div className="flex items-center gap-2 flex-1">
              <Key className="w-4 h-4 text-[#808034] shrink-0" />
              <input
                type="password"
                placeholder="Paste Gemini or OpenAI API key (optional)..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl px-3 py-1.5 text-[#531D5E] focus:outline-none focus:border-[#531D5E] font-mono"
              />
            </div>
            <span className="text-[10px] text-[#808034] font-bold text-right">Key stays client-side</span>
          </div>
        )}

        {/* Chat Stream Window */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-white border-2 border-[#DBD4FF] rounded-3xl space-y-4 mb-3 sm:mb-4 shadow-inner">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#FFFFE3] border border-[#DBD4FF] text-xs text-[#531D5E] font-mono shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#531D5E]" />
              <span>Synthesizing quantum physics formalism...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Topic Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 shrink-0 scrollbar-none">
          <Lightbulb className="w-3.5 h-3.5 text-[#808034] shrink-0 ml-1 mr-1" />
          {topicPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="text-[11px] px-3 py-1.5 rounded-2xl bg-white hover:bg-[#531D5E] text-[#723480] hover:text-[#FFFFE3] border border-[#DBD4FF] hover:border-[#531D5E] whitespace-nowrap transition-all shrink-0 font-bold shadow-xs cursor-pointer"
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
          className="flex items-center gap-2 bg-white p-1.5 sm:p-2 border-2 border-[#DBD4FF] rounded-3xl shrink-0 shadow-xs"
        >
          <input
            type="text"
            placeholder="Ask anything about quantum mechanics, gates, matrices..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-[#531D5E] placeholder-[#723480]/60 focus:outline-none focus:border-[#531D5E] shadow-inner transition-all font-medium min-w-0"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!input.trim() || isLoading}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline ml-1.5">Ask AI Tutor</span>
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

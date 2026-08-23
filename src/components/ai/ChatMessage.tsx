'use client';

import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/learning';
import { Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChatMessage: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  // Basic markdown parser for headings, bold, inline code, and lists
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-cyan-800 text-xs mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={idx} className="font-bold text-slate-900 text-xs my-0.5">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="text-slate-700 text-xs ml-3 list-disc my-0.5 leading-relaxed">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.startsWith('$$') || line.startsWith('`')) {
        return (
          <div
            key={idx}
            className="my-1.5 p-2 rounded-xl bg-slate-50 font-mono text-[11px] text-cyan-900 border border-slate-200 break-all overflow-x-auto font-semibold shadow-inner"
          >
            {line.replace(/\$\$/g, '').replace(/`/g, '')}
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1" />;
      }
      return (
        <p key={idx} className="text-slate-700 text-xs leading-relaxed my-0.5">
          {line}
        </p>
      );
    });
  };

  return (
    <div
      className={cn(
        'flex gap-2.5 p-3.5 rounded-2xl transition-all shadow-sm',
        isAssistant
          ? 'bg-white border border-slate-200'
          : 'bg-cyan-50 border border-cyan-200 ml-4'
      )}
    >
      <div
        className={cn(
          'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5',
          isAssistant
            ? 'bg-gradient-to-tr from-cyan-600 to-purple-600'
            : 'bg-slate-800 text-cyan-400'
        )}
      >
        {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-slate-800">
            {isAssistant ? 'Quantum AI Tutor' : 'You'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="text-xs space-y-0.5">{renderFormattedText(message.content)}</div>
      </div>
    </div>
  );
};

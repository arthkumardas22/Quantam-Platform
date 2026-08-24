'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { GatePalette } from '@/components/quantum/GatePalette';
import { CircuitBuilder } from '@/components/quantum/CircuitBuilder';
import { CircuitToolbar } from '@/components/quantum/CircuitToolbar';
import { GeneratedCodePanel } from '@/components/quantum/GeneratedCodePanel';
import { ProbabilityChart } from '@/components/quantum/ProbabilityChart';
import { StateVectorView } from '@/components/quantum/StateVectorView';
import { BlochSphere3D } from '@/components/quantum/BlochSphere3D';
import { AITutorPanel } from '@/components/ai/AITutorPanel';
import { CircuitExplainerModal } from '@/components/ai/CircuitExplainerModal';
import { useQuantum } from '@/context/QuantumContext';
import { BarChart3, Globe, Bot, Code, Cpu, Layers, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WorkspacePage() {
  const { activeRightTab, setActiveRightTab } = useQuantum();
  const [mobileTab, setMobileTab] = useState<'circuit' | 'palette' | 'code' | 'results' | 'bloch' | 'tutor'>('circuit');
  const [resultsSubTab, setResultsSubTab] = useState<'chart' | 'statevector'>('chart');

  return (
    <AppShell>
      <div className="flex flex-col h-full w-full overflow-hidden bg-[#FFFFE3]/30 text-[#723480]">
        {/* Top Circuit Toolbar */}
        <CircuitToolbar />

        {/* Mobile Viewport Tabs Switcher (Hidden on lg screens) */}
        <div className="lg:hidden flex items-center justify-around bg-white border-b border-[#DBD4FF] p-1.5 text-xs shadow-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setMobileTab('circuit');
            }}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
              mobileTab === 'circuit'
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:bg-[#DBD4FF]/60'
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Circuit</span>
          </button>

          <button
            onClick={() => {
              setMobileTab('palette');
            }}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
              mobileTab === 'palette'
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:bg-[#DBD4FF]/60'
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Gates</span>
          </button>

          <button
            onClick={() => {
              setMobileTab('code');
            }}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
              mobileTab === 'code'
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:bg-[#DBD4FF]/60'
            )}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>

          <button
            onClick={() => {
              setMobileTab('results');
              setActiveRightTab('results');
            }}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
              mobileTab === 'results'
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:bg-[#DBD4FF]/60'
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Results</span>
          </button>

          <button
            onClick={() => {
              setMobileTab('bloch');
              setActiveRightTab('bloch');
            }}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
              mobileTab === 'bloch'
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:bg-[#DBD4FF]/60'
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Bloch</span>
          </button>

          <button
            onClick={() => {
              setMobileTab('tutor');
              setActiveRightTab('tutor');
            }}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
              mobileTab === 'tutor'
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:bg-[#DBD4FF]/60'
            )}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Tutor</span>
          </button>
        </div>

        {/* Main IDE Multi-Panel Layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left: Gate Palette */}
          <div className={cn('h-full flex', mobileTab !== 'palette' && 'hidden lg:flex')}>
            <GatePalette />
          </div>

          {/* Center Column: Circuit Builder (top) & Generated Code (bottom) */}
          <div
            className={cn(
              'flex-1 flex flex-col min-w-0 border-r border-[#DBD4FF]',
              mobileTab !== 'circuit' && mobileTab !== 'code' && 'hidden lg:flex'
            )}
          >
            {/* Center Top: Circuit Grid Wire Area */}
            <div
              className={cn(
                'flex-1 flex flex-col min-h-0 overflow-hidden',
                mobileTab === 'code' && 'hidden lg:flex'
              )}
            >
              <CircuitBuilder />
            </div>

            {/* Center Bottom: Generated Code Panel */}
            <div
              className={cn(
                'h-60 shrink-0 flex flex-col min-h-0 overflow-hidden border-t border-[#DBD4FF]',
                mobileTab === 'circuit' && 'hidden lg:flex'
              )}
            >
              <GeneratedCodePanel />
            </div>
          </div>

          {/* Right Column: Visualizations & AI Tutor */}
          <div
            className={cn(
              'w-80 xl:w-96 shrink-0 bg-white border-l border-[#DBD4FF] flex flex-col h-full shadow-xs',
              mobileTab === 'circuit' || mobileTab === 'palette' || mobileTab === 'code'
                ? 'hidden lg:flex'
                : 'flex-1 lg:w-80 xl:w-96'
            )}
          >
            {/* Right Pane Tab Buttons (Visible on desktop or when active on mobile) */}
            <div className="h-10 bg-[#FFFFE3]/60 border-b border-[#DBD4FF] px-2 flex items-center justify-around select-none shrink-0">
              <button
                onClick={() => {
                  setActiveRightTab('results');
                  setMobileTab('results');
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer',
                  activeRightTab === 'results'
                    ? 'bg-white text-[#531D5E] border border-[#DBD4FF] shadow-xs'
                    : 'text-[#723480] hover:text-[#531D5E]'
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Results</span>
              </button>

              <button
                onClick={() => {
                  setActiveRightTab('bloch');
                  setMobileTab('bloch');
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer',
                  activeRightTab === 'bloch'
                    ? 'bg-white text-[#531D5E] border border-[#DBD4FF] shadow-xs'
                    : 'text-[#723480] hover:text-[#531D5E]'
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3D Bloch</span>
              </button>

              <button
                onClick={() => {
                  setActiveRightTab('tutor');
                  setMobileTab('tutor');
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer',
                  activeRightTab === 'tutor'
                    ? 'bg-white text-[#531D5E] border border-[#DBD4FF] shadow-xs'
                    : 'text-[#723480] hover:text-[#531D5E]'
                )}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Tutor</span>
              </button>
            </div>

            {/* Right Pane Tab Body */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {activeRightTab === 'results' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  {/* Sub-tab: Bar Chart vs Dirac State Vector */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFFE3]/50 border-b border-[#DBD4FF] text-[11px]">
                    <button
                      onClick={() => setResultsSubTab('chart')}
                      className={cn(
                        'px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer',
                        resultsSubTab === 'chart'
                          ? 'bg-[#DBD4FF] text-[#531D5E] border border-[#531D5E]/40 shadow-xs'
                          : 'text-[#723480] hover:text-[#531D5E]'
                      )}
                    >
                      Probability Histogram
                    </button>
                    <button
                      onClick={() => setResultsSubTab('statevector')}
                      className={cn(
                        'px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer',
                        resultsSubTab === 'statevector'
                          ? 'bg-[#DBD4FF] text-[#531D5E] border border-[#531D5E]/40 shadow-xs'
                          : 'text-[#723480] hover:text-[#531D5E]'
                      )}
                    >
                      State Vector |ψ⟩
                    </button>
                  </div>

                  <div className="flex-1 min-h-0 overflow-hidden">
                    {resultsSubTab === 'chart' ? <ProbabilityChart /> : <StateVectorView />}
                  </div>
                </div>
              )}

              {activeRightTab === 'bloch' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden min-h-0">
                  <BlochSphere3D />
                </div>
              )}

              {activeRightTab === 'tutor' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden min-h-0">
                  <AITutorPanel />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "Explain Circuit with AI" Modal Drawer */}
      <CircuitExplainerModal />
    </AppShell>
  );
}



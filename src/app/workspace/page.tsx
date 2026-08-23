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
import { BarChart3, Globe, Bot, Code, Cpu, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WorkspacePage() {
  const { activeRightTab, setActiveRightTab } = useQuantum();
  const [mobileTab, setMobileTab] = useState<'circuit' | 'code' | 'results' | 'bloch' | 'tutor'>('circuit');
  const [resultsSubTab, setResultsSubTab] = useState<'chart' | 'statevector'>('chart');

  return (
    <AppShell>
      <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50">
        {/* Top Circuit Toolbar */}
        <CircuitToolbar />

        {/* Mobile Viewport Tabs Switcher (Hidden on lg screens) */}
        <div className="lg:hidden flex items-center justify-around bg-white border-b border-slate-200 p-1.5 text-xs shadow-sm">
          <button
            onClick={() => setMobileTab('circuit')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-medium',
              mobileTab === 'circuit' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-600'
            )}
          >
            Circuit
          </button>
          <button
            onClick={() => setMobileTab('code')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-medium',
              mobileTab === 'code' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-600'
            )}
          >
            Code
          </button>
          <button
            onClick={() => setMobileTab('results')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-medium',
              mobileTab === 'results' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-600'
            )}
          >
            Probabilities
          </button>
          <button
            onClick={() => setMobileTab('bloch')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-medium',
              mobileTab === 'bloch' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-600'
            )}
          >
            3D Bloch
          </button>
          <button
            onClick={() => setMobileTab('tutor')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-medium',
              mobileTab === 'tutor' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-600'
            )}
          >
            AI Tutor
          </button>
        </div>

        {/* Main IDE Multi-Panel Layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left: Gate Palette (hidden on mobile if not in circuit tab) */}
          <div className={cn('h-full flex', mobileTab !== 'circuit' && 'hidden lg:flex')}>
            <GatePalette />
          </div>

          {/* Center Column: Circuit Builder (top) & Generated Code (bottom) */}
          <div
            className={cn(
              'flex-1 flex flex-col min-w-0 border-r border-slate-200',
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
                'h-60 shrink-0 flex flex-col min-h-0 overflow-hidden',
                mobileTab === 'circuit' && 'hidden lg:flex'
              )}
            >
              <GeneratedCodePanel />
            </div>
          </div>

          {/* Right Column: Visualizations & AI Tutor */}
          <div
            className={cn(
              'w-80 xl:w-96 shrink-0 bg-white border-l border-slate-200 flex flex-col h-full shadow-sm',
              mobileTab === 'circuit' || mobileTab === 'code' ? 'hidden lg:flex' : 'flex-1 lg:w-80 xl:w-96'
            )}
          >
            {/* Right Pane Tab Buttons */}
            <div className="h-10 bg-slate-50 border-b border-slate-200 px-2 flex items-center justify-around select-none shrink-0">
              <button
                onClick={() => setActiveRightTab('results')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs',
                  activeRightTab === 'results'
                    ? 'bg-white text-cyan-800 border border-slate-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Results</span>
              </button>

              <button
                onClick={() => setActiveRightTab('bloch')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs',
                  activeRightTab === 'bloch'
                    ? 'bg-white text-purple-800 border border-slate-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3D Bloch</span>
              </button>

              <button
                onClick={() => setActiveRightTab('tutor')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs',
                  activeRightTab === 'tutor'
                    ? 'bg-white text-cyan-800 border border-slate-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
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
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px]">
                    <button
                      onClick={() => setResultsSubTab('chart')}
                      className={cn(
                        'px-2.5 py-0.5 rounded-lg font-bold transition-all',
                        resultsSubTab === 'chart'
                          ? 'bg-cyan-100 text-cyan-800 border border-cyan-300 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      )}
                    >
                      Probability Histogram
                    </button>
                    <button
                      onClick={() => setResultsSubTab('statevector')}
                      className={cn(
                        'px-2.5 py-0.5 rounded-lg font-bold transition-all',
                        resultsSubTab === 'statevector'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
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

              {activeRightTab === 'bloch' && <BlochSphere3D />}

              {activeRightTab === 'tutor' && <AITutorPanel />}
            </div>
          </div>
        </div>
      </div>

      {/* "Explain Circuit with AI" Modal Drawer */}
      <CircuitExplainerModal />
    </AppShell>
  );
}

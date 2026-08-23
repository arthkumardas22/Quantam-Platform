'use client';

import React, { useEffect, useState } from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { explainCircuit, CircuitExplanationReport } from '@/services/aiApi';
import {
  Sparkles,
  X,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Loader2,
  Atom,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const CircuitExplainerModal: React.FC = () => {
  const { isExplainerOpen, setIsExplainerOpen, circuit } = useQuantum();
  const [report, setReport] = useState<CircuitExplanationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isExplainerOpen) {
      setIsLoading(true);
      explainCircuit(circuit).then((rep) => {
        setReport(rep);
        setIsLoading(false);
      });
    }
  }, [isExplainerOpen, circuit]);

  if (!isExplainerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>AI Quantum Circuit Explanation</span>
                {report && (
                  <Badge variant={report.isEntangled ? 'purple' : 'cyan'}>
                    {report.isEntangled ? 'Entangled State' : 'Superposition State'}
                  </Badge>
                )}
              </h2>
              <p className="text-[11px] text-slate-500">
                Automated theoretical analysis & state decomposition
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExplainerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
              <p className="text-xs font-mono">Synthesizing quantum state unitary decomposition...</p>
            </div>
          ) : report ? (
            <>
              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 shadow-sm">
                <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Atom className="w-4 h-4 text-cyan-600" />
                  {report.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">{report.summary}</p>
              </div>

              {/* State Vector & Expected Outcomes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-mono text-slate-500 font-bold mb-1">
                    Theoretical State Vector
                  </div>
                  <div className="font-mono text-xs text-cyan-800 font-bold break-all bg-white p-2.5 rounded-xl border border-slate-200 shadow-inner">
                    {report.theoreticalState}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-mono text-slate-500 font-bold mb-1">
                    Measurement Probabilities
                  </div>
                  <div className="font-mono text-xs text-emerald-800 font-bold bg-white p-2.5 rounded-xl border border-slate-200 shadow-inner">
                    {report.measurementOutcome}
                  </div>
                </div>
              </div>

              {/* Chronological Step-by-Step Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Chronological Step-by-Step Evolution
                </h4>
                <div className="space-y-2">
                  {report.stepByStep.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {step.column}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 font-mono">
                          {step.gatesDescription}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {step.physicalEffect}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Beginner Mistake / Trap */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-900">Common Beginner Trap</div>
                  <div className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    {report.beginnerTrap}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsExplainerOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

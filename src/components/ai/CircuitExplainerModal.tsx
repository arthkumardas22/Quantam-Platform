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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#531D5E]/60 backdrop-blur-sm animate-in fade-in duration-200 text-[#723480]">
      <div className="w-full max-w-2xl bg-white border-2 border-[#DBD4FF] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-[#FFFFE3] border-b border-[#DBD4FF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#531D5E] flex items-center justify-center text-[#FFFFE3] shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-[#531D5E] flex items-center gap-2">
                <span>Circuit Analysis</span>
                {report && (
                  <Badge variant={report.isEntangled ? 'plum' : 'cyan'}>
                    {report.isEntangled ? 'Entangled' : 'Superposition'}
                  </Badge>
                )}
              </h2>
              <p className="text-[11px] text-[#808034] font-bold">
                Automated theoretical state decomposition
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExplainerOpen(false)}
            className="p-1.5 rounded-lg text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#723480] space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#531D5E]" />
              <p className="text-xs font-mono font-bold">Synthesizing quantum state unitary decomposition...</p>
            </div>
          ) : report ? (
            <>
              {/* Executive Summary */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFFE3] border-2 border-[#DBD4FF] shadow-xs">
                <h3 className="text-xs font-black text-[#531D5E] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Atom className="w-4 h-4 text-[#723480]" />
                  {report.title}
                </h3>
                <p className="text-xs text-[#723480] leading-relaxed font-medium">{report.summary}</p>
              </div>

              {/* State Vector & Expected Outcomes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#FFFFE3]/50 border border-[#DBD4FF]">
                  <div className="text-[10px] uppercase font-mono text-[#808034] font-bold mb-1">
                    Theoretical State Vector
                  </div>
                  <div className="font-mono text-xs text-[#531D5E] font-black break-all bg-white p-2.5 rounded-xl border border-[#DBD4FF] shadow-inner">
                    {report.theoreticalState}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FFFFE3]/50 border border-[#DBD4FF]">
                  <div className="text-[10px] uppercase font-mono text-[#808034] font-bold mb-1">
                    Measurement Probabilities
                  </div>
                  <div className="font-mono text-xs text-[#531D5E] font-black bg-white p-2.5 rounded-xl border border-[#DBD4FF] shadow-inner">
                    {report.measurementOutcome}
                  </div>
                </div>
              </div>

              {/* Chronological Step-by-Step Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-[#808034] uppercase tracking-wider mb-2">
                  Chronological Step-by-Step Evolution
                </h4>
                <div className="space-y-2">
                  {report.stepByStep.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-[#DBD4FF] flex items-start gap-3 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#DBD4FF] text-[#531D5E] border border-[#531D5E]/30 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {step.column}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#531D5E] font-mono">
                          {step.gatesDescription}
                        </div>
                        <div className="text-xs text-[#723480] mt-0.5 leading-relaxed font-normal">
                          {step.physicalEffect}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Beginner Mistake / Trap */}
              <div className="p-3.5 rounded-2xl bg-[#DBD4FF]/40 border-2 border-[#DBD4FF] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#808034] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#531D5E]">Common Beginner Trap</div>
                  <div className="text-xs text-[#723480] mt-0.5 leading-relaxed font-normal">
                    {report.beginnerTrap}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-3.5 bg-[#FFFFE3] border-t border-[#DBD4FF] flex justify-end gap-2">
          <Button variant="primary" size="sm" onClick={() => setIsExplainerOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

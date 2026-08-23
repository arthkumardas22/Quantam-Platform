'use client';

import React, { useState } from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { useUser } from '@/context/UserContext';
import {
  generateQiskitCode,
  generateCirqCode,
  generateOpenQASM,
  generatePennyLaneCode,
} from '@/services/codeGenerator';
import { Copy, Check, Download, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GeneratedCodePanel: React.FC = () => {
  const { circuit, activeCodeLanguage, setActiveCodeLanguage } = useQuantum();
  const { showToast } = useUser();
  const [isCopied, setIsCopied] = useState(false);

  let codeContent = '';
  switch (activeCodeLanguage) {
    case 'qiskit':
      codeContent = generateQiskitCode(circuit);
      break;
    case 'cirq':
      codeContent = generateCirqCode(circuit);
      break;
    case 'qasm':
      codeContent = generateOpenQASM(circuit);
      break;
    case 'pennylane':
      codeContent = generatePennyLaneCode(circuit);
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setIsCopied(true);
    showToast({
      type: 'success',
      title: 'Code Copied',
      message: `Copied ${activeCodeLanguage.toUpperCase()} code to clipboard.`,
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeCodeLanguage === 'qasm' ? 'qasm' : 'py';
    const blob = new Blob([codeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_circuit_${activeCodeLanguage}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({
      type: 'info',
      title: 'File Downloaded',
      message: `Saved as quantum_circuit_${activeCodeLanguage}.${ext}`,
    });
  };

  const languages = [
    { id: 'qiskit', label: 'Qiskit (Python)' },
    { id: 'cirq', label: 'Google Cirq' },
    { id: 'qasm', label: 'OpenQASM 2.0' },
    { id: 'pennylane', label: 'PennyLane' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0f172a] border-t border-slate-200 font-mono text-xs overflow-hidden">
      {/* Code Header Bar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Code2 className="w-3.5 h-3.5 text-cyan-400 mr-1 shrink-0" />
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveCodeLanguage(lang.id as any)}
              className={cn(
                'px-2.5 py-1 text-[11px] rounded-lg transition-all font-medium whitespace-nowrap',
                activeCodeLanguage === lang.id
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
          >
            <Download className="w-3 h-3 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 p-4 overflow-auto bg-[#0b1120] text-slate-300 selection:bg-cyan-900 selection:text-white leading-relaxed">
        <pre className="text-xs font-mono font-normal">
          <code>
            {codeContent.split('\n').map((line, idx) => {
              let lineStyle = 'text-slate-300';
              if (line.startsWith('#') || line.startsWith('"""')) lineStyle = 'text-slate-500 italic';
              else if (line.startsWith('from ') || line.startsWith('import ')) lineStyle = 'text-purple-400 font-semibold';
              else if (line.includes('qc.') || line.includes('circuit.')) lineStyle = 'text-cyan-300';
              else if (line.includes('print')) lineStyle = 'text-amber-300';

              return (
                <div key={idx} className="table-row">
                  <span className="table-cell pr-4 text-right text-slate-600 select-none text-[11px]">
                    {idx + 1}
                  </span>
                  <span className={cn('table-cell', lineStyle)}>{line}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useQuantum } from '@/context/QuantumContext';
import { useUser } from '@/context/UserContext';
import { SimulatorBackend } from '@/types/quantum';
import {
  Settings,
  Cpu,
  Zap,
  Key,
  Trash2,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { backend, setBackend, shots, setShots } = useQuantum();
  const { showToast } = useUser();

  const [ibmToken, setIbmToken] = useState('ibm_q_token_********************');
  const [aiApiKey, setAiApiKey] = useState('gemini_api_key_********************');
  const [enableNoiseModel, setEnableNoiseModel] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Quantum simulator configuration and API preferences updated.',
    });
  };

  const handleResetProgress = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quantum_user_progress');
      window.location.reload();
    }
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 text-[#723480]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#531D5E] flex items-center gap-2.5">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#723480]" />
            <span>Platform & Simulator Settings</span>
          </h1>
          <p className="text-xs text-[#808034] font-bold mt-1">
            Configure default quantum execution backends, API credentials, and simulator precision
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5 sm:space-y-6">
          {/* Quantum Simulator Configuration */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] shadow-xs space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#DBD4FF]">
              <Cpu className="w-4 h-4 text-[#723480]" />
              <h2 className="text-sm font-black text-[#531D5E]">Execution Backend & Engine</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-[#723480] mb-1.5">
                  Default Quantum Simulator
                </label>
                <select
                  value={backend}
                  onChange={(e) => setBackend(e.target.value as SimulatorBackend)}
                  className="w-full text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl px-3.5 py-2.5 text-[#531D5E] font-bold focus:outline-none focus:border-[#531D5E] shadow-inner cursor-pointer"
                >
                  <option value="qiskit_aer">Qiskit Aer Simulator (Local GPU/CPU)</option>
                  <option value="cirq_simulator">Google Cirq DensityMatrix Simulator</option>
                  <option value="pennylane_lightning">PennyLane Lightning.qubit</option>
                  <option value="ibm_quantum_cloud">IBM Quantum Falcon Cloud (Simulated)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#723480] mb-1.5">
                  Default Shots Count
                </label>
                <select
                  value={shots}
                  onChange={(e) => setShots(Number(e.target.value))}
                  className="w-full text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl px-3.5 py-2.5 text-[#531D5E] font-bold focus:outline-none focus:border-[#531D5E] font-mono shadow-inner cursor-pointer"
                >
                  <option value={100}>100 Shots (Fast testing)</option>
                  <option value={1024}>1024 Shots (Standard precision)</option>
                  <option value={4096}>4096 Shots (High fidelity)</option>
                  <option value={8192}>8192 Shots (Benchmarking)</option>
                </select>
              </div>
            </div>

            {/* Noise Simulation Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFFE3] border border-[#DBD4FF] shadow-xs gap-3">
              <div>
                <div className="text-xs font-bold text-[#531D5E]">
                  Thermal Relaxation & Gate Noise Emulation
                </div>
                <div className="text-[11px] text-[#808034] font-bold mt-0.5">
                  Simulate T1/T2 decoherence and depolarizing readout errors on physical qubits.
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableNoiseModel}
                onChange={(e) => setEnableNoiseModel(e.target.checked)}
                className="w-4 h-4 accent-[#531D5E] rounded cursor-pointer shrink-0"
              />
            </div>
          </div>

          {/* API Credentials Configuration */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] shadow-xs space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#DBD4FF]">
              <Key className="w-4 h-4 text-[#723480]" />
              <h2 className="text-sm font-black text-[#531D5E]">External Cloud API Integrations</h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#723480] mb-1.5">
                  IBM Quantum Experience API Token
                </label>
                <input
                  type="password"
                  value={ibmToken}
                  onChange={(e) => setIbmToken(e.target.value)}
                  placeholder="Paste your IBM Quantum token here..."
                  className="w-full text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl px-3.5 py-2.5 text-[#531D5E] focus:outline-none focus:border-[#531D5E] font-mono shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#723480] mb-1.5">
                  Quantum AI Assistant Provider Key (Gemini / Anthropic / OpenAI)
                </label>
                <input
                  type="password"
                  value={aiApiKey}
                  onChange={(e) => setAiApiKey(e.target.value)}
                  placeholder="Paste your AI LLM API key here..."
                  className="w-full text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl px-3.5 py-2.5 text-[#531D5E] focus:outline-none focus:border-[#531D5E] font-mono shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="p-4 sm:p-6 rounded-3xl bg-rose-50 border-2 border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="text-xs font-black text-rose-900 uppercase tracking-wider">
                Reset Learning Progress & Cache
              </h3>
              <p className="text-xs text-rose-700/80 mt-0.5">
                Clears all local completed lesson checkpoints, earned XP, and saved circuit cache.
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleResetProgress}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="w-full sm:w-auto"
            >
              Reset Data
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto" leftIcon={<Save className="w-4 h-4" />}>
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}


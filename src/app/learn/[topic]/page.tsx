'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { LESSONS } from '@/services/learningApi';
import { useUser } from '@/context/UserContext';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Trophy,
  Play,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';

export default function LessonPlayerPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { markLessonCompleted, progress } = useUser();

  const lesson =
    LESSONS.find((l) => l.slug === resolvedParams.topic) || LESSONS[0];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    progress.completedLessonIds.includes(lesson.id)
  );

  const step = lesson.steps[currentStepIndex];
  const isLastStep = currentStepIndex === lesson.steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleCompleteLesson();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedQuizAnswer(null);
      setQuizSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setSelectedQuizAnswer(null);
      setQuizSubmitted(false);
    }
  };

  const handleCompleteLesson = () => {
    setIsCompleted(true);
    markLessonCompleted(lesson.id, lesson.xpReward);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Back and Breadcrumbs Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Learning Hub</span>
          </Link>

          <Badge variant="cyan">
            Step {currentStepIndex + 1} of {lesson.totalSteps}
          </Badge>
        </div>

        {/* Lesson Progress Step Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / lesson.totalSteps) * 100}%`,
            }}
          />
        </div>

        {/* Main Lesson Content Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          {/* Step Header */}
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-mono font-bold text-cyan-700 uppercase tracking-wider">
              {lesson.title}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {step.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">{step.conceptSummary}</p>
          </div>

          {/* Explanation Body */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 font-normal">
            {step.explanationMarkdown.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Math Formula Highlight Box */}
          {step.mathFormula && (
            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 font-mono text-center shadow-xs">
              <span className="text-[10px] uppercase text-cyan-800 font-bold tracking-wider block mb-1">
                Mathematical Formalism
              </span>
              <div className="text-base sm:text-lg font-bold text-cyan-900">
                {step.mathFormula}
              </div>
            </div>
          )}

          {/* Key Takeaway Card */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-xs">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Key Quantum Takeaway
              </h4>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                {step.keyTakeaway}
              </p>
            </div>
          </div>

          {/* Embedded Interactive Circuit Snippet if present */}
          {step.circuitSnippet && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-600" />
                  Interactive Circuit Demonstration
                </span>
                <Link href="/workspace">
                  <Button variant="outline" size="sm" rightIcon={<Play className="w-3 h-3 fill-current" />}>
                    Open in Studio
                  </Button>
                </Link>
              </div>

              {/* Wire Preview */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs space-y-3 shadow-inner">
                {Array.from({ length: step.circuitSnippet.qubits }).map((_, q) => (
                  <div key={q} className="flex items-center gap-4">
                    <span className="font-bold text-cyan-700 w-8">q{q} |0⟩</span>
                    <div className="flex-1 flex items-center relative h-6">
                      <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-300" />
                      {step.circuitSnippet?.gates
                        .filter((g) => g.targetQubit === q)
                        .map((g, idx) => (
                          <div
                            key={idx}
                            className="z-10 px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-400 text-cyan-800 font-bold ml-6 shadow-sm"
                          >
                            {g.type}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Knowledge Check Quiz */}
          {step.quiz && (
            <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-200 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>Concept Knowledge Check</span>
              </div>
              <p className="text-xs text-slate-800 font-semibold">
                {step.quiz.question}
              </p>

              <div className="space-y-2">
                {step.quiz.options.map((option, optIdx) => {
                  let buttonStyle = 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50';

                  if (quizSubmitted) {
                    if (optIdx === step.quiz?.correctIndex) {
                      buttonStyle = 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold shadow-sm';
                    } else if (selectedQuizAnswer === optIdx) {
                      buttonStyle = 'bg-rose-50 text-rose-900 border-rose-400';
                    }
                  } else if (selectedQuizAnswer === optIdx) {
                    buttonStyle = 'bg-cyan-50 text-cyan-900 border-cyan-400 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => !quizSubmitted && setSelectedQuizAnswer(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between shadow-xs ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && optIdx === step.quiz?.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted && selectedQuizAnswer !== null && (
                <Button
                  size="sm"
                  variant="quantum"
                  onClick={() => setQuizSubmitted(true)}
                  className="mt-2"
                >
                  Check Answer
                </Button>
              )}

              {quizSubmitted && (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-sm">
                  <span className="font-bold text-cyan-700">Explanation: </span>
                  {step.quiz.explanation}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous Step
            </Button>

            <Button
              variant="quantum"
              size="md"
              onClick={handleNext}
              rightIcon={isLastStep ? <Trophy className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            >
              {isLastStep ? 'Complete Module (+XP)' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

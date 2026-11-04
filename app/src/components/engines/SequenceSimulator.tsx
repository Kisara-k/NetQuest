'use client';

import { useState } from 'react';
import type { SequenceSimulatorConfig } from '@/types/curriculum';
import { soundEffects } from '@/lib/sound';
import { useProgressStore } from '@/store/useProgressStore';
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Play,
  SkipForward,
  SkipBack,
  ArrowRight,
  HelpCircle,
  Sparkles,
  GitCommit,
} from 'lucide-react';

interface SequenceSimulatorProps {
  config: SequenceSimulatorConfig;
  lectureId: number;
  onComplete: () => void;
}

export function SequenceSimulator({
  config,
  lectureId,
  onComplete,
}: SequenceSimulatorProps) {
  const { audioMuted, markLabCompleted, lectureProgress } = useProgressStore();
  const isAlreadyPassed = lectureProgress[lectureId]?.labCompleted;

  // Active step index (0 up to config.steps.length - 1)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Solved interactive prompts: stepId -> chosenOption
  const [promptAnswers, setPromptAnswers] = useState<Record<string, string>>({});
  const [promptSolved, setPromptSolved] = useState<Record<string, boolean>>({});

  const currentStep = config.steps[currentStepIndex];
  const isInteractive = Boolean(currentStep?.isInteractivePrompt);
  const isPromptResolved = !isInteractive || Boolean(promptSolved[currentStep.id]);

  const handleStepForward = () => {
    if (!isPromptResolved) {
      soundEffects.playError(audioMuted);
      return;
    }
    if (currentStepIndex < config.steps.length - 1) {
      soundEffects.playSnap(audioMuted);
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      soundEffects.playClick(audioMuted);
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (!currentStep) return;
    const isCorrect = option === currentStep.correctOption;
    setPromptAnswers((prev) => ({ ...prev, [currentStep.id]: option }));
    if (isCorrect) {
      soundEffects.playSuccess(audioMuted);
      setPromptSolved((prev) => ({ ...prev, [currentStep.id]: true }));
    } else {
      soundEffects.playError(audioMuted);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setPromptAnswers({});
    setPromptSolved({});
    soundEffects.playClick(audioMuted);
  };

  // Lab is complete when user reaches the last step and all interactive prompts are solved
  const allPromptsRequired = config.steps.filter((s) => s.isInteractivePrompt);
  const allPromptsSolved = allPromptsRequired.every((s) => promptSolved[s.id]);
  const isAtEnd = currentStepIndex === config.steps.length - 1;
  const isFullySolved = isAtEnd && isPromptResolved && allPromptsSolved;

  const handleFinishLab = () => {
    markLabCompleted(lectureId);
    soundEffects.playLevelUp(audioMuted);
    onComplete();
  };

  const actorsCount = config.actors.length;

  return (
    <div data-testid="lab-container" className="space-y-8">
      {/* Lab Header */}
      <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-slate-900 via-slate-900/80 to-blue-950/40 p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 text-xs font-mono font-bold text-blue-300 flex items-center gap-1.5">
                <GitCommit className="h-3.5 w-3.5 text-blue-400" /> ENGINE 2 · SEQUENCE SIMULATOR
              </span>
              <span className="text-xs font-mono text-blue-400 font-semibold">
                Actors: {config.actors.join(' ↔ ')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">{config.title}</h3>
            <p className="text-xs text-slate-300 max-w-2xl">{config.scenario}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              data-testid="btn-lab-reset"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            {isAlreadyPassed && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="h-4 w-4" /> Lab Passed (+150 XP)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Sequence Timeline Canvas */}
      <div className="rounded-xl border border-slate-800 bg-gray-900/90 p-5 md:p-6 space-y-6">
        {/* Playback Controls & Step Indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
              className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 disabled:opacity-30 transition-colors"
              title="Step Backward"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={handleStepForward}
              disabled={isAtEnd || !isPromptResolved}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 px-3 py-2 text-xs font-bold text-white transition-colors shadow-md shadow-blue-600/20"
              title="Step Forward"
            >
              <span>Step Forward</span>
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">
              STEP {currentStepIndex + 1} OF {config.steps.length}
            </span>
            <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / config.steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Actor Columns Lane Header */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-slate-800/80 pb-3">
          {config.actors.map((actor, aIdx) => (
            <div
              key={aIdx}
              className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-center"
            >
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                NODE {aIdx + 1}
              </div>
              <div className="text-xs md:text-sm font-bold text-slate-100">{actor}</div>
            </div>
          ))}
        </div>

        {/* Timeline Message Exchange Diagram */}
        <div className="space-y-3 py-2">
          {config.steps.slice(0, currentStepIndex + 1).map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const fromLeft = (step.fromIndex / (actorsCount - 1)) * 100;
            const toLeft = (step.toIndex / (actorsCount - 1)) * 100;
            const isLeftToRight = step.toIndex > step.fromIndex;
            const isInternal = step.toIndex === step.fromIndex;

            return (
              <div
                key={step.id}
                className={`rounded-lg border p-3 transition-all ${
                  isCurrent
                    ? 'border-blue-500/80 bg-blue-950/20 ring-1 ring-blue-500/30'
                    : 'border-slate-800/60 bg-slate-950/40 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-cyan-400 font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-mono font-bold text-slate-100">
                      {config.actors[step.fromIndex]}{' '}
                      {isInternal ? '⟲ (Local Event)' : isLeftToRight ? '→' : '←'}{' '}
                      {!isInternal && config.actors[step.toIndex]}:
                    </span>
                    <span className="font-mono text-cyan-300 font-semibold">{step.label}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <span className="text-slate-500">State After:</span>
                    <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-emerald-400 font-semibold">
                      {step.stateAfter}
                    </span>
                  </div>
                </div>

                <p className="mt-1.5 text-xs text-slate-300 pl-7">{step.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Challenge Drawer (when paused on an interactive prompt) */}
        {isInteractive && !promptSolved[currentStep.id] && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 space-y-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Interactive Protocol Checkpoint: Predict Step Action
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  At this stage of the exchange, what packet or state transition must occur?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentStep.options?.map((option, oIdx) => {
                const isSelected = promptAnswers[currentStep.id] === option;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionSelect(option)}
                    className={`rounded-lg p-3 text-left font-mono text-xs border transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                        : 'border-slate-800 bg-slate-900 text-slate-200 hover:border-amber-500/50 hover:bg-slate-850'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {promptAnswers[currentStep.id] && !promptSolved[currentStep.id] && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300">Incorrect transition: </span>
                  <span>Review the state parameters and try one of the other options above.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interactive Step Success / Diagnostic Feedback */}
        {isInteractive && promptSolved[currentStep.id] && currentStep.explanation && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4 text-xs text-emerald-200 space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300 mr-1">Protocol Diagnostic:</span>
                <span>{currentStep.explanation}</span>
              </div>
            </div>
            {!isAtEnd && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleStepForward}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-md shadow-blue-600/20"
                >
                  <span>Continue Step Forward</span>
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lab Completion Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-300 text-center sm:text-left">
          {isFullySolved ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Full protocol timeline executed and validated!
            </span>
          ) : (
            <span className="text-slate-400">
              Traverse the full timeline and solve all interactive checkpoints to claim +150 XP.
            </span>
          )}
        </div>

        <button
          onClick={handleFinishLab}
          disabled={!isFullySolved}
          data-testid="btn-lab-complete"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Complete Lab & Claim +150 XP</span>
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
}

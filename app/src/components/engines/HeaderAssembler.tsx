'use client';

import { useState, useMemo } from 'react';
import type { HeaderAssemblerConfig } from '@/types/curriculum';
import { soundEffects } from '@/lib/sound';
import { useProgressStore } from '@/store/useProgressStore';
import { seededShuffle, hashString } from '@/lib/utils';
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Binary,
  Layers,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface HeaderAssemblerProps {
  config: HeaderAssemblerConfig;
  lectureId: number;
  onComplete: () => void;
}

export function HeaderAssembler({
  config,
  lectureId,
  onComplete,
}: HeaderAssemblerProps) {
  const { audioMuted, markLabCompleted, lectureProgress } = useProgressStore();
  const isAlreadyPassed = lectureProgress[lectureId]?.labCompleted;

  // Selected values for each slot: slotId -> assignedValue
  const [slotAssignments, setSlotAssignments] = useState<Record<string, string>>({});
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [hasVerifiedSlots, setHasVerifiedSlots] = useState(false);

  // Parameter challenges state: challengeId -> selectedOption
  const [taskAnswers, setTaskAnswers] = useState<Record<string, string>>({});
  const [taskSubmitted, setTaskSubmitted] = useState<Record<string, boolean>>({});

  // All available chips (correct slot values + distractors), shuffled deterministically
  const availableChips = useMemo(() => {
    const all = [
      ...config.slots.map((s) => s.correctValue),
      ...config.distractors,
    ];
    return seededShuffle(all, hashString(config.title));
  }, [config]);

  // Which chips are currently placed
  const assignedChips = useMemo(
    () => new Set(Object.values(slotAssignments)),
    [slotAssignments],
  );

  const handleChipClick = (chip: string) => {
    if (assignedChips.has(chip)) return;
    soundEffects.playClick(audioMuted);
    setSelectedChip((prev) => (prev === chip ? null : chip));
  };

  const handleSlotClick = (slotId: string) => {
    soundEffects.playSnap(audioMuted);
    setHasVerifiedSlots(false);
    if (selectedChip) {
      setSlotAssignments((prev) => ({ ...prev, [slotId]: selectedChip }));
      setSelectedChip(null);
    } else if (slotAssignments[slotId]) {
      // Remove chip from slot
      setSlotAssignments((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
    }
  };

  const handleVerifySlots = () => {
    setHasVerifiedSlots(true);
    const allCorrect = config.slots.every(
      (s) => slotAssignments[s.id] === s.correctValue,
    );
    if (allCorrect) {
      soundEffects.playSuccess(audioMuted);
    } else {
      soundEffects.playError(audioMuted);
    }
  };

  const handleReset = () => {
    setSlotAssignments({});
    setSelectedChip(null);
    setHasVerifiedSlots(false);
    setTaskAnswers({});
    setTaskSubmitted({});
    soundEffects.playClick(audioMuted);
  };

  const handleOptionSelect = (taskId: string, option: string) => {
    soundEffects.playClick(audioMuted);
    setTaskAnswers((prev) => ({ ...prev, [taskId]: option }));
    setTaskSubmitted((prev) => ({ ...prev, [taskId]: true }));
  };

  // Determine if slots are 100% correct
  const areSlotsComplete = config.slots.every(
    (s) => slotAssignments[s.id] === s.correctValue,
  );

  // Determine if all parameter tasks are answered correctly
  const areTasksComplete = config.parameterTasks.every(
    (t) => taskSubmitted[t.id] && taskAnswers[t.id] === t.correctOption,
  );

  const isFullySolved = areSlotsComplete && areTasksComplete;

  const handleFinishLab = () => {
    markLabCompleted(lectureId);
    soundEffects.playLevelUp(audioMuted);
    onComplete();
  };

  return (
    <div data-testid="lab-container" className="space-y-8">
      {/* Lab Header */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900/80 to-cyan-950/40 p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Binary className="h-3.5 w-3.5 text-cyan-400" /> ENGINE 1 · HEADER ASSEMBLER
              </span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Target: {config.targetProtocol}
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

      {/* Part 1: Interactive PDU / Header Frame Slots */}
      <div className="rounded-xl border border-slate-800 bg-gray-900/90 p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" /> Part 1: Protocol PDU Construction
            </h4>
            <p className="text-xs text-slate-400">
              Select a field from the inventory below, then click a target slot to place it in
              specification order. Click a placed slot to clear it.
            </p>
          </div>
          <button
            onClick={handleVerifySlots}
            data-testid="btn-lab-verify"
            className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-md shadow-cyan-600/20"
          >
            <span>Verify Slots</span>
          </button>
        </div>

        {/* Target Header Slots (horizontal scrollable on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {config.slots.map((slot, index) => {
            const assigned = slotAssignments[slot.id];
            const isCorrect = assigned === slot.correctValue;
            const showError = hasVerifiedSlots && assigned && !isCorrect;
            const showSuccess = hasVerifiedSlots && isCorrect;

            return (
              <div
                key={slot.id}
                onClick={() => handleSlotClick(slot.id)}
                className={`cursor-pointer rounded-lg border p-3 transition-all flex flex-col justify-between min-h-[92px] ${
                  showSuccess
                    ? 'border-emerald-500/60 bg-emerald-950/30'
                    : showError
                    ? 'border-rose-500/60 bg-rose-950/30'
                    : assigned
                    ? 'border-cyan-500/50 bg-slate-950'
                    : selectedChip
                    ? 'border-dashed border-cyan-400/60 bg-cyan-950/10 hover:bg-cyan-950/30'
                    : 'border-dashed border-slate-700 bg-slate-950/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-bold text-slate-300">
                    SLOT {index + 1}: {slot.label}
                  </span>
                  <span className="text-[10px] text-cyan-400/80">{slot.bitWidth}</span>
                </div>

                <div className="my-1.5">
                  {assigned ? (
                    <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-100">
                      <span className="truncate">{assigned}</span>
                      {showSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-1" />}
                      {showError && <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 ml-1" />}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      {selectedChip ? 'Click to place chip' : '[ Empty Slot ]'}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 line-clamp-1">{slot.description}</div>
              </div>
            );
          })}
        </div>

        {/* Chips Inventory */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Protocol Field Inventory (Click to select)</span>
            {selectedChip && (
              <span className="text-xs font-mono text-cyan-400">
                Selected: &ldquo;{selectedChip}&rdquo;
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableChips.map((chip, i) => {
              const isAssigned = assignedChips.has(chip);
              const isSelected = selectedChip === chip;

              return (
                <button
                  key={i}
                  disabled={isAssigned}
                  onClick={() => handleChipClick(chip)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all ${
                    isAssigned
                      ? 'opacity-30 line-through bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                      : isSelected
                      ? 'border border-cyan-400 bg-cyan-500/20 text-cyan-200 ring-2 ring-cyan-400/30'
                      : 'border border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {hasVerifiedSlots && areSlotsComplete && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs font-medium text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>PDU header slots perfectly assembled according to the protocol specification!</span>
          </div>
        )}
      </div>

      {/* Part 2: Interactive Parameter & Calculation Challenges */}
      {config.parameterTasks.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-gray-900/90 p-5 md:p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Binary className="h-4 w-4 text-cyan-400" /> Part 2: Protocol Parameters & Calculation Tasks
            </h4>
            <p className="text-xs text-slate-400">
              Apply exact formulas and protocol rules (CIDR masks, EUI-64 MAC conversions, back-off timers)
              to configure the network engine.
            </p>
          </div>

          <div className="space-y-4">
            {config.parameterTasks.map((task, tIdx) => {
              const isAnswered = taskSubmitted[task.id];
              const selectedOption = taskAnswers[task.id];
              const isCorrect = isAnswered && selectedOption === task.correctOption;

              return (
                <div
                  key={task.id}
                  className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-200">
                      <span className="text-cyan-400 font-mono mr-1.5">Task {tIdx + 1}:</span>
                      {task.prompt}
                    </div>
                    {isAnswered && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                          isCorrect
                            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40'
                            : 'text-rose-400 bg-rose-950/40 border-rose-500/40'
                        }`}
                      >
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {task.options.map((option, oIdx) => {
                      const isChosen = selectedOption === option;
                      const isTheRightOne = option === task.correctOption;

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(task.id, option)}
                          className={`rounded-lg p-2.5 text-left text-xs font-mono transition-all border ${
                            isAnswered && isTheRightOne
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold'
                              : isAnswered && isChosen && !isTheRightOne
                              ? 'border-rose-500 bg-rose-950/40 text-rose-200 line-through'
                              : isChosen
                              ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Card */}
                  {isAnswered && (
                    <div
                      className={`rounded-lg p-3 text-xs leading-relaxed border ${
                        isCorrect
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                          : 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold mr-1">
                            {isCorrect ? 'Protocol Diagnostic:' : 'Resolution:'}
                          </span>
                          <span>{task.explanation}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lab Completion Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-300 text-center sm:text-left">
          {isFullySolved ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> All header slots and protocol calculations verified!
            </span>
          ) : (
            <span className="text-slate-400">
              Complete both the header slot assembly and parameter tasks to unlock +150 XP.
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

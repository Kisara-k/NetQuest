'use client';

import { useState } from 'react';
import type { MatrixArenaConfig } from '@/types/curriculum';
import { soundEffects } from '@/lib/sound';
import { useProgressStore } from '@/store/useProgressStore';
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Grid3X3,
  Check,
} from 'lucide-react';

interface MatrixArenaProps {
  config: MatrixArenaConfig;
  lectureId: number;
  onComplete: () => void;
}

export function MatrixArena({ config, lectureId, onComplete }: MatrixArenaProps) {
  const { audioMuted, markLabCompleted, lectureProgress } = useProgressStore();
  const isAlreadyPassed = lectureProgress[lectureId]?.labCompleted;

  // Active item index to classify
  const [activeItemIdx, setActiveItemIdx] = useState(0);

  // Solved items: itemId -> { chosenCategoryId, isCorrect }
  const [classifiedMap, setClassifiedMap] = useState<
    Record<string, { categoryId: string; isCorrect: boolean }>
  >({});

  const currentItem = config.items[activeItemIdx];
  const isFinished = activeItemIdx >= config.items.length;

  const handleSelectCategory = (categoryId: string) => {
    if (!currentItem) return;

    const isCorrect = categoryId === currentItem.correctCategoryId;
    setClassifiedMap((prev) => ({
      ...prev,
      [currentItem.id]: { categoryId, isCorrect },
    }));

    if (isCorrect) {
      soundEffects.playSuccess(audioMuted);
    } else {
      soundEffects.playError(audioMuted);
    }

    // Advance to next item after a short delay
    setTimeout(() => {
      setActiveItemIdx((prev) => prev + 1);
    }, 600);
  };

  const handleReset = () => {
    setActiveItemIdx(0);
    setClassifiedMap({});
    soundEffects.playClick(audioMuted);
  };

  const totalItems = config.items.length;
  const correctCount = Object.values(classifiedMap).filter((v) => v.isCorrect).length;
  const isFullySolved = isFinished && correctCount >= Math.floor(totalItems * 0.7);

  const handleFinishLab = () => {
    markLabCompleted(lectureId);
    soundEffects.playLevelUp(audioMuted);
    onComplete();
  };

  return (
    <div data-testid="lab-container" className="space-y-8">
      {/* Lab Header */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900/80 to-amber-950/40 p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <Grid3X3 className="h-3.5 w-3.5 text-amber-400" /> ENGINE 4 · MATRIX ARENA
              </span>
              <span className="text-xs font-mono text-amber-400 font-semibold">
                {config.categories.length} Categories · {config.items.length} Specifications
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

      {/* Main Arena Workspace */}
      <div className="rounded-xl border border-slate-800 bg-gray-900/90 p-5 md:p-6 space-y-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
          <span className="text-slate-400">
            ITEM {Math.min(activeItemIdx + 1, totalItems)} OF {totalItems}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">{correctCount} Correct</span>
            <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${(Math.min(activeItemIdx, totalItems) / totalItems) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current Active Card to Classify */}
        {!isFinished && currentItem ? (
          <div className="rounded-xl border border-amber-500/40 bg-slate-950 p-6 text-center space-y-4 shadow-xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
              Classify Technical Feature
            </span>
            <p className="text-base md:text-lg font-bold text-slate-100 max-w-xl mx-auto">
              &ldquo;{currentItem.text}&rdquo;
            </p>
            <p className="text-xs text-slate-400">
              Select the matching protocol or architectural category below:
            </p>

            {/* Category Buckets Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {config.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-left hover:border-amber-400 hover:bg-slate-800 transition-all group"
                >
                  <div className="font-bold text-xs md:text-sm text-slate-100 group-hover:text-amber-300">
                    {cat.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{cat.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Finished Arena Review Screen */
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-6 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-100">
              Matrix Classification Completed!
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Score: {correctCount} / {totalItems} specifications matched correctly (
              {Math.round((correctCount / totalItems) * 100)}%).
            </p>
          </div>
        )}

        {/* Categories Buckets Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {config.categories.map((cat) => {
            const classifiedInThisCat = config.items.filter(
              (it) => classifiedMap[it.id]?.categoryId === cat.id,
            );

            return (
              <div
                key={cat.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="font-bold text-xs text-slate-200">{cat.title}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {classifiedInThisCat.length} assigned
                  </span>
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {classifiedInThisCat.map((it) => {
                    const isRight = it.correctCategoryId === cat.id;
                    return (
                      <div
                        key={it.id}
                        className={`text-[11px] p-1.5 rounded flex items-start gap-1.5 border ${
                          isRight
                            ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/20'
                            : 'bg-rose-950/30 text-rose-300 border-rose-500/20'
                        }`}
                      >
                        {isRight ? (
                          <Check className="h-3 w-3 shrink-0 mt-0.5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="h-3 w-3 shrink-0 mt-0.5 text-rose-400" />
                        )}
                        <span className="line-clamp-2">{it.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lab Completion Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-300 text-center sm:text-left">
          {isFullySolved ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Protocol matrix classification passed!
            </span>
          ) : (
            <span className="text-slate-400">
              Classify all {totalItems} specifications with at least 70% accuracy to unlock +150 XP.
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

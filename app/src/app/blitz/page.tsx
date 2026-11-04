'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getAllQuizQuestions, SECTORS, CURRICULUM_MODULES } from '@/data';
import type { QuizQuestion, SectorId } from '@/types/curriculum';
import { useProgressStore } from '@/store/useProgressStore';
import { soundEffects } from '@/lib/sound';
import { seededShuffle } from '@/lib/utils';
import {
  Zap,
  Timer,
  Trophy,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Flame,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
} from 'lucide-react';

export default function ExamBlitzPage() {
  const { blitzHighScore, examHighScore, recordBlitzScore, audioMuted, xp } =
    useProgressStore();

  const allQuestions = useMemo(() => getAllQuizQuestions(), []);

  // Mode: 'menu' | 'arcade' (60s) | 'exam' (20Q) | 'results'
  const [mode, setMode] = useState<'menu' | 'arcade' | 'exam' | 'results'>('menu');
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);

  // Sector breakdown tracking: sectorId -> { correct: number, total: number }
  const [sectorBreakdown, setSectorBreakdown] = useState<
    Record<SectorId, { correct: number; total: number }>
  >({
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 },
    4: { correct: 0, total: 0 },
    5: { correct: 0, total: 0 },
  });

  const startArcadeMode = () => {
    soundEffects.playClick(audioMuted);
    const shuffled = seededShuffle(allQuestions, Date.now());
    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setTimeLeft(60);
    setCorrectCount(0);
    setCombo(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setMode('arcade');
  };

  const startExamMode = () => {
    soundEffects.playClick(audioMuted);
    // Sample 4 questions per sector = 20 questions total
    const sampled: QuizQuestion[] = [];
    SECTORS.forEach((sec) => {
      const secQuestions = allQuestions.filter((q) => {
        const mod = CURRICULUM_MODULES.find((m) => m.id === q.lectureId);
        return mod?.sectorId === sec.id;
      });
      const shuffled = seededShuffle(secQuestions, Date.now() + sec.id);
      sampled.push(...shuffled.slice(0, 4));
    });

    const finalSampled = seededShuffle(sampled, Date.now());
    setActiveQuestions(finalSampled);
    setCurrentIndex(0);
    setTimeLeft(0);
    setCorrectCount(0);
    setCombo(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSectorBreakdown({
      1: { correct: 0, total: 0 },
      2: { correct: 0, total: 0 },
      3: { correct: 0, total: 0 },
      4: { correct: 0, total: 0 },
      5: { correct: 0, total: 0 },
    });
    setMode('exam');
  };

  // Arcade countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'arcade' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishBlitz(correctCount, 'arcade');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, timeLeft, correctCount]);

  const handleFinishBlitz = useCallback(
    (finalScore: number, blitzMode: 'arcade' | 'exam') => {
      soundEffects.playLevelUp(audioMuted);
      recordBlitzScore(finalScore, blitzMode);
      setMode('results');
    },
    [audioMuted, recordBlitzScore],
  );

  const currentQ = activeQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    const lectureMod = CURRICULUM_MODULES.find((m) => m.id === currentQ.lectureId);
    const sectorId = lectureMod?.sectorId || 1;

    setSectorBreakdown((prev) => ({
      ...prev,
      [sectorId]: {
        correct: prev[sectorId].correct + (isCorrect ? 1 : 0),
        total: prev[sectorId].total + 1,
      },
    }));

    if (isCorrect) {
      soundEffects.playSuccess(audioMuted);
      setCorrectCount((prev) => prev + 1);
      setCombo((prev) => prev + 1);
    } else {
      soundEffects.playError(audioMuted);
      setCombo(0);
    }

    // Auto-advance fast in arcade, button in exam
    if (mode === 'arcade') {
      setTimeout(() => {
        if (currentIndex < activeQuestions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsAnswered(false);
        } else {
          handleFinishBlitz(correctCount + (isCorrect ? 1 : 0), 'arcade');
        }
      }, 500);
    }
  };

  const handleNextExamQuestion = () => {
    if (!isAnswered) return;
    soundEffects.playClick(audioMuted);
    if (currentIndex >= activeQuestions.length - 1) {
      handleFinishBlitz(correctCount, 'exam');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  // Keyboard navigation: 1..4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((mode === 'arcade' || mode === 'exam') && !isAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          handleSelectOption(parseInt(e.key, 10) - 1);
        }
      } else if (mode === 'exam' && isAnswered && e.key === 'Enter') {
        handleNextExamQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, isAnswered]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-gray-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> EXAM BLITZ ARCADE
              </span>
              <span className="text-xs text-slate-400">High-Yield Active Recall Gauntlet</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">
              Cross-Lecture Protocol Challenge
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Test your recall across all 14 networking lectures in high-speed arcade mode or simulated 20-question comprehensive exam.
            </p>
          </div>

          {/* High Scores */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">60s Arcade Best</div>
              <div className="text-lg font-bold font-mono text-amber-400">{blitzHighScore} pts</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">20Q Exam Best</div>
              <div className="text-lg font-bold font-mono text-cyan-400">{examHighScore} / 20</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode 1: Main Menu Mode Selectors */}
      {mode === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
          {/* Preset 1: 60s Speed Arcade */}
          <div className="rounded-2xl border border-slate-800 bg-gray-900/90 p-6 flex flex-col justify-between space-y-5 hover:border-amber-500/50 transition-all shadow-xl">
            <div className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Timer className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">60-Second Speed Blitz</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Answer as many randomized questions from all 14 lectures as you can before the clock runs out. Instant feedback, rapid scoring (+15 XP per question).
              </p>
            </div>
            <button
              onClick={startArcadeMode}
              data-testid="blitz-start-60s"
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-amber-600/20 transition-all"
            >
              <Zap className="h-4 w-4" />
              <span>Launch 60s Blitz</span>
            </button>
          </div>

          {/* Preset 2: 20-Question Final Exam Simulation */}
          <div className="rounded-2xl border border-slate-800 bg-gray-900/90 p-6 flex flex-col justify-between space-y-5 hover:border-cyan-500/50 transition-all shadow-xl">
            <div className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">20-Question Final Exam</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Balanced 20-question mock exam evenly sampled across all 5 Sectors with detailed diagnostic explanations and post-game sector diagnostic audit.
              </p>
            </div>
            <button
              onClick={startExamMode}
              data-testid="blitz-start-exam"
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Launch 20Q Exam</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2 & 3: Active Arcade / Exam Question Loop */}
      {(mode === 'arcade' || mode === 'exam') && currentQ && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-bold">
                {mode === 'arcade' ? `STREAK: ${correctCount}` : `Q ${currentIndex + 1} / 20`}
              </span>
              <span className="text-slate-400">Lecture {currentQ.lectureId}</span>
            </div>

            {mode === 'arcade' ? (
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                <Timer className="h-4 w-4" />
                <span>{timeLeft}s</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / 20) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span>Score: {correctCount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="rounded-xl border border-slate-800 bg-gray-900/90 p-6 md:p-8 space-y-6 shadow-2xl">
            <h3 className="text-base md:text-lg font-bold text-slate-100 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isChosen = selectedOption === idx;
                const isTheRightOne = idx === currentQ.correctIndex;

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full rounded-xl border p-4 text-left text-xs md:text-sm font-medium transition-all flex items-start justify-between gap-3 ${
                      isAnswered && isTheRightOne
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100 font-semibold'
                        : isAnswered && isChosen && !isTheRightOne
                        ? 'border-rose-500 bg-rose-950/40 text-rose-200 line-through'
                        : isChosen
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-100'
                        : 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[11px] font-mono font-bold text-cyan-400 shrink-0 mt-0.5 border border-slate-700">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </div>

                    {isAnswered && isTheRightOne && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isChosen && !isTheRightOne && (
                      <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Diagnostic card in Exam mode */}
            {mode === 'exam' && isAnswered && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs space-y-2">
                <div className="font-bold text-cyan-300">Protocol Diagnostic:</div>
                <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextExamQuestion}
                    className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition-colors"
                  >
                    <span>{currentIndex === activeQuestions.length - 1 ? 'View Audit Results' : 'Next Question'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 4: Results and Sector Diagnostic Breakdown */}
      {mode === 'results' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-xl border border-slate-800 bg-gray-900/90 p-6 md:p-8 text-center space-y-5 shadow-2xl">
            <Trophy className="h-12 w-12 text-amber-400 mx-auto" />
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                BLITZ AUDIT REPORT
              </span>
              <h2 className="text-2xl font-bold text-slate-100">Challenge Concluded!</h2>
              <p className="text-xs text-slate-400">
                Final Score: <span className="font-bold text-amber-400 text-sm">{correctCount}</span> correct answers (+{correctCount * 15} XP earned)
              </p>
            </div>

            {/* Sector-by-Sector Breakdown */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                Sector Performance Diagnostic
              </div>
              <div className="space-y-2">
                {SECTORS.map((sector) => {
                  const data = sectorBreakdown[sector.id];
                  const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 100;

                  return (
                    <div key={sector.id} className="flex items-center justify-between text-xs font-mono">
                      <Link
                        href={`/lecture/${sector.lectureIds[0]}`}
                        className="flex items-center gap-2 hover:underline group"
                        title={`Review missions in ${sector.name}`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sector.accent }}
                        />
                        <span className="text-slate-300 group-hover:text-cyan-300 font-sans">{sector.name}</span>
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          {data.correct} / {data.total}
                        </span>
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded ${
                            pct >= 75
                              ? 'text-emerald-400 bg-emerald-950/40'
                              : 'text-amber-400 bg-amber-950/40'
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setMode('menu')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Return to Blitz Menu</span>
              </button>
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition-colors"
              >
                <span>Review Campaign Map</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

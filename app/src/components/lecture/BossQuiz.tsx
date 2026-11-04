'use client';

import { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion } from '@/types/curriculum';
import { useProgressStore } from '@/store/useProgressStore';
import { soundEffects } from '@/lib/sound';
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface BossQuizProps {
  questions: QuizQuestion[];
  lectureId: number;
  lectureTitle: string;
  onReviewVault?: () => void;
  onNextLecture?: () => void;
}

export function BossQuiz({
  questions,
  lectureId,
  lectureTitle,
  onReviewVault,
  onNextLecture,
}: BossQuizProps) {
  const { audioMuted, recordQuizScore, flagCardFromQuiz, lectureProgress } =
    useProgressStore();
  const currentProgress = lectureProgress[lectureId];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Calculate dynamic combo multiplier
  const multiplier = combo >= 4 ? 2 : combo >= 2 ? 1.5 : 1;

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (isAnswered || !currentQ) return;
      setSelectedOption(optionIndex);
      setIsAnswered(true);

      const isCorrect = optionIndex === currentQ.correctIndex;
      if (isCorrect) {
        soundEffects.playSuccess(audioMuted);
        setCorrectCount((prev) => prev + 1);
        setCombo((prev) => prev + 1);
      } else {
        soundEffects.playError(audioMuted);
        setCombo(0);
        // Automatically flag a corresponding flashcard for spaced review
        flagCardFromQuiz(`l${lectureId}-f1`);
      }
    },
    [isAnswered, currentQ, audioMuted, lectureId, flagCardFromQuiz],
  );

  const handleNextQuestion = useCallback(() => {
    if (!isAnswered) return;
    soundEffects.playClick(audioMuted);

    if (isLastQuestion) {
      const finalCorrect =
        selectedOption === currentQ.correctIndex ? correctCount : correctCount;
      recordQuizScore(lectureId, finalCorrect, questions.length, multiplier);
      setQuizFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [
    isAnswered,
    audioMuted,
    isLastQuestion,
    selectedOption,
    currentQ,
    correctCount,
    lectureId,
    questions.length,
    multiplier,
    recordQuizScore,
  ]);

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setCombo(0);
    setQuizFinished(false);
    soundEffects.playClick(audioMuted);
  };

  // Keyboard navigation support: '1'..'4' to select answer, 'Enter' to advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (quizFinished) return;
      if (!isAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          handleSelectOption(idx);
        }
      } else {
        if (e.key === 'Enter') {
          handleNextQuestion();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quizFinished, isAnswered, handleSelectOption, handleNextQuestion]);

  // Quiz Results Screen
  if (quizFinished) {
    const scorePct = Math.round((correctCount / questions.length) * 100);
    const isBossDefeated = scorePct >= 80;

    return (
      <div
        data-testid="quiz-results-summary"
        className="rounded-xl border border-slate-800 bg-gray-900/90 p-6 md:p-8 text-center space-y-6 max-w-xl mx-auto shadow-2xl"
      >
        <div className="flex justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl border shadow-xl ${
              isBossDefeated
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                : 'border-slate-700 bg-slate-800 text-slate-300'
            }`}
          >
            <Trophy className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            STAGE 3 · BATTLE REPORT
          </span>
          <h3 className="text-2xl font-bold text-slate-100">
            {isBossDefeated ? 'Boss Defeated!' : 'Battle Concluded'}
          </h3>
          <p className="text-xs text-slate-400">{lectureTitle}</p>
        </div>

        {/* Score pill */}
        <div className="inline-flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 px-6 py-3">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">Final Mastery</div>
            <div
              className={`text-2xl font-bold font-mono ${
                isBossDefeated ? 'text-amber-400' : 'text-slate-200'
              }`}
            >
              {scorePct}%
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">Correct</div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {correctCount} / {questions.length}
            </div>
          </div>
        </div>

        {isBossDefeated && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Boss Defeated Badge Unlocked! +100 First-Time Victory Bonus XP</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRestartQuiz}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry Boss Battle</span>
          </button>
          {onReviewVault && (
            <button
              onClick={onReviewVault}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Review Memory Vault</span>
            </button>
          )}
          {onNextLecture && (
            <button
              onClick={onNextLecture}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              <span>Next Lecture Mission</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active Quiz Question View
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Quiz Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">
            QUESTION {currentIndex + 1} OF {questions.length}
          </span>
          <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {currentQ.difficulty}
          </span>
        </div>

        {/* Combo multiplier indicator */}
        <div className="flex items-center gap-2">
          {combo >= 2 && (
            <div className="flex items-center gap-1 rounded bg-amber-950/50 border border-amber-500/40 px-2 py-0.5 text-[11px] font-bold text-amber-400 animate-pulse">
              <Flame className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{multiplier}x Combo ({combo} in a row!)</span>
            </div>
          )}
          <span className="text-slate-400">Score: {correctCount}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-xl border border-slate-800 bg-gray-900/90 p-6 md:p-7 space-y-6 shadow-xl">
        <h3
          data-testid="quiz-question-text"
          className="text-base md:text-lg font-bold text-slate-100 leading-snug"
        >
          {currentQ.question}
        </h3>

        {/* 4 Options Buttons */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isChosen = selectedOption === idx;
            const isTheCorrectOne = idx === currentQ.correctIndex;

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                data-testid={`quiz-option-${idx}`}
                className={`w-full rounded-xl border p-4 text-left text-xs md:text-sm font-medium transition-all flex items-start justify-between gap-3 ${
                  isAnswered && isTheCorrectOne
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100 font-semibold shadow-md shadow-emerald-950/40'
                    : isAnswered && isChosen && !isTheCorrectOne
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
                  <span className="leading-relaxed">{option}</span>
                </div>

                {isAnswered && isTheCorrectOne && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isChosen && !isTheCorrectOne && (
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Diagnostic Explanation Card (Revealed after answering) */}
        {isAnswered && (
          <div
            data-testid="quiz-explanation"
            className={`rounded-xl border p-4 text-xs leading-relaxed space-y-1.5 ${
              selectedOption === currentQ.correctIndex
                ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                : 'border-rose-500/30 bg-rose-950/20 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <HelpCircle className="h-4 w-4" />
              <span>
                {selectedOption === currentQ.correctIndex
                  ? 'Protocol Diagnostic (Correct!):'
                  : 'Protocol Diagnostic (Analysis):'}
              </span>
            </div>
            <p className="pl-5 text-slate-300">{currentQ.explanation}</p>
          </div>
        )}

        {/* Next Question / Finish Button */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              data-testid="btn-quiz-next"
              className="flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition-all"
            >
              <span>{isLastQuestion ? 'Complete Boss Battle' : 'Next Question'}</span>
              <span className="text-[10px] font-mono opacity-80">(Press Enter)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] text-slate-400 font-mono">
        Shortcut: Press [1], [2], [3], [4] on your keyboard to select an option
      </div>
    </div>
  );
}

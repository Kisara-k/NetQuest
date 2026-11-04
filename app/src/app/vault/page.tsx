'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllFlashcards, CURRICULUM_MODULES, SECTORS } from '@/data';
import type { Flashcard, SRSRating } from '@/types/curriculum';
import { useProgressStore } from '@/store/useProgressStore';
import { createInitialSRSState, isCardDue, rateCard } from '@/lib/srs';
import { formatInterval } from '@/lib/utils';
import { soundEffects } from '@/lib/sound';
import {
  Sparkles,
  RotateCw,
  Clock,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  BookOpen,
  Zap,
} from 'lucide-react';

export default function MemoryVaultPage() {
  const { srsState, reviewCard, audioMuted, xp } = useProgressStore();

  const allCards = useMemo(() => getAllFlashcards(), []);

  // Filter state
  const [filterMode, setFilterMode] = useState<'due' | 'all' | 'flagged'>('due');
  const [selectedLectureId, setSelectedLectureId] = useState<number | 'all'>('all');

  // Deck state
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Compute filtered cards list
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      // Lecture filter
      if (selectedLectureId !== 'all' && card.lectureId !== selectedLectureId) {
        return false;
      }
      const state = srsState[card.id] || createInitialSRSState(card.id);
      if (filterMode === 'due') {
        return isCardDue(state);
      }
      if (filterMode === 'flagged') {
        return Boolean(state.flaggedFromQuiz);
      }
      return true; // 'all'
    });
  }, [allCards, srsState, filterMode, selectedLectureId]);

  const activeCard: Flashcard | undefined = filteredCards[currentCardIndex];
  const cardState = activeCard
    ? srsState[activeCard.id] || createInitialSRSState(activeCard.id)
    : undefined;

  // Pre-calculate next interval previews for the 4 rating buttons
  const intervalPreviews = useMemo(() => {
    if (!cardState) return { again: '<1m', hard: '1d', good: '1d', easy: '4d' };
    const rAgain = rateCard(cardState, 'again');
    const rHard = rateCard(cardState, 'hard');
    const rGood = rateCard(cardState, 'good');
    const rEasy = rateCard(cardState, 'easy');
    return {
      again: formatInterval(rAgain.interval),
      hard: formatInterval(rHard.interval),
      good: formatInterval(rGood.interval),
      easy: formatInterval(rEasy.interval),
    };
  }, [cardState]);

  const handleFlip = useCallback(() => {
    soundEffects.playSnap(audioMuted);
    setIsFlipped((prev) => !prev);
  }, [audioMuted]);

  const handleRate = useCallback(
    (rating: SRSRating) => {
      if (!activeCard) return;
      reviewCard(activeCard.id, rating);
      setIsFlipped(false);
      // Advance to next card or loop
      if (currentCardIndex >= filteredCards.length - 1) {
        setCurrentCardIndex(0);
      } else {
        setCurrentCardIndex((prev) => prev + 1);
      }
    },
    [activeCard, currentCardIndex, filteredCards.length, reviewCard],
  );

  // Keyboard navigation: Space to flip, 1..4 to rate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        if (e.key === '2') handleRate('hard');
        if (e.key === '3') handleRate('good');
        if (e.key === '4') handleRate('easy');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, handleFlip, handleRate]);

  // Overall stats
  const dueCount = allCards.filter((c) => {
    const st = srsState[c.id];
    return !st || isCardDue(st);
  }).length;

  const flaggedCount = allCards.filter((c) => Boolean(srsState[c.id]?.flaggedFromQuiz)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-gray-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> SM-2 MEMORY VAULT
              </span>
              <span className="text-xs text-slate-400">SuperMemo-2 Spaced Repetition</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">
              Active Recall Protocol Flashcards
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Lock in networking standards, constants, frame sizes, and formulas. Missed quiz questions are automatically flagged here.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Due Now</div>
              <div className="text-lg font-bold font-mono text-cyan-400">{dueCount}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Flagged</div>
              <div className="text-lg font-bold font-mono text-amber-400">{flaggedCount}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Cards</div>
              <div className="text-lg font-bold font-mono text-slate-200">{allCards.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Mode Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFilterMode('due');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'due'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Due Now ({dueCount})</span>
          </button>

          <button
            onClick={() => {
              setFilterMode('all');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>All Cards ({allCards.length})</span>
          </button>

          <button
            onClick={() => {
              setFilterMode('flagged');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'flagged'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Flagged ({flaggedCount})</span>
          </button>
        </div>

        {/* Lecture Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono">Lecture:</span>
          <select
            value={selectedLectureId}
            onChange={(e) => {
              const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10);
              setSelectedLectureId(val);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All 14 Lectures</option>
            {CURRICULUM_MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                L{m.id}: {m.shortTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Flashcard Practice Area */}
      {filteredCards.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-gray-900/40 p-12 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-100">Zero Cards Pending in this Filter!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You are fully caught up with scheduled reviews. Switch to &ldquo;All Cards&rdquo; to drill any lecture.
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            <span>Browse All {allCards.length} Cards</span>
          </button>
        </div>
      ) : activeCard ? (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Card Counter & Tag */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-cyan-400 font-bold">
              CARD {currentCardIndex + 1} OF {filteredCards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded bg-slate-800 px-2 py-0.5 border border-slate-700 text-slate-300">
                {activeCard.tag}
              </span>
              <span className="text-slate-500">Lecture {activeCard.lectureId}</span>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={handleFlip}
            data-testid="vault-flashcard"
            className="cursor-pointer group relative min-h-[260px] md:min-h-[300px] rounded-2xl border border-slate-800 bg-gray-900 p-6 md:p-8 flex flex-col justify-between shadow-2xl hover:border-cyan-500/50 transition-all select-none"
          >
            {/* Top row */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{isFlipped ? 'ANSWER / SPECIFICATION' : 'QUESTION (PROMPT)'}</span>
              <span className="flex items-center gap-1 text-slate-400 group-hover:text-cyan-400 transition-colors">
                <RotateCw className="h-3.5 w-3.5" />
                <span>Click or Space to Flip</span>
              </span>
            </div>

            {/* Main Content */}
            <div className="my-auto py-4">
              {!isFlipped ? (
                <div className="text-base md:text-lg font-bold text-slate-100 leading-snug">
                  {activeCard.front}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm md:text-base font-semibold text-emerald-300 leading-relaxed font-sans">
                    {activeCard.back}
                  </div>
                  {cardState && (
                    <div className="text-[11px] font-mono text-slate-500 border-t border-slate-800 pt-2 flex items-center justify-between">
                      <span>Reps: {cardState.repetitions}</span>
                      <span>Ease Factor: {cardState.easeFactor}</span>
                      <span>Current Interval: {formatInterval(cardState.interval)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom prompt */}
            <div className="text-[11px] font-mono text-slate-400 text-center">
              {isFlipped ? 'Grade recall difficulty below:' : 'Press [Space] to reveal answer'}
            </div>
          </div>

          {/* 4 SM-2 Grading Buttons (Visible when flipped) */}
          {isFlipped && (
            <div className="grid grid-cols-4 gap-2 pt-2">
              {/* Again */}
              <button
                onClick={() => handleRate('again')}
                data-testid="vault-rate-again"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 transition-all group"
              >
                <span className="text-xs font-bold group-hover:scale-105 transition-transform">
                  Again
                </span>
                <span className="font-mono text-[10px] text-rose-400/80 mt-0.5">
                  {intervalPreviews.again}
                </span>
                <span className="text-[9px] font-mono text-slate-500 mt-1">[1]</span>
              </button>

              {/* Hard */}
              <button
                onClick={() => handleRate('hard')}
                data-testid="vault-rate-hard"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 transition-all group"
              >
                <span className="text-xs font-bold group-hover:scale-105 transition-transform">
                  Hard
                </span>
                <span className="font-mono text-[10px] text-amber-400/80 mt-0.5">
                  {intervalPreviews.hard}
                </span>
                <span className="text-[9px] font-mono text-slate-500 mt-1">[2]</span>
              </button>

              {/* Good */}
              <button
                onClick={() => handleRate('good')}
                data-testid="vault-rate-good"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 transition-all group"
              >
                <span className="text-xs font-bold group-hover:scale-105 transition-transform">
                  Good
                </span>
                <span className="font-mono text-[10px] text-cyan-400/80 mt-0.5">
                  {intervalPreviews.good}
                </span>
                <span className="text-[9px] font-mono text-slate-500 mt-1">[3]</span>
              </button>

              {/* Easy */}
              <button
                onClick={() => handleRate('easy')}
                data-testid="vault-rate-easy"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 transition-all group"
              >
                <span className="text-xs font-bold group-hover:scale-105 transition-transform">
                  Easy
                </span>
                <span className="font-mono text-[10px] text-emerald-400/80 mt-0.5">
                  {intervalPreviews.easy}
                </span>
                <span className="text-[9px] font-mono text-slate-500 mt-1">[4]</span>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

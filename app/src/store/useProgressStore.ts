import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LectureProgress, SRSCardState, SRSRating } from '@/types/curriculum';
import { createInitialSRSState, rateCard } from '@/lib/srs';
import { soundEffects } from '@/lib/sound';

export interface ArchitectRank {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badge: string;
}

export const ARCHITECT_RANKS: ArchitectRank[] = [
  { level: 1, title: 'Packet Novice', minXp: 0, maxXp: 499, badge: 'L1' },
  { level: 2, title: 'Link Layer Technician', minXp: 500, maxXp: 1499, badge: 'L2' },
  { level: 3, title: 'Routing Specialist', minXp: 1500, maxXp: 2999, badge: 'L3' },
  { level: 4, title: 'Transport & Crypto Engineer', minXp: 3000, maxXp: 4999, badge: 'L4' },
  { level: 5, title: 'Principal Network Architect', minXp: 5000, maxXp: Infinity, badge: 'L5' },
];

export function getArchitectRank(xp: number): ArchitectRank {
  for (let i = ARCHITECT_RANKS.length - 1; i >= 0; i--) {
    if (xp >= ARCHITECT_RANKS[i].minXp) {
      return ARCHITECT_RANKS[i];
    }
  }
  return ARCHITECT_RANKS[0];
}

export interface ProgressState {
  xp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  audioMuted: boolean;
  lectureProgress: Record<number, LectureProgress>;
  srsState: Record<string, SRSCardState>;
  blitzHighScore: number;
  examHighScore: number;
  hasHydrated: boolean;

  // Actions
  setHasHydrated: (v: boolean) => void;
  toggleAudio: () => void;
  markBriefingRead: (lectureId: number) => void;
  markLabCompleted: (lectureId: number) => void;
  recordQuizScore: (
    lectureId: number,
    correctCount: number,
    totalCount: number,
    multiplier?: number,
  ) => void;
  reviewCard: (cardId: string, rating: SRSRating) => void;
  flagCardFromQuiz: (cardId: string) => void;
  recordBlitzScore: (correctAnswers: number, mode: 'arcade' | 'exam') => void;
  exportSaveJson: () => string;
  importSaveJson: (jsonStr: string) => boolean;
  resetProgress: () => void;
  syncToDisk: () => Promise<void>;
  hydrateFromDisk: () => Promise<void>;
}

function getInitialLectureProgress(): Record<number, LectureProgress> {
  const map: Record<number, LectureProgress> = {};
  for (let i = 1; i <= 14; i++) {
    map[i] = {
      briefingRead: false,
      labCompleted: false,
      bossDefeated: false,
      bestQuizScore: 0,
      quizAttempts: 0,
    };
  }
  return map;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
function scheduleDiskSync() {
  if (typeof window === 'undefined') return;
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    useProgressStore.getState().syncToDisk().catch(() => {});
  }, 1000);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streakDays: 1,
      lastActiveDate: getTodayString(),
      audioMuted: false,
      lectureProgress: getInitialLectureProgress(),
      srsState: {},
      blitzHighScore: 0,
      examHighScore: 0,
      hasHydrated: false,

      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),

      toggleAudio: () => {
        const next = !get().audioMuted;
        set({ audioMuted: next });
        if (!next) soundEffects.playClick(false);
      },

      markBriefingRead: (lectureId: number) => {
        const current = get().lectureProgress[lectureId];
        if (current?.briefingRead) return; // Idempotent

        const prevRank = getArchitectRank(get().xp);
        const newXp = get().xp + 50;
        const newRank = getArchitectRank(newXp);

        set((state) => ({
          xp: newXp,
          lectureProgress: {
            ...state.lectureProgress,
            [lectureId]: {
              ...(state.lectureProgress[lectureId] || {
                labCompleted: false,
                bossDefeated: false,
                bestQuizScore: 0,
                quizAttempts: 0,
              }),
              briefingRead: true,
            },
          },
        }));

        if (newRank.level > prevRank.level) {
          soundEffects.playLevelUp(get().audioMuted);
        } else {
          soundEffects.playSuccess(get().audioMuted);
        }
        scheduleDiskSync();
      },

      markLabCompleted: (lectureId: number) => {
        const current = get().lectureProgress[lectureId];
        const isFirst = !current?.labCompleted;
        const prevRank = getArchitectRank(get().xp);
        const newXp = isFirst ? get().xp + 150 : get().xp;
        const newRank = getArchitectRank(newXp);

        set((state) => ({
          xp: newXp,
          lectureProgress: {
            ...state.lectureProgress,
            [lectureId]: {
              ...(state.lectureProgress[lectureId] || {
                briefingRead: true,
                bossDefeated: false,
                bestQuizScore: 0,
                quizAttempts: 0,
              }),
              labCompleted: true,
            },
          },
        }));

        if (newRank.level > prevRank.level) {
          soundEffects.playLevelUp(get().audioMuted);
        } else {
          soundEffects.playSuccess(get().audioMuted);
        }
        scheduleDiskSync();
      },

      recordQuizScore: (
        lectureId: number,
        correctCount: number,
        totalCount: number,
        multiplier = 1,
      ) => {
        const pct = Math.round((correctCount / Math.max(1, totalCount)) * 100);
        const current = get().lectureProgress[lectureId] || {
          briefingRead: false,
          labCompleted: false,
          bossDefeated: false,
          bestQuizScore: 0,
          quizAttempts: 0,
        };

        const firstDefeat = pct >= 80 && !current.bossDefeated;
        const baseEarned = correctCount * 30 * Math.max(1, multiplier);
        const bonusEarned = firstDefeat ? 100 : 0;
        const earnedXp = Math.round(baseEarned + bonusEarned);

        const prevRank = getArchitectRank(get().xp);
        const newXp = get().xp + earnedXp;
        const newRank = getArchitectRank(newXp);

        set((state) => ({
          xp: newXp,
          lectureProgress: {
            ...state.lectureProgress,
            [lectureId]: {
              ...current,
              bossDefeated: current.bossDefeated || pct >= 80,
              bestQuizScore: Math.max(current.bestQuizScore, pct),
              quizAttempts: current.quizAttempts + 1,
            },
          },
        }));

        if (firstDefeat || newRank.level > prevRank.level) {
          soundEffects.playLevelUp(get().audioMuted);
        } else if (pct >= 60) {
          soundEffects.playSuccess(get().audioMuted);
        } else {
          soundEffects.playError(get().audioMuted);
        }
        scheduleDiskSync();
      },

      reviewCard: (cardId: string, rating: SRSRating) => {
        const existing = get().srsState[cardId] || createInitialSRSState(cardId);
        const updated = rateCard(existing, rating);
        const prevRank = getArchitectRank(get().xp);
        const newXp = get().xp + 10;
        const newRank = getArchitectRank(newXp);

        set((state) => ({
          xp: newXp,
          srsState: {
            ...state.srsState,
            [cardId]: updated,
          },
        }));

        if (newRank.level > prevRank.level) {
          soundEffects.playLevelUp(get().audioMuted);
        } else if (rating === 'again') {
          soundEffects.playError(get().audioMuted);
        } else {
          soundEffects.playSnap(get().audioMuted);
        }
        scheduleDiskSync();
      },

      flagCardFromQuiz: (cardId: string) => {
        const existing = get().srsState[cardId] || createInitialSRSState(cardId);
        set((state) => ({
          srsState: {
            ...state.srsState,
            [cardId]: {
              ...existing,
              flaggedFromQuiz: true,
              nextReviewAt: Date.now(), // Due immediately
            },
          },
        }));
        scheduleDiskSync();
      },

      recordBlitzScore: (correctAnswers: number, mode: 'arcade' | 'exam') => {
        const earnedXp = correctAnswers * 15;
        const prevRank = getArchitectRank(get().xp);
        const newXp = get().xp + earnedXp;
        const newRank = getArchitectRank(newXp);

        set((state) => ({
          xp: newXp,
          blitzHighScore:
            mode === 'arcade'
              ? Math.max(state.blitzHighScore, correctAnswers)
              : state.blitzHighScore,
          examHighScore:
            mode === 'exam'
              ? Math.max(state.examHighScore, correctAnswers)
              : state.examHighScore,
        }));

        if (newRank.level > prevRank.level) {
          soundEffects.playLevelUp(get().audioMuted);
        } else {
          soundEffects.playSuccess(get().audioMuted);
        }
        scheduleDiskSync();
      },

      exportSaveJson: () => {
        const s = get();
        const payload = {
          version: 1,
          exportedAt: new Date().toISOString(),
          xp: s.xp,
          streakDays: s.streakDays,
          lastActiveDate: s.lastActiveDate,
          lectureProgress: s.lectureProgress,
          srsState: s.srsState,
          blitzHighScore: s.blitzHighScore,
          examHighScore: s.examHighScore,
        };
        return JSON.stringify(payload, null, 2);
      },

      importSaveJson: (jsonStr: string) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (typeof parsed.xp !== 'number' || !parsed.lectureProgress) {
            return false;
          }
          set({
            xp: parsed.xp,
            streakDays: parsed.streakDays || 1,
            lastActiveDate: parsed.lastActiveDate || getTodayString(),
            lectureProgress: {
              ...getInitialLectureProgress(),
              ...parsed.lectureProgress,
            },
            srsState: parsed.srsState || {},
            blitzHighScore: parsed.blitzHighScore || 0,
            examHighScore: parsed.examHighScore || 0,
          });
          scheduleDiskSync();
          soundEffects.playLevelUp(get().audioMuted);
          return true;
        } catch {
          return false;
        }
      },

      resetProgress: () => {
        set({
          xp: 0,
          streakDays: 1,
          lastActiveDate: getTodayString(),
          lectureProgress: getInitialLectureProgress(),
          srsState: {},
          blitzHighScore: 0,
          examHighScore: 0,
        });
        scheduleDiskSync();
        soundEffects.playError(get().audioMuted);
      },

      syncToDisk: async () => {
        if (typeof window === 'undefined') return;
        try {
          const state = get();
          const snapshot = {
            xp: state.xp,
            streakDays: state.streakDays,
            lastActiveDate: state.lastActiveDate,
            lectureProgress: state.lectureProgress,
            srsState: state.srsState,
            blitzHighScore: state.blitzHighScore,
            examHighScore: state.examHighScore,
            updatedAt: new Date().toISOString(),
          };
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snapshot),
          });
        } catch {
          // Silent local failure fallback
        }
      },

      hydrateFromDisk: async () => {
        if (typeof window === 'undefined') return;
        try {
          const res = await fetch('/api/progress');
          if (!res.ok) return;
          const data = await res.json();
          // If client has 0 XP and disk has saved progress, hydrate from disk
          if (data && typeof data.xp === 'number' && get().xp === 0 && data.xp > 0) {
            set({
              xp: data.xp,
              streakDays: data.streakDays || 1,
              lastActiveDate: data.lastActiveDate || getTodayString(),
              lectureProgress: {
                ...getInitialLectureProgress(),
                ...data.lectureProgress,
              },
              srsState: data.srsState || {},
              blitzHighScore: data.blitzHighScore || 0,
              examHighScore: data.examHighScore || 0,
            });
          }
        } catch {}
      },
    }),
    {
      name: 'netquest-progress-v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

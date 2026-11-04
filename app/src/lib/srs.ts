import type { SRSCardState, SRSRating } from '@/types/curriculum';

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

export function createInitialSRSState(cardId: string, nowMs: number = Date.now()): SRSCardState {
  return {
    cardId,
    interval: 0,
    repetitions: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    nextReviewAt: nowMs,
    flaggedFromQuiz: false,
  };
}

export function isCardDue(state: SRSCardState, nowMs: number = Date.now()): boolean {
  return state.nextReviewAt <= nowMs;
}

export function rateCard(
  state: SRSCardState,
  rating: SRSRating,
  nowMs: number = Date.now(),
): SRSCardState {
  let { repetitions, easeFactor, interval } = state;

  switch (rating) {
    case 'again': {
      repetitions = 0;
      interval = 0;
      easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
      break;
    }
    case 'hard': {
      repetitions += 1;
      interval = interval === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
      easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.15);
      break;
    }
    case 'good': {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 3;
      } else {
        interval = Math.max(1, Math.round(interval * easeFactor));
      }
      repetitions += 1;
      break;
    }
    case 'easy': {
      if (repetitions === 0) {
        interval = 4;
      } else {
        interval = Math.max(1, Math.round(interval * easeFactor * 1.3));
      }
      repetitions += 1;
      easeFactor += 0.15;
      break;
    }
  }

  // If interval is 0, schedule in 1 minute so it reappears this study session
  const delayMs = interval === 0 ? 60 * 1000 : interval * DAY_MS;
  const nextReviewAt = nowMs + delayMs;

  return {
    ...state,
    repetitions,
    easeFactor: Number(easeFactor.toFixed(3)),
    interval,
    nextReviewAt,
    lastRating: rating,
    // Successfully answering 'good' or 'easy' unflags a quiz-missed card
    flaggedFromQuiz: rating === 'again' || rating === 'hard' ? state.flaggedFromQuiz : false,
  };
}

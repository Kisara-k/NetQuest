import { describe, expect, it } from 'vitest';
import { createInitialSRSState, isCardDue, rateCard } from '@/lib/srs';

describe('srs: SM-2 scheduling algorithm', () => {
  const baseTime = 1700000000000;

  it('creates default initial card state with interval 0 and easeFactor 2.5', () => {
    const s = createInitialSRSState('card-1', baseTime);
    expect(s.cardId).toBe('card-1');
    expect(s.interval).toBe(0);
    expect(s.repetitions).toBe(0);
    expect(s.easeFactor).toBe(2.5);
    expect(s.nextReviewAt).toBe(baseTime);
    expect(isCardDue(s, baseTime)).toBe(true);
  });

  it('rating good transitions: 0 -> 1 day (rep 1), then 1 -> 3 days (rep 2)', () => {
    const initial = createInitialSRSState('card-1', baseTime);
    const r1 = rateCard(initial, 'good', baseTime);
    expect(r1.interval).toBe(1);
    expect(r1.repetitions).toBe(1);
    expect(r1.easeFactor).toBe(2.5);
    expect(r1.nextReviewAt).toBe(baseTime + 24 * 60 * 60 * 1000);

    const r2 = rateCard(r1, 'good', r1.nextReviewAt);
    expect(r2.interval).toBe(3);
    expect(r2.repetitions).toBe(2);
    expect(r2.easeFactor).toBe(2.5);

    const r3 = rateCard(r2, 'good', r2.nextReviewAt);
    expect(r3.interval).toBe(Math.round(3 * 2.5)); // 8
    expect(r3.repetitions).toBe(3);
  });

  it('rating again resets repetitions and interval, reducing ease factor (min 1.3)', () => {
    let s = createInitialSRSState('card-1', baseTime);
    s = rateCard(s, 'good', baseTime);
    s = rateCard(s, 'good', s.nextReviewAt);
    expect(s.repetitions).toBe(2);

    const failed = rateCard(s, 'again', s.nextReviewAt);
    expect(failed.repetitions).toBe(0);
    expect(failed.interval).toBe(0);
    expect(failed.easeFactor).toBe(2.3);

    // Repeated failures clamp at 1.3
    let cur = failed;
    for (let i = 0; i < 10; i++) {
      cur = rateCard(cur, 'again', cur.nextReviewAt);
    }
    expect(cur.easeFactor).toBe(1.3);
  });

  it('rating easy applies bonus multiplier and increases ease factor', () => {
    const initial = createInitialSRSState('card-1', baseTime);
    const r1 = rateCard(initial, 'easy', baseTime);
    expect(r1.interval).toBe(4);
    expect(r1.repetitions).toBe(1);
    expect(r1.easeFactor).toBe(2.65);

    const r2 = rateCard(r1, 'easy', r1.nextReviewAt);
    expect(r2.interval).toBe(Math.round(4 * 2.65 * 1.3)); // 14
    expect(r2.repetitions).toBe(2);
    expect(r2.easeFactor).toBe(2.8);
  });

  it('rating hard increments repetitions with smaller interval growth and reduces ease factor', () => {
    const initial = createInitialSRSState('card-1', baseTime);
    const r1 = rateCard(initial, 'hard', baseTime);
    expect(r1.interval).toBe(1);
    expect(r1.repetitions).toBe(1);
    expect(r1.easeFactor).toBe(2.35);

    const r2 = rateCard(r1, 'hard', r1.nextReviewAt);
    expect(r2.interval).toBe(Math.round(1 * 1.2)); // 1
    expect(r2.repetitions).toBe(2);
    expect(r2.easeFactor).toBe(2.2);
  });
});

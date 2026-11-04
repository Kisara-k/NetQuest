import { describe, expect, it, beforeEach } from 'vitest';
import { useProgressStore, getArchitectRank } from '@/store/useProgressStore';

describe('useProgressStore: progression and persistence', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it('markBriefingRead(1) awards +50 XP once and is idempotent', () => {
    const store = useProgressStore.getState();
    expect(store.xp).toBe(0);

    store.markBriefingRead(1);
    expect(useProgressStore.getState().xp).toBe(50);
    expect(useProgressStore.getState().lectureProgress[1].briefingRead).toBe(true);

    // Idempotent: repeating doesn't award extra XP
    useProgressStore.getState().markBriefingRead(1);
    expect(useProgressStore.getState().xp).toBe(50);
  });

  it('markLabCompleted(1) awards +150 XP and sets labCompleted = true', () => {
    const store = useProgressStore.getState();
    store.markLabCompleted(1);
    expect(useProgressStore.getState().xp).toBe(150);
    expect(useProgressStore.getState().lectureProgress[1].labCompleted).toBe(true);

    // Repeat calls do not award duplicate lab completion XP
    useProgressStore.getState().markLabCompleted(1);
    expect(useProgressStore.getState().xp).toBe(150);
  });

  it('recordQuizScore(1, 5, 5) awards quiz XP + Boss Defeat bonus (+100 XP) and sets bossDefeated', () => {
    const store = useProgressStore.getState();
    // 5 correct * 30 XP = 150 XP base + 100 bonus (100% >= 80%) = 250 XP
    store.recordQuizScore(1, 5, 5);
    const state = useProgressStore.getState();
    expect(state.xp).toBe(250);
    expect(state.lectureProgress[1].bestQuizScore).toBe(100);
    expect(state.lectureProgress[1].bossDefeated).toBe(true);
    expect(state.lectureProgress[1].quizAttempts).toBe(1);
  });

  it('calculates architect ranks accurately as XP scales', () => {
    expect(getArchitectRank(0).title).toBe('Packet Novice');
    expect(getArchitectRank(499).title).toBe('Packet Novice');
    expect(getArchitectRank(500).title).toBe('Link Layer Technician');
    expect(getArchitectRank(1500).title).toBe('Routing Specialist');
    expect(getArchitectRank(3000).title).toBe('Transport & Crypto Engineer');
    expect(getArchitectRank(5000).title).toBe('Principal Network Architect');
    expect(getArchitectRank(10000).title).toBe('Principal Network Architect');
  });

  it('exportSaveJson and importSaveJson round-trip user progress accurately', () => {
    const store = useProgressStore.getState();
    store.markBriefingRead(1);
    store.markLabCompleted(1);
    store.recordQuizScore(1, 5, 5);
    store.reviewCard('l1-f1', 'good');

    const json = store.exportSaveJson();
    expect(typeof json).toBe('string');

    // Reset and confirm 0 XP
    store.resetProgress();
    expect(useProgressStore.getState().xp).toBe(0);

    // Restore
    const success = useProgressStore.getState().importSaveJson(json);
    expect(success).toBe(true);

    const restored = useProgressStore.getState();
    expect(restored.xp).toBe(50 + 150 + 250 + 10); // 460
    expect(restored.lectureProgress[1].briefingRead).toBe(true);
    expect(restored.lectureProgress[1].labCompleted).toBe(true);
    expect(restored.lectureProgress[1].bossDefeated).toBe(true);
    expect(restored.srsState['l1-f1']).toBeDefined();
  });
});

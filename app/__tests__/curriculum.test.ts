import { describe, expect, it } from 'vitest';
import {
  CURRICULUM_MODULES,
  SECTORS,
  getAllFlashcards,
  getAllQuizQuestions,
  getLectureById,
} from '@/data';

describe('curriculum: structure and completeness', () => {
  it('contains exactly 14 modules with sequential IDs 1..14', () => {
    expect(CURRICULUM_MODULES).toHaveLength(14);
    const ids = CURRICULUM_MODULES.map((m) => m.id);
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 1));
  });

  it('all 5 sectors are represented and match 14 lectures', () => {
    expect(SECTORS).toHaveLength(5);
    const sectorLectureCount = SECTORS.reduce((acc, s) => acc + s.lectureIds.length, 0);
    expect(sectorLectureCount).toBe(14);
  });

  it('every lecture meets minimum content counts and schema requirements', () => {
    for (const mod of CURRICULUM_MODULES) {
      // 1. Concepts: 4 to 6
      expect(mod.concepts.length).toBeGreaterThanOrEqual(4);
      for (const concept of mod.concepts) {
        expect(concept.id).toBeTruthy();
        expect(concept.title).toBeTruthy();
        expect(concept.summary.length).toBeGreaterThan(20);
        expect(concept.keyPoints.length).toBeGreaterThanOrEqual(3);
        expect(concept.examTip.length).toBeGreaterThan(10);
      }

      // 2. Flashcards: at least 6
      expect(mod.flashcards.length).toBeGreaterThanOrEqual(6);
      for (const card of mod.flashcards) {
        expect(card.id).toBeTruthy();
        expect(card.lectureId).toBe(mod.id);
        expect(card.front.length).toBeGreaterThan(5);
        expect(card.back.length).toBeGreaterThan(10);
        expect(card.tag).toBeTruthy();
      }

      // 3. Quiz questions: at least 5
      expect(mod.quiz.length).toBeGreaterThanOrEqual(5);
      for (const q of mod.quiz) {
        expect(q.id).toBeTruthy();
        expect(q.lectureId).toBe(mod.id);
        expect(q.question.length).toBeGreaterThan(10);
        expect(q.options).toHaveLength(4);
        expect([0, 1, 2, 3]).toContain(q.correctIndex);
        expect(q.explanation.length).toBeGreaterThan(10);
      }

      // 4. LabConfig defined with valid engine
      expect(mod.labConfig).toBeDefined();
      expect([
        'header-assembler',
        'sequence-simulator',
        'topology-lab',
        'matrix-arena',
      ]).toContain(mod.labConfig.engine);
    }
  });

  it('total flashcards and quiz questions reach expected curriculum counts', () => {
    const allCards = getAllFlashcards();
    const allQuiz = getAllQuizQuestions();
    expect(allCards.length).toBeGreaterThanOrEqual(84); // 14 * 6
    expect(allQuiz.length).toBeGreaterThanOrEqual(70); // 14 * 5
  });
});

describe('curriculum: domain accuracy spot checks from PRD & Lectures.json', () => {
  it('Lecture 2 includes 01111110 and window size 7 with 3-bit field', () => {
    const l2 = getLectureById(2)!;
    const allText = JSON.stringify(l2);
    expect(allText).toContain('01111110');
    expect(allText).toMatch(/window size.*7/i);
    expect(allText).toMatch(/3-bit/i);
  });

  it('Lecture 3 includes 53 bytes (5 header + 48 data) for ATM cells', () => {
    const l3 = getLectureById(3)!;
    const allText = JSON.stringify(l3);
    expect(allText).toContain('53');
    expect(allText).toMatch(/5.*header/i);
    expect(allText).toMatch(/48.*data/i);
  });

  it('Lecture 4 includes 1518 / 1522 bytes, 96 bit IFG, 512 bit slot time, 4096, and 0x8100', () => {
    const l4 = getLectureById(4)!;
    const allText = JSON.stringify(l4);
    expect(allText).toContain('1518');
    expect(allText).toContain('1522');
    expect(allText).toContain('96');
    expect(allText).toContain('512');
    expect(allText).toContain('4096');
    expect(allText).toContain('0x8100');
  });

  it('Lecture 7 includes 128 bits, FFFE and 7th bit for EUI-64, and ICMPv6 133 / 134', () => {
    const l7 = getLectureById(7)!;
    const allText = JSON.stringify(l7);
    expect(allText).toContain('128');
    expect(allText).toContain('FFFE');
    expect(allText).toMatch(/7th\s*bit/i);
    expect(allText).toContain('133');
    expect(allText).toContain('134');
  });

  it('Lecture 9 includes 65495 max TCP data bytes, 3-way handshake, and TCP FSM states', () => {
    const l9 = getLectureById(9)!;
    const allText = JSON.stringify(l9);
    expect(allText).toContain('65495');
    expect(allText).toMatch(/3-way handshake|three-way handshake/i);
    expect(allText).toContain('ESTABLISHED');
    expect(allText).toContain('FIN_WAIT_1');
  });

  it('Lecture 12 includes N(N-1)/2 symmetric keys and RA vs. CA distinction', () => {
    const l12 = getLectureById(12)!;
    const allText = JSON.stringify(l12);
    expect(allText).toContain('N(N-1)/2');
    expect(allText).toContain('RA');
    expect(allText).toContain('CA');
  });

  it('Lecture 13 includes IPsec 51 (AH) and 50 (ESP)', () => {
    const l13 = getLectureById(13)!;
    const allText = JSON.stringify(l13);
    expect(allText).toContain('51');
    expect(allText).toContain('50');
    expect(allText).toContain('AH');
    expect(allText).toContain('ESP');
  });
});

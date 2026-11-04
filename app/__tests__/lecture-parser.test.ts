import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  RAW_LECTURES,
  cleanLectureTitle,
  deduplicateSlideText,
  getNormalizedLecture,
  getNormalizedLectures,
  parseLectureSlides,
} from '@/lib/lecture-parser';

describe('lecture-parser: canonical Lectures.json', () => {
  it('loads exactly 14 lectures with indices 1..14', () => {
    expect(RAW_LECTURES).toHaveLength(14);
    expect(RAW_LECTURES.map((l) => l.index).sort((a, b) => a - b)).toEqual(
      Array.from({ length: 14 }, (_, i) => i + 1),
    );
    for (const l of RAW_LECTURES) {
      expect(typeof l.title).toBe('string');
      expect(l.content.length).toBeGreaterThan(1000);
    }
  });

  it('synced copy is byte-identical to the repository-root Lectures.json', () => {
    const rootPath = resolve(__dirname, '..', '..', 'Lectures.json');
    const syncedPath = resolve(__dirname, '..', 'src', 'data', 'Lectures.json');
    expect(readFileSync(syncedPath, 'utf8')).toBe(readFileSync(rootPath, 'utf8'));
  });

  it('cleans lecture titles (prefix + typo)', () => {
    expect(cleanLectureTitle('2 Data Link Layer')).toBe('Data Link Layer');
    expect(cleanLectureTitle('11 Introdutction to Network Security')).toBe(
      'Introduction to Network Security',
    );
  });
});

describe('lecture-parser: deduplicateSlideText', () => {
  it('collapses Lecture 4 shadow duplicates', () => {
    expect(
      deduplicateSlideText('Local Area Networks. Local Area Networks Shantha Fernando Shantha Fernando'),
    ).toBe('Local Area Networks. Shantha Fernando');
  });

  it('collapses Lecture 11 interleaved duplicates', () => {
    expect(deduplicateSlideText('Computer, Network and Web Computer, Network and Web Security Security')).toBe(
      'Computer, Network and Web Security',
    );
  });

  it('collapses Lecture 14 duplicates', () => {
    expect(
      deduplicateSlideText('Design considerations Design considerations Business needs Business needs'),
    ).toBe('Design considerations Business needs');
  });

  it('collapses wrapped sentence duplicates', () => {
    expect(
      deduplicateSlideText(
        'When a signal is being transmitted on the channel that When a signal is being transmitted on the channel that is busy',
      ),
    ).toBe('When a signal is being transmitted on the channel that is busy');
  });

  it('preserves numeric / bit patterns and unique text', () => {
    expect(deduplicateSlideText('Preamble 1010 1010 then 0 1 0 1')).toBe('Preamble 1010 1010 then 0 1 0 1');
    const unique = 'The OSI Reference Model was developed by ISO in 1974.';
    expect(deduplicateSlideText(unique)).toBe(unique);
  });

  it('preserves key technical facts in the cleaned Lecture 4 text', () => {
    const l4 = getNormalizedLecture(4)!;
    for (const fact of ['1518', '1522', '0x8100', '512 bit', '4096 bit']) {
      expect(l4.rawContent.toLowerCase()).toContain(fact.toLowerCase());
      expect(l4.cleanedContent.toLowerCase()).toContain(fact.toLowerCase());
    }
    expect(l4.cleanedContent.length).toBeLessThan(l4.rawContent.length * 0.75);
    expect(l4.cleanedContent).not.toContain('Shantha Fernando Shantha Fernando');
  });

  it('reduces duplication in Lectures 11 and 14', () => {
    for (const id of [11, 14]) {
      const l = getNormalizedLecture(id)!;
      expect(l.cleanedContent.length).toBeLessThan(l.rawContent.length * 0.85);
    }
  });
});

describe('lecture-parser: parseLectureSlides', () => {
  it('produces non-empty slide blocks for all 14 lectures', () => {
    const all = getNormalizedLectures();
    expect(all).toHaveLength(14);
    for (const lecture of all) {
      expect(lecture.slideBlocks.length).toBeGreaterThan(0);
      for (const block of lecture.slideBlocks) {
        expect(block.bullets.length).toBeGreaterThan(0);
        expect(block.bullets.length).toBeLessThanOrEqual(5);
      }
    }
  });

  it('splits on slide bullet glyphs', () => {
    const blocks = parseLectureSlides('Intro \uF06EFirst point \uF0A2Second point \u2022Third point');
    expect(blocks[0].bullets).toEqual(['Intro', 'First point', 'Second point', 'Third point']);
  });
});

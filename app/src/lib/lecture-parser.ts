/**
 * Lectures.json ingestion & normalisation pipeline.
 *
 * - Reads the canonical repository-root Lectures.json (via the build-time
 *   synced copy at src/data/Lectures.json, see scripts/sync-lectures.mjs).
 * - Collapses slide-extraction phrase duplications (dual text boxes / drop
 *   shadows, most visible in Lectures 4, 11 and 14) while preserving every
 *   unique sentence, number and technical term.
 * - Splits the slide bullet glyphs (, , , , , •) into readable blocks
 *   for the Source Slide Inspector and search.
 */
import lecturesJson from '@/data/Lectures.json';
import type { NormalizedLecture, NormalizedSlideBlock, RawLecture } from '@/types/curriculum';

export const RAW_LECTURES: RawLecture[] = lecturesJson as RawLecture[];

/** Private-use slide bullet glyphs emitted by the PDF extractor, plus the standard bullet. */
export const SLIDE_BULLET_CHARS = ['\uF06E', '\uF0A2', '\uF06C', '\uE00A', '\uF070', '\u2022'] as const;
const BULLET_SPLIT_RE = /[\uF06E\uF0A2\uF06C\uE00A\uF070\u2022]/g;

const MAX_PHRASE_TOKENS = 24;

/** Comparison key for a token: case-insensitive and ignoring punctuation / bullet glyphs. */
function tokenKey(token: string): string {
  const k = token.toLowerCase().replace(/[^a-z0-9µ]/g, '');
  return k.length > 0 ? k : token;
}

function hasLetter(key: string): boolean {
  return /[a-zµ]/.test(key);
}

/**
 * A run of L tokens may only be collapsed if it carries real words. This
 * protects legitimate repeated numeric / bit patterns (e.g. "1010 1010",
 * "0 1 0 1") from being removed.
 */
function isEligibleRun(keys: string[], start: number, len: number): boolean {
  if (len === 1) {
    const k = keys[start];
    return k.length >= 3 && hasLetter(k);
  }
  let letters = false;
  let chars = 0;
  for (let i = start; i < start + len; i++) {
    if (hasLetter(keys[i])) letters = true;
    chars += keys[i].length;
  }
  return letters && chars >= 4;
}

function runsEqual(keys: string[], a: number, b: number, len: number): boolean {
  for (let i = 0; i < len; i++) {
    if (keys[a + i] !== keys[b + i]) return false;
  }
  return true;
}

/**
 * Cleans slide-extraction phrase duplications (present in Lectures 4, 11, 14),
 * e.g. "Local Area Networks. Local Area Networks Shantha Fernando Shantha Fernando"
 *   -> "Local Area Networks. Shantha Fernando".
 *
 * Deterministic token-level algorithm: scanning left-to-right, at each position
 * the longest immediately-repeated phrase (up to 24 tokens, compared
 * case-insensitively and ignoring punctuation) is collapsed to its first copy.
 * The scan stays at the same position after a collapse so triple repeats and
 * nested repeats ("A B A B C C") are fully resolved.
 */
export function deduplicateSlideText(raw: string): string {
  const text = raw.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  const tokens = text.split(' ');
  const keys = tokens.map(tokenKey);

  let i = 0;
  while (i < tokens.length) {
    let collapsed = false;
    const maxLen = Math.min(MAX_PHRASE_TOKENS, Math.floor((tokens.length - i) / 2));
    for (let len = maxLen; len >= 1; len--) {
      if (isEligibleRun(keys, i, len) && runsEqual(keys, i, i + len, len)) {
        tokens.splice(i + len, len);
        keys.splice(i + len, len);
        collapsed = true;
        break;
      }
    }
    if (!collapsed) i++;
  }
  return tokens.join(' ');
}

/** Removes the leading numeric prefix and fixes known typos in raw lecture titles. */
export function cleanLectureTitle(rawTitle: string): string {
  return rawTitle
    .replace(/^\s*\d+\s+/, '')
    .replace(/Introdutction/gi, 'Introduction')
    .trim();
}

const MAX_SEGMENT_CHARS = 420;

/**
 * Some slides (notably Lecture 4) have few bullet glyphs, producing very long
 * segments. Split those at sentence-ish boundaries so blocks stay scannable.
 * No text is dropped: the chunks concatenate back to the original segment.
 */
function splitLongSegment(segment: string): string[] {
  if (segment.length <= MAX_SEGMENT_CHARS) return [segment];
  const chunks: string[] = [];
  let rest = segment;
  while (rest.length > MAX_SEGMENT_CHARS) {
    const window = rest.slice(0, MAX_SEGMENT_CHARS);
    let cut = Math.max(window.lastIndexOf('. '), window.lastIndexOf('? '), window.lastIndexOf(': '));
    if (cut < MAX_SEGMENT_CHARS * 0.4) cut = window.lastIndexOf(' ');
    if (cut <= 0) cut = MAX_SEGMENT_CHARS - 1;
    chunks.push(rest.slice(0, cut + 1).trim());
    rest = rest.slice(cut + 1).trim();
  }
  if (rest) chunks.push(rest);
  return chunks;
}

export function parseLectureSlides(rawContent: string): NormalizedSlideBlock[] {
  const cleaned = deduplicateSlideText(rawContent);
  const segments = cleaned
    .split(BULLET_SPLIT_RE)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 0 && /[A-Za-z0-9]/.test(s))
    .flatMap(splitLongSegment);

  // Group into digestible blocks of up to 5 bullets for the Source Slide Inspector
  const blocks: NormalizedSlideBlock[] = [];
  for (let i = 0; i < segments.length; i += 5) {
    blocks.push({
      id: `slide-block-${Math.floor(i / 5) + 1}`,
      heading: i === 0 ? 'Title & Overview' : undefined,
      bullets: segments.slice(i, i + 5),
    });
  }
  return blocks;
}

let cache: NormalizedLecture[] | null = null;

export function normalizeLecture(raw: RawLecture): NormalizedLecture {
  return {
    index: raw.index,
    title: cleanLectureTitle(raw.title),
    rawTitle: raw.title,
    rawContent: raw.content,
    cleanedContent: deduplicateSlideText(raw.content),
    slideBlocks: parseLectureSlides(raw.content),
  };
}

/** All 14 lectures, normalised and sorted by index (memoised). */
export function getNormalizedLectures(): NormalizedLecture[] {
  if (!cache) {
    cache = [...RAW_LECTURES].sort((a, b) => a.index - b.index).map(normalizeLecture);
  }
  return cache;
}

export function getNormalizedLecture(index: number): NormalizedLecture | undefined {
  return getNormalizedLectures().find((l) => l.index === index);
}

/** Splits raw (un-cleaned) content into bullet blocks for the "raw" inspector view. */
export function parseRawSlides(rawContent: string): NormalizedSlideBlock[] {
  const segments = rawContent
    .replace(/\s+/g, ' ')
    .split(BULLET_SPLIT_RE)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /[A-Za-z0-9]/.test(s));
  const blocks: NormalizedSlideBlock[] = [];
  for (let i = 0; i < segments.length; i += 5) {
    blocks.push({ id: `raw-block-${Math.floor(i / 5) + 1}`, bullets: segments.slice(i, i + 5) });
  }
  return blocks;
}

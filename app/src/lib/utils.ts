import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge conditional Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Deterministic Fisher–Yates shuffle using a seeded PRNG (mulberry32). */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const arr = [...items];
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Stable numeric hash for strings (used to seed shuffles). */
export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function formatInterval(days: number): string {
  if (days <= 0) return '<1m';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.round(days / 30)} mo`;
  return `${(days / 365).toFixed(1)} yr`;
}

export const OSI_LAYER_META: Record<number, { name: string; short: string; color: string }> = {
  7: { name: 'Application', short: 'L7', color: '#A855F7' },
  6: { name: 'Presentation', short: 'L6', color: '#8B5CF6' },
  5: { name: 'Session', short: 'L5', color: '#6366F1' },
  4: { name: 'Transport', short: 'L4', color: '#3B82F6' },
  3: { name: 'Network', short: 'L3', color: '#10B981' },
  2: { name: 'Data Link', short: 'L2', color: '#F59E0B' },
  1: { name: 'Physical', short: 'L1', color: '#F43F5E' },
};

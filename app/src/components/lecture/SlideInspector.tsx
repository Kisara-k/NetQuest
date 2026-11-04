'use client';

import { useState, useMemo } from 'react';
import type { NormalizedLecture } from '@/types/curriculum';
import { parseRawSlides } from '@/lib/lecture-parser';
import { Search, FileText, Sparkles, Filter } from 'lucide-react';

interface SlideInspectorProps {
  normalizedLecture: NormalizedLecture;
}

export function SlideInspector({ normalizedLecture }: SlideInspectorProps) {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cleaned' | 'raw'>('cleaned');

  // Slide blocks based on mode
  const rawBlocks = useMemo(
    () => parseRawSlides(normalizedLecture.rawContent),
    [normalizedLecture.rawContent],
  );

  const activeBlocks = viewMode === 'cleaned' ? normalizedLecture.slideBlocks : rawBlocks;

  // Filtered blocks based on query
  const filteredBlocks = useMemo(() => {
    if (!query.trim()) return activeBlocks;
    const q = query.toLowerCase();
    return activeBlocks
      .map((block) => ({
        ...block,
        bullets: block.bullets.filter((b) => b.toLowerCase().includes(q)),
      }))
      .filter((block) => block.bullets.length > 0);
  }, [activeBlocks, query]);

  const highlightMatches = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-cyan-500/30 text-cyan-200 rounded px-1 font-semibold">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const compressionRatio = Math.round(
    ((normalizedLecture.rawContent.length - normalizedLecture.cleanedContent.length) /
      normalizedLecture.rawContent.length) *
      100,
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-xs font-mono font-bold text-indigo-400">
                SOURCE SLIDE INSPECTOR
              </span>
              <span className="text-xs text-slate-400">
                Ingested from <code className="text-slate-300">Lectures.json</code>
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100">
              Cleaned Slide Extraction Explorer
            </h3>
            <p className="text-xs text-slate-400">
              {compressionRatio > 5 ? (
                <span>
                  Deterministic normalizer collapsed{' '}
                  <span className="text-emerald-400 font-mono font-bold">{compressionRatio}%</span> of duplicate
                  presentation shadow strings.
                </span>
              ) : (
                'Original source slides parsed and segmented into readable bullet streams.'
              )}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              onClick={() => setViewMode('cleaned')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === 'cleaned'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cleaned Slides</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === 'raw'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Raw Slide Dumps</span>
            </button>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="slide-search-input"
            placeholder="Search keywords in lecture slides (e.g., CRC, 1518, 0x8100, SYN, ATM 53B, EUI-64)..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
          />
          {query && (
            <div className="absolute right-3 top-2 text-[11px] font-mono text-cyan-400">
              {filteredBlocks.reduce((acc, b) => acc + b.bullets.length, 0)} bullets match
            </div>
          )}
        </div>
      </div>

      {/* Slide Blocks Stream */}
      <div className="space-y-4">
        {filteredBlocks.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-xs">
            <Filter className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            No slide points found matching &ldquo;{query}&rdquo;. Try another term.
          </div>
        ) : (
          filteredBlocks.map((block, idx) => (
            <div
              key={block.id || idx}
              className="rounded-xl border border-slate-800/80 bg-gray-900/70 p-4 md:p-5 transition-colors"
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/60 text-[11px] font-mono text-slate-400">
                <span className="font-semibold text-cyan-400">SLIDE SEGMENT #{idx + 1}</span>
                <span>{block.bullets.length} bullets</span>
              </div>
              <ul className="space-y-2">
                {block.bullets.map((bullet, bIdx) => (
                  <li
                    key={bIdx}
                    className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed font-sans"
                  >
                    <span className="text-cyan-400 text-xs mt-0.5">•</span>
                    <span>{highlightMatches(bullet, query)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

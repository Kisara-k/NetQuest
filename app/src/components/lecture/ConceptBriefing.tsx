'use client';

import type { LectureModule } from '@/types/curriculum';
import { useProgressStore } from '@/store/useProgressStore';
import { OSI_LAYER_META } from '@/lib/utils';
import { BookOpen, CheckCircle2, ArrowRight, Lightbulb, Binary, Table } from 'lucide-react';

interface ConceptBriefingProps {
  lecture: LectureModule;
  onLaunchLab: () => void;
}

export function ConceptBriefing({ lecture, onLaunchLab }: ConceptBriefingProps) {
  const { lectureProgress, markBriefingRead } = useProgressStore();
  const progress = lectureProgress[lecture.id];
  const isRead = progress?.briefingRead;

  const handleCompleteBriefing = () => {
    markBriefingRead(lecture.id);
    onLaunchLab();
  };

  return (
    <div className="space-y-8">
      {/* Intro Hero Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400">
                STAGE 1 · UNDERSTAND
              </span>
              <span className="text-xs text-slate-400">
                {lecture.concepts.length} Core Concept Mental Models
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">{lecture.title}</h2>
            <p className="text-xs text-slate-400">{lecture.tagline}</p>
          </div>

          <button
            onClick={handleCompleteBriefing}
            data-testid="btn-complete-briefing"
            className="flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition-all shrink-0"
          >
            {isRead ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>Briefing Read · Launch Lab</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                <span>Mark Read (+50 XP) & Launch Lab</span>
              </>
            )}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Concept Cards Stack */}
      <div className="space-y-6">
        {lecture.concepts.map((concept, idx) => {
          const layerMeta = concept.layer ? OSI_LAYER_META[concept.layer] : undefined;

          return (
            <article
              key={concept.id}
              className="rounded-xl border border-slate-800/80 bg-gray-900/90 p-5 md:p-6 shadow-lg transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-xs font-mono font-bold text-cyan-400 border border-slate-700/80">
                    {idx + 1}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-slate-100">
                    {concept.title}
                  </h3>
                </div>

                {layerMeta && (
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700/80 bg-slate-950 text-slate-300"
                    style={{ borderLeftColor: layerMeta.color, borderLeftWidth: '3px' }}
                  >
                    {layerMeta.short} {layerMeta.name}
                  </span>
                )}
              </div>

              {/* Summary */}
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
                {concept.summary}
              </p>

              {/* Formula or Spec Callout */}
              {concept.formulaOrSpec && (
                <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-950/20 px-3.5 py-2 font-mono-numbers text-xs text-cyan-300">
                  <Binary className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span className="font-semibold text-cyan-200">SPEC / FORMULA:</span>
                  <span className="font-mono text-cyan-300">{concept.formulaOrSpec}</span>
                </div>
              )}

              {/* Key Bullet Points */}
              <div className="space-y-1.5 mb-4 rounded-lg bg-slate-950/60 p-3.5 border border-slate-800/60">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                  Key Technical Specifications
                </div>
                <ul className="space-y-1.5">
                  {concept.keyPoints.map((point, pIdx) => (
                    <li
                      key={pIdx}
                      className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                    >
                      <span className="text-cyan-400 text-xs mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comparison Table if present */}
              {concept.comparisonTable && (
                <div className="mb-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-300">
                    <Table className="h-3.5 w-3.5 text-cyan-400" /> Comparison Matrix
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800/80 bg-slate-900/40 text-slate-400 font-mono">
                        {concept.comparisonTable.headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-3 py-2 font-semibold text-slate-300">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {concept.comparisonTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-3 py-2 text-slate-300 ${
                                cIdx === 0 ? 'font-medium text-slate-200' : ''
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mental Model / Exam Tip Callout */}
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-xs text-amber-200/90 leading-relaxed">
                <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 mr-1.5">Architect Mental Model:</span>
                  <span>{concept.examTip}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom CTA to launch lab */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center space-y-3">
        <h4 className="text-base font-bold text-slate-100">Ready for Hands-On Protocol Engineering?</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Verify your mental model by completing the interactive simulation engine for this lecture.
        </p>
        <button
          onClick={handleCompleteBriefing}
          data-testid="btn-complete-briefing"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition-all"
        >
          <BookOpen className="h-4 w-4" />
          <span>Launch Interactive Protocol Lab (+150 XP)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

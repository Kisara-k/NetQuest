'use client';

import Link from 'next/link';
import { useProgressStore, getArchitectRank } from '@/store/useProgressStore';
import { SECTORS, CURRICULUM_MODULES, getAllFlashcards } from '@/data';
import { isCardDue } from '@/lib/srs';
import { OSI_LAYER_META } from '@/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  BookOpen,
  Terminal,
  Trophy,
} from 'lucide-react';

export default function CampaignPage() {
  const { xp, lectureProgress, srsState } = useProgressStore();
  const rank = getArchitectRank(xp);

  // Compute stats
  const masteredCount = Object.values(lectureProgress).filter(
    (lp) => lp.bossDefeated && lp.labCompleted && lp.briefingRead,
  ).length;

  const allCards = getAllFlashcards();
  const dueCardsCount = allCards.filter((c) => {
    const s = srsState[c.id];
    return !s || isCardDue(s);
  }).length;

  return (
    <div className="space-y-10">
      {/* Hero Architect Status Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-gray-950 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Campaign Command Center · CS303 Networks
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Welcome, Architect. Level {rank.level}:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                {rank.title}
              </span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Master all 14 university networking lectures through hands-on protocol header engineering,
              sliding-window simulations, active recall boss battles, and spaced repetition.
            </p>
          </div>

          {/* Quick Stat Tiles */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center min-w-[90px]">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total XP</div>
              <div className="text-lg md:text-xl font-bold font-mono text-cyan-400">{xp}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center min-w-[90px]">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Mastered</div>
              <div className="text-lg md:text-xl font-bold font-mono text-emerald-400">
                {masteredCount} / 14
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center min-w-[90px]">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Due Cards</div>
              <div className="text-lg md:text-xl font-bold font-mono text-amber-400">{dueCardsCount}</div>
            </div>
          </div>
        </div>

        {/* Quick Launch Action Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-3">
          <Link
            href="/vault"
            className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-3.5 py-2 text-xs font-semibold text-cyan-300 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Review Memory Vault ({dueCardsCount} due)</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
          <Link
            href="/sandbox"
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Global 7-Layer Packet Journey</span>
          </Link>
          <Link
            href="/blitz"
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Launch Exam Blitz Arcade</span>
          </Link>
        </div>
      </section>

      {/* 5 Network Operations Sectors */}
      <div className="space-y-12">
        {SECTORS.map((sector) => {
          const lecturesInSector = CURRICULUM_MODULES.filter(
            (m) => m.sectorId === sector.id,
          );

          return (
            <section
              key={sector.id}
              data-testid={`sector-section-${sector.id}`}
              className="space-y-4"
            >
              {/* Sector Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: sector.accent }}
                  />
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
                      {sector.name}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                        {sector.codename}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">{sector.description}</p>
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {lecturesInSector.length} Missions
                </div>
              </div>

              {/* Lecture Mission Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {lecturesInSector.map((lecture) => {
                  const progress = lectureProgress[lecture.id] || {
                    briefingRead: false,
                    labCompleted: false,
                    bossDefeated: false,
                    bestQuizScore: 0,
                    quizAttempts: 0,
                  };

                  return (
                    <Link
                      key={lecture.id}
                      href={`/lecture/${lecture.id}`}
                      data-testid={`lecture-card-${lecture.id}`}
                      className="group relative flex flex-col justify-between rounded-xl border border-slate-800/80 bg-gray-900/90 p-5 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-200 shadow-md hover:shadow-cyan-500/5"
                    >
                      <div className="space-y-3">
                        {/* Top meta row */}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400">
                            MISSION {String(lecture.id).padStart(2, '0')}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                            <Clock className="h-3 w-3" />
                            <span>{lecture.estimatedMinutes}m</span>
                          </div>
                        </div>

                        {/* Title and tagline */}
                        <div>
                          <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {lecture.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                            {lecture.tagline}
                          </p>
                        </div>

                        {/* OSI Layers badges */}
                        <div className="flex flex-wrap gap-1">
                          {lecture.osiLayers.map((layerNum) => {
                            const meta = OSI_LAYER_META[layerNum];
                            return (
                              <span
                                key={layerNum}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700/60 bg-slate-950 text-slate-300"
                                style={{ borderLeftColor: meta?.color, borderLeftWidth: '3px' }}
                              >
                                {meta?.short} {meta?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom status milestones */}
                      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {/* Briefing milestone */}
                          <div
                            title={progress.briefingRead ? 'Briefing Completed' : 'Briefing Pending'}
                            className={`flex items-center gap-1 text-[11px] font-medium ${
                              progress.briefingRead ? 'text-emerald-400' : 'text-slate-400'
                            }`}
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Briefing</span>
                          </div>

                          {/* Lab milestone */}
                          <div
                            title={progress.labCompleted ? 'Protocol Lab Passed' : 'Lab Incomplete'}
                            className={`flex items-center gap-1 text-[11px] font-medium ${
                              progress.labCompleted ? 'text-emerald-400' : 'text-slate-400'
                            }`}
                          >
                            <Terminal className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Lab</span>
                          </div>

                          {/* Boss milestone */}
                          <div
                            title={progress.bossDefeated ? `Boss Defeated (${progress.bestQuizScore}%)` : 'Boss Undefeated'}
                            className={`flex items-center gap-1 text-[11px] font-medium ${
                              progress.bossDefeated ? 'text-amber-400 font-bold' : 'text-slate-400'
                            }`}
                          >
                            <Trophy className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Boss</span>
                            {progress.bestQuizScore > 0 && (
                              <span className="font-mono text-[10px]">({progress.bestQuizScore}%)</span>
                            )}
                          </div>
                        </div>

                        <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-xs">
                          Launch <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

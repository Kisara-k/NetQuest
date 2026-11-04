'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLectureById, CURRICULUM_MODULES } from '@/data';
import { getNormalizedLecture } from '@/lib/lecture-parser';
import { useProgressStore } from '@/store/useProgressStore';
import { OSI_LAYER_META } from '@/lib/utils';
import { ConceptBriefing } from '@/components/lecture/ConceptBriefing';
import { SlideInspector } from '@/components/lecture/SlideInspector';
import { LabDispatcher } from '@/components/engines/LabDispatcher';
import { BossQuiz } from '@/components/lecture/BossQuiz';
import {
  BookOpen,
  Terminal,
  Trophy,
  FileText,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface LecturePageProps {
  params: Promise<{ id: string }>;
}

export default function LecturePage({ params }: LecturePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const lectureId = parseInt(resolvedParams.id, 10);

  const initialTab =
    (searchParams?.get('tab') as 'briefing' | 'lab' | 'quiz' | 'slides') ||
    'briefing';
  const [activeTab, setActiveTab] = useState<'briefing' | 'lab' | 'quiz' | 'slides'>(
    initialTab,
  );

  const lecture = getLectureById(lectureId);
  const normalizedLecture = getNormalizedLecture(lectureId);
  const { lectureProgress } = useProgressStore();
  const progress = lectureProgress[lectureId];

  if (!lecture || !normalizedLecture) {
    return (
      <div className="rounded-xl border border-rose-800 bg-rose-950/20 p-8 text-center text-rose-300">
        <h2 className="text-lg font-bold">Lecture #{resolvedParams.id} Not Found</h2>
        <p className="text-xs text-rose-400 mt-1">Please select a valid mission from the campaign map.</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Campaign Map
        </Link>
      </div>
    );
  }

  const prevId = lectureId > 1 ? lectureId - 1 : null;
  const nextId = lectureId < 14 ? lectureId + 1 : null;

  return (
    <div className="space-y-6 max-w-full min-w-0">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Campaign Map</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>/</span>
            <span className="text-cyan-400 font-bold">MISSION {String(lecture.id).padStart(2, '0')}</span>
            <span>/</span>
            <span className="truncate max-w-[200px] text-slate-300">{lecture.shortTitle}</span>
          </div>
        </div>

        {/* Previous / Next Lecture Navigation */}
        <div className="flex items-center gap-2">
          {prevId ? (
            <Link
              href={`/lecture/${prevId}`}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Prev
            </Link>
          ) : null}
          {nextId ? (
            <Link
              href={`/lecture/${nextId}`}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Next <ArrowRight className="h-3 w-3" />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Mission Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-gray-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400">
                {lecture.sectorName}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <Clock className="h-3 w-3" />
                <span>{lecture.estimatedMinutes} mins</span>
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">
              {lecture.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-3xl">
              {lecture.tagline}
            </p>
            {/* OSI Layers */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {lecture.osiLayers.map((lNum) => {
                const meta = OSI_LAYER_META[lNum];
                return (
                  <span
                    key={lNum}
                    className="text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700/80 bg-slate-950 text-slate-300"
                    style={{ borderLeftColor: meta?.color, borderLeftWidth: '3px' }}
                  >
                    {meta?.short} {meta?.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Quick Progress Indicator */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs font-mono min-w-[170px]">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Mission Milestones
            </div>
            <div className="flex items-center gap-2">
              <span className={progress?.briefingRead ? 'text-emerald-400' : 'text-slate-400'}>
                {progress?.briefingRead ? '✓' : '○'} Briefing Read
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={progress?.labCompleted ? 'text-emerald-400' : 'text-slate-400'}>
                {progress?.labCompleted ? '✓' : '○'} Protocol Lab Passed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={progress?.bossDefeated ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                {progress?.bossDefeated ? '✓' : '○'} Boss Defeated{' '}
                {progress?.bestQuizScore ? `(${progress.bestQuizScore}%)` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive Mission Tabs */}
      <div className="w-full max-w-full min-w-0 flex items-center gap-2 border-b border-slate-800/80 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveTab('briefing')}
          data-testid="tab-briefing"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'briefing'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Stage 1: Concept Briefing</span>
          {progress?.briefingRead && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 ml-1" />}
        </button>

        <button
          onClick={() => setActiveTab('lab')}
          data-testid="tab-lab"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'lab'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>Stage 2: Protocol Lab</span>
          {progress?.labCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 ml-1" />}
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          data-testid="tab-quiz"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'quiz'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Trophy className="h-4 w-4" />
          <span>Stage 3: Boss Battle Quiz</span>
          {progress?.bossDefeated && <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 ml-1" />}
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          data-testid="tab-slides"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'slides'
              ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Source Slides (Lectures.json)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'briefing' && (
          <ConceptBriefing
            lecture={lecture}
            onLaunchLab={() => setActiveTab('lab')}
          />
        )}

        {activeTab === 'lab' && (
          <LabDispatcher
            lecture={lecture}
            onComplete={() => setActiveTab('quiz')}
          />
        )}

        {activeTab === 'quiz' && (
          <BossQuiz
            questions={lecture.quiz}
            lectureId={lecture.id}
            lectureTitle={lecture.title}
            onReviewVault={() => router.push('/vault')}
            onNextLecture={nextId ? () => router.push(`/lecture/${nextId}?tab=briefing`) : undefined}
          />
        )}

        {activeTab === 'slides' && (
          <SlideInspector normalizedLecture={normalizedLecture} />
        )}
      </div>
    </div>
  );
}

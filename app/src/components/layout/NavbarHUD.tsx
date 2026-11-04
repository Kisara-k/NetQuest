'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useProgressStore,
  getArchitectRank,
  ARCHITECT_RANKS,
} from '@/store/useProgressStore';
import { getAllFlashcards } from '@/data';
import { isCardDue } from '@/lib/srs';
import { SaveDataModal } from './SaveDataModal';
import {
  Network,
  Layers,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Database,
  Flame,
  Award,
} from 'lucide-react';

export function NavbarHUD() {
  const pathname = usePathname();
  const { xp, streakDays, audioMuted, toggleAudio, srsState, hydrateFromDisk } =
    useProgressStore();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    hydrateFromDisk();
  }, [hydrateFromDisk]);

  const rank = getArchitectRank(xp);
  const nextRank = ARCHITECT_RANKS.find((r) => r.level === rank.level + 1);
  const rankProgressPct = nextRank
    ? Math.min(
        100,
        Math.round(((xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100),
      )
    : 100;

  // Compute due flashcards
  const allCards = getAllFlashcards();
  const dueCardsCount = mounted
    ? allCards.filter((c) => {
        const state = srsState[c.id];
        return !state || isCardDue(state);
      }).length
    : 0;

  const navLinks = [
    { href: '/', label: 'Campaign Map', testId: 'nav-campaign', icon: Network },
    {
      href: '/sandbox',
      label: 'Packet Sandbox',
      testId: 'nav-sandbox',
      icon: Layers,
    },
    {
      href: '/vault',
      label: 'Memory Vault',
      testId: 'nav-vault',
      icon: Sparkles,
      badge: dueCardsCount > 0 ? dueCardsCount : undefined,
    },
    { href: '/blitz', label: 'Exam Blitz', testId: 'nav-blitz', icon: Zap },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Network className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-100 flex items-center gap-1">
                  NETQUEST <span className="text-cyan-400 font-mono text-[10px] sm:text-xs font-semibold px-1 py-0.2 rounded bg-cyan-950 border border-cyan-800/60 hidden xs:inline">ARCHITECT</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest hidden sm:inline">
                  Protocol Mastery Suite
                </span>
              </div>
            </Link>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-testid={link.testId}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span className="ml-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] px-1.5 py-0.2 border border-cyan-500/30">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Progress Stats HUD */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Rank and XP */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2 sm:px-3 py-1 sm:py-1.5">
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/40 text-indigo-300 text-[10px] sm:text-xs font-bold font-mono shrink-0">
                {rank.badge}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    data-testid="hud-rank"
                    className="text-xs font-bold text-slate-200 hidden sm:inline"
                  >
                    {rank.title}
                  </span>
                  <span
                    data-testid="hud-xp"
                    className="text-[11px] sm:text-xs font-mono font-bold text-cyan-400"
                  >
                    {xp} XP
                  </span>
                </div>
                {/* Progress bar to next rank */}
                <div className="w-16 sm:w-28 h-1 sm:h-1.5 rounded-full bg-slate-800 overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${rankProgressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak */}
            <div
              title={`${streakDays} Day Study Streak`}
              className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-semibold text-amber-400 font-mono"
            >
              <Flame className="h-4 w-4 text-amber-400 fill-amber-500/30" />
              <span>{streakDays}d</span>
            </div>

            {/* Audio toggle button */}
            <button
              onClick={toggleAudio}
              data-testid="btn-audio-toggle"
              aria-label={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
              title={audioMuted ? 'Sound effects muted (Click to unmute)' : 'Sound effects active (Click to mute)'}
              className={`rounded-lg p-1.5 sm:p-2 transition-colors border ${
                audioMuted
                  ? 'border-slate-800 bg-slate-900/60 text-slate-500 hover:text-slate-300'
                  : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
              }`}
            >
              {audioMuted ? (
                <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </button>

            {/* Save / Export modal button */}
            <button
              onClick={() => setSaveModalOpen(true)}
              data-testid="btn-save-modal"
              title="Cloud & Local Save Manager"
              className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 sm:p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Database className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-800/60 bg-gray-950/90 px-2 py-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-testid={link.testId}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2 rounded ${
                  isActive ? 'text-cyan-400' : 'text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      <SaveDataModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
      />
    </>
  );
}

'use client';

import { useState } from 'react';
import type { TopologyLabConfig, TopologyNodeType } from '@/types/curriculum';
import { soundEffects } from '@/lib/sound';
import { useProgressStore } from '@/store/useProgressStore';
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Network,
  Server,
  Router as RouterIcon,
  Shield,
  Laptop,
  Radio,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface TopologyLabProps {
  config: TopologyLabConfig;
  lectureId: number;
  onComplete: () => void;
}

function getNodeIcon(type: TopologyNodeType) {
  switch (type) {
    case 'host':
      return Laptop;
    case 'switch':
    case 'wan-switch':
      return Network;
    case 'router':
      return RouterIcon;
    case 'firewall':
      return Shield;
    case 'server':
      return Server;
    case 'wireless':
      return Radio;
    default:
      return Network;
  }
}

export function TopologyLab({
  config,
  lectureId,
  onComplete,
}: TopologyLabProps) {
  const { audioMuted, markLabCompleted, lectureProgress } = useProgressStore();
  const isAlreadyPassed = lectureProgress[lectureId]?.labCompleted;

  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string>>({});
  const [challengeSolved, setChallengeSolved] = useState<Record<string, boolean>>({});

  const currentChallenge = config.challenges[activeChallengeIdx];

  const handleOptionSelect = (option: string) => {
    if (!currentChallenge) return;
    const isCorrect = option === currentChallenge.correctOption;
    setChallengeAnswers((prev) => ({ ...prev, [currentChallenge.id]: option }));
    if (isCorrect) {
      soundEffects.playSuccess(audioMuted);
      setChallengeSolved((prev) => ({ ...prev, [currentChallenge.id]: true }));
    } else {
      soundEffects.playError(audioMuted);
    }
  };

  const handleReset = () => {
    setActiveChallengeIdx(0);
    setChallengeAnswers({});
    setChallengeSolved({});
    soundEffects.playClick(audioMuted);
  };

  const allChallengesSolved = config.challenges.every((c) => challengeSolved[c.id]);

  const handleFinishLab = () => {
    markLabCompleted(lectureId);
    soundEffects.playLevelUp(audioMuted);
    onComplete();
  };

  return (
    <div data-testid="lab-container" className="space-y-8">
      {/* Lab Header */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900/80 to-emerald-950/40 p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5 text-emerald-400" /> ENGINE 3 · TOPOLOGY LAB
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {config.nodes.length} Nodes · {config.links.length} Links
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">{config.title}</h3>
            <p className="text-xs text-slate-300 max-w-2xl">{config.scenario}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              data-testid="btn-lab-reset"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            {isAlreadyPassed && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="h-4 w-4" /> Lab Passed (+150 XP)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Topology Visualizer Canvas */}
      <div className="rounded-xl border border-slate-800 bg-gray-900/90 p-5 md:p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-200">Network Architecture Switchboard</h4>
            <p className="text-xs text-slate-400">
              Inspect node roles and WAN/LAN routing links to solve the architecture configuration challenges.
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-400">
            Challenge {activeChallengeIdx + 1} of {config.challenges.length}
          </div>
        </div>

        {/* Visual Map / Nodes & Links Layout */}
        <div className="relative w-full h-64 md:h-80 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden p-4">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 cyber-grid opacity-50" />

          {/* SVG Links Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {config.links.map((link, lIdx) => {
              const fromNode = config.nodes.find((n) => n.id === link.from);
              const toNode = config.nodes.find((n) => n.id === link.to);
              if (!fromNode || !toNode) return null;

              return (
                <g key={lIdx}>
                  <line
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke="#1e293b"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                  {/* Midpoint link label */}
                  <text
                    x={`${(fromNode.x + toNode.x) / 2}%`}
                    y={`${(fromNode.y + toNode.y) / 2 - 2}%`}
                    fill="#06b6d4"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="bg-slate-950 px-1"
                  >
                    {link.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* HTML Nodes Layer */}
          {config.nodes.map((node) => {
            const Icon = getNodeIcon(node.type);
            const isTarget = currentChallenge?.targetNodeId === node.id;

            return (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all shadow-lg ${
                    isTarget
                      ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 ring-4 ring-cyan-400/20 scale-110'
                      : 'border-slate-700 bg-slate-900 text-slate-300 group-hover:border-slate-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`mt-1 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    isTarget
                      ? 'bg-cyan-950 text-cyan-200 border-cyan-500/50'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800'
                  }`}
                >
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Challenge Tabs Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {config.challenges.map((challenge, cIdx) => {
            const isSolved = challengeSolved[challenge.id];
            const isActive = activeChallengeIdx === cIdx;

            return (
              <button
                key={challenge.id}
                onClick={() => {
                  soundEffects.playClick(audioMuted);
                  setActiveChallengeIdx(cIdx);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 border ${
                  isActive
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
                    : isSolved
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isSolved ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-slate-600" />
                )}
                <span>Task {cIdx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Active Challenge Card */}
        {currentChallenge && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Target Component:{' '}
                  {config.nodes.find((n) => n.id === currentChallenge.targetNodeId)?.label ||
                    currentChallenge.targetNodeId}
                </span>
                {challengeSolved[currentChallenge.id] && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-2 py-0.2 rounded">
                    Solved
                  </span>
                )}
              </div>
              <h5 className="text-sm font-semibold text-slate-200 leading-relaxed">
                {currentChallenge.prompt}
              </h5>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentChallenge.options.map((option, oIdx) => {
                const isSelected = challengeAnswers[currentChallenge.id] === option;
                const isCorrect = option === currentChallenge.correctOption;
                const isSolved = challengeSolved[currentChallenge.id];

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionSelect(option)}
                    className={`rounded-lg p-3 text-left font-mono text-xs border transition-all ${
                      isSolved && isCorrect
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold'
                        : isSelected && !isCorrect
                        ? 'border-rose-500 bg-rose-950/40 text-rose-200 line-through'
                        : isSelected
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Explanation */}
            {challengeSolved[currentChallenge.id] && currentChallenge.explanation && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-xs text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300 mr-1">Architecture Diagnostic:</span>
                  <span>{currentChallenge.explanation}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lab Completion Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-300 text-center sm:text-left">
          {allChallengesSolved ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> All topology architecture challenges verified!
            </span>
          ) : (
            <span className="text-slate-400">
              Solve all {config.challenges.length} network challenges to unlock +150 XP.
            </span>
          )}
        </div>

        <button
          onClick={handleFinishLab}
          disabled={!allChallengesSolved}
          data-testid="btn-lab-complete"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Complete Lab & Claim +150 XP</span>
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
}

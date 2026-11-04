'use client';

import { useState, useEffect } from 'react';
import { SANDBOX_SCENARIOS, type SandboxScenario, type SandboxStep } from '@/data/sandbox-scenarios';
import { OSI_LAYER_META } from '@/lib/utils';
import { soundEffects } from '@/lib/sound';
import { useProgressStore } from '@/store/useProgressStore';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Server,
  Network,
  Router as RouterIcon,
  Laptop,
  Globe,
  Binary,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

const TOPOLOGY_STATIONS = [
  { id: 'sender', label: 'Sender Host', icon: Laptop, x: 10, y: 50 },
  { id: 'switch', label: 'L2 Switch', icon: Network, x: 30, y: 50 },
  { id: 'router', label: 'L3 NAT Router', icon: RouterIcon, x: 50, y: 50 },
  { id: 'wan', label: 'WAN / MPLS Core', icon: Globe, x: 70, y: 50 },
  { id: 'server', label: 'Target Server', icon: Server, x: 90, y: 50 },
];

export default function SandboxPage() {
  const { audioMuted } = useProgressStore();
  const [selectedScenarioId, setSelectedScenarioId] = useState<'https' | 'ipv6' | 'ipsec'>('https');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);

  // Challenge answers for interactive debugging tasks: stepId -> option
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string>>({});
  const [challengeSolved, setChallengeSolved] = useState<Record<string, boolean>>({});

  const scenario =
    SANDBOX_SCENARIOS.find((s) => s.id === selectedScenarioId) || SANDBOX_SCENARIOS[0];
  const currentStep = scenario.steps[currentStepIdx] || scenario.steps[0];

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= scenario.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          soundEffects.playSnap(audioMuted);
          return prev + 1;
        });
      }, 2500 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, scenario.steps.length, speed, audioMuted]);

  const handleSelectScenario = (id: 'https' | 'ipv6' | 'ipsec') => {
    soundEffects.playClick(audioMuted);
    setSelectedScenarioId(id);
    setCurrentStepIdx(0);
    setIsPlaying(false);
    setChallengeAnswers({});
    setChallengeSolved({});
  };

  const handleStepForward = () => {
    if (currentStepIdx < scenario.steps.length - 1) {
      soundEffects.playSnap(audioMuted);
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIdx > 0) {
      soundEffects.playClick(audioMuted);
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    soundEffects.playClick(audioMuted);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleAnswerChallenge = (option: string) => {
    if (!currentStep.challenge) return;
    const isCorrect = option === currentStep.challenge.correctOption;
    setChallengeAnswers((prev) => ({ ...prev, [currentStep.id]: option }));
    if (isCorrect) {
      soundEffects.playSuccess(audioMuted);
      setChallengeSolved((prev) => ({ ...prev, [currentStep.id]: true }));
    } else {
      soundEffects.playError(audioMuted);
    }
  };

  const stationIndex = TOPOLOGY_STATIONS.findIndex((st) => st.id === currentStep.location);
  const activeStation = TOPOLOGY_STATIONS[stationIndex >= 0 ? stationIndex : 0];

  return (
    <div className="space-y-6">
      {/* Top Banner and Scenario Presets */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-gray-950 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> GLOBAL PROTOCOL SANDBOX
              </span>
              <span className="text-xs text-slate-400">7-Layer Encapsulation & Hop Journey</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">
              {scenario.title}
            </h1>
            <p className="text-xs text-slate-400">{scenario.tagline}</p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {SANDBOX_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(s.id)}
                data-testid={`sandbox-scenario-${s.id}`}
                className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all border ${
                  selectedScenarioId === s.id
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 ring-2 ring-cyan-400/20'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {s.id === 'https'
                  ? '1. HTTPS / VLAN / NAT'
                  : s.id === 'ipv6'
                  ? '2. IPv6 SLAAC Flow'
                  : '3. IPsec ESP VPN'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (3 cols): 7-Layer OSI & 5-Layer TCP/IP Stack Explorer */}
        <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-gray-900/90 p-4 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
              Protocol Stack Active Layer
            </h3>
            <p className="text-[11px] text-slate-400">Highlighting active layer during this hop.</p>
          </div>

          <div className="space-y-1.5">
            {[7, 6, 5, 4, 3, 2, 1].map((layerNum) => {
              const meta = OSI_LAYER_META[layerNum];
              const isActive = currentStep.activeLayer === layerNum;

              return (
                <div
                  key={layerNum}
                  className={`rounded-lg border p-2.5 transition-all text-xs flex items-center justify-between ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 ring-2 ring-cyan-400/30 font-bold'
                      : 'border-slate-800/80 bg-slate-950/60 text-slate-400'
                  }`}
                  style={{ borderLeftColor: meta?.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold">{meta?.short}</span>
                    <span>{meta?.name}</span>
                  </div>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300">Architect Note:</span>
            <p>
              In TCP/IP, Layers 5–7 merge into Application; Layers 1–2 form Link/Physical. Encapsulation wraps headers downwards (7 → 1); decapsulation strips them upwards (1 → 7).
            </p>
          </div>
        </div>

        {/* Center Column (6 cols): Animated Topology Journey Canvas & Step Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-gray-900/90 p-5 space-y-4">
            {/* Playback Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStepBack}
                  disabled={currentStepIdx === 0}
                  className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 disabled:opacity-30 transition-colors"
                  title="Step Backward"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  data-testid="sandbox-play-pause"
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3.5 py-2 text-xs font-bold text-white transition-colors shadow-md shadow-cyan-600/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isPlaying ? 'Pause' : 'Auto-Play'}</span>
                </button>
                <button
                  onClick={handleStepForward}
                  disabled={currentStepIdx >= scenario.steps.length - 1}
                  data-testid="sandbox-step-forward"
                  className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 disabled:opacity-30 transition-colors"
                  title="Step Forward"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 transition-colors"
                  title="Reset Journey"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <span>Speed:</span>
                  <button
                    onClick={() => setSpeed(speed === 1 ? 2 : 1)}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-400 font-bold"
                  >
                    {speed}x
                  </button>
                </div>
                <span className="font-mono text-xs text-cyan-400 font-bold">
                  Hop {currentStepIdx + 1} / {scenario.steps.length}
                </span>
              </div>
            </div>

            {/* Visual Canvas: Topology Stations & Traveling Packet Dot */}
            <div className="relative w-full h-56 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden p-4">
              <div className="absolute inset-0 cyber-grid opacity-60" />

              {/* Station Connection Line */}
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-800 -translate-y-1/2" />
              <div
                className="absolute top-1/2 left-8 h-1 bg-cyan-500 transition-all duration-300 -translate-y-1/2"
                style={{
                  width: `${(stationIndex / (TOPOLOGY_STATIONS.length - 1)) * 84}%`,
                }}
              />

              {/* Stations Icons */}
              <div className="relative z-10 flex items-center justify-between h-full px-2">
                {TOPOLOGY_STATIONS.map((station, sIdx) => {
                  const Icon = station.icon;
                  const isCurrentStation = station.id === currentStep.location;
                  const isPassed = sIdx <= stationIndex;

                  return (
                    <div key={station.id} className="flex flex-col items-center">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
                          isCurrentStation
                            ? 'border-cyan-400 bg-cyan-950 text-cyan-300 ring-4 ring-cyan-400/20 scale-110 shadow-lg shadow-cyan-500/20'
                            : isPassed
                            ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                            : 'border-slate-800 bg-slate-900 text-slate-500'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`mt-2 font-mono text-[10px] font-bold ${
                          isCurrentStation ? 'text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        {station.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Hop Details */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">{currentStep.hopName}</span>
                <span className="text-slate-400">Location: {activeStation.label}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {currentStep.description}
              </p>

              {/* Diagnostic Notes */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                {currentStep.diagnosticNotes.map((note, nIdx) => (
                  <div key={nIdx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                    <span className="text-cyan-400">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* "Fix the Broken Packet" Challenge Card if present */}
            {currentStep.challenge && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-200 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  <span>Protocol Challenge: Validate Packet Flow</span>
                </div>
                <p className="text-xs text-slate-200">{currentStep.challenge.prompt}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentStep.challenge.options.map((opt, oIdx) => {
                    const isChosen = challengeAnswers[currentStep.id] === opt;
                    const isRight = opt === currentStep.challenge?.correctOption;
                    const isSolved = challengeSolved[currentStep.id];

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswerChallenge(opt)}
                        className={`rounded-lg p-2.5 text-left font-mono text-xs border transition-all ${
                          isSolved && isRight
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold'
                            : isChosen && !isRight
                            ? 'border-rose-500 bg-rose-950/40 text-rose-200 line-through'
                            : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-amber-500/40'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {challengeSolved[currentStep.id] && (
                  <p className="text-xs text-emerald-300 pt-1">
                    ✓ {currentStep.challenge.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (3 cols): Live PDU Header & Byte Inspector */}
        <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-gray-900/90 p-4 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Binary className="h-4 w-4 text-cyan-400" /> Live PDU Byte Inspector
            </h3>
            <p className="text-[11px] text-slate-400">Encapsulated header fields at current hop.</p>
          </div>

          <div className="space-y-3 font-mono-numbers">
            {/* L7 */}
            {currentStep.headers.l7 && (
              <div className="rounded-lg border border-purple-500/40 bg-purple-950/20 p-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between text-purple-300 font-bold font-mono">
                  <span>L7 APPLICATION DATA</span>
                </div>
                <div className="text-[11px] text-slate-200">{currentStep.headers.l7.name}</div>
                <div className="text-[10px] text-slate-400 break-words">{currentStep.headers.l7.detail}</div>
              </div>
            )}

            {/* L4 */}
            {currentStep.headers.l4 && (
              <div className="rounded-lg border border-blue-500/40 bg-blue-950/20 p-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between text-blue-300 font-bold font-mono">
                  <span>L4 TRANSPORT SEGMENT</span>
                </div>
                <div className="text-[11px] text-slate-200">{currentStep.headers.l4.name}</div>
                <div className="text-[10px] text-slate-400 break-words">{currentStep.headers.l4.detail}</div>
              </div>
            )}

            {/* L3 */}
            {currentStep.headers.l3 && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-300 font-bold font-mono">
                  <span>L3 NETWORK PACKET</span>
                </div>
                <div className="text-[11px] text-slate-200">{currentStep.headers.l3.name}</div>
                <div className="text-[10px] text-slate-400 break-words">{currentStep.headers.l3.detail}</div>
              </div>
            )}

            {/* L2 */}
            {currentStep.headers.l2 && (
              <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 p-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between text-amber-300 font-bold font-mono">
                  <span>L2 DATA LINK FRAME</span>
                </div>
                <div className="text-[11px] text-slate-200">{currentStep.headers.l2.name}</div>
                <div className="text-[10px] text-slate-400 break-words">{currentStep.headers.l2.detail}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useProgressStore } from '@/store/useProgressStore';
import { Download, Upload, RotateCcw, X, Check, AlertTriangle } from 'lucide-react';

interface SaveDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveDataModal({ isOpen, onClose }: SaveDataModalProps) {
  const { exportSaveJson, importSaveJson, resetProgress, xp } = useProgressStore();
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleExportDownload = () => {
    const jsonStr = exportSaveJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netquest-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCopy = () => {
    const jsonStr = exportSaveJson();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = importSaveJson(importText.trim());
    if (ok) {
      setImportStatus('success');
      setImportText('');
      setTimeout(() => {
        setImportStatus('idle');
        onClose();
      }, 1200);
    } else {
      setImportStatus('error');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleResetExecute = () => {
    resetProgress();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-gray-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Profile & Data Synchronization</h2>
            <p className="text-xs text-slate-400">
              Current XP: <span className="font-mono text-cyan-400 font-bold">{xp}</span> · Auto-synced to disk
            </p>
          </div>
        </div>

        {/* Section 1: Export */}
        <div className="mb-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Download className="h-4 w-4 text-cyan-400" /> Export Save Snapshot
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Download your completed missions, quiz mastery scores, and SM-2 flashcard intervals as a JSON backup.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExportDownload}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Download .json
            </button>
            <button
              onClick={handleExportCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : null}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>
        </div>

        {/* Section 2: Import */}
        <div className="mb-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Upload className="h-4 w-4 text-emerald-400" /> Restore Save Snapshot
          </h3>
          <p className="text-xs text-slate-400 mb-2">
            Paste JSON or upload a saved backup file to restore your progress.
          </p>
          <textarea
            value={importText}
            onChange={(e) => {
              setImportText(e.target.value);
              setImportStatus('idle');
            }}
            placeholder='Paste {"version": 1, "xp": ...} here...'
            className="w-full h-20 rounded border border-slate-700 bg-slate-900 p-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <label className="cursor-pointer text-xs text-cyan-400 hover:underline">
              <span>Choose file...</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
            <button
              onClick={handleImportSubmit}
              disabled={!importText.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" /> Restore Save
            </button>
          </div>
          {importStatus === 'success' && (
            <p className="mt-2 text-xs font-semibold text-emerald-400">Save restored successfully!</p>
          )}
          {importStatus === 'error' && (
            <p className="mt-2 text-xs font-semibold text-rose-400">Invalid save JSON format.</p>
          )}
        </div>

        {/* Section 3: Reset */}
        <div className="rounded-lg border border-rose-950/50 bg-rose-950/20 p-3">
          {!confirmReset ? (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-rose-300">Reset All Study Progress</h4>
                <p className="text-[11px] text-rose-400/80">Wipes local XP, badges, and review intervals.</p>
              </div>
              <button
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-1 rounded bg-rose-900/60 border border-rose-700/50 px-2.5 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-800 transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                <AlertTriangle className="h-4 w-4 text-rose-400" /> Are you sure? This cannot be undone.
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="rounded px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetExecute}
                  className="rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-500"
                >
                  Yes, Wipe Progress
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

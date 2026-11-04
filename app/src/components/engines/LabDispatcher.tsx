'use client';

import type { LectureModule } from '@/types/curriculum';
import { HeaderAssembler } from './HeaderAssembler';
import { SequenceSimulator } from './SequenceSimulator';
import { TopologyLab } from './TopologyLab';
import { MatrixArena } from './MatrixArena';

interface LabDispatcherProps {
  lecture: LectureModule;
  onComplete: () => void;
}

export function LabDispatcher({ lecture, onComplete }: LabDispatcherProps) {
  const { labConfig } = lecture;

  switch (labConfig.engine) {
    case 'header-assembler':
      return (
        <HeaderAssembler
          config={labConfig}
          lectureId={lecture.id}
          onComplete={onComplete}
        />
      );
    case 'sequence-simulator':
      return (
        <SequenceSimulator
          config={labConfig}
          lectureId={lecture.id}
          onComplete={onComplete}
        />
      );
    case 'topology-lab':
      return (
        <TopologyLab
          config={labConfig}
          lectureId={lecture.id}
          onComplete={onComplete}
        />
      );
    case 'matrix-arena':
      return (
        <MatrixArena
          config={labConfig}
          lectureId={lecture.id}
          onComplete={onComplete}
        />
      );
    default:
      return (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-6 text-rose-300">
          Unknown simulation engine configuration.
        </div>
      );
  }
}

// Core domain models for NetQuest: Protocol Architect.
// See docs/ARCHITECTURE.md §4.

export type SectorId = 1 | 2 | 3 | 4 | 5;

export type OsiLayer = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface RawLecture {
  index: number;
  title: string;
  content: string;
}

export interface NormalizedSlideBlock {
  id: string;
  heading?: string;
  bullets: string[];
}

export interface NormalizedLecture {
  index: number;
  /** Title with the leading numeric prefix removed, e.g. "Data Link Layer" */
  title: string;
  /** Original title from Lectures.json, e.g. "2 Data Link Layer" */
  rawTitle: string;
  /** Untouched raw content from Lectures.json */
  rawContent: string;
  /** De-duplicated, whitespace-normalised content */
  cleanedContent: string;
  slideBlocks: NormalizedSlideBlock[];
}

export interface ConceptCard {
  id: string;
  title: string;
  layer?: OsiLayer;
  summary: string;
  keyPoints: string[];
  examTip: string;
  formulaOrSpec?: string; // e.g., "ATM Cell = 5B Header + 48B Data = 53 Bytes"
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
}

// --- 4 Data-Driven Simulation Engine Configs ---

export interface HeaderAssemblerConfig {
  engine: 'header-assembler';
  title: string;
  scenario: string;
  targetProtocol: string;
  /** Ordered slots the user must populate or configure */
  slots: Array<{
    id: string;
    label: string;
    bitWidth: string; // e.g., "48 bits", "16 bits", "32 bits"
    correctValue: string; // e.g., "10101011 (SFD)" or "0x8100 (TPID)"
    description: string;
  }>;
  distractors: string[];
  /** Interactive parameter challenges (e.g., CIDR mask, EUI-64 MAC conversion, IPv6 compression) */
  parameterTasks: Array<{
    id: string;
    prompt: string;
    inputPlaceholder?: string;
    options: string[];
    correctOption: string;
    explanation: string;
  }>;
}

export interface SequenceSimulatorConfig {
  engine: 'sequence-simulator';
  title: string;
  scenario: string;
  actors: [string, string] | [string, string, string]; // e.g., ["Client", "Server"] or ["User", "RA", "CA"]
  steps: Array<{
    id: string;
    fromIndex: number;
    toIndex: number;
    label: string; // e.g., "SYN (SEQ=x)" or "ICMPv6 Type 133 Router Solicitation"
    detail: string;
    stateAfter: string; // e.g., "SYN_SENT" or "V(S)=3, V(R)=2"
    isInteractivePrompt?: boolean;
    options?: string[]; // Choices for the user to complete the missing/broken step
    correctOption?: string;
    explanation?: string;
  }>;
}

export type TopologyNodeType =
  | 'host'
  | 'switch'
  | 'router'
  | 'firewall'
  | 'wan-switch'
  | 'server'
  | 'wireless';

export interface TopologyLabConfig {
  engine: 'topology-lab';
  title: string;
  scenario: string;
  nodes: Array<{
    id: string;
    label: string;
    type: TopologyNodeType;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
  }>;
  links: Array<{
    from: string;
    to: string;
    label: string;
  }>;
  challenges: Array<{
    id: string;
    targetNodeId: string;
    prompt: string;
    options: string[];
    correctOption: string;
    explanation: string;
  }>;
}

export interface MatrixArenaConfig {
  engine: 'matrix-arena';
  title: string;
  scenario: string;
  categories: Array<{
    id: string;
    title: string;
    subtitle: string;
  }>;
  items: Array<{
    id: string;
    text: string;
    correctCategoryId: string;
    explanation: string;
  }>;
}

export type LabConfig =
  | HeaderAssemblerConfig
  | SequenceSimulatorConfig
  | TopologyLabConfig
  | MatrixArenaConfig;

export type LabEngine = LabConfig['engine'];

export interface Flashcard {
  id: string;
  lectureId: number;
  front: string;
  back: string;
  tag: string;
}

export interface QuizQuestion {
  id: string;
  lectureId: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  difficulty: 'core' | 'advanced';
}

export interface LectureModule {
  id: number; // 1 to 14 matching Lectures.json index
  title: string;
  shortTitle: string;
  sectorId: SectorId;
  sectorName: string;
  estimatedMinutes: number;
  osiLayers: OsiLayer[];
  tagline: string;
  concepts: ConceptCard[];
  labConfig: LabConfig;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface SectorInfo {
  id: SectorId;
  name: string;
  codename: string;
  description: string;
  lectureIds: number[];
  accent: string; // hex colour
}

// --- Progress & SRS state ---

export type SRSRating = 'again' | 'hard' | 'good' | 'easy';

export interface SRSCardState {
  cardId: string;
  interval: number; // in days (0 = due immediately)
  repetitions: number; // consecutive successful recalls
  easeFactor: number; // default 2.5, minimum 1.3
  nextReviewAt: number; // epoch timestamp (ms)
  lastRating?: SRSRating;
  flaggedFromQuiz?: boolean;
}

export interface LectureProgress {
  briefingRead: boolean;
  labCompleted: boolean;
  bossDefeated: boolean;
  bestQuizScore: number; // percentage 0-100
  quizAttempts: number;
}

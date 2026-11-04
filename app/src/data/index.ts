import type {
  Flashcard,
  LectureModule,
  QuizQuestion,
  SectorId,
  SectorInfo,
} from '@/types/curriculum';
import { SECTOR1_LECTURES } from './curriculum/sector1-foundations';
import { SECTOR2_LECTURES } from './curriculum/sector2-area-nets';
import { SECTOR3_LECTURES } from './curriculum/sector3-internet';
import { SECTOR4_LECTURES } from './curriculum/sector4-transport';
import { SECTOR5_LECTURES } from './curriculum/sector5-security';

export const SECTORS: SectorInfo[] = [
  {
    id: 1,
    name: 'Sector 1: Foundations & Link Control',
    codename: 'FOUNDATION-CORE',
    description:
      'Master the 7-Layer OSI & TCP/IP models, framing, bit stuffing, CRC, and sliding-window ARQ flow control.',
    lectureIds: [1, 2],
    accent: '#06B6D4', // cyan-500
  },
  {
    id: 2,
    name: 'Sector 2: Area Networks (WAN & LAN)',
    codename: 'AREA-NETWORKS',
    description:
      'Architect wide-area switching (Leased lines, Frame Relay CIR, ATM 53B cells, MPLS) and local Ethernet (CSMA/CD back-off, 802.1Q VLANs).',
    lectureIds: [3, 4],
    accent: '#3B82F6', // blue-500
  },
  {
    id: 3,
    name: 'Sector 3: The Internet Layer',
    codename: 'INTERNET-ROUTING',
    description:
      'Navigate Datagram vs. Virtual Circuit forwarding, IPv4 CIDR subnetting, ARP, DHCP DORA, NAT, and 128-bit IPv6 SLAAC autoconfiguration.',
    lectureIds: [5, 6, 7],
    accent: '#10B981', // emerald-500
  },
  {
    id: 4,
    name: 'Sector 4: End-to-End Transport & Wireless IoT',
    codename: 'TRANSPORT-WIRELESS',
    description:
      'Engineer end-to-end TSAP multiplexing, the TCP 3-way handshake, 11-state FSM teardown, and low-power IoT networks (Bluetooth, NFC, ZigBee).',
    lectureIds: [8, 9, 10],
    accent: '#F59E0B', // amber-500
  },
  {
    id: 5,
    name: 'Sector 5: Cyber Defense & Network Design',
    codename: 'SECURITY-DESIGN',
    description:
      'Fortify networks with 3-factor auth, X.509 PKI, IPsec AH/ESP, TLS handshakes, and resilient multi-tier campus network designs.',
    lectureIds: [11, 12, 13, 14],
    accent: '#A855F7', // purple-500
  },
];

export const CURRICULUM_MODULES: LectureModule[] = [
  ...SECTOR1_LECTURES,
  ...SECTOR2_LECTURES,
  ...SECTOR3_LECTURES,
  ...SECTOR4_LECTURES,
  ...SECTOR5_LECTURES,
].sort((a, b) => a.id - b.id);

export function getLectureById(id: number): LectureModule | undefined {
  return CURRICULUM_MODULES.find((m) => m.id === id);
}

export function getLecturesBySector(sectorId: SectorId): LectureModule[] {
  return CURRICULUM_MODULES.filter((m) => m.sectorId === sectorId);
}

export function getAllFlashcards(): Flashcard[] {
  return CURRICULUM_MODULES.flatMap((m) => m.flashcards);
}

export function getAllQuizQuestions(): QuizQuestion[] {
  return CURRICULUM_MODULES.flatMap((m) => m.quiz);
}

export function getSectorInfo(sectorId: SectorId): SectorInfo | undefined {
  return SECTORS.find((s) => s.id === sectorId);
}

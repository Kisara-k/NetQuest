import type { LectureModule } from '@/types/curriculum';

export const SECTOR2_LECTURES: LectureModule[] = [
  // ---------------------------------------------------------------------------
  // Lecture 3 — Wide Area Networks
  // ---------------------------------------------------------------------------
  {
    id: 3,
    title: 'Wide Area Networks and Metropolitan Area Networks',
    shortTitle: 'Wide Area Networks',
    sectorId: 2,
    sectorName: 'Area Networks (WAN & LAN)',
    estimatedMinutes: 35,
    osiLayers: [1, 2, 3],
    tagline: 'Route at the edge, switch at the core: from 64 kb/s leased lines to MPLS and Ethernet in the First Mile.',
    concepts: [
      {
        id: 'l3-c1',
        title: 'WAN vs MAN vs LAN Scope',
        layer: 1,
        summary:
          'Networks are classified by geographic diameter and by who operates them. WANs and MANs are run by telecom service providers, while LANs are run by individual organisations. Traditionally each used different technologies, but today they are converging on Ethernet.',
        keyPoints: [
          'WAN: spans a wide area, typically over 30 km in diameter, operated by telecom service providers.',
          'MAN: spans a metropolitan area, up to about 50 km in diameter (e.g. Colombo Metro — Moratuwa to Ja-Ela), run by telecom providers.',
          'LAN: generally < 1 km in diameter, run by the individual organisation that owns it.',
          'Telecom networks consist of Access, Transmission and Switching sections serving subscribers.',
          'Convergence: Ethernet is now used in all three types of network (LAN, MAN and WAN).',
        ],
        examTip:
          'Remember the numbers as a ladder: LAN < 1 km, WAN > 30 km, MAN up to ~50 km. The key differentiator is ownership: telecom-operated (WAN/MAN) vs privately operated (LAN).',
        formulaOrSpec: 'LAN < 1 km  |  WAN > 30 km  |  MAN ≈ up to 50 km',
        comparisonTable: {
          headers: ['Type', 'Typical Diameter', 'Operated By', 'Example'],
          rows: [
            ['LAN', '< 1 km', 'Individual organisation', 'Campus / office floor'],
            ['MAN', 'Up to ~50 km', 'Telecom provider', 'Colombo Metro: Moratuwa → Ja-Ela'],
            ['WAN', '> 30 km', 'Telecom service provider', 'Inter-city corporate network'],
          ],
        },
      },
      {
        id: 'l3-c2',
        title: 'Leased Lines',
        layer: 1,
        summary:
          'A leased line is a full-time dedicated point-to-point link that is always available 24 hours a day with a specified carrying capacity. It is billed at a fixed monthly cost irrespective of usage, which makes it inefficient for bursty traffic.',
        keyPoints: [
          'Dedicated link from one point to another, available 24 hours, with a specified capacity (e.g. 64 kb/s).',
          'Fixed monthly cost irrespective of how much it is actually used.',
          'Types: analog and digital — today most leased lines are digital.',
          'Most common speeds 64 kb/s – 2 Mb/s: 64 kb/s for a few computers, 2 Mb/s for a large office.',
          'Uses: voice (tie lines), data (corporate networks, Internet access) and voice+data; data networks used to be built from leased lines.',
        ],
        examTip:
          'Leased line = you pay for the pipe whether or not you use it. Whenever an exam mentions "bursty traffic", the better answer is packet switching, not a leased line.',
        formulaOrSpec: 'Leased line: 64 kb/s (few PCs) → 2 Mb/s (large office), fixed monthly cost',
      },
      {
        id: 'l3-c3',
        title: 'Packet Switching, X.25 and Frame Relay',
        layer: 2,
        summary:
          'Packet switching breaks a data stream into packets that are interspersed with packets of other connections, making it more efficient than leased lines for bursty traffic. X.25 (1960s ITU standard) was slow and expensive; Frame Relay replaced it in the late 80s/90s by removing hop-by-hop error control and relying on a reliable network.',
        keyPoints: [
          'Datagram: each packet is routed independently. Virtual circuit: routing done once per connection/flow using connection identifiers — still no dedicated circuit.',
          'X.25: ITU standard for the user interface to a packet data network, introduced in the 1960s, used by banks and airlines; very expensive and very slow (~64 kb/s).',
          'Frame Relay: virtual-circuit oriented X.25 replacement, designed late \'80s and widely deployed in the \'90s; can carry IP datagrams so IP sees it as a link layer.',
          'Frame Relay service: no error control (assumes the network is reliable) and end-to-end congestion control.',
          'Typically Permanent VCs: a "pipe" carrying aggregate traffic between two corporate routers; multiple VCs share one physical link.',
          'CIR (Committed Information Rate): defined, "guaranteed" data rate per VC, negotiated at VC set-up; customer pays based on CIR.',
        ],
        examTip:
          'Classic trap: Frame Relay does NOT perform error control — it assumes a reliable network and leaves recovery to the end systems. The billing knob is the CIR.',
        formulaOrSpec: 'Frame Relay billing ∝ CIR (Committed Information Rate) per Permanent VC',
        comparisonTable: {
          headers: ['Feature', 'Datagram', 'Virtual Circuit'],
          rows: [
            ['Routing decision', 'Per packet', 'Once per connection / flow'],
            ['Identifier carried', 'Full destination address', 'Connection (VC) identifier'],
            ['Dedicated circuit?', 'No', 'No'],
            ['Examples', 'IP', 'X.25, Frame Relay, ATM'],
          ],
        },
      },
      {
        id: 'l3-c4',
        title: 'ATM Cell Switching (VPI/VCI)',
        layer: 2,
        summary:
          'Asynchronous Transfer Mode transmits and switches data in small fixed-size cells of 53 bytes: a 5-byte header plus 48 bytes of data. The uniform size and simple header allow very fast switching, so voice, video and data can share one network without the switching delay that made X.25 and Frame Relay unacceptable for real-time traffic.',
        keyPoints: [
          'ATM cell = 53 bytes = 5-byte header + 48-byte data (payload).',
          'Header fields: GFC, VPI, VCI, PT/CLP and HEC; cells carry a VC identifier, not a destination ID.',
          'Two-part addressing: Virtual Path Identifier (VPI) groups many Virtual Channel Identifiers (VCI) — makes routing easier and faster.',
          'Every switch on the path keeps state for each passing connection; bandwidth/buffers may be allocated per VC for circuit-like performance.',
          'Bandwidth is not fixed at 64 kb/s or 2 Mb/s; charging can be based on the number of cells; generally runs over optical fibre.',
          'Vision was "ATM from desktop to desktop"; reality: ATM became a switched link layer connecting IP backbone routers.',
        ],
        examTip:
          'Memorise "5 + 48 = 53". Overhead = 5/53 ≈ 9.4%. If asked why cells are small and fixed — fast hardware switching and low delay for voice and video.',
        formulaOrSpec: 'ATM Cell = 5B Header + 48B Data = 53 Bytes; Address = VPI + VCI',
        comparisonTable: {
          headers: ['Property', 'Frame Relay', 'ATM'],
          rows: [
            ['Connection oriented', 'Yes', 'Yes'],
            ['Unit', 'Variable-length frame', 'Fixed 53-byte cell'],
            ['Permanent VCs', 'Yes', 'Yes'],
            ['Switched VCs', 'Yes', 'Yes'],
            ['Multicasting', 'Yes', 'Yes'],
            ['Suits real-time voice/video', 'No (switching delay)', 'Yes (fast cell switching)'],
          ],
        },
      },
      {
        id: 'l3-c5',
        title: 'MPLS — Multi-Protocol Label Switching',
        layer: 3,
        summary:
          'MPLS provides connection-oriented switching based on a label applied at the edge of an MPLS domain, sitting between Layer 2 and IP (often called Layer 2.5). It is "multi-protocol" because it can run over any Layer 2 technology, and it combines the flexibility of IP routing with the performance and traffic engineering of ATM/FR.',
        keyPoints: [
          'Protocol stack: Physical → Layer 2 (PPP, ATM, FR, ...) → MPLS → IP / multi-service applications.',
          'Built on IP and routing protocols such as BGP-4, OSPF and IS-IS; IP is used to signal MPLS connections.',
          'Typically resides only in service-provider / carrier networks, not private networks.',
          'Major applications: network scalability, Traffic Engineering, VPNs; also IP multicast, IP CoS and RSVP.',
          '"Route at the Edge & Switch at the Core": edge routers classify and label packets; core routers forward purely on labels.',
          'Best of both worlds: packet forwarding (scalable, flexible, dynamic routing, inexpensive) + ATM/FR (performance, connection-oriented, TE, security, QoS).',
        ],
        examTip:
          'If a question says "label applied at the edge" or "Layer 2.5" — the answer is MPLS. Core routers never do a full IP lookup; they swap labels.',
        formulaOrSpec: 'MPLS = Route at the Edge (label push) + Switch at the Core (label swap)',
      },
      {
        id: 'l3-c6',
        title: 'Ethernet First Mile (IEEE 802.3ah)',
        layer: 1,
        summary:
          'Ethernet in the First Mile connects homes and offices to the provider using Ethernet framing, standardised as IEEE 802.3ah. It runs over copper (EFMC, using DSL modulation) or fibre (EFMF, point-to-point or Passive Optical Networks).',
        keyPoints: [
          'EFMC (copper) uses DSL modulation schemes carrying Ethernet frames.',
          'EFMC objectives: 10 Mbps at 750 m (EFMC SR — short reach) and 2 Mbps at 2,700 m (EFMC LR — long reach).',
          'Existing products deliver higher throughput over longer distances than the objectives.',
          'EFMF (fibre): Point-to-Point and Passive Optical Networks (PON).',
          'Dual-fibre standards: 100BASE-LX10, 1000BASE-LX10. Single-fibre standards: 100BASE-BX10, 1000BASE-BX10.',
        ],
        examTip:
          'LX10 = two fibres, BX10 = one fibre (bidirectional). SR trades distance for speed (10 Mbps/750 m), LR trades speed for distance (2 Mbps/2700 m).',
        formulaOrSpec: 'EFMC SR: 10 Mbps @ 750 m  |  EFMC LR: 2 Mbps @ 2700 m',
        comparisonTable: {
          headers: ['Variant', 'Medium', 'Spec / Standard', 'Notes'],
          rows: [
            ['EFMC SR', 'Copper', '10 Mbps @ 750 m', 'DSL modulation'],
            ['EFMC LR', 'Copper', '2 Mbps @ 2700 m', 'DSL modulation'],
            ['EFMF dual fibre', 'Fibre (P2P)', '100BASE-LX10 / 1000BASE-LX10', 'Two fibres'],
            ['EFMF single fibre', 'Fibre (P2P)', '100BASE-BX10 / 1000BASE-BX10', 'One bidirectional fibre'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'topology-lab',
      title: 'WAN Switching & ATM/MPLS Core Architect',
      scenario:
        'You are the network architect for an enterprise linking its headquarters to a remote branch and a home office. Inspect each WAN segment — leased line, Frame Relay cloud, ATM cell switch, MPLS label edge/core routers and the EFM last mile — and choose the correct configuration for each challenge.',
      nodes: [
        { id: 'hq', label: 'HQ Router', type: 'router', x: 10, y: 50 },
        { id: 'fr', label: 'Frame Relay Switch', type: 'wan-switch', x: 28, y: 22 },
        { id: 'atm', label: 'ATM Cell Switch', type: 'wan-switch', x: 28, y: 78 },
        { id: 'ler1', label: 'MPLS Edge LER-A', type: 'router', x: 48, y: 50 },
        { id: 'lsr', label: 'MPLS Core LSR', type: 'router', x: 66, y: 50 },
        { id: 'ler2', label: 'MPLS Edge LER-B', type: 'router', x: 82, y: 28 },
        { id: 'branch', label: 'Branch Office', type: 'host', x: 90, y: 72 },
      ],
      links: [
        { from: 'hq', to: 'fr', label: 'FR PVC (CIR)' },
        { from: 'hq', to: 'atm', label: 'ATM VPI/VCI' },
        { from: 'fr', to: 'ler1', label: 'FR trunk' },
        { from: 'atm', to: 'ler1', label: '53B cells' },
        { from: 'ler1', to: 'lsr', label: 'Label switched path' },
        { from: 'lsr', to: 'ler2', label: 'Label swap' },
        { from: 'ler2', to: 'branch', label: 'EFMC SR 10M @ 750m' },
        { from: 'hq', to: 'branch', label: '2 Mb/s leased line' },
      ],
      challenges: [
        {
          id: 'ch1',
          targetNodeId: 'hq',
          prompt:
            'The HQ–Branch backup link is a 2 Mb/s leased line that sits idle most of the month. How is it billed?',
          options: [
            'Per megabyte transferred',
            'A fixed monthly cost irrespective of usage',
            'Per cell transmitted',
            'Based on the Committed Information Rate',
          ],
          correctOption: 'A fixed monthly cost irrespective of usage',
          explanation:
            'A leased line is a full-time dedicated 24-hour link with a fixed monthly cost regardless of usage. That is why packet switching is more efficient for bursty traffic.',
        },
        {
          id: 'ch2',
          targetNodeId: 'fr',
          prompt:
            'HQ leases a Permanent VC from the public Frame Relay network. Which parameter is negotiated at VC set-up and determines what the customer pays?',
          options: ['VPI', 'MTU', 'CIR (Committed Information Rate)', 'Slot time'],
          correctOption: 'CIR (Committed Information Rate)',
          explanation:
            'The CIR is a defined, "guaranteed" data rate for each VC, negotiated at VC set-up time, and the customer pays based on the CIR.',
        },
        {
          id: 'ch3',
          targetNodeId: 'fr',
          prompt:
            'A corrupted frame crosses the Frame Relay cloud. What does the Frame Relay network itself do about it?',
          options: [
            'Retransmits it hop-by-hop like X.25',
            'Sends a NAK back to the HQ router',
            'Corrects it using the HEC field',
            'Nothing — Frame Relay has no error control and assumes the network is reliable',
          ],
          correctOption: 'Nothing — Frame Relay has no error control and assumes the network is reliable',
          explanation:
            'Frame Relay provides no error control because it assumes the network is reliable; only end-to-end congestion control is provided. Recovery is left to the end systems.',
        },
        {
          id: 'ch4',
          targetNodeId: 'atm',
          prompt: 'The ATM switch forwards a video stream. What is the exact structure of every cell it switches?',
          options: [
            '64 bytes = 14B header + 46B data + 4B FCS',
            '53 bytes = 5-byte header + 48-byte data',
            '48 bytes = 5-byte header + 43-byte data',
            '53 bytes = 3-byte header + 50-byte data',
          ],
          correctOption: '53 bytes = 5-byte header + 48-byte data',
          explanation:
            'ATM uses fixed 53-byte cells made of a 5-byte header and 48 bytes of data. Uniform size and a simple header allow very fast switching for voice, video and data.',
        },
        {
          id: 'ch5',
          targetNodeId: 'lsr',
          prompt:
            'A packet arrives at the MPLS core LSR. Following "route at the edge, switch at the core", how does the LSR forward it?',
          options: [
            'Performs a full longest-prefix IP routing lookup',
            'Floods it to all ports',
            'Switches it based on the label applied by the edge LER',
            'Reassembles it into 53-byte ATM cells',
          ],
          correctOption: 'Switches it based on the label applied by the edge LER',
          explanation:
            'MPLS provides connection-oriented switching based on a label applied at the edge of the MPLS domain. Edge routers route; core routers simply switch on labels.',
        },
        {
          id: 'ch6',
          targetNodeId: 'ler2',
          prompt:
            'The branch sits 750 m from the provider over copper using IEEE 802.3ah. Which EFM objective applies?',
          options: [
            'EFMC SR: 10 Mbps at 750 m',
            'EFMC LR: 2 Mbps at 2700 m',
            '1000BASE-BX10 over single fibre',
            'Leased line at 64 kb/s',
          ],
          correctOption: 'EFMC SR: 10 Mbps at 750 m',
          explanation:
            'Ethernet First Mile over Copper uses DSL modulation with objectives of 10 Mbps at 750 m (EFMC SR) and 2 Mbps at 2,700 m (EFMC LR).',
        },
      ],
    },
    flashcards: [
      {
        id: 'l3-f1',
        lectureId: 3,
        front: 'What diameters distinguish a LAN, MAN and WAN?',
        back: 'LAN generally < 1 km; MAN up to about 50 km (e.g. Moratuwa to Ja-Ela); WAN typically over 30 km. WANs/MANs are run by telecom providers, LANs by individual organisations.',
        tag: 'WAN/MAN/LAN',
      },
      {
        id: 'l3-f2',
        lectureId: 3,
        front: 'What are the most common leased line speeds and what do they suit?',
        back: '64 kb/s – 2 Mb/s: 64 kb/s for a few computers, 2 Mb/s for a large office. Billed at a fixed monthly cost irrespective of usage.',
        tag: 'Leased Line',
      },
      {
        id: 'l3-f3',
        lectureId: 3,
        front: 'Datagram vs virtual-circuit packet switching?',
        back: 'Datagram routes each packet independently. Virtual circuit routes once per connection/flow and uses connection identifiers — still without a dedicated circuit.',
        tag: 'Packet Switching',
      },
      {
        id: 'l3-f4',
        lectureId: 3,
        front: 'What is CIR in Frame Relay?',
        back: 'Committed Information Rate: a defined, "guaranteed" data rate for each VC, negotiated at VC set-up time; the customer pays based on the CIR.',
        tag: 'Frame Relay',
      },
      {
        id: 'l3-f5',
        lectureId: 3,
        front: 'What is the size and structure of an ATM cell?',
        back: '53 bytes: a 5-byte header plus 48 bytes of data.',
        tag: 'ATM',
      },
      {
        id: 'l3-f6',
        lectureId: 3,
        front: 'Why does ATM use two-part VPI/VCI addressing?',
        back: 'A Virtual Path (VPI) bundles many Virtual Channels (VCI), so switches can route whole paths at once — making network routing easier and faster.',
        tag: 'ATM',
      },
      {
        id: 'l3-f7',
        lectureId: 3,
        front: 'Summarise MPLS forwarding in one phrase and name its major applications.',
        back: '"Route at the Edge & Switch at the Core" — a label is applied at the edge of the MPLS domain. Major applications: network scalability, Traffic Engineering and VPNs.',
        tag: 'MPLS',
      },
      {
        id: 'l3-f8',
        lectureId: 3,
        front: 'What are the EFMC objectives in IEEE 802.3ah?',
        back: '10 Mbps at 750 m (EFMC SR) and 2 Mbps at 2,700 m (EFMC LR), using DSL modulation with Ethernet frames.',
        tag: 'EFM',
      },
    ],
    quiz: [
      {
        id: 'l3-q1',
        lectureId: 3,
        question: 'Which statement about an ATM cell is correct?',
        options: [
          'It is 64 bytes with a 14-byte header',
          'It is variable length, up to 1500 bytes',
          'It is 53 bytes: a 5-byte header and 48 bytes of data',
          'It is 48 bytes: a 5-byte header and 43 bytes of data',
        ],
        correctIndex: 2,
        explanation:
          'ATM transmits and switches data in small fixed cells of 53 bytes, consisting of a 5-byte header and 48 bytes of data. The fixed size enables very fast switching for voice, video and data.',
        difficulty: 'core',
      },
      {
        id: 'l3-q2',
        lectureId: 3,
        question: 'Which of the following is TRUE of the Frame Relay service?',
        options: [
          'It provides no error control and assumes the network is reliable',
          'It performs hop-by-hop error recovery like X.25',
          'It uses fixed 53-byte cells',
          'It is a datagram service with no virtual circuits',
        ],
        correctIndex: 0,
        explanation:
          'Frame Relay is virtual-circuit oriented and provides no error control because it assumes the network is reliable; it offers end-to-end congestion control instead.',
        difficulty: 'core',
      },
      {
        id: 'l3-q3',
        lectureId: 3,
        question:
          'A company has highly bursty traffic between two sites and currently pays for an idle leased line most of the day. What is the best explanation for moving to packet switching?',
        options: [
          'Packet switching provides a dedicated 24-hour circuit',
          'Packets from different connections are interspersed, making it more efficient for bursty traffic',
          'Leased lines cannot carry data, only voice',
          'Packet switching always guarantees lower delay than a leased line',
        ],
        correctIndex: 1,
        explanation:
          'Leased lines carry a fixed monthly cost irrespective of usage. Packet switching intersperses packets from many connections in the network, which is more efficient than leased lines for bursty traffic.',
        difficulty: 'core',
      },
      {
        id: 'l3-q4',
        lectureId: 3,
        question: 'What does "Route at the Edge & Switch at the Core" describe?',
        options: [
          'ATM VPI/VCI addressing',
          'Frame Relay Permanent VCs',
          'X.25 hop-by-hop error control',
          'MPLS label switching',
        ],
        correctIndex: 3,
        explanation:
          'MPLS provides connection-oriented switching based on a label applied at the edge of an MPLS domain; core routers simply switch on the label. This combines IP flexibility with ATM/FR-style performance.',
        difficulty: 'core',
      },
      {
        id: 'l3-q5',
        lectureId: 3,
        question:
          'Calculation: what fraction of each ATM cell is header overhead, and why was this accepted?',
        options: [
          '≈ 9.4% (5/53) — accepted because small fixed cells can be switched very fast for voice and video',
          '≈ 3.1% (5/160) — accepted because cells are large',
          '≈ 10.4% (5/48) — accepted because ATM has no header error check',
          '≈ 26% (14/53) — accepted because ATM carries Ethernet headers',
        ],
        correctIndex: 0,
        explanation:
          'The header is 5 of 53 bytes ≈ 9.4%. The overhead is accepted because uniform-size cells with a simple header can be processed very fast, avoiding the switching delay that made X.25 and Frame Relay unsuitable for voice and video.',
        difficulty: 'advanced',
      },
      {
        id: 'l3-q6',
        lectureId: 3,
        question:
          'A home office is 2.7 km from the exchange on copper. Which IEEE 802.3ah objective and technology apply?',
        options: [
          'EFMC SR — 10 Mbps at 750 m',
          '1000BASE-LX10 over dual fibre',
          'EFMC LR — 2 Mbps at 2,700 m',
          'ATM at 155 Mb/s over fibre',
        ],
        correctIndex: 2,
        explanation:
          'Ethernet First Mile over Copper uses DSL modulation with objectives of 10 Mbps at 750 m (SR) and 2 Mbps at 2,700 m (LR). At 2.7 km on copper the long-reach EFMC LR objective applies.',
        difficulty: 'advanced',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Lecture 4 — Local Area Networks
  // ---------------------------------------------------------------------------
  {
    id: 4,
    title: 'Local Area Networks',
    shortTitle: 'Local Area Networks',
    sectorId: 2,
    sectorName: 'Area Networks (WAN & LAN)',
    estimatedMinutes: 45,
    osiLayers: [1, 2],
    tagline: 'Sense the carrier, detect the collision, back off exponentially — and tag it with 0x8100.',
    concepts: [
      {
        id: 'l4-c1',
        title: 'LAN Attributes: Broadband vs Baseband',
        layer: 1,
        summary:
          'A LAN connects stations a few metres to several hundred metres apart over a privately owned channel at higher bit rates and far lower error rates than a WAN. LANs are either broadband (analogue, modems, FDM) or baseband (digital voltage levels, TDM or MAC protocols for multiple access).',
        keyPoints: [
          'Distances: a few metres to several 100 metres; typical bit rate 1 Mbps to 100 Mbps (and beyond).',
          'Privately owned channel — public carriers are not usually involved.',
          'Error rate: typical LAN 1:10^8 vs typical WAN 1:10^3 to 1:10^6.',
          'Broadband: analogue technology using modems; FDM with multiple carriers and sub-channels on one path.',
          'Baseband: digital technology where a driver introduces voltage levels; TDM possible, but MAC protocols usually handle multiple access.',
        ],
        examTip:
          '"Broadband = analogue + modems + FDM", "Baseband = digital + voltage levels". Error rate 1:10^8 on LAN is orders of magnitude better than WAN 1:10^3–1:10^6.',
        formulaOrSpec: 'BER: LAN ≈ 1:10^8  vs  WAN ≈ 1:10^3 – 1:10^6',
        comparisonTable: {
          headers: ['Attribute', 'Broadband LAN', 'Baseband LAN'],
          rows: [
            ['Technology', 'Analogue (modems)', 'Digital (voltage levels)'],
            ['Multiplexing', 'FDM — multiple carriers/sub-channels', 'TDM possible; usually MAC protocol'],
            ['Signal', 'Modulated carriers', 'Driver-generated voltage levels'],
          ],
        },
      },
      {
        id: 'l4-c2',
        title: 'IEEE 802 Family, LLC and MAC',
        layer: 2,
        summary:
          'IEEE 802 splits the OSI Data Link layer into an upper Logical Link Control (LLC, 802.2) sublayer and a lower Media Access Control (MAC) sublayer covering 802.3, 802.4 and 802.5. LLC is a subset of HDLC and offers Type 1 (connectionless) and Type 2 (connection-oriented) service.',
        keyPoints: [
          '802.1 Higher layers & management (incl. 802.1Q VLANs); 802.2 LLC; 802.3 CSMA/CD; 802.4 Token Bus; 802.5 Token Ring.',
          'LLC is a subset of HDLC; the LLC PDU carries DSAP and SSAP addresses plus a Control field.',
          'Type 1: connectionless — no ACKs, flow control or error control (done by higher layers, e.g. transport).',
          'Type 2: connection-oriented (optional) — provides ACKs, flow control and error control.',
          'MAC PDU: Preamble, Starting Delimiter, Frame Control, Dest/Source Address, LLC PDU or pad, FCS, Ending Delimiter.',
        ],
        examTip:
          'Trap: Type 1 is the one WITHOUT acknowledgements. In a ring network the DSAP/SSAP can even identify a specific ring and node.',
        formulaOrSpec: 'Data Link Layer (802) = LLC (802.2, HDLC subset) + MAC (802.3 / 802.4 / 802.5)',
        comparisonTable: {
          headers: ['LLC Class', 'Connection', 'ACKs', 'Flow / Error Control'],
          rows: [
            ['Type 1', 'Connectionless', 'No', 'No (left to higher layer)'],
            ['Type 2', 'Connection-oriented (optional)', 'Yes', 'Yes'],
          ],
        },
      },
      {
        id: 'l4-c3',
        title: 'Token Ring (802.5) and Token Bus (802.4)',
        layer: 2,
        summary:
          'Token-passing LANs avoid collisions by circulating a token that grants permission to transmit. Token Ring (802.5) supports priority access on a physical ring; Token Bus (802.4) forms a logical ring on a physical bus ordered by numeric address.',
        keyPoints: [
          '802.5: token indicates whether the ring is free or busy; a station seizes a free token, adds start-of-frame identifier, data and control fields.',
          'Each station regenerates the token while copying data addressed to it; the originator frees the token when its frame returns.',
          'Token Ring formats: Token, Abort Token, Token and Data.',
          '802.4 MAC has machines IFM (Interface), ACM (Access Control), RxM (Receive), TxM (Transmit) and optional RRM (Regenerative Repeater).',
          '802.4 frame = 802.5 frame without Access Control and Frame Status fields; logical ring order set by numeric address value.',
        ],
        examTip:
          'CSMA/CD (802.3) is in the "non-priority" category; Token Ring (802.5) is the "priority" scheme. RRM is the only optional 802.4 machine.',
        formulaOrSpec: '802.4 MAC = IFM + ACM + RxM + TxM (+ optional RRM)',
      },
      {
        id: 'l4-c4',
        title: 'IEEE 802.3 Ethernet Frame',
        layer: 2,
        summary:
          'Ethernet (Xerox, then DEC-Intel-Xerox 1980, standardised as 802.3) frames start with a 56-bit preamble and 8-bit SFD for synchronisation, followed by 48-bit MAC addresses, a 16-bit Type/Length field, 46–1500 bytes of data and a 32-bit CRC. The maximum untagged frame is 1518 bytes.',
        keyPoints: [
          'Preamble 56 bits (alternating 1010...) + SFD 8 bits (10101011) = 64 bits for synchronisation.',
          'Destination MAC 48 bits, Source MAC 48 bits.',
          'Type/Length 16 bits: value ≤ 1518 (≤ 1500 data) interpreted as length; larger values identify the protocol type.',
          'Data 46–1500 bytes (pad up to 46 so the frame fills the 512-bit slot); FCS = 32-bit CRC.',
          'Max frame 1518 bytes untagged (6+6+2+1500+4), 1522 bytes with an 802.1Q tag; physical layer uses Manchester encoding.',
        ],
        examTip:
          'Frame size counts from Destination MAC through FCS — the 8-byte preamble/SFD is NOT counted in 1518. Minimum frame 64 bytes = 512 bits = slot time.',
        formulaOrSpec: 'Max frame = 6 + 6 + 2 + 1500 + 4 = 1518 B (untagged)  |  +4 B 802.1Q tag = 1522 B',
        comparisonTable: {
          headers: ['Field', 'Size', 'Purpose'],
          rows: [
            ['Preamble', '56 bits', '1010... clock synchronisation'],
            ['SFD', '8 bits', '10101011 marks frame start'],
            ['Destination / Source MAC', '48 bits each', 'Station addresses'],
            ['Type/Length', '16 bits', 'Length (≤1518) or protocol type'],
            ['Data', '46–1500 bytes', 'LLC PDU / payload (+ pad)'],
            ['FCS', '32 bits', 'CRC error detection'],
          ],
        },
      },
      {
        id: 'l4-c5',
        title: 'CSMA/CD and Binary Exponential Back-off',
        layer: 2,
        summary:
          'A station senses the carrier, waits the inter-frame gap, then transmits; on detecting a collision it sends a 32-bit jam signal and backs off for a random number of slot times. The range doubles after each collision up to 2^10, and after 16 attempts the interface gives up.',
        keyPoints: [
          'IFG = 96 bit times: 9.6 µs at 10 Mbps, 960 ns at 100 Mbps (1 bit time = 100 ns at 10 Mbps, 10 ns at 100 Mbps).',
          'Collision: continue sending a 32-bit jam signal (collision enforcement) even if detected during the preamble.',
          'Slot time = 512 bit times (10/100 Mbps): a station that sends 512 bits without collision has acquired the channel; requires 46-byte minimum data.',
          '512 bit times covered 2800 m of coax at 10 Mbps but only 205 m at 100 Mbps.',
          'Back-off delay = r × slot time, with 0 ≤ r < 2^k and k = min(n, 10); n = number of attempts (collisions) so far.',
          'Maximum 16 attempts: after 16 tries the failure is reported to higher layers; counter resets after a successful transmission.',
        ],
        examTip:
          'After the 3rd collision r ∈ {0..7}; after the 10th and beyond r ∈ {0..1023} because k is capped at 10. Don\'t confuse the cap (10) with the give-up limit (16).',
        formulaOrSpec: 'Delay = r × 512 bit times, 0 ≤ r < 2^k, k = min(n, 10), give up after 16 attempts',
        comparisonTable: {
          headers: ['Parameter', '10 Mbps', '100 Mbps', '1000 Mbps (half duplex)'],
          rows: [
            ['Bit time', '100 ns', '10 ns', '1 ns'],
            ['IFG (96 bit times)', '9.6 µs', '960 ns', '96 ns'],
            ['Slot time', '512 bits (51.2 µs)', '512 bits (5.12 µs)', '4096 bits (4.096 µs)'],
            ['Collision diameter', '2800 m coax', '205 m', '~20 m without extension'],
          ],
        },
      },
      {
        id: 'l4-c6',
        title: 'Gigabit Ethernet, Full Duplex and 802.1Q VLANs',
        layer: 2,
        summary:
          'Half-duplex Gigabit Ethernet would only reach 20 m with a 512-bit slot, so the slot is extended to 4096 bits (512 bytes) via carrier extension, with frame bursting to recover efficiency. Full-duplex 802.3x removes collisions entirely, and IEEE 802.1Q adds a 4-byte VLAN tag.',
        keyPoints: [
          'Carrier extension: short frames are padded with non-data extension symbols (up to 448 bytes) to fill the 4096-bit (512-byte) slot.',
          'Frame bursting: after the first frame succeeds, more frames follow with IFGs filled by extension symbols, up to a 65,536-bit burst limit — >90% efficiency for small frames.',
          'Full duplex (802.3x): point-to-point twisted pair or fibre, simultaneous Tx/Rx (200 Mbps on 100BASE-T), no collision detection, IFG still kept.',
          'GbE lengths: 100 m twisted pair; multimode fibre e.g. 412 m half duplex vs 2 km full duplex; single mode 20 km+.',
          '802.1Q tag = 4 bytes: TPID 0x8100 (2 bytes) + TCI (2 bytes: 3-bit 802.1p priority, 1-bit CFI, 12-bit VLAN ID); max frame 1522 bytes.',
        ],
        examTip:
          'Full duplex has NO CSMA/CD and NO collisions, but it still waits an IFG. 12-bit VID → 4096 VLAN IDs; TPID 0x8100 sits where the Type field would be.',
        formulaOrSpec: '802.1Q Tag = TPID 0x8100 (16b) + TCI (3b PCP + 1b CFI + 12b VID) → 1522 B max frame',
      },
    ],
    labConfig: {
      engine: 'header-assembler',
      title: 'IEEE 802.3 + 802.1Q Frame & CSMA/CD Back-off Lab',
      scenario:
        'A trunk port must transmit a VLAN-tagged Ethernet frame. Drag the correct value into each field in transmission order, then solve the CSMA/CD slot-time and binary exponential back-off scenarios the NIC faces on a shared half-duplex segment.',
      targetProtocol: 'IEEE 802.3 Ethernet frame with IEEE 802.1Q VLAN tag',
      slots: [
        {
          id: 's1',
          label: 'Preamble',
          bitWidth: '56 bits',
          correctValue: '1010...10 (7 bytes alternating)',
          description: 'Alternating 1s and 0s that let the receiver synchronise its clock.',
        },
        {
          id: 's2',
          label: 'Start Frame Delimiter',
          bitWidth: '8 bits',
          correctValue: '10101011 (SFD)',
          description: 'Ends with "11" to mark the start of the actual frame.',
        },
        {
          id: 's3',
          label: 'Destination MAC',
          bitWidth: '48 bits',
          correctValue: '00:1A:2B:3C:4D:5E (Dest MAC)',
          description: 'Hardware address of the receiving station, sent first so receivers can filter early.',
        },
        {
          id: 's4',
          label: 'Source MAC',
          bitWidth: '48 bits',
          correctValue: '00:AA:BB:CC:DD:EE (Src MAC)',
          description: 'Hardware address of the transmitting station.',
        },
        {
          id: 's5',
          label: 'TPID',
          bitWidth: '16 bits',
          correctValue: '0x8100 (TPID)',
          description: 'Tag Protocol Identifier marking this as an IEEE 802.1Q tagged frame.',
        },
        {
          id: 's6',
          label: 'TCI',
          bitWidth: '16 bits',
          correctValue: 'PCP 3b | CFI 1b | VID 12b (TCI)',
          description: 'Tag Control Information: 3-bit 802.1p priority, CFI bit and 12-bit VLAN identifier.',
        },
        {
          id: 's7',
          label: 'Type/Length',
          bitWidth: '16 bits',
          correctValue: '0x0800 (Type: IPv4)',
          description: 'Values ≤ 1518 indicate length; larger values identify the encapsulated protocol.',
        },
        {
          id: 's8',
          label: 'Data + FCS',
          bitWidth: '46–1500 B + 32 bits',
          correctValue: 'Payload 46–1500 B + CRC-32 FCS',
          description: 'Padded payload followed by the 32-bit CRC frame check sequence.',
        },
      ],
      distractors: [
        '10101010 (SFD)',
        '0x86DD (TPID)',
        'PCP 3b | VID 16b (TCI)',
        'Payload 0–1500 B + CRC-16 FCS',
        '0x8100 (Type: IPv4)',
      ],
      parameterTasks: [
        {
          id: 'p1',
          prompt:
            'A 10 Mbps NIC has just suffered its 4th consecutive collision on the same frame (n = 4). From which range is the back-off multiplier r chosen?',
          inputPlaceholder: 'r range',
          options: ['0 ≤ r < 4', '0 ≤ r < 16', '0 ≤ r < 1024', '1 ≤ r ≤ 4'],
          correctOption: '0 ≤ r < 16',
          explanation:
            'k = min(n, 10) = min(4, 10) = 4, so r is a random integer with 0 ≤ r < 2^4 = 16. The delay is r × slot time (512 bit times).',
        },
        {
          id: 'p2',
          prompt:
            'The same NIC keeps colliding. What happens to the range at the 12th collision, and when does it finally give up?',
          options: [
            '0 ≤ r < 4096; gives up after 12 attempts',
            '0 ≤ r < 1024; gives up after 16 attempts',
            '0 ≤ r < 2048; gives up after 10 attempts',
            '0 ≤ r < 1024; retries forever',
          ],
          correctOption: '0 ≤ r < 1024; gives up after 16 attempts',
          explanation:
            'k = min(12, 10) = 10, so 2^k = 1024 and 0 ≤ r < 1024. The maximum number of attempts is 16, after which failure is reported to higher layers.',
        },
        {
          id: 'p3',
          prompt:
            'At 10 Mbps (1 bit time = 100 ns), how long is the inter-frame gap and the slot time?',
          options: [
            'IFG 9.6 µs, slot 51.2 µs',
            'IFG 960 ns, slot 5.12 µs',
            'IFG 96 µs, slot 512 µs',
            'IFG 3.2 µs, slot 51.2 µs',
          ],
          correctOption: 'IFG 9.6 µs, slot 51.2 µs',
          explanation:
            'IFG = 96 bit times × 100 ns = 9.6 µs, and slot time = 512 bit times × 100 ns = 51.2 µs. At 100 Mbps these become 960 ns and 5.12 µs.',
        },
        {
          id: 'p4',
          prompt:
            'A half-duplex Gigabit Ethernet segment sends a minimum-size frame. What slot time applies and what fills the gap?',
          options: [
            '512 bits, filled with padding in the Data field only',
            '4096 bits (512 bytes), filled by carrier extension symbols',
            '65,536 bits, filled by frame bursting',
            '1522 bytes, filled by the 802.1Q tag',
          ],
          correctOption: '4096 bits (512 bytes), filled by carrier extension symbols',
          explanation:
            'A 512-bit slot at 1 Gbps only allows ~20 m, so the slot is extended to 4096 bits (512 bytes) using carrier extension. 65,536 bits is the frame-burst limit, not the slot time.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l4-f1',
        lectureId: 4,
        front: 'Typical error rates of a LAN vs a WAN?',
        back: 'LAN ≈ 1:10^8; WAN ≈ 1:10^3 to 1:10^6.',
        tag: 'LAN Attributes',
      },
      {
        id: 'l4-f2',
        lectureId: 4,
        front: 'LLC Type 1 vs Type 2 service?',
        back: 'Type 1: connectionless, no ACKs, flow or error control (left to higher layers). Type 2: optional connection-oriented service with ACKs, flow control and error control.',
        tag: 'LLC',
      },
      {
        id: 'l4-f3',
        lectureId: 4,
        front: 'What are the maximum Ethernet frame sizes untagged and with an 802.1Q tag?',
        back: '1518 bytes untagged; 1522 bytes tagged (the 802.1Q tag adds 4 bytes).',
        tag: 'Ethernet Frame',
      },
      {
        id: 'l4-f4',
        lectureId: 4,
        front: 'What are the Preamble and SFD bit patterns and lengths?',
        back: 'Preamble: 56 bits of alternating 1010...; SFD: 8 bits 10101011. Together 64 bits.',
        tag: 'Ethernet Frame',
      },
      {
        id: 'l4-f5',
        lectureId: 4,
        front: 'State the IFG, jam signal and slot time for 10/100 Mbps Ethernet.',
        back: 'IFG = 96 bit times (9.6 µs @10M, 960 ns @100M); jam = 32 bits; slot time = 512 bit times.',
        tag: 'CSMA/CD',
      },
      {
        id: 'l4-f6',
        lectureId: 4,
        front: 'Binary exponential back-off formula?',
        back: 'Delay = r × slot time, where 0 ≤ r < 2^k and k = min(n, 10). Give up after 16 attempts; reset the counter after success.',
        tag: 'Back-off',
      },
      {
        id: 'l4-f7',
        lectureId: 4,
        front: 'How does half-duplex Gigabit Ethernet keep collision detection workable?',
        back: 'Extends the slot time to 4096 bits (512 bytes) using carrier extension, and uses frame bursting (65,536-bit burst limit) to keep efficiency above 90% for small frames.',
        tag: 'Gigabit Ethernet',
      },
      {
        id: 'l4-f8',
        lectureId: 4,
        front: 'What fields make up the 4-byte IEEE 802.1Q tag?',
        back: 'TPID = 0x8100 (2 bytes) and TCI (2 bytes): 3-bit 802.1p priority, 1-bit CFI and 12-bit VLAN ID.',
        tag: '802.1Q',
      },
    ],
    quiz: [
      {
        id: 'l4-q1',
        lectureId: 4,
        question: 'What is the maximum size of an IEEE 802.1Q-tagged Ethernet frame?',
        options: ['1500 bytes', '1518 bytes', '1526 bytes', '1522 bytes'],
        correctIndex: 3,
        explanation:
          'An untagged 802.3 frame is at most 1518 bytes; the 802.1Q VLAN tag adds 4 bytes (TPID 0x8100 + TCI), giving a maximum of 1522 bytes.',
        difficulty: 'core',
      },
      {
        id: 'l4-q2',
        lectureId: 4,
        question:
          'Calculation: a station has collided on its 3rd attempt (n = 3) on a 10 Mbps segment. What is the maximum possible back-off delay?',
        options: ['7 × 51.2 µs = 358.4 µs', '8 × 51.2 µs = 409.6 µs', '3 × 51.2 µs = 153.6 µs', '7 × 9.6 µs = 67.2 µs'],
        correctIndex: 0,
        explanation:
          'k = min(3, 10) = 3, so 0 ≤ r < 8 and the largest r is 7. Slot time = 512 bit times × 100 ns = 51.2 µs, so the maximum delay is 7 × 51.2 µs = 358.4 µs.',
        difficulty: 'advanced',
      },
      {
        id: 'l4-q3',
        lectureId: 4,
        question: 'Which statement about LLC Type 1 service is correct?',
        options: [
          'It is connection-oriented with ACKs and flow control',
          'It is connectionless with no ACKs, flow control or error control',
          'It is used only by Token Ring',
          'It replaces the MAC sublayer',
        ],
        correctIndex: 1,
        explanation:
          'Type 1 is connectionless service with no ACKs, flow control or error control; these are handled by a higher-level protocol such as the transport layer. Type 2 is the optional connection-oriented class.',
        difficulty: 'core',
      },
      {
        id: 'l4-q4',
        lectureId: 4,
        question: 'Why does half-duplex Gigabit Ethernet use a 4096-bit slot time instead of 512 bits?',
        options: [
          'To support 802.1Q tags',
          'Because the 96-bit IFG is too short at 1 Gbps',
          'Because a 512-bit slot at 1 Gbps would limit the network diameter to about 20 m',
          'Because frame bursting requires exactly 4096 bits',
        ],
        correctIndex: 2,
        explanation:
          'Signalling is 10× faster than Fast Ethernet, so a 512-bit slot allows only ~20 m. The slot was extended to 4096 bits (512 bytes) using carrier extension; frame bursting (65,536-bit limit) then restores efficiency.',
        difficulty: 'core',
      },
      {
        id: 'l4-q5',
        lectureId: 4,
        question:
          'Debugging: two servers are linked point-to-point with 100BASE-T configured for full duplex (802.3x). Which behaviour is expected?',
        options: [
          'Collisions occur and are resolved with binary exponential back-off',
          'Each end transmits a 32-bit jam signal before every frame',
          'The link is limited to 100 Mbps aggregate because the medium is shared',
          'No collisions occur, both ends transmit simultaneously (up to 200 Mbps), but an IFG is still observed',
        ],
        correctIndex: 3,
        explanation:
          'Full duplex (802.3x) uses independent transmit and receive paths on a point-to-point segment, so there is no collision detection and 100 Mbps Fast Ethernet can carry 200 Mbps total. The interface still waits an IFG before each frame.',
        difficulty: 'advanced',
      },
      {
        id: 'l4-q6',
        lectureId: 4,
        question: 'What is the length of the inter-frame gap at 100 Mbps?',
        options: ['9.6 µs', '960 ns', '512 ns', '96 ns'],
        correctIndex: 1,
        explanation:
          'The IFG is 96 bit times. At 100 Mbps one bit time is 10 ns, so 96 × 10 ns = 960 ns (9.6 µs at 10 Mbps).',
        difficulty: 'core',
      },
    ],
  },
];

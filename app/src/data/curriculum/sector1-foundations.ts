import type { LectureModule } from '@/types/curriculum';

export const SECTOR1_LECTURES: LectureModule[] = [
  // ---------------------------------------------------------------------------
  // Lecture 1 — Introduction and OSI Model
  // ---------------------------------------------------------------------------
  {
    id: 1,
    title: 'Introduction and the OSI Reference Model',
    shortTitle: 'OSI Reference Model',
    sectorId: 1,
    sectorName: 'Foundations & Link Control',
    estimatedMinutes: 30,
    osiLayers: [1, 2, 3, 4, 5, 6, 7],
    tagline: 'Tame network complexity with modularization, layering, and standardized interfaces.',
    concepts: [
      {
        id: 'l1-c1',
        title: 'Why a Communications Architecture?',
        summary:
          'Communication systems are complex to think about and to build, the technologies change rapidly, and they mix heterogeneous hardware and software. A layered architecture lets us reason about, build, and replace one piece at a time.',
        keyPoints: [
          'Problem 1 — Complexity: networks are complex to think about and complex to build.',
          'Problem 2 — Rapid change: technologies evolve quickly, so designs must absorb change.',
          'Problem 3 — Heterogeneity: systems combine many different vendors and technologies.',
          'Coping strategies: Modularization, Layering, and Standardization (of interfaces).',
          'Philosopher–Translator–Secretary analogy: each level talks logically to its peer, but physically hands the message down to the level below.',
        ],
        examTip:
          'Memorize the 3 problems (complexity, change, heterogeneity) and the 3 strategies (modularization, layering, standardization) as matching triples — a classic short-answer question.',
        formulaOrSpec: 'Complexity + Change + Heterogeneity → Modularization + Layering + Standardization',
        comparisonTable: {
          headers: ['Analogy Level', 'Role', 'Network Equivalent'],
          rows: [
            ['Philosopher', 'Has the idea to communicate', 'Application (user data)'],
            ['Translator', 'Converts to a common language', 'Presentation / middle layers'],
            ['Secretary', 'Physically sends via fax/mail', 'Lower layers / physical medium'],
          ],
        },
      },
      {
        id: 'l1-c2',
        title: 'Birth of the OSI Reference Model',
        summary:
          'Through the 1970s proprietary networking systems were the rule. In 1974 the ISO developed the Open Systems Interconnection (OSI) Reference Model as a basis for standardization, describing the pieces needed to construct a network.',
        keyPoints: [
          'Developed by ISO (International Organization for Standardization) in 1974.',
          'Seven layers; each provides functions to the layer above and relies on the layer below.',
          'Each layer communicates logically with its peer layer on another node.',
          'Layer design rule: each layer performs a well-defined function.',
          'Boundaries chosen to minimize information flow across interfaces.',
          'Number of layers: large enough to avoid grouping unrelated functions, small enough to be manageable.',
        ],
        examTip:
          'The OSI model is a reference model, not an implementation — real stacks such as TCP/IP, SNA and WAP may or may not conform to it.',
        formulaOrSpec: 'ISO OSI RM (1974) = 7 Layers: Physical → Data Link → Network → Transport → Session → Presentation → Application',
      },
      {
        id: 'l1-c3',
        title: 'Services, Interfaces, Peers & Protocols',
        summary:
          'The OSI general principles separate WHAT a layer does (service) from HOW the adjacent layer accesses it (interface) and from the RULES used between matching layers on different nodes (protocol). Services and interfaces are vertical; protocols are horizontal.',
        keyPoints: [
          'Service: what the layer does, not how it is accessed; offered to the layer above.',
          'Interface: how adjacent layers access the layer — one interface above, one below.',
          'Peers: the matching layers on two systems (e.g., network layer on host A and host B).',
          'Peers communicate logically with each other but physically via the lower layers.',
          'Protocol: the rules by which peer layers on different nodes communicate.',
        ],
        examTip:
          'Trap: "protocol" is horizontal (peer-to-peer, same layer, different nodes); "service" and "interface" are vertical (between adjacent layers on the same node).',
        formulaOrSpec: 'Vertical: Service (what) + Interface (how) | Horizontal: Protocol (peer rules)',
        comparisonTable: {
          headers: ['Concept', 'Direction', 'Answers the Question'],
          rows: [
            ['Service', 'Vertical (to layer above)', 'What does the layer do?'],
            ['Interface', 'Vertical (adjacent layers)', 'How is the layer accessed?'],
            ['Protocol', 'Horizontal (peer to peer)', 'What rules do peers follow?'],
          ],
        },
      },
      {
        id: 'l1-c4',
        title: 'Lower Layers: Physical, Data Link, Network',
        layer: 3,
        summary:
          'The bottom three layers move bits across a link, make a single link error-free, and deliver packets host-to-host across the network. They are present in every intermediate node such as switches and routers.',
        keyPoints: [
          'L1 Physical: transmits raw bits across a link — connection set-up/termination, bit encoding, transmission, repeating/amplification to extend range.',
          'L2 Data Link: error-free transmission across a SINGLE link — framing, error detection & correction, flow control.',
          'L3 Network: delivers packets host-to-host across a communications network, shielding higher layers from routing details.',
          'Network-layer issues: Addressing, Routing, Congestion control, Quality of Service.',
          'PDUs: bits (L1) → frames (L2) → packets (L3).',
        ],
        examTip:
          'Single link = Data Link; across the network host-to-host = Network; end-to-end process delivery = Transport. Watch the scope words in exam questions.',
        formulaOrSpec: 'L1 = Bits | L2 = Frame | L3 = Packet',
      },
      {
        id: 'l1-c5',
        title: 'Upper Layers: Transport, Session, Presentation, Application',
        layer: 4,
        summary:
          'The Transport layer provides end-to-end delivery between hosts, repeating many data-link functions but across a whole network. Session manages dialogue, Presentation formats data, and Application provides general-purpose network services.',
        keyPoints: [
          'L4 Transport: connection set-up/termination, flow control, error detection & correction, QoS, multiplexing.',
          'L4 does "many of the same things as the data link layer", but endpoints are across a network, not a wire.',
          'L5 Session: dialogue management (half- vs. full-duplex), synchronisation & recovery; not often used in existing systems.',
          'L6 Presentation: formats data for transmission (data representation/structure, encryption); today handled by application protocols.',
          'L7 Application: file transfer, e-mail, directory lookup, virtual terminal, network management, World-Wide Web.',
        ],
        examTip:
          'Dialog control and synchronisation/recovery checkpoints = Session; data representation/encryption = Presentation. Students often swap these two.',
        formulaOrSpec: 'L4 = Segment | L5–L7 = Data / Message',
        comparisonTable: {
          headers: ['Layer', 'Purpose', 'Key Issues'],
          rows: [
            ['L4 Transport', 'End-to-end host delivery', 'Flow/error control, multiplexing, QoS'],
            ['L5 Session', 'Control dialogue between users', 'Half/full duplex, sync & recovery'],
            ['L6 Presentation', 'Format data for transmission', 'Data representation, encryption'],
            ['L7 Application', 'General network functions', 'FTP, e-mail, directory, Web'],
          ],
        },
      },
      {
        id: 'l1-c6',
        title: 'TCP/IP Model vs. OSI',
        summary:
          'The TCP/IP model uses Application, Transport and Internet layers over a Data Link and a Physical layer. It does not define the physical, session and presentation layers — the physical layer is provided outside TCP/IP and session/presentation functions are absorbed by Transport/Application.',
        keyPoints: [
          'TCP/IP stack: Application, Transport, Internet, Data Link, (Physical).',
          'TCP/IP does not include the Physical, Session and Presentation layers.',
          'Physical layer is still needed — provided outside TCP/IP.',
          'Session & Presentation functions are provided by Transport/Application layers.',
          'Why TCP/IP won: runs on everything (supercomputers, PCs, PDAs, phones), consistent APIs, strong track record, less complex than OSI, the Internet & WWW.',
        ],
        examTip:
          'OSI "Network" layer = TCP/IP "Internet" layer. "Internet Layer" is never an OSI layer name — a common distractor.',
        formulaOrSpec: 'OSI L5+L6+L7 ≈ TCP/IP Application | OSI L3 ≈ TCP/IP Internet',
        comparisonTable: {
          headers: ['OSI Layer', 'TCP/IP Layer', 'Note'],
          rows: [
            ['Application / Presentation / Session', 'Application', 'L5/L6 functions folded in'],
            ['Transport', 'Transport', 'TCP / UDP'],
            ['Network', 'Internet', 'IP routing & addressing'],
            ['Data Link', 'Data Link', 'Framing on a single link'],
            ['Physical', '(outside TCP/IP)', 'Needed but not defined by TCP/IP'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'header-assembler',
      title: 'OSI vs. TCP/IP Stack & Encapsulation Puzzle',
      scenario:
        'A web request leaves your laptop. Rebuild the OSI stack from Layer 7 down to Layer 1, tagging each layer with its PDU, then prove you can distinguish services, interfaces and protocols and explain how TCP/IP maps onto OSI.',
      targetProtocol: 'ISO OSI Reference Model (1974)',
      slots: [
        {
          id: 's1',
          label: 'Layer 7',
          bitWidth: 'Data / Message',
          correctValue: 'Application Layer',
          description: 'Provides general-purpose network functions such as file transfer, e-mail, directory lookup and the Web.',
        },
        {
          id: 's2',
          label: 'Layer 6',
          bitWidth: 'Data',
          correctValue: 'Presentation Layer',
          description: 'Formats data for transmission, handling differing data representations and encryption.',
        },
        {
          id: 's3',
          label: 'Layer 5',
          bitWidth: 'Data',
          correctValue: 'Session Layer',
          description: 'Controls the dialogue between end users: half/full duplex, synchronisation and recovery.',
        },
        {
          id: 's4',
          label: 'Layer 4',
          bitWidth: 'Segment',
          correctValue: 'Transport Layer',
          description: 'Provides end-to-end host delivery with flow control, error control and multiplexing.',
        },
        {
          id: 's5',
          label: 'Layer 3',
          bitWidth: 'Packet',
          correctValue: 'Network Layer',
          description: 'Delivers packets host-to-host across the network: addressing, routing, congestion control, QoS.',
        },
        {
          id: 's6',
          label: 'Layer 2',
          bitWidth: 'Frame',
          correctValue: 'Data Link Layer',
          description: 'Provides error-free transmission across a single link via framing, error and flow control.',
        },
        {
          id: 's7',
          label: 'Layer 1',
          bitWidth: 'Bits',
          correctValue: 'Physical Layer',
          description: 'Encodes and transmits raw bits across a link, repeating or amplifying to extend range.',
        },
      ],
      distractors: ['Internet Layer', 'LLC Sublayer', 'Transport Gateway', 'Host-to-Network Layer'],
      parameterTasks: [
        {
          id: 'p1',
          prompt: 'Which OSI concept defines the rules by which the network layer on Host A communicates with the network layer on Host B?',
          options: ['Service', 'Interface', 'Protocol', 'Primitive'],
          correctOption: 'Protocol',
          explanation:
            'Protocols are the horizontal rules between peer layers on different nodes. Services describe what a layer does for the layer above, and interfaces describe how adjacent layers access each other.',
        },
        {
          id: 'p2',
          prompt: 'Order the encapsulation of application data as it moves down the stack to the wire.',
          options: [
            'Message → Segment → Packet → Frame → Bits',
            'Message → Packet → Segment → Frame → Bits',
            'Bits → Frame → Packet → Segment → Message',
            'Message → Frame → Segment → Packet → Bits',
          ],
          correctOption: 'Message → Segment → Packet → Frame → Bits',
          explanation:
            'The application message is wrapped by Transport (segment), then Network (packet), then Data Link (frame, with header and trailer), and finally sent as bits by the Physical layer.',
        },
        {
          id: 'p3',
          prompt: 'Which OSI layers are NOT included in the TCP/IP model?',
          options: [
            'Physical, Session and Presentation',
            'Network and Transport',
            'Data Link and Network',
            'Session and Application',
          ],
          correctOption: 'Physical, Session and Presentation',
          explanation:
            'TCP/IP omits the physical (provided outside TCP/IP), session and presentation layers; their functions are handled by the Transport and Application layers.',
        },
        {
          id: 'p4',
          prompt: 'Which is NOT one of the reasons given for TCP/IP being more popular than OSI?',
          options: [
            'Runs on everything from supercomputers to phones',
            'Has consistent APIs and a strong track record',
            'Is less complex than OSI',
            'Defines a separate session and presentation layer',
          ],
          correctOption: 'Defines a separate session and presentation layer',
          explanation:
            'TCP/IP succeeded because it runs on everything, has consistent APIs, a strong track record, is simpler than OSI and powers the Internet/WWW. It deliberately does NOT define separate session/presentation layers.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l1-f1',
        lectureId: 1,
        front: 'What three strategies are used to cope with network complexity and change?',
        back: 'Modularization, Layering, and Standardization (of interfaces).',
        tag: 'Architecture',
      },
      {
        id: 'l1-f2',
        lectureId: 1,
        front: 'Who developed the OSI Reference Model and when?',
        back: 'The ISO (International Organization for Standardization) in 1974, as a basis for standardizing networks when proprietary systems were the rule.',
        tag: 'OSI History',
      },
      {
        id: 'l1-f3',
        lectureId: 1,
        front: 'Define a Service vs. an Interface in the OSI model.',
        back: 'A service is what a layer does for the layer above (not how it is accessed). An interface is how adjacent layers access the layer — one interface above and one below.',
        tag: 'OSI Principles',
      },
      {
        id: 'l1-f4',
        lectureId: 1,
        front: 'What is a protocol in OSI terms?',
        back: 'The set of rules by which peer layers on different nodes communicate. Peers talk logically to each other but physically via the lower layers.',
        tag: 'OSI Principles',
      },
      {
        id: 'l1-f5',
        lectureId: 1,
        front: 'Name the PDU at OSI Layers 4, 3, 2 and 1.',
        back: 'Segment (Transport), Packet (Network), Frame (Data Link), Bits (Physical).',
        tag: 'Encapsulation',
      },
      {
        id: 'l1-f6',
        lectureId: 1,
        front: 'What are the two main issues handled by the Session layer?',
        back: 'Dialogue management (half- vs. full-duplex) and synchronisation & recovery management. The session layer is rarely used in existing systems.',
        tag: 'Session Layer',
      },
      {
        id: 'l1-f7',
        lectureId: 1,
        front: 'List the layers of the TCP/IP model.',
        back: 'Application, Transport, Internet, Data Link (and Physical, which is provided outside TCP/IP).',
        tag: 'TCP/IP',
      },
      {
        id: 'l1-f8',
        lectureId: 1,
        front: 'What are the four key issues of the Network layer?',
        back: 'Addressing, Routing, Congestion control, and Quality of Service.',
        tag: 'Network Layer',
      },
    ],
    quiz: [
      {
        id: 'l1-q1',
        lectureId: 1,
        question: 'Which layer provides error-free transmission across a single link using framing, error detection and flow control?',
        options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
        correctIndex: 1,
        explanation:
          'The Data Link layer’s purpose is error-free transmission across a single link with framing, error detection/correction and flow control. Transport does similar tasks, but end-to-end across a network.',
        difficulty: 'core',
      },
      {
        id: 'l1-q2',
        lectureId: 1,
        question: 'Two applications negotiate whether to communicate half-duplex or full-duplex and insert recovery checkpoints. Which OSI layer is responsible?',
        options: ['Presentation Layer', 'Transport Layer', 'Application Layer', 'Session Layer'],
        correctIndex: 3,
        explanation:
          'Dialogue management (half vs. full duplex) and synchronisation & recovery management are the defining issues of the Session layer (Layer 5).',
        difficulty: 'core',
      },
      {
        id: 'l1-q3',
        lectureId: 1,
        question: 'In the OSI general principles, the rules followed by the network layer of Host A when exchanging messages with the network layer of Host B are called:',
        options: ['A protocol', 'A service', 'An interface', 'A layer boundary'],
        correctIndex: 0,
        explanation:
          'Protocols are the horizontal rules by which peer layers on different nodes communicate. Services and interfaces are vertical relationships between adjacent layers on the same node.',
        difficulty: 'core',
      },
      {
        id: 'l1-q4',
        lectureId: 1,
        question: 'Which statement about the TCP/IP model compared with OSI is correct?',
        options: [
          'TCP/IP defines seven layers just like OSI',
          'TCP/IP has a dedicated Presentation layer for encryption',
          'TCP/IP omits Physical, Session and Presentation; session/presentation functions go to Transport/Application',
          'TCP/IP replaces the Transport layer with an Internet layer',
        ],
        correctIndex: 2,
        explanation:
          'TCP/IP does not include the physical, session and presentation layers. The physical layer is provided outside TCP/IP and session/presentation functions are provided by the Transport/Application layers.',
        difficulty: 'core',
      },
      {
        id: 'l1-q5',
        lectureId: 1,
        question: 'A captured unit shows a frame header, a frame trailer and, inside, a network header wrapping a transport segment. Reading from the wire inward, which order did encapsulation follow on the sender?',
        options: [
          'Packet → Segment → Frame → Bits',
          'Message → Segment → Packet → Frame → Bits',
          'Segment → Message → Frame → Packet → Bits',
          'Frame → Packet → Segment → Message → Bits',
        ],
        correctIndex: 1,
        explanation:
          'On transmission, the application message is wrapped as a segment (transport), then a packet (network), then a frame with header and trailer (data link), then sent as bits. The receiver decapsulates in reverse.',
        difficulty: 'advanced',
      },
      {
        id: 'l1-q6',
        lectureId: 1,
        question: 'When deciding OSI layer boundaries, which design rule was applied?',
        options: [
          'Maximize the information flow across boundaries so layers share state',
          'Use as many layers as possible so each function is isolated',
          'Use as few layers as possible to reduce headers',
          'Each layer performs a well-defined function and boundaries minimize information flow across them',
        ],
        correctIndex: 3,
        explanation:
          'Each layer should perform a well-defined function and boundaries are chosen to minimize information flow across interfaces. The number of layers must be large enough to avoid grouping unrelated functions but small enough to be manageable.',
        difficulty: 'advanced',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Lecture 2 — Data Link Layer
  // ---------------------------------------------------------------------------
  {
    id: 2,
    title: 'The Data Link Layer',
    shortTitle: 'Data Link Layer',
    sectorId: 1,
    sectorName: 'Foundations & Link Control',
    estimatedMinutes: 40,
    osiLayers: [2],
    tagline: 'Frame it, check it, ACK it — and share the medium without chaos.',
    concepts: [
      {
        id: 'l2-c1',
        title: 'DLL Functions & the LLC/MAC Split',
        layer: 2,
        summary:
          'The Data Link Layer turns an unreliable physical link into a reliable one. Its functions are synchronisation, error control, flow control, data compression and encryption; on shared media it additionally needs Medium Access Control.',
        keyPoints: [
          'Core DLL functions: Synchronisation, Error control, Flow control, Data compression, Encryption.',
          'Shared media split the layer into LLC (Logical Link Control) and MAC (Medium Access Control).',
          'LLC = the classic DLL functions; MAC = controls each station’s access to the shared medium.',
          'Compression is based on probability theory — symbol probabilities are unequal and depend on previous symbols.',
          'Encryption ensures privacy (confidentiality) and authenticity, using single-key or public-key (two-key) algorithms.',
        ],
        examTip:
          'If the question mentions a shared medium (bus, radio, satellite), the answer usually involves the MAC sublayer; point-to-point reliability is LLC.',
        formulaOrSpec: 'DLL (shared media) = LLC (sync, error, flow) + MAC (medium access)',
      },
      {
        id: 'l2-c2',
        title: 'Synchronisation & Framing',
        layer: 2,
        summary:
          'Synchronisation lets the receiver identify the beginning and end of each data unit. Units can be fixed-length (bytes, cells) or variable-length frames, delimited by character count, STX/ETX characters with byte stuffing, or a bit flag with bit stuffing.',
        keyPoints: [
          'Fixed-length: byte (asynchronous transmission) or cell; Variable-length: frames.',
          'A frame encapsulates a packet with a frame header and frame trailer.',
          'Character count: header states the frame length — one corrupted count desynchronises everything.',
          'Character-oriented: STX/ETX delimiters; control bytes in data are escaped (byte stuffing).',
          'Bit-oriented: flag 01111110 delimits frames; after five consecutive 1s in the data the sender inserts a 0 (bit stuffing).',
          'Problems: data loss (lost ETX or flag), data errors, control char/flag appearing in data.',
        ],
        examTip:
          'Bit stuffing: payload 01111110 becomes 011111010 — the 0 goes after the FIFTH 1, regardless of the next bit. The receiver deletes any 0 following five 1s.',
        formulaOrSpec: 'Flag = 01111110 | Stuff rule: 11111 → 111110',
        comparisonTable: {
          headers: ['Method', 'Delimiter', 'Transparency Technique'],
          rows: [
            ['Character count', 'Length field in header', 'None — count error breaks sync'],
            ['Character-oriented', 'STX / ETX (flag bytes)', 'Byte (character) stuffing'],
            ['Bit-oriented', 'Flag 01111110', 'Bit stuffing after five 1s'],
          ],
        },
      },
      {
        id: 'l2-c3',
        title: 'Error Detection: Parity, Checksum, CRC',
        layer: 2,
        summary:
          'Physical transmission may introduce missing, inserted or flipped bits, and errors often occur in bursts. Detection adds redundant EDC bits to the data — parity, checksum or CRC — but every method misses some errors, leaving residual errors.',
        keyPoints: [
          'Error types: missing bits, inserted bits, changed bits (1→0, 0→1); often in bursts.',
          'Detection methods: Parity, Checksum, Cyclic Redundancy Check (CRC).',
          'EDC = Error Detection and Correction bits (redundancy); D = data protected, may include header fields.',
          'CRC = polynomial code checksum — strongest of the three against burst errors.',
          'All methods detect only some errors: residual errors exist, and their probability should be low.',
        ],
        examTip:
          'No detection scheme is perfect — "residual error rate" is the probability an error slips through undetected. Expect a question asking how to deal with residual errors (higher layers).',
        formulaOrSpec: 'Transmitted = D + EDC (redundancy bits)',
      },
      {
        id: 'l2-c4',
        title: 'Error Correction: FEC vs. ARQ',
        layer: 2,
        summary:
          'Errors can be corrected by Forward Error Correction (enough redundancy to recover data without retransmission) or Automatic Repeat Request (detect and retransmit). FEC suits simplex and high-latency links; ARQ suits two-way links.',
        keyPoints: [
          'FEC: redundancy added so original data can be recovered even with some errors.',
          'FEC uses: simplex transmission, CD-ROMs, high-latency links; voice/video where low latency beats low error rate.',
          'FEC residual error rate may be high.',
          'ARQ: Idle RQ (stop-and-wait) — sender waits for ACK; time-out triggers resend; link utilisation may be low.',
          'ARQ: Continuous RQ — sliding window protocols keep multiple frames in flight.',
        ],
        examTip:
          'No return channel (simplex, CD-ROM) or huge latency (satellite) → FEC. Need near-zero errors on a duplex link → ARQ.',
        formulaOrSpec: 'FEC = correct at receiver | ARQ = detect + retransmit',
        comparisonTable: {
          headers: ['Property', 'FEC', 'ARQ'],
          rows: [
            ['Return channel needed', 'No (works on simplex)', 'Yes (ACK/NAK)'],
            ['Latency', 'Low — no retransmission', 'Higher — waits/resends'],
            ['Residual errors', 'May be high', 'Low'],
            ['Typical use', 'CD-ROM, voice, video, satellite', 'Data links, file transfer'],
          ],
        },
      },
      {
        id: 'l2-c5',
        title: 'Continuous ARQ & Sliding Windows',
        layer: 2,
        summary:
          'Continuous ARQ keeps state variables at both ends: V(S), the sequence number of the next frame to send, and V(R), the sequence number of the next expected frame. Frames carry V(S); ACKs carry V(R); an erroneous frame triggers a NAK (Reject or Selective Reject).',
        keyPoints: [
          'V(S) = send state variable: sequence number of the next frame to be sent.',
          'V(R) = receive state variable: sequence number of the expected frame.',
          'Frames are sent with V(S); ACK is sent with V(R), letting the sender free frames from its window.',
          'A 3-bit field gives 8 sequence numbers (000 to 111) and a maximum window size of 7.',
          'Go-Back-N (receiver window = 1): after a NAK/Reject, the sender resends the bad frame AND every frame after it.',
          'Selective Reject (large receiver window): only the erroneous frame is retransmitted; if the window is full with no ACK, the sender waits.',
        ],
        examTip:
          'Window = 2^n − 1, not 2^n: with 3 bits, window size 7 (not 8), so a full window of new frames can never be confused with a retransmission of the old window.',
        formulaOrSpec: 'n-bit sequence field → 2^n numbers, max window = 2^n − 1 (3 bits → 000–111, window 7)',
        comparisonTable: {
          headers: ['Scheme', 'Receiver Window', 'On Error'],
          rows: [
            ['Idle RQ (stop-and-wait)', '1 (1 frame in flight)', 'Time-out, resend single frame'],
            ['Go-Back-N', '1', 'NAK (Reject) → resend frame N and all after'],
            ['Selective Reject', 'Large', 'Selective Reject → resend only frame N'],
          ],
        },
      },
      {
        id: 'l2-c6',
        title: 'Flow Control & Medium Access Control',
        layer: 2,
        summary:
          'Flow control stops a fast sender from swamping a slow receiver using in-band X-ON/X-OFF, out-of-band RTS/CTS, or window sizing. Medium Access Control is either Primary/Secondary (polling, RTS/CTS, TDMA) or Peer-to-Peer (TDM, ALOHA, CSMA, CSMA/CD, Token Ring, Token Bus).',
        keyPoints: [
          'Flow control: in-band X-ON/X-OFF; out-of-band RTS/CTS (as in RS-232-C); or by adjusting the sliding window size.',
          'Primary/Secondary: Poll ("Do you have data for me?") / Select ("I have data for you"); TDMA in satellites with a master reference station allocating time-slots.',
          'TDM: simplest peer-to-peer — each station gets a pre-assigned time-slot.',
          'Pure ALOHA: transmit at arbitrary times, detect collision, retransmit; degrades under high traffic.',
          'CSMA listens before sending; CSMA/CD also listens while sending, aborts on collision, waits a random time; states: contention, transmission, idle.',
          'Token Ring: grab Free token → send Busy token + data → remove on return → release Free token; Token Bus = virtual ring over a physical bus.',
        ],
        examTip:
          'Random back-off in CSMA/CD prevents the same two stations from colliding again. Token Ring is fairer and more efficient than CSMA/CD under heavy load, but complex and adds token delays.',
        formulaOrSpec: 'CSMA/CD states = Contention | Transmission | Idle',
        comparisonTable: {
          headers: ['MAC Scheme', 'Type', 'Collisions?'],
          rows: [
            ['Polling / TDMA', 'Primary / Secondary', 'No — master grants access'],
            ['TDM', 'Peer-to-peer', 'No — fixed time-slots'],
            ['Pure ALOHA', 'Peer-to-peer', 'Yes — transmits anytime'],
            ['CSMA/CD', 'Peer-to-peer', 'Yes — detected and aborted'],
            ['Token Ring / Token Bus', 'Peer-to-peer', 'No — only token holder sends'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'sequence-simulator',
      title: 'Bit-Stuffing & Go-Back-N Sliding Window Lab',
      scenario:
        'A primary station sends a payload containing the flag pattern 01111110 to a secondary over an HDLC-style link. Stuff the payload, then run a Continuous ARQ exchange with 3-bit sequence numbers (000–111, max window size 7) where frame I(2) is corrupted and Go-Back-N recovery kicks in.',
      actors: ['Sender (Primary)', 'Receiver (Secondary)'],
      steps: [
        {
          id: 'st1',
          fromIndex: 0,
          toIndex: 0,
          label: 'Bit-stuff payload 01111110 → 011111010',
          detail:
            'The payload contains the flag pattern 01111110. After five consecutive 1s the sender inserts a 0, so the data can never mimic the flag.',
          stateAfter: 'Payload stuffed: 011111010, V(S)=0',
          isInteractivePrompt: true,
          options: ['011111010', '011111100', '0111111010', '01111110'],
          correctOption: '011111010',
          explanation:
            'Bit stuffing inserts a 0 after every run of five 1s: 0 11111 [0] 10 → 011111010. The receiver removes any 0 that follows five 1s to restore 01111110.',
        },
        {
          id: 'st2',
          fromIndex: 0,
          toIndex: 0,
          label: 'Frame with flags: 01111110 | data | 01111110',
          detail:
            'The stuffed payload is wrapped between opening and closing 01111110 flag sequences so the receiver can find frame boundaries.',
          stateAfter: 'Frame ready, 3-bit window: seq 000–111, max 7 outstanding',
        },
        {
          id: 'st3',
          fromIndex: 0,
          toIndex: 1,
          label: 'I(0) — seq 000',
          detail:
            'The first information frame is sent carrying its sequence number V(S)=0, after which the sender increments V(S).',
          stateAfter: 'V(S)=1, V(R)=1',
        },
        {
          id: 'st4',
          fromIndex: 0,
          toIndex: 1,
          label: 'I(1) — seq 001',
          detail:
            'Continuous ARQ does not wait for an ACK; the sender keeps transmitting while frames fit in the window of 7.',
          stateAfter: 'V(S)=2, V(R)=2',
          isInteractivePrompt: true,
          options: ['V(S)=2, V(R)=2', 'V(S)=1, V(R)=1', 'V(S)=2, V(R)=1', 'V(S)=7, V(R)=0'],
          correctOption: 'V(S)=2, V(R)=2',
          explanation:
            'After sending I(1) the sender’s next frame number V(S) becomes 2; the receiver accepted I(0) and I(1) in order so it now expects frame 2, V(R)=2.',
        },
        {
          id: 'st5',
          fromIndex: 0,
          toIndex: 1,
          label: 'I(2) — seq 010 (CRC fails: corrupted)',
          detail:
            'A noise burst flips bits in frame 2. The receiver’s CRC check fails, so the frame is discarded and V(R) stays at 2.',
          stateAfter: 'V(S)=3, V(R)=2 (frame 2 discarded)',
        },
        {
          id: 'st6',
          fromIndex: 0,
          toIndex: 1,
          label: 'I(3) — seq 011 (out of order, discarded)',
          detail:
            'With Go-Back-N the receiver window is 1, so I(3) is out of sequence (expected 2) and is discarded even though it arrived intact.',
          stateAfter: 'V(S)=4, V(R)=2',
        },
        {
          id: 'st7',
          fromIndex: 1,
          toIndex: 0,
          label: 'NAK / REJ(2)',
          detail:
            'The receiver sends a NAK (Reject) carrying V(R)=2, which also acknowledges frames 0 and 1 so the sender can free them from its window.',
          stateAfter: 'Sender frees I(0), I(1); V(R)=2',
          isInteractivePrompt: true,
          options: ['NAK / REJ(2)', 'ACK(4)', 'NAK / REJ(3)', 'ACK(2) + X-OFF'],
          correctOption: 'NAK / REJ(2)',
          explanation:
            'The receiver rejects the first frame it could not accept, which is frame 2 = its current V(R). The NAK carrying 2 implicitly acknowledges frames 0 and 1.',
        },
        {
          id: 'st8',
          fromIndex: 0,
          toIndex: 1,
          label: 'Go-Back-N: resend I(2), I(3)',
          detail:
            'The sender goes back to frame 2 and retransmits it and every frame sent after it, resetting V(S) to 2 and stepping through 2 and 3 again.',
          stateAfter: 'V(S)=4, V(R)=4',
          isInteractivePrompt: true,
          options: [
            'Go-Back-N: resend I(2), I(3)',
            'Selective Reject: resend only I(2)',
            'Resend I(0), I(1), I(2), I(3)',
            'Wait for time-out, then send I(4)',
          ],
          correctOption: 'Go-Back-N: resend I(2), I(3)',
          explanation:
            'In Go-Back-N the receiver window is 1, so all frames after the erroneous one were discarded. The sender must retransmit frame 2 and every subsequent frame (3); frames 0 and 1 were already acknowledged.',
        },
        {
          id: 'st9',
          fromIndex: 1,
          toIndex: 0,
          label: 'ACK(4) — RR, next expected 100',
          detail:
            'Frames 2 and 3 now pass the CRC check in order. The receiver acknowledges with V(R)=4 and the sender slides its window forward.',
          stateAfter: 'V(S)=4, V(R)=4, window free: 7 slots',
        },
        {
          id: 'st10',
          fromIndex: 0,
          toIndex: 1,
          label: 'I(4)…I(7)→I(0): sequence wraps 111 → 000',
          detail:
            'The 3-bit counter is modulo 8, so after seq 111 (7) the next frame uses 000 again; at most 7 frames may be unacknowledged at any time.',
          stateAfter: 'V(S) mod 8, max outstanding = 7',
          isInteractivePrompt: true,
          options: ['7', '8', '3', '15'],
          correctOption: '7',
          explanation:
            'A 3-bit field gives 8 sequence numbers (000–111) but the maximum window size is 7 (2^3 − 1), so a new window can never be confused with a retransmitted old one.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l2-f1',
        lectureId: 2,
        front: 'What is the bit-oriented framing flag sequence?',
        back: '01111110. It marks the beginning and end of each frame in bit-oriented protocols.',
        tag: 'Framing',
      },
      {
        id: 'l2-f2',
        lectureId: 2,
        front: 'Bit-stuff the payload 01111110.',
        back: '011111010 — a 0 is inserted after the five consecutive 1s so the flag pattern cannot appear in the data.',
        tag: 'Bit Stuffing',
      },
      {
        id: 'l2-f3',
        lectureId: 2,
        front: 'What do V(S) and V(R) represent in Continuous ARQ?',
        back: 'V(S) is the send state variable — sequence number of the next frame to be sent. V(R) is the receive state variable — sequence number of the next expected frame.',
        tag: 'Sliding Window',
      },
      {
        id: 'l2-f4',
        lectureId: 2,
        front: 'With a 3-bit sequence field, how many sequence numbers and what max window size?',
        back: '8 sequence numbers (000 to 111) and a maximum window size of 7 (2^3 − 1).',
        tag: 'Sliding Window',
      },
      {
        id: 'l2-f5',
        lectureId: 2,
        front: 'Go-Back-N vs. Selective Reject — what is retransmitted after an error?',
        back: 'Go-Back-N (receiver window 1) resends the erroneous frame and all frames after it. Selective Reject (large receiver window) resends only the erroneous frame.',
        tag: 'ARQ',
      },
      {
        id: 'l2-f6',
        lectureId: 2,
        front: 'When is FEC preferred over ARQ?',
        back: 'For simplex transmission, CD-ROMs, high-latency links, and voice/video where low latency matters more than a low error rate.',
        tag: 'FEC',
      },
      {
        id: 'l2-f7',
        lectureId: 2,
        front: 'Name the three states of CSMA/CD.',
        back: 'Contention, transmission and idle. Stations listen while transmitting, abort on collision and wait a random time before retrying.',
        tag: 'CSMA/CD',
      },
      {
        id: 'l2-f8',
        lectureId: 2,
        front: 'In-band vs. out-of-band flow control examples?',
        back: 'In-band: X-ON / X-OFF characters in the data stream. Out-of-band: RTS / CTS control signals (as in RS-232-C).',
        tag: 'Flow Control',
      },
    ],
    quiz: [
      {
        id: 'l2-q1',
        lectureId: 2,
        question: 'A bit-oriented sender must transmit the data bits 0111111101. What is sent on the line (between flags) after bit stuffing?',
        options: ['0111111101', '01111101101', '01111110101', '011111011101'],
        correctIndex: 1,
        explanation:
          'After the first five consecutive 1s a 0 is inserted: 0 11111 [0] 1101 → 01111101101. This guarantees the flag 01111110 never appears inside the data.',
        difficulty: 'advanced',
      },
      {
        id: 'l2-q2',
        lectureId: 2,
        question: 'A link uses a 3-bit field for V(S) and V(R). What is the maximum number of unacknowledged frames the sender may have outstanding?',
        options: ['3', '8', '7', '6'],
        correctIndex: 2,
        explanation:
          'A 3-bit field provides 8 sequence numbers (000 to 111), but the window size is 7 so that a full new window is never confused with a retransmitted one.',
        difficulty: 'core',
      },
      {
        id: 'l2-q3',
        lectureId: 2,
        question: 'Using Go-Back-N, the sender has transmitted frames 0–5. Frame 3 is corrupted. Which frames must be retransmitted?',
        options: ['Only frame 3', 'Frames 0 to 5', 'Frames 4 and 5', 'Frames 3, 4 and 5'],
        correctIndex: 3,
        explanation:
          'In Go-Back-N the receiver window size is 1, so frames 4 and 5 are discarded as out of order. After the NAK/Reject for frame 3, the sender goes back and resends 3, 4 and 5.',
        difficulty: 'advanced',
      },
      {
        id: 'l2-q4',
        lectureId: 2,
        question: 'Which error-control technique is best suited to CD-ROMs and simplex links?',
        options: ['Forward Error Correction (FEC)', 'Idle RQ (stop-and-wait)', 'Go-Back-N ARQ', 'Selective Reject ARQ'],
        correctIndex: 0,
        explanation:
          'FEC adds enough redundancy to recover the original data without a return channel, making it ideal for simplex transmission, CD-ROMs and high-latency links. All ARQ schemes require ACK/NAK feedback.',
        difficulty: 'core',
      },
      {
        id: 'l2-q5',
        lectureId: 2,
        question: 'In a CSMA/CD network, why does a station wait a random period of time before retransmitting after a collision?',
        options: [
          'To let the token circulate back to it',
          'To reduce the chance that the same stations collide again',
          'To wait for the reference station to assign a time-slot',
          'To allow the receiver to send a NAK',
        ],
        correctIndex: 1,
        explanation:
          'CSMA/CD stations abort on collision and back off for a random time; if they waited a fixed time they would retransmit simultaneously and collide again. Token passing and reference-station slots belong to other MAC schemes.',
        difficulty: 'core',
      },
      {
        id: 'l2-q6',
        lectureId: 2,
        question: 'Which MAC scheme uses a master reference station that periodically announces which station may use each time-slot, as in satellite networks?',
        options: ['Pure ALOHA', 'Token Bus', 'TDMA', 'CSMA/CD'],
        correctIndex: 2,
        explanation:
          'TDMA is a non-polling Primary/Secondary scheme used in satellite networks: secondaries request the channel and the reference station transmits control information allocating time-slots.',
        difficulty: 'core',
      },
    ],
  },
];

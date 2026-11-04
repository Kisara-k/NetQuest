import type { LectureModule } from '@/types/curriculum';

const SECTOR_NAME = 'End-to-End Transport & Wireless IoT';

export const SECTOR4_LECTURES: LectureModule[] = [
  // ───────────────────────────── Lecture 8 ─────────────────────────────
  {
    id: 8,
    title: 'Transport Layer',
    shortTitle: 'Transport Layer',
    sectorId: 4,
    sectorName: SECTOR_NAME,
    estimatedMinutes: 30,
    osiLayers: [4],
    tagline:
      'The first truly end-to-end layer: turning an unreliable network into a dependable pipe between processes.',
    concepts: [
      {
        id: 'l8-c1',
        title: 'Objectives & Position of the Transport Layer',
        layer: 4,
        summary:
          'The transport layer provides efficient, reliable and cost-effective end-to-end delivery of data and shields the upper layers from the peculiarities of the network. It runs only in the end stations, while the network layer runs mostly inside the network (in routers).',
        keyPoints: [
          'Goal: end-to-end delivery that is efficient, reliable and cost-effective.',
          'Shields Session/Presentation/Application layers from network peculiarities.',
          'Runs in end stations (hosts); the network layer runs mostly in routers.',
          'Can make the service MORE reliable than the underlying network service.',
          'Layers 1–4 = end-to-end data transmission service ("network people"); Layers 5–7 = users of that service ("applications people").',
          'The transport layer is the interface to the network for most programmers.',
        ],
        examTip:
          'If a question asks "which layer is the first end-to-end layer / runs only in hosts?" — the answer is Transport (L4), not Network (L3).',
        formulaOrSpec: 'L1–L4 = Data Transmission Service | L5–L7 = Application Users',
        comparisonTable: {
          headers: ['Aspect', 'Transport Layer (L4)', 'Network Layer (L3)'],
          rows: [
            ['Where it runs', 'End stations (hosts)', 'Mostly inside the network (routers)'],
            ['Scope', 'End-to-end, process-to-process', 'Host-to-host, hop-by-hop'],
            ['Reliability', 'Can improve on network service', 'Often best-effort'],
            ['Addressing', 'TSAP (IP + port)', 'NSAP / IP address'],
          ],
        },
      },
      {
        id: 'l8-c2',
        title: 'Functions & Types of Transport Service',
        layer: 4,
        summary:
          'The transport layer ensures data reaches the other end and deals with network peculiarities such as fragmentation, multiplexing and inverse multiplexing. It manages multiple connections per host, establishes and deletes connections, and provides flow control.',
        keyPoints: [
          'Ensure delivery to the other end; deal with NW-layer peculiarities (fragmentation).',
          'Multiplexing: many connections on one host kept separate ("don\'t want the web server to get e-mail").',
          'Inverse multiplexing: one task over multiple network connections, e.g. download accelerators.',
          'Connection establishment/deletion (naming) and flow control.',
          'Service types: connection-oriented vs connectionless, reliable vs unreliable, multicast.',
          'Internet: TCP = connection-oriented, reliable, unicast; UDP = connectionless, unacknowledged, unicast/multicast.',
        ],
        examTip:
          'Download accelerators are the textbook example of INVERSE multiplexing (one task → many network connections), not plain multiplexing.',
        formulaOrSpec: 'Multiplexing: N connections → 1 host | Inverse multiplexing: 1 task → N connections',
        comparisonTable: {
          headers: ['Property', 'TCP', 'UDP'],
          rows: [
            ['Connection', 'Connection-oriented', 'Connectionless'],
            ['Reliability', 'Reliable', 'Unacknowledged at TP layer'],
            ['Delivery', 'Unicast', 'Unicast / Multicast'],
          ],
        },
      },
      {
        id: 'l8-c3',
        title: 'Transport vs Data Link Layer',
        layer: 4,
        summary:
          'The transport layer has functions similar to the data link layer — connections, flow control and error control. The crucial difference is scope: the transport layer operates end-to-end across a whole network, while the DLL operates on a single link.',
        keyPoints: [
          'Shared functions: connections, flow control, error control.',
          'DLL: single physical link, predictable delay, no reordering on the wire.',
          'Transport: end-to-end across many routers — packets may be lost, delayed, duplicated or reordered.',
          'End-to-end path requires explicit addressing (TSAPs) and more complex connection management.',
          'Buffering: the TP sender must keep copies of sent data until acknowledged.',
        ],
        examTip:
          'Same functions, different scope: "end-to-end vs single link" is the one-line answer examiners want.',
        formulaOrSpec: 'DLL = hop (single link) | Transport = end-to-end (whole path)',
        comparisonTable: {
          headers: ['Aspect', 'Transport Layer', 'Data Link Layer'],
          rows: [
            ['Scope', 'End-to-end', 'Single link'],
            ['Addressing', 'Explicit TSAP needed', 'Implicit (one link) / MAC'],
            ['Delayed duplicates', 'Major hazard (network stores packets)', 'Not an issue on a wire'],
            ['Functions', 'Connections, flow & error control', 'Connections, flow & error control'],
          ],
        },
      },
      {
        id: 'l8-c4',
        title: 'Transport Service Primitives',
        layer: 4,
        summary:
          'Applications access the transport service via five primitives. A server performs a passive Listen, a client actively Connects, both exchange data with Send/Receive, and either side releases with Disconnect.',
        keyPoints: [
          'LISTEN — block, waiting for an incoming connection (passive open, server).',
          'CONNECT — actively attempt to establish a connection (client).',
          'SEND — send data over the connection.',
          'RECEIVE — block until data arrives.',
          'DISCONNECT — release the connection.',
        ],
        examTip:
          'Order of a typical session: server LISTEN → client CONNECT → SEND/RECEIVE → DISCONNECT. LISTEN is passive; CONNECT is active.',
        formulaOrSpec: 'LISTEN → CONNECT → SEND ⇄ RECEIVE → DISCONNECT',
      },
      {
        id: 'l8-c5',
        title: 'Addressing: TSAPs, Ports & Client-Server',
        layer: 4,
        summary:
          'Transport connections are made to a transport address called a TSAP (Transport Service Access Point). Usually a TSAP = host address + an additional number called a port, letting a host hold many connections, even several between the same pair of hosts.',
        keyPoints: [
          'Each host may contain one or more TSAPs; TSAP = Host IP + Port.',
          'Ports distinguish multiple connections/datagrams on the same host (multiplexing).',
          'Servers listen on a given port (e.g. "listening on port 80 and 90"); the server hands the connection to the responsible service process.',
          'Port identification: pre-arrangement (e.g. in a URL), well-known ports, a Portmapper, or by an application.',
          'Well-known ports: SMTP = 25, HTTP = 80.',
          'Portmapper maps between service names and port numbers.',
        ],
        examTip:
          'TSAP is the transport-layer analogue of an address: IP alone identifies the host, IP + port identifies the process endpoint.',
        formulaOrSpec: 'TSAP = Host IP Address + Port Number (SMTP=25, HTTP=80)',
      },
      {
        id: 'l8-c6',
        title: 'Connection Establishment & Release Hazards',
        layer: 4,
        summary:
          'Simple request/accept setup works only on a reliable network; real networks can lose, delay or duplicate packets, so old duplicate connection requests can create phantom connections. Sequence numbers and a three-way handshake fix this, while release must ensure both sides agree, no data is lost and nobody waits forever.',
        keyPoints: [
          'Scenarios: (a) normal operation, (b) old CONNECTION REQUEST appearing out of nowhere, (c) duplicate CR and duplicate ACK.',
          'Sequence numbers let the receiver reject a delayed duplicate CR that does not match a current request.',
          'Release goals: both sides agree the connection is closed, no data loss, no waiting forever.',
          'Release (a) normal three-way handshake: DR → DR → ACK.',
          'Release (b) final ACK lost — the timer on the other side releases the connection anyway.',
          'Release (c) response lost and (d) response + subsequent DRs lost — retransmit DR on timeout, give up after N attempts.',
        ],
        examTip:
          'Trap: without sequence numbers a delayed duplicate CR looks legitimate. The 3-way handshake lets the real client say "I never sent that" (REJECT).',
        formulaOrSpec: 'Release = DR → DR → ACK (+ timers to break deadlock)',
        comparisonTable: {
          headers: ['Release scenario', 'What is lost', 'Recovery'],
          rows: [
            ['(a) Normal', 'Nothing', 'DR, DR, ACK → both release'],
            ['(b) Final ACK lost', 'Last ACK', 'Responder times out and releases'],
            ['(c) Response lost', 'Responder DR', 'Initiator times out, resends DR'],
            ['(d) Response + DRs lost', 'Repeated DRs', 'N retries then both sides time out'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'sequence-simulator',
      title: 'Transport TSAP Multiplexer & Connection Hazard Simulator',
      scenario:
        'A mail/web server listens on TSAP ports 25 and 80. A client connects across a network that can lose, delay and duplicate packets. Predict each primitive and how the hazards (old duplicate CR, lost DR/ACK) are resolved.',
      actors: ['Client Host', 'Network', 'Server Host'],
      steps: [
        {
          id: 'st1',
          fromIndex: 2,
          toIndex: 2,
          label: 'LISTEN on TSAP 10.0.0.5:80 and :25',
          detail:
            'The server process performs a passive open, blocking until a client connects to the HTTP (80) or SMTP (25) port.',
          stateAfter: 'Client: IDLE / Server: LISTENING (80, 25)',
          isInteractivePrompt: true,
          options: ['CONNECT', 'LISTEN', 'RECEIVE', 'DISCONNECT'],
          correctOption: 'LISTEN',
          explanation:
            'LISTEN is the primitive that waits for an incoming connection; servers listen on well-known ports such as HTTP 80 and SMTP 25.',
        },
        {
          id: 'st2',
          fromIndex: 0,
          toIndex: 1,
          label: 'CONNECT → CR (seq=x) to 10.0.0.5:80',
          detail:
            'The browser issues CONNECT; the transport entity sends a CONNECTION REQUEST carrying a fresh sequence number x from source port 1234 to destination TSAP IP:80.',
          stateAfter: 'Client: CR SENT (seq=x) / Server: LISTENING',
          isInteractivePrompt: true,
          options: [
            'TSAP = MAC address of the server',
            'TSAP = Server IP address + port 80',
            'TSAP = Port 80 only',
            'TSAP = Server hostname only',
          ],
          correctOption: 'TSAP = Server IP address + port 80',
          explanation:
            'A TSAP is a host address plus an additional number called a port; HTTP uses the well-known port 80.',
        },
        {
          id: 'st3',
          fromIndex: 1,
          toIndex: 2,
          label: 'CR (seq=x) delivered to port 80',
          detail:
            'The network forwards the CR; the server transport entity demultiplexes it to the HTTP service process because the destination port is 80, not 25.',
          stateAfter: 'Client: CR SENT / Server: CR RECEIVED (seq=x)',
        },
        {
          id: 'st4',
          fromIndex: 2,
          toIndex: 0,
          label: 'ACK (seq=y, ack=x)',
          detail:
            'The server accepts and replies with its own sequence number y, acknowledging x. The client confirms with DATA/ACK (seq=x, ack=y): a three-way handshake.',
          stateAfter: 'Client: ESTABLISHED / Server: ESTABLISHED',
        },
        {
          id: 'st5',
          fromIndex: 1,
          toIndex: 2,
          label: 'Old duplicate CR (seq=z) arrives late',
          detail:
            'A CR from an earlier, long-finished session was delayed inside the network and now appears out of nowhere at the server.',
          stateAfter: 'Client: ESTABLISHED / Server: CR RECEIVED (seq=z, suspicious)',
          isInteractivePrompt: true,
          options: [
            'Server accepts it and opens a second connection',
            'Server replies ACK(seq=w, ack=z); client answers REJECT(ack=w), so no phantom connection',
            'Network layer silently discards all duplicates',
            'Server ignores it forever and waits',
          ],
          correctOption:
            'Server replies ACK(seq=w, ack=z); client answers REJECT(ack=w), so no phantom connection',
          explanation:
            'The network can delay and duplicate packets. With sequence numbers and a 3-way handshake, the server asks the client to confirm; the client knows it never sent z and rejects it.',
        },
        {
          id: 'st6',
          fromIndex: 0,
          toIndex: 2,
          label: 'SEND / RECEIVE: GET /index.html',
          detail:
            'The client SENDs data; the server RECEIVEs it. The sender keeps copies of sent data in its buffer until acknowledged, for flow control and recovery.',
          stateAfter: 'Client: ESTABLISHED (buffer holds unacked data) / Server: ESTABLISHED',
        },
        {
          id: 'st7',
          fromIndex: 0,
          toIndex: 2,
          label: 'DISCONNECT → DR (start timer)',
          detail:
            'The client issues DISCONNECT; its transport entity sends a DISCONNECTION REQUEST and starts a timer so it never waits forever.',
          stateAfter: 'Client: DR SENT (timer on) / Server: ESTABLISHED',
          isInteractivePrompt: true,
          options: ['RECEIVE', 'LISTEN', 'DISCONNECT', 'CONNECT'],
          correctOption: 'DISCONNECT',
          explanation:
            'DISCONNECT is the primitive that releases a connection; both sides must agree it is closed without losing data.',
        },
        {
          id: 'st8',
          fromIndex: 2,
          toIndex: 0,
          label: 'DR (server response) — LOST',
          detail:
            'The server answers with its own DR and starts a timer, but the network loses it.',
          stateAfter: 'Client: DR SENT (waiting) / Server: DR SENT (timer on)',
        },
        {
          id: 'st9',
          fromIndex: 0,
          toIndex: 0,
          label: 'Timeout → retransmit DR',
          detail:
            'The client timer expires and it resends DR (scenario c, response lost). The server replies DR again and the client sends the final ACK.',
          stateAfter: 'Client: RELEASED / Server: ACK pending',
          isInteractivePrompt: true,
          options: [
            'Client waits forever for the server DR',
            'Client times out and retransmits DR',
            'Client sends a new CR',
            'Client keeps sending data',
          ],
          correctOption: 'Client times out and retransmits DR',
          explanation:
            'Release must never wait forever: on timeout the initiator resends DR, giving up after N attempts (scenario d).',
        },
        {
          id: 'st10',
          fromIndex: 2,
          toIndex: 2,
          label: 'Final ACK lost → server timer releases',
          detail:
            'Even if the final ACK is lost (scenario b), the server timer expires and it releases the connection on its own.',
          stateAfter: 'Client: RELEASED / Server: RELEASED',
        },
      ],
    },
    flashcards: [
      {
        id: 'l8-f1',
        lectureId: 8,
        front: 'Where does the transport layer run compared with the network layer?',
        back: 'The transport layer runs only in end stations (hosts); the network layer runs mostly inside the network, in routers.',
        tag: 'Position',
      },
      {
        id: 'l8-f2',
        lectureId: 8,
        front: 'Name the five transport service primitives.',
        back: 'LISTEN (wait for incoming connection), CONNECT (establish), SEND (send data), RECEIVE (wait for data), DISCONNECT (release).',
        tag: 'Primitives',
      },
      {
        id: 'l8-f3',
        lectureId: 8,
        front: 'What is a TSAP?',
        back: 'A Transport Service Access Point — the transport address a connection is made to, usually a host address plus a port number.',
        tag: 'TSAP',
      },
      {
        id: 'l8-f4',
        lectureId: 8,
        front: 'Well-known ports for SMTP and HTTP?',
        back: 'SMTP = 25, HTTP = 80. Ports can also be found by pre-arrangement (URL), a Portmapper, or an application.',
        tag: 'Ports',
      },
      {
        id: 'l8-f5',
        lectureId: 8,
        front: 'What is inverse multiplexing? Give an example.',
        back: 'Using multiple network connections for the same task to increase throughput — e.g. download accelerators.',
        tag: 'Multiplexing',
      },
      {
        id: 'l8-f6',
        lectureId: 8,
        front: 'Why can naive connection establishment fail on a real network?',
        back: 'The network may lose, delay or duplicate packets, so an old duplicate connection request may appear out of nowhere. Sequence numbers (and a 3-way handshake) prevent phantom connections.',
        tag: 'Delayed Duplicates',
      },
      {
        id: 'l8-f7',
        lectureId: 8,
        front: 'Three requirements of connection release?',
        back: 'Both sides must agree the connection is closed, no data is lost, and no side waits forever for the other.',
        tag: 'Release',
      },
      {
        id: 'l8-f8',
        lectureId: 8,
        front: 'What happens if the final ACK of a release handshake is lost?',
        back: 'The side waiting for it times out and releases the connection anyway, so the connection still closes.',
        tag: 'Release',
      },
    ],
    quiz: [
      {
        id: 'l8-q1',
        lectureId: 8,
        question: 'Which statement correctly contrasts the transport layer with the data link layer?',
        options: [
          'The transport layer has no flow control, the DLL does',
          'Both provide connections, flow and error control, but transport works end-to-end while the DLL works on a single link',
          'The DLL works end-to-end while transport works on a single link',
          'Only the transport layer does error control',
        ],
        correctIndex: 1,
        explanation:
          'The slides state the TPL has similar functions to the DLL — connections, flow control, error control — but the transport layer operates end-to-end while the DLL operates on a single link.',
        difficulty: 'core',
      },
      {
        id: 'l8-q2',
        lectureId: 8,
        question:
          'A browser on host 192.168.1.7 opens a web page on server 10.0.0.5. Which TSAP is the client connecting to?',
        options: ['10.0.0.5 port 25', '192.168.1.7 port 80', '10.0.0.5 port 80', 'The MAC address of 10.0.0.5'],
        correctIndex: 2,
        explanation:
          'A TSAP is a host address plus a port; web servers listen on the well-known HTTP port 80 (SMTP is 25), so the destination TSAP is 10.0.0.5:80.',
        difficulty: 'core',
      },
      {
        id: 'l8-q3',
        lectureId: 8,
        question: 'Which transport primitive is a passive operation that waits for an incoming connection?',
        options: ['CONNECT', 'SEND', 'DISCONNECT', 'LISTEN'],
        correctIndex: 3,
        explanation:
          'LISTEN waits for an incoming connection; CONNECT actively establishes one. Servers LISTEN on a port and clients CONNECT to it.',
        difficulty: 'core',
      },
      {
        id: 'l8-q4',
        lectureId: 8,
        question: 'A download accelerator splits one file transfer across four parallel network connections. This is:',
        options: ['Inverse multiplexing', 'Multiplexing', 'Fragmentation', 'Flow control'],
        correctIndex: 0,
        explanation:
          'The slides cite download accelerators as the TP layer using multiple network connections for the same task — inverse multiplexing.',
        difficulty: 'core',
      },
      {
        id: 'l8-q5',
        lectureId: 8,
        question:
          'A server receives a CONNECTION REQUEST that was actually delayed in the network from a session that ended minutes ago. What prevents a phantom connection?',
        options: [
          'The network layer guarantees no duplicates',
          'Sequence numbers plus a handshake in which the real client rejects the unknown sequence number',
          'The server accepts every CR and closes idle ones later',
          'Using a larger port number for the server',
        ],
        correctIndex: 1,
        explanation:
          'The network may lose, delay or duplicate packets. Sequence numbers let the server ask the client to confirm; the client recognises it never sent that request and replies REJECT.',
        difficulty: 'advanced',
      },
      {
        id: 'l8-q6',
        lectureId: 8,
        question:
          'Host A sends DR, but Host B\'s responding DR and all of A\'s subsequent retransmitted DRs are lost. What happens (scenario d)?',
        options: [
          'Both hosts wait forever',
          'Host A opens a new connection',
          'After N retries/timeouts both sides release the connection',
          'Data is retransmitted from the beginning',
        ],
        correctIndex: 2,
        explanation:
          'A release must never wait forever: the initiator retransmits DR on timeout and gives up after N attempts, while the responder\'s own timer also releases the connection.',
        difficulty: 'advanced',
      },
    ],
  },

  // ───────────────────────────── Lecture 9 ─────────────────────────────
  {
    id: 9,
    title: 'Internet Transport Protocols (TCP & UDP)',
    shortTitle: 'TCP & UDP',
    sectorId: 4,
    sectorName: SECTOR_NAME,
    estimatedMinutes: 40,
    osiLayers: [4],
    tagline: 'Every byte numbered, every connection a 4-tuple: master TCP\'s handshake, ACKs and 11-state machine.',
    concepts: [
      {
        id: 'l9-c1',
        title: 'Ports & the 4-Tuple Connection ID',
        layer: 4,
        summary:
          'Both TCP and UDP use 16-bit ports (0–65535) for transport address selection and multiplexing. Source IP, source port, destination IP and destination port together uniquely identify a connection.',
        keyPoints: [
          '4-tuple: (Src IP, Src Port, Dst IP, Dst Port) uniquely identifies a connection.',
          'Ports are 16-bit integers in the range 0–65535.',
          'Theoretical max connections: 2^32 × 2^16 × 2^32 × 2^16 = 2^96.',
          'Ports < 1024 are privileged (need system privileges); clients generally use ports ≥ 1024.',
          'Client→server: src=1234, dst=80; server→client: src=80, dst=1234.',
          'Well-known ports (HTTP, DNS, ...) are listed by IANA.',
        ],
        examTip:
          'Ports are swapped in the reply direction. Many students forget that the server\'s SOURCE port in responses is 80.',
        formulaOrSpec: 'Max connections = 2^32 × 2^16 × 2^32 × 2^16 = 2^96',
        comparisonTable: {
          headers: ['Direction', 'Source Port', 'Destination Port'],
          rows: [
            ['Client → Server (request)', '1234 (ephemeral, ≥1024)', '80 (well-known, <1024)'],
            ['Server → Client (response)', '80', '1234'],
          ],
        },
      },
      {
        id: 'l9-c2',
        title: 'UDP — User Datagram Protocol',
        layer: 4,
        summary:
          'UDP is a connectionless, unacknowledged transport used for short messages where TCP connection overhead is inappropriate. It adds only an 8-byte header providing ports and a checksum; the application may provide reliability itself.',
        keyPoints: [
          '8-byte header: Source Port (16), Dest Port (16), UDP Length (16), UDP Checksum (16).',
          'No connection setup, no ACKs, no ordering — only ports + checksum.',
          'Used for: VoIP, DNS, Sun NFS, Remote Procedure Calls (RPC).',
          'Encapsulation: UDP segment inside IP packet inside DL frame.',
          'Supports unicast and multicast.',
        ],
        examTip: 'UDP header = 4 fields × 16 bits = 8 bytes. TCP base header = 20 bytes.',
        formulaOrSpec: 'UDP Header = SrcPort(2B) + DstPort(2B) + Length(2B) + Checksum(2B) = 8 Bytes',
        comparisonTable: {
          headers: ['Feature', 'UDP', 'TCP'],
          rows: [
            ['Connection', 'Connectionless', 'Connection-oriented (3-way handshake)'],
            ['Header size', '8 bytes', '20 bytes (base)'],
            ['Reliability', 'None (app may add)', 'Reliable, in-order byte stream'],
            ['Typical use', 'VoIP, DNS, NFS, RPC', 'Web, e-mail, file transfer'],
          ],
        },
      },
      {
        id: 'l9-c3',
        title: 'TCP Overview & Segment Size',
        layer: 4,
        summary:
          'TCP is point-to-point, reliable, in-order, full-duplex, flow-controlled, pipelined and multiplexed. It is a byte stream with no message boundaries: every byte is numbered. A segment is a 20-byte header plus 0 or more data bytes carried inside an IP packet.',
        keyPoints: [
          'Point-to-point: one sender, one receiver; full duplex.',
          'Byte stream: no "message boundaries", each byte is numbered.',
          'Connection-oriented handshaking initialises sender/receiver state; flow controlled; pipelined (window size).',
          'Max segment = 65535 − 20 (IP header) = 65515 bytes.',
          'Max TCP data = 65515 − 20 (TCP header) = 65495 bytes.',
          'Header fields: ports, sequence #, ACK #, head len, flags URG/ACK/PSH/RST/SYN/FIN, receive window, checksum, urgent ptr, options.',
        ],
        examTip:
          'Calculation favourite: 65535 − 20 − 20 = 65495 bytes of TCP data. Sequence numbers count BYTES, not segments.',
        formulaOrSpec: 'Max TCP data = 65535 − 20 (IP) − 20 (TCP) = 65495 B',
      },
      {
        id: 'l9-c4',
        title: 'TCP Three-Way Handshake',
        layer: 4,
        summary:
          'The server performs a passive open (listen). The client sends a SYN with a random initial sequence number x; the server replies SYN+ACK with seq=y, ack=x+1; the client finishes with ACK seq=x+1, ack=y+1. Missing replies trigger timeout and retransmission.',
        keyPoints: [
          'Step 1: Client → SYN (SYN=1, ACK=0, seq=x) — x is "random".',
          'Step 2: Server → SYN+ACK (seq=y, ack=x+1).',
          'Step 3: Client → ACK (seq=x+1, ack=y+1).',
          'A SYN consumes one sequence number, hence x+1 and y+1.',
          'Both hosts must agree whether the connection is established; lost replies → timeout + retransmit.',
        ],
        examTip: 'Write it as x → (y, x+1) → (x+1, y+1). The ACK number is always the NEXT byte expected.',
        formulaOrSpec: 'SYN(seq=x) → SYN+ACK(seq=y, ack=x+1) → ACK(seq=x+1, ack=y+1)',
      },
      {
        id: 'l9-c5',
        title: 'Reliable Transfer: Cumulative ACKs, Timers & RTT',
        layer: 4,
        summary:
          'TCP builds reliable transfer over unreliable IP using pipelined segments, cumulative ACKs and a single retransmission timer. Sequence number = byte-stream number of the first data byte; ACK number = next byte expected from the other side.',
        keyPoints: [
          'Seq # = number of first byte in the segment; ACK # = next byte expected (cumulative).',
          'Single retransmission timer (for the oldest unacked segment); timeout → retransmit that segment, restart timer.',
          'Retransmissions triggered by timeouts and duplicate ACKs.',
          'Scenarios: lost ACK, premature timeout, cumulative ACK covers an earlier lost ACK.',
          'Timeout must exceed RTT: too short → premature timeouts; too long → slow loss reaction.',
          'SampleRTT measured per segment, ignoring retransmissions, then smoothed (EstimatedRTT).',
        ],
        examTip:
          'Seq=92 with 8 bytes → ACK=100. If ACK=100 is lost but ACK=120 arrives before timeout, nothing is resent (cumulative ACK).',
        formulaOrSpec: 'ACK # = Seq # + data bytes (next byte expected)',
        comparisonTable: {
          headers: ['Scenario', 'What happens', 'Result'],
          rows: [
            ['Lost ACK', 'Seq=92 ACK lost, timer expires', 'Seq=92 resent; receiver re-ACKs 100'],
            ['Premature timeout', 'ACKs delayed beyond timeout', 'Unnecessary retransmission'],
            ['Cumulative ACK', 'ACK=100 lost, ACK=120 arrives', 'No retransmission needed'],
          ],
        },
      },
      {
        id: 'l9-c6',
        title: 'Connection Teardown & the 11-State TCP FSM',
        layer: 4,
        summary:
          'Either side may close, while the other may still have data. A sends FIN; B replies ACK and FIN (in any order); A ACKs and enters TIMED_WAIT to let all packets die off before CLOSED. The TCP engine has 11 states.',
        keyPoints: [
          'CLOSED, LISTEN, SYN_RCVD, SYN_SENT, ESTABLISHED.',
          'FIN_WAIT_1: app said it is finished; FIN_WAIT_2: other side agreed to close.',
          'TIMED_WAIT: wait for all packets to die off; CLOSING: both closed simultaneously.',
          'CLOSE_WAIT: other side initiated release; LAST_ACK: wait for final ACK / packets to die off.',
          'Active closer path: ESTABLISHED → FIN_WAIT_1 → FIN_WAIT_2 → TIMED_WAIT → CLOSED.',
          'Passive closer path: ESTABLISHED → CLOSE_WAIT → LAST_ACK → CLOSED.',
        ],
        examTip:
          'Only the ACTIVE closer enters TIMED_WAIT. The passive closer goes CLOSE_WAIT → LAST_ACK.',
        formulaOrSpec: '11 states: CLOSED, LISTEN, SYN_RCVD, SYN_SENT, ESTABLISHED, FIN_WAIT_1, FIN_WAIT_2, TIMED_WAIT, CLOSING, CLOSE_WAIT, LAST_ACK',
        comparisonTable: {
          headers: ['State', 'Meaning'],
          rows: [
            ['SYN_RCVD', 'Connection request arrived; waiting for ACK'],
            ['SYN_SENT', 'App has started to open a connection'],
            ['FIN_WAIT_1', 'The app has said it is finished'],
            ['FIN_WAIT_2', 'The other side has agreed to close'],
            ['TIMED_WAIT', 'Wait for all packets to die off'],
            ['CLOSING', 'Both sides tried to close simultaneously'],
            ['CLOSE_WAIT', 'The other side has initiated a release'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'sequence-simulator',
      title: 'TCP 3-Way Handshake, Byte-Stream Seq/ACK & 11-State FSM Lab',
      scenario:
        'Client (port 1234) opens a TCP connection to Server (port 80) with ISN x=1000; server ISN y=5000. Data is sent in 100-byte segments, one is lost, and the client then closes. Predict each segment and FSM state.',
      actors: ['Client', 'Server'],
      steps: [
        {
          id: 'st1',
          fromIndex: 1,
          toIndex: 1,
          label: 'Passive open: listen on port 80',
          detail: 'The server application performs a listen on port 80, moving its TCP engine from CLOSED to LISTEN.',
          stateAfter: 'CLOSED / LISTEN',
        },
        {
          id: 'st2',
          fromIndex: 0,
          toIndex: 1,
          label: 'SYN (seq=1000)',
          detail: 'The client sends a segment with SYN=1, ACK=0 and a random initial sequence number x=1000.',
          stateAfter: 'SYN_SENT / LISTEN',
          isInteractivePrompt: true,
          options: ['SYN (seq=1000)', 'SYN+ACK (seq=1000, ack=5001)', 'ACK (seq=1001, ack=5001)', 'FIN (seq=1000)'],
          correctOption: 'SYN (seq=1000)',
          explanation: 'The handshake starts with a SYN carrying the client\'s random sequence number x; ACK is reset.',
        },
        {
          id: 'st3',
          fromIndex: 1,
          toIndex: 0,
          label: 'SYN+ACK (seq=5000, ack=1001)',
          detail: 'The server replies with SYN and ACK set: its own seq=y=5000 and ack=x+1=1001.',
          stateAfter: 'SYN_SENT / SYN_RCVD',
          isInteractivePrompt: true,
          options: [
            'SYN+ACK (seq=5000, ack=1000)',
            'SYN+ACK (seq=5000, ack=1001)',
            'SYN+ACK (seq=1001, ack=5000)',
            'ACK (seq=5001, ack=1001)',
          ],
          correctOption: 'SYN+ACK (seq=5000, ack=1001)',
          explanation: 'Server sends seq=y and ack=x+1, because the SYN consumed sequence number x.',
        },
        {
          id: 'st4',
          fromIndex: 0,
          toIndex: 1,
          label: 'ACK (seq=1001, ack=5001)',
          detail: 'The client completes the three-way handshake with seq=x+1, ack=y+1. Both sides are now ESTABLISHED.',
          stateAfter: 'ESTABLISHED / ESTABLISHED',
        },
        {
          id: 'st5',
          fromIndex: 0,
          toIndex: 1,
          label: 'Data seq=1001 (100 B) ✓, seq=1101 (100 B) ✗ LOST',
          detail:
            'The client pipelines two 100-byte segments. Bytes 1001–1100 arrive; the segment starting at byte 1101 is lost in the network. The single retransmission timer is running.',
          stateAfter: 'ESTABLISHED / ESTABLISHED',
        },
        {
          id: 'st6',
          fromIndex: 1,
          toIndex: 0,
          label: 'ACK (ack=1101)',
          detail: 'The server cumulatively acknowledges bytes up to 1100; the ACK number is the next byte expected: 1101.',
          stateAfter: 'ESTABLISHED / ESTABLISHED',
          isInteractivePrompt: true,
          options: ['ACK (ack=1001)', 'ACK (ack=1100)', 'ACK (ack=1101)', 'ACK (ack=1201)'],
          correctOption: 'ACK (ack=1101)',
          explanation:
            'TCP numbers bytes: seq 1001 + 100 bytes → next expected byte is 1101. ACKs are cumulative, so 1201 cannot be acknowledged while 1101–1200 is missing.',
        },
        {
          id: 'st7',
          fromIndex: 0,
          toIndex: 1,
          label: 'Timeout → retransmit seq=1101 (100 B); ACK (ack=1201)',
          detail:
            'The timer for the oldest unacked segment expires; the client retransmits seq=1101 and restarts the timer. The server then ACKs 1201. This SampleRTT is ignored for RTT estimation.',
          stateAfter: 'ESTABLISHED / ESTABLISHED',
        },
        {
          id: 'st8',
          fromIndex: 0,
          toIndex: 1,
          label: 'FIN (seq=1201)',
          detail: 'The client application closes; TCP sends FIN and enters FIN_WAIT_1. The server learns the other side initiated release.',
          stateAfter: 'FIN_WAIT_1 / CLOSE_WAIT',
          isInteractivePrompt: true,
          options: ['FIN_WAIT_1 / CLOSE_WAIT', 'TIMED_WAIT / LAST_ACK', 'CLOSING / CLOSING', 'FIN_WAIT_2 / LISTEN'],
          correctOption: 'FIN_WAIT_1 / CLOSE_WAIT',
          explanation:
            'The active closer enters FIN_WAIT_1 ("the app has said it is finished"); the receiver of the FIN enters CLOSE_WAIT ("the other side has initiated a release").',
        },
        {
          id: 'st9',
          fromIndex: 1,
          toIndex: 0,
          label: 'ACK (ack=1202), then FIN (seq=5001)',
          detail:
            'The server ACKs the FIN (client → FIN_WAIT_2), finishes sending its data, then sends its own FIN and enters LAST_ACK.',
          stateAfter: 'FIN_WAIT_2 / LAST_ACK',
        },
        {
          id: 'st10',
          fromIndex: 0,
          toIndex: 1,
          label: 'ACK (ack=5002) → TIMED_WAIT',
          detail:
            'The client ACKs the server FIN and waits in TIMED_WAIT for all packets to die off before CLOSED; the server closes on receiving the ACK.',
          stateAfter: 'TIMED_WAIT / CLOSED',
          isInteractivePrompt: true,
          options: ['CLOSED / TIMED_WAIT', 'TIMED_WAIT / CLOSED', 'LAST_ACK / CLOSED', 'CLOSE_WAIT / CLOSED'],
          correctOption: 'TIMED_WAIT / CLOSED',
          explanation:
            'Only the active closer enters TIMED_WAIT to absorb delayed duplicates; the passive closer goes LAST_ACK → CLOSED when the final ACK arrives.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l9-f1',
        lectureId: 9,
        front: 'Which four values uniquely identify a TCP/UDP connection?',
        back: 'The 4-tuple (Source IP, Source Port, Destination IP, Destination Port); theoretical maximum 2^32 × 2^16 × 2^32 × 2^16 = 2^96 combinations.',
        tag: '4-Tuple',
      },
      {
        id: 'l9-f2',
        lectureId: 9,
        front: 'What port ranges are privileged vs used by clients?',
        back: 'Ports < 1024 are privileged (need system privileges, well-known services); clients generally use ports ≥ 1024. Ports are 16-bit: 0–65535.',
        tag: 'Ports',
      },
      {
        id: 'l9-f3',
        lectureId: 9,
        front: 'List the UDP header fields and its size.',
        back: 'Source Port, Destination Port, UDP Length, UDP Checksum — 4 × 16 bits = 8 bytes.',
        tag: 'UDP',
      },
      {
        id: 'l9-f4',
        lectureId: 9,
        front: 'Maximum TCP data in one segment?',
        back: '65535 − 20 (IP header) = 65515 bytes max segment; 65515 − 20 (TCP header) = 65495 bytes of data.',
        tag: 'TCP Size',
      },
      {
        id: 'l9-f5',
        lectureId: 9,
        front: 'State the TCP three-way handshake with sequence/ACK numbers.',
        back: 'SYN (seq=x) → SYN+ACK (seq=y, ack=x+1) → ACK (seq=x+1, ack=y+1).',
        tag: '3-Way Handshake',
      },
      {
        id: 'l9-f6',
        lectureId: 9,
        front: 'What do TCP sequence and ACK numbers count?',
        back: 'Bytes, not segments. Seq # = byte-stream number of the first data byte; ACK # = next byte expected (cumulative).',
        tag: 'Seq/ACK',
      },
      {
        id: 'l9-f7',
        lectureId: 9,
        front: 'Why is SampleRTT not measured for retransmitted segments?',
        back: 'The ACK is ambiguous (original or retransmission?), so retransmissions are ignored; recent samples are averaged into a smoother EstimatedRTT.',
        tag: 'RTT',
      },
      {
        id: 'l9-f8',
        lectureId: 9,
        front: 'Meaning of TIMED_WAIT, CLOSE_WAIT and LAST_ACK?',
        back: 'TIMED_WAIT: active closer waits for all packets to die off. CLOSE_WAIT: other side initiated release. LAST_ACK: passive closer waits for the final ACK.',
        tag: 'TCP FSM',
      },
    ],
    quiz: [
      {
        id: 'l9-q1',
        lectureId: 9,
        question: 'What is the maximum number of application data bytes a single TCP segment can carry (no options)?',
        options: ['65535', '65515', '65495', '65507'],
        correctIndex: 2,
        explanation:
          'Max IP payload = 65535 − 20 = 65515 bytes; subtracting the 20-byte TCP header gives 65495 bytes of TCP data.',
        difficulty: 'core',
      },
      {
        id: 'l9-q2',
        lectureId: 9,
        question:
          'Client sends SYN with seq=4200. Server picks ISN 9000. What is the server\'s SYN+ACK?',
        options: [
          'seq=9000, ack=4200',
          'seq=4201, ack=9000',
          'seq=9001, ack=4201',
          'seq=9000, ack=4201',
        ],
        correctIndex: 3,
        explanation:
          'In the 3-way handshake the server replies SYN+ACK with seq=y (9000) and ack=x+1 (4201); the client then sends ACK seq=4201, ack=9001.',
        difficulty: 'core',
      },
      {
        id: 'l9-q3',
        lectureId: 9,
        question: 'Which protocol and header size are typical for a DNS query?',
        options: ['TCP, 20-byte header', 'UDP, 8-byte header', 'UDP, 20-byte header', 'TCP, 8-byte header'],
        correctIndex: 1,
        explanation:
          'DNS, VoIP, Sun NFS and RPC use UDP, whose header is just Source Port, Dest Port, Length and Checksum = 8 bytes.',
        difficulty: 'core',
      },
      {
        id: 'l9-q4',
        lectureId: 9,
        question:
          'Host A sends Seq=92 (8 bytes) and Seq=100 (20 bytes). The ACK for the first is lost, but ACK=120 arrives before the timeout. What does A do?',
        options: [
          'Retransmits Seq=92 only',
          'Retransmits both segments',
          'Nothing — ACK=120 cumulatively acknowledges all bytes up to 119',
          'Resets the connection',
        ],
        correctIndex: 2,
        explanation:
          'TCP ACKs are cumulative: ACK=120 means all bytes up to 119 were received, covering the lost ACK=100, so no retransmission is needed (cumulative ACK scenario).',
        difficulty: 'advanced',
      },
      {
        id: 'l9-q5',
        lectureId: 9,
        question: 'A host has sent FIN and received the ACK for it, but not yet the peer\'s FIN. Which state is it in?',
        options: ['FIN_WAIT_2', 'FIN_WAIT_1', 'CLOSE_WAIT', 'TIMED_WAIT'],
        correctIndex: 0,
        explanation:
          'FIN_WAIT_1 = the app said it is finished; once the other side ACKs (agrees to close) the host moves to FIN_WAIT_2, and only after the peer FIN is ACKed does it enter TIMED_WAIT.',
        difficulty: 'core',
      },
      {
        id: 'l9-q6',
        lectureId: 9,
        question: 'Why is the theoretical maximum number of Internet connections 2^96?',
        options: [
          '32-bit seq number × 64-bit ACK number',
          '2^32 (src IP) × 2^16 (src port) × 2^32 (dst IP) × 2^16 (dst port)',
          '2^48 MAC addresses × 2',
          '65535 ports × 2^80 hosts',
        ],
        correctIndex: 1,
        explanation:
          'A connection is identified by the 4-tuple of two 32-bit IPv4 addresses and two 16-bit ports: 32+16+32+16 = 96 bits.',
        difficulty: 'advanced',
      },
    ],
  },

  // ───────────────────────────── Lecture 10 ─────────────────────────────
  {
    id: 10,
    title: 'Other Networking Protocols: Bluetooth, ZigBee & NFC',
    shortTitle: 'Bluetooth/ZigBee/NFC',
    sectorId: 4,
    sectorName: SECTOR_NAME,
    estimatedMinutes: 35,
    osiLayers: [1, 2, 3],
    tagline: 'When TCP/IP is overkill: piconets, touch-and-go tags and mesh networks that sleep for years.',
    concepts: [
      {
        id: 'l10-c1',
        title: 'Why Non-TCP/IP Networks?',
        summary:
          'TCP/IP is the most popular network type but not always the best option: its overhead and footprint are overkill for tasks like controlling room lights. Specific or custom protocols suit many applications and interoperate with IP in various ways.',
        keyPoints: [
          'Controlling a light needs a tiny payload, but TCP/IP + Ethernet adds tens of bytes of headers plus handshake overhead.',
          'Not all networks need IP; high footprint (power, memory, complexity) is a cost.',
          'Old non-IP protocols: SNA, DECNet, Novell NetWare, NetBEUI, WAP.',
          'Recent: Bluetooth, ZigBee, Fibre Channel, NFC.',
          'Choose based on application needs; consider interoperability with IP.',
        ],
        examTip:
          'Light-control exercise: compare payload (1–2 bytes) with header overhead — UDP (8) + IP (20) + Ethernet (18) vs TCP (20) + handshake. The overhead dwarfs the payload.',
        formulaOrSpec: 'Overhead ratio = header bytes ÷ payload bytes (e.g. 46 B UDP/IP/Eth for a 1 B command)',
      },
      {
        id: 'l10-c2',
        title: 'Bluetooth (IEEE 802.15.1) & Protocol Stack',
        layer: 2,
        summary:
          'Bluetooth was introduced by Ericsson to replace cables, enable multiparty data exchange and act as a personal trusted device; it is now managed by the Bluetooth SIG. It operates in the 2.4–2.48 GHz ISM band with ~10 m range and 2.1 Mbps shared bandwidth (v2.0).',
        keyPoints: [
          '2.4–2.48 GHz ISM band, 10 m range, 2.1 Mbps shared (v2.0).',
          'v4.0 includes Classic, High Speed (Wi-Fi based) and Bluetooth Low Energy (BLE).',
          'Baseband: physical channels & links, error correction, data whitening, hop selection, security.',
          'LMP (Link Management Protocol): set-up and control of the radio link between 2 devices.',
          'L2CAP: multiplexes logical connections for higher protocols; segmentation & reassembly.',
          'SDP: discover services offered by other devices; also RFCOMM, OBEX, TCS-BIN.',
        ],
        examTip:
          'Function → layer mapping is a favourite: hop selection/whitening = Baseband, link setup = LMP, segmentation & multiplexing = L2CAP, finding services = SDP.',
        formulaOrSpec: 'Bluetooth = IEEE 802.15.1 | 2.4–2.48 GHz | 10 m | 2.1 Mbps (v2.0)',
        comparisonTable: {
          headers: ['Layer', 'Responsibility'],
          rows: [
            ['Baseband', 'Physical channels, error correction, whitening, hop selection, security'],
            ['LMP', 'Set-up & control of the radio link'],
            ['L2CAP', 'Logical multiplexing, segmentation & reassembly'],
            ['SDP', 'Service discovery and parameters'],
            ['Profiles', 'HFP, BPP, AVRCP, FTP, HID, PAN, GOEP'],
          ],
        },
      },
      {
        id: 'l10-c3',
        title: 'Piconets & Scatternets',
        layer: 2,
        summary:
          'A piconet consists of one master plus up to 7 active slaves and up to 255 parked slaves. All communication passes through the master — there is no slave-to-slave communication. Connecting 2 or more piconets forms a scatternet.',
        keyPoints: [
          '1 master + up to 7 active slaves + up to 255 parked slaves.',
          'All traffic goes through the master; no direct slave-to-slave.',
          'Scatternet: 2+ interconnected piconets.',
          'Profiles sit on top of the core spec: Hands-Free (HFP), Basic Printing (BPP), AVRCP, File Transfer (FTP), HID, PAN, GOEP.',
        ],
        examTip: 'Numbers to memorise: 7 active, 255 parked. Two slaves wanting to talk must relay via the master.',
        formulaOrSpec: 'Piconet = 1 Master + ≤7 Active Slaves + ≤255 Parked Slaves',
      },
      {
        id: 'l10-c4',
        title: 'Near Field Communication (NFC)',
        layer: 1,
        summary:
          'NFC works at ≤10 cm and 13.56 MHz with 106–424 Kbps, based on magnetic field induction between readers and tags as in RFID. Started in 2004 by Nokia, Philips and Sony; first Nokia phone in 2006 and Android in 2010.',
        keyPoints: [
          'Range ≤ 10 cm; 13.56 MHz; 106–424 Kbps.',
          'Active mode: both devices generate an electromagnetic field (e.g. 2 phones).',
          'Passive mode: one active device; the other (RFID-tagged poster) uses that field.',
          'Applications: Touch & Go, Touch & Confirm, Touch & Connect.',
          'Pros: convenience, low cost, low energy, better security, no search & pair, less configuration.',
          'Cons: low range, low data rate.',
        ],
        examTip: 'Phone ↔ phone = Active mode; phone ↔ poster/tag = Passive mode. The tiny range is a SECURITY advantage.',
        formulaOrSpec: 'NFC: 13.56 MHz | ≤10 cm | 106–424 Kbps | ASK modulation',
        comparisonTable: {
          headers: ['Mode', 'Field generation', 'Example'],
          rows: [
            ['Active', 'Both devices generate RF field', 'Two phones exchanging data'],
            ['Passive', 'Only initiator generates field', 'Phone reading an RFID-tagged poster'],
          ],
        },
      },
      {
        id: 'l10-c5',
        title: 'ZigBee (IEEE 802.15.4): Devices & Topologies',
        layer: 3,
        summary:
          'ZigBee (ZigBee Alliance) targets very low power, long battery life, low data rate (250 Kbps), low complexity and low cost. IEEE 802.15.4 defines the PHY and MAC of low-rate WPANs; ZigBee adds network construction and application services, plus interoperable profiles.',
        keyPoints: [
          'FFD (Full Functional Device): PAN coordinator, coordinator or simple device; talks to FFDs and RFDs.',
          'RFD (Reduced Functional Device): low data volume, communicates only with a specific FFD.',
          'Star: easy sync, low latency — but small scale.',
          'Mesh/P2P: robust multi-hop, multi-path, flexible — but costly route discovery and routing tables.',
          'Cluster Tree: low routing cost, scalable — but costly route reconstruction, long latency, root is single point of failure.',
          'Profiles: common language, device descriptions, unique ID licensed by the ZigBee Alliance.',
        ],
        examTip: 'RFD = leaf that only talks to its one FFD. Only an FFD can be a PAN coordinator or router.',
        formulaOrSpec: 'ZigBee = IEEE 802.15.4 PHY/MAC + ZigBee NWK/APP | 250 Kbps | 16-bit NW address',
        comparisonTable: {
          headers: ['Topology', 'Pros', 'Cons'],
          rows: [
            ['Star', 'Easy to synchronise, low latency', 'Small scale'],
            ['Mesh / P2P', 'Robust multi-hop, multi-path, flexible', 'Costly route discovery, routing tables'],
            ['Cluster Tree', 'Low routing cost, scalable', 'Costly reconstruction, long latency, root SPOF'],
          ],
        },
      },
      {
        id: 'l10-c6',
        title: 'ZigBee Traffic Modes, Routing & Technology Comparison',
        layer: 3,
        summary:
          'In beacon mode the coordinator sends periodic beacons so coordinator and end devices can sleep (lowest energy, precise timing). In non-beacon mode coordinators/routers stay awake. Routes are discovered by broadcasting RREQ and replying with unicast RREP.',
        keyPoints: [
          'Beacon mode: periodic beacons (ms–min period), devices sleep, lowest energy, precise timing needed.',
          'Non-beacon mode: coordinator/routers stay awake; heterogeneous network, asymmetric power.',
          'Route discovery: broadcast RREQ builds entries toward source; endpoint replies RREP builds entries toward destination.',
          'Hierarchical routing as fallback; route repair after failed-delivery threshold.',
          'Total connectivity loss → orphaning procedure → re-association.',
          'Max rates: BLE 1 Mbps, ZigBee 250 Kbps, NFC 424 Kbps, Low-power Wi-Fi 54 Mbps.',
        ],
        examTip: 'Battery life ranking: ZigBee/NFC months–years, BLE days, Wi-Fi hours.',
        formulaOrSpec: 'Route discovery: RREQ (broadcast) → RREP (unicast)',
        comparisonTable: {
          headers: ['Technology', 'Modulation', 'Max rate', 'Power profile', 'Complexity'],
          rows: [
            ['Bluetooth LE', 'GFSK', '1 Mbps', 'Days', 'Complex'],
            ['ZigBee', 'BPSK & QPSK', '250 Kbps', 'Months/Years', 'Simple'],
            ['NFC', 'ASK', '424 Kbps', 'Months/Years', 'Simple'],
            ['Low-power Wi-Fi', '64QAM', '54 Mbps', 'Hours', 'Complex'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'matrix-arena',
      title: 'Short-Range & IoT Protocol Architect',
      scenario:
        'You are designing a smart building. Assign each constraint, feature or mechanism to the short-range technology that provides it.',
      categories: [
        { id: 'bt', title: 'Bluetooth', subtitle: 'IEEE 802.15.1 · 2.4 GHz · 10 m' },
        { id: 'nfc', title: 'NFC', subtitle: '13.56 MHz · ≤10 cm · RFID induction' },
        { id: 'zb', title: 'ZigBee', subtitle: 'IEEE 802.15.4 · 250 Kbps · mesh' },
      ],
      items: [
        {
          id: 'i1',
          text: 'Piconet: 1 master + up to 7 active slaves + 255 parked slaves',
          correctCategoryId: 'bt',
          explanation: 'The Bluetooth baseband piconet has one master, up to 7 active and 255 parked slaves.',
        },
        {
          id: 'i2',
          text: 'L2CAP segmentation & reassembly, SDP service discovery, LMP link setup',
          correctCategoryId: 'bt',
          explanation: 'L2CAP, SDP and LMP are layers of the Bluetooth protocol stack.',
        },
        {
          id: 'i3',
          text: 'Wireless headset streaming audio ~10 m in the 2.4–2.48 GHz ISM band',
          correctCategoryId: 'bt',
          explanation: 'Bluetooth replaces cables at 10 m range in the 2.4–2.48 GHz band with profiles like HFP/AVRCP.',
        },
        {
          id: 'i4',
          text: 'Scatternet formed by interconnecting two piconets',
          correctCategoryId: 'bt',
          explanation: 'Connecting 2+ Bluetooth piconets forms a scatternet.',
        },
        {
          id: 'i5',
          text: 'Door badge that works only within 10 cm at 13.56 MHz',
          correctCategoryId: 'nfc',
          explanation: 'NFC operates at 13.56 MHz with range ≤10 cm, which also improves security.',
        },
        {
          id: 'i6',
          text: 'Phone reads a passive RFID-tagged poster using the phone\'s field',
          correctCategoryId: 'nfc',
          explanation: 'In NFC passive mode one active device powers the exchange and the tag uses its field.',
        },
        {
          id: 'i7',
          text: 'Touch & Go / Touch & Confirm / Touch & Connect applications',
          correctCategoryId: 'nfc',
          explanation: 'These are the NFC application categories from the slides.',
        },
        {
          id: 'i8',
          text: 'No search & pair procedure; 106–424 Kbps',
          correctCategoryId: 'nfc',
          explanation: 'NFC needs no search-and-pair and runs at 106–424 Kbps.',
        },
        {
          id: 'i9',
          text: 'FFD acts as PAN coordinator; RFD leaf sensors talk only to one FFD',
          correctCategoryId: 'zb',
          explanation: 'FFD and RFD are the IEEE 802.15.4 device types used by ZigBee.',
        },
        {
          id: 'i10',
          text: 'Star, Mesh/P2P and Cluster Tree topologies for 500 lighting nodes',
          correctCategoryId: 'zb',
          explanation: 'ZigBee supports Star, Mesh/P2P and Cluster Tree topologies.',
        },
        {
          id: 'i11',
          text: 'Beacon mode lets sensors sleep for months/years of battery life',
          correctCategoryId: 'zb',
          explanation: 'In ZigBee beacon mode coordinator and end devices sleep between beacons for lowest energy use.',
        },
        {
          id: 'i12',
          text: 'Broadcast RREQ, unicast RREP route discovery; orphaning on link loss',
          correctCategoryId: 'zb',
          explanation: 'ZigBee network layer discovers routes with RREQ/RREP and uses an orphaning procedure on connectivity loss.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l10-f1',
        lectureId: 10,
        front: 'Bluetooth standard, band, range and v2.0 bandwidth?',
        back: 'IEEE 802.15.1, 2.4–2.48 GHz ISM band, ~10 m range, 2.1 Mbps shared (v2.0).',
        tag: 'Bluetooth',
      },
      {
        id: 'l10-f2',
        lectureId: 10,
        front: 'How many devices can a Bluetooth piconet hold?',
        back: '1 master, up to 7 active slaves and up to 255 parked slaves; no slave-to-slave communication.',
        tag: 'Piconet',
      },
      {
        id: 'l10-f3',
        lectureId: 10,
        front: 'Roles of LMP, L2CAP and SDP in Bluetooth?',
        back: 'LMP sets up/controls the radio link; L2CAP multiplexes logical connections with segmentation & reassembly; SDP discovers services offered by other devices.',
        tag: 'BT Stack',
      },
      {
        id: 'l10-f4',
        lectureId: 10,
        front: 'NFC frequency, range and data rate?',
        back: '13.56 MHz, ≤10 cm, 106–424 Kbps — based on RFID magnetic field induction.',
        tag: 'NFC',
      },
      {
        id: 'l10-f5',
        lectureId: 10,
        front: 'NFC active vs passive mode?',
        back: 'Active: both devices generate electromagnetic fields (2 phones). Passive: one active device; the other (e.g. RFID poster) uses its field.',
        tag: 'NFC Modes',
      },
      {
        id: 'l10-f6',
        lectureId: 10,
        front: 'FFD vs RFD in IEEE 802.15.4?',
        back: 'FFD can be PAN coordinator, coordinator or device and talks to FFDs/RFDs; RFD handles low data volumes and talks only to a specific FFD.',
        tag: 'ZigBee Devices',
      },
      {
        id: 'l10-f7',
        lectureId: 10,
        front: 'ZigBee beacon vs non-beacon mode?',
        back: 'Beacon: periodic beacons let coordinator & devices sleep (lowest energy, precise timing). Non-beacon: coordinators/routers stay awake.',
        tag: 'Beacon Mode',
      },
      {
        id: 'l10-f8',
        lectureId: 10,
        front: 'How does ZigBee discover a route?',
        back: 'The source broadcasts RREQ packets (creating entries toward the source); the endpoint router replies with a unicast RREP (creating entries toward the destination).',
        tag: 'RREQ/RREP',
      },
    ],
    quiz: [
      {
        id: 'l10-q1',
        lectureId: 10,
        question:
          'A Bluetooth master already has 7 active slaves. An 8th device joins the piconet. What can happen?',
        options: [
          'It becomes an 8th active slave',
          'It can only join as a parked slave (up to 255)',
          'It communicates directly with another slave',
          'The piconet automatically becomes a ZigBee mesh',
        ],
        correctIndex: 1,
        explanation:
          'A piconet supports up to 7 active slaves and 255 parked slaves, so the 8th must be parked (or form a scatternet with another piconet).',
        difficulty: 'core',
      },
      {
        id: 'l10-q2',
        lectureId: 10,
        question: 'Which Bluetooth layer provides segmentation & reassembly and multiplexing of logical connections?',
        options: ['LMP', 'SDP', 'Baseband', 'L2CAP'],
        correctIndex: 3,
        explanation:
          'L2CAP multiplexes logical connections between 2 devices using different higher protocols and segments/reassembles on-air packets; LMP sets up the link and SDP discovers services.',
        difficulty: 'core',
      },
      {
        id: 'l10-q3',
        lectureId: 10,
        question: 'Tapping a phone on an RFID-tagged museum poster to open a web page uses NFC in which mode?',
        options: ['Passive mode', 'Active mode', 'Beacon mode', 'Scatternet mode'],
        correctIndex: 0,
        explanation:
          'In passive mode one active device (the phone) generates the field and the tag uses it; active mode is when both devices (e.g. 2 phones) generate fields.',
        difficulty: 'core',
      },
      {
        id: 'l10-q4',
        lectureId: 10,
        question:
          'A battery-powered ZigBee temperature sensor must last years and only report to one nearby router. Which design fits best?',
        options: [
          'FFD in non-beacon mode acting as PAN coordinator',
          'RFD in non-beacon mode acting as router',
          'RFD in a beacon-enabled network',
          'Bluetooth master with 7 active slaves',
        ],
        correctIndex: 2,
        explanation:
          'An RFD talks only to a specific FFD and suits low data volumes; beacon mode lets devices sleep between beacons for the lowest energy consumption.',
        difficulty: 'advanced',
      },
      {
        id: 'l10-q5',
        lectureId: 10,
        question: 'Which is a disadvantage of the ZigBee Cluster Tree topology?',
        options: [
          'High routing cost',
          'Not scalable',
          'Cannot do multi-hop communication',
          'The root node is a single point of failure',
        ],
        correctIndex: 3,
        explanation:
          'Cluster Tree has low routing cost, multi-hop and scalability, but route reconstruction is costly, latency can be long and the root is a single point of failure.',
        difficulty: 'core',
      },
      {
        id: 'l10-q6',
        lectureId: 10,
        question:
          'Rank by maximum potential data rate (highest first): BLE, ZigBee, NFC, Low-power Wi-Fi.',
        options: [
          'Wi-Fi (54 Mbps) > BLE (1 Mbps) > NFC (424 Kbps) > ZigBee (250 Kbps)',
          'BLE > Wi-Fi > ZigBee > NFC',
          'Wi-Fi > ZigBee > BLE > NFC',
          'NFC > BLE > Wi-Fi > ZigBee',
        ],
        correctIndex: 0,
        explanation:
          'The comparison table lists Low-power Wi-Fi 54 Mbps (64QAM), BLE 1 Mbps (GFSK), NFC 424 Kbps (ASK) and ZigBee 250 Kbps (BPSK/QPSK).',
        difficulty: 'advanced',
      },
    ],
  },
];

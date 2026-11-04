import type { LectureModule } from '@/types/curriculum';

export const SECTOR3_LECTURES: LectureModule[] = [
  // ---------------------------------------------------------------------------
  // Lecture 5 — The Network Layer
  // ---------------------------------------------------------------------------
  {
    id: 5,
    title: 'The Network Layer',
    shortTitle: 'Network Layer',
    sectorId: 3,
    sectorName: 'The Internet Layer',
    estimatedMinutes: 35,
    osiLayers: [3],
    tagline: 'Datagrams or virtual circuits: every packet needs a path, and every router needs a table.',
    concepts: [
      {
        id: 'l5-c1',
        title: 'Network Layer Functions & Packet Switching',
        layer: 3,
        summary:
          'The Network layer moves packets from a source end station to a destination end station across a set of intermediate nodes (switches or routers). It isolates the upper layers from the underlying transmission technologies and provides addressing and routing.',
        keyPoints: [
          'Four functions: establishing/maintaining/terminating connections, isolating upper layers from transmission technology, addressing, routing.',
          'A network is a set of nodes (intermediate stations) connected by point-to-point or multipoint links.',
          'A data stream is divided into packets; each packet = header + data.',
          'Each node switches each incoming packet through a link to another node until it reaches the destination host.',
          'End systems do not relay traffic; intermediate systems route traffic from one subnet to another.',
        ],
        examTip:
          'Hosts are end stations; routers/switches are intermediate stations. Only intermediate systems relay traffic between subnets.',
        formulaOrSpec: 'Packet = Header (addressing/control) + Data (payload)',
      },
      {
        id: 'l5-c2',
        title: 'Connectionless (Datagram) vs. Connection-Oriented (Virtual Circuit)',
        layer: 3,
        summary:
          'In a connectionless (datagram) network each packet carries the full destination address and is routed independently. In a connection-oriented network a virtual circuit is set up first and packets carry only a short Connection ID (CID) that each switch maps from an incoming to an outgoing CID.',
        keyPoints: [
          'Datagram: no setup, routing per packet, forwarding table maps Destination Address → Next Hop, generally no error control.',
          'Virtual circuit: setup before data transfer, sequenced packet streams, routing per connection, network generally provides error control.',
          'CIDs are unique per link only — each switch rewrites In CID → Out CID.',
          'Routers hold no per-flow state in datagram networks; VC switches hold state for every circuit.',
          'On a node failure, datagram traffic is minimally affected (reroutes) while all VCs through that node are terminated.',
          'QoS and congestion control are difficult in datagram networks but possible in VC networks.',
        ],
        examTip:
          'Trap: CIDs are NOT end-to-end identifiers. The same circuit can have a different CID on every link.',
        formulaOrSpec: 'Datagram table: Dest Addr → Next Hop | VC table: (In Link, In CID) → (Out Link, Out CID)',
        comparisonTable: {
          headers: ['Issue', 'Connectionless (Datagram)', 'Connection-Oriented (VC)'],
          rows: [
            ['Setup', 'Not needed', 'Needed'],
            ['Addressing in packet', 'Destination address', 'Connection ID'],
            ['State', 'No state in routers', 'State in routers'],
            ['Routing', 'Per-packet', 'Per-connection'],
            ['Failures', 'Minimal impact', 'VCs are terminated'],
            ['Quality of Service', 'Difficult', 'Possible'],
            ['Congestion control', 'Difficult', 'Possible'],
          ],
        },
      },
      {
        id: 'l5-c3',
        title: 'Addressing: Flat vs. Hierarchical',
        layer: 3,
        summary:
          'Addressing identifies end stations and happens at several layers (physical, data link, network, application). Flat addresses carry no location structure, while hierarchical addresses encode location so routers can route on a prefix.',
        keyPoints: [
          'Flat examples: personal names (Gihan Dias, Gihan Fernando), Ethernet/MAC addresses, NIC numbers.',
          'Hierarchical examples: postal address (dept → university → city → country), telephone number (country → area → operator → subscriber), IP prefix.',
          'Hierarchical addressing lets routers look only at the most-significant part (prefix) of the address.',
          'Flat addresses do not scale for routing: every router would need an entry per station.',
        ],
        examTip:
          'MAC = flat (identity), IP = hierarchical (location). That is why routing tables use IP prefixes, not MACs.',
        comparisonTable: {
          headers: ['Property', 'Flat', 'Hierarchical'],
          rows: [
            ['Structure', 'No location meaning', 'Prefix encodes location'],
            ['Examples', 'Personal names, MAC addresses', 'Postal, phone numbers, IP'],
            ['Routing table size', 'One entry per station', 'One entry per prefix'],
            ['Scalability', 'Poor', 'Good (aggregation)'],
          ],
        },
      },
      {
        id: 'l5-c4',
        title: 'Forwarding, Routing & Routing Mechanisms',
        layer: 3,
        summary:
          'Forwarding is the per-packet act of switching a packet from an input line to an output line using a table; routing is the process that builds that table. Routing can be static, dynamic, source-based or hierarchical.',
        keyPoints: [
          'Six desirable properties: correctness, simplicity, robustness, stability, fairness, optimality.',
          'Static (non-adaptive): predefined tables, usually with a default route; suits small networks but is not resilient and is labour-consuming.',
          'Dynamic (adaptive): routers run a routing protocol (centralised or distributed) based on link speed, delay, congestion, error rate, cost, policy.',
          'Hierarchical routing: look up the destination prefix; if found route accordingly, else use the default route — simplifies tables (regions + gateways).',
          'Mechanisms: shortest path, flooding (send on all unused links), distance vector, link state, broadcast, multicast; source routing lets the source specify the route.',
          'Distance metrics: hops, physical distance, delay, inverse bandwidth, cost.',
        ],
        examTip:
          'Forwarding = data plane (every packet). Routing = control plane (builds tables). Memorise the 6 properties as "C-S-R-S-F-O".',
        formulaOrSpec: 'Properties: Correctness, Simplicity, Robustness, Stability, Fairness, Optimality',
        comparisonTable: {
          headers: ['Type', 'Table built by', 'Pros', 'Cons'],
          rows: [
            ['Static', 'Administrator', 'Simple, predictable', 'Not resilient, labour-intensive'],
            ['Dynamic', 'Routing protocol', 'Adapts to failures/congestion', 'Protocol overhead'],
            ['Source', 'Source station', 'Source controls path', 'Source must know topology'],
            ['Hierarchical', 'Prefix + default', 'Small tables', 'Possibly suboptimal paths'],
          ],
        },
      },
      {
        id: 'l5-c5',
        title: 'Congestion Control & Quality of Service',
        layer: 3,
        summary:
          'When offered traffic exceeds capacity, delivered traffic collapses, so networks need open-loop (prevent) or closed-loop (monitor → inform → act) congestion control. QoS characterises flows by reliability, delay, jitter and bandwidth and is delivered via over-provisioning, buffering, traffic shaping, IntServ or DiffServ.',
        keyPoints: [
          'Ideal curve: delivered = offered up to capacity; real networks degrade sharply beyond it (congestion collapse).',
          'Open-loop: good design prevents congestion up-front; closed-loop: monitor the system, pass information to where action can be taken, adjust operation.',
          'Telephony and video conferencing: low delay, high jitter sensitivity; file transfer and email: high reliability, low jitter sensitivity.',
          'Techniques: over-provisioning, buffering (smooths jitter), traffic shaping (regulates the sending rate).',
          'IntServ reserves resources per flow using RSVP; DiffServ marks packets into a small number of classes (per-class treatment) and scales better.',
        ],
        examTip:
          'VoIP cares about jitter and delay, not perfect reliability. File transfer cares about reliability, not jitter. IntServ = per-flow (RSVP), DiffServ = per-class.',
        formulaOrSpec: 'Closed loop: Monitor → Inform → Act',
        comparisonTable: {
          headers: ['Application', 'Reliability', 'Delay', 'Jitter', 'Bandwidth'],
          rows: [
            ['Email', 'High', 'Low', 'Low', 'Low'],
            ['File transfer', 'High', 'Low', 'Low', 'Medium'],
            ['Web access', 'High', 'Medium', 'Low', 'Medium'],
            ['Remote login', 'High', 'Medium', 'Medium', 'Low'],
            ['Audio on demand', 'Low', 'Low', 'High', 'Medium'],
            ['Video on demand', 'Low', 'Low', 'High', 'High'],
            ['Telephony', 'Low', 'High', 'High', 'Low'],
            ['Video conferencing', 'Low', 'High', 'High', 'High'],
          ],
        },
      },
      {
        id: 'l5-c6',
        title: 'Internetworking Devices by OSI Layer',
        summary:
          'Networks are joined by devices that operate at different layers. The higher the layer, the more of the frame/packet the device understands and can translate.',
        keyPoints: [
          'L1 Physical: repeaters and hubs regenerate bits — no addressing.',
          'L2 Data Link: bridges and switches forward frames by MAC address.',
          'L3 Network: routers forward packets by network (IP) address between different networks.',
          'L4 Transport: transport gateways connect, e.g., a TCP connection to a different transport protocol.',
          'L7 Application: application gateways translate application semantics (e.g., email ↔ SMS).',
        ],
        examTip:
          'Hub = L1, Switch = L2, Router = L3, Transport gateway = L4, Application gateway = L7. Hubs never read addresses.',
        formulaOrSpec: 'Repeater/Hub L1 → Bridge/Switch L2 → Router L3 → Transport GW L4 → Application GW L7',
        comparisonTable: {
          headers: ['Layer', 'Device', 'Operates on'],
          rows: [
            ['L1 Physical', 'Repeater / Hub', 'Bits / signals'],
            ['L2 Data Link', 'Bridge / Switch', 'Frames (MAC address)'],
            ['L3 Network', 'Router', 'Packets (IP address)'],
            ['L4 Transport', 'Transport gateway', 'Segments / connections'],
            ['L7 Application', 'Application gateway', 'Application messages'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'topology-lab',
      title: 'Datagram vs. Virtual Circuit Router & QoS Shaper',
      scenario:
        'A campus LAN (hub + switch) connects through a datagram router and a virtual-circuit WAN switch to a remote site with a mail application gateway. Configure forwarding entries, identify each device layer, and pick the right QoS architecture for VoIP vs. file transfer.',
      nodes: [
        { id: 'h1', label: 'Host A (VoIP)', type: 'host', x: 8, y: 30 },
        { id: 'hub', label: 'Repeater Hub', type: 'switch', x: 22, y: 65 },
        { id: 'sw', label: 'L2 Bridge/Switch', type: 'switch', x: 36, y: 30 },
        { id: 'r1', label: 'Datagram Router R1', type: 'router', x: 52, y: 60 },
        { id: 'vc', label: 'VC Switch X', type: 'wan-switch', x: 66, y: 25 },
        { id: 'tgw', label: 'Transport Gateway', type: 'firewall', x: 78, y: 70 },
        { id: 'agw', label: 'Mail App Gateway', type: 'server', x: 92, y: 40 },
      ],
      links: [
        { from: 'h1', to: 'sw', label: 'Ethernet' },
        { from: 'hub', to: 'sw', label: 'Shared segment' },
        { from: 'sw', to: 'r1', label: '10.1.0.0/16 LAN' },
        { from: 'r1', to: 'vc', label: 'WAN VC link' },
        { from: 'r1', to: 'tgw', label: 'TCP ↔ other transport' },
        { from: 'vc', to: 'agw', label: 'CID 7 → CID 12' },
        { from: 'tgw', to: 'agw', label: 'Remote site' },
      ],
      challenges: [
        {
          id: 'ch1',
          targetNodeId: 'r1',
          prompt:
            'R1 is a connectionless (datagram) router. Which entry belongs in its forwarding table?',
          options: [
            'Dest prefix 10.2.0.0/16 → Next hop VC Switch X',
            'In CID 7 → Out CID 12',
            'Source MAC 00-02-2D-02-82-34 → Port 3',
            'Flow ID 42 → Reserved 64 kb/s (RSVP)',
          ],
          correctOption: 'Dest prefix 10.2.0.0/16 → Next hop VC Switch X',
          explanation:
            'Datagram routers keep no per-connection state: every packet carries the destination address, and the table maps destination (prefix) → next hop.',
        },
        {
          id: 'ch2',
          targetNodeId: 'vc',
          prompt:
            'A packet arrives at VC Switch X on the R1 link with CID 7. What does the switch use to forward it?',
          options: [
            'The full destination IP address in the header',
            'Its (In link, In CID 7) → (Out link, Out CID 12) table entry',
            'A flooding decision on all unused links',
            'The source route listed by the sending host',
          ],
          correctOption: 'Its (In link, In CID 7) → (Out link, Out CID 12) table entry',
          explanation:
            'In a connection-oriented network the circuit is set up in advance; each switch maps the incoming CID to an outgoing CID, which is unique only per link.',
        },
        {
          id: 'ch3',
          targetNodeId: 'hub',
          prompt: 'At which OSI layer does the repeater hub operate, and what does it inspect?',
          options: [
            'Layer 2 — reads destination MAC addresses',
            'Layer 3 — reads IP prefixes',
            'Layer 1 — regenerates bits without reading any address',
            'Layer 4 — reads port numbers',
          ],
          correctOption: 'Layer 1 — regenerates bits without reading any address',
          explanation:
            'Repeaters and hubs are Physical-layer devices: they regenerate and repeat signals on all ports and never examine addresses.',
        },
        {
          id: 'ch4',
          targetNodeId: 'agw',
          prompt:
            'The mail gateway converts email into SMS messages for phones. Which internetworking device class is it?',
          options: [
            'L3 router',
            'L4 transport gateway',
            'L2 bridge',
            'L7 application gateway',
          ],
          correctOption: 'L7 application gateway',
          explanation:
            'Translating application semantics (email ↔ SMS) requires understanding the application protocol, so it is a Layer 7 application gateway.',
        },
        {
          id: 'ch5',
          targetNodeId: 'h1',
          prompt:
            'Host A runs VoIP while a neighbour runs bulk file transfer. Which QoS profile is right for the VoIP flow?',
          options: [
            'High reliability, jitter-insensitive; best effort is fine',
            'Low delay and low jitter; reserve per flow with IntServ/RSVP or mark into a priority DiffServ class',
            'High bandwidth only; over-provision and ignore delay',
            'Maximise retransmissions so no voice sample is ever lost',
          ],
          correctOption:
            'Low delay and low jitter; reserve per flow with IntServ/RSVP or mark into a priority DiffServ class',
          explanation:
            'Telephony has high sensitivity to delay and jitter but low reliability needs. IntServ (RSVP) reserves per flow; DiffServ gives per-class priority. File transfer needs reliability, not low jitter.',
        },
        {
          id: 'ch6',
          targetNodeId: 'sw',
          prompt:
            'R1 is congested. The network monitors queue lengths, informs sources, and they slow down. What kind of congestion control is this?',
          options: [
            'Closed-loop (monitor → inform → act)',
            'Open-loop (prevention by design)',
            'Static routing with a default route',
            'Flooding on all unused links',
          ],
          correctOption: 'Closed-loop (monitor → inform → act)',
          explanation:
            'Closed-loop control monitors the system to detect congestion, passes the information to where action can be taken, and adjusts operation. Open-loop relies on good design to prevent congestion.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l5-f1',
        lectureId: 5,
        front: 'What are the four functions of the Network layer?',
        back: 'Establishing/maintaining/terminating connections, isolating upper layers from transmission technologies, addressing, and routing.',
        tag: 'Functions',
      },
      {
        id: 'l5-f2',
        lectureId: 5,
        front: 'What does a datagram forwarding table map vs. a virtual-circuit forwarding table?',
        back: 'Datagram: Destination address (prefix) → Next hop. Virtual circuit: Incoming CID → Outgoing CID (CIDs unique per link).',
        tag: 'Datagram vs VC',
      },
      {
        id: 'l5-f3',
        lectureId: 5,
        front: 'What happens to traffic when a node fails in a datagram vs. a VC network?',
        back: 'Datagram: minimal impact — packets are rerouted. VC: all virtual circuits passing through the failed node are terminated.',
        tag: 'Failures',
      },
      {
        id: 'l5-f4',
        lectureId: 5,
        front: 'Forwarding vs. routing?',
        back: 'Forwarding switches each arriving packet from an input line to an output line using a table; routing builds the forwarding tables.',
        tag: 'Forwarding',
      },
      {
        id: 'l5-f5',
        lectureId: 5,
        front: 'List the six desirable properties of a routing algorithm.',
        back: 'Correctness, simplicity, robustness, stability, fairness, optimality.',
        tag: 'Routing',
      },
      {
        id: 'l5-f6',
        lectureId: 5,
        front: 'How does hierarchical routing simplify routing tables?',
        back: 'Routers look up only the most-significant prefix of the destination address; if the prefix is in the table they route accordingly, otherwise they use the default route.',
        tag: 'Hierarchical',
      },
      {
        id: 'l5-f7',
        lectureId: 5,
        front: 'IntServ vs. DiffServ?',
        back: 'IntServ reserves resources per flow using RSVP (poor scalability); DiffServ marks packets into a few service classes and treats them per class.',
        tag: 'QoS',
      },
      {
        id: 'l5-f8',
        lectureId: 5,
        front: 'Map internetworking devices to OSI layers.',
        back: 'L1 repeater/hub, L2 bridge/switch, L3 router, L4 transport gateway, L7 application gateway.',
        tag: 'Devices',
      },
    ],
    quiz: [
      {
        id: 'l5-q1',
        lectureId: 5,
        question: 'Which statement is TRUE for a connection-oriented (virtual circuit) network?',
        options: [
          'Each packet carries the full destination address',
          'Routers keep no state',
          'Routing decisions are made once per connection and QoS is possible',
          'A node failure has minimal impact on existing flows',
        ],
        correctIndex: 2,
        explanation:
          'In VC networks a connection is set up first, routing is per connection, routers hold state, and QoS/congestion control are possible. Node failure terminates the VCs through it.',
        difficulty: 'core',
      },
      {
        id: 'l5-q2',
        lectureId: 5,
        question: 'Which of the following is an example of FLAT addressing?',
        options: [
          'A telephone number with country and area codes',
          'An Ethernet MAC address',
          'A postal address',
          'An IP network prefix',
        ],
        correctIndex: 1,
        explanation:
          'Ethernet addresses and personal names are flat — they carry no location hierarchy. Postal, phone and IP addresses are hierarchical.',
        difficulty: 'core',
      },
      {
        id: 'l5-q3',
        lectureId: 5,
        question:
          'A packet for 10.2.5.9 arrives at a static router whose table holds only 10.1.0.0/16 → eth0 and a default route → R2. What happens?',
        options: [
          'The packet is dropped because there is no exact match',
          'The packet is flooded on all unused links',
          'The router sends it back to the source',
          'The packet is forwarded to R2 via the default route',
        ],
        correctIndex: 3,
        explanation:
          'Hierarchical/static routing checks the destination prefix; if it is not in the table the default route is used. 10.2.5.9 is not in 10.1.0.0/16, so it goes to R2.',
        difficulty: 'advanced',
      },
      {
        id: 'l5-q4',
        lectureId: 5,
        question: 'Which application is MOST sensitive to jitter but tolerant of occasional loss?',
        options: ['Email', 'File transfer', 'Telephony (VoIP)', 'Remote login'],
        correctIndex: 2,
        explanation:
          'Per the QoS application matrix, telephony needs low delay and has high jitter sensitivity but low reliability requirements; email and file transfer need high reliability and are jitter-insensitive.',
        difficulty: 'core',
      },
      {
        id: 'l5-q5',
        lectureId: 5,
        question: 'A device forwards frames based on MAC addresses between two LAN segments. Which device and layer is it?',
        options: [
          'Bridge/switch — Layer 2',
          'Repeater/hub — Layer 1',
          'Router — Layer 3',
          'Application gateway — Layer 7',
        ],
        correctIndex: 0,
        explanation:
          'Bridges and switches are Data Link (L2) devices that forward frames by MAC address. Hubs are L1 and routers are L3 (IP addresses).',
        difficulty: 'core',
      },
      {
        id: 'l5-q6',
        lectureId: 5,
        question:
          'A virtual circuit crosses switches A → B → C. On link A–B it uses CID 5 and on link B–C CID 9. Which entry must switch B hold?',
        options: [
          'Dest address C → Next hop C',
          'In CID 9 → Out CID 5 for traffic from A',
          'In CID 5 (from A) → Out CID 9 (to C)',
          'No entry; CIDs are end-to-end so B just passes CID 5',
        ],
        correctIndex: 2,
        explanation:
          'CIDs are unique per link only, so each switch keeps a table relating incoming and outgoing CIDs. B maps CID 5 arriving from A to CID 9 towards C.',
        difficulty: 'advanced',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Lecture 6 — Internet Protocol (IPv4)
  // ---------------------------------------------------------------------------
  {
    id: 6,
    title: 'Internet Protocol (IPv4)',
    shortTitle: 'IPv4',
    sectorId: 3,
    sectorName: 'The Internet Layer',
    estimatedMinutes: 40,
    osiLayers: [2, 3],
    tagline: 'Thirty-two bits, a slash, and a mask: master CIDR, ARP, ICMP, DHCP and NAT.',
    concepts: [
      {
        id: 'l6-c1',
        title: 'The Internet Network Layer',
        layer: 3,
        summary:
          'The Internet network layer consists of three parts: the IP protocol (addressing, datagram format, packet handling), routing protocols (RIP, OSPF, BGP) that build forwarding tables, and ICMP for error reporting and signalling.',
        keyPoints: [
          'IP: addressing conventions, datagram format, packet handling conventions.',
          'Routing protocols perform path selection: RIP, OSPF, BGP — they populate the forwarding table.',
          'ICMP: error reporting and router "signalling" (e.g., ping, TTL expired).',
          'IP is connectionless, best-effort datagram delivery — no guarantees of delivery or order.',
        ],
        examTip: 'Three components: IP + Routing protocols (RIP/OSPF/BGP) + ICMP. Routing builds tables; IP forwards.',
        formulaOrSpec: 'Internet Network Layer = IP + {RIP, OSPF, BGP} + ICMP',
      },
      {
        id: 'l6-c2',
        title: 'IPv4 Datagram Format',
        layer: 3,
        summary:
          'An IPv4 datagram has a 20-byte base header (without options) followed by the payload. Key fields include version, header length, type of service, total length, fragmentation fields, TTL, upper-layer protocol, header checksum, and 32-bit source and destination addresses.',
        keyPoints: [
          'Version = 4 (4 bits); Header Length in 32-bit words (4 bits); Type of Service (8 bits).',
          'Total Datagram Length in bytes (16 bits); Identification (16 bits), Flags and Fragment Offset support fragmentation/reassembly.',
          'TTL (8 bits): max remaining hops, decremented at each router; at 0 the datagram is discarded (ICMP 11/0).',
          'Upper-layer protocol (8 bits) identifies the payload, e.g., TCP or UDP; Header Checksum covers the header.',
          'Source IP and Destination IP are 32 bits each; Options (e.g., timestamp, record route) are variable.',
          'Overhead: 20 B IP + 20 B TCP = 40 B per segment plus application data.',
        ],
        examTip: 'TTL is decremented per hop, not per second in practice. Base header = 20 bytes; with TCP, 40 bytes of overhead.',
        formulaOrSpec: 'IPv4 base header = 20 bytes = 5 × 32-bit words (Header Length = 5)',
        comparisonTable: {
          headers: ['Field', 'Size', 'Purpose'],
          rows: [
            ['Version', '4 bits', 'IP version number (4)'],
            ['Header Length', '4 bits', 'Header size in 32-bit words'],
            ['Type of Service', '8 bits', 'Type of data / priority'],
            ['Total Length', '16 bits', 'Datagram length in bytes'],
            ['Identification / Flags / Frag Offset', '16 + 3 + 13 bits', 'Fragmentation & reassembly'],
            ['TTL', '8 bits', 'Max remaining hops'],
            ['Upper-layer Protocol', '8 bits', 'Payload protocol (TCP/UDP)'],
            ['Header Checksum', '16 bits', 'Header error detection'],
            ['Source / Destination IP', '32 bits each', 'Endpoint addresses'],
          ],
        },
      },
      {
        id: 'l6-c3',
        title: 'IPv4 Addressing & CIDR',
        layer: 3,
        summary:
          'An IPv4 address is a 32-bit identifier written in dotted-decimal and split into a network part (high-order bits) and a host part. CIDR (a.b.c.d/x) replaced obsolete classful addressing, letting the network part be any length x and enabling route aggregation.',
        keyPoints: [
          'Subnet mask: 1s for network bits, 0s for host bits (e.g., /23 = 255.255.254.0, /26 = 255.255.255.192).',
          'Network address = host bits all 0; broadcast address = host bits all 1; usable hosts = 2^(32−x) − 2.',
          'Example: 200.23.16.0/23 → mask 255.255.254.0, range 200.23.16.0–200.23.17.255, broadcast 200.23.17.255.',
          'Example: 192.168.10.77/26 → network 192.168.10.64, broadcast 192.168.10.127, 62 usable hosts.',
          'Hierarchy: ICANN → RIR (e.g., APNIC) → ISP → Customer; ISPs advertise one aggregated prefix (route aggregation).',
          'Hosts on the same subnet can reach each other without an intervening router.',
        ],
        examTip:
          'Block size = 256 − (last non-255 mask octet). For /26 the block is 64: subnets start at .0, .64, .128, .192.',
        formulaOrSpec: 'Usable hosts = 2^(32 − x) − 2 | Network = IP AND Mask | Broadcast = Network OR ~Mask',
        comparisonTable: {
          headers: ['Prefix', 'Mask', 'Block size', 'Usable hosts'],
          rows: [
            ['/8', '255.0.0.0', '16,777,216', '16,777,214'],
            ['/16', '255.255.0.0', '65,536', '65,534'],
            ['/23', '255.255.254.0', '512', '510'],
            ['/24', '255.255.255.0', '256', '254'],
            ['/26', '255.255.255.192', '64', '62'],
            ['/30', '255.255.255.252', '4', '2'],
          ],
        },
      },
      {
        id: 'l6-c4',
        title: 'ARP & ICMP',
        layer: 3,
        summary:
          'ARP resolves an IP address to a MAC address on the local LAN: a host broadcasts "Who has this IP?" and the owner replies with its MAC. ICMP carries error and control messages inside IP datagrams, identified by a Type and Code plus the first 8 bytes of the offending datagram.',
        keyPoints: [
          'ARP query is sent in a broadcast frame (FF-FF-FF-FF-FF-FF); the reply is unicast to the requester and cached in the ARP table.',
          'ICMP is carried in IP datagrams ("above" IP) but logically part of the network layer.',
          'ICMP 0/0 Echo Reply, 8/0 Echo Request (ping).',
          'ICMP 3/0 dest network unreachable, 3/1 host unreachable, 3/2 protocol unreachable, 3/3 port unreachable.',
          'ICMP 4/0 Source Quench (congestion control, not used); 11/0 TTL expired (used by traceroute).',
        ],
        examTip: 'ping = 8/0 out, 0/0 back. traceroute relies on 11/0 TTL expired. A closed UDP port returns 3/3.',
        formulaOrSpec: 'ICMP message = Type + Code + first 8 bytes of offending IP datagram',
        comparisonTable: {
          headers: ['Type', 'Code', 'Description'],
          rows: [
            ['0', '0', 'Echo reply (ping)'],
            ['3', '0', 'Destination network unreachable'],
            ['3', '1', 'Destination host unreachable'],
            ['3', '2', 'Destination protocol unreachable'],
            ['3', '3', 'Destination port unreachable'],
            ['4', '0', 'Source quench (congestion control)'],
            ['8', '0', 'Echo request (ping)'],
            ['11', '0', 'TTL expired'],
          ],
        },
      },
      {
        id: 'l6-c5',
        title: 'DHCP: Dynamic Host Configuration',
        layer: 7,
        summary:
          'DHCP lets a host dynamically obtain its IP address (plus mask, gateway and DNS) from a server when it joins a network, with leases that can be renewed and addresses reused. The exchange is the 4-step DORA sequence.',
        keyPoints: [
          '1. DHCP Discover — host broadcasts to find a server (src 0.0.0.0, dst 255.255.255.255).',
          '2. DHCP Offer — server offers an IP address.',
          '3. DHCP Request — host requests the offered address.',
          '4. DHCP ACK — server confirms the lease.',
          'Supports address reuse and mobile users joining networks; lease can be renewed.',
        ],
        examTip: 'Order is D-O-R-A: Discover, Offer, Request, ACK. The first message is a broadcast because the host has no IP yet.',
        formulaOrSpec: 'DORA: Discover → Offer → Request → ACK',
      },
      {
        id: 'l6-c6',
        title: 'NAT: Network Address Translation',
        layer: 3,
        summary:
          'NAT lets a whole private LAN (e.g., 10.0.0.0/24) share a single public IP. The NAT router rewrites each outgoing (source IP, port) to (WAN IP, new port), records the mapping in a translation table, and reverses it for replies.',
        keyPoints: [
          'Outgoing: (10.0.0.1, 3345) → (138.76.29.7, 5001); entry stored in the NAT translation table.',
          'Incoming: (138.76.29.7, 5001) → (10.0.0.1, 3345) using the table.',
          '16-bit port field allows ~60,000 simultaneous connections on one WAN address.',
          'Benefits: one public IP for many devices, change ISP or internal addresses without renumbering, internal hosts not directly addressable (security).',
          'Controversial: routers should process only up to L3 but NAT rewrites L4 ports, violating the end-to-end argument; IPv6 should solve address shortage.',
        ],
        examTip: 'NAT changes BOTH the IP and the port. The checksum must be recomputed. Inbound connections need port forwarding.',
        formulaOrSpec: '(Private IP, Port) ↔ (Public IP, New 16-bit Port)',
        comparisonTable: {
          headers: ['Direction', 'Before NAT', 'After NAT'],
          rows: [
            ['Outgoing (src)', '10.0.0.1:3345', '138.76.29.7:5001'],
            ['Incoming (dst)', '138.76.29.7:5001', '10.0.0.1:3345'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'header-assembler',
      title: 'IPv4 CIDR Subnetter, ARP/DHCP & NAT Translator',
      scenario:
        'Rebuild a 20-byte IPv4 base header field-by-field in transmission order, then solve CIDR, DHCP, NAT and ICMP tasks that a network engineer faces on a home/office NAT router.',
      targetProtocol: 'IPv4 Datagram (20-byte base header)',
      slots: [
        {
          id: 's1',
          label: 'Word 1 · bits 0–3',
          bitWidth: '4 bits',
          correctValue: 'Version (= 4)',
          description: 'IP protocol version number; always 4 for IPv4.',
        },
        {
          id: 's2',
          label: 'Word 1 · bits 4–7',
          bitWidth: '4 bits',
          correctValue: 'Header Length',
          description: 'Header size in 32-bit words; 5 for a 20-byte header without options.',
        },
        {
          id: 's3',
          label: 'Word 1 · bits 8–15',
          bitWidth: '8 bits',
          correctValue: 'Type of Service',
          description: 'Indicates the type of data/priority treatment requested.',
        },
        {
          id: 's4',
          label: 'Word 1 · bits 16–31',
          bitWidth: '16 bits',
          correctValue: 'Total Datagram Length',
          description: 'Length of the whole datagram (header + data) in bytes.',
        },
        {
          id: 's5',
          label: 'Word 2 · bits 0–15',
          bitWidth: '16 bits',
          correctValue: 'Identification (16-bit ID)',
          description: 'Identifies fragments belonging to the same original datagram.',
        },
        {
          id: 's6',
          label: 'Word 3 · bits 0–7',
          bitWidth: '8 bits',
          correctValue: 'Time To Live (TTL)',
          description: 'Maximum remaining hops; decremented at each router, discarded at 0.',
        },
        {
          id: 's7',
          label: 'Word 3 · bits 8–15',
          bitWidth: '8 bits',
          correctValue: 'Upper-layer Protocol',
          description: 'Identifies the payload protocol to deliver to, e.g., TCP or UDP.',
        },
        {
          id: 's8',
          label: 'Word 4',
          bitWidth: '32 bits',
          correctValue: 'Source IP Address',
          description: 'The 32-bit address of the sending interface (rewritten by NAT on egress).',
        },
      ],
      distractors: ['Flow Label', 'Hop Limit', 'Next Header', 'Source MAC Address', 'Sequence Number'],
      parameterTasks: [
        {
          id: 'p1',
          prompt: 'A host is configured as 192.168.10.77/26. What are its network and broadcast addresses?',
          inputPlaceholder: 'network / broadcast',
          options: [
            '192.168.10.0 / 192.168.10.63',
            '192.168.10.64 / 192.168.10.127',
            '192.168.10.77 / 192.168.10.255',
            '192.168.10.64 / 192.168.10.128',
          ],
          correctOption: '192.168.10.64 / 192.168.10.127',
          explanation:
            '/26 = mask 255.255.255.192, block size 64. 77 falls in the 64–127 block, so network = .64 (host bits 0) and broadcast = .127 (host bits 1), giving 62 usable hosts.',
        },
        {
          id: 'p2',
          prompt: 'A laptop joins a Wi-Fi network. What is the correct DHCP message order?',
          options: [
            'Request → Offer → Discover → ACK',
            'Discover → Request → Offer → ACK',
            'Discover → Offer → Request → ACK',
            'Offer → Discover → ACK → Request',
          ],
          correctOption: 'Discover → Offer → Request → ACK',
          explanation:
            'DHCP uses DORA: the host broadcasts Discover, the server replies with Offer, the host sends Request, and the server confirms with ACK.',
        },
        {
          id: 'p3',
          prompt:
            'Host 10.0.0.1 sends from port 3345 to 128.119.40.186:80 through a NAT router with WAN IP 138.76.29.7. What source tuple leaves the WAN interface?',
          options: [
            '10.0.0.1:3345',
            '138.76.29.7:3345 (port is never changed)',
            '128.119.40.186:5001',
            '138.76.29.7:5001',
          ],
          correctOption: '138.76.29.7:5001',
          explanation:
            'NAT replaces (10.0.0.1, 3345) with (138.76.29.7, 5001) and stores the mapping. The reply to 138.76.29.7:5001 is translated back to 10.0.0.1:3345.',
        },
        {
          id: 'p4',
          prompt: 'traceroute receives an ICMP message from each intermediate router. Which Type/Code is it?',
          options: ['8/0 Echo request', '11/0 TTL expired', '3/3 Port unreachable', '0/0 Echo reply'],
          correctOption: '11/0 TTL expired',
          explanation:
            'Each router that decrements TTL to 0 discards the datagram and returns ICMP Type 11 Code 0 (TTL expired). The destination finally answers with 3/3 port unreachable (UDP probes).',
        },
      ],
    },
    flashcards: [
      {
        id: 'l6-f1',
        lectureId: 6,
        front: 'What are the three components of the Internet network layer?',
        back: 'IP protocol (addressing, datagram format), routing protocols (RIP, OSPF, BGP), and ICMP (error reporting/signalling).',
        tag: 'Internet Layer',
      },
      {
        id: 'l6-f2',
        lectureId: 6,
        front: 'How large is the IPv4 base header and what does TTL do?',
        back: '20 bytes without options. TTL (8 bits) is the max remaining hops, decremented at each router; at 0 the datagram is discarded.',
        tag: 'IPv4 Header',
      },
      {
        id: 'l6-f3',
        lectureId: 6,
        front: 'What are the mask, range and broadcast address of 200.23.16.0/23?',
        back: 'Mask 255.255.254.0; range 200.23.16.0–200.23.17.255; broadcast 200.23.17.255; 510 usable hosts.',
        tag: 'CIDR',
      },
      {
        id: 'l6-f4',
        lectureId: 6,
        front: 'What is the IP address allocation hierarchy?',
        back: 'ICANN → Regional Internet Registry (e.g., APNIC) → ISP → Customer, with ISPs aggregating customer prefixes into one advertised route.',
        tag: 'Allocation',
      },
      {
        id: 'l6-f5',
        lectureId: 6,
        front: 'How does ARP resolve an IP address to a MAC address?',
        back: 'The host broadcasts an ARP query ("Who has IP X?") on the LAN; the owner replies with its MAC, which is cached in the ARP table.',
        tag: 'ARP',
      },
      {
        id: 'l6-f6',
        lectureId: 6,
        front: 'Give ICMP Type/Code for: ping request, ping reply, port unreachable, TTL expired.',
        back: 'Echo request 8/0, echo reply 0/0, port unreachable 3/3, TTL expired 11/0.',
        tag: 'ICMP',
      },
      {
        id: 'l6-f7',
        lectureId: 6,
        front: 'What are the four DHCP messages in order?',
        back: 'DORA: DHCP Discover (broadcast), DHCP Offer, DHCP Request, DHCP ACK.',
        tag: 'DHCP',
      },
      {
        id: 'l6-f8',
        lectureId: 6,
        front: 'Why is NAT controversial?',
        back: 'Routers should only process up to Layer 3, but NAT rewrites Layer 4 port numbers, breaking the end-to-end argument; the address shortage should be solved by IPv6.',
        tag: 'NAT',
      },
    ],
    quiz: [
      {
        id: 'l6-q1',
        lectureId: 6,
        question: 'Which field in the IPv4 header is decremented by every router the datagram passes through?',
        options: ['Header Length', 'Identification', 'Fragment Offset', 'Time To Live (TTL)'],
        correctIndex: 3,
        explanation:
          'TTL holds the maximum number of remaining hops and is decremented at each router; when it reaches 0 the datagram is discarded and ICMP 11/0 is returned.',
        difficulty: 'core',
      },
      {
        id: 'l6-q2',
        lectureId: 6,
        question: 'What is the broadcast address of the subnet containing 172.16.5.200/27?',
        options: ['172.16.5.255', '172.16.5.223', '172.16.5.192', '172.16.5.207'],
        correctIndex: 1,
        explanation:
          '/27 has block size 32 (mask 255.255.255.224). 200 lies in the 192–223 block, so the network is 172.16.5.192 and the broadcast (host bits all 1) is 172.16.5.223.',
        difficulty: 'advanced',
      },
      {
        id: 'l6-q3',
        lectureId: 6,
        question: 'Which DHCP message is sent first, and how?',
        options: [
          'DHCP Discover, broadcast by the client',
          'DHCP Offer, unicast by the server',
          'DHCP Request, unicast by the client',
          'DHCP ACK, broadcast by the server',
        ],
        correctIndex: 0,
        explanation:
          'DORA begins with DHCP Discover, broadcast by the client because it has no IP address and does not know the server.',
        difficulty: 'core',
      },
      {
        id: 'l6-q4',
        lectureId: 6,
        question:
          'A reply arrives at NAT router 138.76.29.7 with destination port 5001. The table has 138.76.29.7:5001 ↔ 10.0.0.1:3345. What does the router do?',
        options: [
          'Drops it because the destination is not a private address',
          'Rewrites the source to 10.0.0.1:3345',
          'Rewrites the destination to 10.0.0.1:3345 and forwards it on the LAN',
          'Broadcasts it to all hosts in 10.0.0.0/24',
        ],
        correctIndex: 2,
        explanation:
          'For incoming datagrams NAT replaces the (WAN IP, NAT port) destination with the stored (private IP, port), here 10.0.0.1:3345.',
        difficulty: 'core',
      },
      {
        id: 'l6-q5',
        lectureId: 6,
        question: 'A host sends a UDP datagram to a closed port on a reachable server. Which ICMP message comes back?',
        options: ['Type 11 Code 0', 'Type 0 Code 0', 'Type 4 Code 0', 'Type 3 Code 3'],
        correctIndex: 3,
        explanation:
          'Type 3 is destination unreachable and Code 3 specifies port unreachable. 11/0 is TTL expired, 0/0 echo reply, 4/0 source quench.',
        difficulty: 'core',
      },
      {
        id: 'l6-q6',
        lectureId: 6,
        question:
          'An ISP owns 200.23.16.0/20 and gives eight customers /23 blocks. Why can it advertise only one route to the Internet?',
        options: [
          'Because NAT hides the customer networks',
          'Because all eight /23 blocks fall inside 200.23.16.0/20 (route aggregation)',
          'Because ARP resolves the customer addresses',
          'Because classful addressing assigns one Class B to the ISP',
        ],
        correctIndex: 1,
        explanation:
          'Hierarchical CIDR addressing allows route aggregation: eight /23s (200.23.16.0–200.23.31.255) are covered by the single /20 prefix the ISP advertises.',
        difficulty: 'advanced',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Lecture 7 — IPv6
  // ---------------------------------------------------------------------------
  {
    id: 7,
    title: 'IPv6',
    shortTitle: 'IPv6',
    sectorId: 3,
    sectorName: 'The Internet Layer',
    estimatedMinutes: 40,
    osiLayers: [3],
    tagline: '128 bits, no broadcast, no checksum: compress addresses, forge EUI-64 IDs and autoconfigure with SLAAC.',
    concepts: [
      {
        id: 'l7-c1',
        title: 'IPv6 Design Goals',
        layer: 3,
        summary:
          'IPv6 (selected at the 1994 IETF Toronto meeting) was designed to fix IPv4 address exhaustion and routing-table growth. It uses 128-bit addresses, simplifies the header, and builds in security and multicast.',
        keyPoints: [
          '128-bit address space (vs. 32-bit IPv4) — about 3.4 × 10^38 addresses.',
          'Reduce the size of global routing tables through strict hierarchical allocation.',
          'Simplify the protocol so routers process packets faster; remove unused IPv4 fields.',
          'Built-in support for authentication and encryption (IPsec AH/ESP extension headers) and multicast.',
          'Allow coexistence with IPv4 during a long transition.',
        ],
        examTip: 'IPv6 addresses are 128 bits = 16 bytes = 8 groups of 16 bits. IPv4 is 32 bits.',
        formulaOrSpec: 'Address size: IPv4 = 32 bits, IPv6 = 128 bits (2^128 addresses)',
        comparisonTable: {
          headers: ['Feature', 'IPv4', 'IPv6'],
          rows: [
            ['Address length', '32 bits', '128 bits'],
            ['Base header', '20 bytes, variable (options)', '40 bytes, fixed'],
            ['Header checksum', 'Yes', 'Removed'],
            ['Fragmentation', 'By routers (hop-by-hop)', 'Source only (PMTU discovery mandated)'],
            ['Broadcast', 'Yes', 'No — replaced by multicast'],
            ['Hop counter', 'TTL', 'Hop Limit'],
          ],
        },
      },
      {
        id: 'l7-c2',
        title: 'Address Representation & Compression',
        layer: 3,
        summary:
          'An IPv6 address is written as 8 groups of 4 hex digits (16 bits each) separated by colons. Leading zeros in a group may be omitted, and at most one run of contiguous all-zero groups may be replaced by "::".',
        keyPoints: [
          'Full: 3ffe:3700:0200:00ff:0000:0000:0000:0001.',
          'Drop leading zeros: 3ffe:3700:200:ff:0:0:0:1.',
          'Replace one zero run with ::  →  3ffe:3700:200:ff::1.',
          ':: may appear only once, otherwise the address is ambiguous.',
          'Prefixes use CIDR notation, e.g., 2001:db8::/32; IPv4-mapped form ::FFFF:a.b.c.d.',
        ],
        examTip: 'Two "::" in one address is ALWAYS invalid. Only leading zeros can be dropped — never trailing zeros (ff ≠ ff00).',
        formulaOrSpec: '8 groups × 16 bits = 128 bits; one "::" maximum',
        comparisonTable: {
          headers: ['Step', 'Result'],
          rows: [
            ['Full form', '3ffe:3700:0200:00ff:0000:0000:0000:0001'],
            ['Omit leading zeros', '3ffe:3700:200:ff:0:0:0:1'],
            ['Collapse zero run', '3ffe:3700:200:ff::1'],
            ['Loopback', '0:0:0:0:0:0:0:1 → ::1'],
          ],
        },
      },
      {
        id: 'l7-c3',
        title: 'Address Types & Hierarchy',
        layer: 3,
        summary:
          'IPv6 defines unicast, multicast and anycast addresses — there is NO broadcast; its role is taken by multicast, so all-0s and all-1s host IDs are legal. Global allocation is hierarchical: RIR /32 → end site /48 → subnet /64.',
        keyPoints: [
          'Unicast specials: :: unspecified, ::1 loopback, FE80::/10 link-local, FEC0::/10 site-local, ::FFFF:a.b.c.d IPv4-mapped, ::a.b.c.d IPv4-compatible.',
          'Multicast FF00::/8 (e.g., FF02::1 all hosts, FF02::2 all routers).',
          'Anycast: delivered to the nearest of a set of interfaces.',
          'Hierarchy: RIR allocates /32 to ISPs, ISP gives /48 to an end site (65,536 /64 subnets), each LAN is a /64.',
          'Interfaces normally hold multiple addresses: link-local, global EUI-64, global privacy, site-local.',
        ],
        examTip: 'Trap: "IPv6 broadcast address" does not exist. Use FF02::1 (all-nodes multicast) instead.',
        formulaOrSpec: '/48 site → 2^(64−48) = 65,536 /64 subnets',
        comparisonTable: {
          headers: ['Type / Prefix', 'Meaning'],
          rows: [
            ['::/128', 'Unspecified'],
            ['::1/128', 'Loopback'],
            ['FE80::/10', 'Link-local unicast'],
            ['FEC0::/10', 'Site-local unicast (deprecated)'],
            ['FF00::/8', 'Multicast'],
            ['::FFFF:a.b.c.d', 'IPv4-mapped'],
          ],
        },
      },
      {
        id: 'l7-c4',
        title: 'Interface ID: EUI-64 & Privacy Addresses',
        layer: 3,
        summary:
          'The lower 64 bits of an IPv6 address are the interface ID. With modified EUI-64, the 48-bit MAC is split in half, FFFE is inserted in the middle, and the 7th bit (Universal/Local bit) of the first octet is inverted.',
        keyPoints: [
          'MAC 00-02-2D-02-82-34 → split 00022D | 028234.',
          'Insert FFFE: 00-02-2D-FF-FE-02-82-34 (64 bits).',
          'Flip the 7th bit of the first octet: 0x00 (00000000) → 0x02 (00000010).',
          'Interface ID = 0202:2dff:fe02:8234; link-local address = FE80::202:2dff:fe02:8234.',
          'Privacy addresses: random 64-bit IDs that may change per connection, addressing concerns about exposing the MAC (available since Windows XP).',
        ],
        examTip: 'Two steps, both required: insert FFFE AND flip the 7th (U/L) bit. Forgetting the bit flip is the #1 exam mistake.',
        formulaOrSpec: 'EUI-64 = MAC[0..23] ⊕ 0x020000 | FFFE | MAC[24..47]',
      },
      {
        id: 'l7-c5',
        title: 'SLAAC: Stateless Address Autoconfiguration',
        layer: 3,
        summary:
          'SLAAC provides plug-and-play addressing without manual configuration. A host builds a link-local address, solicits routers with ICMPv6 Type 133, and forms a global address from the /64 prefix in the ICMPv6 Type 134 Router Advertisement.',
        keyPoints: [
          '1. Self-assign link-local: FE80:0:0:0 prefix + EUI-64 interface ID.',
          '2. Join FF02::1 (all-hosts multicast group).',
          '3. Send ICMPv6 Router Solicitation (Type 133) to FF02::2 (all-routers), with its link-layer address.',
          '4. Router replies with ICMPv6 Router Advertisement (Type 134) carrying the /64 prefix.',
          'Host adds prefix + EUI-64 to its address pool and keeps the link-local; if no router replies it uses link-local only.',
          'SLAAC does not pass DNS/time servers — stateful DHCPv6 or other mechanisms are needed.',
        ],
        examTip: 'RS = 133 (host → FF02::2), RA = 134 (router → host / FF02::1). No broadcast is used anywhere.',
        formulaOrSpec: 'Global address = /64 prefix (from RA type 134) + 64-bit EUI-64 interface ID',
      },
      {
        id: 'l7-c6',
        title: 'IPv6 Fixed Header, Extension Headers & Transition',
        layer: 3,
        summary:
          'The IPv6 header is a fixed 40 bytes with 8 fields. IHL, header checksum and hop-by-hop fragmentation were removed; options move into extension headers chained by Next Header. Transition relies on tunnels, ALGs and DNS AAAA records.',
        keyPoints: [
          'Fields: Version (4b), Traffic Class (8b), Flow Label (20b), Payload Length (16b), Next Header (8b), Hop Limit (8b), Source (128b), Destination (128b).',
          'Removed: variable header length (IHL), header checksum (rely on other layers), router fragmentation (MTU discovery mandated).',
          'Extension headers: Hop-by-Hop Options, Routing, Fragmentation, Destination Options, Authentication (AH), Encrypted Security Payload (ESP).',
          'Tunnels: encapsulate an IPv6 packet inside an IPv4 header to cross IPv4 islands (MTU problems).',
          'DNS: AAAA record (resource record type 28); reverse lookup uses nibble-reversed PTR under ip6.arpa.',
        ],
        examTip: '4+8+20+16+8+8 = 64 bits (8 bytes) + 2 × 16-byte addresses = 40 bytes. Hop Limit replaced TTL.',
        formulaOrSpec: 'IPv6 header = 8 B fixed fields + 16 B Src + 16 B Dst = 40 bytes',
        comparisonTable: {
          headers: ['IPv6 Field', 'Bits', 'IPv4 equivalent'],
          rows: [
            ['Version', '4', 'Version'],
            ['Traffic Class', '8', 'Type of Service'],
            ['Flow Label', '20', 'None (new)'],
            ['Payload Length', '16', 'Total Length (excludes header)'],
            ['Next Header', '8', 'Protocol'],
            ['Hop Limit', '8', 'TTL'],
            ['Source / Destination', '128 each', '32-bit addresses'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'header-assembler',
      title: 'IPv6 Address Compressor, EUI-64 Forge & SLAAC Lab',
      scenario:
        'Assemble the 8 fields of the fixed 40-byte IPv6 header in order, then compress addresses, forge an EUI-64 interface ID (insert FFFE + flip the 7th bit), and walk a host through SLAAC with ICMPv6 133/134.',
      targetProtocol: 'IPv6 Fixed Header (40 bytes)',
      slots: [
        {
          id: 's1',
          label: 'Field 1',
          bitWidth: '4 bits',
          correctValue: 'Version (= 6)',
          description: 'Same position and name as in IPv4; value 6.',
        },
        {
          id: 's2',
          label: 'Field 2',
          bitWidth: '8 bits',
          correctValue: 'Traffic Class',
          description: 'New field for packet priority/class (DiffServ marking).',
        },
        {
          id: 's3',
          label: 'Field 3',
          bitWidth: '20 bits',
          correctValue: 'Flow Label',
          description: 'New field identifying packets of the same flow for special handling.',
        },
        {
          id: 's4',
          label: 'Field 4',
          bitWidth: '16 bits',
          correctValue: 'Payload Length',
          description: 'Length of data after the 40-byte header (unlike IPv4 Total Length).',
        },
        {
          id: 's5',
          label: 'Field 5',
          bitWidth: '8 bits',
          correctValue: 'Next Header',
          description: 'Type of the next header (extension header or TCP/UDP), replacing Protocol/options.',
        },
        {
          id: 's6',
          label: 'Field 6',
          bitWidth: '8 bits',
          correctValue: 'Hop Limit',
          description: 'Was TTL in IPv4; decremented by each router.',
        },
        {
          id: 's7',
          label: 'Field 7',
          bitWidth: '128 bits',
          correctValue: 'Source Address (128-bit)',
          description: 'IPv6 address of the originating interface.',
        },
        {
          id: 's8',
          label: 'Field 8',
          bitWidth: '128 bits',
          correctValue: 'Destination Address (128-bit)',
          description: 'IPv6 address of the intended recipient (may be multicast, e.g., FF02::2).',
        },
      ],
      distractors: ['Header Checksum', 'Fragment Offset', 'Header Length (IHL)', 'Time To Live (TTL)'],
      parameterTasks: [
        {
          id: 'p1',
          prompt: 'Compress 3ffe:3700:0200:00ff:0000:0000:0000:0001 to its shortest valid form.',
          inputPlaceholder: 'compressed IPv6',
          options: ['3ffe:37::2:ff::1', '3ffe:3700:200:ff::1', '3ffe:3700:2:ff::1', '3ffe:3700:200:ff:0::0:1'],
          correctOption: '3ffe:3700:200:ff::1',
          explanation:
            'Drop leading zeros (0200 → 200, 00ff → ff, 0001 → 1) and replace the single run of four zero groups with ::. Dropping trailing zeros (200 → 2) or using :: twice is invalid.',
        },
        {
          id: 'p2',
          prompt: 'Compute the modified EUI-64 interface ID for MAC 00-02-2D-02-82-34.',
          inputPlaceholder: 'xxxx:xxxx:xxxx:xxxx',
          options: ['0002:2dff:fe02:8234', '0202:2dff:fe02:8234', '0202:2dfe:ff02:8234', '0002:2d02:8234:fffe'],
          correctOption: '0202:2dff:fe02:8234',
          explanation:
            'Insert FFFE between 00-02-2D and 02-82-34 → 0002:2dff:fe02:8234, then invert the 7th (Universal/Local) bit of the first octet: 0x00 → 0x02, giving 0202:2dff:fe02:8234.',
        },
        {
          id: 'p3',
          prompt: 'During SLAAC, which message does a booting host send, and to where?',
          options: [
            'ICMPv6 Type 134 Router Advertisement to FF02::1',
            'DHCP Discover to 255.255.255.255',
            'ICMPv6 Type 133 Router Solicitation to FF02::2',
            'ARP request to the broadcast MAC',
          ],
          correctOption: 'ICMPv6 Type 133 Router Solicitation to FF02::2',
          explanation:
            'The host sends a Router Solicitation (Type 133) to the all-routers group FF02::2; the router answers with a Router Advertisement (Type 134) carrying the /64 prefix. IPv6 has no broadcast.',
        },
        {
          id: 'p4',
          prompt: 'Which DNS resource record maps a name to an IPv6 address?',
          options: ['A record (type 1)', 'MX record (type 15)', 'PTR record under in-addr.arpa', 'AAAA record (type 28)'],
          correctOption: 'AAAA record (type 28)',
          explanation:
            'AAAA ("quad-A") is a simple extension of the A record with resource record type 28. Reverse lookups use nibble-reversed PTR records under ip6.arpa.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l7-f1',
        lectureId: 7,
        front: 'How many bits is an IPv6 address and how is it written?',
        back: '128 bits, written as 8 groups of 4 hex digits (16 bits each) separated by colons.',
        tag: 'Addressing',
      },
      {
        id: 'l7-f2',
        lectureId: 7,
        front: 'What are the two compression rules for IPv6 addresses?',
        back: 'Omit leading zeros in each group, and replace at most ONE contiguous run of all-zero groups with "::".',
        tag: 'Compression',
      },
      {
        id: 'l7-f3',
        lectureId: 7,
        front: 'How is a modified EUI-64 interface ID built from a 48-bit MAC?',
        back: 'Insert FFFE in the middle of the MAC and invert the 7th (Universal/Local) bit of the first octet. 00-02-2D-02-82-34 → 0202:2dff:fe02:8234.',
        tag: 'EUI-64',
      },
      {
        id: 'l7-f4',
        lectureId: 7,
        front: 'Does IPv6 have broadcast addresses?',
        back: 'No. Broadcast is replaced by multicast (e.g., FF02::1 all-nodes), so all-0s and all-1s host IDs are legal addresses.',
        tag: 'Address Types',
      },
      {
        id: 'l7-f5',
        lectureId: 7,
        front: 'What are the ICMPv6 types for Router Solicitation and Router Advertisement?',
        back: 'Router Solicitation = Type 133 (sent to FF02::2, all routers); Router Advertisement = Type 134 (carries the /64 prefix).',
        tag: 'SLAAC',
      },
      {
        id: 'l7-f6',
        lectureId: 7,
        front: 'List the 8 fields of the IPv6 fixed header with sizes.',
        back: 'Version 4b, Traffic Class 8b, Flow Label 20b, Payload Length 16b, Next Header 8b, Hop Limit 8b, Source 128b, Destination 128b (40 bytes total).',
        tag: 'IPv6 Header',
      },
      {
        id: 'l7-f7',
        lectureId: 7,
        front: 'Which IPv4 header features were removed in IPv6?',
        back: 'Variable header length (IHL), the header checksum, and hop-by-hop fragmentation by routers; options moved to extension headers.',
        tag: 'Simplification',
      },
      {
        id: 'l7-f8',
        lectureId: 7,
        front: 'What is the IPv6 allocation hierarchy?',
        back: 'RIR allocates /32 to an ISP → ISP assigns /48 to an end site (65,536 subnets) → each subnet/LAN is a /64.',
        tag: 'Hierarchy',
      },
    ],
    quiz: [
      {
        id: 'l7-q1',
        lectureId: 7,
        question: 'Which of the following is a VALID compression of 2001:0db8:0000:0000:0001:0000:0000:0001?',
        options: [
          '2001:db8::1::1',
          '2001:db8:0:0:1::1',
          '2001:db8::1:0:0:1',
          'Both 2001:db8:0:0:1::1 and 2001:db8::1:0:0:1',
        ],
        correctIndex: 3,
        explanation:
          '"::" may replace only one run of zero groups. Either zero run may be compressed, so both single-"::" forms are valid, while 2001:db8::1::1 is ambiguous and invalid.',
        difficulty: 'advanced',
      },
      {
        id: 'l7-q2',
        lectureId: 7,
        question: 'What is the size of the fixed IPv6 header?',
        options: ['20 bytes', '40 bytes', '60 bytes', 'Variable, 20–60 bytes'],
        correctIndex: 1,
        explanation:
          'The IPv6 header is a fixed 40 bytes: 8 bytes of fixed fields plus two 128-bit (16-byte) addresses. Options are carried in extension headers.',
        difficulty: 'core',
      },
      {
        id: 'l7-q3',
        lectureId: 7,
        question: 'A host has MAC 00-1A-2B-3C-4D-5E. What is its modified EUI-64 interface ID?',
        options: [
          '001a:2bff:fe3c:4d5e',
          '021a:2bfe:ff3c:4d5e',
          '021a:2bff:fe3c:4d5e',
          '001a:2b3c:4d5e:fffe',
        ],
        correctIndex: 2,
        explanation:
          'Insert FFFE in the middle (001a:2bff:fe3c:4d5e) and flip the 7th bit of the first octet (0x00 → 0x02), giving 021a:2bff:fe3c:4d5e.',
        difficulty: 'advanced',
      },
      {
        id: 'l7-q4',
        lectureId: 7,
        question: 'During SLAAC, to which address does a host send its ICMPv6 Type 133 Router Solicitation?',
        options: ['FF02::2 (all routers)', 'FF02::1 (all hosts)', 'FE80::1', 'The IPv6 broadcast address'],
        correctIndex: 0,
        explanation:
          'The Router Solicitation (Type 133) goes to FF02::2, the all-routers multicast group; the router responds with a Type 134 Router Advertisement. IPv6 has no broadcast.',
        difficulty: 'core',
      },
      {
        id: 'l7-q5',
        lectureId: 7,
        question: 'Which IPv6 field replaced the IPv4 TTL?',
        options: ['Flow Label', 'Traffic Class', 'Next Header', 'Hop Limit'],
        correctIndex: 3,
        explanation:
          'Hop Limit (8 bits) is the renamed TTL, decremented at each router. Next Header replaces Protocol, and Traffic Class corresponds to Type of Service.',
        difficulty: 'core',
      },
      {
        id: 'l7-q6',
        lectureId: 7,
        question: 'Which prefix identifies an IPv6 link-local unicast address?',
        options: ['FF00::/8', 'FE80::/10', 'FEC0::/10', '::FFFF:0:0/96'],
        correctIndex: 1,
        explanation:
          'FE80::/10 is link-local (used by SLAAC with the EUI-64 ID). FF00::/8 is multicast, FEC0::/10 site-local, and ::FFFF:a.b.c.d IPv4-mapped.',
        difficulty: 'core',
      },
    ],
  },
];

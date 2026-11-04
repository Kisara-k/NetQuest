export interface SandboxStep {
  id: string;
  hopIndex: number;
  hopName: string;
  location: 'sender' | 'switch' | 'router' | 'wan' | 'server';
  activeLayer: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  description: string;
  headers: {
    l7?: { name: string; detail: string };
    l4?: { name: string; detail: string };
    l3?: { name: string; detail: string };
    l2?: { name: string; detail: string };
    l1?: { name: string; detail: string };
  };
  diagnosticNotes: string[];
  challenge?: {
    prompt: string;
    options: string[];
    correctOption: string;
    explanation: string;
  };
}

export interface SandboxScenario {
  id: 'https' | 'ipv6' | 'ipsec';
  title: string;
  subtitle: string;
  tagline: string;
  steps: SandboxStep[];
}

export const SANDBOX_SCENARIOS: SandboxScenario[] = [
  {
    id: 'https',
    title: 'HTTPS Web Request over NAT & 802.1Q VLAN',
    subtitle: 'L7 HTTP/TLS → L4 TCP → L3 IPv4 NAT → L2 802.1Q VLAN → L1 Bits',
    tagline:
      'Trace an encrypted web payload as client OS encapsulates TCP/IP, access switch inserts 802.1Q VLAN tag, border router translates NAT ports, and core forwards frame.',
    steps: [
      {
        id: 'https-1',
        hopIndex: 0,
        hopName: 'Sender Host: Application & TLS Layer',
        location: 'sender',
        activeLayer: 7,
        description: 'Web client constructs an HTTP/1.1 GET request wrapped in a TLS ApplicationData record.',
        headers: {
          l7: { name: 'TLS 1.2 / HTTP', detail: 'ApplicationData (Cipher: AES-GCM-128, 48B Master Secret)' },
        },
        diagnosticNotes: [
          'Browser uses TSAP port 443 on remote server.',
          'Payload is encrypted using symmetric session key negotiated during TLS handshake.',
        ],
      },
      {
        id: 'https-2',
        hopIndex: 0,
        hopName: 'Sender Host: Transport Multiplexing',
        location: 'sender',
        activeLayer: 4,
        description: 'Transport layer segments payload, adds 20-byte TCP header with client port 52314 and server port 443.',
        headers: {
          l7: { name: 'TLS 1.2 / HTTP', detail: 'ApplicationData' },
          l4: { name: 'TCP Header (20B)', detail: 'Src Port: 52314 → Dst Port: 443, SEQ: 1000, ACK: 500' },
        },
        diagnosticNotes: [
          'TCP provides reliable byte-stream delivery with cumulative ACKs.',
          'Full 4-tuple connection established in ESTABLISHED state.',
        ],
        challenge: {
          prompt: 'If the IP MTU is 1500 bytes and headers total 40 bytes (20B IP + 20B TCP), what is the maximum TCP MSS?',
          options: ['1460 bytes', '1500 bytes', '1480 bytes', '1518 bytes'],
          correctOption: '1460 bytes',
          explanation: 'MSS = MTU (1500) - IPv4 Header (20) - TCP Base Header (20) = 1460 bytes.',
        },
      },
      {
        id: 'https-3',
        hopIndex: 0,
        hopName: 'Sender Host: IPv4 Datagram Addressing',
        location: 'sender',
        activeLayer: 3,
        description: 'Network layer adds 20-byte IPv4 header with private source IP 192.168.1.50 and destination IP 203.0.113.80.',
        headers: {
          l7: { name: 'TLS 1.2 / HTTP', detail: 'ApplicationData' },
          l4: { name: 'TCP Header', detail: '52314 → 443' },
          l3: { name: 'IPv4 Header (20B)', detail: 'Src: 192.168.1.50 → Dst: 203.0.113.80, TTL: 64, Protocol: 6 (TCP)' },
        },
        diagnosticNotes: [
          'Host checks subnet mask: destination is on a remote subnet.',
          'Packet will be forwarded to Default Gateway (L3 Router).',
        ],
      },
      {
        id: 'https-4',
        hopIndex: 1,
        hopName: 'Access Switch: IEEE 802.1Q VLAN Tagging',
        location: 'switch',
        activeLayer: 2,
        description: 'L2 Switch tags frame with 4-byte 802.1Q header (TPID 0x8100, VLAN ID 10) for departmental segregation.',
        headers: {
          l7: { name: 'TLS 1.2 / HTTP', detail: 'ApplicationData' },
          l4: { name: 'TCP Header', detail: '52314 → 443' },
          l3: { name: 'IPv4 Header', detail: '192.168.1.50 → 203.0.113.80' },
          l2: { name: 'Ethernet + 802.1Q (1522B max)', detail: 'TPID: 0x8100, VID: 10, Priority: 3, FCS: 32-bit CRC' },
        },
        diagnosticNotes: [
          'Standard untagged frame is 1518B; 802.1Q tag expands max valid frame to 1522 bytes.',
          'Inter-Frame Gap (IFG) is 96 bit times (9.6 µs at 10 Mbps).',
        ],
      },
      {
        id: 'https-5',
        hopIndex: 2,
        hopName: 'Border Router: NAT Translation & Routing',
        location: 'router',
        activeLayer: 3,
        description: 'Router decapsulates VLAN tag, rewrites private IP/Port in NAT table, and decrements TTL.',
        headers: {
          l7: { name: 'TLS 1.2 / HTTP', detail: 'ApplicationData' },
          l4: { name: 'TCP Header', detail: 'Src Port: 60234 (Translated) → Dst Port: 443' },
          l3: { name: 'IPv4 Header (Rewritten)', detail: 'Src: 198.51.100.1 (WAN IP) → Dst: 203.0.113.80, TTL: 63' },
          l2: { name: 'WAN Link Header', detail: 'Next Hop MAC rewritten via ARP' },
        },
        diagnosticNotes: [
          'TTL decremented by 1 at each L3 hop; if TTL hits 0, router returns ICMP Type 11 Code 0.',
          'NAT translates 192.168.1.50:52314 → 198.51.100.1:60234.',
        ],
        challenge: {
          prompt: 'What happens to the IPv4 Header Checksum when the router decrements TTL?',
          options: [
            'Checksum must be recomputed because TTL changed',
            'Checksum remains identical',
            'Checksum is removed completely',
            'Checksum is converted to CRC-32',
          ],
          correctOption: 'Checksum must be recomputed because TTL changed',
          explanation: 'Because the TTL field in the IPv4 header changed, the 16-bit one complement header checksum must be recalculated at every router hop.',
        },
      },
      {
        id: 'https-6',
        hopIndex: 4,
        hopName: 'Target Web Server: Full Decapsulation',
        location: 'server',
        activeLayer: 7,
        description: 'Web server verifies FCS, decapsulates IP and TCP headers, and hands decrypted HTTP stream to server daemon.',
        headers: {
          l7: { name: 'HTTPS / HTTP Daemon', detail: 'HTTP GET /index.html 200 OK' },
        },
        diagnosticNotes: [
          'Server TCP sends cumulative ACK acknowledging received byte sequence numbers.',
          'Zero-latency decapsulation complete across all 7 layers.',
        ],
      },
    ],
  },
  {
    id: 'ipv6',
    title: 'IPv6 Native SLAAC & Flow Label Routing',
    subtitle: 'ICMPv6 133/134 → EUI-64 MAC Inversion → 40B Fixed Header',
    tagline:
      'Observe stateless address autoconfiguration (SLAAC) using ICMPv6 Router Solicitation/Advertisement and 128-bit header routing.',
    steps: [
      {
        id: 'ipv6-1',
        hopIndex: 0,
        hopName: 'IPv6 Host: EUI-64 Identifier Generation',
        location: 'sender',
        activeLayer: 3,
        description: 'Host takes 48-bit MAC address 00-02-2D-02-82-34, inserts FFFE in the middle and inverts the 7th bit.',
        headers: {
          l3: { name: 'IPv6 Link-Local', detail: 'FE80::0202:2DFF:FE02:8234 (Scope: Link-Local /10)' },
          l2: { name: 'Ethernet', detail: 'Src MAC: 00:02:2d:02:82:34' },
        },
        diagnosticNotes: [
          'Universal/Local 7th bit is flipped (0 → 1) to mark globally administered IEEE MACs.',
          'Host joins solicited-node multicast group FF02::1:FF02:8234.',
        ],
      },
      {
        id: 'ipv6-2',
        hopIndex: 0,
        hopName: 'Sender Host: Router Solicitation (RS)',
        location: 'sender',
        activeLayer: 3,
        description: 'Host broadcasts ICMPv6 Type 133 Router Solicitation to all-routers multicast group FF02::2.',
        headers: {
          l3: { name: 'IPv6 Header (40B)', detail: 'Src: FE80::... → Dst: FF02::2 (All Routers Multicast), Next Header: 58 (ICMPv6)' },
        },
        diagnosticNotes: [
          'No broadcast exists in IPv6; all one-to-all communication uses multicast groups.',
          'Hop limit is set to 255 to prevent off-link spoofing.',
        ],
        challenge: {
          prompt: 'What ICMPv6 message does the local router send back in response to Router Solicitation (Type 133)?',
          options: [
            'Type 134 Router Advertisement (RA)',
            'Type 128 Echo Request',
            'Type 135 Neighbor Solicitation',
            'Type 3 Destination Unreachable',
          ],
          correctOption: 'Type 134 Router Advertisement (RA)',
          explanation: 'The router periodically and upon solicitation transmits ICMPv6 Type 134 Router Advertisements carrying the /64 network prefix.',
        },
      },
      {
        id: 'ipv6-3',
        hopIndex: 2,
        hopName: 'Core Router: 40-Byte Fixed Header Switching',
        location: 'router',
        activeLayer: 3,
        description: 'Router inspects 20-bit Flow Label and 8-bit Next Header without recomputing any checksum.',
        headers: {
          l3: { name: 'IPv6 40-Byte Fixed Header', detail: 'Version: 6, Traffic Class: 0, Flow Label: 0x9A42F, Hop Limit: 63' },
        },
        diagnosticNotes: [
          'IPv6 removed the header checksum for ultra-fast wire-speed hardware switching.',
          'Hop-by-hop fragmentation removed; sender uses Path MTU Discovery.',
        ],
      },
      {
        id: 'ipv6-4',
        hopIndex: 4,
        hopName: 'Target Host: Address Resolution Complete',
        location: 'server',
        activeLayer: 3,
        description: 'Target receives packet at global unicast address 2001:db8:acad:1::1.',
        headers: {
          l3: { name: 'IPv6 Unicast', detail: 'Compressed notation: 2001:db8:acad:1::1' },
        },
        diagnosticNotes: [
          'At most one contiguous block of zeros is replaced with ::.',
          'DNS resolution uses AAAA records (Type 28).',
        ],
      },
    ],
  },
  {
    id: 'ipsec',
    title: 'Site-to-Site IPsec VPN Tunnel (ESP Mode)',
    subtitle: 'Original IP Encapsulated in ESP Protocol 50 + New Gateway IP',
    tagline:
      'Tunnel private enterprise subnets across untrusted public networks using Encapsulating Security Payload (ESP) in Tunnel Mode.',
    steps: [
      {
        id: 'ipsec-1',
        hopIndex: 0,
        hopName: 'Branch Workstation: Plaintext IP Packet',
        location: 'sender',
        activeLayer: 3,
        description: 'Client generates internal enterprise packet (10.10.1.10 → 10.20.1.20).',
        headers: {
          l4: { name: 'TCP Header', detail: 'Port 80 HTTP' },
          l3: { name: 'Inner (Original) IP Header', detail: 'Src: 10.10.1.10 → Dst: 10.20.1.20' },
        },
        diagnosticNotes: [
          'Packet contains sensitive branch intranet data.',
          'Direct Internet routing of 10.0.0.0/8 private addresses is impossible.',
        ],
      },
      {
        id: 'ipsec-2',
        hopIndex: 2,
        hopName: 'VPN Gateway A: ESP Tunnel Encapsulation',
        location: 'router',
        activeLayer: 3,
        description: 'Gateway encrypts original IP packet, adds ESP Header (Protocol 50), and wraps in Outer Public IP Header.',
        headers: {
          l3: { name: 'New Outer IP Header', detail: 'Src: 203.0.113.1 (GW-A) → Dst: 198.51.100.2 (GW-B), Protocol: 50 (ESP)' },
          l2: { name: 'ESP Header', detail: 'SPI: 0x4A128B90, Sequence #: 104' },
        },
        diagnosticNotes: [
          'Security Association (SA) is simplex; two SAs exist for bidirectional encrypted traffic.',
          'ESP provides confidentiality (encryption) plus anti-replay sequence verification.',
        ],
        challenge: {
          prompt: 'What IP protocol number identifies ESP in the Outer IP header?',
          options: ['Protocol 50', 'Protocol 51', 'Protocol 6', 'Protocol 17'],
          correctOption: 'Protocol 50',
          explanation: 'RFC 2406 assigns IP Protocol 50 to Encapsulating Security Payload (ESP), whereas Protocol 51 is Authentication Header (AH).',
        },
      },
      {
        id: 'ipsec-3',
        hopIndex: 3,
        hopName: 'Public Internet Core: Blind Forwarding',
        location: 'wan',
        activeLayer: 3,
        description: 'Core routers only see outer IP addresses and ESP payload; inner IPs and payload remain completely hidden.',
        headers: {
          l3: { name: 'Public Transit Packet', detail: 'Outer IP (Public GWs) + Encrypted Ciphertext' },
        },
        diagnosticNotes: [
          'Eavesdroppers on WAN cannot determine internal source or destination IPs.',
          'Anti-replay sequence window drops duplicate or injected packets.',
        ],
      },
      {
        id: 'ipsec-4',
        hopIndex: 4,
        hopName: 'VPN Gateway B: Decryption & Decapsulation',
        location: 'server',
        activeLayer: 3,
        description: 'Headquarters gateway authenticates ICV, strips outer IP and ESP headers, and routes plaintext packet into HQ intranet.',
        headers: {
          l3: { name: 'Restored Inner IP Header', detail: 'Src: 10.10.1.10 → Dst: 10.20.1.20' },
          l4: { name: 'TCP Header', detail: 'Port 80 HTTP' },
        },
        diagnosticNotes: [
          'Decapsulation restores true end-to-end communication for internal nodes.',
        ],
      },
    ],
  },
];

import type { LectureModule } from '@/types/curriculum';

const SECTOR_NAME = 'Cyber Defense & Network Design';

export const SECTOR5_LECTURES: LectureModule[] = [
  // ---------------------------------------------------------------------------
  // Lecture 11 — Introduction to Network Security
  // ---------------------------------------------------------------------------
  {
    id: 11,
    title: 'Introduction to Network Security',
    shortTitle: 'Network Security',
    sectorId: 5,
    sectorName: SECTOR_NAME,
    estimatedMinutes: 35,
    osiLayers: [3, 4, 7],
    tagline: 'Most incidents start on the inside — lock down privilege, authenticate everyone, and know exactly what SSL does not protect.',
    concepts: [
      {
        id: 'l11-c1',
        title: 'What "Secure" Means & What We Protect',
        summary:
          'A computer system is secure if you can depend upon it to behave as you expect. Security is about protecting physical assets, data and software, personnel and — above all — trust.',
        keyPoints: [
          'Definition: "A computer system is secure if you can depend upon it to behave as you expect."',
          'Assets to protect: physical assets (hardware, buildings), data & software, personnel, and trust/reputation.',
          'Threats come from insiders (users, sysadmins, programmers) and outsiders (associates, former employees, hackers).',
          'Most security incidents are caused by insiders — not anonymous outside hackers.',
          'Security is a process (prevent, detect, respond), not a single product you install once.',
        ],
        examTip:
          'Classic trap: "Most attacks come from outside hackers." The slides stress the opposite — MOST incidents are due to insiders.',
        formulaOrSpec: 'Threat Origins = Insiders (users, sysadmins, programmers) + Outsiders (associates, ex-employees, hackers)',
        comparisonTable: {
          headers: ['Origin', 'Examples', 'Why Dangerous'],
          rows: [
            ['Insider', 'Users, sysadmins, programmers', 'Already authenticated with legitimate privileges'],
            ['Outsider (associate)', 'Contractors, partners', 'Partial trust & network access'],
            ['Outsider (former employee)', 'Recently departed staff', 'May retain knowledge or stale accounts'],
            ['Outsider (hacker)', 'Remote attackers', 'Must break in through perimeter defences'],
          ],
        },
      },
      {
        id: 'l11-c2',
        title: 'E-Commerce & Data Security Pillars',
        layer: 7,
        summary:
          'Secure electronic transactions rest on five requirements: authentication, confidentiality (privacy), integrity, accountability and non-repudiation. Each answers a different question about who sent what and whether it was changed.',
        keyPoints: [
          'Authentication: proving you are who you claim to be.',
          'Confidentiality (Privacy): only the intended recipient can read the data.',
          'Integrity: the data has not been altered in transit or storage.',
          'Accountability: actions can be traced to the responsible party (audit logs).',
          'Non-repudiation: the sender cannot later deny having sent/signed the message.',
        ],
        examTip:
          'Integrity ≠ Confidentiality. A plaintext message with a valid signature has integrity but no privacy; an encrypted message may be private yet still be tampered with.',
        formulaOrSpec: 'Pillars = Authentication + Confidentiality + Integrity + Accountability + Non-repudiation',
        comparisonTable: {
          headers: ['Pillar', 'Question Answered', 'Typical Mechanism'],
          rows: [
            ['Authentication', 'Who are you?', 'Passwords, tokens, certificates'],
            ['Confidentiality', 'Who can read it?', 'Encryption with recipient public key'],
            ['Integrity', 'Was it changed?', 'Hash / signature with sender private key'],
            ['Accountability', 'Who did it?', 'Audit trails & logging'],
            ['Non-repudiation', 'Can the sender deny it?', 'Digital signatures'],
          ],
        },
      },
      {
        id: 'l11-c3',
        title: 'Access Control: Minimum Privilege & 3-Factor Authentication',
        summary:
          'The Principle of Minimum Privilege grants all privileges needed to do the work and no more. Strong authentication combines factors from three categories: something you have, something you know and something you are.',
        keyPoints: [
          'Minimum Privilege: "all privileges needed to do work and no more" — limits damage from insiders and compromised accounts.',
          'Factor 1 — Something you HAVE: token, smart card.',
          'Factor 2 — Something you KNOW: password, PIN.',
          'Factor 3 — Something you ARE: fingerprint, biometric.',
          'Two passwords are still ONE factor; true multi-factor combines different categories.',
        ],
        examTip:
          'Password + PIN is NOT two-factor authentication — both are "something you know". Pair a password with a token or fingerprint.',
        formulaOrSpec: '3-Factor Auth = Have (token) + Know (password) + Are (fingerprint)',
      },
      {
        id: 'l11-c4',
        title: 'System & Network Hardening',
        layer: 4,
        summary:
          'Hardening shrinks the attack surface: run only the components you need, patch the OS and applications, and watch advisories. Never send passwords in plaintext across the network.',
        keyPoints: [
          'Minimise installed components and running services — every service is a potential entry point.',
          'Patch operating systems and applications promptly.',
          'Monitor security advisories such as www.cert.org.',
          'Avoid plaintext network passwords (Telnet/FTP/rlogin); use SSH or challenge-response schemes.',
          'Combine host hardening with perimeter controls (firewalls) — defence in depth.',
        ],
        examTip:
          'If asked how to stop password sniffing on a LAN, the answer is SSH / challenge-response, not "use a longer password".',
        formulaOrSpec: 'Hardening = Minimise components + Patch OS & apps + Monitor CERT + No plaintext passwords (SSH)',
      },
      {
        id: 'l11-c5',
        title: 'Symmetric vs Asymmetric Encryption Modes',
        summary:
          'Symmetric (single-key) encryption uses one shared secret; asymmetric (public-key) uses a mathematically linked key pair. Which key you encrypt with determines whether you get privacy or integrity/authentication.',
        keyPoints: [
          'Symmetric: same key encrypts and decrypts — fast, but the key must be shared securely.',
          'Asymmetric: public key is published; private key is kept secret by the owner.',
          'Encrypt with the RECIPIENT\'S PUBLIC key → Privacy/Confidentiality (only their private key decrypts).',
          'Encrypt with the SENDER\'S PRIVATE key → Integrity/Authentication (anyone with the public key can verify).',
          'Combining both (sign then encrypt) gives privacy + authentication together.',
        ],
        examTip:
          'Memory hook: PUBLIC key encrypt = PRIVACY; PRIVATE key encrypt = PROOF (integrity/authentication). Encrypting with your private key hides nothing — everyone has your public key.',
        formulaOrSpec: 'E(PubKey_B) → Privacy  |  E(PrivKey_A) → Integrity + Authentication',
        comparisonTable: {
          headers: ['Operation', 'Who Can Decrypt/Verify', 'Service Provided'],
          rows: [
            ['Encrypt with recipient public key', 'Only recipient (private key)', 'Privacy / Confidentiality'],
            ['Encrypt with sender private key', 'Anyone (sender public key)', 'Integrity / Authentication'],
            ['Symmetric shared key', 'Anyone holding the shared key', 'Confidentiality (fast)'],
          ],
        },
      },
      {
        id: 'l11-c6',
        title: 'Firewalls & Web Security Limits',
        layer: 3,
        summary:
          'Firewalls range from packet filters inspecting network-layer headers to application gateways that understand protocols. On the web, SSL protects data in transit only — it does nothing for data stored on the server or client.',
        keyPoints: [
          'Packet filter firewall: inspects L3/L4 header fields (IP addresses, ports).',
          'Application gateway (proxy): understands application protocols — finer control, more overhead.',
          'Web server risks: CGI scripts and database interfaces exposed to user input.',
          'Client browser risks: ActiveX controls, plugins, cookies and browser bugs.',
          'SSL encrypts data in transit: 40-bit export grade is weak; 128-bit is strong.',
          'SSL does NOT secure data once it is sitting on the server or the client.',
        ],
        examTip:
          'A stolen database of credit cards from a server running HTTPS is NOT an SSL failure — SSL only protects the wire, not data at rest.',
        formulaOrSpec: 'SSL: 40-bit (export, weak) vs 128-bit (strong) — protects in-transit data only',
      },
    ],
    labConfig: {
      engine: 'matrix-arena',
      title: 'Cyber Defense & Access Control Matrix',
      scenario:
        'You are the new security officer of an e-commerce startup. Triage each finding from the security audit into the right defensive domain: who the threat is, which security pillar is at stake, which access-control/hardening control applies, or which crypto/perimeter tool fits.',
      categories: [
        { id: 'threats', title: 'Threat Origins', subtitle: 'Insiders vs outsiders' },
        { id: 'pillars', title: 'Security Pillars', subtitle: 'Auth, privacy, integrity, accountability, non-repudiation' },
        { id: 'access', title: 'Access Control & Hardening', subtitle: 'Minimum privilege, 3-factor auth, patching, SSH' },
        { id: 'crypto', title: 'Crypto & Perimeter', subtitle: 'Key operations, firewalls, SSL limits' },
      ],
      items: [
        {
          id: 'i1',
          text: 'A sysadmin copies the customer database to a USB drive before resigning',
          correctCategoryId: 'threats',
          explanation: 'Sysadmins are insiders with legitimate privileges — the slides stress that most incidents are due to insiders.',
        },
        {
          id: 'i2',
          text: 'A former employee logs in with an account that was never disabled',
          correctCategoryId: 'threats',
          explanation: 'Former employees are classed as outsiders who may retain knowledge or stale credentials.',
        },
        {
          id: 'i3',
          text: 'A customer later claims they never placed a signed order',
          correctCategoryId: 'pillars',
          explanation: 'Non-repudiation (via digital signatures) prevents a sender from denying a transaction.',
        },
        {
          id: 'i4',
          text: 'Audit logs must trace every refund to the clerk who issued it',
          correctCategoryId: 'pillars',
          explanation: 'Accountability means actions can be traced back to the responsible party.',
        },
        {
          id: 'i5',
          text: 'An attacker alters the price field of an order while it is in transit',
          correctCategoryId: 'pillars',
          explanation: 'Tampering with data violates integrity — the message is no longer what was sent.',
        },
        {
          id: 'i6',
          text: 'Interns get read-only access to just the reports they need, nothing more',
          correctCategoryId: 'access',
          explanation: 'Principle of Minimum Privilege: all privileges needed to do the work and no more.',
        },
        {
          id: 'i7',
          text: 'VPN login requires a password, a hardware token and a fingerprint',
          correctCategoryId: 'access',
          explanation: '3-factor authentication: something you know, something you have and something you are.',
        },
        {
          id: 'i8',
          text: 'Replace Telnet with SSH and apply outstanding OS patches from CERT advisories',
          correctCategoryId: 'access',
          explanation: 'Hardening: avoid plaintext network passwords (use SSH), patch OS/apps and monitor www.cert.org.',
        },
        {
          id: 'i9',
          text: 'Encrypt the order with the merchant\'s public key so only the merchant can read it',
          correctCategoryId: 'crypto',
          explanation: 'Encrypting with the recipient public key provides privacy/confidentiality — only the private key decrypts.',
        },
        {
          id: 'i10',
          text: 'Encrypt a digest with your private key so anyone can verify you sent it',
          correctCategoryId: 'crypto',
          explanation: 'Encrypting with the sender private key provides integrity and authentication, verifiable with the public key.',
        },
        {
          id: 'i11',
          text: 'Block inbound traffic by IP address and port at the network edge',
          correctCategoryId: 'crypto',
          explanation: 'A packet-filter firewall inspects network/transport header fields at the perimeter.',
        },
        {
          id: 'i12',
          text: 'HTTPS is enabled, yet card numbers stored on the web server are stolen',
          correctCategoryId: 'crypto',
          explanation: 'SSL encrypts data in transit only — it does NOT secure data once it is sitting on the server or client.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l11-f1',
        lectureId: 11,
        front: 'Give the lecture definition of a secure computer system.',
        back: 'A computer system is secure if you can depend upon it to behave as you expect.',
        tag: 'Definition',
      },
      {
        id: 'l11-f2',
        lectureId: 11,
        front: 'Who causes most security incidents — insiders or outsiders?',
        back: 'Insiders (users, sysadmins, programmers). Outsiders include associates, former employees and hackers.',
        tag: 'Threat Origins',
      },
      {
        id: 'l11-f3',
        lectureId: 11,
        front: 'List the five e-commerce/data security pillars.',
        back: 'Authentication, Confidentiality (Privacy), Integrity, Accountability and Non-repudiation.',
        tag: 'Pillars',
      },
      {
        id: 'l11-f4',
        lectureId: 11,
        front: 'State the Principle of Minimum Privilege.',
        back: 'Grant all privileges needed to do the work and no more.',
        tag: 'Least Privilege',
      },
      {
        id: 'l11-f5',
        lectureId: 11,
        front: 'What are the three authentication factor categories?',
        back: 'Something you have (token), something you know (password) and something you are (fingerprint).',
        tag: '3-Factor Auth',
      },
      {
        id: 'l11-f6',
        lectureId: 11,
        front: 'Encrypting with the recipient\'s PUBLIC key provides which service?',
        back: 'Privacy/Confidentiality — only the matching private key holder can decrypt.',
        tag: 'Public Key',
      },
      {
        id: 'l11-f7',
        lectureId: 11,
        front: 'Encrypting with the sender\'s PRIVATE key provides which service?',
        back: 'Integrity and Authentication — anyone with the sender public key can verify the origin.',
        tag: 'Private Key',
      },
      {
        id: 'l11-f8',
        lectureId: 11,
        front: 'What is the key limitation of SSL for web security?',
        back: 'SSL only encrypts data in transit (40-bit export weak, 128-bit strong); it does not secure data once it sits on the server or client.',
        tag: 'SSL',
      },
    ],
    quiz: [
      {
        id: 'l11-q1',
        lectureId: 11,
        question: 'According to the lecture, which group is responsible for MOST security incidents?',
        options: ['Remote hackers', 'Insiders such as users and sysadmins', 'Business associates', 'Competitors'],
        correctIndex: 1,
        explanation:
          'The slides list insiders (users, sysadmins, programmers) and outsiders (associates, former employees, hackers), stressing that most incidents are due to insiders.',
        difficulty: 'core',
      },
      {
        id: 'l11-q2',
        lectureId: 11,
        question: 'Alice wants to send Bob a message that only Bob can read. Which key should she encrypt it with?',
        options: ["Alice's private key", "Alice's public key", "Bob's private key", "Bob's public key"],
        correctIndex: 3,
        explanation:
          "Encrypting with the recipient's public key gives privacy/confidentiality because only Bob's private key can decrypt it. Alice never has Bob's private key.",
        difficulty: 'core',
      },
      {
        id: 'l11-q3',
        lectureId: 11,
        question: 'A login requires a password and a 4-digit PIN. How many authentication factor categories does it use?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctIndex: 0,
        explanation:
          'Both a password and a PIN are "something you know", so this is single-factor. Multi-factor requires combining know/have/are categories.',
        difficulty: 'advanced',
      },
      {
        id: 'l11-q4',
        lectureId: 11,
        question: 'Which security pillar prevents a customer from later denying they submitted a signed order?',
        options: ['Confidentiality', 'Integrity', 'Non-repudiation', 'Accountability'],
        correctIndex: 2,
        explanation:
          'Non-repudiation ensures the sender cannot deny sending/signing a message, typically via digital signatures made with the private key.',
        difficulty: 'core',
      },
      {
        id: 'l11-q5',
        lectureId: 11,
        question: 'An online shop uses 128-bit SSL, yet attackers steal stored card numbers from its database. What is the best explanation?',
        options: [
          '128-bit SSL is too weak and should be 40-bit',
          'SSL only protects data in transit, not data sitting on the server',
          'SSL encrypts only the HTTP headers',
          'The firewall disabled SSL',
        ],
        correctIndex: 1,
        explanation:
          'SSL encrypts data in transit (128-bit is strong; 40-bit export is weak) but does NOT secure data once it is on the server or client. Server/database (CGI/DB interface) security is a separate concern.',
        difficulty: 'advanced',
      },
      {
        id: 'l11-q6',
        lectureId: 11,
        question: 'Which hardening action best stops passwords from being sniffed on the network?',
        options: [
          'Install more services for redundancy',
          'Use Telnet with longer passwords',
          'Use SSH or challenge-response authentication',
          'Disable OS patching to avoid instability',
        ],
        correctIndex: 2,
        explanation:
          'The lecture recommends avoiding plaintext network passwords by using SSH or challenge-response, alongside minimising components and patching OS/apps.',
        difficulty: 'core',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Lecture 12 — Public Key Infrastructure
  // ---------------------------------------------------------------------------
  {
    id: 12,
    title: 'Public Key Infrastructure',
    shortTitle: 'PKI',
    sectorId: 5,
    sectorName: SECTOR_NAME,
    estimatedMinutes: 30,
    osiLayers: [6, 7],
    tagline: "Public keys are useless if you can't trust them — PKI makes a trusted CA vouch for every key so Charles can't swap them.",
    concepts: [
      {
        id: 'l12-c1',
        title: 'Symmetric Cryptosystems',
        summary:
          'Symmetric (secret/shared-key) systems use two instances of the same key for encryption and decryption. They are fast but scale badly: every pair of users needs its own key.',
        keyPoints: [
          'Same secret key encrypts and decrypts — called the secret key or shared secret.',
          'Advantages: fast encryption/decryption; hard to break with a large key space.',
          'Key growth: N users need N(N-1)/2 keys (10 users → 45 keys; 100 users → 4,950 keys).',
          'Requires a secure mechanism to deliver and store keys.',
          'Provides confidentiality but NOT authenticity or non-repudiation.',
          'Algorithms: DES, 3DES, RC4/RC5/RC6, AES.',
        ],
        examTip:
          'Always compute N(N-1)/2, not N² or N-1. For 10 users: 10×9/2 = 45 unique pairwise keys.',
        formulaOrSpec: 'Symmetric keys required = N(N-1)/2  (N = 10 → 45 keys)',
      },
      {
        id: 'l12-c2',
        title: 'Asymmetric Cryptosystems',
        summary:
          'Asymmetric systems use a public/private key pair: whatever one key encrypts, only the other decrypts. They scale well and support authentication and non-repudiation, but are much slower.',
        keyPoints: [
          'Two mathematically related keys; the private key cannot be derived from the public key.',
          'Public key is known to everyone; private key is known and used only by the owner.',
          'If the private key is disclosed, the cryptosystem is useless for that owner.',
          'Advantages: better key distribution and scalability; provides authentication & non-repudiation.',
          'Disadvantage: works much more slowly than symmetric systems.',
          'Algorithms: RSA, Elliptic Curve (ECC), Diffie-Hellman, El Gamal.',
        ],
        examTip:
          'Hybrid systems use asymmetric crypto to exchange a symmetric session key, then symmetric crypto for bulk data — best of both worlds.',
        formulaOrSpec: 'Each user needs 1 key pair → N users = N public + N private keys (2N total)',
        comparisonTable: {
          headers: ['Property', 'Symmetric', 'Asymmetric'],
          rows: [
            ['Keys', 'One shared secret', 'Public + private pair'],
            ['Speed', 'Fast', 'Much slower'],
            ['Keys for N users', 'N(N-1)/2', '2N (one pair each)'],
            ['Authenticity / non-repudiation', 'No', 'Yes'],
            ['Examples', 'DES, 3DES, RC4-6, AES', 'RSA, ECC, Diffie-Hellman, El Gamal'],
          ],
        },
      },
      {
        id: 'l12-c3',
        title: 'Why PKI? The Man-in-the-Middle Problem',
        summary:
          'Public keys can be used to exchange a secret key, but how do you know a public key really belongs to Bob? During a raw key exchange Charles can intercept and substitute his own keys — a Man-in-the-Middle (MITM) attack.',
        keyPoints: [
          'Charles intercepts Alice\'s request for Bob\'s public key and returns his OWN public key.',
          'Alice encrypts to Charles thinking it is Bob; Charles decrypts, reads/modifies, re-encrypts with Bob\'s real key.',
          'Neither Alice nor Bob detects the swap — raw public keys carry no proof of ownership.',
          'PKI is a system to securely distribute public keys and verify their validity.',
          'PKI is a framework (programs, formats, procedures, protocols, policies), not a single technology.',
          'PKI services: confidentiality, access control, integrity, authentication, non-repudiation.',
        ],
        examTip:
          'MITM defeats encryption without breaking any cipher — the fix is authenticating the public key itself via a CA-signed certificate.',
        formulaOrSpec: 'PKI = Certificates (X.509) + CA + RA + CRL + Directories + policies/protocols',
      },
      {
        id: 'l12-c4',
        title: 'Digital Certificates (X.509) & the Certificate Authority',
        summary:
          'A digital certificate binds a public key to identifying information and is digitally signed by a trusted third party, the Certificate Authority (CA). Certificates follow the X.509 standard.',
        keyPoints: [
          'Certificate = subject public key + identifying information, signed by the CA.',
          'Format standard: X.509.',
          'Strangers can authenticate each other because everyone trusts the CA.',
          'CA constructs the certificate, signs it, sends it to the requester and maintains it over its lifetime.',
          'A CA can be internal to an organisation or a dedicated public service provider.',
        ],
        examTip:
          'Only the CA SIGNS/ISSUES certificates. If a question asks "who signs the X.509 certificate?", the answer is always the CA.',
        formulaOrSpec: 'Certificate = {Subject ID, Subject Public Key, Validity, Issuer} signed with CA private key',
      },
      {
        id: 'l12-c5',
        title: 'Registration Authority vs Certificate Authority & CRL',
        summary:
          'The RA performs registration duties — it verifies identity and brokers requests to the CA — but it CANNOT issue certificates. The CA revokes certificates and publishes them in the Certificate Revocation List (CRL).',
        keyPoints: [
          'RA establishes and confirms an individual\'s identity.',
          'RA initiates certification with a CA on behalf of the end user and performs life-cycle management functions.',
          'RA CANNOT issue certificates — it acts only as a broker between user and CA.',
          'CA may revoke a certificate if it was issued with false credentials or the private key was compromised.',
          'Revoked certificates are listed in the CRL, maintained and updated periodically by the CA.',
        ],
        examTip:
          'RA vs CA: RA = identity check & broker (no issuing power). CA = issues, signs and revokes; maintains the CRL.',
        formulaOrSpec: 'Flow: Subject → RA (verify identity) → CA (sign X.509) → Verifier (check CRL)',
        comparisonTable: {
          headers: ['Role', 'Verifies Identity', 'Issues/Signs Certs', 'Maintains CRL'],
          rows: [
            ['Registration Authority (RA)', 'Yes', 'No — broker only', 'No'],
            ['Certificate Authority (CA)', 'Relies on RA', 'Yes', 'Yes'],
            ['Directory', 'No', 'No', 'Publishes certs/CRL'],
          ],
        },
      },
      {
        id: 'l12-c6',
        title: 'PKI Terminology',
        summary:
          'PKI uses precise role names: Issuer, Subject, Target, Principal and Verifier. Knowing which party is which avoids confusion when tracing a certificate chain.',
        keyPoints: [
          'Issuer: the organisation/server/person who issued the certificate (the CA).',
          'Subject: the person who obtained the certificate.',
          'Target: the person whose certificate is being sought.',
          'Principal: any entity holding a public key.',
          'Verifier (relying party): evaluates the certificate chain and checks revocation status.',
        ],
        examTip:
          'Subject = who OWNS the cert; Target = whose cert you are LOOKING FOR; Verifier = who CHECKS it.',
        comparisonTable: {
          headers: ['Term', 'Meaning'],
          rows: [
            ['Issuer', 'Entity that issued the certificate (CA)'],
            ['Subject', 'Person who obtained the certificate'],
            ['Target', 'Person whose certificate is sought'],
            ['Principal', 'Entity with a public key'],
            ['Verifier', 'Evaluates the certificate chain'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'sequence-simulator',
      title: 'PKI Certificate Lifecycle & MITM Defense Lab',
      scenario:
        'Alice\'s 10-person team is drowning in shared secret keys, and Charles has been caught swapping public keys. Walk Alice through obtaining a CA-signed X.509 certificate via the RA, then see how relying parties use the CRL when her private key is later compromised.',
      actors: ['Subject (Alice)', 'RA', 'CA'],
      steps: [
        {
          id: 'st1',
          fromIndex: 0,
          toIndex: 0,
          label: 'Symmetric key audit: 10 users → 45 keys',
          detail:
            'With symmetric crypto every pair needs a unique key: N(N-1)/2 = 10×9/2 = 45 keys to generate, distribute and store securely.',
          stateAfter: 'Keys needed = N(N-1)/2 = 45',
          isInteractivePrompt: true,
          options: ['10 keys', '20 keys', '45 keys', '100 keys'],
          correctOption: '45 keys',
          explanation:
            'Symmetric systems need N(N-1)/2 keys for N users: 10×9/2 = 45. Asymmetric would need just one key pair per user.',
        },
        {
          id: 'st2',
          fromIndex: 0,
          toIndex: 0,
          label: 'MITM detected: Charles swapped public keys',
          detail:
            'In a raw public-key exchange Charles intercepted Alice\'s request for Bob\'s key and returned his own, decrypting and re-encrypting traffic undetected.',
          stateAfter: 'Raw public keys untrusted',
          isInteractivePrompt: true,
          options: [
            'Use longer RSA keys',
            'Switch to symmetric DES keys',
            'Bind public keys to identities with CA-signed certificates',
            'Encrypt with the sender private key',
          ],
          correctOption: 'Bind public keys to identities with CA-signed certificates',
          explanation:
            'MITM exploits unauthenticated public keys. PKI fixes this by having a trusted CA sign a certificate that binds the key to the owner\'s identity.',
        },
        {
          id: 'st3',
          fromIndex: 0,
          toIndex: 1,
          label: 'Certificate request + identity proof + public key',
          detail:
            'Alice generates her key pair (private key never leaves her) and submits her public key with identity documents to the Registration Authority.',
          stateAfter: 'Request pending at RA',
        },
        {
          id: 'st4',
          fromIndex: 1,
          toIndex: 1,
          label: 'RA verifies identity',
          detail:
            'The RA establishes and confirms Alice\'s identity. It performs registration duties but has no authority to issue certificates.',
          stateAfter: 'Identity confirmed (no cert yet)',
          isInteractivePrompt: true,
          options: [
            'RA signs and issues the X.509 certificate',
            'RA forwards the verified request to the CA — it cannot issue certificates',
            'RA publishes the certificate to the CRL',
            'RA returns Alice\'s private key',
          ],
          correctOption: 'RA forwards the verified request to the CA — it cannot issue certificates',
          explanation:
            'The RA confirms identity and acts as a broker between the user and the CA. Only the CA can construct and sign certificates.',
        },
        {
          id: 'st5',
          fromIndex: 1,
          toIndex: 2,
          label: 'Forward verified certificate request',
          detail: 'The RA initiates the certification process with the CA on Alice\'s behalf.',
          stateAfter: 'Request queued at CA',
        },
        {
          id: 'st6',
          fromIndex: 2,
          toIndex: 0,
          label: 'Signed X.509 certificate issued',
          detail:
            'The CA constructs the X.509 certificate (Alice\'s identity + public key), signs it with the CA private key, sends it to Alice and maintains it over its lifetime.',
          stateAfter: 'Alice holds valid X.509 cert',
          isInteractivePrompt: true,
          options: [
            'Alice\'s private key',
            'The RA\'s private key',
            'The CA\'s private key',
            'Bob\'s public key',
          ],
          correctOption: 'The CA\'s private key',
          explanation:
            'The CA signs certificates with its own private key; any verifier checks the signature with the trusted CA public key.',
        },
        {
          id: 'st7',
          fromIndex: 0,
          toIndex: 0,
          label: 'Alice presents cert to Bob (Verifier)',
          detail:
            'Bob, the relying party, validates the CA signature and the certificate chain — Charles can no longer substitute his key because he cannot forge the CA signature.',
          stateAfter: 'Verifier trusts Alice\'s key',
        },
        {
          id: 'st8',
          fromIndex: 0,
          toIndex: 2,
          label: 'Report: private key compromised',
          detail:
            'Alice\'s laptop is stolen. A compromised private key (or false credentials at issue time) is grounds for revocation.',
          stateAfter: 'Revocation requested',
        },
        {
          id: 'st9',
          fromIndex: 2,
          toIndex: 2,
          label: 'Certificate added to CRL',
          detail:
            'The CA revokes the certificate and lists it in the Certificate Revocation List, which it maintains and updates periodically.',
          stateAfter: 'Cert REVOKED (on CRL)',
          isInteractivePrompt: true,
          options: [
            'Certificate Revocation List (CRL) maintained by the CA',
            'RA identity database',
            'X.509 extensions field of the same certificate',
            'Alice\'s local keystore',
          ],
          correctOption: 'Certificate Revocation List (CRL) maintained by the CA',
          explanation:
            'Revoked certificates are stored in the CRL by the CA; verifiers must check it, because a revoked certificate still carries a valid-looking signature.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l12-f1',
        lectureId: 12,
        front: 'How many keys does a symmetric system need for N users?',
        back: 'N(N-1)/2 keys — e.g., 10 users need 45 keys.',
        tag: 'Key Growth',
      },
      {
        id: 'l12-f2',
        lectureId: 12,
        front: 'Name four symmetric and four asymmetric algorithms.',
        back: 'Symmetric: DES, 3DES, RC4/5/6, AES. Asymmetric: RSA, ECC, Diffie-Hellman, El Gamal.',
        tag: 'Algorithms',
      },
      {
        id: 'l12-f3',
        lectureId: 12,
        front: 'What security services do symmetric systems NOT provide?',
        back: 'Authenticity and non-repudiation — they provide confidentiality only.',
        tag: 'Symmetric',
      },
      {
        id: 'l12-f4',
        lectureId: 12,
        front: 'Why is PKI needed if we already have public-key cryptography?',
        back: 'Raw public keys cannot be authenticated, so an attacker (Charles) can perform a man-in-the-middle key swap. PKI binds keys to identities via CA-signed certificates.',
        tag: 'MITM',
      },
      {
        id: 'l12-f5',
        lectureId: 12,
        front: 'What standard defines digital certificates?',
        back: 'The ITU-T X.509 standard defines digital public-key certificates and their structure.',
        tag: 'X.509',
      },
      {
        id: 'l12-f6',
        lectureId: 12,
        front: 'What does the RA do, and what can it NOT do?',
        back: 'It verifies identity, initiates certification with the CA and handles life-cycle tasks — but it CANNOT issue certificates; it is only a broker.',
        tag: 'RA vs CA',
      },
      {
        id: 'l12-f7',
        lectureId: 12,
        front: 'Give two reasons a CA revokes a certificate.',
        back: 'The certificate was issued to a person with false credentials, or the holder\'s private key was compromised. Revoked certs go on the CRL.',
        tag: 'CRL',
      },
      {
        id: 'l12-f8',
        lectureId: 12,
        front: 'In PKI terminology, what is the difference between Subject and Target?',
        back: 'Subject is the person who obtained the certificate; Target is the person whose certificate is being sought.',
        tag: 'Terminology',
      },
    ],
    quiz: [
      {
        id: 'l12-q1',
        lectureId: 12,
        question: 'A company of 20 employees uses only symmetric keys so every pair can talk privately. How many keys are required?',
        options: ['20', '190', '380', '400'],
        correctIndex: 1,
        explanation:
          'Symmetric systems need N(N-1)/2 keys: 20×19/2 = 190. 380 forgets to divide by 2 and 400 is N².',
        difficulty: 'core',
      },
      {
        id: 'l12-q2',
        lectureId: 12,
        question: 'Which PKI component verifies a user\'s identity but CANNOT issue certificates?',
        options: ['Certificate Authority', 'Directory', 'Registration Authority', 'Verifier'],
        correctIndex: 2,
        explanation:
          'The RA establishes and confirms identity and brokers the request to the CA, but it cannot issue certificates. The CA constructs and signs them.',
        difficulty: 'core',
      },
      {
        id: 'l12-q3',
        lectureId: 12,
        question: 'Charles intercepts Alice\'s request for Bob\'s public key and returns his own. What PKI element defeats this attack?',
        options: [
          'A larger symmetric key space',
          'A CA-signed X.509 certificate binding Bob\'s identity to his public key',
          'Encrypting messages with Alice\'s private key',
          'Using RC4 instead of DES',
        ],
        correctIndex: 1,
        explanation:
          'This is a man-in-the-middle attack on raw public-key exchange. A certificate signed by a trusted CA proves the key belongs to Bob, and Charles cannot forge the CA signature.',
        difficulty: 'advanced',
      },
      {
        id: 'l12-q4',
        lectureId: 12,
        question: 'Which is a disadvantage of asymmetric cryptosystems compared with symmetric ones?',
        options: [
          'Poor key distribution',
          'No support for non-repudiation',
          'They work much more slowly',
          'They need N(N-1)/2 keys',
        ],
        correctIndex: 2,
        explanation:
          'Asymmetric systems offer better key distribution, scalability, authentication and non-repudiation, but work much more slowly than symmetric systems.',
        difficulty: 'core',
      },
      {
        id: 'l12-q5',
        lectureId: 12,
        question: 'A verifier receives a certificate with a valid CA signature, but the owner\'s private key was stolen last week. What should the verifier check?',
        options: [
          'The Certificate Revocation List (CRL)',
          'The RA\'s identity records',
          'The subject\'s symmetric key',
          'Nothing — a valid signature is sufficient',
        ],
        correctIndex: 0,
        explanation:
          'A compromised private key is grounds for revocation; the CA lists revoked certs in its periodically updated CRL. The signature alone stays valid, so the CRL must be checked.',
        difficulty: 'advanced',
      },
      {
        id: 'l12-q6',
        lectureId: 12,
        question: 'In PKI terminology, who is the "Issuer"?',
        options: [
          'The person who obtained the certificate',
          'The person whose certificate is sought',
          'The entity that evaluates a certificate chain',
          'The organisation/server that issued the certificate',
        ],
        correctIndex: 3,
        explanation:
          'Issuer = the entity (CA) that issued the certificate. Subject obtained it, Target is whose cert is sought, Verifier evaluates the chain.',
        difficulty: 'core',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Lecture 13 — Secure Protocols
  // ---------------------------------------------------------------------------
  {
    id: 13,
    title: 'Secure Protocols',
    shortTitle: 'Secure Protocols',
    sectorId: 5,
    sectorName: SECTOR_NAME,
    estimatedMinutes: 45,
    osiLayers: [2, 3, 4, 7],
    tagline: 'AH is protocol 51, ESP is 50, SAs are one-way, and TLS derives a 48-byte master secret — security at every layer.',
    concepts: [
      {
        id: 'l13-c1',
        title: 'Threats & the 5 Security Requirements',
        summary:
          'Networks face eavesdropping, client and server imposters, man-in-the-middle, denial of service and malicious code. Secure protocols must deliver privacy, integrity, authentication, non-repudiation and availability.',
        keyPoints: [
          'Eavesdropping: passive capture of traffic.',
          'Client imposter (e.g., IP spoofing) and server imposter (fake site).',
          'Man-in-the-middle: attacker relays/alters traffic between two parties.',
          'DoS/DDoS attacks target availability.',
          'Malicious code: a Virus inserts itself into programs; a Worm self-replicates across the network.',
          '5 requirements: Privacy, Integrity, Authentication, Non-repudiation, Availability.',
        ],
        examTip:
          'Virus vs Worm: a virus needs a host program; a worm spreads by itself over the network.',
        formulaOrSpec: 'Requirements = Privacy + Integrity + Authentication + Non-repudiation + Availability',
        comparisonTable: {
          headers: ['Threat', 'Requirement Violated'],
          rows: [
            ['Eavesdropping', 'Privacy'],
            ['Message tampering / MITM', 'Integrity'],
            ['Client/Server imposter', 'Authentication'],
            ['Denying a sent order', 'Non-repudiation'],
            ['DoS / DDoS', 'Availability'],
          ],
        },
      },
      {
        id: 'l13-c2',
        title: 'Ciphers, Challenge-Response & Hashes',
        summary:
          'Classic substitution ciphers fall to letter-frequency analysis, while transposition ciphers reorder letters. Secret-key encryption satisfies D_K(E_K(P)) = P; challenge-response uses a random nonce, and hashes such as MD5 and SHA-1 provide integrity.',
        keyPoints: [
          'Substitution cipher: replaces letters — broken via letter-frequency histograms.',
          'Transposition cipher: reorders letters (e.g., "security" → "esuciryt").',
          'Secret key: D_K(E_K(P)) = P.',
          'Challenge-response: verifier sends a random nonce r; claimant returns it transformed with the shared key — no password on the wire.',
          'MD5: processes 512-bit blocks → 128-bit hash; Keyed MD5 adds a secret for authentication.',
          'SHA-1: 160-bit hash.',
        ],
        examTip:
          'Hash sizes are classic exam fodder: MD5 = 128 bits, SHA-1 = 160 bits. MD5 block size is 512 bits.',
        formulaOrSpec: 'D_K(E_K(P)) = P  |  MD5: 512-bit block → 128-bit digest  |  SHA-1 → 160-bit digest',
      },
      {
        id: 'l13-c3',
        title: 'Deployment Models, Firewalls & Security Across Layers',
        summary:
          'Security can be deployed host-to-host, gateway-to-gateway (VPN tunnel) or remote-user-to-gateway. Firewalls range from packet filters to circuit-level gateways and application proxies, and security protocols exist at L2, L3 and L4.',
        keyPoints: [
          'Host-to-Host: end systems secure their own traffic.',
          'Gateway-to-Gateway: VPN tunnel between site gateways.',
          'Remote User-to-Gateway: road warrior connects into the corporate gateway.',
          'Packet filter: inspects L3/L4 headers; Circuit-level gateway: relays TCP segments; Application-level proxy: understands the app protocol.',
          'Layer mapping: L2 → WLAN security, L3 → IPsec, L4 → SSL/TLS.',
        ],
        examTip:
          'IPsec lives at the Network layer (L3) and protects any upper protocol; SSL/TLS sits on top of TCP (L4) and protects individual applications.',
        formulaOrSpec: 'L2 = WLAN security | L3 = IPsec | L4 = SSL/TLS',
        comparisonTable: {
          headers: ['Firewall Type', 'Inspects', 'Notes'],
          rows: [
            ['Packet Filter', 'L3/L4 headers', 'Fast, stateless rules on IPs/ports'],
            ['Circuit-Level Gateway', 'TCP sessions', 'Relays TCP segments between hosts'],
            ['Application-Level Proxy', 'Application data', 'Most granular, highest overhead'],
          ],
        },
      },
      {
        id: 'l13-c4',
        title: 'IPsec Security Associations',
        layer: 3,
        summary:
          'IPsec (RFC 2401/2402/2406) is built on the Security Association (SA): a simplex, one-way logical connection identified by an SPI. SAs are negotiated using IKE (RFC 2409).',
        keyPoints: [
          'SA = simplex (one-way) logical connection — bidirectional traffic needs 2 SAs.',
          'Each SA is identified by its Security Parameter Index (SPI) carried in AH/ESP headers.',
          'Keys and algorithms are negotiated with IKE (RFC 2409).',
          'Core RFCs: 2401 (architecture), 2402 (AH), 2406 (ESP).',
          'AH and ESP each require their own SAs.',
        ],
        examTip:
          'Two hosts talking both ways with ESP need 2 SAs; with AH + ESP both ways they need 4.',
        formulaOrSpec: 'Bidirectional link = 2 SAs (one per direction), each identified by an SPI',
      },
      {
        id: 'l13-c5',
        title: 'AH vs ESP & Transport vs Tunnel Mode',
        layer: 3,
        summary:
          'AH (IP protocol 51) authenticates the entire packet with anti-replay protection but provides no encryption. ESP (IP protocol 50) encrypts the payload with optional authentication. Transport mode protects the payload only; tunnel mode wraps the entire original packet in a new IP header.',
        keyPoints: [
          'AH = IP Protocol 51: integrity + data-origin authentication + anti-replay sequence number; NO encryption.',
          'AH covers the entire packet; mutable IP header fields (TTL, checksum) are zeroed for the ICV calculation.',
          'ESP = IP Protocol 50: encryption + optional authentication (HMAC ICV).',
          'Transport mode: original IP header stays visible; only the payload is protected (host-to-host).',
          'Tunnel mode: entire original IP packet encapsulated behind a new gateway IP header (VPNs).',
          'ESP tunnel layout: New IP | ESP Hdr | Orig IP | TCP | Data | ESP Trailer | ESP Auth.',
        ],
        examTip:
          'Remember "AH = 51, ESP = 50" and "AH Authenticates, ESP Encrypts". Need confidentiality? AH alone can never provide it.',
        formulaOrSpec: 'AH = Protocol 51 (auth, no encryption) | ESP = Protocol 50 (encryption + optional auth)',
        comparisonTable: {
          headers: ['Feature', 'AH (51)', 'ESP (50)'],
          rows: [
            ['Encryption', 'No', 'Yes'],
            ['Integrity / Authentication', 'Yes (entire packet)', 'Optional (ESP Auth ICV)'],
            ['Anti-replay sequence #', 'Yes', 'Yes'],
            ['RFC', '2402', '2406'],
          ],
        },
      },
      {
        id: 'l13-c6',
        title: 'SSL / TLS (RFC 2246)',
        layer: 4,
        summary:
          'TLS runs on top of TCP. The Record Protocol provides symmetric encryption and a keyed MAC, while the Handshake Protocol negotiates the version and cipher suite, authenticates with public keys and establishes a 48-byte master secret.',
        keyPoints: [
          'TLS defined in RFC 2246; operates over TCP.',
          'Record Protocol: symmetric encryption + keyed MAC for each record.',
          'Handshake Protocol: negotiate version & cipher suite, public-key authentication, establish the 48-byte Master Secret.',
          'Change Cipher Spec Protocol: switches to the newly negotiated keys.',
          'Alert Protocol: signals warnings and fatal errors.',
        ],
        examTip:
          'The master secret is 48 bytes (384 bits). Public-key crypto is used only in the handshake; bulk data uses fast symmetric crypto in the Record Protocol.',
        formulaOrSpec: 'TLS = Handshake + Change Cipher Spec + Alert over Record Protocol over TCP; Master Secret = 48 bytes',
      },
    ],
    labConfig: {
      engine: 'header-assembler',
      title: 'IPsec AH/ESP (Transport vs. Tunnel) & TLS Handshake Inspector',
      scenario:
        'Two branch gateways build a site-to-site VPN. Assemble a complete ESP Tunnel Mode packet in wire order, then answer the protocol-number, SA and TLS questions the security auditor throws at you.',
      targetProtocol: 'IPsec ESP — Tunnel Mode',
      slots: [
        {
          id: 's1',
          label: 'Outer Header',
          bitWidth: '20 bytes',
          correctValue: 'New IP Header (Gateway IPs)',
          description: 'Tunnel mode adds a new outer IP header between the two gateways, with Protocol = 50.',
        },
        {
          id: 's2',
          label: 'ESP Header',
          bitWidth: '8 bytes',
          correctValue: 'ESP Header (SPI + Seq #)',
          description: 'Carries the 32-bit SPI identifying the SA and a 32-bit anti-replay sequence number.',
        },
        {
          id: 's3',
          label: 'Inner Header',
          bitWidth: '20 bytes',
          correctValue: 'Original IP Header (Hosts)',
          description: 'The original host-to-host IP header is encrypted inside the tunnel, hiding true endpoints.',
        },
        {
          id: 's4',
          label: 'Transport Header',
          bitWidth: '20 bytes',
          correctValue: 'TCP Header',
          description: 'The original transport-layer header, encrypted along with the payload.',
        },
        {
          id: 's5',
          label: 'Payload',
          bitWidth: 'Variable',
          correctValue: 'Payload Data',
          description: 'The application data being protected by ESP encryption.',
        },
        {
          id: 's6',
          label: 'ESP Trailer',
          bitWidth: '2+ bytes',
          correctValue: 'ESP Trailer (Pad + Next Hdr)',
          description: 'Padding, pad length and Next Header fields; the trailer is encrypted.',
        },
        {
          id: 's7',
          label: 'ESP Authentication',
          bitWidth: 'Variable (ICV)',
          correctValue: 'ESP Auth (ICV)',
          description: 'Optional Integrity Check Value (HMAC) computed over ESP header through trailer.',
        },
      ],
      distractors: [
        'AH Header (Protocol 51)',
        'TLS Record Header',
        'TLS Master Secret (48 B)',
        'IKE SA Proposal',
      ],
      parameterTasks: [
        {
          id: 'p1',
          prompt: 'What IP protocol numbers identify AH and ESP respectively?',
          options: ['AH = 50, ESP = 51', 'AH = 51, ESP = 50', 'AH = 6, ESP = 17', 'AH = 47, ESP = 50'],
          correctOption: 'AH = 51, ESP = 50',
          explanation:
            'AH uses IP protocol 51 (authentication, no encryption); ESP uses IP protocol 50 (encryption + optional authentication).',
        },
        {
          id: 'p2',
          prompt: 'How many Security Associations are needed for bidirectional ESP traffic between two gateways?',
          options: ['1', '2', '3', '4'],
          correctOption: '2',
          explanation:
            'An SA is simplex (one-way), identified by its SPI. Bidirectional communication therefore needs 2 SAs.',
        },
        {
          id: 'p3',
          prompt: 'Which mode leaves the original IP header visible and protects only the payload?',
          options: ['Tunnel mode', 'Transport mode', 'Record mode', 'Circuit mode'],
          correctOption: 'Transport mode',
          explanation:
            'Transport mode protects the payload while the original IP header remains; tunnel mode encapsulates the whole original packet behind a new IP header.',
        },
        {
          id: 'p4',
          prompt: 'How large is the TLS master secret established by the Handshake Protocol?',
          options: ['16 bytes', '20 bytes', '32 bytes', '48 bytes'],
          correctOption: '48 bytes',
          explanation:
            'The TLS Handshake Protocol establishes a 48-byte master secret from which Record Protocol keys are derived. (Compare MD5 = 128-bit and SHA-1 = 160-bit hashes.)',
        },
      ],
    },
    flashcards: [
      {
        id: 'l13-f1',
        lectureId: 13,
        front: 'What IP protocol number does IPsec AH use, and does it encrypt?',
        back: 'AH is IP protocol 51. It provides integrity, authentication and anti-replay over the entire packet but NO encryption.',
        tag: 'AH',
      },
      {
        id: 'l13-f2',
        lectureId: 13,
        front: 'What IP protocol number does IPsec ESP use, and what does it provide?',
        back: 'ESP is IP protocol 50. It provides encryption plus optional authentication (HMAC ICV).',
        tag: 'ESP',
      },
      {
        id: 'l13-f3',
        lectureId: 13,
        front: 'Why do two hosts need two SAs for bidirectional IPsec?',
        back: 'A Security Association is simplex (one-way), identified by an SPI; one SA is needed per direction. SAs are negotiated via IKE (RFC 2409).',
        tag: 'SA',
      },
      {
        id: 'l13-f4',
        lectureId: 13,
        front: 'Transport mode vs Tunnel mode?',
        back: 'Transport protects only the payload with the original IP header visible; Tunnel encapsulates the entire original IP packet inside a new (gateway) IP header.',
        tag: 'IPsec Modes',
      },
      {
        id: 'l13-f5',
        lectureId: 13,
        front: 'What are the MD5 and SHA-1 hash output sizes?',
        back: 'MD5 processes 512-bit blocks and outputs a 128-bit hash; SHA-1 outputs a 160-bit hash.',
        tag: 'Hashes',
      },
      {
        id: 'l13-f6',
        lectureId: 13,
        front: 'Name the four TLS sub-protocols and the master secret size.',
        back: 'Record, Handshake, Change Cipher Spec and Alert protocols. The Handshake establishes a 48-byte master secret.',
        tag: 'TLS',
      },
      {
        id: 'l13-f7',
        lectureId: 13,
        front: 'Virus vs Worm?',
        back: 'A virus inserts itself into other programs; a worm self-replicates across the network on its own.',
        tag: 'Malware',
      },
      {
        id: 'l13-f8',
        lectureId: 13,
        front: 'How does challenge-response authentication work?',
        back: 'The verifier sends a random nonce r; the claimant returns r transformed with a shared secret (e.g., E_K(r)), proving knowledge of the key without sending a password.',
        tag: 'Nonce',
      },
    ],
    quiz: [
      {
        id: 'l13-q1',
        lectureId: 13,
        question: 'A packet capture shows IP Protocol = 51. Which IPsec protocol is in use and what does it NOT provide?',
        options: [
          'ESP — it does not provide authentication',
          'AH — it does not provide encryption',
          'ESP — it does not provide anti-replay',
          'AH — it does not provide integrity',
        ],
        correctIndex: 1,
        explanation:
          'Protocol 51 is AH, which provides integrity, authentication and anti-replay but no encryption. ESP is protocol 50 and provides encryption.',
        difficulty: 'core',
      },
      {
        id: 'l13-q2',
        lectureId: 13,
        question: 'Two gateways exchange ESP traffic in both directions and also run AH in both directions. How many SAs exist?',
        options: ['1', '2', '3', '4'],
        correctIndex: 3,
        explanation:
          'SAs are simplex and protocol-specific: ESP needs 2 (one per direction) and AH needs another 2, for a total of 4.',
        difficulty: 'advanced',
      },
      {
        id: 'l13-q3',
        lectureId: 13,
        question: 'Which IPsec mode encapsulates the entire original IP packet inside a new IP header for a site-to-site VPN?',
        options: ['Transport mode', 'Tunnel mode', 'Record mode', 'Handshake mode'],
        correctIndex: 1,
        explanation:
          'Tunnel mode wraps the whole original packet behind a new gateway IP header, hiding the true endpoints; transport mode leaves the original header visible.',
        difficulty: 'core',
      },
      {
        id: 'l13-q4',
        lectureId: 13,
        question: 'What is the output size of SHA-1?',
        options: ['128 bits', '160 bits', '256 bits', '512 bits'],
        correctIndex: 1,
        explanation:
          'SHA-1 produces a 160-bit hash. MD5 produces 128 bits from 512-bit input blocks.',
        difficulty: 'core',
      },
      {
        id: 'l13-q5',
        lectureId: 13,
        question: 'During a TLS session, which component establishes the 48-byte master secret?',
        options: ['Record Protocol', 'Alert Protocol', 'Handshake Protocol', 'Change Cipher Spec Protocol'],
        correctIndex: 2,
        explanation:
          'The Handshake Protocol negotiates version and cipher, authenticates with public keys and establishes the 48-byte master secret; the Record Protocol then uses derived symmetric keys plus a keyed MAC.',
        difficulty: 'core',
      },
      {
        id: 'l13-q6',
        lectureId: 13,
        question: 'AH authenticates the whole IP packet, yet routers decrement TTL in transit. How does AH avoid false integrity failures?',
        options: [
          'It encrypts the IP header',
          'It zeroes mutable IP header fields when computing the ICV',
          'It disables TTL processing on routers',
          'It recomputes the ICV at every hop',
        ],
        correctIndex: 0 + 1 as 1,
        explanation:
          'AH computes its integrity check over the entire packet with mutable IP header fields (such as TTL and header checksum) set to zero, so legitimate router changes do not break authentication.',
        difficulty: 'advanced',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Lecture 14 — Network Design
  // ---------------------------------------------------------------------------
  {
    id: 14,
    title: 'Network Design',
    shortTitle: 'Network Design',
    sectorId: 5,
    sectorName: SECTOR_NAME,
    estimatedMinutes: 35,
    osiLayers: [1, 2, 3, 7],
    tagline: 'Design for the business, budget for growth, keep the cabling, isolate what matters — and never over-engineer.',
    concepts: [
      {
        id: 'l14-c1',
        title: 'Business Needs & Future Growth',
        summary:
          'A network exists to serve the business: it must match business goals, customer service and competitive advantage with a sensible return on investment. Designs must also anticipate growth in applications, sites and partners.',
        keyPoints: [
          'Business needs: align with business goals, customer service, competitive advantage and ROI.',
          'Future growth: new applications and servers.',
          'Future growth: wireless hotspots and mobile access.',
          'Future growth: branch and island-wide links, extranets to partners.',
          'Design decisions should be justified in business terms, not just technical elegance.',
        ],
        examTip:
          'The FIRST design consideration is business needs — if a design cannot be justified by ROI or business goals, it is the wrong design.',
        formulaOrSpec: 'Consideration 1 = Business Needs (ROI) | Consideration 2 = Future Growth',
      },
      {
        id: 'l14-c2',
        title: 'Existing Infrastructure: Equipment vs Cabling Lifecycle',
        layer: 1,
        summary:
          'Reuse existing capital expenditure at appropriate tiers. Most active equipment becomes outdated in about three years, while structured cabling lasts much longer and makes management and upgrades easier and cheaper.',
        keyPoints: [
          'Reuse existing investment where it fits the design tier.',
          'Most equipment is outdated in ~3 years.',
          'Cabling may last much longer than equipment.',
          'Structured cabling makes management and enhancement easier and more cost-effective.',
          'Example: central core switch on a star-wired multi-mode fibre campus backbone.',
        ],
        examTip:
          'Invest in quality structured cabling (long-lived) and plan to refresh switches/routers (~3-year life). Do not rip out good cabling just because switches are old.',
        formulaOrSpec: 'Equipment lifecycle ≈ 3 years  ≪  Structured cabling lifecycle',
        comparisonTable: {
          headers: ['Asset', 'Typical Lifespan', 'Design Implication'],
          rows: [
            ['Switches / routers', '~3 years', 'Plan for refresh; size for current needs'],
            ['Structured cabling (fibre/UTP)', 'Much longer', 'Invest once, reuse across refreshes'],
            ['Core switch (star fibre backbone)', 'Equipment cycle', 'Replace box, keep the fibre star'],
          ],
        },
      },
      {
        id: 'l14-c3',
        title: 'Internet/Intranet, Security vs Accessibility & Right-Sizing',
        summary:
          'Decide whether branches break out to the Internet centrally via head office or directly, balancing control and confidentiality against freedom and openness. Balance security against accessibility, and size the architecture realistically.',
        keyPoints: [
          'Centralised head-office breakout: controllability, confidentiality, single policy point.',
          'Direct branch breakout: freedom, openness, less backhaul; consider provider redundancy.',
          'Security vs accessibility: computer use & IT security policies, mobile worker access.',
          'Single Sign-On vs distributed authentication; identify servers that need higher protection.',
          'Appropriate architecture: estimate what is necessary now (traffic, server loads, apps) — do NOT over-engineer.',
        ],
        examTip:
          'If a scenario stresses confidentiality and control, choose centralised breakout; if it stresses openness and local performance, choose direct breakout.',
        formulaOrSpec: '6 Considerations = Business · Growth · Existing Infra · Internet/Intranet · Security vs Access · Appropriate Architecture',
        comparisonTable: {
          headers: ['Internet Breakout', 'Strengths', 'Weaknesses'],
          rows: [
            ['Centralised (head office)', 'Control, confidentiality, one policy point', 'Backhaul latency, single bottleneck'],
            ['Direct (each branch)', 'Freedom, openness, local speed', 'Harder to control, policy at every site'],
          ],
        },
      },
      {
        id: 'l14-c4',
        title: 'Function (Application) Based Design',
        layer: 7,
        summary:
          'Also called business-IT alignment based design: start from business drivers and the applications and data each part of the organisation uses. Align servers, storage, data centre and disaster recovery around them.',
        keyPoints: [
          'Identify business applications and the types of data each uses.',
          'Different organisations need different network forms based on their apps & data.',
          'Align servers, storage, IT infrastructure and data centre with applications.',
          'Include security, systems management and disaster recovery in the alignment.',
          'Driven top-down: business drivers → apps & data → infrastructure.',
        ],
        examTip:
          'Function-based = "business-IT alignment". Keywords: applications, data, data centre, DR.',
        formulaOrSpec: 'Business drivers → Apps & data → Servers/Storage → Data centre & DR',
      },
      {
        id: 'l14-c5',
        title: 'Security Based Design',
        summary:
          'Security-based design considers physical and network threats, network policies and access policies, then isolates critical nodes. Multi-tier architectures place mail relays, DNS and AAA servers in DMZs behind firewalls and IDS/IDP.',
        keyPoints: [
          'Consider physical threats, network threats and policies for offices, branches and third parties.',
          'Limited (imposed) access: proxies, NAT (NAT also eases IP depletion).',
          'Privileged access (directors, managers, partners): VPNs, user/role-based access.',
          'Critical node protection: server farms, VLANs, firewalls, IDS/IDP.',
          'Multi-tier DMZ for mail relays, DNS servers, AAA servers.',
          'Isolate apps lacking SSL/crypto — isolation means more subnets and more firewall interfaces.',
        ],
        examTip:
          'Isolation has a cost: every new security zone adds subnets and firewall interfaces. Expect a trade-off question.',
        formulaOrSpec: 'Limited access = Proxy/NAT | Privileged access = VPN + RBAC | Critical nodes = VLAN + FW + IDS/IDP + DMZ',
      },
      {
        id: 'l14-c6',
        title: 'Topology & Traffic Based Design',
        layer: 2,
        summary:
          'Topology-based design chooses among LAN, WLAN and WAN technologies under speed, budget and environmental constraints, extending LANs with PPTP/L2TP tunnels. Traffic-based design engineers queuing, switching, load balancing, redundancy and QoS.',
        keyPoints: [
          'Topology: LANs, WLANs, WANs — speed, technology, budgetary and environmental constraints.',
          'VPNs/tunnels for extended networks and security over WANs; PPTP and L2TP extend LANs.',
          'Traffic: queuing, priority traffic, congestion avoidance — will apps accept delays?',
          'Switching at wire speed; load balancing; redundant paths for reliability & availability.',
          'QoS: latency and throughput — satellite (high latency) vs fibre optics (low latency).',
        ],
        examTip:
          'Delay-sensitive traffic (voice/video, interactive apps) should avoid satellite links (high latency); prefer fibre.',
        formulaOrSpec: '4 Strategies = Function · Security · Topology · Traffic based design',
        comparisonTable: {
          headers: ['Strategy', 'Focus', 'Example Tools'],
          rows: [
            ['Function based', 'Business-IT alignment', 'Data centre, storage, DR'],
            ['Security based', 'Threats & isolation', 'DMZ, VLANs, FW, IDS, VPN'],
            ['Topology based', 'Technology/protocol', 'LAN/WLAN/WAN, PPTP, L2TP'],
            ['Traffic based', 'Performance & QoS', 'Queuing, load balancing, fibre vs satellite'],
          ],
        },
      },
    ],
    labConfig: {
      engine: 'topology-lab',
      title: 'Enterprise Campus & Branch Network Design Blueprint',
      scenario:
        'You are presenting a redesign of a head-office campus and a remote branch to the CIO. Click each element of the blueprint and defend your choice against the architecture audit using the 6 design considerations and 4 design strategies.',
      nodes: [
        { id: 'branch', label: 'Branch Office LAN', type: 'host', x: 10, y: 75 },
        { id: 'campus', label: 'Campus Core Switch', type: 'switch', x: 30, y: 45 },
        { id: 'servers', label: 'Server Farm VLAN', type: 'server', x: 30, y: 15 },
        { id: 'fw', label: 'Firewall / IDS', type: 'firewall', x: 52, y: 45 },
        { id: 'dmz', label: 'DMZ: Mail Relay/DNS/AAA', type: 'server', x: 52, y: 15 },
        { id: 'edge', label: 'Edge Router', type: 'router', x: 72, y: 45 },
        { id: 'wan', label: 'WAN (Fibre/Satellite)', type: 'wan-switch', x: 72, y: 78 },
        { id: 'inet', label: 'Internet', type: 'router', x: 90, y: 45 },
      ],
      links: [
        { from: 'campus', to: 'servers', label: 'Server VLAN trunk' },
        { from: 'campus', to: 'fw', label: 'MM fibre backbone' },
        { from: 'fw', to: 'dmz', label: 'DMZ interface' },
        { from: 'fw', to: 'edge', label: 'Outside interface' },
        { from: 'edge', to: 'inet', label: 'Internet breakout' },
        { from: 'edge', to: 'wan', label: 'WAN uplink' },
        { from: 'wan', to: 'branch', label: 'PPTP/L2TP VPN tunnel' },
      ],
      challenges: [
        {
          id: 'ch1',
          targetNodeId: 'campus',
          prompt:
            'The campus core switch is 4 years old, but the star-wired multi-mode fibre backbone was installed with structured cabling 10 years ago. What do you recommend?',
          options: [
            'Replace both the switch and all fibre cabling',
            'Keep both unchanged indefinitely',
            'Refresh the core switch but reuse the structured fibre cabling',
            'Replace the fibre with wireless links',
          ],
          correctOption: 'Refresh the core switch but reuse the structured fibre cabling',
          explanation:
            'Existing infrastructure: equipment becomes outdated in ~3 years, but structured cabling lasts much longer and makes enhancement cost-effective — reuse the capital investment.',
        },
        {
          id: 'ch2',
          targetNodeId: 'dmz',
          prompt:
            'Where should the public mail relay, external DNS and AAA servers be placed under a security-based design?',
          options: [
            'On the same VLAN as staff desktops',
            'In a multi-tier DMZ behind the firewall/IDS',
            'Directly on the Internet with no firewall',
            'At the branch office',
          ],
          correctOption: 'In a multi-tier DMZ behind the firewall/IDS',
          explanation:
            'Security-based design isolates critical application-level communication using multi-tier architectures (mail relays, DNS, AAA) protected by firewalls and IDS/IDP — at the cost of more subnets and firewall interfaces.',
        },
        {
          id: 'ch3',
          targetNodeId: 'branch',
          prompt:
            'The branch must reach head-office servers securely over the public WAN as if it were on the campus LAN. Which topology-based technique fits?',
          options: [
            'PPTP or L2TP tunnel (VPN) extending the LAN',
            'A second Internet breakout with no tunnel',
            'Open Telnet access to the server farm',
            'A satellite link without encryption',
          ],
          correctOption: 'PPTP or L2TP tunnel (VPN) extending the LAN',
          explanation:
            'Topology-based design uses VPNs/tunnels such as PPTP and L2TP for extension of LANs and security over WANs.',
        },
        {
          id: 'ch4',
          targetNodeId: 'wan',
          prompt:
            'The branch runs delay-sensitive voice and interactive ERP traffic. Which WAN link and design strategy should drive the decision?',
          options: [
            'Satellite — function-based design',
            'Fibre optics — traffic-based design (QoS: low latency)',
            'Satellite — security-based design',
            'Any link — over-provision bandwidth 10×',
          ],
          correctOption: 'Fibre optics — traffic-based design (QoS: low latency)',
          explanation:
            'Traffic-based design weighs QoS (latency, throughput): satellite has high latency while fibre has low latency, so delay-sensitive apps belong on fibre.',
        },
        {
          id: 'ch5',
          targetNodeId: 'edge',
          prompt:
            'Head office demands strong control and confidentiality of all Internet traffic, including from the branch. Which Internet/intranet approach matches?',
          options: [
            'Direct Internet breakout at every branch',
            'No Internet access at all',
            'Centralised breakout through the head-office edge',
            'Let each user choose an ISP',
          ],
          correctOption: 'Centralised breakout through the head-office edge',
          explanation:
            'Centralised head-office breakout favours controllability and confidentiality; direct branch breakout favours freedom and openness.',
        },
        {
          id: 'ch6',
          targetNodeId: 'servers',
          prompt:
            'A consultant proposes a 100 Gbps dual-chassis server farm for 40 staff running email and a small file server. What is the audit verdict?',
          options: [
            'Approve — future-proofing is always worth it',
            'Reject — appropriate architecture: estimate current needs and do not over-engineer',
            'Approve — equipment lasts 15 years',
            'Reject — server farms must never use VLANs',
          ],
          correctOption: 'Reject — appropriate architecture: estimate current needs and do not over-engineer',
          explanation:
            'Appropriate network architecture means estimating what is necessary now from traffic and server loads; equipment is outdated in ~3 years, so over-engineering wastes ROI.',
        },
      ],
    },
    flashcards: [
      {
        id: 'l14-f1',
        lectureId: 14,
        front: 'List the 6 core network design considerations.',
        back: 'Business needs, future growth, existing infrastructure, Internet & intranet requirements, security vs accessibility, and appropriate network architecture.',
        tag: 'Considerations',
      },
      {
        id: 'l14-f2',
        lectureId: 14,
        front: 'List the 4 network design strategies.',
        back: 'Function (application) based, security based, topology (technology/protocol) based, and traffic based design.',
        tag: 'Strategies',
      },
      {
        id: 'l14-f3',
        lectureId: 14,
        front: 'How long does network equipment typically last compared with cabling?',
        back: 'Most equipment is outdated in about 3 years, while structured cabling lasts much longer and eases management and upgrades.',
        tag: 'Lifecycle',
      },
      {
        id: 'l14-f4',
        lectureId: 14,
        front: 'Centralised vs direct Internet breakout — key trade-off?',
        back: 'Centralised (head office) gives controllability and confidentiality; direct branch breakout gives freedom and openness (consider provider redundancy).',
        tag: 'Breakout',
      },
      {
        id: 'l14-f5',
        lectureId: 14,
        front: 'What is function-based design also called?',
        back: 'Business-IT alignment based design — aligning apps and data with servers, storage, data centre and disaster recovery.',
        tag: 'Function',
      },
      {
        id: 'l14-f6',
        lectureId: 14,
        front: 'Limited vs privileged access in security-based design?',
        back: 'Limited (imposed) access uses proxies and NAT; privileged access (directors, managers, partners) uses VPNs and user/role-based access.',
        tag: 'Access Policy',
      },
      {
        id: 'l14-f7',
        lectureId: 14,
        front: 'Which servers belong in a multi-tier DMZ?',
        back: 'Critical application-level services such as mail relays, DNS servers and AAA servers, protected by firewalls and IDS/IDP.',
        tag: 'DMZ',
      },
      {
        id: 'l14-f8',
        lectureId: 14,
        front: 'Which tunnelling protocols extend LANs in topology-based design?',
        back: 'PPTP and L2TP (VPN tunnels) for extending LANs and securing traffic over WANs.',
        tag: 'PPTP/L2TP',
      },
    ],
    quiz: [
      {
        id: 'l14-q1',
        lectureId: 14,
        question: 'Which design consideration warns: "Estimate what is necessary for now — do not over-engineer"?',
        options: ['Future growth', 'Business needs', 'Security vs accessibility', 'Appropriate network architecture'],
        correctIndex: 3,
        explanation:
          'Appropriate network architecture says to estimate current needs from traffic loads, server loads and application types rather than building sophisticated, complex architectures.',
        difficulty: 'core',
      },
      {
        id: 'l14-q2',
        lectureId: 14,
        question: 'A university\'s switches are 5 years old but its structured fibre cabling is 12 years old and in good condition. Best plan?',
        options: [
          'Replace switches, retain the structured cabling',
          'Replace cabling, retain the switches',
          'Replace everything',
          'Replace nothing',
        ],
        correctIndex: 0,
        explanation:
          'Equipment is typically outdated in ~3 years, but structured cabling lasts much longer — reuse existing infrastructure at the appropriate tier.',
        difficulty: 'advanced',
      },
      {
        id: 'l14-q3',
        lectureId: 14,
        question: 'Placing mail relays, DNS and AAA servers in a multi-tier DMZ is an example of which design strategy?',
        options: ['Traffic based', 'Security based', 'Function based', 'Topology based'],
        correctIndex: 1,
        explanation:
          'Security-based design protects critical nodes and application-level communication through multi-tier architectures, VLANs, firewalls and IDS/IDP.',
        difficulty: 'core',
      },
      {
        id: 'l14-q4',
        lectureId: 14,
        question: 'Which protocols does the lecture cite for extending LANs across WANs?',
        options: ['OSPF and BGP', 'PPTP and L2TP', 'SNMP and RMON', 'HTTP and FTP'],
        correctIndex: 1,
        explanation:
          'Topology-based design uses VPNs/tunnels, specifically PPTP and L2TP, for extension of LANs and security over WANs.',
        difficulty: 'core',
      },
      {
        id: 'l14-q5',
        lectureId: 14,
        question: 'A remote mine site needs real-time video conferencing with head office. Satellite and fibre are both available. Which choice and strategy apply?',
        options: [
          'Satellite, because it is function-based',
          'Satellite, because higher latency improves QoS',
          'Fibre, chosen under traffic-based design for low latency',
          'Either — latency is irrelevant to QoS',
        ],
        correctIndex: 2,
        explanation:
          'Traffic-based design considers QoS (latency, throughput): satellite has high latency whereas fibre optics has low latency, which suits real-time video.',
        difficulty: 'advanced',
      },
      {
        id: 'l14-q6',
        lectureId: 14,
        question: 'Using NAT and proxies to restrict ordinary staff Internet access falls under which security-based design concept?',
        options: ['Privileged access', 'Critical node protection', 'Limited (imposed) access', 'Disaster recovery'],
        correctIndex: 2,
        explanation:
          'Limited (imposed) access uses proxies and NAT (which also helps with IP depletion); privileged access uses VPNs and role-based access.',
        difficulty: 'core',
      },
    ],
  },
];

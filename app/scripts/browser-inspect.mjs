import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, existsSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(here, '..');
const PORT = 3009;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SCREENSHOT_DIR = resolve(here, '..', 'public', 'screenshots');

if (!existsSync(SCREENSHOT_DIR)) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('[Browser Inspection] Starting Next.js production server on port', PORT);
  const nextBin = resolve(appDir, 'node_modules', 'next', 'dist', 'bin', 'next');
  const server = spawn(process.execPath, [nextBin, 'start', '-p', String(PORT)], {
    cwd: appDir,
    stdio: 'pipe',
  });

  server.stderr.on('data', (d) => {
    const str = d.toString();
    if (!str.includes('ExperimentalWarning')) {
      console.error('[Server Err]', str.trim());
    }
  });

  // Wait for server ready
  let ready = false;
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}`);
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {}
    await sleep(400);
  }

  if (!ready) {
    server.kill();
    throw new Error('Server failed to start on port ' + PORT);
  }

  console.log('[Browser Inspection] Server ready. Launching headless Microsoft Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(`[Page Error] ${err.message}`);
  });

  const inspectionResults = [];

  async function inspectPage(route, name, actions = null) {
    console.log(`\n--- Inspecting: ${name} (${route}) ---`);
    const errorsBefore = consoleErrors.length + pageErrors.length;
    await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle0' });

    if (actions) {
      await actions(page);
    }

    const screenshotPath = resolve(SCREENSHOT_DIR, `${name}.png`);
    await page.screenshot({ path: screenshotPath });

    // Check for horizontal overflow (common UI flaw)
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    const newErrors = consoleErrors.length + pageErrors.length - errorsBefore;
    const result = {
      name,
      route,
      hasHorizontalOverflow,
      errors: newErrors,
    };
    inspectionResults.push(result);
    console.log(`✓ ${name}: Overflow=${hasHorizontalOverflow}, Errors=${newErrors}`);
  }

  try {
    // 1. Dashboard
    await inspectPage('/', '01-campaign-dashboard');

    // 2. Open Save Data Modal
    await inspectPage('/', '02-save-modal-open', async (p) => {
      await p.click('[data-testid="btn-save-modal"]');
      await sleep(300);
    });

    // 3. Lecture 1 (OSI - HeaderAssembler)
    await inspectPage('/lecture/1?tab=briefing', '03-l1-briefing');
    await inspectPage('/lecture/1?tab=lab', '04-l1-header-assembler');
    await inspectPage('/lecture/1?tab=quiz', '05-l1-boss-quiz');
    await inspectPage('/lecture/1?tab=slides', '06-l1-slide-inspector', async (p) => {
      await p.type('[data-testid="slide-search-input"]', 'OSI');
      await sleep(300);
    });

    // 4. Lecture 2 (Data Link - SequenceSimulator)
    await inspectPage('/lecture/2?tab=lab', '07-l2-sequence-simulator', async (p) => {
      // Test stepping
      const stepBtn = await p.$('button[title="Step Forward"]');
      if (stepBtn) await stepBtn.click();
      await sleep(300);
    });

    // 5. Lecture 3 (WAN - TopologyLab)
    await inspectPage('/lecture/3?tab=lab', '08-l3-topology-lab');

    // 6. Lecture 10 (Wireless IoT - MatrixArena)
    await inspectPage('/lecture/10?tab=lab', '09-l10-matrix-arena');

    // 7. Global Packet Sandbox
    await inspectPage('/sandbox', '10-packet-sandbox', async (p) => {
      await p.click('[data-testid="sandbox-scenario-ipv6"]');
      await sleep(300);
      await p.click('[data-testid="sandbox-step-forward"]');
      await sleep(300);
    });

    // 8. Memory Vault
    await inspectPage('/vault', '11-memory-vault', async (p) => {
      // Flip the card
      await p.click('[data-testid="vault-flashcard"]');
      await sleep(300);
    });

    // 9. Exam Blitz
    await inspectPage('/blitz', '12-exam-blitz-menu');
    await inspectPage('/blitz', '13-exam-blitz-exam-mode', async (p) => {
      await p.click('[data-testid="blitz-start-exam"]');
      await sleep(300);
    });

    // 10. Mobile Viewport Check (375x667 iPhone SE)
    await page.setViewport({ width: 375, height: 667 });
    await inspectPage('/', '14-mobile-dashboard');
    await inspectPage('/lecture/1?tab=lab', '15-mobile-l1-lab');
    await inspectPage('/sandbox', '16-mobile-sandbox');
    await inspectPage('/vault', '17-mobile-vault');

  } finally {
    await browser.close();
    server.kill();
    console.log('\n[Browser Inspection] Server and browser closed.');
  }

  console.log('\n========================================');
  console.log('UI/UX INSPECTION SUMMARY:');
  console.log('========================================');
  console.table(inspectionResults);

  if (consoleErrors.length > 0) {
    console.log('\n[Console Errors Encountered]:');
    consoleErrors.forEach((e) => console.log('  ', e));
  } else {
    console.log('\n✓ Zero browser console errors encountered!');
  }

  if (pageErrors.length > 0) {
    console.log('\n[Uncaught Page Errors Encountered]:');
    pageErrors.forEach((e) => console.log('  ', e));
  } else {
    console.log('✓ Zero uncaught page errors encountered!');
  }
}

run().catch((err) => {
  console.error('[Inspection Error]', err);
  process.exit(1);
});

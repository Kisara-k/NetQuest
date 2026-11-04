import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(here, '..');
const PORT = 3012;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function findOverflowElements(page, url) {
  await page.goto(url, { waitUntil: 'networkidle0' });
  const overflowing = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    const culprits = [];
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1) {
        culprits.push({
          tag: el.tagName,
          className: el.className ? String(el.className).slice(0, 80) : '',
          id: el.id,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          docWidth,
          text: el.innerText ? el.innerText.slice(0, 40).replace(/\n/g, ' ') : '',
        });
      }
    });
    return culprits.slice(0, 10);
  });
  return overflowing;
}

async function test() {
  const nextBin = resolve(appDir, 'node_modules', 'next', 'dist', 'bin', 'next');
  const server = spawn(process.execPath, [nextBin, 'start', '-p', String(PORT)], {
    cwd: appDir,
    stdio: 'ignore',
  });

  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}`);
      if (res.ok) break;
    } catch {}
    await sleep(400);
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 375, height: 667 },
  });
  const page = await browser.newPage();

  try {
    for (const path of ['/', '/lecture/1?tab=lab', '/sandbox', '/vault']) {
      console.log(`\n=== Testing overflow on ${path} (width 375) ===`);
      const culprits = await findOverflowElements(page, `http://127.0.0.1:${PORT}${path}`);
      if (culprits.length === 0) {
        console.log('✓ No overflowing elements found!');
      } else {
        culprits.forEach((c) => {
          console.log(`- <${c.tag}> right=${c.right}px (exceeds ${c.docWidth}px) | class="${c.className}" | text="${c.text}"`);
        });
      }
    }
  } finally {
    await browser.close();
    server.kill();
  }
}

test().catch(console.error);

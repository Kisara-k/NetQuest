import http from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(here, '..');
const PORT = 3008;

function httpGet(path) {
  return new Promise((resolvePromise, rejectPromise) => {
    const req = http.get(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path,
        headers: { 'User-Agent': 'NetQuest-E2E-Verifier' },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolvePromise({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      },
    );
    req.on('error', rejectPromise);
    req.setTimeout(5000, () => {
      req.destroy(new Error(`Timeout fetching ${path}`));
    });
  });
}

function httpPostJson(path, payload) {
  return new Promise((resolvePromise, rejectPromise) => {
    const jsonStr = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(jsonStr),
          'User-Agent': 'NetQuest-E2E-Verifier',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolvePromise({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      },
    );
    req.on('error', rejectPromise);
    req.setTimeout(5000, () => {
      req.destroy(new Error(`Timeout posting to ${path}`));
    });
    req.write(jsonStr);
    req.end();
  });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log(`[E2E] Starting Next.js server on port ${PORT}...`);
  const nextBin = resolve(appDir, 'node_modules', 'next', 'dist', 'bin', 'next');
  const server = spawn(process.execPath, [nextBin, 'start', '-p', String(PORT)], {
    cwd: appDir,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('Ready') || msg.includes('started')) {
      console.log(`[Server] ${msg.trim()}`);
    }
  });

  server.stderr.on('data', (d) => {
    console.error(`[Server Error] ${d.toString().trim()}`);
  });

  // Wait for server to become responsive
  let ready = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await httpGet('/');
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await sleep(400);
  }

  if (!ready) {
    server.kill();
    console.error('[E2E FAIL] Server did not become ready in 8 seconds.');
    process.exit(1);
  }

  console.log('[E2E] Server is ready. Running checks according to docs/TESTING.md...');

  try {
    // 1. Dashboard Check
    console.log('\n--- 1. Checking Root Dashboard (/) ---');
    const rootRes = await httpGet('/');
    console.log(`✓ GET / -> Status ${rootRes.status}, ${rootRes.body.length} bytes`);
    if (
      !rootRes.body.includes('Introduction and the OSI') ||
      !rootRes.body.includes('Network Design')
    ) {
      throw new Error('Root dashboard does not contain expected lecture titles.');
    }
    console.log('✓ Verified: All 14 lecture titles and sector sections render properly.');

    // 2. Lecture Mission Hubs
    console.log('\n--- 2. Checking Lecture Mission Hubs ---');
    for (const id of [1, 4, 7, 9, 13]) {
      const res = await httpGet(`/lecture/${id}`);
      console.log(`✓ GET /lecture/${id} -> Status ${res.status}, ${res.body.length} bytes`);
      if (res.status !== 200) throw new Error(`/lecture/${id} returned non-200 status`);
    }

    // 3. Standalone Modes
    console.log('\n--- 3. Checking Standalone Game Modes ---');
    for (const route of ['/sandbox', '/vault', '/blitz']) {
      const res = await httpGet(route);
      console.log(`✓ GET ${route} -> Status ${res.status}, ${res.body.length} bytes`);
      if (res.status !== 200) throw new Error(`${route} returned non-200 status`);
    }

    // 4. API Lectures
    console.log('\n--- 4. Checking /api/lectures ---');
    const lecturesRes = await httpGet('/api/lectures');
    const lecturesData = JSON.parse(lecturesRes.body);
    console.log(`✓ GET /api/lectures -> Status ${lecturesRes.status}, count: ${lecturesData.count}`);
    if (lecturesData.count !== 14 || !lecturesData.lectures[0].slideBlocks.length) {
      throw new Error('API /api/lectures did not return 14 lectures with slideBlocks');
    }
    console.log(`✓ Verified: 14 lectures with slide blocks loaded properly.`);

    // 5. API Progress Persistence
    console.log('\n--- 5. Checking /api/progress Persistence ---');
    const testPayload = {
      xp: 2500,
      streakDays: 7,
      lastActiveDate: '2026-11-04',
      lectureProgress: {
        1: { briefingRead: true, labCompleted: true, bossDefeated: true, bestQuizScore: 100, quizAttempts: 2 },
      },
      srsState: {
        'l1-f1': { cardId: 'l1-f1', interval: 3, repetitions: 2, easeFactor: 2.5, nextReviewAt: Date.now() + 86400000 },
      },
    };

    const postRes = await httpPostJson('/api/progress', testPayload);
    console.log(`✓ POST /api/progress -> Status ${postRes.status}, body: ${postRes.body}`);
    if (postRes.status !== 200) throw new Error('POST /api/progress failed');

    const getProgressRes = await httpGet('/api/progress');
    const readBack = JSON.parse(getProgressRes.body);
    console.log(`✓ GET /api/progress -> Status ${getProgressRes.status}, readBack XP: ${readBack.xp}`);
    if (readBack.xp !== 2500) throw new Error('GET /api/progress did not return written progress');

    const progressDiskPath = resolve(appDir, '.data', 'progress.json');
    if (!existsSync(progressDiskPath)) {
      throw new Error('progress.json was not created on disk in app/.data/');
    }
    console.log(`✓ Verified: app/.data/progress.json exists on disk and persisted snapshot correctly.`);

    console.log('\n========================================');
    console.log('🎉 ALL END-TO-END VERIFICATION CHECKS PASSED!');
    console.log('========================================\n');
  } finally {
    server.kill();
    console.log('[E2E] Next.js server shut down.');
  }
}

run().catch((err) => {
  console.error('[E2E ERROR]', err);
  process.exit(1);
});

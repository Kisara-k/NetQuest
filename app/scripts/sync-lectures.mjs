// Copies the canonical ../Lectures.json (repository root, never modified) into
// src/data/Lectures.json so that client bundles, route handlers and Vitest can
// import it without reaching outside the Next.js project root.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, '..', '..', 'Lectures.json');
const target = resolve(here, '..', 'src', 'data', 'Lectures.json');

if (!existsSync(source)) {
  if (existsSync(target)) {
    console.log('[sync-lectures] Root Lectures.json not found; using existing synced copy.');
    process.exit(0);
  }
  console.error('[sync-lectures] Lectures.json not found at', source);
  process.exit(1);
}

const raw = readFileSync(source, 'utf8');
JSON.parse(raw); // validate
mkdirSync(dirname(target), { recursive: true });
const current = existsSync(target) ? readFileSync(target, 'utf8') : null;
if (current !== raw) {
  writeFileSync(target, raw, 'utf8');
  console.log('[sync-lectures] Synced Lectures.json -> src/data/Lectures.json');
} else {
  console.log('[sync-lectures] src/data/Lectures.json already up to date.');
}

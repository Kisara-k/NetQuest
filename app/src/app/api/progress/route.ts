import { NextResponse } from 'next/server';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

function getProgressFilePath(): string {
  // If run from app/, process.cwd() is c:\Dev\Network Study\app
  const dir = join(process.cwd(), '.data');
  return join(dir, 'progress.json');
}

export async function GET() {
  try {
    const filePath = getProgressFilePath();
    if (!existsSync(filePath)) {
      return NextResponse.json({ exists: false, data: null });
    }
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read progress from disk', details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = getProgressFilePath();
    const dir = join(process.cwd(), '.data');
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    await writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ success: true, savedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to persist progress to disk', details: String(error) },
      { status: 500 },
    );
  }
}

import { readFile } from 'node:fs/promises';
import path from 'node:path';

let cached: string | null = null;

export async function loadRules(): Promise<string> {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), 'content', 'rules.md');
  cached = await readFile(filePath, 'utf-8');
  return cached;
}

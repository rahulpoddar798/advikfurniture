import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const frontend = resolve(root, 'frontend/prisma');
const backend = resolve(root, 'backend/prisma');

function migrationFiles(directory) {
  const base = resolve(directory, 'migrations');
  return readdirSync(base, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(directory, resolve(entry.parentPath, entry.name)).replaceAll('\\', '/'))
    .sort();
}

const files = ['schema.prisma', ...migrationFiles(frontend)];
if (JSON.stringify(migrationFiles(frontend)) !== JSON.stringify(migrationFiles(backend))) {
  throw new Error('Frontend and backend migration file lists differ');
}
for (const path of files) {
  const read = (base) => readFileSync(resolve(base, path), 'utf8').replaceAll('\r\n', '\n').trimEnd();
  if (read(frontend) !== read(backend)) throw new Error(`Database definition differs: ${path}`);
}
console.log(`Database consistency verified: ${files.length} matching files`);

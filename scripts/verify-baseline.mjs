import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(await readFile(new URL('../site-baseline.sha256.json', import.meta.url), 'utf8'));
let failed = false;

for (const [relativePath, expected] of Object.entries(manifest)) {
  const fileUrl = new URL(`../${relativePath}`, import.meta.url);
  try {
    const bytes = await readFile(fileUrl);
    const actual = createHash('sha256').update(bytes).digest('hex');
    if (actual !== expected) {
      console.error(`CHANGED: ${relativePath}`);
      failed = true;
    }
  } catch (error) {
    console.error(`MISSING: ${relativePath}`);
    failed = true;
  }
}

if (failed) {
  console.error('\nVisible/source site files differ from the import baseline.');
  process.exit(1);
}

console.log('Baseline OK: site content/source assets are unchanged.');

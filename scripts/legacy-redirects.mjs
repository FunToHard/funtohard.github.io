import fs from 'node:fs';
import path from 'node:path';
import { getRmergencyUrls } from '../sub-apps/r-mergency.routes.mjs';

// GitHub Pages needs a concrete HTML redirect for every historical article URL.
const root = path.resolve('dist');
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filename);
    else if (entry.name === 'index.html') {
      const relative = path.relative(path.join(root, 'philosophy'), directory).split(path.sep).join('/');
      if (!relative) continue;
      const target = `/philosophy/${relative}/`;
      for (const legacy of [relative, `journal/${relative}`]) {
        const destination = path.join(root, legacy, 'index.html');
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="https://funtohard.github.io${target}"><meta name="robots" content="noindex"><title>Page moved</title></head><body><a href="${target}">Continue to Philosophy</a></body></html>`);
      }
    }
  }
}
walk(path.join(root, 'philosophy'));
// Case-only aliases can coexist on the Linux deployment runner, not on Windows.
for (const target of process.platform === 'win32' ? [] : getRmergencyUrls('')) {
  const destination = path.join(root, target.toLowerCase(), 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="https://funtohard.github.io${target}"><meta name="robots" content="noindex"><title>Page moved</title></head><body><a href="${target}">Continue to R-mergency</a></body></html>`);
}

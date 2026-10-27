import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { getSubApps } from '../sub-apps.config.mjs';

// Build each registered sub-app that has a srcDir and package.json
for (const app of getSubApps()) {
  if (!app.srcDir) continue;

  const pkgPath = `${app.srcDir}/package.json`;
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`[sub-apps] Missing workspace source: ${pkgPath}`);
  }

  console.log(`[sub-apps] Building ${app.id} (${app.srcDir})...`);
  try {
    execSync(`npm --prefix ${app.srcDir} run build`, { stdio: 'inherit' });
    console.log(`[sub-apps] ${app.id} built successfully.`);
  } catch (err) {
    console.error(`[sub-apps] Failed to build ${app.id}:`, err.message);
    process.exit(1);
  }
}

console.log('[sub-apps] All sub-app builds complete.');

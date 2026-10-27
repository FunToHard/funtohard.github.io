import fs from 'node:fs';
import path from 'node:path';
import { getSubApps } from '../sub-apps.config.mjs';

const siteUrl = 'https://funtohard.github.io';

for (const app of getSubApps()) {
  if (!app.srcDir) continue;

  const srcDir = path.resolve(app.srcDir, 'dist');
  const destDir = path.resolve('dist', app.basePath.replace(/^\//, ''));

  // ------------------------------------------------------------------
  // 1. Copy built dist to output directory
  // ------------------------------------------------------------------
  if (!fs.existsSync(srcDir)) {
    throw new Error(`[sub-apps] Missing built output: ${srcDir}`);
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(srcDir, destDir, { recursive: true });
  for (const asset of app.sharedAssets || []) {
    fs.cpSync(path.resolve('public', asset), path.join(destDir, asset), { recursive: true });
  }
  console.log(`[sub-apps] Copied ${app.id} build to ${destDir}`);

  // ------------------------------------------------------------------
  // 2. Inject <base href> for correct asset resolution
  // ------------------------------------------------------------------
  const templatePath = path.join(destDir, 'index.html');
  if (fs.existsSync(templatePath)) {
    let baseHtml = fs.readFileSync(templatePath, 'utf8');
    const baseHref = `/${app.basePath.replace(/^\//, '')}/`;
    if (!baseHtml.includes('<base href=')) {
      baseHtml = baseHtml.replace('<head>', `<head>\n    <base href="${baseHref}">`);
      fs.writeFileSync(templatePath, baseHtml);
    }

    // ------------------------------------------------------------------
    // 3. Generate static route entrypoints from the sub-app's route manifest
    // ------------------------------------------------------------------
    let routes = [];
    try {
      let mod;
      try {
        mod = await import(`../${app.srcDir}/routes.mjs`);
      } catch {
        mod = await import(`../sub-apps/${app.id}.routes.mjs`);
      }
      if (typeof mod.getRoutes === 'function') {
        routes = mod.getRoutes();
      } else if (typeof mod.R_MERGENCY_MODULES !== 'undefined') {
        // Backward-compat shim: convert R-mergency module structure to routes
        routes = buildRmergencyRoutes(mod.R_MERGENCY_MODULES, app);
      }
    } catch {
      console.warn(`[sub-apps] No route manifest for ${app.id}, skipping static routes.`);
    }

    let generatedCount = 0;
    for (const route of routes) {
      const targetDir = path.join(destDir, route.path);
      fs.mkdirSync(targetDir, { recursive: true });

      let pageHtml = baseHtml;
      if (route.title) {
        pageHtml = pageHtml.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
      }
      if (route.description) {
        pageHtml = pageHtml.replace(
          /<meta name="description" content=".*?"\s*\/?>/,
          `<meta name="description" content="${route.description}" />`
        );
      }

      fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
      generatedCount++;
    }

    if (generatedCount > 0) {
      console.log(`[sub-apps] Generated ${generatedCount} static entrypoints for ${app.id}.`);
    }
  }

  // ------------------------------------------------------------------
  // 4. Generate per-app sitemap.xml
  // ------------------------------------------------------------------
  if (app.hasSitemap) {
    let sitemapUrls = [];
    try {
      let mod;
      try {
        mod = await import(`../${app.srcDir}/routes.mjs`);
      } catch {
        mod = await import(`../sub-apps/${app.id}.routes.mjs`);
      }
      if (typeof mod.getUrls === 'function') {
        sitemapUrls = mod.getUrls(siteUrl);
      } else if (typeof mod.getRmergencyUrls === 'function') {
        sitemapUrls = mod.getRmergencyUrls(siteUrl);
      }
    } catch {
      // No route manifest - generate sitemap from basePath only
      sitemapUrls = [`${siteUrl}/${app.basePath.replace(/^\//, '')}/`];
    }

    if (sitemapUrls.length > 0) {
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

      fs.writeFileSync(path.join(destDir, 'sitemap.xml'), sitemapXml);
      console.log(`[sub-apps] Generated ${app.id}/sitemap.xml with ${sitemapUrls.length} URLs.`);

      // Patch root sitemap-index.xml
      const sitemapIndexPath = path.resolve('dist/sitemap-index.xml');
      if (fs.existsSync(sitemapIndexPath)) {
        let sitemapIndexContent = fs.readFileSync(sitemapIndexPath, 'utf8');
        const appSitemapUrl = `${siteUrl}/${app.basePath.replace(/^\//, '')}/sitemap.xml`;
        if (!sitemapIndexContent.includes(appSitemapUrl)) {
          sitemapIndexContent = sitemapIndexContent.replace(
            '</sitemapindex>',
            `  <sitemap><loc>${appSitemapUrl}</loc></sitemap>\n</sitemapindex>`
          );
          fs.writeFileSync(sitemapIndexPath, sitemapIndexContent);
          console.log(`[sub-apps] Appended ${app.id}/sitemap.xml to sitemap-index.xml.`);
        }
      }
    }
  }
}

console.log('[sub-apps] Sub-app pipeline complete.');

// ------------------------------------------------------------------
// Backward-compat: convert R_MERGENCY_MODULES format to generic routes
// ------------------------------------------------------------------
function buildRmergencyRoutes(modules) {
  const routes = [];
  for (const group of modules) {
    routes.push({
      path: group.lang,
      title: `${group.name} Emergency Cram Kit // R-mergency`,
      description: `Comprehensive high-yield exam syllabus, cheat sheets, and trap questions for ${group.name}.`,
    });
    routes.push({
      path: `${group.lang}/drill`,
      title: `${group.name} Gotcha Drill // R-mergency`,
      description: `Interactive practice drill testing professor traps and exam edge cases in ${group.name}.`,
    });
    routes.push({
      path: `${group.lang}/cram`,
      title: `${group.name} 1-Page Exam Cheat Sheet // R-mergency`,
      description: `Print-ready 1-page emergency cheat sheet and syntax reference for ${group.name}.`,
    });
    for (const mod of group.modules) {
      routes.push({
        path: `${group.lang}/${mod.id}`,
        title: `${mod.title} (${group.name}) // R-mergency`,
        description: `Exam review module: ${mod.title} for ${group.name} university examinations.`,
      });
    }
  }
  return routes;
}

// sub-apps.config.mjs
// ------------------------------------------------------------------
// Central registry for all sections and sub-apps on the site.
// The Astro source (src/) reads this at build time for nav generation.
// The build pipeline reads it for sub-app build/copy/sitemap orchestration.
// ------------------------------------------------------------------

export const sections = [
  {
    id: 'journal',
    name: 'Philosophy',
    description: 'Philosophy research papers, thought streams, and formal dialectics.',
    basePath: '/philosophy',
    type: 'internal',
    showInNav: true,
  },
  {
    id: 'r-mergency',
    name: 'R-mergency',
    description: 'Emergency exam cram kits, drill sets, and cheat sheets for university courses.',
    basePath: '/R-mergency',
    type: 'sub-app',
    srcDir: 'R-mergency',
    sharedAssets: ['styles', 'favicon.svg'],
    showInNav: true,
    hasSitemap: true,
  },
];

/** Return only sub-app entries (excludes internal sections like journal). */
export function getSubApps() {
  return sections.filter((s) => s.type === 'sub-app');
}

/** Return all nav-visible sections. */
export function getNavSections() {
  return sections.filter((s) => s.showInNav);
}

/**
 * Collect all sub-app sitemap URLs by loading each sub-app's route manifest.
 * Each sub-app is expected to export a routes.mjs from its srcDir with a
 * default export of { getUrls(baseUrl): string[] }.
 */
export async function getAllSubAppUrls(baseUrl) {
  const urls = [];
  for (const app of getSubApps()) {
    if (!app.hasSitemap || !app.srcDir) continue;
    try {
      let mod;
      try {
        mod = await import(`./${app.srcDir}/routes.mjs`);
      } catch {
        mod = await import(`./sub-apps/${app.id}.routes.mjs`);
      }
      if (typeof mod.getUrls === 'function') {
        urls.push(...mod.getUrls(baseUrl));
      } else if (typeof mod.getRmergencyUrls === 'function') {
        urls.push(...mod.getRmergencyUrls(baseUrl));
      }
    } catch {
      // Sub-app not present or no routes manifest; skip silently.
    }
  }
  return urls;
}

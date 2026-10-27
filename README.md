# funtohard

A personal showcase for design and software development, with independent philosophy and learning applications.

## Structure

- `/`: showcase, with an independent layout in `src/pages/index.astro`.
- `/work/`: interactive project case studies with Overview, Design, and Build views.
- `/philosophy/`: Astro research and thought collections, with the scholarly reading interface.
- `/R-mergency/`: Vite/TypeScript learning application, owned by this repository as the `r-mergency` npm workspace.

R-mergency was imported from `FunToHard/R-mergency` at commit `580358db91652cd1ffa8d1249c239c5ddb42afc3`. Future changes belong in this repository; Git submodule initialization is no longer required.

## Develop

Run `npm ci` once at the repository root. It installs the root application and workspace dependencies using the root lockfile.

- `npm run dev`: showcase and philosophy at `http://localhost:8087/`.
- `npm run dev:rmergency`: R-mergency's Vite development server; use the printed URL with `/R-mergency/`.
- `npm run build`: type checks, both static builds, legacy URL redirects, sub-app assembly, sitemaps, and Pagefind.
- `npm run preview -- --port 8087`: preview the complete assembled site, including R-mergency.

The GitHub Actions workflow deploys the assembled `dist/` directory to GitHub Pages. Old research, thoughts, topics, and journal URLs receive concrete HTML redirects. Lowercase R-mergency URLs redirect to the canonical `/R-mergency/` paths.

## Visual system

The showcase and R-mergency share tokens and locally hosted fonts through `public/styles/editorial.css`. Font and icon licenses are included beside their assets. The homepage's Read / Inspect control reveals implementation notes; the study application offers paper and ink themes. Study view keyboard shortcuts are Alt+1, Alt+2, and Alt+3; number keys in practice select answers.

The homepage's product images are captures of the real study application, not generated UI.

The Work page supports shareable case-study links such as `/work/?project=r-mergency&view=design` and `/work/?project=funtohard&view=build`. Its project and view tabs support arrow keys, Home, and End. Product captures can be switched and enlarged in a native dialog.

## Philosophy visual system

Philosophy has its own header, footer, publication lists, archive controls, and reading layout. Its white/ultramarine design uses IBM Plex Sans and Source Serif 4 through `public/styles/philosophy.css`. Fonts and mathematical typesetting assets are hosted locally with their licenses. Paper, Night, and Contrast settings use the independent `philosophy-theme` preference.

Research supports field filtering; Subjects supports text filtering. Articles retain citation formats, font and size preferences, focus mode, text-selection tools, active contents, mathematical rendering, code-copy controls, and Pagefind indexing. Existing publication content and historical URL redirects are preserved.

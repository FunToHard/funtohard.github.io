import { CramCard, LanguageInfo } from '../data/types';
import { LANGUAGES } from '../data/languages';

export function renderCramSheetView(
  currentLanguage: LanguageInfo,
  cramCards: CramCard[],
  onSelectLanguage: (langId: string) => void,
  onBackToSyllabus: () => void
): HTMLElement {
  const container = document.createElement('main');
  container.className = 'study-cram';

  let filterQuery = '';

  function filterCards(): CramCard[] {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return cramCards;

    return cramCards
      .map((card) => {
        const matchesTitle = card.title.toLowerCase().includes(q);
        const filteredItems = card.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.snippet.toLowerCase().includes(q) ||
            (item.note && item.note.toLowerCase().includes(q))
        );
        if (matchesTitle) return card;
        if (filteredItems.length > 0) {
          return { ...card, items: filteredItems };
        }
        return null;
      })
      .filter((card): card is CramCard => card !== null);
  }

  function renderView() {
    const displayedCards = filterCards();

    container.innerHTML = `
      <div class="space-y-6" id="cram-sheet-printable">
        <!-- Top Toolbar (Hidden on print) -->
        <div class="no-print flex flex-wrap items-center justify-between border-b border-rule pb-4 font-mono text-xs gap-3">
          <div class="flex items-center gap-3">
            <button id="cram-back-btn" class="apple-btn-tactile px-2.5 py-1 bg-surface hover:bg-wash border border-rule text-secondary hover:text-ink rounded-md transition-colors">
              &larr; Syllabus
            </button>
            <span class="text-accent font-bold uppercase tracking-wider">QUICK REFERENCE</span>
          </div>

          <div class="flex items-center gap-3">
            <!-- Language quick switch -->
            <div class="flex items-center gap-1.5 text-[11px] text-secondary">
              <span>Language:</span>
              <select
                id="cram-lang-select" aria-label="Reference sheet language"
                class="bg-surface border border-rule text-ink rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
              >
                ${LANGUAGES.map(
                  (l) => `<option value="${l.id}" ${l.id === currentLanguage.id ? 'selected' : ''}>${l.name}</option>`
                ).join('')}
              </select>
            </div>

            <!-- Print Trigger -->
            <button
              id="cram-print-btn"
              class="apple-btn-tactile px-3.5 py-1.5 bg-accent text-zinc-950 hover:bg-accent font-bold rounded-lg font-mono text-xs flex items-center gap-2 transition-colors shadow-sm"
              title="Print cheatsheet or save to PDF (⌘P)"
            >
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        <!-- Filter Search Bar (Hidden on print) -->
        <div class="no-print flex items-center gap-2 bg-surface/80 border border-rule rounded-lg px-3 py-1.5 focus-within:border-rule transition-colors">
          <svg class="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            id="cram-filter-input"
            aria-label="Filter reference sheets"
            value="${escapeHtml(filterQuery)}"
            placeholder="Quick-filter syntax & commands (Press '/' to focus)..."
            class="w-full bg-transparent border-none text-ink placeholder-zinc-500 text-xs font-mono focus:outline-none"
          />
          ${filterQuery ? `
            <button id="cram-clear-filter" class="text-muted hover:text-secondary font-mono text-xs px-1">
              [Clear]
            </button>
          ` : `
            <kbd class="text-[9px] text-muted bg-canvas px-1.5 py-0.5 rounded border border-rule font-mono">/</kbd>
          `}
        </div>

        <!-- Printable Document Header -->
        <div class="border-b border-rule print:border-zinc-300 pb-3">
          <div class="flex items-baseline justify-between">
            <h2 class="text-xl md:text-2xl font-bold font-mono tracking-tight text-ink print:text-black">
              ${currentLanguage.name} <em>at a glance.</em>
            </h2>
            <span class="font-mono text-[11px] text-muted print:text-zinc-700">
              ${currentLanguage.primaryTarget}
            </span>
          </div>
          <p class="text-xs text-secondary print:text-zinc-700 mt-1">
            High-yield Base syntax and gotchas designed for review 30 minutes before lab practicals and written examinations.
          </p>
        </div>

        <!-- Dense Cards Grid (2 Columns on Web & Print) -->
        ${displayedCards.length === 0 ? `
          <div class="p-8 text-center bg-surface border border-rule rounded-xl space-y-2">
            <p class="text-xs font-mono text-secondary">No syntax matches found for "${escapeHtml(filterQuery)}".</p>
            <button id="reset-filter-link" class="text-xs font-mono text-accent hover:underline">Reset search filter</button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${displayedCards.map((card) => `
              <div class="bg-surface/60 print:bg-white border border-rule print:border-zinc-300 rounded-xl p-3.5 space-y-2.5 shadow-sm">
                <h3 class="font-mono font-bold text-xs uppercase tracking-wider text-accent print:text-black border-b border-rule/80 print:border-zinc-200 pb-1">
                  ${card.title}
                </h3>
                <div class="space-y-1.5 text-xs font-mono">
                  ${card.items.map((item) => `
                    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-0.5 border-b border-rule/30 print:border-zinc-100 last:border-b-0">
                      <span class="text-secondary print:text-muted font-medium text-[11px]">${escapeHtml(item.label)}:</span>
                      <div class="flex flex-col sm:items-end">
                        <code class="text-accent print:text-black bg-canvas print:bg-transparent px-1.5 py-0.2 rounded text-[11px] border border-rule/60 print:border-none">
                          ${escapeHtml(item.snippet)}
                        </code>
                        ${item.note ? `<span class="text-[10px] text-muted print:text-zinc-700 font-sans">${escapeHtml(item.note)}</span>` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Print Footer -->
        <div class="hidden print:block pt-3 border-t border-zinc-300 text-[10px] text-muted font-mono flex justify-between">
          <span>${currentLanguage.name} Emergency Cram Kit • funtohard.github.io/r-mergency</span>
          <span>Pass the exams. Focus on actual software engineering.</span>
        </div>
      </div>
    `;

    container.querySelector('#cram-back-btn')?.addEventListener('click', onBackToSyllabus);
    container.querySelector('#cram-print-btn')?.addEventListener('click', () => {
      window.print();
    });

    const filterInput = container.querySelector<HTMLInputElement>('#cram-filter-input');
    filterInput?.addEventListener('input', (e) => {
      filterQuery = (e.target as HTMLInputElement).value;
      renderView();
      // Keep focus in input
      const newInput = container.querySelector<HTMLInputElement>('#cram-filter-input');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(filterQuery.length, filterQuery.length);
      }
    });

    container.querySelector('#cram-clear-filter')?.addEventListener('click', () => {
      filterQuery = '';
      renderView();
    });

    container.querySelector('#reset-filter-link')?.addEventListener('click', () => {
      filterQuery = '';
      renderView();
    });

    const select = container.querySelector<HTMLSelectElement>('#cram-lang-select');
    select?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value;
      onSelectLanguage(val);
    });
  }

  // Keyboard shortcut '/' to focus filter
  const keyHandler = (e: KeyboardEvent) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
      e.preventDefault();
      const input = container.querySelector<HTMLInputElement>('#cram-filter-input');
      input?.focus();
    }
  };
  window.addEventListener('keydown', keyHandler);
  container.dataset.disposable = '';
  container.addEventListener('dispose', () => window.removeEventListener('keydown', keyHandler), { once: true });

  renderView();
  return container;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

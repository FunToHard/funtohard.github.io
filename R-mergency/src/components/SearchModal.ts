import { searchAllContent, SearchResult } from '../data';

export function createSearchModal(
  onSelectResult: (langId: string, moduleId: string) => void
): { element: HTMLElement; open: () => void; close: () => void } {
  const modal = document.createElement('div');
  modal.id = 'search-palette-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Search the study notebook');
  modal.className = 'no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-start justify-center pt-16 sm:pt-24 px-4';

  modal.innerHTML = `
    <div class="w-full max-w-2xl bg-surface border border-rule/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in zoom-in-95 duration-100">
      <!-- Search Input Header -->
      <div class="flex items-center px-4 py-3 border-b border-rule gap-3">
        <svg class="w-4 h-4 text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id="search-palette-input" aria-label="Search study modules"
          type="text"
          placeholder="Search syntax, gotchas, algorithms across all languages... (Esc to close)"
          class="w-full bg-transparent text-sm text-ink placeholder-zinc-500 focus:outline-none font-sans"
          autocomplete="off"
        />
        <button id="search-close-btn" type="button" aria-label="Close search" class="study-search-close">Close</button>
      </div>

      <!-- Results Container -->
      <div id="search-palette-results" class="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-zinc-800/40">
        <div class="p-6 text-center text-xs text-muted font-mono">
          Type at least 2 characters to search R, Prolog, Fortran, MATLAB, and COBOL.
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-4 py-2 border-t border-rule/80 bg-canvas/60 flex items-center justify-between text-[11px] font-mono text-muted">
        <div class="flex items-center gap-3">
          <span><kbd class="bg-wash px-1 rounded text-[10px]">↑↓</kbd> Navigate</span>
          <span><kbd class="bg-wash px-1 rounded text-[10px]">↵</kbd> Select</span>
        </div>
        <span>7 Languages • 47 Exam Modules</span>
      </div>
    </div>
  `;

  const input = modal.querySelector<HTMLInputElement>('#search-palette-input')!;
  const resultsContainer = modal.querySelector<HTMLElement>('#search-palette-results')!;

  let previousFocus: HTMLElement | null = null;
  let selectedIndex = 0;
  let currentResults: SearchResult[] = [];

  function open() {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    input.value = '';
    selectedIndex = 0;
    renderResults([]);
    setTimeout(() => input.focus(), 50);
  }

  function close() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    if (previousFocus?.isConnected) previousFocus.focus();
  }

  modal.querySelector('#search-close-btn')?.addEventListener('click', close);
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const button = modal.querySelector<HTMLButtonElement>('#search-close-btn');
    if (e.shiftKey && document.activeElement === input) { e.preventDefault(); button?.focus(); }
    else if (!e.shiftKey && document.activeElement === button) { e.preventDefault(); input.focus(); }
  });

  function renderResults(results: SearchResult[]) {
    currentResults = results;
    selectedIndex = 0;

    if (results.length === 0) {
      if (input.value.trim().length >= 2) {
        resultsContainer.innerHTML = `
          <div class="p-6 text-center text-xs text-muted font-mono">
            No matching topics or gotchas found for "${escapeHtml(input.value)}".
          </div>
        `;
      } else {
        resultsContainer.innerHTML = `
          <div class="p-6 text-center text-xs text-muted font-mono">
            Type at least 2 characters to search all language modules.
          </div>
        `;
      }
      return;
    }

    resultsContainer.innerHTML = results.map((res, idx) => `
      <div
        data-index="${idx}"
        class="search-item group p-3 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-3 ${
          idx === selectedIndex ? 'bg-wash text-ink' : 'hover:bg-wash/50 text-secondary'
        }"
      >
        <div class="space-y-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
              ${res.langName}
            </span>
            <span class="text-xs font-semibold text-ink truncate">
              ${escapeHtml(res.sectionHeading)}
            </span>
          </div>
          <p class="text-[11px] text-secondary leading-snug line-clamp-2">
            ${escapeHtml(res.snippet)}
          </p>
        </div>
        <span class="text-[10px] font-mono text-muted flex-shrink-0 group-hover:text-secondary">
          ${escapeHtml(res.moduleTitle.split('(')[0].trim())} &rarr;
        </span>
      </div>
    `).join('');

    // Attach click handlers
    resultsContainer.querySelectorAll<HTMLElement>('.search-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index') || '0', 10);
        const chosen = currentResults[idx];
        if (chosen) {
          onSelectResult(chosen.langId, chosen.moduleId);
          close();
        }
      });
    });
  }

  // Input listener
  input.addEventListener('input', () => {
    const q = input.value;
    const results = searchAllContent(q);
    renderResults(results);
  });

  // Keyboard navigation
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }

    if (currentResults.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentResults.length;
        updateSelectedHighlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
        updateSelectedHighlight();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const chosen = currentResults[selectedIndex];
        if (chosen) {
          onSelectResult(chosen.langId, chosen.moduleId);
          close();
        }
      }
    }
  });

  function updateSelectedHighlight() {
    resultsContainer.querySelectorAll<HTMLElement>('.search-item').forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add('bg-wash', 'text-ink');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('bg-wash', 'text-ink');
      }
    });
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  return { element: modal, open, close };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

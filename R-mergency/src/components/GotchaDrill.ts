import { type QuizQuestion, type LanguageInfo } from '../data/types';
import { getAllQuizzes } from '../data';
import { isFlagged, toggleFlag, getFlaggedIds, getFlaggedCount } from '../data/bookmarks';
import Prism from 'prismjs';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-prolog';
import 'prismjs/components/prism-fortran';
import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-cobol';
import 'prismjs/components/prism-scheme';

if (!Prism.languages.mips) {
  Prism.languages.mips = {
    comment: /#.*/,
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true,
    },
    directive: {
      pattern: /\.(?:data|text|globl|asciiz|ascii|word|byte|space|align|float|double)\b/,
      alias: 'keyword',
    },
    register: {
      pattern: /\$(?:zero|at|v[01]|a[0-3]|t[0-9]|s[0-7]|k[01]|gp|sp|fp|ra|\d+)\b/,
      alias: 'variable',
    },
    instruction: {
      pattern: /\b(?:add|addi|addiu|addu|and|andi|beq|bne|bgtz|blez|bltz|bgez|div|divu|j|jal|jr|jalr|lb|lbu|lh|lhu|lui|lw|mfhi|mflo|mthi|mtlo|mult|multu|nor|or|ori|sb|sh|sll|sllv|slt|slti|sltiu|sltu|sra|srav|srl|srlv|sub|subu|sw|syscall|xor|xori|li|la|move|nop|b|beqz|bnez)\b/,
      alias: 'function',
    },
    label: {
      pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=:)/,
      alias: 'class-name',
    },
    number: /\b(?:0x[0-9a-fA-F]+|\d+)\b/,
  };
}

export function renderGotchaDrill(
  currentLanguage: LanguageInfo,
  languageQuizzes: QuizQuestion[],
  onBackToSyllabus: () => void
): HTMLElement {
  const container = document.createElement('main');
  container.className = 'study-practice';

  // Scope: 'current' (active language), 'all' (all questions), or 'flagged'
  let drillScope: 'current' | 'all' | 'flagged' = 'current';
  let activeQuestions: QuizQuestion[] = [...languageQuizzes];
  let selectedCategory: string = 'all';

  let currentIndex = 0;
  let score = 0;
  let answered = false;

  // Category performance tracking
  const categoryStats: Record<string, { correct: number; total: number }> = {};

  function filterQuestions() {
    let baseList: QuizQuestion[];
    if (drillScope === 'all') {
      baseList = getAllQuizzes();
    } else if (drillScope === 'flagged') {
      const flaggedIds = getFlaggedIds();
      baseList = getAllQuizzes().filter((q) => flaggedIds.has(q.id));
    } else {
      baseList = languageQuizzes;
    }

    if (selectedCategory === 'all') {
      activeQuestions = [...baseList];
    } else {
      activeQuestions = baseList.filter((q) => q.trapCategory === selectedCategory);
    }
    currentIndex = 0;
    score = 0;
    answered = false;
  }

  function getAvailableCategories(): string[] {
    let baseList: QuizQuestion[];
    if (drillScope === 'all') {
      baseList = getAllQuizzes();
    } else if (drillScope === 'flagged') {
      const flaggedIds = getFlaggedIds();
      baseList = getAllQuizzes().filter((q) => flaggedIds.has(q.id));
    } else {
      baseList = languageQuizzes;
    }
    const cats = new Set<string>();
    baseList.forEach((q) => cats.add(q.trapCategory));
    return Array.from(cats);
  }

  function renderCurrentQuestion() {
    const flaggedTotal = getFlaggedCount();

    if (activeQuestions.length === 0) {
      container.innerHTML = `
        <div class="bg-surface border border-rule rounded-xl p-8 text-center space-y-4">
          <p class="text-secondary font-mono text-xs">
            ${drillScope === 'flagged' ? 'No flagged questions for review yet. Flag tricky questions during your drill with the [Flag] button or pressing "f".' : 'No questions found matching this filter.'}
          </p>
          <div class="flex items-center justify-center gap-3">
            <button id="reset-filter-btn" class="apple-btn-tactile px-4 py-2 bg-accent hover:bg-accent text-zinc-950 rounded-lg text-xs font-mono font-bold transition-colors">
              Reset Scope to ${currentLanguage.name}
            </button>
            <button id="back-to-syllabus-empty-btn" class="apple-btn-tactile px-4 py-2 bg-wash hover:bg-wash text-secondary rounded-lg text-xs font-mono transition-colors">
              Back to Syllabus
            </button>
          </div>
        </div>
      `;
      container.querySelector('#reset-filter-btn')?.addEventListener('click', () => {
        drillScope = 'current';
        selectedCategory = 'all';
        filterQuestions();
        renderCurrentQuestion();
      });
      container.querySelector('#back-to-syllabus-empty-btn')?.addEventListener('click', onBackToSyllabus);
      return;
    }

    const q: QuizQuestion = activeQuestions[currentIndex];
    const isLast = currentIndex === activeQuestions.length - 1;
    const progressPercent = Math.round(((currentIndex + 1) / activeQuestions.length) * 100);
    const categories = getAvailableCategories();
    const isItemFlagged = isFlagged(q.id);

    container.innerHTML = `
      <div class="space-y-6 animate-in fade-in duration-150">
        <!-- Top Toolbar & Scope Controls -->
        <div class="border-b border-rule pb-4 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div class="flex items-center gap-3">
              <span class="text-accent font-bold uppercase tracking-wider">PRACTICE / THE EXCEPTIONS</span>
              <span class="text-muted">|</span>
              <span class="text-secondary">Question ${currentIndex + 1} of ${activeQuestions.length}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="bg-surface border border-rule px-3 py-1 rounded-md text-secondary">
                Score: <span id="current-score" class="text-accent font-bold">${score}</span>/${activeQuestions.length}
              </div>
            </div>
          </div>

          <!-- Apple HIG Scope Selector & Filters -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <!-- Segmented Control -->
            <div class="flex items-center bg-surface p-0.5 rounded-lg border border-rule text-xs font-mono">
              <button
                id="scope-current-btn"
                class="apple-btn-tactile px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                  drillScope === 'current' ? 'bg-wash text-ink font-semibold' : 'text-muted hover:text-secondary'
                }"
              >
                ${currentLanguage.name} (${languageQuizzes.length})
              </button>
              <button
                id="scope-all-btn"
                class="apple-btn-tactile px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                  drillScope === 'all' ? 'bg-wash text-accent font-semibold' : 'text-muted hover:text-secondary'
                }"
              >
                All Languages (${getAllQuizzes().length})
              </button>
              <button
                id="scope-flagged-btn"
                class="apple-btn-tactile px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                  drillScope === 'flagged' ? 'bg-rose-950/60 text-rose-700 border border-rose-800 font-semibold' : 'text-muted hover:text-secondary'
                }"
              >
                Flagged for Review (${flaggedTotal})
              </button>
            </div>

            <!-- Category Filter Dropdown -->
            <select
              id="category-filter-select" aria-label="Filter practice by category"
              class="bg-surface border border-rule text-secondary hover:text-ink rounded-md px-2 py-1 font-mono text-[11px] focus:outline-none"
            >
              <option value="all" ${selectedCategory === 'all' ? 'selected' : ''}>All Categories</option>
              ${categories.map(
                (cat) => `<option value="${cat}" ${selectedCategory === cat ? 'selected' : ''}>${cat}</option>`
              ).join('')}
            </select>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-rule/60">
            <div
              class="bg-accent h-full rounded-full transition-all duration-300"
              style="width: ${progressPercent}%"
            ></div>
          </div>
        </div>

        <!-- Question Card -->
        <div class="bg-surface/70 border border-rule rounded-xl p-6 space-y-4 shadow-sm">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] uppercase font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                ${q.trapCategory}
              </span>
              <span class="font-mono text-[10px] text-muted uppercase">
                Target: ${q.langId.toUpperCase()}
              </span>
            </div>

            <!-- Flag for Review Button -->
            <button
              id="flag-question-btn"
              type="button"
              class="apple-btn-tactile flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                isItemFlagged
                  ? 'bg-rose-950/50 border-rose-600 text-rose-700'
                  : 'bg-canvas hover:bg-wash border-rule text-secondary hover:text-ink'
              }"
              title="Bookmark question to review before exam (Shortcut: F)"
            >
              <span>${isItemFlagged ? 'Flagged' : 'Flag for review'}</span>
              <kbd class="text-[9px] text-muted bg-surface px-1 rounded border border-rule font-mono">F</kbd>
            </button>
          </div>

          <h2 class="text-base md:text-lg font-semibold text-ink font-sans leading-snug">
            ${q.question}
          </h2>

          ${q.codeSnippet ? `
            <pre class="!my-2 language-${q.langId}"><code class="language-${q.langId}">${escapeHtml(q.codeSnippet)}</code></pre>
          ` : ''}

          <!-- Options -->
          <div class="space-y-2 pt-2" id="options-list">
            ${q.options.map((opt, idx) => `
              <button
                data-option-index="${idx}"
                class="option-btn apple-btn-tactile w-full text-left p-3.5 rounded-lg bg-canvas hover:bg-wash border border-rule/90 text-xs md:text-sm font-mono text-secondary transition-all flex items-start gap-3 select-none"
              >
                <span class="text-muted font-bold font-mono">[${String.fromCharCode(65 + idx)}]</span>
                <span class="flex-1">${escapeHtml(opt)}</span>
                <kbd class="text-[9px] text-muted font-mono self-center">${idx + 1}</kbd>
              </button>
            `).join('')}
          </div>

          <!-- Explanation Box (Initially Hidden) -->
          <div id="explanation-box" class="hidden pt-4 border-t border-rule space-y-2">
            <div id="result-badge" class="font-mono text-xs font-bold"></div>
            <p id="explanation-text" class="text-xs md:text-sm text-secondary leading-relaxed font-sans bg-canvas p-3.5 rounded-lg border border-rule">
              ${q.explanation}
            </p>
          </div>
        </div>

        <!-- Action Controls -->
        <div class="flex items-center justify-between font-mono text-xs pt-2">
          <button id="back-to-syllabus-btn" class="apple-btn-tactile px-3.5 py-2 bg-surface hover:bg-wash border border-rule text-secondary hover:text-ink rounded-lg transition-colors">
            &larr; Back to Syllabus
          </button>

          <button id="next-question-btn" class="apple-btn-tactile hidden px-4 py-2 bg-accent/20 hover:bg-accent/30 border border-accent/40 text-accent rounded-lg font-semibold transition-colors shadow-sm">
            ${isLast ? 'Complete Drill' : 'Next Question &rarr;'}
          </button>
        </div>
      </div>
    `;

    Prism.highlightAllUnder(container);

    // Option selection logic
    const optionButtons = container.querySelectorAll<HTMLButtonElement>('.option-btn');
    const explanationBox = container.querySelector<HTMLElement>('#explanation-box')!;
    const resultBadge = container.querySelector<HTMLElement>('#result-badge')!;
    const nextBtn = container.querySelector<HTMLButtonElement>('#next-question-btn')!;

    // Flag button listener
    const flagBtn = container.querySelector<HTMLButtonElement>('#flag-question-btn');
    flagBtn?.addEventListener('click', () => {
      const nowFlagged = toggleFlag(q.id);
      if (nowFlagged) {
        flagBtn.className = 'apple-btn-tactile flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors border bg-rose-950/50 border-rose-600 text-rose-700';
        flagBtn.innerHTML = `<span>Flagged</span><kbd class="text-[9px] text-muted bg-surface px-1 rounded border border-rule font-mono">F</kbd>`;
      } else {
        flagBtn.className = 'apple-btn-tactile flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors border bg-canvas hover:bg-wash border-rule text-secondary hover:text-ink';
        flagBtn.innerHTML = `<span>Flag for review</span><kbd class="text-[9px] text-muted bg-surface px-1 rounded border border-rule font-mono">F</kbd>`;
      }
      const flaggedScopeBtn = container.querySelector('#scope-flagged-btn');
      if (flaggedScopeBtn) {
        flaggedScopeBtn.textContent = `Flagged for Review (${getFlaggedCount()})`;
      }
    });

    // Scope button listeners
    container.querySelector('#scope-current-btn')?.addEventListener('click', () => {
      drillScope = 'current';
      filterQuestions();
      renderCurrentQuestion();
    });

    container.querySelector('#scope-all-btn')?.addEventListener('click', () => {
      drillScope = 'all';
      filterQuestions();
      renderCurrentQuestion();
    });

    container.querySelector('#scope-flagged-btn')?.addEventListener('click', () => {
      drillScope = 'flagged';
      filterQuestions();
      renderCurrentQuestion();
    });

    const catSelect = container.querySelector<HTMLSelectElement>('#category-filter-select');
    catSelect?.addEventListener('change', (e) => {
      selectedCategory = (e.target as HTMLSelectElement).value;
      filterQuestions();
      renderCurrentQuestion();
    });

    function selectOption(selectedIdx: number) {
      if (answered || selectedIdx < 0 || selectedIdx >= q.options.length) return;
      answered = true;
      const btn = optionButtons[selectedIdx];
      const isCorrect = selectedIdx === q.correctIndex;

      if (!categoryStats[q.trapCategory]) {
        categoryStats[q.trapCategory] = { correct: 0, total: 0 };
      }
      categoryStats[q.trapCategory].total++;
      if (isCorrect) categoryStats[q.trapCategory].correct++;

      if (isCorrect) {
        score++;
        btn.classList.remove('bg-canvas', 'border-rule/90');
        btn.classList.add('bg-emerald-950/40', 'border-emerald-600', 'text-emerald-700');
        resultBadge.innerHTML = '<span class="text-emerald-700">Correct. Here is why.</span>';
      } else {
        btn.classList.remove('bg-canvas', 'border-rule/90');
        btn.classList.add('bg-rose-950/40', 'border-rose-600', 'text-rose-700');
        resultBadge.innerHTML = '<span class="text-rose-700">Not quite. Watch the exception.</span>';

        const correctBtn = optionButtons[q.correctIndex];
        if (correctBtn) {
          correctBtn.classList.remove('bg-canvas', 'border-rule/90');
          correctBtn.classList.add('bg-emerald-950/30', 'border-emerald-700', 'text-emerald-700');
        }
      }

      optionButtons.forEach((b) => b.classList.add('cursor-default'));

      const scoreElem = container.querySelector('#current-score');
      if (scoreElem) scoreElem.textContent = score.toString();

      explanationBox.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
    }

    optionButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.getAttribute('data-option-index') || '-1', 10);
        selectOption(selectedIdx);
      });
    });

    container.querySelector('#back-to-syllabus-btn')?.addEventListener('click', onBackToSyllabus);

    nextBtn.addEventListener('click', () => {
      advanceNext();
    });

    function advanceNext() {
      if (currentIndex < activeQuestions.length - 1) {
        currentIndex++;
        answered = false;
        renderCurrentQuestion();
      } else {
        renderCompletionScreen();
      }
    }
  }

  function renderCompletionScreen() {
    const accuracy = Math.round((score / activeQuestions.length) * 100);

    container.innerHTML = `
      <div class="bg-surface border border-rule rounded-xl p-8 space-y-6 text-center shadow-lg animate-in fade-in duration-200">
        <div class="font-mono text-accent font-bold text-xs uppercase tracking-wider">
          [DRILL COMPLETE]
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-ink font-sans">
          Gotcha Drill Result: ${score} / ${activeQuestions.length} (${accuracy}%)
        </h2>
        <p class="text-sm text-secondary max-w-md mx-auto leading-relaxed font-sans">
          ${
            accuracy >= 85
              ? 'Exemplary recall. You are thoroughly shielded against classical professor trick questions, type coercion traps, and precedence edge cases.'
              : accuracy >= 60
              ? 'Solid foundation, but several subtle exam traps still caught you. Review the category breakdown below before taking the test.'
              : 'High risk of losing points on multiple-choice and trace table questions. Spend 20 minutes reviewing the modules below.'
          }
        </p>

        <!-- Category Breakdown Table -->
        <div class="max-w-md mx-auto text-left bg-canvas border border-rule rounded-lg p-4 space-y-2 font-mono text-xs">
          <div class="font-bold text-secondary text-[11px] pb-1 border-b border-rule flex justify-between">
            <span>CATEGORY BREAKDOWN</span>
            <span>ACCURACY</span>
          </div>
          ${Object.entries(categoryStats).map(([cat, stat]) => `
            <div class="flex justify-between py-1 border-b border-rule/40 text-[11px]">
              <span class="text-secondary">${cat}:</span>
              <span class="${stat.correct === stat.total ? 'text-emerald-700' : 'text-accent'} font-semibold">
                ${stat.correct}/${stat.total}
              </span>
            </div>
          `).join('')}
        </div>

        <div class="flex items-center justify-center gap-4 pt-4 font-mono text-xs">
          <button id="restart-drill-btn" class="apple-btn-tactile px-4 py-2 bg-wash hover:bg-wash border border-rule text-ink rounded-lg transition-colors">
            Restart Drill
          </button>
          <button id="finish-syllabus-btn" class="apple-btn-tactile px-4 py-2 bg-accent text-zinc-950 font-bold hover:bg-accent rounded-lg transition-colors shadow-sm">
            Return to Syllabus
          </button>
        </div>
      </div>
    `;

    container.querySelector('#restart-drill-btn')?.addEventListener('click', () => {
      currentIndex = 0;
      score = 0;
      answered = false;
      renderCurrentQuestion();
    });

    container.querySelector('#finish-syllabus-btn')?.addEventListener('click', onBackToSyllabus);
  }

  // Keyboard shortcut handler for drill
  const keyHandler = (e: KeyboardEvent) => {
    // If inside an input or select, skip
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
      return;
    }

    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      const flagBtn = container.querySelector<HTMLButtonElement>('#flag-question-btn');
      flagBtn?.click();
    } else if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const btns = container.querySelectorAll<HTMLButtonElement>('.option-btn');
      if (btns[idx]) {
        btns[idx].click();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      const nextBtn = container.querySelector<HTMLButtonElement>('#next-question-btn');
      if (nextBtn && !nextBtn.classList.contains('hidden')) {
        e.preventDefault();
        nextBtn.click();
      }
    }
  };

  window.addEventListener('keydown', keyHandler);
  container.dataset.disposable = '';
  container.addEventListener('dispose', () => window.removeEventListener('keydown', keyHandler), { once: true });

  filterQuestions();
  renderCurrentQuestion();
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

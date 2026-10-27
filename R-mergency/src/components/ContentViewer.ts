import { type ExamModule, type LanguageInfo } from '../data/types';
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

export function renderContentViewer(
  language: LanguageInfo,
  module: ExamModule,
  allModules: ExamModule[],
  onNavigateModule: (id: string) => void
): HTMLElement {
  const container = document.createElement('main');
  container.className = 'study-reading';

  const currentIndex = allModules.findIndex((m) => m.id === module.id);
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

  const prismClass = `language-${language.prismLang}`;

  container.innerHTML = `
    <article class="space-y-8 animate-in fade-in duration-150">
      <!-- Header Meta -->
      <div class="border-b border-rule pb-6">
        <div class="flex items-center gap-3 font-mono text-xs text-accent mb-2">
          <span class="font-bold">${module.sectionNumber}</span>
          <span class="text-muted">|</span>
          <span class="bg-surface border border-rule text-secondary px-2.5 py-0.5 rounded-full text-[10px]">
            Cram: ~${module.cramTimeMinutes} min
          </span>
          <span class="text-muted">|</span>
          <span class="text-secondary font-mono text-[11px]">${language.name}</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-ink font-sans">
          ${module.title}
        </h2>
        <p class="mt-3 text-secondary text-sm leading-relaxed max-w-3xl">
          ${module.overview}
        </p>
      </div>

      <!-- Sections -->
      <div class="space-y-10">
        ${module.sections.map((sec, idx) => `
          <section class="space-y-3">
            <h3 class="text-base md:text-lg font-semibold text-ink flex items-center gap-2 font-sans">
              <span class="font-mono text-xs text-muted font-normal">${idx + 1}.</span>
              <span>${sec.heading.replace(/^\d+\.\s*/, '')}</span>
            </h3>
            <p class="text-xs md:text-sm text-secondary leading-relaxed">
              ${sec.explanation}
            </p>

            ${sec.code ? `
              <div class="relative group my-3">
                <div class="flex items-center justify-between bg-surface border border-rule border-b-0 px-3.5 py-1.5 rounded-t-lg text-[11px] font-mono text-secondary select-none">
                  <span class="uppercase tracking-wider text-[10px] text-secondary">${language.name}</span>
                  <button
                    class="copy-code-btn apple-btn-tactile text-secondary hover:text-ink transition-colors py-0.5 px-2 rounded hover:bg-wash"
                    data-code="${encodeURIComponent(sec.code)}"
                  >
                    [Copy]
                  </button>
                </div>
                <pre class="!mt-0 !rounded-t-none ${prismClass}"><code class="${prismClass}">${escapeHtml(sec.code)}</code></pre>
              </div>
            ` : ''}

            ${sec.outputExample ? `
              <div class="bg-canvas border border-rule rounded-lg p-3.5 font-mono text-[11px] text-secondary space-y-1 my-2">
                <div class="text-[10px] uppercase font-bold text-muted tracking-wider">[CONSOLE OUTPUT]</div>
                <pre class="whitespace-pre overflow-x-auto text-secondary font-mono text-xs leading-relaxed">${escapeHtml(sec.outputExample)}</pre>
              </div>
            ` : ''}

            ${sec.trapNote ? `
              <div class="p-3.5 bg-surface/80 border-l-2 border-rose-500 rounded-r-lg text-xs text-secondary space-y-1.5 my-3 shadow-sm">
                <div class="font-mono font-bold text-rose-700 uppercase tracking-wider text-[10px]">
                  ${sec.trapNote.split(']')[0]}]
                </div>
                <div class="text-secondary leading-relaxed font-sans text-xs">
                  ${sec.trapNote.split(']').slice(1).join(']').trim()}
                </div>
              </div>
            ` : ''}
          </section>
        `).join('')}
      </div>

      <!-- Footer Navigation Buttons -->
      <div class="pt-8 border-t border-rule flex items-center justify-between gap-4 font-mono text-xs">
        ${prevModule ? `
          <button id="prev-mod-btn" class="apple-btn-tactile px-4 py-2 bg-surface hover:bg-wash border border-rule text-secondary rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <span>&larr;</span>
            <span>${prevModule.sectionNumber}: ${prevModule.title.split('(')[0].trim()}</span>
            <kbd class="hidden sm:inline text-[9px] text-muted bg-canvas px-1 rounded border border-rule">[</kbd>
          </button>
        ` : '<div></div>'}

        ${nextModule ? `
          <button id="next-mod-btn" class="apple-btn-tactile px-4 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <span>${nextModule.sectionNumber}: ${nextModule.title.split('(')[0].trim()}</span>
            <kbd class="hidden sm:inline text-[9px] text-accent/80 bg-canvas px-1 rounded border border-accent/30">]</kbd>
            <span>&rarr;</span>
          </button>
        ` : '<div></div>'}
      </div>
    </article>
  `;

  // Syntax highlight
  Prism.highlightAllUnder(container);

  // Copy buttons
  container.querySelectorAll<HTMLButtonElement>('.copy-code-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const target = e.currentTarget as HTMLElement;
      const code = decodeURIComponent(target.getAttribute('data-code') || '');
      try {
        await navigator.clipboard.writeText(code);
        target.innerText = '[Copied!]';
        target.classList.add('text-accent');
        setTimeout(() => {
          target.innerText = '[Copy]';
          target.classList.remove('text-accent');
        }, 1500);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  });

  // Module navigation
  container.querySelector('#prev-mod-btn')?.addEventListener('click', () => {
    if (prevModule) onNavigateModule(prevModule.id);
  });
  container.querySelector('#next-mod-btn')?.addEventListener('click', () => {
    if (nextModule) onNavigateModule(nextModule.id);
  });

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

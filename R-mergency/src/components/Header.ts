import { LANGUAGES } from '../data/languages';
import { LanguageInfo } from '../data/types';
import { CramTimer } from './CramTimer';

export function renderHeader(
  currentLanguage: LanguageInfo,
  currentView: 'modules' | 'drill' | 'cram',
  onSelectLanguage: (langId: string) => void,
  onSelectView: (view: 'modules' | 'drill' | 'cram') => void,
  onOpenSearch: () => void,
  onToggleTheme: () => void,
  isDarkMode: boolean
): HTMLElement {
  const header = document.createElement('header');
  header.className = 'study-header no-print';
  header.innerHTML = `
    <div class="study-topline">
      <a class="study-wordmark" href="/" aria-label="Back to funtohard home"><span aria-hidden="true">f.</span> funtohard</a>
      <span class="study-edition">A small tool for a little clarity.</span>
      <div class="study-utilities">
        <div id="cram-timer-slot"></div>
        <button id="header-search-btn" class="study-utility" aria-label="Search all study modules"><img src="/icons/magnifying-glass.svg" alt="" /> <span>Search</span><kbd>Ctrl K</kbd></button>
        <button id="header-theme-toggle" class="study-utility theme-control" aria-label="${isDarkMode ? 'Use paper theme' : 'Use ink theme'}" title="${isDarkMode ? 'Use paper theme' : 'Use ink theme'}"><img src="/icons/${isDarkMode ? 'sun' : 'moon'}.svg" alt="" /><span>${isDarkMode ? 'Paper' : 'Ink'}</span></button>
      </div>
    </div>
    <div class="study-masthead">
      <div><p class="study-eyebrow">The exam preparation notebook</p><h1>R-<em>mergency.</em></h1></div>
      <p class="study-masthead-note">Learn the rules.<br /><em>Notice the exceptions.</em><span>Focused lessons, practice drills,<br />and reference sheets for the exam ahead.</span></p>
    </div>
    <div class="study-nav-row">
      <nav aria-label="Study views">
        ${([{id:'modules', label:'Syllabus', number:'01'}, {id:'drill', label:'Practice drill', number:'02'}, {id:'cram', label:'Cram sheets', number:'03'}] as const).map(view => `<button id="nav-btn-${view.id}" class="study-tab" aria-pressed="${currentView === view.id}"><span>${view.number}</span>${view.label}</button>`).join('')}
      </nav>
      <label class="study-language-label" for="header-language-select">Your course <select id="header-language-select">${LANGUAGES.map(lang => `<option value="${lang.id}" ${lang.id === currentLanguage.id ? 'selected' : ''}>${lang.name}</option>`).join('')}</select></label>
    </div>
  `;
  header.querySelector('#nav-btn-modules')?.addEventListener('click', () => onSelectView('modules'));
  header.querySelector('#nav-btn-drill')?.addEventListener('click', () => onSelectView('drill'));
  header.querySelector('#nav-btn-cram')?.addEventListener('click', () => onSelectView('cram'));
  header.querySelector('#header-search-btn')?.addEventListener('click', onOpenSearch);
  header.querySelector('#header-theme-toggle')?.addEventListener('click', onToggleTheme);
  header.querySelector<HTMLSelectElement>('#header-language-select')?.addEventListener('change', e => onSelectLanguage((e.target as HTMLSelectElement).value));
  const timerSlot = header.querySelector<HTMLElement>('#cram-timer-slot');
  if (timerSlot) new CramTimer(timerSlot);
  return header;
}

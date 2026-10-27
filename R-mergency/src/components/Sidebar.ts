import { LanguageInfo, ExamModule } from '../data/types';

export function renderSidebar(
  language: LanguageInfo,
  modules: ExamModule[],
  activeModuleId: string,
  quizCount: number,
  onSelectModule: (id: string) => void,
  onOpenDrill: () => void,
  onOpenCram: () => void
): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'study-sidebar no-print';
  const minutes = modules.reduce((total, item) => total + item.cramTimeMinutes, 0);
  sidebar.innerHTML = `
    <div class="study-course-summary"><p class="study-eyebrow">Your syllabus / ${modules.length} sections</p><h2>${language.name}</h2><p>About ${minutes} minutes of focused study.</p></div>
    <nav aria-label="Syllabus modules" class="study-module-list">${modules.map((item, i) => `<button data-module-id="${item.id}" class="module-nav-btn" ${item.id === activeModuleId ? 'aria-current="page"' : ''}><span class="module-number">${String(i+1).padStart(2, '0')}</span><span class="module-title">${item.title.split('(')[0].trim()}</span><span class="module-time">${item.cramTimeMinutes}m</span></button>`).join('')}</nav>
    <div class="study-sidebar-actions"><button id="sidebar-drill-btn">Test what you know <span>${quizCount} questions</span><img src="/icons/arrow-right.svg" alt="" /></button><button id="sidebar-cram-btn">Keep it close <span>Reference sheets</span><img src="/icons/arrow-right.svg" alt="" /></button></div>
    <div class="study-margin-rule"><span>A note in the margin</span><p>${language.goldenRule}</p></div>
  `;
  sidebar.querySelectorAll<HTMLButtonElement>('[data-module-id]').forEach(btn => btn.addEventListener('click', () => onSelectModule(btn.dataset.moduleId!)));
  sidebar.querySelector('#sidebar-drill-btn')?.addEventListener('click', onOpenDrill);
  sidebar.querySelector('#sidebar-cram-btn')?.addEventListener('click', onOpenCram);
  return sidebar;
}

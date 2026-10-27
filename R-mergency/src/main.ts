import './styles/index.css';
import { getLanguageBundle, getLanguageInfo } from './data';
import { LANGUAGES } from './data/languages';
import { renderHeader } from './components/Header';
import { renderSidebar } from './components/Sidebar';
import { renderContentViewer } from './components/ContentViewer';
import { renderGotchaDrill } from './components/GotchaDrill';
import { renderCramSheetView } from './components/CramSheetView';
import { createSearchModal } from './components/SearchModal';

interface AppState {
  activeLangId: string;
  currentView: 'modules' | 'drill' | 'cram';
  activeModuleId: string;
  isDarkMode: boolean;
}

// Initial state from localStorage or defaults
const state: AppState = {
  activeLangId: localStorage.getItem('rmergency_lang') || 'r',
  currentView: 'modules',
  activeModuleId: '',
  isDarkMode: localStorage.getItem('rmergency_theme') === 'dark',
};

// Ensure active language exists
if (!LANGUAGES.some((l) => l.id === state.activeLangId)) {
  state.activeLangId = 'r';
}

// Ensure active module exists
const initialBundle = getLanguageBundle(state.activeLangId);
state.activeModuleId = initialBundle.modules[0]?.id || '';

// Sync dark mode class
if (state.isDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Hash & Path Routing: #/<langId>/<view_or_moduleId> or /r-mergency/<langId>/<view_or_moduleId>
function parseRoute() {
  let routeStr = window.location.hash.replace(/^#\/?/, '').trim();

  if (!routeStr) {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/r-mergency\/(.+)$/i);
    if (match && match[1]) {
      routeStr = match[1].replace(/\/+$/, '').replace(/index\.html$/, '');
    }
  }

  if (!routeStr) return;

  const parts = routeStr.split('/').filter(Boolean);
  if (parts.length >= 1) {
    const langCandidate = parts[0].toLowerCase();
    if (LANGUAGES.some((l) => l.id === langCandidate)) {
      state.activeLangId = langCandidate;
    }
  }

  const bundle = getLanguageBundle(state.activeLangId);

  if (parts.length >= 2) {
    const sub = parts[1];
    if (sub === 'drill') {
      state.currentView = 'drill';
    } else if (sub === 'cram') {
      state.currentView = 'cram';
    } else {
      const foundModule = bundle.modules.find((m) => m.id === sub);
      if (foundModule) {
        state.activeModuleId = foundModule.id;
        state.currentView = 'modules';
      }
    }
  } else {
    // If no module specified, default to first module
    if (!state.activeModuleId || !bundle.modules.some((m) => m.id === state.activeModuleId)) {
      state.activeModuleId = bundle.modules[0]?.id || '';
    }
  }
}

function updateHash() {
  if (state.currentView === 'drill') {
    window.location.hash = `#/${state.activeLangId}/drill`;
  } else if (state.currentView === 'cram') {
    window.location.hash = `#/${state.activeLangId}/cram`;
  } else {
    window.location.hash = `#/${state.activeLangId}/${state.activeModuleId}`;
  }
}

// Search Modal
const searchModal = createSearchModal((langId, moduleId) => {
  state.activeLangId = langId;
  state.activeModuleId = moduleId;
  state.currentView = 'modules';
  localStorage.setItem('rmergency_lang', langId);
  updateHash();
  renderApp();
});
document.body.appendChild(searchModal.element);

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  app.querySelectorAll('[data-disposable]').forEach(node => node.dispatchEvent(new Event('dispose')));
  app.innerHTML = '';

  const bundle = getLanguageBundle(state.activeLangId);
  const currentLangInfo = getLanguageInfo(state.activeLangId);

  // Validate activeModuleId within current bundle
  if (!bundle.modules.some((m) => m.id === state.activeModuleId)) {
    state.activeModuleId = bundle.modules[0]?.id || '';
  }

  // 1. Header (Apple HIG Segmented Control & Controls)
  const header = renderHeader(
    currentLangInfo,
    state.currentView,
    (newLangId) => {
      state.activeLangId = newLangId;
      localStorage.setItem('rmergency_lang', newLangId);
      const newBundle = getLanguageBundle(newLangId);
      state.activeModuleId = newBundle.modules[0]?.id || '';
      updateHash();
      renderApp();
    },
    (newView) => {
      state.currentView = newView;
      updateHash();
      renderApp();
    },
    () => searchModal.open(),
    () => {
      state.isDarkMode = !state.isDarkMode;
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('rmergency_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('rmergency_theme', 'light');
      }
      renderApp();
    },
    state.isDarkMode
  );
  app.appendChild(header);

  // 2. Main Workspace Layout
  const workspace = document.createElement('div');
  workspace.className = 'study-workspace';
  workspace.dataset.view = state.currentView;

  if (state.currentView === 'modules') {
    // Sidebar
    const sidebar = renderSidebar(
      currentLangInfo,
      bundle.modules,
      state.activeModuleId,
      bundle.quizzes.length,
      (moduleId) => {
        state.activeModuleId = moduleId;
        updateHash();
        renderApp();
      },
      () => {
        state.currentView = 'drill';
        updateHash();
        renderApp();
      },
      () => {
        state.currentView = 'cram';
        updateHash();
        renderApp();
      }
    );
    workspace.appendChild(sidebar);

    // Active Content Viewer
    const currentModule = bundle.modules.find((m) => m.id === state.activeModuleId) || bundle.modules[0];
    const viewer = renderContentViewer(
      currentLangInfo,
      currentModule,
      bundle.modules,
      (targetModuleId) => {
        state.activeModuleId = targetModuleId;
        updateHash();
        renderApp();
      }
    );
    workspace.appendChild(viewer);
  } else if (state.currentView === 'drill') {
    const drill = renderGotchaDrill(
      currentLangInfo,
      bundle.quizzes,
      () => {
        state.currentView = 'modules';
        updateHash();
        renderApp();
      }
    );
    workspace.appendChild(drill);
  } else if (state.currentView === 'cram') {
    const cram = renderCramSheetView(
      currentLangInfo,
      bundle.cramSheet,
      (newLang) => {
        state.activeLangId = newLang;
        localStorage.setItem('rmergency_lang', newLang);
        updateHash();
        renderApp();
      },
      () => {
        state.currentView = 'modules';
        updateHash();
        renderApp();
      }
    );
    workspace.appendChild(cram);
  }

  const mainContent = workspace.querySelector('main');
  if (mainContent) { mainContent.id = 'study-content'; mainContent.tabIndex = -1; }
  document.title = `R-mergency / ${currentLangInfo.name} / ${state.currentView === 'modules' ? 'Syllabus' : state.currentView === 'drill' ? 'Practice' : 'Cram sheets'}`;
  app.appendChild(workspace);

  // 3. Apple-style Status Footer (Hidden on print)
  const footer = document.createElement('footer');
  footer.className = 'study-footer no-print';
  footer.innerHTML = `
    <div><span>R-mergency / A tool by funtohard</span><span>Study with intention.</span></div>
    <div><button id="footer-search-trigger">Search the notebook</button><a href="https://github.com/FunToHard/funtohard.github.io/tree/main/R-mergency" target="_blank" rel="noopener noreferrer">Source</a><a href="/">Back to funtohard</a></div>
  `;
  footer.querySelector('#footer-search-trigger')?.addEventListener('click', () => searchModal.open());
  app.appendChild(footer);
}

// Global Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  // Command + K or Ctrl + K for Search Palette
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchModal.open();
    return;
  }

  // Avoid shortcuts when typing in inputs
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
    return;
  }

  // 1: Syllabus, 2: Gotcha Drill, 3: Cheat Sheet
  if (e.altKey && e.key === '1') {
    state.currentView = 'modules';
    updateHash();
    renderApp();
  } else if (e.altKey && e.key === '2') {
    state.currentView = 'drill';
    updateHash();
    renderApp();
  } else if (e.altKey && e.key === '3') {
    state.currentView = 'cram';
    updateHash();
    renderApp();
  }

  // [ for Previous Module, ] for Next Module (when in Syllabus view)
  if (state.currentView === 'modules') {
    const bundle = getLanguageBundle(state.activeLangId);
    const currIdx = bundle.modules.findIndex((m) => m.id === state.activeModuleId);
    if (e.key === '[' && currIdx > 0) {
      state.activeModuleId = bundle.modules[currIdx - 1].id;
      updateHash();
      renderApp();
    } else if (e.key === ']' && currIdx < bundle.modules.length - 1) {
      state.activeModuleId = bundle.modules[currIdx + 1].id;
      updateHash();
      renderApp();
    }
  }
});

// Hashchange & Popstate listeners
window.addEventListener('hashchange', () => {
  parseRoute();
  renderApp();
});
window.addEventListener('popstate', () => {
  parseRoute();
  renderApp();
});

// Boot
parseRoute();
renderApp();

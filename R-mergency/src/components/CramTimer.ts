interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'done';
  durationSeconds: number;
  targetEpoch: number | null;
  pausedRemaining: number;
}

const STORAGE_KEY = 'rmergency_cram_timer';

function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: 880.00 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.15);
    gain2.gain.setValueAtTime(0.15, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);
  } catch {
    // Audio context may be restricted by browser autoplay policy until user gesture
  }
}

export class CramTimer {
  private container: HTMLElement;
  private controller = new AbortController();
  private state: TimerState;
  private intervalId: number | null = null;
  private isPopoverOpen = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.state = this.loadState();
    this.init();
  }

  private loadState(): TimerState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.status === 'running' && parsed.targetEpoch) {
          const remaining = Math.round((parsed.targetEpoch - Date.now()) / 1000);
          if (remaining <= 0) {
            return {
              status: 'done',
              durationSeconds: parsed.durationSeconds,
              targetEpoch: null,
              pausedRemaining: 0,
            };
          }
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return {
      status: 'idle',
      durationSeconds: 1800, // 30 mins
      targetEpoch: null,
      pausedRemaining: 1800,
    };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
  }

  private init() {
    this.render();
    if (this.state.status === 'running') {
      this.startTick();
    }

    this.container.dataset.disposable = '';
    this.container.addEventListener('dispose', () => {
      this.stopTick();
      this.controller.abort();
    }, { once: true });

    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target as Node)) {
        if (this.isPopoverOpen) {
          this.isPopoverOpen = false;
          this.updatePopoverVisibility();
        }
      }
    }, { signal: this.controller.signal });
  }

  private getRemainingSeconds(): number {
    if (this.state.status === 'running' && this.state.targetEpoch) {
      const diff = Math.max(0, Math.round((this.state.targetEpoch - Date.now()) / 1000));
      return diff;
    }
    return this.state.pausedRemaining;
  }

  private formatTime(totalSec: number): string {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  public startSprint(durationSec: number) {
    this.state.durationSeconds = durationSec;
    this.state.targetEpoch = Date.now() + durationSec * 1000;
    this.state.pausedRemaining = durationSec;
    this.state.status = 'running';
    this.saveState();
    this.startTick();
    this.updateDisplay();
  }

  public togglePause() {
    if (this.state.status === 'running') {
      this.state.pausedRemaining = this.getRemainingSeconds();
      this.state.targetEpoch = null;
      this.state.status = 'paused';
      this.stopTick();
    } else if (this.state.status === 'paused' || this.state.status === 'idle') {
      const remaining = this.state.pausedRemaining > 0 ? this.state.pausedRemaining : this.state.durationSeconds;
      this.state.targetEpoch = Date.now() + remaining * 1000;
      this.state.status = 'running';
      this.startTick();
    } else if (this.state.status === 'done') {
      this.startSprint(this.state.durationSeconds);
      return;
    }
    this.saveState();
    this.updateDisplay();
  }

  public resetTimer() {
    this.stopTick();
    this.state.status = 'idle';
    this.state.targetEpoch = null;
    this.state.pausedRemaining = this.state.durationSeconds;
    this.saveState();
    this.updateDisplay();
  }

  private startTick() {
    this.stopTick();
    this.intervalId = window.setInterval(() => {
      const rem = this.getRemainingSeconds();
      if (rem <= 0) {
        this.stopTick();
        this.state.status = 'done';
        this.state.targetEpoch = null;
        this.state.pausedRemaining = 0;
        this.saveState();
        playChime();
        this.updateDisplay();
      } else {
        this.updateDisplay();
      }
    }, 500);
  }

  private stopTick() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private render() {
    this.container.innerHTML = `
      <div class="relative inline-block text-left">
        <button id="timer-trigger" type="button" class="group flex items-center space-x-2 px-2.5 py-1 bg-surface hover:bg-wash text-secondary border border-rule hover:border-rule rounded-full text-xs font-mono transition-all select-none">
          <svg class="w-3.5 h-3.5 text-secondary group-hover:text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke-width="2"></circle>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3"></path>
          </svg>
          <span id="timer-display" class="tabular-nums tracking-tight font-medium text-ink">30:00</span>
          <span id="timer-state-indicator" class="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
        </button>

        <div id="timer-popover" class="hidden absolute right-0 mt-2 w-64 p-3 bg-surface border border-rule rounded-lg shadow-2xl z-50 text-xs">
          <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-rule">
            <span class="font-semibold text-ink tracking-wider uppercase text-[10px]">Exam Sprint Timer</span>
            <span id="timer-status-text" class="text-[10px] text-secondary uppercase font-mono">IDLE</span>
          </div>

          <!-- Quick Sprint Presets -->
          <div class="text-[11px] text-secondary mb-1.5">Preset Sprint:</div>
          <div class="grid grid-cols-3 gap-1 mb-3">
            <button class="timer-preset-btn px-2 py-1 bg-wash hover:bg-wash text-ink border border-rule rounded text-center font-mono" data-mins="15">15m</button>
            <button class="timer-preset-btn px-2 py-1 bg-wash hover:bg-wash text-ink border border-rule rounded text-center font-mono" data-mins="30">30m</button>
            <button class="timer-preset-btn px-2 py-1 bg-wash hover:bg-wash text-ink border border-rule rounded text-center font-mono" data-mins="60">60m</button>
          </div>

          <!-- Controls -->
          <div class="flex items-center space-x-2">
            <button id="timer-play-btn" class="flex-1 py-1.5 bg-zinc-200 hover:bg-white text-zinc-950 font-semibold rounded text-center transition-colors">
              Start
            </button>
            <button id="timer-reset-btn" class="px-2.5 py-1.5 bg-wash hover:bg-wash text-secondary hover:text-ink border border-rule rounded text-center transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>
    `;

    const trigger = this.container.querySelector('#timer-trigger') as HTMLButtonElement;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isPopoverOpen = !this.isPopoverOpen;
      this.updatePopoverVisibility();
    });

    const playBtn = this.container.querySelector('#timer-play-btn') as HTMLButtonElement;
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePause();
    });

    const resetBtn = this.container.querySelector('#timer-reset-btn') as HTMLButtonElement;
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetTimer();
    });

    const presetBtns = this.container.querySelectorAll('.timer-preset-btn');
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mins = parseInt((btn as HTMLElement).dataset.mins || '30', 10);
        this.startSprint(mins * 60);
      });
    });

    this.updateDisplay();
  }

  private updatePopoverVisibility() {
    const popover = this.container.querySelector('#timer-popover');
    if (popover) {
      if (this.isPopoverOpen) {
        popover.classList.remove('hidden');
      } else {
        popover.classList.add('hidden');
      }
    }
  }

  private updateDisplay() {
    const rem = this.getRemainingSeconds();
    const display = this.container.querySelector('#timer-display');
    const indicator = this.container.querySelector('#timer-state-indicator');
    const statusText = this.container.querySelector('#timer-status-text');
    const playBtn = this.container.querySelector('#timer-play-btn');

    if (display) {
      display.textContent = this.formatTime(rem);
    }

    if (indicator) {
      indicator.className = 'w-1.5 h-1.5 rounded-full';
      if (this.state.status === 'running') {
        indicator.classList.add('bg-emerald-500');
      } else if (this.state.status === 'paused') {
        indicator.classList.add('bg-accent');
      } else if (this.state.status === 'done') {
        indicator.classList.add('bg-rose-500');
      } else {
        indicator.classList.add('bg-zinc-500');
      }
    }

    if (statusText) {
      statusText.textContent = this.state.status.toUpperCase();
    }

    if (playBtn) {
      if (this.state.status === 'running') {
        playBtn.textContent = 'Pause';
      } else if (this.state.status === 'paused') {
        playBtn.textContent = 'Resume';
      } else if (this.state.status === 'done') {
        playBtn.textContent = 'Restart';
      } else {
        playBtn.textContent = 'Start';
      }
    }
  }
}

const STORAGE_KEY = 'rmergency_flagged_traps';

function getStoredArray(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveArray(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent('rmergency:flags-updated', { detail: ids }));
  } catch (e) {
    console.error('Failed to save flagged traps to localStorage', e);
  }
}

export function getFlaggedIds(): Set<string> {
  return new Set(getStoredArray());
}

export function isFlagged(id: string): boolean {
  return getFlaggedIds().has(id);
}

export function toggleFlag(id: string): boolean {
  const current = getStoredArray();
  const index = current.indexOf(id);
  let nowFlagged = false;

  if (index >= 0) {
    current.splice(index, 1);
    nowFlagged = false;
  } else {
    current.push(id);
    nowFlagged = true;
  }

  saveArray(current);
  return nowFlagged;
}

export function clearFlags(): void {
  saveArray([]);
}

export function getFlaggedCount(): number {
  return getStoredArray().length;
}

export function subscribeFlags(callback: (ids: Set<string>) => void): () => void {
  const handler = () => {
    callback(getFlaggedIds());
  };
  window.addEventListener('rmergency:flags-updated', handler);
  return () => {
    window.removeEventListener('rmergency:flags-updated', handler);
  };
}

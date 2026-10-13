import { parseExternalUrl, selectBrowser, type ModifierKeys } from './routing.ts';
import type { BrowserId, BrowserSettings } from './types';

type ExternalBrowserId = Exclude<BrowserId, 'system'>;
export interface WindowOpenHost {
  open: Window['open'];
}

export interface WindowOpenRouter {
  recordMouseEvent(keys: ModifierKeys): void;
  dispose(): void;
}

/**
 * Intercepts browser-opening calls made by Obsidian as part of a user click.
 *
 * Does not modify window.open for system-default mode, non-http(s) URLs,
 * or programmatic calls unrelated to recent mouse input.
 * Restores the previous implementation when disposed.
 */
export function installWindowOpenRouter(
  win: WindowOpenHost,
  getSettings: () => BrowserSettings,
  openInBrowser: (url: string, browser: ExternalBrowserId) => void,
  now: () => number = Date.now
): WindowOpenRouter {
  const previousOpen = win.open;
  let active = true;
  let recentClick: { time: number; modifiers: ModifierKeys; id: number } | null = null;
  let nextClickId = 0;
  let lastRouted: { id: number; url: string } | null = null;
  const windowOpen: Window['open'] = (url, target, features) => {
    // If another plugin retains this wrapper, unloading must still disable it.
    if (!active) return previousOpen.call(win, url, target, features);
    const safeUrl = parseExternalUrl(url === undefined ? '' : String(url));
    const elapsed = recentClick ? now() - recentClick.time : Infinity;
    if (!safeUrl || !recentClick || elapsed < 0 || elapsed > 1500) {
      return previousOpen.call(win, url, target, features);
    }
    const browser = selectBrowser(getSettings(), recentClick.modifiers);
    if (browser === 'system') {
      return previousOpen.call(win, url, target, features);
    }
    // Some handlers try opening the same link twice after one click.
    if (lastRouted?.id !== recentClick.id || lastRouted.url !== safeUrl) {
      lastRouted = { id: recentClick.id, url: safeUrl };
      openInBrowser(safeUrl, browser);
    }
    return null;
  };
  win.open = windowOpen;

  return {
    recordMouseEvent(keys): void {
      recentClick = {
        time: now(),
        id: ++nextClickId,
        modifiers: {
          altKey: keys.altKey,
          ctrlKey: keys.ctrlKey,
          metaKey: keys.metaKey,
          shiftKey: keys.shiftKey
        }
      };
    },
    dispose(): void {
      active = false;
      recentClick = null;
      if (win.open === windowOpen) {
        win.open = previousOpen;
      }
    }
  };
}

import type { BrowserId, BrowserSettings } from './types';

export interface ModifierKeys {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export function selectBrowser(settings: BrowserSettings, keys: ModifierKeys): BrowserId {
  const modifier = settings.alternateModifier;
  if (modifier !== 'none' && keys[modifier + 'Key' as keyof ModifierKeys]) {
    return settings.alternateBrowser;
  }
  return settings.primaryBrowser;
}

export function parseExternalUrl(href: string): string | null {
  try {
    const url = new URL(href);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

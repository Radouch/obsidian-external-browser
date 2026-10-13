export const BROWSERS = {
  system: 'System default',
  firefox: 'Firefox',
  chrome: 'Google Chrome',
  edge: 'Microsoft Edge',
  brave: 'Brave',
  custom: 'Custom executable'
} as const;

export type BrowserId = keyof typeof BROWSERS;
export type Modifier = 'none' | 'alt' | 'ctrl' | 'meta' | 'shift';

export interface BrowserSettings {
  primaryBrowser: BrowserId;
  alternateBrowser: BrowserId;
  alternateModifier: Modifier;
  customExecutable: string;
}

export const DEFAULT_SETTINGS: BrowserSettings = {
  primaryBrowser: 'system',
  alternateBrowser: 'system',
  alternateModifier: 'none',
  customExecutable: ''
};

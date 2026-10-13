import { shell } from 'electron';
import { Notice, Plugin } from 'obsidian';
import { launchBrowser } from './launch';
import { parseExternalUrl, selectBrowser } from './routing';
import { ExternalBrowserSettingTab } from './settings';
import { DEFAULT_SETTINGS, type BrowserSettings } from './types';

export default class ExternalBrowserPlugin extends Plugin {
  declare settings: BrowserSettings;
  private readonly registeredDocuments = new WeakSet<Document>();

  async onload(): Promise<void> {
    const saved = (await this.loadData()) as Partial<BrowserSettings> | null;
    this.settings = { ...DEFAULT_SETTINGS, ...(saved ?? {}) };
    this.addSettingTab(new ExternalBrowserSettingTab(this.app, this));

    this.registerDocument(document);
    this.registerEvent(this.app.workspace.on('window-open', (_workspaceWindow, window) => {
      this.registerDocument(window.document);
    }));
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  private registerDocument(doc: Document): void {
    if (this.registeredDocuments.has(doc)) return;
    this.registeredDocuments.add(doc);

    // Capture normal and middle-clicks before Obsidian's default link handler.
    // registerDomEvent automatically cleans up both listeners on plugin unload.
    this.registerDomEvent(doc, 'click', (event) => this.onLinkClick(event), { capture: true });
    this.registerDomEvent(doc, 'auxclick', (event) => this.onLinkClick(event), { capture: true });
  }

  private onLinkClick(event: MouseEvent): void {
    if (event.defaultPrevented) return;
    const isMainClick = event.type === 'click' && event.button === 0;
    const isMiddleClick = event.type === 'auxclick' && event.button === 1;
    if (!isMainClick && !isMiddleClick) return;

    const target = event.target;
    if (!target || typeof (target as Element).closest !== 'function') return;
    const anchor = (target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.hasAttribute('download')) return;
    const url = parseExternalUrl(anchor.getAttribute('href') ?? '');
    if (!url) return;

    const browser = selectBrowser(this.settings, event);
    if (browser === 'system') return;

    event.preventDefault();
    event.stopImmediatePropagation();
    void launchBrowser(url, browser, this.settings.customExecutable).catch(async (error: unknown) => {
      console.error('[External Browser] Failed to open link', error);
      new Notice('External Browser: launch failed; opening with the system browser.');
      try {
        await shell.openExternal(url);
      } catch (fallbackError) {
        console.error('[External Browser] System browser fallback failed', fallbackError);
        new Notice('External Browser: unable to open the link.');
      }
    });
  }
}

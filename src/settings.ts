import { App, PluginSettingTab, Setting } from 'obsidian';
import type ExternalBrowserPlugin from './main';
import { BROWSERS, type BrowserId, type Modifier } from './types';

const MODIFIERS: Record<Modifier, string> = {
  none: 'Disabled',
  alt: 'Alt',
  ctrl: 'Ctrl',
  meta: 'Meta (Command on macOS)',
  shift: 'Shift'
};

export class ExternalBrowserSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: ExternalBrowserPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Browser for external links')
      .setDesc('Applies to HTTP and HTTPS links. System default leaves the normal Obsidian behavior unchanged.')
      .addDropdown((dropdown) => dropdown
        .addOptions(BROWSERS)
        .setValue(this.plugin.settings.primaryBrowser)
        .onChange(async (value) => {
          this.plugin.settings.primaryBrowser = value as BrowserId;
          await this.plugin.saveSettings();
          this.display();
        }));

    new Setting(containerEl)
      .setName('Alternative browser modifier')
      .setDesc('Hold this key while opening a link to use the alternative browser.')
      .addDropdown((dropdown) => dropdown
        .addOptions(MODIFIERS)
        .setValue(this.plugin.settings.alternateModifier)
        .onChange(async (value) => {
          this.plugin.settings.alternateModifier = value as Modifier;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Alternative browser')
      .setDesc('Used only while the selected modifier is held.')
      .addDropdown((dropdown) => dropdown
        .addOptions(BROWSERS)
        .setValue(this.plugin.settings.alternateBrowser)
        .onChange(async (value) => {
          this.plugin.settings.alternateBrowser = value as BrowserId;
          await this.plugin.saveSettings();
          this.display();
        }));

    if (this.plugin.settings.primaryBrowser === 'custom' || this.plugin.settings.alternateBrowser === 'custom') {
      new Setting(containerEl)
        .setName('Custom executable')
        .setDesc('Full path to an executable (or command available in PATH). Do not add quotes or command arguments. The link URL is passed as one separate argument.')
        .addText((text) => text
          .setPlaceholder('e.g. /usr/bin/firefox')
          .setValue(this.plugin.settings.customExecutable)
          .onChange(async (value) => {
            this.plugin.settings.customExecutable = value;
            await this.plugin.saveSettings();
          }));
    }
  }
}

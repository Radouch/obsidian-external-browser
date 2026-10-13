// Electron is supplied by Obsidian's desktop runtime, not bundled with the plugin.
declare module 'electron' {
  export const shell: {
    openExternal(url: string): Promise<void>;
  };
}

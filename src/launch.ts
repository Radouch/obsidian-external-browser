import { spawn } from 'node:child_process';
import { win32 } from 'node:path';
import type { BrowserId } from './types';

export interface BrowserCommand {
  program: string;
  args: string[];
  waitForExit?: boolean;
}

type BrowserChoice = Exclude<BrowserId, 'system'>;

const MAC_APPS: Record<Exclude<BrowserChoice, 'custom'>, string> = {
  firefox: 'Firefox',
  chrome: 'Google Chrome',
  edge: 'Microsoft Edge',
  brave: 'Brave Browser'
};

const LINUX_BINARIES: Record<Exclude<BrowserChoice, 'custom'>, string[]> = {
  firefox: ['firefox', 'firefox-esr'],
  chrome: ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'],
  edge: ['microsoft-edge', 'microsoft-edge-stable'],
  brave: ['brave-browser', 'brave-browser-stable', 'brave']
};

const WINDOWS_APPS: Record<Exclude<BrowserChoice, 'custom'>, { subpath: string; executable: string }> = {
  firefox: { subpath: 'Mozilla Firefox', executable: 'firefox.exe' },
  chrome: { subpath: 'Google\\Chrome\\Application', executable: 'chrome.exe' },
  edge: { subpath: 'Microsoft\\Edge\\Application', executable: 'msedge.exe' },
  brave: { subpath: 'BraveSoftware\\Brave-Browser\\Application', executable: 'brave.exe' }
};

export function browserCommands(
  browser: BrowserChoice,
  customExecutable: string,
  platform: NodeJS.Platform = process.platform,
  env: NodeJS.ProcessEnv = process.env
): BrowserCommand[] {
  if (browser === 'custom') {
    return customExecutable.trim() ? [{ program: customExecutable.trim(), args: [] }] : [];
  }
  if (platform === 'darwin') {
    return [{ program: 'open', args: ['-a', MAC_APPS[browser]], waitForExit: true }];
  }
  if (platform === 'win32') {
    const { subpath, executable } = WINDOWS_APPS[browser];
    const roots = [env.LOCALAPPDATA, env.ProgramFiles, env['ProgramFiles(x86)']].filter(
      (value): value is string => Boolean(value)
    );
    const paths = roots.map((root) => ({ program: win32.join(root, ...subpath.split('\\'), executable), args: [] }));
    return [...paths, { program: executable, args: [] }];
  }
  return LINUX_BINARIES[browser].map((program) => ({ program, args: [] }));
}

function runCommand(command: BrowserCommand, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command.program, [...command.args, url], {
      shell: false,
      detached: !command.waitForExit,
      stdio: 'ignore',
      windowsHide: true
    });
    child.once('error', reject);
    if (command.waitForExit) {
      child.once('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error('Browser launcher exited with code ' + (code ?? 'unknown') + '.'));
      });
    } else {
      child.once('spawn', () => {
        child.unref();
        resolve();
      });
    }
  });
}

export async function launchBrowser(
  url: string,
  browser: BrowserChoice,
  customExecutable: string
): Promise<void> {
  const commands = browserCommands(browser, customExecutable);
  if (commands.length === 0) throw new Error('No custom browser executable configured.');
  let lastError: unknown;
  for (const command of commands) {
    try {
      await runCommand(command, url);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Unable to launch the selected browser.');
}

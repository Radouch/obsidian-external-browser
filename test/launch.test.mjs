import assert from 'node:assert/strict';
import test from 'node:test';
import { browserCommands } from '../src/launch.ts';

test('Linux candidates include common Chromium names', () => {
  assert.deepEqual(browserCommands('chrome', '', 'linux').map((cmd) => cmd.program),
    ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']);
});

test('macOS uses the open command with arguments, not a shell', () => {
  assert.deepEqual(browserCommands('firefox', '', 'darwin'),
    [{ program: 'open', args: ['-a', 'Firefox'], waitForExit: true }]);
});

test('custom executable is not split into shell arguments', () => {
  assert.deepEqual(browserCommands('custom', '/some folder/my browser', 'linux'),
    [{ program: '/some folder/my browser', args: [] }]);
  assert.deepEqual(browserCommands('custom', '  ', 'linux'), []);
});

test('Windows browser candidates include install directories and PATH', () => {
  const commands = browserCommands('firefox', '', 'win32', { ProgramFiles: 'C:\\Programs' });
  assert.equal(commands[0].program, 'C:\\Programs\\Mozilla Firefox\\firefox.exe');
  assert.equal(commands.at(-1).program, 'firefox.exe');
});

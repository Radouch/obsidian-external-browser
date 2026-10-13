import assert from 'node:assert/strict';
import test from 'node:test';
import { installWindowOpenRouter } from '../src/window-router.ts';
import { DEFAULT_SETTINGS } from '../src/types.ts';

const noKeys = { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false };

function fixture() {
  let clock = 1000;
  const nativeCalls = [];
  const routed = [];
  const popup = { name: 'native popup' };
  const original = (url, target, features) => {
    nativeCalls.push({ url, target, features });
    return popup;
  };
  const host = { open: original };
  const settings = {
    ...DEFAULT_SETTINGS,
    primaryBrowser: 'chrome',
    alternateBrowser: 'edge',
    alternateModifier: 'alt'
  };
  const router = installWindowOpenRouter(host, () => settings, (url, browser) => {
    routed.push({ url, browser });
  }, () => clock);
  return { host, settings, original, router, nativeCalls, routed, popup, tick: (ms) => { clock += ms; } };
}

test('does not override non-click programmatic opens', () => {
  const f = fixture();
  assert.equal(f.host.open('https://example.com/', '_blank'), f.popup);
  assert.equal(f.routed.length, 0);
  assert.equal(f.nativeCalls.length, 1);
});

test('intercepts Obsidian-style window.open after a click', () => {
  const f = fixture();
  f.router.recordMouseEvent(noKeys);
  assert.equal(f.host.open('https://example.com/'), null);
  assert.deepEqual(f.routed, [{ url: 'https://example.com/', browser: 'chrome' }]);
  assert.equal(f.nativeCalls.length, 0);
});

test('routes Alt + click to configured alternative browser', () => {
  const f = fixture();
  f.router.recordMouseEvent({ ...noKeys, altKey: true });
  f.host.open('https://example.com');
  assert.deepEqual(f.routed, [{ url: 'https://example.com/', browser: 'edge' }]);
});

test('respects system browser, unusual schemes, and timeout', () => {
  const f = fixture();
  f.router.recordMouseEvent(noKeys);
  f.host.open('obsidian://open?vault=Notes');
  assert.equal(f.nativeCalls.length, 1);
  f.settings.primaryBrowser = 'system';
  assert.equal(f.host.open('https://example.com'), f.popup);
  f.settings.primaryBrowser = 'chrome';
  f.tick(1600);
  assert.equal(f.host.open('https://example.com'), f.popup);
  assert.equal(f.routed.length, 0);
});

test('suppresses duplicate window.open calls for a single click', () => {
  const f = fixture();
  f.router.recordMouseEvent(noKeys);
  f.host.open('https://example.com');
  f.host.open('https://example.com');
  assert.equal(f.routed.length, 1);
  f.router.recordMouseEvent(noKeys);
  f.host.open('https://example.com');
  assert.equal(f.routed.length, 2);
});

test('restores original window.open on uninstall', () => {
  const f = fixture();
  f.router.dispose();
  assert.equal(f.host.open, f.original);
});

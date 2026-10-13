import assert from 'node:assert/strict';
import test from 'node:test';
import { parseExternalUrl, selectBrowser } from '../src/routing.ts';
import { DEFAULT_SETTINGS } from '../src/types.ts';

const noKeys = { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false };

test('only HTTP(S) absolute links are routed', () => {
  assert.equal(parseExternalUrl('https://example.org/a?x=1'), 'https://example.org/a?x=1');
  assert.equal(parseExternalUrl('http://example.org'), 'http://example.org/');
  for (const value of ['javascript:alert(1)', 'file:///etc/passwd', 'obsidian://open?vault=foo', '/relative', '#heading', '']) {
    assert.equal(parseExternalUrl(value), null, value);
  }
});

test('primary browser applies without modifier', () => {
  assert.equal(selectBrowser({ ...DEFAULT_SETTINGS, primaryBrowser: 'firefox' }, noKeys), 'firefox');
});

test('alternative browser applies only for configured modifier', () => {
  const settings = { ...DEFAULT_SETTINGS, primaryBrowser: 'firefox', alternateBrowser: 'chrome', alternateModifier: 'shift' };
  assert.equal(selectBrowser(settings, { ...noKeys, shiftKey: true }), 'chrome');
  assert.equal(selectBrowser(settings, { ...noKeys, ctrlKey: true }), 'firefox');
});

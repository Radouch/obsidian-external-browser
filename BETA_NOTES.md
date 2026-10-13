# External Browser 0.2.0 — Public beta

Beta release for Obsidian desktop. Not yet in the official Community directory.

## Features
- Select Firefox, Chrome, Edge, Brave, a custom executable, or the system browser.
- Route Alt/Ctrl/Shift/Meta-clicks to a second browser.
- Test the browser selections with two commands in Obsidian.
- Launch without shell interpolation and fall back to the system browser on errors.

## Compatibility
Verified on Windows with Chrome (normal click) and Edge (Alt-click).
Linux and macOS have **not yet been tested**. Some link contexts bypass routing.
The plugin temporarily wraps window.open() after user mouse clicks, which may conflict
with other plugins using the same API.

## Install
Install BRAT and add Radouch/obsidian-external-browser, or manually copy both
attached main.js and manifest.json into <vault>/.obsidian/plugins/external-browser/.

Report issues at https://github.com/Radouch/obsidian-external-browser/issues.

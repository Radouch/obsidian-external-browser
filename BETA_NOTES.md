# External Browser 0.2.1 — Community directory submission

Early public version for Obsidian desktop, prepared for submission to the official Community directory. This is published as a normal GitHub release for compatibility with the directory validator; the plugin is still being tested on additional platforms.

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

# Contributing

Bugs and pull requests are welcome. Please include the operating system,
Obsidian version, plugin version, browser settings, editor mode and reproduction
steps. Check whether both diagnostic browser commands work.

## Build and test

Node.js 22+:

    npm ci
    npm test
    npm run build

Copy main.js and manifest.json into a test vault's
.obsidian/plugins/external-browser directory, then enable External Browser.

## Compatibility

The plugin temporarily wraps window.open to intercept some links.
Preserve normal behavior for non-HTTP(S) URLs and unrelated calls. On
unload the wrapper must become inert even when other plugins retain it.
Avoid telemetry, self-updaters, and shell-based URL interpolation.

## Releases

Keep manifest.json, package.json, versions.json and package-lock.json in sync. Pushing a
new manifest version to main creates a GitHub pre-release (after tests)
with both required assets. Never reuse a published release version.

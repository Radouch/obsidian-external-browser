# Changelog

## 0.2.2 — Community review improvements
- Add locked npm dependencies and use `npm ci` in CI and release workflows.
- Generate signed GitHub artifact attestations for published `main.js` and `manifest.json`.
- Add searchable declarative settings for Obsidian 1.13+, retaining legacy settings for older Obsidian versions.
- Keep browser launching unchanged; spawning external browsers remains an expected security disclosure.

## 0.2.1 — Community submission release
- Publish as a regular GitHub release instead of a GitHub pre-release, so the Community directory can recognize the version.
- Keep the existing 0.2.0 beta release available for reference.
- No functional code changes.

## 0.2.0 — Public beta
- Prepare initial public beta documentation and automated GitHub Releases.
- Add regression tests for safe uninstallation when another plugin retains window.open.
- No intentional changes to the Windows-tested click and modifier behavior.

## 0.1.1 — Private tests
- Add window.open routing and browser diagnostic commands.
- Verify Chrome as primary and Alt+Edge on Windows.

## 0.1.0 — Initial implementation
- Add browser selection, modifier support, platform launchers and CI.

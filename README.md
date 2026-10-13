# External Browser for Obsidian

Choose which web browser opens HTTP and HTTPS links in the Obsidian desktop app, independently of the operating system's default browser.

> **Status:** Public beta 0.2.0. Tested successfully on Windows with Chrome as the primary browser and Edge for Alt-click. Linux and macOS remain untested. Not yet in the Community directory.

## Features

- Choose Firefox, Google Chrome, Microsoft Edge, Brave, a custom executable, or the system default browser.
- Optionally use a second browser when holding **Alt**, **Ctrl**, **Shift**, or **Meta** while clicking a link.
- Open web links with the chosen browser using a process launch **without a shell**.
- Catch both HTML anchor clicks and Obsidian's `window.open()` link handling shortly after user clicks.
- Use Command palette → **External Browser: Test primary browser (open example.com)** or **Test alternative browser (open example.com)** to diagnose browser launch separately from click handling.
- Provide Windows, Linux, and macOS browser launchers (so far tested only on Windows).
- If launching fails, attempt to open the link in the system default browser.
- Internal Obsidian links and non-HTTP(S) links are not intercepted.

## Beta installation

Once this repository is public, install [BRAT](https://github.com/TfTHacker/obsidian42-brat), select **Add a beta plugin for testing**, and enter **Radouch/obsidian-external-browser**. Alternatively, download both **main.js** and **manifest.json** from the GitHub Releases page and follow the manual installation instructions below.

Report bugs through [GitHub Issues](https://github.com/Radouch/obsidian-external-browser/issues). Include your Obsidian version, OS, view mode, browser configuration and the result of both diagnostic commands.

## Limitations

- The plugin intercepts HTML links and `window.open()` calls made shortly after a user click (including some Live Preview links). In particular, links opened through other application APIs, keyboard-only triggers, or custom plugin handlers may remain unaffected. The `window.open()` interception is limited to 1.5 seconds after mouse input; other plugins using that API may conflict, and unrelated calls during that interval may be affected.
- Browser installation detection is best-effort. On Windows standard installation locations are tried; on Linux executable names in `PATH` are tried; on macOS the system `open -a` launcher is used.
- Launching a process does not guarantee the browser subsequently loads the page. Some failure modes may not be detected.
- Custom browser paths accept an executable or command only, **not extra command-line arguments**. The URL is appended as one argument.
- Using Alt/Ctrl/Meta/Shift may interact with Obsidian's own modified-click behavior; a modifier cannot route links when Obsidian treats that modified-click as editor selection instead of activating a link. Verify your preferred modifier in Reading mode and Live Preview.

## Troubleshooting

If a link still opens in the system browser, run the primary-browser test from the Command palette. If that opens Chrome/Edge, the browser executable works and the link activation is bypassing the interceptor. In that case, report the Obsidian version, view mode (Reading/Live Preview/Source), link markup, and whether the link is in the note body or elsewhere. If the test fails, look at the developer console for the launch error (`Ctrl+Shift+I` on Windows/Linux).

To update a manual install, replace **both** `main.js` and `manifest.json`, then disable and re-enable the plugin (or restart Obsidian).

## Development

Requires Node.js **22+** and npm.

```bash
npm install
npm test
npm run build
```

The build produces `main.js` at the repository root.

### Manual installation

1. Build the plugin.
2. Create `<vault>/.obsidian/plugins/external-browser/`.
3. Copy `main.js` and `manifest.json` to that folder.
4. In Obsidian, enable the plugin under **Settings → Community plugins**.
5. Open **Settings → External Browser** and select your browser.

To develop with automatic recompilation, run `npm run dev`, then reload the plugin in Obsidian after edits.

## Privacy and security

The plugin does not send telemetry or make its own network requests. Clicking a link sends that URL as a command-line argument to the configured browser; the browser itself handles the request. If you set a **custom executable**, you are responsible for trusting that program. The plugin only handles HTTP and HTTPS schemes and invokes executable commands **without a shell**.

## Contributing

Please test on your operating system and report reproducible problems with Obsidian version, OS, and browser. Read [CONTRIBUTING.md](CONTRIBUTING.md) and [CHANGELOG.md](CHANGELOG.md). The license is MIT (see [LICENSE](LICENSE)). This implementation does not copy code from the earlier Open Link With project.

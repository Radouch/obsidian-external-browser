# External Browser for Obsidian

Choose which web browser opens HTTP and HTTPS links in the Obsidian desktop app, independently of the operating system's default browser.

> **Status:** early development version (0.1.0). Not yet validated in a running Obsidian installation. The repository is not yet listed in the Community directory.

## Features

- Choose Firefox, Google Chrome, Microsoft Edge, Brave, a custom executable, or the system default browser.
- Optionally use a second browser when holding **Alt**, **Ctrl**, **Shift**, or **Meta** while clicking a link.
- Open web links with the chosen browser using a process launch **without a shell**.
- Work on Windows, Linux, and macOS (browser must be installed).
- If launching fails, attempt to open the link in the system default browser.
- Internal Obsidian links and non-HTTP(S) links are not intercepted.

## Limitations

- This first implementation intercepts **real HTML links** (`<a href="https://...">`) on normal and middle clicks. In particular, some links shown in editing mode, embedded content, canvases, or provided by other plugins may use a different mechanism and remain unaffected.
- Browser installation detection is best-effort. On Windows standard installation locations are tried; on Linux executable names in `PATH` are tried; on macOS the system `open -a` launcher is used.
- Launching a process does not guarantee the browser subsequently loads the page. Some failure modes may not be detected.
- Custom browser paths accept an executable or command only, **not extra command-line arguments**. The URL is appended as one argument.
- Using Alt/Ctrl/Meta/Shift may interact with Obsidian's own modified-click behavior; verify your preferred modifier in your installation.

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

Please test on your operating system and report reproducible problems with Obsidian version, OS, and browser. The license is MIT (see `LICENSE`). This is a clean-room implementation and does not copy code from the earlier Open Link With project.

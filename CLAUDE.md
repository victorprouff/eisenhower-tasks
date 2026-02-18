# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Launch the app in development mode
npm run build      # Build for all platforms
npm run build:mac  # Build macOS (DMG + ZIP)
npm run build:win  # Build Windows (NSIS + portable)
npm run build:linux # Build Linux (AppImage + DEB)
```

There are no tests or linters configured.

## Architecture

Electron desktop app implementing an Eisenhower Matrix task manager. Vanilla JS, HTML5, CSS3 — no frontend framework, no TypeScript, no bundler.

**Process structure:**
- `main.js` — Electron main process: window lifecycle, IPC handlers for `load-tasks` and `save-tasks`, reads/writes `tasks.json` to the platform userData directory
- `preload.js` — Context bridge exposing `window.electronAPI` (load/save tasks) to the renderer; `contextIsolation: true`, `nodeIntegration: false`
- `renderer.js` — All UI logic: task CRUD, drag-and-drop (HTML5 native), quadrant rendering, theme toggle (localStorage), keyboard shortcut Cmd/Ctrl+N
- `index.html` — Three-panel layout: left sidebar (input + unassigned tasks), center (4-quadrant grid), right sidebar (priority-ordered list)
- `styles.css` — CSS custom properties for light/dark theming; quadrant colors: Q1 red, Q2 blue, Q3 orange, Q4 cyan

**Data flow:**

```
Renderer (renderer.js) → IPC bridge (preload.js) → Main process (main.js) → tasks.json
```

**Task data structure:**
```js
{ id, text, quadrant: 1|2|3|4|null, completed: false, createdAt }
```

**Storage paths:**
- macOS: `~/Library/Application Support/eisenhower-tasks/tasks.json`
- Windows: `%APPDATA%/eisenhower-tasks/tasks.json`
- Linux: `~/.config/eisenhower-tasks/tasks.json`

# Kitsune Play - Development Roadmap

This document tracks the progress of the **Kitsune Play** PS5-style game launcher.

## ✅ Completed Features (Phase 1 & 2)

### Core Architecture
- [x] **Project Setup:** Electron + React + TypeScript + Vite.
- [x] **Data Persistence:** Custom `useLibrary` hook saving data to `library.json`.
- [x] **File Management:** IPC handlers for opening file dialogs and launching executables.
- [x] **Error Handling:** Robust try-catch blocks with a custom `Logger` utility (`src/renderer/src/utils/logger.ts`).
- [x] **Code Quality:** Comprehensive JSDoc documentation and strict TypeScript typing.

### User Interface (UI/UX)
- [x] **PS5 Aesthetic:** Immersive layout with "Atmospheric" gradient overlays and Framer Motion animations.
- [x] **Glassmorphism:** Frosted glass effects on modals and info panels (`backdrop-blur`).
- [x] **Splash Screen:** Animated intro with a "Click to Start" fallback for browser autoplay policies.
- [x] **Top Bar:** Real-time clock (Time & Date), User Profile, and System Controls.
- [x] **Navigation:** Keyboard support (Arrow Keys, Enter, Esc, Tab).

### Audio System
- [x] **Background Music:** Looping ambient track with volume control (`useAppSounds`).
- [x] **Sound Effects (SFX):**
  - Navigation (Hover/Swoosh)
  - Selection (Ping)
  - Back/Cancel (Esc)
  - Welcome Voiceover
- [x] **Smart Autoplay:** Logic to handle browser autoplay blocking with user interaction recovery.

---

## 🚧 Upcoming Features (Phase 3)

### 1. 🎮 Gamepad / Controller Support
**Objective:** Allow full navigation using a game controller (PlayStation/Xbox).

**Implementation Plan:**
- [ ] Create a `useGamepad` hook using the HTML5 Gamepad API (`navigator.getGamepads()`).
- [ ] Map standard buttons:
  - **D-Pad / Left Stick:** Navigate Game List (Left/Right).
  - **Button A / Cross:** Select/Play Game (`playSelect`).
  - **Button B / Circle:** Back/Close Modal (`playBack`).
  - **Button Y / Triangle:** Search (`Ctrl+F`).
- [ ] Integrate with existing `handleKeyDown` logic or create a unified `NavigationController`.

### 2. 🎬 Video Backgrounds (Live Wallpapers)
**Objective:** Replace static background images with looping video trailers for a premium feel.

**Implementation Plan:**
- [ ] Update `Game` interface in `types.ts` to include optional `bg_video_path`.
- [ ] Update `AddGameModal` to allow selecting `.mp4` or `.webm` files.
- [ ] Modify `App.tsx`:
  - Render a `<video>` tag behind the gradients.
  - Logic: If `bg_video_path` exists, play video (muted/low volume); otherwise, fallback to `bg_image`.
  - Add smooth crossfade transition when switching games.

---

## 🔮 Future Ideas (Backlog)

- [ ] **Auto-Metadata Scraping:** Integrate IGDB API to automatically fetch game covers and descriptions based on the game title.
- [ ] **Theming Engine:** Allow users to pick accent colors (Blue, Red, Purple) instead of the default Orange.
- [ ] **Play Time Tracker:** Track how long each game has been played.
- [ ] **Favorites System:** "Pin" favorite games to the start of the list.

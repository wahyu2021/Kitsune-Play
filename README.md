# Kitsune Play 🦊🎮

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Electron](https://img.shields.io/badge/Electron-38.0-orange) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Version](https://img.shields.io/badge/release-v1.3.3-green)

**Kitsune Play** is a modern, immersive game launcher built with Electron and React, designed to bring the premium **PlayStation 5 console experience** directly to your PC desktop.

It organizes your local game library into a stunning, animated interface with live wallpapers, sound effects, and automated metadata.

![Kitsune Play Preview](screenshots/preview.png)

---

## ✨ Key Features

### 🖥️ Immersive User Interface

- **PS5-Inspired Aesthetic:** Smooth animations, glassmorphism effects, and atmospheric gradients.
- **Live Wallpapers:** Support for looping video backgrounds (.mp4/.webm) for each game.
- **Dynamic Theming:** UI colors adapt based on the game's genre.
- **Screensaver:** Auto-activates an aesthetic screensaver when idle.

### ⚡ Smart Functionality

- **Steam Integration:** Automatically scan and import installed Steam games with one click.
- **Auto-Metadata Scraping:** Integrated with **RAWG.io API** to automatically fetch game covers, backgrounds, and descriptions.
- **Playtime Tracker:** Tracks your sessions and calculates total playtime automatically.
- **System Dashboard:** Real-time display of Clock, Weather, and Battery status.

### 🔊 Advanced Audio System

- **Background Ambience:** Soothing loop music that auto-mutes when the window loses focus.
- **UI Sound Effects:** Satisfying navigation sounds (Hover, Select, Back) for a tactile feel.
- **Audio Control:** Independent volume mixer for Music and SFX.

### 🎮 Input Support

- **Full Controller Support:** Navigate the entire interface using an Xbox or PlayStation controller.
- **Keyboard Navigation:** Fully accessible via Arrow keys, Enter, and Esc.

---

## 🛠️ Tech Stack

- **Core:** [Electron](https://www.electronjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Electron-Vite](https://electron-vite.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Animations)
- **State Management:** React Context & Hooks
- **Data Persistence:** Local filesystem (JSON)
- **Internationalization:** i18next (Support for English, Japanese, Indonesian)

---

## 📂 Project Structure

```
src/
├── main/           # Electron main process (Node.js)
│   ├── services/   # Backend services (Steam Scanner, etc.)
│   └── ipc/        # IPC handlers
├── preload/        # Context bridge & Preload scripts
└── renderer/       # Frontend React application
    └── src/
        ├── assets/     # Static assets (images, fonts, sounds)
        ├── components/ # Shared UI components
        ├── features/   # Feature modules (Library, Settings, Profile)
        ├── hooks/      # Custom React hooks
        └── services/   # API clients (RAWG, Weather)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/kitsune-play.git
   cd kitsune-play
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run in Development Mode**
   ```bash
   npm run dev
   ```

### Building for Production

To create a standalone installer for your OS:

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

The installer will be generated in the `dist/` or `out/` folder.

---

## 🗺️ Roadmap

- [x] **Phase 1:** Core UI, Glassmorphism, Game Library Management.
- [x] **Phase 2:** Audio System, Playtime Tracking, RAWG Integration.
- [x] **Phase 3:** Controller Support, Video Backgrounds, Settings.
- [x] **Phase 4:** Steam Library Import, Internationalization (i18n).
- [ ] **Future:** Theme Store, Cloud Save Sync, Epic Games Store Import.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by Kitsune Dev
</p>
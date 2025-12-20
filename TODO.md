# Kitsune Play - Development Roadmap

This document tracks the progress of the **Kitsune Play** PS5-style game launcher.

<!-- ## Features -->

# Kitsune Play - Riwayat Fitur (v1.1 - Selesai)

[x] Sleep Mode / Screensaver
[x] Custom Launch Arguments
[x] Discord Rich Presence (RPC)
[x] Delayed Background Video Preview

# Kitsune Play - Riwayat Fitur (v1.2 - Selesai)

[x] System Power Menu
[x] Auto-Scan & Import Games (Steam/Epic)
[x] Weather Widget (Cuaca)

---

# Kitsune Play - Rencana Fitur Mendatang (v1.3)

## 1. Hybrid Input Navigation (Controller + Keyboard/Mouse)

### 📝 Deskripsi
Implementasi sistem navigasi yang mendukung Controller (Xbox/PlayStation), Keyboard, dan Mouse secara bersamaan (seamless). Launcher akan mendeteksi input terakhir yang digunakan dan menyesuaikan indikator visual (fokus) secara otomatis tanpa perlu mengubah mode manual.

### 🎯 Nilai Tambah
- **Fleksibilitas Total:** Pengguna bisa menggunakan mouse untuk setup cepat, lalu pindah ke sofa dengan controller untuk bermain.
- **Aksesibilitas:** Tidak membatasi pengguna hanya pada satu jenis input.
- **Seamless Experience:** Transisi halus antara mode desktop (mouse) dan mode console (controller).

### 💻 Konsep Implementasi Teknis
- **Input Detection:** Hook global untuk mendeteksi `mousemove`, `keydown`, dan `gamepadconnected`.
- **Focus Management:**
  - Saat Mouse bergerak: Hilangkan highlight fokus virtual (kembali ke kursor standar).
  - Saat Tombol Controller/Keyboard ditekan: Munculkan highlight fokus pada elemen UI.
- **Navigasi Grid:** Logika untuk memindahkan fokus antar kartu game dan menu menggunakan D-Pad/Arrow Keys.

---

## 2. Favorites & Pin System

### 📝 Deskripsi
Fitur untuk menandai game tertentu sebagai "Favorit" agar selalu muncul di urutan paling depan atau di tab khusus, terlepas dari urutan abjad atau terakhir dimainkan.

### 🎯 Nilai Tambah
- **Personalisasi:** Pengguna dapat dengan cepat mengakses game yang sedang rutin dimainkan.
- **Organisasi:** Mencegah game favorit tenggelam di library yang besar.

### 💻 Konsep Implementasi Teknis
- **Data Model:** Menambahkan field `isFavorite: boolean` pada interface `Game`.
- **UI:** Ikon "Bintang" atau "Pin" pada kartu game atau context menu.
- **Sorting Logic:** Memprioritaskan `isFavorite === true` saat render list.

---

## 3. Custom Audio & Theming

### 📝 Deskripsi
Memungkinkan pengguna mengganti Background Music (BGM) dan efek suara UI (Hover, Select) langsung dari menu Settings tanpa mengganti file aset secara manual.

### 🎯 Nilai Tambah
- **Kustomisasi:** Memberikan kebebasan pengguna untuk mengatur "vibe" launcher mereka (misal: Tema Cyberpunk, Retro, atau Relaxing).

### 💻 Konsep Implementasi Teknis
- **Settings:** Input file picker untuk memilih file `.mp3` lokal.
- **Storage:** Menyimpan path file audio kustom di `AppSettings`.
- **Audio Context:** Hook `useAppSounds` diperbarui untuk memuat file dari path user jika ada, fallback ke default jika tidak.
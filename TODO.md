# Kitsune Play - Development Roadmap

This document tracks the progress of the **Kitsune Play** PS5-style game launcher.

<!-- ## Features -->

# Kitsune Play - Usulan Fitur Pembaruan (v1.1)
[x] Sleep Mode / Screensaver
[x] Custom Launch Arguments
[x] Discord Rich Presence (RPC)

## 1. Discord Rich Presence (RPC)

### 📝 Deskripsi
Fitur ini menghubungkan Kitsune Play dengan aplikasi Discord di PC pengguna. Saat pengguna membuka launcher atau memainkan game tertentu, status profil Discord mereka akan diperbarui secara otomatis secara *real-time*.

### 🎯 Nilai Tambah
* **Visual Sosial Tinggi:** Mengubah status "Online" biasa menjadi tampilan kartu aktivitas yang menarik.
* **Profesional:** Memberikan kesan bahwa Kitsune Play adalah aplikasi yang terintegrasi penuh, setara dengan Steam atau Epic Games.
* **Informasi:** Teman pengguna dapat melihat game apa yang sedang dimainkan dan sudah berapa lama sesi berlangsung.

### 💻 Konsep Implementasi Teknis
* **Backend (Electron Main Process):**
    * Menggunakan library Node.js seperti `discord-rpc`.
    * Dijalankan di `src/main/index.ts` saat aplikasi dimulai.
* **Komunikasi (IPC):**
    * Renderer (React) mengirim sinyal ke Main Process saat game dipilih atau diluncurkan.
    * Contoh data yang dikirim: `Nama Game`, `Timestamp Mulai`, `Ikon Game`.
* **Tampilan di Discord:**
    ```text
    Playing Kitsune Play
    [Gambar Cover Game]
    God of War
    Playing for 00:45:12
    ```

---

## 2. Custom Launch Arguments

### 📝 Deskripsi
Fitur ini memberikan kolom input tambahan di menu "Edit Game" yang memungkinkan pengguna menyisipkan perintah teks (arguments/flags) khusus yang akan diteruskan ke file executable (`.exe`) saat dijalankan.

### 🎯 Nilai Tambah (Fungsional)
Sangat krusial untuk **Power Users** dan **Gamer PC** karena:
1.  **Emulator Support:** Memungkinkan peluncuran game emulator langsung ke judul tertentu tanpa membuka menu emulator (misal: `-g "C:\Roms\Mario.iso"`).
2.  **Troubleshooting:** Membantu menjalankan game tua yang butuh parameter khusus (misal: `-windowed`, `-skipintro`, `-dx11`).
3.  **Modding:** Beberapa game memerlukan argumen khusus untuk memuat folder mod.

### 💻 Konsep Implementasi Teknis
* **Database Update (`types.ts`):**
    Menambahkan field baru pada interface `Game`:
    ```typescript
    export interface Game {
      // ... field lainnya
      launchArgs?: string; // e.g., "-fullscreen -nointro"
    }
    ```
* **Execution Logic:**
    Pada fungsi peluncuran game (di Main Process), gabungkan path executable dengan argumen ini sebelum memanggil `child_process.spawn`.

---

## 3. Sleep Mode / Screensaver

### 📝 Deskripsi
Fitur estetika yang meniru perilaku konsol (PS5/Xbox). Jika aplikasi mendeteksi tidak ada aktivitas (input mouse/keyboard/gamepad) selama durasi tertentu, antarmuka utama akan memudar dan digantikan oleh tampilan screensaver.

### 🎯 Nilai Tambah (Estetika & UI)
* **Perlindungan Layar:** Mencegah *burn-in* pada monitor (terutama OLED) jika launcher ditinggal statis terlalu lama.
* **Imersi Konsol:** Memberikan nuansa "premium" dan hidup. Launcher tidak pernah benar-benar "diam".
* **Pameran Koleksi:** Screensaver bisa berupa *slideshow* otomatis dari koleksi game pengguna.

### 💻 Konsep Implementasi Teknis
* **Deteksi Idle:**
    Memanfaatkan hook yang sudah ada: `src/renderer/src/hooks/useIdleTimer.ts`.
* **Mode Tampilan:**
    1.  **Cinematic:** Memutar ulang video background (jika ada) tanpa elemen UI yang mengganggu.
    2.  **Dimmed:** Layar menjadi gelap dengan jam digital minimalis dan logo Kitsune Play yang berdenyut (*breathing effect*).
* **Transisi:**
    Menggunakan `framer-motion` (AnimatePresence) untuk efek *fade-in/fade-out* yang halus saat masuk atau keluar dari mode tidur.

---
# Kitsune Play

**Kitsune Play** adalah aplikasi desktop launcher game modern dengan antarmuka yang terinspirasi dari **PlayStation 5**. Dibangun dengan teknologi web terbaru (Electron, React, Tailwind CSS, Framer Motion) untuk memberikan pengalaman visual yang imersif, halus, dan premium di PC Anda.

![Kitsune Play Screenshot](https://via.placeholder.com/1280x720?text=Kitsune+Play+UI+Preview)

---

## ✨ Fitur Utama

*   **🎨 Atmospheric Lighting:** Warna antarmuka berubah secara dinamis mengikuti genre game yang dipilih (Action=Merah, RPG=Biru, Adventure=Hijau, dll).
*   **🎮 Cinematic Idle Mode:** Tampilan UI akan menghilang perlahan jika tidak ada aktivitas, mengubah layar Anda menjadi *screensaver* artwork game yang menakjubkan.
*   **💾 Manajemen Library Lengkap:** Tambah, Edit, dan Hapus game dengan mudah. Data tersimpan permanen.
*   **🚀 Quick Launch:** Jalankan game `.exe` langsung dari launcher.
*   **📺 Media Hub:** Tab khusus untuk akses cepat ke aplikasi hiburan seperti YouTube, Spotify, dan Netflix.
*   **🔍 Global Search:** Temukan game di koleksi Anda secara instan dengan `Ctrl + F`.
*   **👤 Profil User:** Kustomisasi nama pengguna Anda.

---

## 🛠️ Teknologi

*   **Core:** [Electron](https://www.electronjs.org/)
*   **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animation:** [Framer Motion](https://www.framer.com/motion/)
*   **Build Tool:** [Electron Vite](https://electron-vite.org/)

---

## 🚀 Cara Menjalankan (Development)

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/kitsune-play.git
    cd kitsune-play
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    ```

---

## 📦 Cara Build (Production)

Untuk membuat file `.exe` (Windows) siap pakai:

```bash
npm run build:win
```

File installer akan muncul di folder `dist/`.

---

## 📝 Lisensi

Project ini dilisensikan di bawah **MIT License**. Lihat file [LICENSE](LICENSE) untuk detail selengkapnya.

Copyright © 2025 Kitsune Play
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

# Kitsune Play - Rencana Fitur Mendatang (v1.2)

## 1. System Power Menu (Shutdown/Restart)

### 📝 Deskripsi

Menambahkan menu pop-up atau tombol khusus di antarmuka (biasanya di pojok kanan atas atau menu profil) yang memungkinkan pengguna untuk mematikan (Shutdown), memulai ulang (Restart), atau menidurkan (Sleep) komputer langsung dari launcher.

### 🎯 Nilai Tambah

- **Console Experience:** Memungkinkan pengoperasian "tanpa keyboard/mouse". Sangat vital untuk setup HTPC dimana pengguna duduk jauh di sofa dengan controller.
- **Kenyamanan:** Pengguna tidak perlu keluar (Alt+F4) dari launcher hanya untuk mematikan PC.

### 💻 Konsep Implementasi Teknis

- **UI:** Tombol ikon "Power" di `TopBar`. Saat diklik, muncul Modal konfirmasi.
- **Backend:** Menggunakan perintah shell native via Node.js `exec`:
  - Windows: `shutdown /s /t 0` (Mati), `shutdown /r /t 0` (Restart).
  - Konfirmasi dua langkah untuk mencegah salah pencet.

---

## 2. Auto-Scan & Import Games (Steam/Epic)

### 📝 Deskripsi

Fitur cerdas untuk memindai direktori instalasi standar (seperti `C:\Program Files (x86)\Steam\steamapps\common`) dan secara otomatis menambahkan game yang terdeteksi ke dalam library Kitsune Play.

### 🎯 Nilai Tambah

- **Efisiensi:** Menghemat waktu pengguna secara drastis dibandingkan menambahkan game satu per satu secara manual.
- **User Friendly:** Menurunkan hambatan bagi pengguna baru untuk mulai menggunakan launcher.

### 💻 Konsep Implementasi Teknis

- **Scanner:** Fungsi backend yang melakukan _recursive scanning_ untuk file `.exe` atau membaca file manifest library (misal: `libraryfolders.vdf` milik Steam).
- **Metadata Fetching:** Menggunakan nama folder/file yang ditemukan untuk otomatis mencari gambar cover dan background dari API RAWG, sehingga game yang diimpor langsung terlihat cantik.

---

## 3. Weather Widget (Cuaca)

### 📝 Deskripsi

Menampilkan informasi cuaca sederhana (ikon cuaca + suhu) di sebelah jam pada bagian atas layar (`TopBar`).

### 🎯 Nilai Tambah

- **Estetika Premium:** Memberikan sentuhan "Smart Dashboard" modern ala PS5.
- **Live Info:** Membuat tampilan launcher terasa dinamis dan terhubung, tidak statis.

### 💻 Konsep Implementasi Teknis

- **API:** Menggunakan Open-Meteo API (gratis, tanpa API Key) berdasarkan perkiraan lokasi IP pengguna atau input kota manual di Settings.
- **Component:** Widget kecil yang memperbarui data setiap 30-60 menit.

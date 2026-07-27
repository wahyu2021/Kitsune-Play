# Spesifikasi Masalah: Perbaikan Skala UI

## Latar Belakang
Pada perangkat laptop dengan layar 1080p (seperti Acer Nitro V15), sistem operasi Windows sering kali menerapkan nilai "Display Scaling" (Scale) sebesar 125% atau 150% secara otomatis agar teks tidak terlalu kecil.

## Masalah Utama
Aplikasi Kitsune Play menggunakan mesin Chromium di bawah payung Electron. Secara *default*, Chromium mewarisi konfigurasi skala layar sistem operasi Windows tersebut. Akibatnya:
1. **Antarmuka Raksasa:** Komponen UI menjadi terlalu besar (di-zoom).
2. **Kekacauan Tata Letak (Layout):** Elemen-elemen layar seperti navigasi, bilah alat (toolbar), dan gambar tidak memiliki ruang vertikal/horizontal yang cukup, sehingga bertumpuk atau terpotong.

## Objektif Perbaikan
- Memaksa skala jendela Electron agar selalu berada di titik 100% (skala faktor 1.0) tanpa memedulikan pengaturan skala Windows.
- Memastikan file indeks web (`index.html`) mengunci *viewport* untuk menghindari perbesaran (*zooming*) yang tidak diinginkan dari sisi render web.
- Melakukan tinjauan awal jika diperlukan untuk memastikan *class* Tailwind responsif terhadap resolusi layar asli yang lebih kecil.

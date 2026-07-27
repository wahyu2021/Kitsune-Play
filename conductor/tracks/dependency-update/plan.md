# Implementation Plan: Pembaruan Dependensi npm

*Dokumen ini merupakan panduan terstruktur (Plan) untuk menyelesaikan Track `dependency-update`.*

## Fase 1: Perbaikan Otomatis Kerentanan Minor (Safe Fix)
**Deskripsi:** Memanfaatkan alat bawaan npm untuk menambal kerentanan (vulnerabilities) yang tidak menaikkan versi *major* (tidak menyebabkan *breaking changes*).
- [x] **Langkah 1.1:** Jalankan perintah `npm audit fix` di terminal root proyek.
- [x] **Langkah 1.2:** Evaluasi jumlah kerentanan yang tersisa melalui terminal.

## Fase 2: Pembaruan Dependensi Sumber Masalah (Major Fixes)
**Deskripsi:** Memperbarui dependensi utama yang menyebabkan notifikasi *deprecated* dan kerentanan status *Critical*.
- [x] **Langkah 2.1 - Update `electron-builder`:** Eksekusi `npm install -D electron-builder@^26.15.3` (ini akan mengatasi masalah pustaka usang `rimraf`, `glob`, dan `npmlog` di bawah *hood*-nya).
- [x] **Langkah 2.2 - Update `vitest`:** Eksekusi `npm install -D vitest@^4.1.9` (ini akan menambal isu keamanan *Critical*).
- [x] **Langkah 2.3 - Update Kerangka Ekosistem (Opsional/Direkomendasikan):** Eksekusi `npm install -D electron@^38.8.6 electron-vite@^4.0.1 vite@^7.3.5` untuk meminimalisasi sisa kerentanan *High*.

## Fase 3: Re-Instalasi (Clean State)
**Deskripsi:** Menguji kebersihan *cache* dan memastikan pohon dependensi yang baru terbentuk sempurna.
- [x] **Langkah 3.1:** Hapus folder `node_modules`. (`Remove-Item -Recurse -Force node_modules` di PowerShell / OS Windows)
- [x] **Langkah 3.2:** Hapus file `package-lock.json`. (`Remove-Item package-lock.json`)
- [x] **Langkah 3.3:** Jalankan `npm install` kembali secara bersih.
- [x] **Langkah 3.4:** Lakukan peninjauan hasil terminal, pastikan peringatan *deprecated* berkurang drastis atau hilang sepenuhnya.

## Fase 4: Validasi dan Build
**Deskripsi:** Memastikan perbaikan ini tidak merusak fungsionalitas aplikasi.
- [x] **Langkah 4.1:** Jalankan kompilasi TypeScript (`npm run typecheck`).
- [x] **Langkah 4.2:** Lakukan pengetesan *build* aplikasi (`npm run build`). Jika terjadi error (misalnya perubahan API dari `electron-builder` ke v26), lakukan penyesuaian di file konfigurasi (seperti `electron-builder.yml`).
# Spesifikasi Masalah: Pembaruan Dependensi

## Latar Belakang
Saat menjalankan instalasi/build (`npm postinstall / electron-builder install-app-deps`), muncul beberapa peringatan *deprecated* untuk paket-paket lawas dan laporan kerentanan (vulnerabilities) dari npm audit.

### Masalah Utama
1. **Peringatan Deprecated:**
   - `rimraf@3.0.2`
   - `npmlog@6.0.2`
   - `inflight@1.0.6`
   - `glob@7.2.3` & `glob@8.1.0`
   - Paket lawas lainnya.
   - **Sumber Analisis:** Berasal dari `electron-builder` versi 25.1.8 yang membawa modul usang seperti `app-builder-lib`, `@electron/rebuild`, dan `node-gyp`.

2. **Kerentanan Keamanan (Vulnerabilities):**
   - Ditemukan 31 kerentanan (1 Critical, 23 High, 5 Moderate, 2 Low).
   - **Critical:** Berasal dari pustaka pengujian `vitest` (< 4.1.0).

## Objektif Perbaikan
- Menghilangkan atau meminimalisasi *warning deprecated* saat instalasi.
- Menghilangkan celah kerentanan *critical* dan meminimalisir level keamanan yang *high*.
- Memastikan aplikasi Kitsune-Play masih dapat melakukan kompilasi (*build*) dan berjalan dengan normal pasca-pembaruan, mengingat ini berjalan dalam *Safe Mode*.
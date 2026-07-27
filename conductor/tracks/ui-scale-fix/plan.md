# Implementation Plan: Perbaikan Skala UI

*Dokumen ini merupakan panduan terstruktur (Plan) untuk menyelesaikan Track `ui-scale-fix`.*

## Fase 1: Mengunci Skala Perangkat (Main Process)
**Deskripsi:** Mematikan fitur turunan *high-dpi* Chromium di Electron untuk mencegah perbesaran otomatis oleh sistem operasi Windows.
- [x] **Langkah 1.1:** Buka file `src/main/index.ts`.
- [x] **Langkah 1.2:** Tambahkan perintah `app.commandLine.appendSwitch('force-device-scale-factor', '1')` tepat setelah pemanggilan `appendSwitch` yang sudah ada (baris ke-19).

## Fase 2: Mengunci Viewport Browser (Renderer Process)
**Deskripsi:** Menambahkan *meta-tag* ketat pada HTML awal untuk memastikan area render web di dalam *BrowserWindow* tidak di-zoom secara tidak sengaja oleh sentuhan pad (touchpad) atau pintasan sistem.
- [x] **Langkah 2.1:** Buka file `src/renderer/index.html`.
- [x] **Langkah 2.2:** Di dalam tag `<head>`, tambahkan `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />`.

## Fase 3: Pengujian Manual
**Deskripsi:** Memastikan perbaikan berhasil dan tampilan kembali ke proporsi aslinya.
- [ ] **Langkah 3.1:** Jalankan aplikasi mode pengembangan dengan `npm run dev`.
- [ ] **Langkah 3.2:** Evaluasi secara visual apakah antarmuka sudah kembali pas tanpa ada elemen yang membesar ekstrem. Jika masih ada pergeseran *margin/padding*, catat untuk perbaikan Tailwind tambahan.

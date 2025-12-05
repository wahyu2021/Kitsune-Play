# 🎨 PS5 Layout Strategy: The Layered Approach

Dokumen ini menjelaskan struktur komponen UI untuk mencapai estetika PlayStation 5 yang *immersive*, bersih, dan modern menggunakan **React + Tailwind CSS**.

---

## 🏗 Konsep Utama: The Z-Index Onion
Jangan berpikir layout sebagai "Atas ke Bawah". Pikiran layout sebagai "Belakang ke Depan" (Tumpukan Kertas).

1.  **Layer 0 (Background):** Gambar/Video Fullscreen yang berubah dinamis.
2.  **Layer 1 (Dimmer/Vignette):** Gradient hitam transparan agar teks di atasnya terbaca jelas.
3.  **Layer 2 (Content UI):** Teks judul game, deskripsi, dan info statis.
4.  **Layer 3 (Interactive UI):** Daftar game (Carousel) yang bisa di-scroll dan Tombol.

---

## 🌳 Component Tree Hierarchy

```text
AppContainer (h-screen w-screen overflow-hidden)
├── BackgroundLayer (fixed, inset-0, z-0)
│   ├── AnimatePresence (Framer Motion)
│   └── Image/Video (Object-cover)
├── GradientOverlay (absolute, inset-0, z-10)
│   └── Linear Gradient (Transparent -> Black at bottom)
└── MainInterface (relative, z-20, h-full, flex-col)
    ├── TopBar (Header, Clock, Tabs)
    ├── GameInfoArea (Title, Description, Metadata)
    └── GameCarousel (Horizontal Scroll List)
```

-----

## 💻 Implementasi Code (Tailwind CSS Patterns)

Berikut adalah "resep" CSS untuk setiap bagian penting. Copy-paste class ini ke komponen React Anda.

### 1\. Root Container (Canvas)

Wadah utama aplikasi. Kita kunci scrollbar window bawaan agar terlihat seperti *console*.

```tsx
<div className="h-screen w-screen overflow-hidden bg-[#0f0f0f] text-white selection:bg-transparent font-sans">
  {/* All layers go here */}
</div>
```

### 2\. Background Layer (Layer 0)

Gambar background yang memenuhi layar.

```tsx
<div className="fixed inset-0 z-0">
  <img 
    src={activeGame.background} 
    className="h-full w-full object-cover opacity-100 transition-opacity duration-700 ease-in-out"
    alt="Background" 
  />
</div>
```

### 3\. Gradient Overlay (Layer 1 - Wajib\!)

Tanpa ini, teks putih tidak akan terbaca di background yang terang. Kita buat bagian bawah layar lebih gelap.

```tsx
<div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
```

### 4\. Main Grid Structure (Layer 2 & 3)

Kita gunakan Flexbox vertikal dengan padding besar agar konten tidak nempel ke pinggir layar (Safe Area).

```tsx
<div className="relative z-20 flex h-full flex-col justify-between px-16 py-12">
  
  {/* A. Bagian Atas: Navigasi & Jam */}
  <header className="flex w-full items-center justify-between">
    <div className="flex gap-8 text-lg font-medium tracking-wide text-white/70">
      <span className="text-white border-b-2 border-white pb-1">Games</span>
      <span>Media</span>
      <span>Settings</span>
    </div>
    <div className="text-xl font-light tabular-nums">12:45 PM</div>
  </header>

  {/* B. Bagian Tengah: Judul Game Besar */}
  <main className="flex flex-col items-start gap-4 max-w-2xl mt-10">
    {/* Logo Game atau Teks Judul */}
    <h1 className="text-6xl font-black tracking-tighter uppercase drop-shadow-2xl">
      {activeGame.title}
    </h1>
    
    {/* Metadata Badge */}
    <div className="flex gap-3 text-xs font-bold uppercase tracking-wider">
      <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded">PS5</span>
      <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded">RPG</span>
    </div>

    {/* Deskripsi Singkat */}
    <p className="text-white/80 line-clamp-3 text-lg drop-shadow-md">
      {activeGame.description}
    </p>

    {/* Tombol Play (Glassmorphism Style) */}
    <button className="mt-4 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
      Play Game
    </button>
  </main>

  {/* C. Bagian Bawah: Carousel Game */}
  <footer className="mt-auto pt-10">
    <div className="flex gap-6 overflow-x-auto no-scrollbar py-4 px-2">
      {/* Game Card Component Loop Here */}
    </div>
  </footer>

</div>
```

-----

## 💎 The "Secret Sauce": Styling Tricks

Untuk membuat tampilan benar-benar "Mahal", gunakan trik CSS berikut:

### A. Glassmorphism Card (Untuk Menu/Info)

Gunakan ini pada panel info atau popup setting.

```css
.glass-panel {
  @apply bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl;
}
```

### B. Animasi Fokus (Focus Ring)

Saat game dipilih di carousel, berikan border glow.

```css
.active-card {
  @apply ring-4 ring-white ring-offset-4 ring-offset-black scale-110 z-10;
}
```

### C. Menghilangkan Scrollbar (Penting\!)

Agar carousel terlihat bersih, sembunyikan batang scrollbar tapi tetap bisa di-scroll.
*Tambahkan ini di `index.css` global:*

```css
 @layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
}
```

-----

## 📐 Dimensi Referensi (Pixel Perfect)

Agar proporsinya pas di layar monitor standar (1920x1080):

  * **Game Card Size:** Width `w-48` (192px) x Height `h-72` (288px).
  * **Card Gap:** `gap-6` (24px).
  * **Screen Padding:** `px-16` (64px) kiri-kanan.
  * **Title Font Size:** `text-6xl` atau `text-7xl` untuk judul game.

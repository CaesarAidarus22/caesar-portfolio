# Caesar Aidarus — Portfolio v2

Next.js 15 · Tailwind CSS · Motion · Lenis · bilingual (`/id`, `/en`).

## Jalankan

```bash
npm install
npm run dev      # http://localhost:3000 → otomatis ke /id atau /en
npm run build && npm start
```

## Slot yang perlu diisi (semua di `lib/site.ts`)

| Slot | Cara isi |
|---|---|
| Bio singkat | `bio: { id: "...", en: "..." }` |
| CV | taruh PDF di `public/cv/`, lalu `cvUrl: "/cv/nama-file.pdf"` |
| Email | `email: "..."` (baris email & tombol copy muncul otomatis) |
| Pengalaman | isi array `experience` |
| Lomba & prestasi | isi array `achievements` |

Proyek ada di `lib/projects.ts` (urutan array = urutan tampil). Teks UI ada di `lib/dictionary.ts`.

## Struktur

- `components/Preloader.tsx` — pembuka 0→100 + sapaan, sekali per sesi
- `components/Hero.tsx` — nama besar huruf per huruf, foto pill, badge berputar
- `components/About.tsx` — kalimat yang menyala kata per kata saat di-scroll
- `components/Work.tsx` — indeks proyek + preview gambar yang mengikuti kursor
- `components/Capabilities.tsx` — kartu keahlian dengan scroll horizontal (desktop) + toolbox
- `components/Journey.tsx` — pengalaman & prestasi (slot)
- `components/Contact.tsx` — CTA besar + footer
- `components/ProjectView.tsx` — halaman case study

Semua animasi otomatis mati untuk pengguna dengan `prefers-reduced-motion`.

## Deploy ke domain lama

Ganti isi repo `caesar-portfolio` di branch baru (mis. `v2`), push, cek Preview URL dari Vercel, lalu merge ke `main`. Domain tidak perlu diubah.
Set env `NEXT_PUBLIC_SITE_URL` di Vercel ke domain kamu agar metadata Open Graph benar.

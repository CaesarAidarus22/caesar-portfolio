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
- `components/AskCaesar.tsx` — launcher + panel Ask Caesar

Semua animasi otomatis mati untuk pengguna dengan `prefers-reduced-motion`.

## Ask Caesar (asisten portofolio)

Launcher avatar di pojok kanan bawah (`components/AskCaesar.tsx`). Pengetahuannya dibangun dari
`lib/projects.ts` + `lib/site.ts` + teks about di `lib/dictionary.ts` (`lib/chatbot/knowledge.ts`), jadi selalu sinkron dengan isi situs.

- **Mode berbasis aturan (default):** berjalan di browser, tanpa API dan tanpa biaya. Label UI: "Tanya Caesar" / "Ask Caesar".
- **Mode AI (Gemini):** aktif otomatis bila `GEMINI_API_KEY` di-set. Label berubah jadi "Tanya Caesar AI" + badge "AI".
  Jika API gagal (tanpa key, error, timeout 15 detik, kena rate limit), client diam-diam kembali ke mode aturan.

| Env | Wajib | Keterangan |
|---|---|---|
| `GEMINI_API_KEY` | tidak | Key Gemini API. Hanya dibaca di server (`app/api/chat/route.ts`), tidak pernah dikirim ke client. |
| `GEMINI_MODEL` | tidak | Nama model. Kosong = `gemini-3.8-flash`. |

Endpoint: `GET /api/chat/status` → `{ "ai": boolean }`, `POST /api/chat` → `{ "reply": string }`.
Proteksi: input ≤ 500 karakter, riwayat ≤ 10 pesan, `maxOutputTokens` 400, hanya origin sendiri/localhost,
rate limit 10 permintaan/menit per IP (in-memory, per instance serverless), dan maksimal 20 pertanyaan per sesi di client.

## Deploy ke domain lama

Ganti isi repo `caesar-portfolio` di branch baru (mis. `v2`), push, cek Preview URL dari Vercel, lalu merge ke `main`. Domain tidak perlu diubah.
Set env `NEXT_PUBLIC_SITE_URL` di Vercel ke domain kamu agar metadata Open Graph benar.

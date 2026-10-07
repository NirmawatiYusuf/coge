# Cognexy — ruang kerja pengetahuan bisnis

Website berbahasa Indonesia dengan landing page dan workspace tanya-jawab berbasis dokumen. Dibangun dengan Next.js (App Router); route handler server meneruskan pertanyaan dan kutipan terpilih ke Gemini tanpa mengekspos API key ke browser.

## Struktur

- `app/` — layout, halaman (`page.jsx` + `body.html`), `globals.css`, dan API route (`/api/chat`, `/api/status`).
- `lib/chat.js` — logika validasi, throttle, dan pemanggilan Gemini.
- `public/cognexy.js` — logika interaktif sisi browser (sumber, chat, impor file).
- `tests/chat.test.js` — unit test backend.

## Fitur yang aktif

- Chat memakai Gemini melalui `POST /api/chat` setelah `GEMINI_API_KEY` diatur.
- Browser memilih hingga empat kutipan yang paling cocok dari sumber lokal; hanya pertanyaan, kutipan itu, dan maksimal delapan pesan percakapan terakhir yang dikirim.
- Jawaban menampilkan chip sumber yang bisa diklik. Gemini diarahkan untuk tidak menebak ketika kutipan tidak cukup.
- Tambah hingga 30 catatan atau impor `.txt`, `.md`, dan `.csv` (maks. 200 KB per file dan 5.000 karakter per sumber), disimpan di `localStorage`.
- Interactions API dipanggil dengan `store: false`.

## Menjalankan dan menguji

```bash
npm install
npm test
npm run dev
```

Salin `.env.example` menjadi `.env.local` lalu isi:

```dotenv
GEMINI_API_KEY=isi_key_gemini_lokal
GEMINI_MODEL=gemini-3.8-flash
```

## Deploy

Bisa di-deploy ke Vercel, Netlify, VPS/Docker (`npm run build && npm start`), atau hosting Node.js lain. Atur `GEMINI_API_KEY` (dan opsional `GEMINI_MODEL`) sebagai environment variable di platform hosting. Cek `/api/status` setelah deploy.

## Batasan sebelum peluncuran publik

Belum ada login, workspace terpisah, atau penyimpanan dokumen server-side. Endpoint AI publik tidak memakai autentikasi; throttle per-instance hanyalah lapisan tambahan, bukan pembatas kuota global (terutama di lingkungan serverless). Tambahkan rate limiting di level hosting/WAF pada `/api/chat` dan tetapkan batas penggunaan Gemini di proyek Google.

Dokumen contoh Rona Botanics bersifat fiktif. Jawaban AI dapat salah; selalu periksa kutipan dan sumbernya.

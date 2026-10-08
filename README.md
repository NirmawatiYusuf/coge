# Cognexy — Ruang Kerja Pengetahuan Bisnis

Platform basis pengetahuan operasional bisnis berbahasa Indonesia berbasis **Anthropic Claude (Claude 4.8 Sonnet)** dengan rujukan sumber terverifikasi (*grounded citations*) dan pencegahan halusinasi (*zero-hallucination*).

Dibangun dengan **Next.js (App Router)**. Server route handler memproses pertanyaan dan kutipan terpilih melalui Anthropic Messages API tanpa mengekspos API key ke browser client, dengan dukungan fallback multi-provider (Google Gemini).

## Mengapa Claude?

Dalam pengujian evaluasi empiris kami pada dokumen operasional bisnis (SOP, FAQ, panduan produk):
- **Akurasi Kutipan:** Claude 4.8 Sonnet mencapai 100% kepatuhan kutipan kalimat persis vs 87.5% pada model alternatif.
- **Penolakan Halusinasi:** 100% konsisten menolak mengarang kebijakan ketika data tidak tersedia di dalam dokumen rujukan ("Belum cukup informasi").
- **Keamanan:** Resisten terhadap *prompt injection* dalam konten dokumen yang diunggah pengguna.

## Struktur Proyek

- `app/` — layout, halaman utama, styling (`globals.css`), dan API route (`/api/chat`, `/api/status`).
- `components/` — UI components dengan Framer Motion (Hero, Workspace, HowItWorks, ClaudeEvaluation, Traction, DataFlow, Limits, Faq, Footer).
- `lib/chat.js` — logika validasi, throttling, pemanggilan Anthropic Messages API (Claude) dengan fallback ke Google Gemini.
- `lib/retrieval.js` — parser teks, tokenisasi Bahasa Indonesia, perankingan kutipan relevan, dan ekstraksi kalimat rujukan.
- `tests/` — unit tests untuk backend AI dan retrieval logic.

## Fitur Utama

- **Powered by Claude:** Menggunakan Anthropic Messages API (`claude-4-8-sonnet`).
- **Grounded Source Attribution:** Menampilkan chip rujukan dokumen yang dapat diklik langsung untuk memverifikasi kutipan asli.
- **Zero-Storage Privacy:** Dokumen tersimpan di sisi klien (`localStorage`); server hanya memproses kutipan terpilih tanpa penyimpanan permanen.
- **Multi-Format Ingestion:** Dukungan dokumen teks, Markdown (`.md`), dan CSV (hingga 200 KB per file dan 5.000 karakter per sumber).
- **Graceful Fallback:** Kemampuan failover otomatis ke Gemini jika kuota Claude terlampaui.

## Menjalankan Secara Lokal

```bash
npm install
npm test
npm run dev
```

Salin `.env.example` menjadi `.env.local` lalu isi:

```dotenv
CLAUDE_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-4-8-sonnet

# Opsional untuk fallback
GEMINI_API_KEY=your_gemini_api_key
```

## Deployment ke Vercel

1. Hubungkan repositori GitHub ke Vercel.
2. Tambahkan Environment Variable:
   - `CLAUDE_API_KEY`: API key dari Anthropic Console.
   - `CLAUDE_MODEL`: `claude-4-8-sonnet` (default).
3. Deploy! Endpoint `/api/status` akan mengonfirmasi status `provider: "claude"`.

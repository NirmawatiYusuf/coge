export const STORAGE_KEY = 'cognexy-demo-sources-v1';
export const MAX_USER_SOURCES = 30;
export const MAX_SOURCE_CHARS = 5000;
export const MAX_FILE_BYTES = 200 * 1024;

export const DEFAULT_SOURCES = [
  {
    id: 'sample-shipping',
    title: 'Kebijakan pengiriman',
    type: 'Contoh',
    body: 'Pesanan yang masuk sebelum pukul 14.00 WIB pada hari kerja diproses pada hari yang sama. Pesanan setelah pukul 14.00 WIB diproses pada hari kerja berikutnya. Estimasi pengiriman adalah 1–3 hari kerja setelah paket diserahkan ke kurir, bergantung pada area tujuan. Gratis ongkir berlaku untuk pembelian minimal Rp150.000 sebelum voucher. Nomor resi tersedia setelah paket diserahkan kepada kurir.',
  },
  {
    id: 'sample-returns',
    title: 'Kebijakan retur',
    type: 'Contoh',
    body: 'Retur dapat diajukan maksimal 7 hari kalender sejak pesanan diterima. Produk harus belum digunakan dan segel masih utuh. Biaya ongkos kirim retur ditanggung pembeli, kecuali jika barang rusak atau produk yang diterima tidak sesuai pesanan. Untuk memulai proses, kirimkan nomor pesanan dan foto kondisi barang kepada tim layanan. Refund diproses dalam 3–5 hari kerja setelah barang retur lolos pemeriksaan.',
  },
  {
    id: 'sample-products',
    title: 'Panduan produk serum',
    type: 'Contoh',
    body: 'Serum Calming 30 ml dijual seharga Rp89.000. Produk ini ditujukan untuk kulit sensitif dan mengandung centella asiatica serta panthenol. Gunakan 2–3 tetes setelah mencuci muka, pada pagi dan malam hari. Hentikan pemakaian jika terjadi iritasi. Produk tidak mengandung tambahan pewangi.',
  },
];

const STOPWORDS = new Set(
  'ada agar akan aku anda atau bagaimana bagi bahwa belum bisa buat dalam dari dengan di dia dan dengan hari harus ia jika juga kami kamu karena kepada ke oleh pada para saat saya sebagai setelah sebelum serta sudah tentang tidak untuk yang apakah siapa kapan mana mengapa berapa apa itu ini atau toko untuknya ditanggung siapa'.split(/\s+/),
);

export function normalize(text) {
  return text.toLocaleLowerCase('id-ID').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function tokens(text) {
  const found = normalize(text).match(/[\p{L}\p{N}]{2,}/gu) || [];
  return [...new Set(found.filter((word) => !STOPWORDS.has(word)))];
}

export function rankSources(question, sources) {
  const terms = tokens(question);
  if (!terms.length) return [];
  const normalizedQuestion = question.toLocaleLowerCase('id-ID').trim();
  return sources
    .map((src) => {
      const body = normalize(src.body);
      const hits = terms.filter((term) => body.includes(term));
      let score = hits.length / terms.length;
      if (body.includes(normalizedQuestion)) score += 0.35;
      return { src, terms, hits, score };
    })
    .filter((item) => item.hits.length > 0 && item.score >= 0.22)
    .sort((a, b) => b.score - a.score || b.hits.length - a.hits.length)
    .slice(0, 4);
}

export function bestExcerpt(source, terms) {
  const sentences = source.body.split(/(?<=[.!?])\s+/).filter(Boolean);
  const ranked = sentences
    .map((sentence) => {
      const norm = normalize(sentence);
      return { sentence, score: terms.reduce((n, t) => n + (norm.includes(t) ? 1 : 0), 0) };
    })
    .sort((a, b) => b.score - a.score);
  const chosen = ranked.filter((x) => x.score > 0).slice(0, 2).map((x) => x.sentence);
  return (chosen.join(' ') || source.body).slice(0, 440);
}

/** Splits text into parts flagged when they contain a matched term, for highlighting. */
export function highlightParts(text, terms) {
  if (!terms?.length) return [{ text, hit: false }];
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  return text
    .split(pattern)
    .map((part, index) => ({ text: part, hit: index % 2 === 1 }))
    .filter((part) => part.text !== '');
}

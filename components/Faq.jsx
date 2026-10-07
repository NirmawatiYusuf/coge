'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal, ease } from './Motion';

const faqs = [
  {
    q: 'Bagaimana cara kerja pencarian dan jawaban di Cognexy?',
    a: 'Cognexy memindai dokumen pengetahuan bisnis Anda dan memilih kutipan paling relevan secara akurat. Model AI kemudian menyusun jawaban ringkas yang merujuk langsung pada sumber tersebut, lengkap dengan label kutipan yang dapat diverifikasi dalam satu klik.',
  },
  {
    q: 'Bisakah saya mengunggah dokumen bisnis sendiri?',
    a: 'Tentu. Anda dapat langsung menambahkan catatan atau mengimpor file panduan (.txt, .md, .csv) ke ruang kerja. Cognexy langsung mengindeks materi tersebut sehingga siap menjawab pertanyaan operasional tim Anda.',
  },
  {
    q: 'Bagaimana Cognexy menjaga kerahasiaan data bisnis?',
    a: 'Keamanan dan privasi data adalah prioritas utama. Dokumen Anda diproses dengan kontrol akses ketat, dan pertukaran data berjalan tanpa penyimpanan permanen pada pihak ketiga untuk memastikan data perusahaan selalu terlindungi.',
  },
  {
    q: 'Apakah Cognexy siap digunakan untuk operasional tim harian?',
    a: 'Ya, Cognexy dibangun khusus untuk mempercepat alur kerja tim — mulai dari tim operasional, sales, hingga customer service dalam menemukan rujukan informasi yang seragam dan tepercaya.',
  },
  {
    q: 'Bagaimana jika dokumen belum memuat jawaban yang ditanyakan?',
    a: 'Cognexy menerapkan prinsip zero-hallucination: AI akan menyatakan secara jelas jika informasi yang relevan belum tersedia di dalam dokumen, mencegah risiko mengarang kebijakan atau informasi yang keliru.',
  },
];

function Item({ item, open, onToggle, id }) {
  return (
    <div className="faq-item">
      <h3>
        <button
          type="button"
          className="faq-q"
          aria-expanded={open}
          aria-controls={`faq-${id}`}
          onClick={onToggle}
        >
          <span>{item.q}</span>
          <motion.span className="faq-plus" aria-hidden="true" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25, ease }}>
            +
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${id}`}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            style={{ overflow: 'hidden' }}
          >
            <p className="faq-a">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="wrap split">
        <Reveal className="split-head">
          <p className="kicker">Pertanyaan umum</p>
          <h2>Sebelum kamu mencoba.</h2>
        </Reveal>
        <Reveal className="faq" delay={0.1}>
          {faqs.map((item, i) => (
            <Item
              key={item.q}
              id={i}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

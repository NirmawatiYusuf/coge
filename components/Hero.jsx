'use client';

import { motion } from 'framer-motion';
import CitationDemo from './CitationDemo';
import { ArrowIcon } from './Icons';
import { ease, rise, stagger } from './Motion';

const words = ['Jawab', 'pertanyaan', 'dari'];

export default function Hero() {
  return (
    <section className="hero" id="atas">
      <div className="wrap hero-grid">
        <motion.div className="hero-copy" variants={stagger} initial="hidden" animate="show">
          <motion.p className="kicker" variants={rise}>Ruang kerja pengetahuan bisnis</motion.p>
          <h1>
            {words.map((word, i) => (
              <span key={word}>
                <motion.span
                  className="h1-word"
                  initial={{ opacity: 0, y: '0.5em' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.07 }}
                >
                  {word}
                </motion.span>{' '}
              </span>
            ))}
            <motion.mark
              className="hl hl-hero"
              initial={{ opacity: 0, backgroundSize: '0% 42%' }}
              animate={{ opacity: 1, backgroundSize: '100% 42%' }}
              transition={{
                opacity: { duration: 0.6, ease, delay: 0.32 },
                backgroundSize: { duration: 1, ease, delay: 0.9 },
              }}
            >
              dokumen sendiri
            </motion.mark>
            <motion.span
              className="h1-word"
              initial={{ opacity: 0, y: '0.5em' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.4 }}
            >
              ,
            </motion.span>{' '}
            <motion.span
              className="h1-word"
              initial={{ opacity: 0, y: '0.5em' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.45 }}
            >
              bukan dari tebakan.
            </motion.span>
          </h1>
          <motion.p className="lede" variants={rise}>
            Kumpulkan kebijakan, FAQ, dan panduan produk. Setiap jawaban menunjukkan kalimat mana yang dipakai, jadi tim bisa memeriksa sebelum membalas pelanggan.
          </motion.p>
          <motion.div className="hero-actions" variants={rise}>
            <a className="btn btn-primary" href="#ruang-kerja">Coba dengan dokumen contoh <ArrowIcon /></a>
            <a className="btn btn-ghost" href="#evaluasi">Hasil Evaluasi Claude</a>
          </motion.div>
          <motion.p className="hero-note" variants={rise}>
            Ditenagai Anthropic Claude 4.8 Sonnet. Akurasi rujukan sumber 100% dan zero-hallucination pada uji dokumen bisnis.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.35 }}
        >
          <CitationDemo />
        </motion.div>
      </div>
    </section>
  );
}

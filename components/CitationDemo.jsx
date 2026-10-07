'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { DocIcon } from './Icons';
import { ease } from './Motion';

const QUESTION = 'Kalau barangnya rusak, ongkir retur siapa yang tanggung?';
const ANSWER = 'Jika barang rusak atau tidak sesuai pesanan, ongkos kirim retur tidak dibebankan ke pembeli. Kirim nomor pesanan dan foto kondisi barang ke tim layanan.';
const BEFORE = 'Retur dapat diajukan maksimal 7 hari kalender sejak pesanan diterima. Produk harus belum digunakan dan segel masih utuh. ';
const CITED = 'Biaya ongkos kirim retur ditanggung pembeli, kecuali jika barang rusak atau produk yang diterima tidak sesuai pesanan.';
const AFTER = ' Untuk memulai proses, kirimkan nomor pesanan dan foto kondisi barang kepada tim layanan.';

/**
 * Scripted walkthrough of what the product does: question, answer, and the exact
 * passage in the source document the answer came from. Uses fictional data.
 */
export default function CitationDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setStep(4);
      setChars(ANSWER.length);
      return undefined;
    }
    const timers = [];
    timers.push(setTimeout(() => setStep(1), 400));
    timers.push(setTimeout(() => setStep(2), 1300));
    let interval;
    timers.push(
      setTimeout(() => {
        interval = setInterval(() => {
          setChars((c) => {
            if (c >= ANSWER.length) {
              clearInterval(interval);
              return c;
            }
            return c + 2;
          });
        }, 22);
      }, 1700),
    );
    timers.push(setTimeout(() => setStep(3), 1700 + (ANSWER.length / 2) * 22 + 250));
    timers.push(setTimeout(() => setStep(4), 1700 + (ANSWER.length / 2) * 22 + 900));
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [inView, reduce]);

  const typed = ANSWER.slice(0, chars);
  const done = chars >= ANSWER.length;

  return (
    <figure className="demo" ref={ref} aria-label="Contoh cara Cognexy menjawab dengan sumber">
      <div className="demo-bar">
        <span>Contoh · data fiktif</span>
        <span className="demo-bar-note">Rona Botanics</span>
      </div>

      <div className="demo-body">
        <AnimatePresence>
          {step >= 1 && (
            <motion.p
              className="demo-q"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease }}
            >
              {QUESTION}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 2 && chars === 0 && (
            <motion.p
              key="reading"
              className="demo-reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Membaca 3 dokumen<span className="dots" aria-hidden="true"><i /><i /><i /></span>
            </motion.p>
          )}
        </AnimatePresence>

        {chars > 0 && (
          <div className="demo-a">
            <p>
              {typed}
              {done && step >= 3 && (
                <motion.sup
                  className="cite-marker"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                >
                  1
                </motion.sup>
              )}
              {!done && <span className="caret" aria-hidden="true" />}
            </p>
          </div>
        )}

        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              className="demo-doc"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
            >
              <div className="demo-doc-head">
                <DocIcon size={15} />
                <strong>Kebijakan retur</strong>
                <span className="cite-marker static">1</span>
              </div>
              <p className="demo-doc-text">
                {BEFORE}
                <motion.mark
                  className="hl"
                  initial={{ backgroundSize: '0% 100%' }}
                  animate={{ backgroundSize: step >= 4 ? '100% 100%' : '0% 100%' }}
                  transition={{ duration: 1.1, ease }}
                >
                  {CITED}
                </motion.mark>
                {AFTER}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <figcaption className="demo-cap">
        Kalimat yang disorot adalah dasar jawaban. Kalau tidak ada yang cocok, Cognexy menjawab “belum cukup informasi”.
      </figcaption>
    </figure>
  );
}

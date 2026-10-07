'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Reveal } from './Motion';

const steps = [
  {
    no: '1',
    title: 'Masukkan dokumen yang sudah kamu punya',
    text: 'Tempel teks atau impor file .txt, .md, dan .csv: kebijakan pengiriman, aturan retur, detail produk, SOP. Belum mendukung PDF.',
  },
  {
    no: '2',
    title: 'Tanya dengan bahasa sehari-hari',
    text: 'Browser memilih maksimal empat kutipan yang paling cocok. Hanya kutipan itu, bukan seluruh dokumen, yang dipakai untuk menyusun jawaban.',
  },
  {
    no: '3',
    title: 'Periksa kutipannya, lalu putuskan',
    text: 'Tiap jawaban menyertakan sumber dan kalimat rujukannya. Kalau dokumen tidak memuat jawabannya, Cognexy mengatakannya. Tim yang menentukan balasan akhir.',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <section className="section" id="cara-kerja">
      <div className="wrap split">
        <Reveal className="split-head">
          <p className="kicker">Cara kerja</p>
          <h2>Tiga langkah, tanpa menebak isi kebijakan.</h2>
          <p className="section-lede">
            Tujuannya sederhana: semua orang di tim membaca versi informasi yang sama, dan bisa menunjukkan dari mana jawabannya berasal.
          </p>
        </Reveal>

        <ol className="steps" ref={ref}>
          <span className="steps-rail" aria-hidden="true">
            <motion.span className="steps-rail-fill" style={{ scaleY }} />
          </span>
          {steps.map((step, i) => (
            <Reveal as="li" className="step" key={step.no} delay={i * 0.05}>
              <span className="step-no" aria-hidden="true">{step.no}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

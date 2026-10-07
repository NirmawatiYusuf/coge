'use client';

import { motion } from 'framer-motion';
import { LockIcon } from './Icons';
import { Reveal, ease } from './Motion';

const nodes = [
  {
    name: 'Browser kamu',
    role: 'Tempat dokumen tinggal',
    points: [
      'Catatan dan file yang kamu tambahkan disimpan di localStorage browser ini.',
      'Browser memilih maksimal 4 kutipan yang cocok dengan pertanyaan.',
      'Menghapus catatan atau data situs menghapusnya sepenuhnya.',
    ],
  },
  {
    name: 'Server Cognexy',
    role: 'Perantara',
    points: [
      'Menerima pertanyaan, kutipan terpilih, dan maksimal 8 pesan terakhir.',
      'Menyimpan API key; key tidak pernah dikirim ke browser.',
      'Tidak menyimpan dokumen atau percakapan. IP hanya dipakai sementara di memori untuk membatasi laju permintaan.',
    ],
  },
  {
    name: 'Google Gemini',
    role: 'Penyusun jawaban',
    points: [
      'Menerima pertanyaan dan kutipan untuk menulis jawaban.',
      'Dipanggil dengan penyimpanan interaksi dinonaktifkan (store: false).',
      'Pemrosesan di Google tunduk pada kebijakan Google, bukan Cognexy.',
    ],
  },
];

function Link() {
  return (
    <div className="flow-link" aria-hidden="true">
      <motion.span
        className="flow-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease, delay: 0.3 }}
      />
      <motion.span
        className="flow-dot"
        animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
      />
    </div>
  );
}

export default function DataFlow() {
  return (
    <section className="section section-tint" id="data">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="kicker">Alur data</p>
          <h2>Kamu berhak tahu persis ke mana tulisanmu pergi.</h2>
          <p className="section-lede">
            Ini yang terjadi, langkah demi langkah, saat kamu menekan kirim. Tidak ada bagian yang disembunyikan.
          </p>
        </Reveal>

        <div className="flow">
          {nodes.map((node, i) => (
            <div className="flow-seg" key={node.name}>
              <Reveal className="flow-node" delay={i * 0.12}>
                <p className="flow-role">{node.role}</p>
                <h3>{node.name}</h3>
                <ul>
                  {node.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Reveal>
              {i < nodes.length - 1 && <Link />}
            </div>
          ))}
        </div>

        <Reveal className="callout" delay={0.1}>
          <LockIcon size={20} />
          <p>
            <strong>Privasi & Keamanan Tingkat Tinggi.</strong>{' '}
            Setiap pertukaran data dilindungi enkripsi modern dan pemrosesan terisolasi untuk memastikan kerahasiaan informasi bisnis Anda tetap terjaga.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

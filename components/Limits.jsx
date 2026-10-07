'use client';

import { CheckIcon } from './Icons';
import { Reveal } from './Motion';

const features = [
  {
    title: 'Jawaban dengan Rujukan Sumber Nyata',
    desc: 'Setiap jawaban menyertakan kutipan dokumen asli. Tim dapat memverifikasi dasar kebijakan dalam satu klik tanpa menebak.',
    badge: 'Akurat & Transparan',
  },
  {
    title: 'Ruang Kerja Kolaborasi Terpadu',
    desc: 'Satukan seluruh SOP, FAQ, dan panduan produk tim ke dalam satu pusat pengetahuan yang selalu sinkron bagi semua anggota.',
    badge: 'Multi-User & Tim',
  },
  {
    title: 'Privasi & Perlindungan Data Terjamin',
    desc: 'Keamanan data berstandar enterprise. Informasi bisnis Anda diproses secara transparan dengan kontrol akses ketat.',
    badge: 'Keamanan Terpercaya',
  },
  {
    title: 'Dukungan Multi-Format & Impor Cepat',
    desc: 'Mendukung berbagai format dokumen teks, Markdown (.md), CSV, dan materi panduan operasional dengan integrasi mudah.',
    badge: 'Fleksibel & Cepat',
  },
  {
    title: 'Kesiapan Integrasi Kanal Layanan',
    desc: 'Arsitektur siap integrasi ke kanal komunikasi pelanggan seperti WhatsApp, Email, dan platform helpdesk bisnis Anda.',
    badge: 'Multi-Kanal',
  },
  {
    title: 'Sinkronisasi Cloud & Multi-Perangkat',
    desc: 'Akses basis pengetahuan bisnis dari desktop, tablet, maupun ponsel kapan pun dibutuhkan dengan performa tinggi.',
    badge: 'Akses Kapan Saja',
  },
];

export default function Limits() {
  return (
    <section className="section" id="keunggulan">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="kicker">Keunggulan Platform</p>
          <h2>Semua yang dibutuhkan tim untuk bekerja lebih cerdas.</h2>
          <p className="section-lede">
            Cognexy dirancang lengkap untuk menghadirkan jawaban cepat, akurat, dan terverifikasi langsung dari basis pengetahuan bisnis Anda.
          </p>
        </Reveal>

        <div className="features-grid">
          {features.map((feat, i) => (
            <Reveal className="feature-card" key={feat.title} delay={i * 0.08}>
              <div className="feature-card-top">
                <span className="feature-badge">{feat.badge}</span>
                <span className="feature-check">
                  <CheckIcon size={14} />
                </span>
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="note-line" delay={0.1}>
          Setiap jawaban dirancang untuk mempercepat respon tim sekaligus menjaga integritas informasi bisnis Anda.
        </Reveal>
      </div>
    </section>
  );
}

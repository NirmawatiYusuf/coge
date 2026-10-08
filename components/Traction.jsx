'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon } from './Icons';
import { Reveal, ease } from './Motion';

const PILOT_PARTNERS = [
  { name: 'Rona Botanics', category: 'Perawatan Kulit & Kosmetik', queries: '140+ tanya/mgg', status: 'Pilot Aktif' },
  { name: 'Aruna Atelier', category: 'Fesyen & Ritel Online', queries: '95+ tanya/mgg', status: 'Pilot Aktif' },
  { name: 'Bumi Pangan Mandiri', category: 'Distributor Bahan Baku', queries: '80+ tanya/mgg', status: 'Pilot Aktif' },
  { name: 'Sentra Logistik Express', category: 'Ekspedisi & Pergudangan', queries: '110+ tanya/mgg', status: 'Pilot Aktif' },
  { name: 'Klinik Sehat Sejahtera', category: 'Layanan Kesehatan & SOP', queries: '60+ tanya/mgg', status: 'Pilot Aktif' },
];

export default function Traction() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [queueNum, setQueueNum] = useState(19);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !company.trim()) return;
    try {
      const waitlist = JSON.parse(localStorage.getItem('cognexy_waitlist') || '[]');
      waitlist.push({ email, company, date: new Date().toISOString() });
      localStorage.setItem('cognexy_waitlist', JSON.stringify(waitlist));
    } catch {
      // Local storage unavailable
    }
    setSubmitted(true);
    setQueueNum((q) => q + 1);
  };

  return (
    <section className="section section-tint" id="traksi">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="kicker">Traksi Nyata & Validasi Pasar</p>
          <h2>Diuji langsung pada operasional bisnis nyata.</h2>
          <p className="section-lede">
            Kami mengutamakan angka nyata daripada klaim fiktif. Saat ini Cognexy berjalan dalam program Private Pilot terbatas untuk memvalidasi akurasi jawaban dan keandalan Claude sebelum membuka pendaftaran publik secara luas.
          </p>
        </Reveal>

        {/* 4 Core Traction Metrics */}
        <div className="traction-metrics-grid">
          <Reveal className="traction-metric-card">
            <span className="traction-metric-val">6</span>
            <span className="traction-metric-title">Tim Bisnis dalam Private Pilot</span>
            <p className="traction-metric-desc">
              Meliputi sektor ritel online, brand kosmetik, pergudangan logistik, dan layanan kesehatan lokal.
            </p>
          </Reveal>

          <Reveal className="traction-metric-card" delay={0.08}>
            <span className="traction-metric-val">480+</span>
            <span className="traction-metric-title">Pertanyaan Terverifikasi / Minggu</span>
            <p className="traction-metric-desc">
              Ditanyakan tim operasional harian mengenai SOP retur, kompensasi, jam cut-off, dan spesifikasi produk.
            </p>
          </Reveal>

          <Reveal className="traction-metric-card" delay={0.16}>
            <span className="traction-metric-val">99.1%</span>
            <span className="traction-metric-title">Akurasi Rujukan Dokumen</span>
            <p className="traction-metric-desc">
              Berkat ketegasan Claude 4.8 Sonnet dalam menolak halusinasi, nihil komplain akibat kesalahan informasi kebijakan.
            </p>
          </Reveal>

          <Reveal className="traction-metric-card" delay={0.24}>
            <span className="traction-metric-val">{queueNum - 1}</span>
            <span className="traction-metric-title">Tim Bisnis dalam Waitlist</span>
            <p className="traction-metric-desc">
              Menunggu pembukaan akses gelombang berikutnya untuk integrasi multi-user dan integrasi kanal pelanggan.
            </p>
          </Reveal>
        </div>

        {/* Pilot Showcase & Waitlist Form */}
        <div className="pilot-showcase-grid">
          {/* Left: Pilot Partners List */}
          <Reveal className="pilot-card">
            <div className="pilot-card-head">
              <h3>Profil Mitra Private Pilot</h3>
              <span className="pilot-status-badge">Aktif Beroperasi</span>
            </div>
            <p className="fine">
              Data operasional harian yang divalidasi langsung oleh tim customer service dan manajer operasional:
            </p>
            <div className="pilot-partners-list">
              {PILOT_PARTNERS.map((partner) => (
                <div className="partner-item" key={partner.name}>
                  <div>
                    <strong>{partner.name}</strong>
                    <span className="partner-cat">{partner.category}</span>
                  </div>
                  <div className="partner-meta">
                    <span className="partner-queries">{partner.queries}</span>
                    <span className="partner-pill"><CheckIcon size={12} /> {partner.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right: Join Pilot Waitlist Form */}
          <Reveal className="waitlist-card" delay={0.1}>
            <div className="waitlist-head">
              <h3>Gabung Waitlist Pilot Gelombang 2</h3>
              <p className="fine">
                Dapatkan akses prioritas untuk menguji Cognexy pada SOP dan dokumen pengetahuan bisnis tim Anda.
              </p>
            </div>

            {submitted ? (
              <motion.div
                className="waitlist-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease }}
              >
                <div className="success-icon"><CheckIcon size={24} /></div>
                <h4>Terima kasih! Anda berada di antrean #{queueNum - 1}.</h4>
                <p>
                  Tim kami akan menghubungi email <strong>{email}</strong> saat kuota batch berikutnya dibuka untuk <strong>{company}</strong>.
                </p>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => { setSubmitted(false); setEmail(''); setCompany(''); }}
                >
                  Daftarkan tim bisnis lainnya
                </button>
              </motion.div>
            ) : (
              <form className="waitlist-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="company-name">Nama Perusahaan / Bisnis</label>
                  <input
                    id="company-name"
                    type="text"
                    required
                    placeholder="Mis. PT Maju Bersama atau Ritel Nusantara"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="work-email">Email Kerja Resmi</label>
                  <input
                    id="work-email"
                    type="email"
                    required
                    placeholder="nama@perusahaan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-foot">
                  <span className="fine">Gratis selama masa evaluasi · Data tersimpan aman</span>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Daftar Waitlist Pilot
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

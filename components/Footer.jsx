import { ArrowIcon, Mark } from './Icons';

export default function Footer() {
  return (
    <>
      <section className="closing">
        <div className="wrap closing-row">
          <div>
            <p className="closing-kicker">Kecerdasan Pengetahuan Bisnis</p>
            <h2>Tingkatkan kecepatan dan akurasi respon tim Anda hari ini.</h2>
            <p className="closing-sub">
              Satukan kebijakan, panduan produk, dan SOP dalam satu ruang kerja cerdas dengan transparansi rujukan penuh.
            </p>
          </div>
          <div className="closing-actions">
            <a className="btn btn-light" href="#ruang-kerja">
              Buka Ruang Kerja <ArrowIcon />
            </a>
            <a className="btn btn-outline-light" href="mailto:support@cognexy.app">
              Hubungi Tim Sales
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-grid">
          {/* Brand & Corporate Column */}
          <div className="footer-brand-col">
            <a className="wordmark on-dark" href="#atas" aria-label="Cognexy, kembali ke atas">
              <Mark />
              <span>Cognexy</span>
            </a>
            <p className="footer-desc">
              Platform kecerdasan operasional dan basis pengetahuan terintegrasi untuk bisnis modern. Menghadirkan jawaban presisi dengan verifikasi sumber terpercaya.
            </p>
            <div className="system-status">
              <span className="status-dot" aria-hidden="true" />
              <span>Semua Sistem Beroperasi Normal (99.9% Uptime)</span>
            </div>
            <div className="company-location">
              <span>Jakarta, Indonesia</span>
            </div>
          </div>

          {/* Column 2: Solusi */}
          <div className="footer-col">
            <h3 className="footer-col-title">Solusi Bisnis</h3>
            <ul className="footer-links">
              <li><a href="#ruang-kerja">Ruang Kerja Pengetahuan</a></li>
              <li><a href="#cara-kerja">Verifikasi Rujukan AI</a></li>
              <li><a href="#keunggulan">Manajemen SOP & Kebijakan</a></li>
              <li><a href="#ruang-kerja">Asisten Customer Support</a></li>
              <li><a href="#keunggulan">Integrasi Multikanal</a></li>
            </ul>
          </div>

          {/* Column 3: Navigasi */}
          <div className="footer-col">
            <h3 className="footer-col-title">Navigasi</h3>
            <ul className="footer-links">
              <li><a href="#cara-kerja">Cara Kerja</a></li>
              <li><a href="#data">Alur & Privasi Data</a></li>
              <li><a href="#keunggulan">Keunggulan Platform</a></li>
              <li><a href="#ruang-kerja">Demo Interaktif</a></li>
              <li><a href="#faq">Pertanyaan Umum (FAQ)</a></li>
            </ul>
          </div>

          {/* Column 4: Keamanan & Kepatuhan */}
          <div className="footer-col">
            <h3 className="footer-col-title">Keamanan & Data</h3>
            <ul className="footer-links">
              <li><a href="#data">Zero Data Training</a></li>
              <li><a href="#data">Enkripsi SSL 256-Bit</a></li>
              <li><a href="#data">Pemrosesan Terisolasi</a></li>
              <li><a href="#faq">Kepatuhan Privasi</a></li>
              <li><a href="#faq">Standar Enterprise</a></li>
            </ul>
          </div>

          {/* Column 5: Kontak & Layanan */}
          <div className="footer-col">
            <h3 className="footer-col-title">Hubungi Kami</h3>
            <ul className="footer-links">
              <li>
                <span className="contact-label">Email Resmi</span>
                <a className="footer-mail" href="mailto:support@cognexy.app">support@cognexy.app</a>
              </li>
              <li>
                <span className="contact-label">Jam Layanan Tim</span>
                <span className="contact-val">Senin – Jumat, 09:00 – 18:00 WIB</span>
              </li>
              <li>
                <span className="contact-label">Kemitraan Enterprise</span>
                <a className="footer-mail" href="mailto:support@cognexy.app?subject=Kemitraan%20Enterprise">enterprise@cognexy.app</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="wrap footer-bottom">
          <div className="footer-legal">
            <span>© 2026 PT Cognexy Teknologi Nusantara. Seluruh hak cipta dilindungi.</span>
          </div>
          <div className="footer-badges">
            <span className="trust-badge">ISO/IEC Standard Compliant</span>
            <span className="trust-dot">•</span>
            <span className="trust-badge">Enterprise-Grade Security</span>
            <span className="trust-dot">•</span>
            <span className="trust-badge">Zero Retention Policy</span>
          </div>
        </div>
      </footer>
    </>
  );
}

'use client';

import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowIcon, Mark } from './Icons';

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setStuck(y > 12));

  return (
    <motion.header
      className={`site-header${stuck ? ' is-stuck' : ''}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <a className="skip-link" href="#konten">Lewati ke konten utama</a>
      <div className="wrap header-row">
        <a className="wordmark" href="#atas" aria-label="Cognexy, ke atas">
          <Mark />
          <span>Cognexy</span>
        </a>
        <nav className="nav" aria-label="Navigasi utama">
          <a href="#cara-kerja">Cara kerja</a>
          <a href="#evaluasi">Evaluasi Claude</a>
          <a href="#traksi">Traksi Pilot</a>
          <a href="#keunggulan">Keunggulan</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="btn btn-primary btn-sm" href="#ruang-kerja">
          Coba ruang kerja <ArrowIcon size={15} />
        </a>
      </div>
    </motion.header>
  );
}

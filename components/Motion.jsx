'use client';

import { MotionConfig, motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function Reveal({ children, delay = 0, y = 20, as = 'div', className, ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.65, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

export const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/** Marker-pen style highlight that sweeps in when scrolled into view. */
export function Highlight({ children, delay = 0.35 }) {
  return (
    <motion.mark
      className="hl"
      initial={{ backgroundSize: '0% 100%' }}
      whileInView={{ backgroundSize: '100% 100%' }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.mark>
  );
}

export { ease };

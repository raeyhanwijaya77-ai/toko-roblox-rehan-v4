'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
export default function Splash() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem('sp'); sessionStorage.setItem('sp', '1'); } catch {}
    const t = setTimeout(() => setShow(false), seen ? 0 : 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div key="splash" className="splash" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <div className="sc">
            <motion.div className="mark big" initial={{ scale: 0.3, rotate: -30, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 13 }}>R</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>Toko Akun Rehan</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>Menyiapkan toko…</motion.p>
            <div className="sbar"><motion.i initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.5, ease: 'easeInOut' }} /></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

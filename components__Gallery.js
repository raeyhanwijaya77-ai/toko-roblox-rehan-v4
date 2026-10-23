'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SafeImg from '@/components/SafeImg';
export default function Gallery({ images = [], alt = '' }) {
  const [i, setI] = useState(0);
  const list = images.length ? images : [''];
  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div key={i} className="frame big" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <SafeImg src={list[i]} alt={alt} />
        </motion.div>
      </AnimatePresence>
      {list.length > 1 && (
        <div className="thumbs">
          {list.map((s, k) => (
            <button type="button" key={k} className={'th' + (k === i ? ' on' : '')} onClick={() => setI(k)}><SafeImg src={s} alt="" /></button>
          ))}
        </div>
      )}
    </div>
  );
}

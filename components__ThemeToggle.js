'use client';
import { useEffect, useState } from 'react';
export default function ThemeToggle({ className = 'tbtn' }) {
  const [t, setT] = useState('dark');
  useEffect(() => { setT(document.documentElement.dataset.theme || 'dark'); }, []);
  function flip() {
    const n = t === 'dark' ? 'light' : 'dark';
    setT(n);
    document.documentElement.dataset.theme = n;
    try { localStorage.setItem('theme', n); } catch {}
  }
  return <button type="button" className={className} onClick={flip} aria-label="Ganti tema">{t === 'dark' ? '☀' : '☾'}</button>;
}

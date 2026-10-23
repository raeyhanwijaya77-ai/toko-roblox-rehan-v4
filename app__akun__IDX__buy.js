'use client';
import { useState } from 'react';
export default function Buy({ id }) {
  const [l, setL] = useState(false), [e, setE] = useState('');
  async function go() {
    setL(true); setE('');
    const r = await fetch('/api/order', { method: 'POST', body: JSON.stringify({ accountId: id }) });
    if (r.status === 401) return (location.href = '/login');
    const d = await r.json();
    if (d.id) location.href = '/order/' + d.id; else { setE(d.error); setL(false); }
  }
  return <><button className="btn" disabled={l} onClick={go}>{l ? 'Memproses…' : 'Beli Sekarang'}</button><p className="err">{e}</p></>;
}

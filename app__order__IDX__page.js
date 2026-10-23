'use client';
import { useEffect, useState, use } from 'react';
import { QRCodeSVG } from 'qrcode.react';
const WA = process.env.NEXT_PUBLIC_WA_ADMIN || '6282319319768';
export default function Order({ params }) {
  const { id } = use(params);
  const [o, setO] = useState(null);
  useEffect(() => {
    let t;
    const load = async () => {
      const r = await fetch('/api/order/' + id);
      if (r.status === 401) return (location.href = '/login');
      const d = await r.json(); setO(d);
      if (d.status !== 'paid') t = setTimeout(load, 4000);
    };
    load();
    return () => clearTimeout(t);
  }, [id]);
  if (!o) return <p className="w mut">Memuat…</p>;
  if (o.status === 'paid') {
    const msg = encodeURIComponent(`Halo admin, saya sudah bayar order ${o.id}. Mohon bantu amankan akun saya.`);
    return (
      <div className="box">
        <div className="check" /><h2 className="gold" style={{ textAlign: 'center' }}>Pembayaran Berhasil</h2>
        <p className="mut">{o.acc.title}</p>
        <div className="cred">Username: <b>{o.acc.username}</b><br />Password: <b>{o.acc.password}</b></div>
        <p className="mut" style={{ marginBottom: 14 }}>Simpan data ini. Segera chat admin agar akun diamankan (ganti password/email).</p>
        <a className="btn" href={`https://wa.me/${WA}?text=${msg}`} target="_blank">Chat Admin untuk Amankan Akun</a>
      </div>
    );
  }
  return (
    <div className="box" style={{ textAlign: 'center' }}>
      <h2>Scan QRIS</h2>
      <p className="price" style={{ margin: '8px 0 16px' }}>Rp {o.amount.toLocaleString('id-ID')}</p>
      <div className="qrw" style={{ background: '#fff', padding: 14, borderRadius: 14, display: 'inline-block' }}><QRCodeSVG value={o.qr} size={230} /></div>
      <p className="mut" style={{ marginTop: 14 }}>Menunggu pembayaran… halaman ini otomatis diperbarui.<br />Order: {o.id}</p>
    </div>
  );
}

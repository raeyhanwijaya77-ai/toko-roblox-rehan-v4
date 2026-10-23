'use client';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import SafeImg from '@/components/SafeImg';

const rp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const NAV = [['dash', 'Dashboard', 'grid'], ['akun', 'Akun', 'list'], ['tambah', 'Tambah', 'plus'], ['bayar', 'Pembayaran', 'card'], ['set', 'Pengaturan', 'shield']];
const TITLE = { dash: 'Dashboard', akun: 'Daftar Akun', tambah: 'Tambah Akun', bayar: 'Pembayaran', set: 'Pengaturan' };
const ICONS = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  plus: <path d="M12 5v14M5 12h14" />,
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
};
const Ic = ({ n }) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[n]}</svg>;

function CountUp({ to, money }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0;
    const step = (t) => {
      if (t0 === undefined) t0 = t;
      const p = Math.min(1, (t - t0) / 700);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{money ? rp(v) : v}</>;
}

async function shrink(file, max = 1100) {
  let src, w, h;
  try { src = await createImageBitmap(file); w = src.width; h = src.height; }
  catch {
    src = await new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = URL.createObjectURL(file); });
    w = src.naturalWidth; h = src.naturalHeight;
  }
  const k = Math.min(1, max / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
  const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.8));
  if (!blob) throw new Error('gagal');
  return blob;
}
const toData = (blob) => new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); });

export default function Admin({ me }) {
  const [tab, setTab] = useState('dash');
  const [list, setList] = useState([]);
  const [toast, setToast] = useState('');
  const load = async () => { try { const d = await (await fetch('/api/admin/accounts')).json(); setList(Array.isArray(d) ? d : []); } catch {} };
  useEffect(() => { load(); }, []);
  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 2600); };
  const st = useMemo(() => {
    const sold = list.filter((a) => a.status === 'sold');
    return { total: list.length, ready: list.filter((a) => a.status === 'available').length, sold: sold.length, rev: sold.reduce((s, a) => s + a.price, 0) };
  }, [list]);
  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand"><span className="mark">R</span>Admin Rehan</div>
        <div className="adm-nav">
          {NAV.map(([k, label, ic]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><Ic n={ic} />{label}</button>
          ))}
        </div>
        <div className="adm-foot">Masuk sebagai<br /><b>{me.username}</b><br />{me.email}</div>
      </aside>
      <main className="adm-main">
        <div className="adm-top">
          <div><h1>{TITLE[tab]}</h1><small>Toko Akun Rehan · role {me.role}</small></div>
          <div className="adm-act">
            <ThemeToggle />
            <a href="/" className="btn o sm">Lihat toko</a>
            <a href="/api/logout" className="btn red sm">Keluar</a>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tab === 'dash' && <Dash st={st} list={list} go={setTab} />}
            {tab === 'akun' && <Akun list={list} reload={load} say={say} />}
            {tab === 'tambah' && <Tambah done={() => { load(); setTab('akun'); }} say={say} />}
            {tab === 'bayar' && <Pay say={say} />}
            {tab === 'set' && <Sett me={me} say={say} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {toast && <motion.div className="toast" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{toast}</motion.div>}
      </AnimatePresence>
    </div>
  );
}

function Dash({ st, list, go }) {
  const cards = [['Total akun', st.total], ['Tersedia', st.ready], ['Terjual', st.sold], ['Pendapatan', st.rev, true]];
  return (
    <>
      <div className="stats">
        {cards.map(([l, v, m], i) => (
          <motion.div key={l} className="stat" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <small>{l}</small><b><CountUp to={v} money={m} /></b>
          </motion.div>
        ))}
      </div>
      <div className="c2">
        <h3>Akun terbaru</h3>
        <Table rows={list.slice(0, 5)} />
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn sm" onClick={() => go('tambah')}>Tambah akun</button>
          <button className="btn o sm" onClick={() => go('akun')}>Lihat semua</button>
        </div>
      </div>
    </>
  );
}

function Table({ rows, onDel }) {
  if (!rows.length) return <p className="mut">Belum ada akun.</p>;
  return (
    <div className="tblw">
      <table className="tbl">
        <thead><tr><th>Akun</th><th>Harga</th><th>Status</th>{onDel && <th></th>}</tr></thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id}>
              <td><div className="tcell"><div className="tth"><SafeImg src={a.images?.[0]} alt="" /></div><b>{a.title}</b></div></td>
              <td className="gold"><b>{rp(a.price)}</b></td>
              <td><span className={'pill ' + a.status}>{a.status === 'available' ? 'Tersedia' : a.status === 'sold' ? 'Terjual' : 'Ditahan'}</span></td>
              {onDel && <td><button className="btn red sm" onClick={() => onDel(a)}>Hapus</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Akun({ list, reload, say }) {
  async function del(a) {
    if (!confirm('Hapus akun "' + a.title + '"?')) return;
    await fetch('/api/admin/accounts?id=' + a.id, { method: 'DELETE' });
    say('Akun dihapus'); reload();
  }
  return <div className="c2"><Table rows={list} onDel={del} /></div>;
}

function Tambah({ done, say }) {
  const [f, setF] = useState({ title: '', price: '', description: '', specs: '', username: '', password: '' });
  const [photos, setPhotos] = useState([]);
  const [busy, setB] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function pick(e) {
    const files = [...e.target.files].slice(0, Math.max(0, 8 - photos.length));
    e.target.value = '';
    for (const file of files) {
      const id = Math.random().toString(36).slice(2);
      setPhotos((p) => [...p, { id, preview: URL.createObjectURL(file), status: 'up' }]);
      try {
        const blob = await shrink(file);
        let url = null;
        try {
          const fd = new FormData();
          fd.append('file', new File([blob], 'foto.jpg', { type: 'image/jpeg' }));
          const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
          url = (await r.json()).url || null;
        } catch {}
        if (!url) url = await toData(blob);
        setPhotos((p) => p.map((x) => (x.id === id ? { ...x, status: 'ok', url } : x)));
      } catch {
        setPhotos((p) => p.map((x) => (x.id === id ? { ...x, status: 'err' } : x)));
      }
    }
  }
  async function save(ev) {
    ev.preventDefault();
    if (!photos.length) return say('Tambahkan minimal 1 foto');
    if (photos.some((x) => x.status === 'up')) return say('Tunggu foto selesai diproses');
    if (photos.some((x) => x.status === 'err')) return say('Hapus foto yang gagal dulu');
    setB(true);
    try {
      const r = await fetch('/api/admin/accounts', { method: 'POST', body: JSON.stringify({ ...f, images: photos.map((x) => x.url) }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok) { say('Akun tersimpan'); done(); } else say(d.error || 'Gagal menyimpan');
    } catch { say('Koneksi gagal'); }
    setB(false);
  }
  return (
    <form className="c2" onSubmit={save}>
      <div className="fg">
        <div className="full"><label className="l">Judul akun</label><input placeholder="Contoh: Akun Lv 100 + Limited" value={f.title} onChange={set('title')} required /></div>
        <div><label className="l">Harga (Rp)</label><input type="number" inputMode="numeric" placeholder="50000" value={f.price} onChange={set('price')} required /></div>
        <div />
        <div className="full"><label className="l">Spesifikasi akun (satu per baris)</label><textarea rows="4" placeholder={'Level 100\nRobux 5.000\nItem limited 3'} value={f.specs} onChange={set('specs')} /></div>
        <div className="full"><label className="l">Deskripsi (opsional)</label><textarea rows="3" value={f.description} onChange={set('description')} /></div>
        <div><label className="l">Username akun Roblox</label><input value={f.username} onChange={set('username')} required /></div>
        <div><label className="l">Password akun Roblox</label><input value={f.password} onChange={set('password')} required /></div>
      </div>
      <label className="l">Foto akun dan spesifikasi ({photos.length}/8)</label>
      <label className="drop">
        <b>Ketuk untuk pilih foto</b><small>Otomatis dikecilkan. Bisa pilih beberapa foto.</small>
        <input type="file" accept="image/*" multiple onChange={pick} />
      </label>
      {photos.length > 0 && (
        <div className="pv">
          {photos.map((x) => (
            <div className="pvi" key={x.id}>
              <img src={x.preview} alt="" />
              {x.status === 'up' && <div className="spin" />}
              <span className={'st ' + x.status}>{x.status === 'ok' ? 'Siap' : x.status === 'err' ? 'Gagal' : 'Proses'}</span>
              <button type="button" className="x" onClick={() => setPhotos((p) => p.filter((y) => y.id !== x.id))}>×</button>
            </div>
          ))}
        </div>
      )}
      <button className="btn" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan Akun'}</button>
    </form>
  );
}

function Pay({ say }) {
  const [slug, setSlug] = useState(''), [key, setKey] = useState(''), [has, setHas] = useState(false), [o, setO] = useState('');
  useEffect(() => {
    setO(location.origin);
    fetch('/api/admin/settings').then((r) => r.json()).then((d) => { setSlug(d.slug || ''); setHas(!!d.hasKey); }).catch(() => {});
  }, []);
  async function save() {
    const r = await fetch('/api/admin/settings', { method: 'POST', body: JSON.stringify({ slug, key }) });
    if (r.ok) { setHas(true); setKey(''); say('Pembayaran tersimpan'); } else say('Gagal menyimpan');
  }
  const copy = async () => { try { await navigator.clipboard.writeText(o + '/api/webhook'); say('Webhook disalin'); } catch { say('Salin manual dari kotak'); } };
  return (
    <div className="c2">
      <h3>Pakasir</h3>
      <label className="l">Slug proyek</label>
      <input placeholder="slug-proyek" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <label className="l">API Key</label>
      <input type="password" placeholder={has ? 'Tersimpan. Isi lagi untuk mengganti' : 'API Key Pakasir'} value={key} onChange={(e) => setKey(e.target.value)} />
      <label className="l">Webhook URL (tempel di dashboard Pakasir)</label>
      <input readOnly value={o + '/api/webhook'} onFocus={(e) => e.target.select()} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn" onClick={save}>Simpan</button>
        <button className="btn o" onClick={copy}>Salin webhook</button>
      </div>
    </div>
  );
}

function Sett({ me, say }) {
  const [np, setNp] = useState('');
  async function chg() {
    const r = await fetch('/api/admin/password', { method: 'POST', body: JSON.stringify({ password: np }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { setNp(''); say('Password diganti'); } else say(d.error || 'Gagal mengganti');
  }
  return (
    <>
      <div className="c2">
        <h3>Akun admin</h3>
        <p><span className="mut">Username:</span> <b>{me.username}</b></p>
        <p><span className="mut">Gmail:</span> <b>{me.email}</b></p>
        <p><span className="mut">Role:</span> <b>{me.role}</b></p>
        <p className="mut" style={{ marginTop: 8 }}>Login bisa memakai username atau Gmail di atas.</p>
      </div>
      <div className="c2">
        <h3>Ganti password</h3>
        <input type="text" placeholder="Password baru (min. 6 karakter)" value={np} onChange={(e) => setNp(e.target.value)} />
        <button className="btn" onClick={chg}>Simpan password</button>
      </div>
    </>
  );
}

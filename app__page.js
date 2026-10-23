import Link from 'next/link';
import { sql, init } from '@/lib/db';
import Reveal from '@/components/Reveal';
import SafeImg from '@/components/SafeImg';
export const dynamic = 'force-dynamic';
const WA = process.env.NEXT_PUBLIC_WA_ADMIN || '6282319319768';
const TESTI = 'https://whatsapp.com/channel/0029Vb8X3IUDp2Q8pNBKI40L';
const WAICON = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';
export default async function Home() {
  await init();
  const rows = await sql`select id,title,price,images->>0 as cover,case when jsonb_typeof(images)='array' then jsonb_array_length(images) else 0 end as n from accounts where status='available' or (status='reserved' and reserved_at<now()-interval '15 minutes') order by id desc`;
  return (
    <div className="w">
      <section className="hero2">
        <Reveal>
          <h1>Akun Roblox siap pakai, dikirim begitu pembayaran masuk.</h1>
          <p className="lead">Pilih akun, bayar lewat QRIS, dan data login langsung muncul di layar. Admin siap membantu mengamankan akun setelahnya.</p>
          <div className="acts">
            <a href="#stok" className="btn">Lihat stok akun</a>
            <a href={`https://wa.me/${WA}`} target="_blank" className="btn o">Chat Admin</a>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <ol className="steps">
            <li><span className="num">1</span><div><b>Pilih akun</b><small>Lihat foto dan spesifikasi sebelum membeli.</small></div></li>
            <li><span className="num">2</span><div><b>Bayar dengan QRIS</b><small>Scan dari e-wallet atau m-banking.</small></div></li>
            <li><span className="num">3</span><div><b>Terima akun</b><small>Username dan password tampil otomatis.</small></div></li>
          </ol>
        </Reveal>
      </section>
      <div className="sh" id="stok"><h2>Stok akun</h2><span className="mut">{rows.length} tersedia</span></div>
      {!rows.length && (
        <Reveal>
          <div className="empty">
            <h3>Stok sedang kosong</h3>
            <p>Hubungi admin untuk request akun yang kamu cari.</p>
            <a href={`https://wa.me/${WA}`} target="_blank" className="btn">Chat Admin</a>
          </div>
        </Reveal>
      )}
      <div className="grid">
        {rows.map((a, i) => (
          <Reveal key={a.id} delay={Math.min(i, 8) * 0.05}>
            <Link href={`/akun/${a.id}`} className="card">
              <div className="frame">
                <SafeImg src={a.cover} alt={a.title} />
                <span className="tag ok">Ready</span>
                {a.n > 1 && <span className="tag n">{a.n} foto</span>}
              </div>
              <div className="cb">
                <h3>{a.title}</h3>
                <div className="pr"><span className="price">Rp {a.price.toLocaleString('id-ID')}</span><span className="go">Lihat detail</span></div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="sh"><h2>Saluran Testimoni</h2></div>
      <Reveal>
        <a href={TESTI} target="_blank" className="chan">
          <span className="wi"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d={WAICON} /></svg></span>
          <span className="ct"><b>Lihat testimoni pembeli</b><small>Bukti transaksi dan ulasan langsung dari pembeli. Gabung saluran WhatsApp kami.</small></span>
          <span className="btn">Gabung saluran</span>
        </a>
      </Reveal>
      <p className="ft">Toko Akun Rehan. Pembayaran QRIS otomatis.</p>
    </div>
  );
}

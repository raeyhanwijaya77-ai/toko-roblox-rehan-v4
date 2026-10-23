import Link from 'next/link';
import { redirect } from 'next/navigation';
import { sql, init } from '@/lib/db';
import { getUser } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export default async function Riwayat() {
  const u = await getUser();
  if (!u) redirect('/login');
  await init();
  const rows = await sql`select o.id,o.amount,o.status,o.created,a.title from orders o join accounts a on a.id=o.account_id where o.user_id=${u.id} order by o.created desc`;
  return (
    <div className="w">
      <h2>Pesanan Saya</h2>
      {!rows.length && <p className="mut">Belum ada pesanan.</p>}
      {rows.map((o) => (
        <Link key={o.id} href={`/order/${o.id}`} className="row">
          <span>{o.title}<br /><small className="mut">{o.id}</small></span>
          <span style={{ textAlign: 'right' }}>Rp {o.amount.toLocaleString('id-ID')}<br />
            <small className={o.status === 'paid' ? 'gold' : 'mut'}>{o.status === 'paid' ? 'Lunas — lihat akun' : 'Menunggu bayar'}</small></span>
        </Link>
      ))}
    </div>
  );
}

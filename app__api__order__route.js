import { sql, init } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { createQris } from '@/lib/pakasir';
export async function POST(req) {
  const u = await getUser();
  if (!u) return Response.json({ error: 'login' }, { status: 401 });
  await init();
  const { accountId } = await req.json();
  await sql`update accounts set status='available' where status='reserved' and reserved_at<now()-interval '15 minutes'`;
  const [a] = await sql`update accounts set status='reserved',reserved_at=now(),buyer_id=${u.id} where id=${accountId} and status='available' returning id,price`;
  if (!a) return Response.json({ error: 'Akun sudah tidak tersedia' }, { status: 409 });
  const id = 'RBX' + Date.now() + Math.floor(Math.random() * 900 + 100);
  try {
    const qr = await createQris(id, a.price);
    if (!qr) throw 0;
    await sql`insert into orders(id,user_id,account_id,amount,qr) values(${id},${u.id},${a.id},${a.price},${qr})`;
    return Response.json({ id });
  } catch {
    await sql`update accounts set status='available' where id=${a.id}`;
    return Response.json({ error: 'Gagal membuat pembayaran, coba lagi' }, { status: 502 });
  }
}

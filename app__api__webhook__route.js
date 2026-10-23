import { sql, init } from '@/lib/db';
import { isPaid, finalize } from '@/lib/pakasir';
export async function POST(req) {
  await init();
  const b = await req.json();
  const [o] = await sql`select * from orders where id=${String(b.order_id)}`;
  if (o && o.status === 'pending' && (await isPaid(o))) await finalize(o);
  return Response.json({ ok: 1 });
}

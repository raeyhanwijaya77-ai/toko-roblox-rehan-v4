import { sql, init } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { isPaid, finalize } from '@/lib/pakasir';
export async function GET(_, { params }) {
  const { id } = await params;
  const u = await getUser();
  if (!u) return Response.json({}, { status: 401 });
  await init();
  const [o] = await sql`select * from orders where id=${id} and user_id=${u.id}`;
  if (!o) return Response.json({}, { status: 404 });
  if (o.status === 'pending' && (await isPaid(o))) { await finalize(o); o.status = 'paid'; }
  let acc = null;
  if (o.status === 'paid') [acc] = await sql`select title,username,password from accounts where id=${o.account_id}`;
  return Response.json({ id: o.id, status: o.status, qr: o.qr, amount: o.amount, acc });
}

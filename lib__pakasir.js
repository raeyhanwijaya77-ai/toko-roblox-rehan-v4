import { sql, init } from './db';
const B = 'https://app.pakasir.com/api';
async function cfg() {
  await init();
  const r = await sql`select k,v from meta where k in ('pk_slug','pk_key')`;
  const m = Object.fromEntries(r.map((x) => [x.k, x.v]));
  return { slug: m.pk_slug || process.env.PAKASIR_SLUG, key: m.pk_key || process.env.PAKASIR_API_KEY };
}
export async function createQris(order_id, amount) {
  const c = await cfg();
  if (!c.slug || !c.key) return null;
  const r = await fetch(`${B}/transactioncreate/qris`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project: c.slug, order_id, amount, api_key: c.key }) });
  return (await r.json())?.payment?.payment_number;
}
export async function isPaid(o) {
  const c = await cfg();
  if (!c.slug || !c.key) return false;
  const u = new URL(`${B}/transactiondetail`);
  u.search = new URLSearchParams({ project: c.slug, amount: o.amount, order_id: o.id, api_key: c.key });
  try { return (await (await fetch(u)).json())?.transaction?.status === 'completed'; } catch { return false; }
}
export async function finalize(o) {
  const r = await sql`update orders set status='paid' where id=${o.id} and status='pending' returning id`;
  if (r.length) await sql`update accounts set status='sold',buyer_id=${o.user_id} where id=${o.account_id}`;
}

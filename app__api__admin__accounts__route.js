import { sql, init } from '@/lib/db';
import { getUser, isAdmin } from '@/lib/auth';
const deny = async () => !isAdmin(await getUser());
const bad = (m) => Response.json({ error: m }, { status: 400 });
export async function GET() {
  if (await deny()) return Response.json({}, { status: 403 });
  await init();
  return Response.json(await sql`select * from accounts order by id desc`);
}
export async function POST(req) {
  if (await deny()) return Response.json({}, { status: 403 });
  await init();
  const { title, description, specs, price, images, username, password } = await req.json();
  const imgs = (Array.isArray(images) ? images : []).filter((s) => typeof s === 'string' && /^(https?:\/\/|data:image\/)/.test(s)).slice(0, 8);
  const p = parseInt(price);
  if (!title || !p || p < 1 || !username || !password) return bad('Lengkapi judul, harga, username, dan password akun');
  if (!imgs.length) return bad('Tambahkan minimal 1 foto');
  await sql`insert into accounts(title,description,specs,price,images,username,password) values(${title},${description || ''},${specs || ''},${p},${JSON.stringify(imgs)}::jsonb,${username},${password})`;
  return Response.json({ ok: 1 });
}
export async function DELETE(req) {
  if (await deny()) return Response.json({}, { status: 403 });
  const id = new URL(req.url).searchParams.get('id');
  await sql`delete from accounts where id=${id}`;
  return Response.json({ ok: 1 });
}

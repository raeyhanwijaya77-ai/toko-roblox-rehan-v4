import { sql, init } from '@/lib/db';
import { getUser, isAdmin, hashPw } from '@/lib/auth';
export async function POST(req) {
  const u = await getUser();
  if (!isAdmin(u)) return Response.json({ error: 'forbidden' }, { status: 403 });
  const { password } = await req.json();
  if (!password || password.length < 6) return Response.json({ error: 'Minimal 6 karakter' }, { status: 400 });
  await init();
  await sql`update users set pass=${hashPw(password)} where id=${u.id}`;
  return Response.json({ ok: 1 });
}

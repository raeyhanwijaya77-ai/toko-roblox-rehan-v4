import { put } from '@vercel/blob';
import { getUser, isAdmin } from '@/lib/auth';
export async function POST(req) {
  if (!isAdmin(await getUser())) return Response.json({}, { status: 403 });
  const f = (await req.formData()).get('file');
  const b = await put('akun/' + Date.now() + '-' + f.name.replace(/[^\w.]/g, '_'), f, { access: 'public' });
  return Response.json({ url: b.url });
}

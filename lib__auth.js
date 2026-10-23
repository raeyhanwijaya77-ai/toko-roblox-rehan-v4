import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';
const secret = process.env.JWT_SECRET || crypto.createHash('sha256').update('k1' + (process.env.DATABASE_URL || 'dev')).digest('hex');
const key = () => new TextEncoder().encode(secret);
export const ADMIN = (process.env.ADMIN_EMAIL || 'raeyhanwijaya77@gmail.com').toLowerCase().trim();
export const hashPw = (p) => { const s = crypto.randomBytes(16); return s.toString('hex') + ':' + crypto.scryptSync(p, s, 32).toString('hex'); };
export const checkPw = (p, st) => {
  try { const [s, h] = String(st).split(':'); const x = crypto.scryptSync(p, Buffer.from(s, 'hex'), 32); return crypto.timingSafeEqual(x, Buffer.from(h, 'hex')); } catch { return false; }
};
export async function setSession(u) {
  const t = await new SignJWT({ id: u.id, email: u.email, username: u.username || '', role: u.role || 'user' }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('30d').sign(key());
  (await cookies()).set('s', t, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 2592000 });
}
export async function getUser() {
  try { const t = (await cookies()).get('s')?.value; if (!t) return null; return (await jwtVerify(t, key())).payload; } catch { return null; }
}
export const isAdmin = (u) => !!u && (u.role === 'admin_rehan' || u.email === ADMIN);

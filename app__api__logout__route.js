import { cookies } from 'next/headers';
export async function GET(req) { (await cookies()).delete('s'); return Response.redirect(new URL('/', req.url)); }

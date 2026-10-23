import { redirect } from 'next/navigation';
import { getUser, isAdmin } from '@/lib/auth';
import UI from './ui';
export const dynamic = 'force-dynamic';
export default async function Admin() {
  const u = await getUser();
  if (!isAdmin(u)) redirect('/login');
  return <UI me={{ email: String(u.email || ''), username: String(u.username || 'admin_rehan'), role: String(u.role || 'admin_rehan') }} />;
}

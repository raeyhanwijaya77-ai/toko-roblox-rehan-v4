import './globals.css';
import { getUser, isAdmin } from '@/lib/auth';
import Splash from '@/components/Splash';
import ThemeToggle from '@/components/ThemeToggle';
export const metadata = { title: 'Toko Akun Rehan — Akun Roblox Premium', description: 'Jual akun Roblox, bayar QRIS, akun langsung dikirim otomatis.' };
const WA = process.env.NEXT_PUBLIC_WA_ADMIN || '6282319319768';
const boot = "try{var d=document.documentElement,t=localStorage.getItem('theme');if(t)d.dataset.theme=t;if(sessionStorage.getItem('sp'))d.classList.add('seen')}catch(e){}";
export default async function RootLayout({ children }) {
  const u = await getUser();
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Sora:wght@600;700;800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <Splash />
        <nav>
          <a href="/" className="brand"><span className="mark">R</span>Toko Akun Rehan</a>
          <span>
            {u && <a href="/riwayat">Pesanan</a>}
            {isAdmin(u) && <a href="/admin" className="gold">Admin</a>}
            {u ? <a href="/api/logout">Keluar</a> : <a href="/login" className="gold">Masuk</a>}
            <ThemeToggle />
          </span>
        </nav>
        {children}
        <a className="wa" href={`https://wa.me/${WA}`} target="_blank">Chat Admin</a>
      </body>
    </html>
  );
}

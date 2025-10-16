'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleNavClick = () => setOpen(false);

  const linkClass = (match: boolean) => `
    ${match ? 'underline' : ''}  
    text-lg font-medium
    hover:scale-100 transition-all duration-200
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    text-white hover:text-white/95
    hover:bg-white/10
  `;

  const NavLinks = (
    <>
      <Link href="/">
        <Button variant="ghost" size="sm" className={linkClass(pathname === '/')} onClick={handleNavClick}>
          Home
        </Button>
      </Link>
      <Link href="/problems">
        <Button variant="ghost" size="sm" className={linkClass(pathname === '/problems')} onClick={handleNavClick}>
          Problems
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className={linkClass(pathname === '/dashboard')} onClick={handleNavClick}>
          Dashboard
        </Button>
      </Link>
      <Link href="/arena">
        <Button variant="ghost" size="sm" className={linkClass(pathname.startsWith('/arena'))} onClick={handleNavClick}>
          ⚔️ Arena
        </Button>
      </Link>
      <Link href="/leaderboard">
        <Button variant="ghost" size="sm" className={linkClass(pathname === '/leaderboard')} onClick={handleNavClick}>
          Leaderboard
        </Button>
      </Link>
      <Link href="/about">
        <Button variant="ghost" size="sm" className={linkClass(pathname === '/about')} onClick={handleNavClick}>
          About
        </Button>
      </Link>
      {pathname === '/success' && (
        <Link href="/success">
          <Button variant="default" size="sm" onClick={handleNavClick}>
            Success
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent shadow-none z-50">
      <div
        className="
          flex h-16 items-center gap-4
          px-4 md:px-10 lg:px-20 mx-4 mt-3
          rounded-2xl border border-white/20
          bg-[rgba(68,24,110,0.25)] 
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-[rgba(68,24,110,0.25)]
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        "
      >
        {/* Left: Brand */}
        <Link href="/" className="font-bold text-2xl md:text-4xl text-white flex items-center gap-2">
          <img src="/favicon.ico" alt="ITEENS Logo" className="w-9 h-9 md:w-11 md:h-11" />
          ITEENS
        </Link>

        {/*  Center: Desktop links  */}
        <div className="hidden md:flex gap-5 flex-1 justify-center md:-ml-6 lg:-ml-10">
          {NavLinks}
        </div>

        {/*  Right: User + Mobile toggle  */}
        <div className="ml-auto flex items-center gap-2">
          <UserButton />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/*  Mobile panel  */}
      {open && (
        <div
          className="
            md:hidden mx-4
            rounded-xl border border-white/20 mt-2
            bg-[rgba(68,24,110,0.9)] backdrop-blur-xl
            shadow-[0_8px_30px_rgba(0,0,0,0.12)]
            px-3 py-3
          "
        >
          <div className="flex flex-col gap-2">
            {NavLinks}
          </div>
        </div>
      )}
    </nav>
  );
}
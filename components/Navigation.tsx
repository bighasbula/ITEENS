'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

export default function Navigation() {
  const pathname = usePathname();

  return (
      <nav className="fixed top-0 left-0 w-full bg-transparent shadow-none z-50">
      <div
        className="
          flex h-16 items-center gap-4 justify-between
          px-6 md:px-10 lg:px-20 mx-4 mt-3
          rounded-2xl border border-white/20
          bg-[rgba(68,24,110,0.25)] 
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-[rgba(68,24,110,0.25)]
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        "
      >
        <Link href="/" className="font-bold text-4xl text-white flex items-center gap-2">
          <img src="/favicon.ico" alt="ITEENS Logo" className="w-11 h-11"></img>
          ITEENS
        </Link>
        
        <div className="flex gap-5 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <Button 
              variant="ghost"
              size="sm"
              className={`
                ${pathname === '/' ? 'underline' : ''}  
                text-lg font-medium
                hover:scale-100 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-white hover:text-white/95
                hover:bg-white/10
              `}
            >
              Home
            </Button>
          </Link>
          <Link href="/problems">
            <Button 
              variant="ghost"
              size="sm"
              className={`
                ${pathname === '/problems' ? 'underline' : ''}
                text-lg font-medium
                hover:scale-100 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-white hover:text-white/95
                hover:bg-white/10
              `}
            >
              Problems
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button 
              variant="ghost"
              size="sm"
              className={`
                ${pathname === '/dashboard' ? 'underline' : ''}
                text-lg font-medium
                hover:scale-100 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-white hover:text-white/95
                hover:bg-white/10
              `}
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/arena">
            <Button 
              variant="ghost"
              size="sm"
              className={`
                ${pathname.startsWith('/arena') ? 'underline' : ''}
                text-lg font-medium
                hover:scale-100 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-white hover:text-white/95
                hover:bg-white/10
              `}
            >
              ⚔️ Arena
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button 
              variant="ghost"
              size="sm"
              className={`
                ${pathname === '/leaderboard' ? 'underline' : ''}
                text-lg font-medium
                hover:scale-100 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-white hover:text-white/95
                hover:bg-white/10
              `}
            >
              Leaderboard
            </Button>
          </Link>
          <Link href="/about">
            <Button 
              variant="ghost"
              size="sm"
              className={`
                ${pathname === '/about' ? 'underline' : ''}
                text-lg font-medium
                hover:scale-100 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-white hover:text-white/95
                hover:bg-white/10
              `}
            >
              About
            </Button>
          </Link>
          {pathname === '/success' && (
            <Link href="/success">
              <Button 
                variant="default"
                size="sm"
              >
                Success
              </Button>
            </Link>
          )}
        </div>
        
        <div className="ml-auto">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
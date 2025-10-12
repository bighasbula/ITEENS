'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background shadow-sm relative z-50">
      <div className="flex h-22 items-center px-20 gap-4 justify-between">
        <Link href="/" className="font-bold text-4xl text-primary flex items-center gap-2">
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
                hover:scale-105 hover:shadow-md transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-foreground hover:text-foreground
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
                hover:scale-105 hover:shadow-md transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-foreground hover:text-foreground
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
                hover:scale-105 hover:shadow-md transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-foreground hover:text-foreground
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
                hover:scale-105 hover:shadow-md transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-foreground hover:text-foreground
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
                hover:brightness-110 hover:text-primary/80 transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-foreground
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
                hover:scale-105 hover:shadow-md transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                text-foreground hover:text-foreground
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
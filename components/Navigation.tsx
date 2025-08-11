'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background shadow-sm">
      <div className="flex h-14 items-center px-4 gap-4">
        <Link href="/" className="font-bold text-3xl text-primary">
          ITEENS
        </Link>
        
        <div className="flex gap-2">
          <Link href="/">
            <Button 
              variant={pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              className={pathname === '/' ? '' : 'text-foreground hover:text-foreground'}
            >
              Home
            </Button>
          </Link>
          <Link href="/problems">
            <Button 
              variant={pathname === '/problems' ? 'default' : 'ghost'}
              size="sm"
              className={pathname === '/problems' ? '' : 'text-foreground hover:text-foreground'}
            >
              Problems
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button 
              variant={pathname === '/dashboard' ? 'default' : 'ghost'}
              size="sm"
              className={pathname === '/dashboard' ? '' : 'text-foreground hover:text-foreground'}
            >
              Dashboard
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

'use client';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/problem')) return null;
  if (pathname.startsWith('/arena')) return null;
  if (pathname.startsWith('/dashboard')) return null;
  return <Footer />;
}

// this file has been created to remove the Footer from some pages
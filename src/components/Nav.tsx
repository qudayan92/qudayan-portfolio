'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { me } from '@/lib/profile';

const links = [
  { href: '/', label: 'Home' },
  { href: '/#experience', label: '经历' },
  { href: '/#projects', label: '项目' },
  { href: '/blog', label: '笔记' },
  { href: '/#contact', label: '联系' },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? 'border-b border-white/5 bg-ink-950/70 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent-400 to-violet-500 text-ink-950 font-bold">
            Q
            <span className="absolute -inset-0.5 rounded-md bg-gradient-to-br from-accent-400 to-violet-500 opacity-0 blur transition group-hover:opacity-50" />
          </span>
          <span className="font-medium tracking-wide">
            {me.name}
            <span className="ml-1.5 text-xs text-neutral-500 font-mono">
              /{me.nameEn.split(' ')[1]}
            </span>
          </span>
        </Link>
        <ul className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`link-hover transition-colors ${
                    active ? 'text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs hover:border-accent-400/40 hover:bg-accent-400/10 transition"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          在职可聊
        </a>
      </nav>
    </header>
  );
}
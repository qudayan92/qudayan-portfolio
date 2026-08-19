import { me } from '@/lib/profile';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-10 mt-20">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} {me.name}. Built with Next.js + Vercel.</span>
        </div>
        <div className="flex items-center gap-5">
          <a href={`mailto:${me.email}`} className="link-hover hover:text-white">
            {me.email}
          </a>
          <a href={me.github} target="_blank" rel="noreferrer" className="link-hover hover:text-white">
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
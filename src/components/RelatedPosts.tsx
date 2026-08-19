import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-white/5">
      <p className="eyebrow">Related · 继续阅读</p>
      <h3 className="mt-3 text-xl md:text-2xl font-semibold tracking-tight">
        你可能还想看
      </h3>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group block rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-accent-400/30 transition"
          >
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
              <time dateTime={p.date}>
                {new Date(p.date).toISOString().slice(0, 10)}
              </time>
              <span>·</span>
              <span>{p.readingTime}</span>
            </div>
            <h4 className="mt-2 text-base font-medium text-white group-hover:text-accent-200 transition-colors">
              {p.title}
            </h4>
            <p className="mt-1 text-sm text-neutral-400 line-clamp-2 leading-relaxed">
              {p.description}
            </p>
            {p.tags && p.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/[0.03] px-2 py-0.5 text-[10px] text-neutral-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
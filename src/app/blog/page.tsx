import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: '笔记',
  description: '产品思考、AIGC 应用、工作流小技巧。',
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <section className="pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="eyebrow">Notes · 笔记</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">
          产品思考、<span className="text-gradient">AIGC 工作流</span>。
        </h1>
        <p className="mt-5 text-neutral-400 max-w-xl">
          不写水文，只写自己用过的、跑通的、能复用的东西。
        </p>

        <div className="mt-12 divide-y divide-white/5 border-t border-white/5">
          {posts.length === 0 && (
            <p className="py-10 text-neutral-500">暂无文章，敬请期待。</p>
          )}
          {posts.map((p) => (
            <article key={p.slug} className="py-8 group">
              <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
                <time dateTime={p.date}>
                  {new Date(p.date).toISOString().slice(0, 10)}
                </time>
                <span>·</span>
                <span>{p.readingTime}</span>
                {p.tags && p.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{p.tags.join(' · ')}</span>
                  </>
                )}
              </div>
              <h2 className="mt-2 text-2xl font-medium tracking-tight group-hover:text-accent-200 transition-colors">
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h2>
              <p className="mt-2 text-neutral-400 leading-relaxed">
                {p.description}
              </p>
              <Link
                href={`/blog/${p.slug}`}
                className="mt-3 inline-block text-sm text-neutral-500 link-hover hover:text-white"
              >
                继续阅读 →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="pt-32 pb-20">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/blog"
          className="text-sm text-neutral-500 link-hover hover:text-white"
        >
          ← 回到笔记
        </Link>
        <header className="mt-8">
          <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
            <time dateTime={post.date}>
              {new Date(post.date).toISOString().slice(0, 10)}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">{post.description}</p>
        </header>

        <div className="prose-custom mt-10">
          <MDXRemote source={post.content} />
        </div>
      </div>

      <style>{`
        .prose-custom { color: rgb(229 231 235); line-height: 1.75; }
        .prose-custom h2 { margin-top: 2.5rem; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.01em; }
        .prose-custom h3 { margin-top: 2rem; margin-bottom: 0.75rem; font-size: 1.2rem; font-weight: 600; }
        .prose-custom p { margin: 1rem 0; color: rgb(212 212 216); }
        .prose-custom a { color: rgb(165 243 252); text-decoration: underline; text-underline-offset: 3px; }
        .prose-custom ul { margin: 1rem 0; padding-left: 1.5rem; list-style: disc; color: rgb(212 212 216); }
        .prose-custom ol { margin: 1rem 0; padding-left: 1.5rem; list-style: decimal; color: rgb(212 212 216); }
        .prose-custom li { margin: 0.4rem 0; }
        .prose-custom code { background: rgba(255,255,255,0.06); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.9em; font-family: ui-monospace, monospace; }
        .prose-custom pre { background: rgb(15 19 32); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1rem; overflow-x: auto; margin: 1.5rem 0; }
        .prose-custom pre code { background: transparent; padding: 0; }
        .prose-custom blockquote { border-left: 3px solid rgb(139 92 246); padding-left: 1rem; color: rgb(212 212 216); margin: 1.5rem 0; font-style: italic; }
        .prose-custom hr { border-color: rgba(255,255,255,0.08); margin: 2rem 0; }
        .prose-custom strong { color: white; font-weight: 600; }
      `}</style>
    </article>
  );
}
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO
  tags?: string[];
  draft?: boolean;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  content: string;
  readingTime: string;
};

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function listFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .filter((f) => !f.startsWith('_'));
}

export function getAllPosts(): BlogPost[] {
  const files = listFiles();
  const posts: BlogPost[] = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, '');
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const fm = data as BlogFrontmatter;
    const rt = readingTime(content);
    return {
      ...fm,
      slug,
      content,
      readingTime: rt.text,
    };
  });

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const altPath = path.join(BLOG_DIR, `${slug}.md`);
  const target = fs.existsSync(filePath) ? filePath : fs.existsSync(altPath) ? altPath : null;
  if (!target) return null;
  const raw = fs.readFileSync(target, 'utf8');
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    ...(data as BlogFrontmatter),
    slug,
    content,
    readingTime: rt.text,
  };
}
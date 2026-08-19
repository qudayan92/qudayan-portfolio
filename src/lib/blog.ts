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
  aiSummary?: string; // AI 生成
  aiQuestions?: string[]; // AI 生成
  summary?: string; // 人工填写的静态摘要（AI 未启用时的降级）
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  content: string;
  readingTime: string;
};

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const AI_SUMMARIES_PATH = path.join(process.cwd(), 'src', 'lib', 'ai-summaries.json');

type AiSummaryCache = Record<string, { summary: string; questions: string[] }>;

function loadAiSummaries(): AiSummaryCache {
  try {
    if (fs.existsSync(AI_SUMMARIES_PATH)) {
      return JSON.parse(fs.readFileSync(AI_SUMMARIES_PATH, 'utf8')) as AiSummaryCache;
    }
  } catch {
    // ignore
  }
  return {};
}

function listFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .filter((f) => !f.startsWith('_'));
}

export function getAllPosts(): BlogPost[] {
  const files = listFiles();
  const aiSummaries = loadAiSummaries();
  const posts: BlogPost[] = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, '');
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const fm = data as BlogFrontmatter;
    const rt = readingTime(content);
    const ai = aiSummaries[slug];
    return {
      ...fm,
      slug,
      content,
      readingTime: rt.text,
      // 优先用 JSON 缓存里的 AI 摘要，其次 frontmatter，其次手填 summary
      aiSummary: ai?.summary || fm.aiSummary,
      aiQuestions: ai?.questions || fm.aiQuestions,
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
  const ai = loadAiSummaries()[slug];
  const fm = data as BlogFrontmatter;
  return {
    ...fm,
    slug,
    content,
    readingTime: rt.text,
    aiSummary: ai?.summary || fm.aiSummary,
    aiQuestions: ai?.questions || fm.aiQuestions,
  };
}

// 基于 tag 相似度的相关文章推荐
// 算法：tag 重叠数 × 2 + 同分类 + 1（更新时间近的优先）
// 如果没有 tag 重叠，回退到"最近的其他博客"
export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const all = getAllPosts();
  const target = all.find((p) => p.slug === slug);
  if (!target) return [];
  const targetTags = new Set(target.tags || []);

  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const overlap = (p.tags || []).filter((t) => targetTags.has(t)).length;
      // 同 1 tag = 2 分，同 2+ tag = 4 分
      return { post: p, score: overlap * 2 };
    });

  // 有任何 tag 重叠 → 用相关性排序
  const withOverlap = scored.filter((x) => x.score > 0);
  if (withOverlap.length >= limit) {
    return withOverlap
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.post);
  }

  // 没有 tag 重叠 → 回退到"最新的其他博客"
  const others = scored.map((x) => x.post);
  return others.slice(0, limit);
}

// 站点统计（自生长指标用）
export function getSiteStats() {
  const posts = getAllPosts();
  const allWords = posts.reduce((acc, p) => {
    // 中文字数估算：去掉 markdown 标记后的字符数
    const text = p.content.replace(/[#*`>_\-\[\]()]/g, '').trim();
    return acc + text.length;
  }, 0);
  // 最早博客日期
  const earliest = posts.reduce((min, p) => (p.date < min ? p.date : min), posts[0]?.date || '');
  const days = earliest ? Math.floor((Date.now() - new Date(earliest).getTime()) / 86400000) : 0;
  return {
    postCount: posts.length,
    charCount: allWords,
    daysRunning: days,
    latestDate: posts[0]?.date || '',
    tagSet: Array.from(new Set(posts.flatMap((p) => p.tags || []))),
  };
}
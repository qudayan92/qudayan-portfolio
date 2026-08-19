// 构建时预生成博客摘要：调用 /api/blog-summary 输出到 src/lib/ai-summaries.json
// 用法：node scripts/generate-summaries.mjs
// 注意：不修改源 MDX，摘要单独存 JSON，避免编码污染

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog');
const OUT_FILE = path.resolve(process.cwd(), 'src/lib/ai-summaries.json');
const API_URL = process.env.API_URL || 'http://127.0.0.1:3014/api/blog-summary';

async function main() {
  const files = (await fs.readdir(BLOG_DIR)).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  // 读取已有缓存（跳过已生成的）
  let cache = {};
  try {
    cache = JSON.parse(await fs.readFile(OUT_FILE, 'utf8'));
  } catch {
    cache = {};
  }

  let ok = 0;
  let fail = 0;
  const results = { ...cache };

  for (const file of files) {
    const slug = file.replace(/\.mdx?$/, '');
    const filepath = path.join(BLOG_DIR, file);
    const raw = await fs.readFile(filepath, 'utf8');
    const { data, content } = matter(raw);

    // 已有缓存则跳过
    if (results[slug] && results[slug].summary) {
      console.log(`✓ ${file} (cached)`);
      ok++;
      continue;
    }

    try {
      const r = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title, content }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const { summary, questions } = await r.json();
      if (!summary) throw new Error('empty summary');

      results[slug] = { summary, questions: Array.isArray(questions) ? questions : [] };
      await fs.writeFile(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');
      console.log(`✓ ${file} → summary saved`);
      ok++;
    } catch (err) {
      console.warn(`✗ ${file}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed → ${OUT_FILE}`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
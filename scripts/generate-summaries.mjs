// 构建时预生成博客摘要：调用 /api/blog-summary 写到 frontmatter
// 用法：node scripts/generate-summaries.mjs

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog');
const API_URL = process.env.API_URL || 'http://127.0.0.1:3014/api/blog-summary';

async function main() {
  const files = (await fs.readdir(BLOG_DIR)).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  let ok = 0;
  let fail = 0;

  for (const file of files) {
    const filepath = path.join(BLOG_DIR, file);
    const raw = await fs.readFile(filepath, 'utf8');
    const { data, content } = matter(raw);

    // 如果已经有 summary，跳过
    if (data.aiSummary) {
      console.log(`✓ ${file} (skip, already has summary)`);
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

      data.aiSummary = summary;
      data.aiQuestions = Array.isArray(questions) ? questions : [];

      const newRaw = matter.stringify(content, data);
      await fs.writeFile(filepath, newRaw, 'utf8');
      console.log(`✓ ${file} → summary generated`);
      ok++;
    } catch (err) {
      console.warn(`✗ ${file}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
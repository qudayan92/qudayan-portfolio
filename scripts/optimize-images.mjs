// 优化 public 下的图片：转 WebP、压缩、可选缩放。
// 用法: node scripts/optimize-images.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const targets = [
  { file: 'public/bg-ambient.png', width: 1400, quality: 72 },
  { file: 'public/ip-pm.png', width: 900, quality: 78 },
  { file: 'public/avatar.png', width: 400, quality: 80 },
];

async function main() {
  for (const t of targets) {
    const src = path.join(process.cwd(), t.file);
    if (!fs.existsSync(src)) {
      console.log('跳过（不存在）:', t.file);
      continue;
    }

    // 保持文件名，输出 webp 到同目录
    const dir = path.dirname(t.file);
    const base = path.basename(t.file, path.extname(t.file));
    const out = path.join(process.cwd(), dir, `${base}.webp`);

    const meta = await sharp(src).metadata();
    const scaledW = meta.width > t.width ? t.width : meta.width;

    await sharp(src)
      .resize({ width: scaledW, withoutEnlargement: true })
      .webp({ quality: t.quality, effort: 6 })
      .toFile(out);

    const inSize = fs.statSync(src).size;
    const outSize = fs.statSync(out).size;
    const pct = ((1 - outSize / inSize) * 100).toFixed(1);
    console.log(
      `${path.basename(t.file)}: ${(inSize / 1024).toFixed(0)}KB -> ${(outSize / 1024).toFixed(0)}KB (${pct}%)  width=${scaledW}`
    );
  }
}

main().catch((e) => {
  console.error('优化失败:', e.message);
  process.exit(1);
});

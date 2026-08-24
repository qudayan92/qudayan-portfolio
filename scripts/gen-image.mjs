// useAgnes: 调用 Agnes AI 图像生成 API，生成后下载到 public/
// 用法: node scripts/gen-image.mjs "<prompt>" <outputName>
import fs from 'node:fs';
import path from 'node:path';

const key = 'sk-3nJLjoEevO8KWxm0Pr7tiUw2liiDAKKcGego07GPwS82XB3s';
const base = 'https://apihub.agnes-ai.com/v1';

const prompt = process.argv[2];
const outName = process.argv[3] || 'generated.png';
if (!prompt) {
  console.error('Usage: node scripts/gen-image.mjs "<prompt>" <outputName>');
  process.exit(1);
}

const res = await fetch(`${base}/images/generations`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
  body: JSON.stringify({ model: 'agnes-image-2.1-flash', prompt, n: 1 }),
});

if (!res.ok) {
  const t = await res.text();
  console.error('API error', res.status, t);
  process.exit(1);
}

const json = await res.json();
const url = json.data?.[0]?.url;
if (!url) {
  console.error('No URL in response:', JSON.stringify(json).slice(0, 500));
  process.exit(1);
}

console.log('Image URL:', url);
const imgRes = await fetch(url);
if (!imgRes.ok) {
  console.error('Download error', imgRes.status);
  process.exit(1);
}
const buf = Buffer.from(await imgRes.arrayBuffer());
const outPath = path.join(process.cwd(), outName);
fs.writeFileSync(outPath, buf);
console.log('Saved:', outPath, buf.length, 'bytes');

// 组装 CloudBase Cloud Run 部署目录：只保留 Docker 构建所需的文件，
// 排除 node_modules / .next / .git / 机密文件，避免超大上传包。
// 用法: node scripts/prepare-cloudrun.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'deploy');

// 完整清空 deploy
if (fs.existsSync(out)) fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// 需要复制到 deploy 的文件/目录（用于 Docker 三段式构建）
const copyItems = [
  'package.json',
  'package-lock.json',
  'next.config.mjs',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.mjs',
  '.eslintrc.json',
  'Dockerfile',
  '.dockerignore',
  'next-env.d.ts',
  'src',
  'public',
  'robots.ts',
];

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const ent of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, ent.name);
    const destPath = path.join(destDir, ent.name);
    if (ent.isDirectory()) {
      // 跳过大目录与机密
      if (['node_modules', '.next', '.git', '.edgeone', '_eop-deploy', '._tools'].includes(ent.name)) continue;
      copyDir(srcPath, destPath);
    } else if (ent.isFile()) {
      // 跳过机密文件
      if (/^\.env|cloudbaserc\.json|secret|\.pem$/i.test(ent.name)) continue;
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

for (const item of copyItems) {
  const srcItem = path.join(root, item);
  if (fs.existsSync(srcItem)) {
    const st = fs.statSync(srcItem);
    if (st.isDirectory()) {
      copyDir(srcItem, path.join(out, item));
    } else {
      fs.copyFileSync(srcItem, path.join(out, item));
    }
  }
}

// 统计大小
let size = 0;
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else size += fs.statSync(p).size;
  }
})(out);

console.log('部署目录: ' + out);
console.log('大小: ' + (size / 1024 / 1024).toFixed(2) + ' MB');

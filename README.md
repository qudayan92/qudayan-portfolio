# 瞿达炎 · 个人网站 (qudayan.com)

> 一个用 Next.js 14 + Tailwind CSS + Vercel 构建的高质量个人作品集 / 简历站点。

## ✨ 技术栈

- **Next.js 14** (App Router, RSC, SSG)
- **TypeScript** - 全量类型化
- **Tailwind CSS** - 原子化样式 + 设计系统
- **Framer Motion** - 微交互动效
- **MDX** - 可写代码块的博客（next-mdx-remote）
- **Vercel** - 一键部署 + 全球边缘 CDN

## 🚀 一键部署到 Vercel

### 方式 A：网页操作（推荐，最快 60 秒上线）

1. 把这个项目 `git push` 到你的 GitHub 仓库：
   ```bash
   git init
   git add .
   git commit -m "feat: 初始化个人网站"
   git branch -M main
   git remote add origin https://github.com/你的用户名/qudayan-portfolio.git
   git push -u origin main
   ```

2. 打开 https://vercel.com/new → 用 GitHub 登录 → 选择刚推送的仓库。

3. 框架预设会自动识别为 **Next.js**，环境变量不用改，直接点 **Deploy**。

4. 等 1-2 分钟，构建完成后会得到一个 `xxx.vercel.app` 临时域名，**这就是你的线上网站**。

5. （可选）绑定自定义域名：
   - 进 Vercel 项目 → Settings → Domains
   - 输入 `qudayan.com`，按提示去域名 DNS 添加一条 `CNAME` 到 `cname.vercel-dns.com.`
   - Vercel 自动签发免费 HTTPS

### 方式 B：命令行（适合有 Vercel 账号但不想走网页）

```bash
# 一次性登录（会打开浏览器授权）
npx vercel login

# 首次部署（会问几个项目配置问题，一路回车即可）
npx vercel

# 部署到生产环境
npx vercel --prod
```

## 📁 目录结构

```
.
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # 全站 layout (Nav + Background + Footer)
│   │   ├── page.tsx          # 首页 (Hero/About/Experience/Projects/Skills/Contact)
│   │   ├── blog/             # 博客列表 + 文章详情
│   │   ├── sitemap.ts        # 动态 sitemap
│   │   └── globals.css       # 全局样式 + 设计 token
│   ├── components/
│   │   ├── Background.tsx    # 渐变光晕 + 网格 + 噪点
│   │   ├── Nav.tsx           # 顶部导航
│   │   ├── Footer.tsx
│   │   └── sections/         # 各页面区块
│   ├── content/
│   │   └── blog/             # ✏️  在这里写 .mdx 博客文章
│   └── lib/
│       ├── profile.ts        # ✏️  在这里改个人数据 (经历/项目/技能)
│       └── blog.ts           # 博客文件系统
├── public/                   # 静态资源（图片等）
├── tailwind.config.ts        # 设计 token (颜色/字体/动效)
├── next.config.mjs
└── vercel.json               # Vercel 部署配置 + 安全头 + 缓存
```

## ✏️ 改内容只需要动 3 个地方

1. **个人信息**：`src/lib/profile.ts` — 改名字、经历、项目、技能，所有页面自动更新
2. **博客**：`src/content/blog/*.mdx` — 新建 `.mdx` 文件即可，列表页自动收录
3. **首页标题/数据条**：`src/components/sections/Hero.tsx` 里的 KPI 数组

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 开发模式 (热更新)
npm run dev
# → http://localhost:3000

# 生产构建
npm run build
npm start
```

## 🔧 后续可加的功能（按需）

- [ ] 联系表单（接入 [Resend](https://resend.com)，Vercel 官方推荐）
- [ ] 评论系统（[Giscus](https://giscus.app)，用 GitHub Discussions，免费）
- [ ] 简历 PDF 一键下载
- [ ] 中文 / 英文 i18n
- [ ] 项目案例详情页（用 `/projects/[slug]` 路由）
- [ ] RSS feed（`src/app/feed.xml/route.ts`）

## 📜 License

MIT — 自己的网站，随便用 :)
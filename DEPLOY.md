# 🚀 上线操作手册

本文档说明如何把这个网站**从仓库推到线上**。两种方式任选其一。

## 准备工作（首次）

1. 注册 GitHub 账号：https://github.com/signup
2. 注册 Vercel 账号：https://vercel.com/signup （**用 GitHub 登录**，一键授权）

---

## 方案 A：网页一键部署（**最简单，推荐**）

### 第 1 步：在 GitHub 创建仓库

1. 打开 https://github.com/new
2. 填写：
   - **Repository name**: `qudayan-portfolio`（可改）
   - **Description**: 瞿达炎的个人作品集网站
   - 选择 **Private** 或 **Public**（Public 才能让 Vercel 免费用，对个人网站没影响）
3. **不要勾选** Add a README / Add .gitignore（项目里已经有了）
4. 点击 **Create repository**

### 第 2 步：把代码推上去

打开 PowerShell，在项目根目录执行：

```powershell
cd E:\个人网站
git init
git add .
git commit -m "feat: 初始化个人网站"
git branch -M main
git remote add origin https://github.com/你的GitHub用户名/qudayan-portfolio.git
git push -u origin main
```

> 第一次 push 会要求输入 GitHub 用户名 + Personal Access Token（密码不能用，需要 token）。
> Token 在 https://github.com/settings/tokens 生成，勾选 `repo` 权限即可。

### 第 3 步：Vercel 导入项目

1. 打开 https://vercel.com/new
2. 点击 **Import Git Repository** → 找到 `qudayan-portfolio` → 点击 **Import**
3. 配置页面保持默认（Framework Preset: Next.js 会自动识别）
4. 点击 **Deploy**

⏳ 等待 1-2 分钟，看到 🎉 恭喜页面说明已上线！

会自动得到一个形如 `qudayan-portfolio.vercel.app` 的地址，**这个就是你的线上简历**。

### 第 4 步（可选）：绑定个人域名

如果你有 `qudayan.com` 这种自己的域名：

1. 进入 Vercel 项目 → **Settings** → **Domains**
2. 输入 `qudayan.com` → 点 **Add**
3. Vercel 会给你一条 DNS 记录（一般是 `CNAME` 指向 `cname.vercel-dns.com`）
4. 去你的域名服务商（阿里云 / 腾讯云 / Cloudflare）添加这条 DNS
5. 等待 5-30 分钟 DNS 生效，Vercel 自动签发免费 HTTPS 证书

---

## 方案 B：命令行部署

适合喜欢敲命令的同学。

### 安装 Vercel CLI

```powershell
npm install -g vercel
```

### 登录

```powershell
vercel login
# 输入邮箱 → 收到邮件点链接授权
```

### 首次部署（会问几个配置问题）

```powershell
cd E:\个人网站
vercel
```

问题应答：
- `Set up and deploy?` → **Y**
- `Which scope?` → 选你的账号
- `Link to existing project?` → **N**
- `Project name?` → `qudayan-portfolio`
- `In which directory is your code located?` → 回车（默认 `./`）
- `Want to modify these settings?` → **N**

完成后会得到一个预览 URL。

### 部署到生产

```powershell
vercel --prod
```

---

## 后续更新流程

改了代码之后：

```powershell
cd E:\个人网站
git add .
git commit -m "更新说明"
git push
```

Vercel 会**自动检测**到 GitHub push，重新构建 + 部署。1-2 分钟后线上就更新了，**完全不需要手动操作**。

每次 PR 还会自动得到一个独立的预览 URL，可以先看效果再合并。

---

## 常见问题

### Q：想用 Cloudflare 加速国内访问？

Vercel 默认走 AWS 全球边缘，国内访问偶尔慢。可以同时绑一个 Cloudflare 代理：
- 把域名 DNS 托管到 Cloudflare
- 在 Cloudflare 加 `CNAME` 到 `cname.vercel-dns.com`，并开启代理（橙色云）

### Q：网站内容需要经常改吗？

- 改简历 → 编辑 `src/lib/profile.ts`
- 加博客 → 在 `src/content/blog/` 新建 `.mdx` 文件
- 改样式/设计 → 编辑 `tailwind.config.ts` 或 `src/app/globals.css`

### Q：会不会被搜索引擎收录？

会。`robots.ts` 和 `sitemap.ts` 已经配好，部署后 Google / Bing 几周内就会收录。百度需要主动提交，参考 https://ziyuan.baidu.com/

### Q：需要付费吗？

**不需要**。Vercel 个人免费版够用：
- 无限项目
- 100 GB 带宽/月（个人简历站每月 < 1 GB）
- 自动 HTTPS
- 全球 CDN

### Q：怎么加自定义域名邮箱（比如 hello@qudayan.com）？

Vercel 推荐用 [Resend](https://resend.com)，每月 3000 封免费，配合 Next.js 的 `route.ts` 写一个表单端点就行。需要的话告诉我，我帮你加。
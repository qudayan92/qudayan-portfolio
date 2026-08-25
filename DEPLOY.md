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

---

## ☁️ 部署到腾讯云 CloudBase（Cloud Run）

整站（页面 + AI 功能）部署到腾讯云 CloudBase Cloud Run，国内访问更快，不依赖 Vercel。

### 第 1 步：准备腾讯云 API 密钥

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入 **访问管理（CAM）→ API 密钥管理**：https://console.cloud.tencent.com/cam/capi
3. 点 **新建密钥**，生成 `SecretId` 和 `SecretKey`（**只显示一次，请保存**）
4. 确保该密钥所在的账号/子账号有 CloudBase 相关权限（可先在控制台给子账号授权 `QcloudCloudBaseFullAccess`）

### 第 2 步：创建 CloudBase 环境

1. 进入 [CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 如果还没有环境，点 **新建环境**
3. 记下 **环境 ID**（形如 `cloudbase-xxxxxxxxxxxx`），部署时要用

### 第 3 步：把密钥填到 GitHub Secrets

在 GitHub 仓库 `qudayan-portfolio` → **Settings → Secrets and variables → Actions → New repository secret**，依次添加：

| Secret 名 | 值 |
|---|---|
| `TCB_SECRET_ID` | 你的腾讯云 SecretId |
| `TCB_SECRET_KEY` | 你的腾讯云 SecretKey |
| `TCB_ENV_ID` | 你的 CloudBase 环境 ID |
| `LLM_API_KEY` | Agnes AI 的 Key（`sk-...`）|

> ⚠️ 这些密钥只存在 GitHub Secrets，**不会进入代码仓库**。本仓库的 `.gitignore` 已排除 `cloudbaserc.json` 和 `.env`。

### 第 4 步：触发部署

两个方式任选：
- **自动**：推送 `main` 分支会自动触发 `.github/workflows/deploy-tencent.yml`
- **手动**：GitHub 仓库 → **Actions** → 选 `Deploy to Tencent CloudBase (Cloud Run)` → **Run workflow**

部署成功后，工作流末尾会打印服务的访问 URL（如 `https://xxx.tcloudbaseapp.com`）。

### 部署原理（Cloud Run）

- `.github/workflows/deploy-tencent.yml` 会在 GitHub 云端构建 Next.js **standalone** 产物
- 把 `.next/static` 与 `public` 复制进 standalone 目录，保证页面 CSS/图片可用
- 生成运行时 `.env`（写入 `LLM_API_KEY` 等环境变量）
- 用 `tcb cloudrun deploy` 源码部署到 Cloud Run

> 注意：`next.config.mjs` 已开启 `output: 'standalone'`（Cloud Run 需要）。若同时使用 EdgeOne Pages（走标准构建），两者互不影响。

### 常见问题

| 症状 | 原因 | 解决 |
|---|---|---|
| 部署失败，提示 `Cannot read properties of null (reading 'secretId')` | GitHub Secrets 没填或填错 | 补齐 `TCB_SECRET_ID`/`TCB_SECRET_KEY` 再手动重跑 |
| 部署后 AI 报「未启用」 | 云端没配置 `LLM_API_KEY` | 确保 Secrets 里有 `LLM_API_KEY`，重新触发 |
| 部署后页面样式丢失 | `.next/static` 没进产物 | 确认 workflow 的 `Prepare deploy artifacts` 步骤执行成功 |
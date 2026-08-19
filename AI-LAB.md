# 🤖 AI Lab · 配置指南

这个目录的 AI 功能由 **Agnes AI**（OpenAI 兼容 API）驱动。要让访客能正常使用，需要配置 API Key。

## 🚀 启用 AI（5 分钟）

### 1. 拿 Agnes AI API Key

1. 去 https://platform.agnes-ai.com 注册
2. 登录后左侧菜单 → **API Keys**（https://platform.agnes-ai.com/settings/apiKeys）
3. 点 **Create** 生成 Key
4. 复制 Key（格式 `sk-xxxxxxxxxxxxxxxx`，**只显示一次**）

### 2. 配置到 Vercel

**方法 A：CLI（推荐）**

```powershell
cd E:\个人网站
vercel env add LLM_API_KEY production
# 提示 Store as sensitive? 输入 Y
# 粘贴 Key
```

如果想 preview 环境也能用：

```powershell
vercel env add LLM_API_KEY preview
```

**方法 B：网页**

1. 进 https://vercel.com/dashboard → `qudayan-portfolio`
2. Settings → **Environment Variables**
3. 添加 Key = `LLM_API_KEY`，Value = 你的 Agnes Key
4. Environment 选择 **Production**（可选加 Preview）

### 3. 触发重新部署

```powershell
vercel deploy --prod --yes
```

---

## 🎛️ 环境变量一览

| 变量 | 默认值 | 说明 |
|---|---|---|
| `LLM_API_KEY` | 无（必填）| Agnes AI API Key |
| `LLM_API_BASE_URL` | `https://apihub.agnes-ai.com/v1` | OpenAI 兼容 Base URL |
| `LLM_MODEL` | `agnes-2.5-flash` | 默认模型 |

> 兼容旧变量名 `DEEPSEEK_API_KEY`（如果之前配置过会继续生效）。

### 可选模型

| 模型 ID | 用途 | 建议 |
|---|---|---|
| `agnes-2.5-pro` | 高质量文本（PRD、面试、选题）| 质量优先时 |
| `agnes-2.5-flash` | 快速文本 | **默认**，性价比高 |
| `agnes-2.0-flash` | 老版快速 | 备选 |
| `agnes-image-2.1-flash` | 图像生成 | — |
| `agnes-video-v2.0` | 视频生成 | — |

想换默认模型：`vercel env add LLM_MODEL production` 设为 `agnes-2.5-pro`。

---

## 🎁 启用后自动激活的功能

| 功能 | 路由 | 前端组件 | 流式 |
|---|---|---|---|
| 简历文字润色 | `/api/rewrite` | `ResumePolish` | ✅ |
| AI 面试官（多轮对话）| `/api/interview` | `InterviewSimulator` | ✅ |
| 博客选题生成 | `/api/ideas` | `BlogIdeas` | ❌（一次性 JSON）|
| 联系表单破冰消息 | `/api/contact-intro` | `ContactForm` | ❌ |
| 博客 AI 摘要 + 延伸问题 | `/api/blog-summary` | 博客详情页底部 | ❌（构建时跑）|

---

## 📝 博客 AI 摘要预生成

启用 Key 后，运行下面脚本自动给每篇博客生成 AI 摘要（写到 frontmatter，构建时不再调用 AI）：

```powershell
# 1. 起本地服务（或直接用线上 URL）
npx next start -p 3014

# 2. 另开终端，跑脚本
node scripts/generate-summaries.mjs
```

脚本会读取 `src/content/blog/*.mdx`，逐个调用 `/api/blog-summary`，把结果写到 frontmatter：

```yaml
---
title: "..."
aiSummary: "AI 提炼的一句话核心"
aiQuestions: ["问题1", "问题2", "问题3"]
---
```

之后博客详情页底部会自动显示「AI · 一句话 + 值得继续想」区块。

---

## 🔒 安全机制

- **API Key 永远只在服务端** — 浏览器拿不到
- **每 IP 限频**：
  - rewrite / contact-intro / blog-summary: 5 req/min
  - interview: 10 req/min（多轮对话）
  - ideas: 3 req/min（生成成本高）
- **Prompt injection 检测** — 自动过滤明显攻击模式
- **输入长度限制** — 防止超长输入烧 token
- **优雅降级** — 无 Key / 限频 / API 失败时，前端显示清晰提示，不显示假数据

---

## 💰 成本估算

Agnes AI 免费额度 + 按量计费。个人网站每月几百次调用成本可忽略。

---

## 🐛 故障排查

| 症状 | 原因 | 解决 |
|---|---|---|
| 按钮点击后报"AI 暂未启用" | 没配置 Key | 跑 `vercel env add LLM_API_KEY production` |
| 报"请求太频繁" | Rate limit | 等 60 秒再试，或调大 `checkRateLimit(ip, N)` 的 N |
| 报"服务暂时不可用" | Agnes AI API 挂了 / 网络问题 | 稍后重试；检查 https://status.agnes-ai.com |
| 中文乱码 | 编码问题 | 检查是否用了 UTF-8 传输（我们的实现已处理）|

---

## 🛠️ 想换平台？

`src/lib/deepseek.ts` 通过环境变量抽象，换平台只需改 Vercel 环境变量：

```powershell
# 例：切回 DeepSeek
vercel env add LLM_API_BASE_URL production    # https://api.deepseek.com/v1
vercel env add LLM_MODEL production           # deepseek-chat
```

不用改代码。
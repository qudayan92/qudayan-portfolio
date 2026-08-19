# 🤖 AI Lab · 配置指南

这个目录的 AI 功能由 **DeepSeek** 驱动。要让访客能正常使用，需要站长配置 API Key。

## 🚀 启用 AI（5 分钟）

### 1. 拿 DeepSeek API Key

1. 去 https://platform.deepseek.com 注册
2. 登录后左侧菜单 → **API Keys**
3. 点 **Create new secret key**
4. 复制 Key（格式 `sk-xxxxxxxxxxxxxxxx`，**只显示一次**）

### 2. 配置到 Vercel

**方法 A：CLI（推荐）**

```powershell
cd E:\个人网站
vercel env add DEEPSEEK_API_KEY production
# 提示 Store as sensitive? 输入 Y
# 粘贴 Key
```

如果想 preview 环境也能用：

```powershell
vercel env add DEEPSEEK_API_KEY preview
```

**方法 B：网页**

1. 进 https://vercel.com/dashboard → `qudayan-portfolio`
2. Settings → **Environment Variables**
3. 添加 Key + Value = 你的 DeepSeek Key
4. Environment 选择 **Production**（可选加 Preview）

### 3. 触发重新部署

```powershell
vercel deploy --prod --yes
```

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
# 1. 起本地服务
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

## 💰 成本估算（DeepSeek 价格）

DeepSeek-V3 定价：**1 元/百万 input tokens, 2 元/百万 output tokens**（约 ¥0.001 / 千字）

假设每月 1000 个访客：
- 50% 触发 AI 功能 = 500 次
- 平均每次 500 input + 200 output tokens
- 月成本 ≈ 500 × (0.0005 + 0.0004) ≈ **¥0.45 / 月**

可忽略不计。

---

## 🐛 故障排查

| 症状 | 原因 | 解决 |
|---|---|---|
| 按钮点击后报"AI 暂未启用" | 没配置 Key | 跑 `vercel env add DEEPSEEK_API_KEY production` |
| 报"请求太频繁" | Rate limit | 等 60 秒再试，或调大 `checkRateLimit(ip, N)` 的 N |
| 报"服务暂时不可用" | DeepSeek API 挂了 / 网络问题 | 等几分钟；DeepSeek 状态页 https://status.deepseek.com |
| 流式输出卡住 | 浏览器 / Vercel Edge 超时 | 检查控制台；可以加 `--max-duration 30` 限制运行时 |

---

## 🛠️ 想换模型？

`src/lib/deepseek.ts` 里的常量：

```ts
const DEEPSEEK_MODEL = 'deepseek-chat';  // 改成 'deepseek-reasoner' 等
```

或者直接换 OpenAI / Anthropic 兼容协议：改 `DEEPSEEK_API_URL` 和 header 即可。
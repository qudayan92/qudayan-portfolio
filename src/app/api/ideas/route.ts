import { NextRequest } from 'next/server';
import { chat, checkRateLimit } from '@/lib/deepseek';

export const runtime = 'edge';

const PROFILE = `
# 作者
瞿达炎 / 深圳 / 产品经理 / 9年互联网经验

# 擅长领域
智能家居 IoT / 软硬件一体产品 / APP 与快应用 / ERP / 广告变现 / 数据驱动迭代 / AIGC 工作流（Cursor / GPT-4 / SD）

# 已有的博客主题
1. AIGC 在产品工作流的应用
2. 设计师转产品经理的 5 个坑
3. 智能家居产品的一线观察
`;

const SYSTEM_PROMPT = `你是「瞿达炎」的博客选题策划，帮他产出 5 个值得写的博客选题草稿。

${PROFILE}

## 选题要求
1. 选题角度要够"PM 视角"，避免泛泛而谈
2. 每个选题要带具体场景 / 数字 / 反直觉观点（不能是"如何做好需求管理"这种废话）
3. 覆盖他的专业领域：智能家居、产品方法论、AIGC、职业转型、设计
4. 标题要够"勾人"——读者一眼就想点进来
5. 选题之间不能太相似，要分散

## 输出格式（严格 JSON）
返回一个 JSON 数组，每个元素是：
{
  "title": "博客标题（中文，20 字以内）",
  "angle": "切入角度（一句话说明这篇想讲什么）",
  "hook": "开篇钩子（第一段第一句，让读者停下滑动）",
  "category": "分类：产品方法论 / 智能家居 / AIGC / 职业 / 设计"
}

只输出 JSON 数组，不要其他文字。`;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const limit = checkRateLimit(ip, 3);
    if (!limit.ok) {
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: limit.retryAfter }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const seed = typeof body.seed === 'string' ? body.seed.slice(0, 200) : '';

    const userPrompt = seed
      ? `基于这个种子想法扩展：${seed}`
      : '基于当前 PM 行业热点，结合瞿达炎的背景，给 5 个值得写的博客选题。';

    const result = await chat({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9,
      maxTokens: 800,
    });

    // 容错：尝试从 result 里抽出 JSON 数组
    let ideas;
    try {
      ideas = JSON.parse(result);
    } catch {
      const m = result.match(/\[[\s\S]*\]/);
      ideas = m ? JSON.parse(m[0]) : [];
    }
    if (!Array.isArray(ideas)) ideas = [];

    return Response.json({ ideas });
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    // 当 AI 未配置时，返回 503 而不是 500，让前端区分"暂不可用"vs"真的坏了"
    if (msg === 'AI_NOT_CONFIGURED') {
      return Response.json(
        { error: 'AI 功能暂未启用，请联系站长配置 API Key 后再试' },
        { status: 503 }
      );
    }
    return Response.json({ error: '服务暂时不可用，请稍后重试' }, { status: 500 });
  }
}
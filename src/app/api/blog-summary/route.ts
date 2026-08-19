import { NextRequest } from 'next/server';
import { chat } from '@/lib/deepseek';

export const runtime = 'edge';

const SYSTEM_PROMPT = `你是「瞿达炎」的博客 AI 编辑，为一篇博文生成：
1. 一句话核心摘要（中文，30 字以内）
2. 三个值得读者进一步思考的延伸问题

## 输出格式（严格 JSON）
{
  "summary": "一句话核心摘要",
  "questions": ["问题1", "问题2", "问题3"]
}

要求：
- 摘要要提炼文章最反直觉/最有价值的观点，不要复述标题
- 三个问题要能引出新思考，不能是文章里已经回答过的问题
- 只输出 JSON，不要其他文字`;

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();
    if (!title || !content || typeof content !== 'string' || content.length > 8000) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400 });
    }

    const result = await chat({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `标题：${title}\n\n正文：\n${content.slice(0, 4000)}` },
      ],
      temperature: 0.5,
      maxTokens: 1200,
    });

    let summary;
    try {
      summary = JSON.parse(result);
    } catch {
      // 剥离 ```json 代码块标记
      const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          summary = JSON.parse(m[0]);
        } catch {
          summary = { summary: '', questions: [] };
        }
      } else {
        summary = { summary: '', questions: [] };
      }
    }
    if (!summary || typeof summary !== 'object') summary = { summary: '', questions: [] };

    // 如果结果是空（推理模型偶发：content 为空），重试一次
    if (!summary.summary) {
      try {
        const retry = await chat({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `标题：${title}\n\n正文：\n${content.slice(0, 3000)}` },
          ],
          temperature: 0.3,
          maxTokens: 1500,
        });
        const cleanedRetry = retry.replace(/```json/g, '').replace(/```/g, '').trim();
        const mRetry = cleanedRetry.match(/\{[\s\S]*\}/);
        if (mRetry) {
          const parsedRetry = JSON.parse(mRetry[0]);
          if (parsedRetry?.summary) summary = parsedRetry;
        }
      } catch {
        // 重试失败，保持空结果（前端会显示手填 summary 降级）
      }
    }

    return Response.json(summary);
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg === 'AI_NOT_CONFIGURED') {
      return Response.json(
        { error: 'AI_NOT_CONFIGURED', summary: '', questions: [] },
        { status: 503 }
      );
    }
    return Response.json({ error: 'internal_error', summary: '', questions: [] }, { status: 500 });
  }
}
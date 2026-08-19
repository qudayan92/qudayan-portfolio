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
      maxTokens: 400,
    });

    let summary;
    try {
      summary = JSON.parse(result);
    } catch {
      const m = result.match(/\{[\s\S]*\}/);
      summary = m ? JSON.parse(m[0]) : { summary: '', questions: [] };
    }

    return Response.json(summary);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500 });
  }
}
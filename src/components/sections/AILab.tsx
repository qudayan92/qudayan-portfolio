import { ResumePolish } from '@/components/ai/ResumePolish';
import { InterviewSimulator } from '@/components/ai/InterviewSimulator';
import { BlogIdeas } from '@/components/ai/BlogIdeas';
import { GrowthMetrics } from '@/components/ai/GrowthMetrics';
import { Reveal } from '@/components/motion/Reveal';

export function AILab() {
  return (
    <section id="ai-lab" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-10">
          <div className="flex items-center gap-2">
            <p className="eyebrow">AI Lab · 自生长</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 text-[10px] text-emerald-200">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              live · DeepSeek
            </span>
          </div>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            网站<span className="text-gradient">自己会动</span>。
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-400">
            这一节由 DeepSeek 实时驱动。所有 API 调用走服务端（你的 Key 不暴露给前端），流式响应，逐字生成。失败有兜底，限频保护。
          </p>
        </Reveal>

        <div className="mb-4">
          <GrowthMetrics />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <ResumePolish />
          <InterviewSimulator />
        </div>

        <div className="mt-4">
          <BlogIdeas />
        </div>

        <p className="mt-6 text-xs text-neutral-600">
          <span className="font-mono">runtime:</span> edge · <span className="font-mono">model:</span> deepseek-chat · <span className="font-mono">protocol:</span> SSE stream
        </p>
      </div>
    </section>
  );
}
import { skills } from '@/lib/profile';

const groupLabel: Record<string, string> = {
  '产品': '产品方法论',
  '设计': '设计能力',
  '技术': '技术 / 工具',
  '数据': '数据驱动',
};

const groupOrder: Array<keyof typeof groupLabel> = ['产品', '设计', '数据', '技术'];

export function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">Skills · 技能</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
          工具与方法论<span className="text-gradient">两手抓</span>。
        </h2>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {groupOrder.map((g) => {
            const items = skills.filter((s) => s.group === g);
            return (
              <div key={g} className="glass rounded-2xl p-6">
                <h3 className="text-sm uppercase tracking-widest text-neutral-400">
                  {groupLabel[g]}
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {items.map((s) => (
                    <li key={s.name} className="">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="text-neutral-200">{s.name}</span>
                        <span className="font-mono text-[10px] text-neutral-600">
                          {s.level}/5
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 w-full rounded-full bg-white/[0.04]">
                        <div
                          className="h-1 rounded-full bg-gradient-to-r from-accent-400 to-violet-500 transition-all"
                          style={{ width: `${(s.level / 5) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
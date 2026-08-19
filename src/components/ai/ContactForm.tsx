'use client';

import { useState } from 'react';

type GeneratedMessage = { message: string } | { error: string };

export function ContactForm() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [reason, setReason] = useState('');
  const [generated, setGenerated] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!reason.trim()) {
      setError('请先填写联系原因');
      return;
    }
    setLoading(true);
    setError(null);
    setGenerated('');
    try {
      const r = await fetch('/api/contact-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, reason }),
      });
      const data: GeneratedMessage = await r.json();
      if ('error' in data) throw new Error(data.error);
      setGenerated(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const isUnavailable = error?.includes('AI 功能暂未启用');

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-accent-200 uppercase tracking-widest">AI · 破冰消息</span>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">让 AI 帮你起草开场白</h3>
      <p className="mt-2 text-sm text-neutral-400">
        简单填几个字段，AI 帮你润色成一段专业的破冰消息 — 复制到邮箱 / 微信即可发出。
      </p>

      <div className="mt-5 grid md:grid-cols-2 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="你的称呼（可选）"
          className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm focus:border-accent-400/50 focus:outline-none transition"
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="你的身份（如：XX 公司 HR / 创业者）"
          className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm focus:border-accent-400/50 focus:outline-none transition"
        />
      </div>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder="为什么联系瞿达炎？（如：我们公司在招 PM，看到你的项目经历很合适，想约面试）"
        className="mt-3 w-full rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm focus:border-accent-400/50 focus:outline-none transition resize-none"
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={generate}
          disabled={loading || !reason.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-white text-ink-950 px-5 py-2 text-sm font-medium hover:bg-accent-200 transition disabled:opacity-50"
        >
          {loading ? '生成中...' : '✍️ 生成消息'}
        </button>
        {generated && (
          <button
            onClick={() => navigator.clipboard?.writeText(generated)}
            className="text-sm text-neutral-500 hover:text-white"
          >
            📋 复制
          </button>
        )}
      </div>

      {error && (
        <div className={`mt-3 rounded-lg border p-3 text-sm ${
          isUnavailable
            ? 'border-amber-400/30 bg-amber-400/[0.04] text-amber-200'
            : 'border-rose-400/30 bg-rose-400/[0.04] text-rose-300'
        }`}>
          <div className="font-medium mb-0.5">
            {isUnavailable ? '⏸ AI 暂未启用' : '✗ 出错了'}
          </div>
          <p className="text-xs opacity-90">{error}</p>
        </div>
      )}

      {generated && (
        <div className="mt-5 rounded-lg border border-accent-400/20 bg-accent-400/[0.04] p-4">
          <div className="text-xs text-accent-200 mb-2">建议的开场白</div>
          <p className="text-sm text-neutral-100 leading-relaxed whitespace-pre-wrap">{generated}</p>
        </div>
      )}
    </div>
  );
}
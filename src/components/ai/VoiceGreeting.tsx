'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

const STORAGE_KEY = 'qudayan_voice_on';
const GREETING =
  '你好呀，欢迎来到瞿达炎的个人网站。他是深圳的产品经理，会做产品、也懂设计。想聊聊他的项目，或者你的产品点子，随时点右下角找我聊哦。';

export function VoiceGreeting() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const reduce = useReducedMotion();

  // 读取持久化的静音偏好
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setMuted(saved === 'off');
    } catch {
      // ignore
    }
  }, []);

  // 首次进入：延迟一点，播报欢迎语（用户未静音 && 支持语音合成）
  useEffect(() => {
    if (muted || reduce) return;
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    if (!supported) return;

    let cancelled = false;
    const speak = () => {
      if (cancelled) return;
      try {
        const u = new SpeechSynthesisUtterance(GREETING);
        u.lang = 'zh-CN';
        u.rate = 1.0;
        u.pitch = 1.02;
        const voices = window.speechSynthesis.getVoices();
        const zh = voices.find((v) => v.lang?.toLowerCase().startsWith('zh'));
        if (zh) u.voice = zh;
        window.speechSynthesis.speak(u);
      } catch {
        // 静默失败
      }
    };

    // 首次自动播报（约 1.2s 后）
    const auto = window.setTimeout(speak, 1200);

    // 用户首次交互后再补一次（部分浏览器要求手势触发），若已播过则不重复
    let spoken = false;
    const onFirst = () => {
      if (spoken) return;
      spoken = true;
      speak();
    };
    window.addEventListener('pointerdown', onFirst, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(auto);
      window.removeEventListener('pointerdown', onFirst);
    };
  }, [muted, reduce]);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'off' : 'on');
    } catch {
      // ignore
    }
    if (!next && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(GREETING);
      u.lang = 'zh-CN';
      window.speechSynthesis.speak(u);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <>
      {/* 语音问候提示气泡 */}
      {open && (
        <div className="fixed bottom-28 right-5 z-50 max-w-[15rem] rounded-2xl border border-white/10 bg-ink-900/90 p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-start gap-2">
            <img src="/ip-pm.webp" alt="" className="h-8 w-8 flex-none rounded-full object-cover ring-1 ring-white/20" />
            <p className="text-xs leading-relaxed text-neutral-200">
              你好，我是瞿达炎的 AI 分身 👋 欢迎随时来聊！
            </p>
          </div>
        </div>
      )}
      <button
        onClick={toggle}
        aria-label={muted ? '开启语音问候' : '关闭语音问候'}
        title={muted ? '开启语音问候' : '关闭语音问候'}
        className="fixed bottom-5 right-[5.5rem] z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-ink-800/80 text-neutral-300 backdrop-blur-md transition hover:text-white"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 animate-pulse" />}
      </button>
    </>
  );
}

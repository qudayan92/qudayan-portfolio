'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

const STORAGE_KEY = 'qudayan_voice_on';
const GREETING =
  '你好呀，我是瞿达炎，一名来自深圳的产品经理。过去八年，我从设计师一路做到产品，主导过智能家居、移动应用、快应用，还有企业的 ERP 系统。我习惯用设计师的眼睛看用户，用工程师的脑子做决策。如果你也对好产品感兴趣，或者想跟我聊聊合作，欢迎随时点右下角找我。';

const synthAvailable = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

/** 在已加载的语音里挑一个中文(优先 zh-CN)的；没有就交给浏览器默认。 */
function pickChineseVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  return (
    voices.find((v) => /^zh[-_]CN/i.test(v.lang || '')) ||
    voices.find((v) => /^zh/i.test(v.lang || '')) ||
    voices.find((v) => /Chinese/i.test(v.name || '')) ||
    undefined
  );
}

export function VoiceGreeting() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const reduce = useReducedMotion();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // 读取持久化的静音偏好
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setMuted(saved === 'off');
    } catch {
      // ignore
    }
  }, []);

  // Chrome/Edge 的 getVoices() 首帧可能为空，等 voiceschanged 后再取；这里只标记"语音已就绪"。
  useEffect(() => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
    if (!synth) return;
    const onVoicesChanged = () => synth.getVoices();
    synth.addEventListener('voiceschanged', onVoicesChanged);
    return () => synth.removeEventListener('voiceschanged', onVoicesChanged);
  }, []);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
      audio.onended = null;
      audio.onerror = null;
      audio.onplay = null;
    }
    audioRef.current = null;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setSpeaking(false);
  }, []);

  /** 回退方案：浏览器内置 Web Speech 合成（音色一般，但零依赖、离线可用）。 */
  const playNative = useCallback((text: string) => {
    if (!synthAvailable()) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 1.0;
      u.pitch = 1.0;
      u.volume = 1;
      const zh = pickChineseVoice();
      if (zh) u.voice = zh;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      // Chrome 偶发需要 resume() 兜底，否则"排上号却不响"。
      window.setTimeout(() => {
        try {
          window.speechSynthesis.resume();
        } catch {
          // ignore
        }
      }, 50);
    } catch {
      // ignore
    }
  }, []);

  /** 主路径：优先服务端神经语音合成（真人音色），失败回退内置语音。 */
  const speak = useCallback(
    async (text: string) => {
      stopAudio();
      try {
        const rsp = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (!rsp.ok) throw new Error(`tts_http_${rsp.status}`);
        const blob = await rsp.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        objectUrlRef.current = url;
        audio.volume = 1;
        audio.onplay = () => setSpeaking(true);
        audio.onended = () => stopAudio();
        audio.onerror = () => stopAudio();
        await audio.play();
      } catch {
        // 服务端出不来就回退内置语音
        playNative(text);
      }
    },
    [playNative, stopAudio],
  );

  // 首次进入的欢迎播报：自动尝试 + 用户手势兜底（满足自动播放策略）。用 ref 保证只播一次。
  const spokenRef = useRef(false);
  useEffect(() => {
    if (muted || reduce) return;
    const fire = () => {
      if (spokenRef.current) return;
      spokenRef.current = true;
      speak(GREETING);
    };

    const auto = window.setTimeout(fire, 1200);
    const onFirst = () => fire();
    window.addEventListener('pointerdown', onFirst, { once: true });
    window.addEventListener('keydown', onFirst, { once: true });
    window.addEventListener('touchstart', onFirst, { once: true });

    return () => {
      window.clearTimeout(auto);
      window.removeEventListener('pointerdown', onFirst);
      window.removeEventListener('keydown', onFirst);
      window.removeEventListener('touchstart', onFirst);
    };
  }, [muted, reduce, speak]);

  // 卸载时停止播放
  useEffect(() => () => stopAudio(), [stopAudio]);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'off' : 'on');
    } catch {
      // ignore
    }
    if (!next) {
      speak(GREETING);
    } else {
      if (synthAvailable()) window.speechSynthesis.cancel();
      stopAudio();
    }
  };

  return (
    <>
      {/* 语音问候提示气泡 */}
      {open && (
        <div className="fixed bottom-28 right-5 z-50 max-w-[15rem] rounded-2xl border border-white/10 bg-ink-900/90 p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-start gap-2">
            <img
              src="/ip-pm.webp"
              alt=""
              className="h-8 w-8 flex-none rounded-full object-cover ring-1 ring-white/20"
            />
            <p className="text-xs leading-relaxed text-neutral-200">
              {speaking ? '正在播报…' : '你好，我是瞿达炎的 AI 分身 👋 欢迎随时来聊！'}
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
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className={`h-4 w-4 ${speaking ? 'text-accent-300' : 'animate-pulse'}`} />
        )}
      </button>
    </>
  );
}

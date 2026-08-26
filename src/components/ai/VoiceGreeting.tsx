'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const STORAGE_KEY = 'qudayan_voice_on';
// 简历式个人介绍（第一人称，服务端男声播报）
const GREETING =
  '你好，我是瞿达炎，深圳的产品经理。过去八年，我在智能家居、移动应用、快应用和 ERP 领域，主导过多个从零到一的产品。我做过设计师，也懂工程师，最擅长把复杂的想法变成好用、能落地的产品。如果你正在招人，或者想聊聊产品合作，欢迎随时找我。';

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

  // Chrome/Edge 的 getVoices() 首帧可能为空，等 voiceschanged 后再取
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

  /** 主路径：优先服务端神经语音合成（男声／真人音色），失败回退内置语音。 */
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
        playNative(text);
      }
    },
    [playNative, stopAudio],
  );

  // 进入页面自动播报（每次刷新/重新加载都会重新触发），并保留用户手势兜底以满足自动播放策略
  const spokenRef = useRef(false);
  useEffect(() => {
    if (muted || reduce) return;
    const fire = () => {
      if (spokenRef.current) return;
      spokenRef.current = true;
      speak(GREETING);
    };

    const auto = window.setTimeout(fire, 700);
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

  // 独立站立的 IP 形象：活泼睿智，漂浮发光，并随播报展示介绍文本
  const showPanel = open || speaking;

  return (
    <>
      {showPanel && (
        <div className="fixed bottom-24 right-5 z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/85 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            {/* 活泼漂浮的 IP 头像 */}
            <motion.div
              className="relative h-20 w-20 flex-none"
              animate={reduce ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                aria-hidden
                className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-accent-400/40 via-violet-500/40 to-fuchsia-500/30 blur-md animate-pulse"
              />
              <img
                src="/ip-pm.webp"
                alt="瞿达炎 IP 形象"
                className="relative h-20 w-20 rounded-full object-cover ring-1 ring-white/20"
              />
              {speaking && (
                <span className="absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-400 text-[9px] font-bold text-ink-950">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink-950 animate-pulse-dot" />
                </span>
              )}
            </motion.div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-white">瞿达炎</span>
                <span className="rounded-full border border-accent-400/30 bg-accent-400/10 px-1.5 py-0.5 text-[10px] text-accent-200">
                  产品经理
                </span>
              </div>
              <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-neutral-300">
                {speaking ? GREETING : '你好，我是瞿达炎的 AI 分身 👋 由真人男声为你介绍简历。'}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        aria-label={muted ? '开启语音介绍' : '关闭语音介绍'}
        title={muted ? '开启语音介绍' : '关闭语音介绍'}
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

"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { DRUM_PADS, type DrumPad, type DrumPadId } from "@/data/kit";
import { createNoiseBuffer, playPad } from "@/lib/drumAudio";

export function JazzKit() {
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const [active, setActive] = useState<DrumPadId | null>(null);
  const [ready, setReady] = useState(false);

  const ensureAudio = useEffectEvent(async () => {
    if (!audioRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioRef.current = new Ctx();
      noiseRef.current = createNoiseBuffer(audioRef.current);
    }
    if (audioRef.current.state === "suspended") {
      await audioRef.current.resume();
    }
    setReady(true);
    return audioRef.current;
  });

  const trigger = useEffectEvent(async (pad: DrumPad) => {
    const ctx = await ensureAudio();
    if (!noiseRef.current) return;
    playPad(ctx, pad, noiseRef.current);
    setActive(pad.id);
    window.setTimeout(() => {
      setActive((current) => (current === pad.id ? null : current));
    }, 160);
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const pad = DRUM_PADS.find((item) => item.key === event.key.toLowerCase());
      if (!pad) return;
      event.preventDefault();
      void trigger(pad);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trigger]);

  return (
    <section
      id="kit"
      className="relative mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:px-8"
      aria-label="互動爵士鼓組"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
            Live Kit
          </p>
          <h2 className="mt-2 font-display text-3xl text-ivory sm:text-4xl">
            點擊或按鍵演奏
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          {ready
            ? "音訊已就緒。試 A S D F G H，用 ride 先把 swing 感覺找出來。"
            : "第一次點擊任何鼓面即可開啟 Web Audio。"}
        </p>
      </div>

      <div className="animate-kit relative overflow-hidden rounded-[2rem] border border-white/10 bg-stage/70 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8">
        <div
          aria-hidden
          className="animate-ride pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_68%)]"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {DRUM_PADS.map((pad) => {
            const isActive = active === pad.id;
            return (
              <button
                key={pad.id}
                type="button"
                onClick={() => void trigger(pad)}
                className={`group relative min-h-28 overflow-hidden rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-smoke/90 to-ink/80 p-4 text-left transition duration-150 hover:border-brass/50 hover:from-smoke focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass ${
                  isActive ? "pad-hit border-brass/70 shadow-[0_0_0_1px_var(--brass)]" : ""
                }`}
                aria-label={`${pad.zh} ${pad.label}`}
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-brass uppercase">
                  {pad.key}
                </span>
                <span className="mt-5 block font-display text-2xl text-ivory">
                  {pad.zh}
                </span>
                <span className="mt-1 block text-sm text-muted">{pad.label}</span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brass transition duration-200 group-hover:scale-x-100"
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

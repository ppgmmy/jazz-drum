"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { ChartPattern, DrumVoice } from "@/data/charts";
import {
  createNoiseBuffer,
  getPad,
  hitsAtCell,
  parseTempoBpm,
  playPad,
  secondsPerCell,
  totalCells,
} from "@/lib/drumAudio";

type ChartPlayerProps = {
  pattern: ChartPattern;
  tempo: string;
  voiceLabels?: Partial<Record<DrumVoice, string>>;
  playheadIndex: number | null;
  onPlayheadChange: (index: number | null) => void;
};

export function ChartPlayer({
  pattern,
  tempo,
  voiceLabels,
  playheadIndex,
  onPlayheadChange,
}: ChartPlayerProps) {
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextCellRef = useRef(0);
  const nextTimeRef = useRef(0);

  const defaultBpm = parseTempoBpm(tempo);
  const [bpm, setBpm] = useState(defaultBpm);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const cells = totalCells(pattern);
  const rideIsHat = /hi-?hat|踩鑔|鑔/i.test(voiceLabels?.ride ?? "");

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
    return audioRef.current;
  });

  const clearTimer = useEffectEvent(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  });

  const stop = useEffectEvent(() => {
    clearTimer();
    setPlaying(false);
    nextCellRef.current = 0;
    onPlayheadChange(null);
  });

  const scheduleAhead = useEffectEvent(() => {
    const ctx = audioRef.current;
    const noise = noiseRef.current;
    if (!ctx || !noise) return;

    const step = secondsPerCell(pattern, bpm);
    const horizon = ctx.currentTime + 0.12;

    while (nextTimeRef.current < horizon) {
      const cellIndex = nextCellRef.current;
      if (cellIndex >= cells) {
        if (loop) {
          nextCellRef.current = 0;
          continue;
        }
        stop();
        return;
      }

      const when = nextTimeRef.current;
      const hits = hitsAtCell(pattern, cellIndex, rideIsHat);
      for (const hit of hits) {
        playPad(ctx, getPad(hit.padId), noise, when, hit.velocity);
      }

      // 視覺游標略提前對齊發聲
      const delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
      window.setTimeout(() => {
        onPlayheadChange(cellIndex);
      }, delayMs);

      nextCellRef.current = cellIndex + 1;
      nextTimeRef.current = when + step;
    }
  });

  const start = useEffectEvent(async () => {
    const ctx = await ensureAudio();
    clearTimer();
    nextCellRef.current = playheadIndex ?? 0;
    if (nextCellRef.current >= cells) nextCellRef.current = 0;
    nextTimeRef.current = ctx.currentTime + 0.06;
    setPlaying(true);
    scheduleAhead();
    timerRef.current = window.setInterval(() => scheduleAhead(), 25);
  });

  useEffect(() => {
    return () => {
      clearTimer();
      void audioRef.current?.close();
      audioRef.current = null;
    };
  }, [clearTimer]);

  // 換段／換譜時停掉
  useEffect(() => {
    stop();
    setBpm(parseTempoBpm(tempo));
  }, [pattern, tempo, stop]);

  const bar =
    playheadIndex === null
      ? "-"
      : Math.floor(playheadIndex / (pattern.beatsPerBar * pattern.perBeat)) + 1;
  const beat =
    playheadIndex === null
      ? "-"
      : (Math.floor(playheadIndex / pattern.perBeat) % pattern.beatsPerBar) + 1;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-ink/40 px-3 py-3 print:hidden">
      <button
        type="button"
        onClick={() => {
          if (playing) stop();
          else void start();
        }}
        className="rounded-full bg-brass px-5 py-2 text-sm font-medium text-ink transition hover:bg-brass-hot"
      >
        {playing ? "停止" : "播放鼓聲"}
      </button>

      <button
        type="button"
        onClick={() => {
          stop();
          onPlayheadChange(null);
        }}
        className="rounded-full border border-white/20 px-4 py-2 text-sm text-ivory transition hover:border-brass/50 hover:text-brass-hot"
      >
        重設
      </button>

      <label className="flex items-center gap-2 text-sm text-muted">
        <span className="font-mono text-xs tracking-[0.14em] text-brass uppercase">
          BPM
        </span>
        <input
          type="range"
          min={60}
          max={200}
          value={bpm}
          disabled={playing}
          onChange={(event) => setBpm(Number(event.target.value))}
          className="w-28 accent-[var(--brass)]"
        />
        <span className="w-10 font-mono text-ivory">{bpm}</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={loop}
          onChange={(event) => setLoop(event.target.checked)}
          className="accent-[var(--brass)]"
        />
        循環
      </label>

      <p className="font-mono text-xs text-brass">
        小節 {bar} · 拍 {beat}
        {playheadIndex !== null ? ` · 格 ${playheadIndex + 1}/${cells}` : ""}
      </p>

      <p className="w-full text-xs text-muted sm:w-auto sm:flex-1 sm:text-right">
        只播這段鼓譜的鼓聲，游標會跟著走，方便對譜練習。
      </p>
    </div>
  );
}

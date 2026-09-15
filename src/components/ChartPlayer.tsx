"use client";

import { useEffect, useRef, useState } from "react";
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
  const playingRef = useRef(false);
  const loopRef = useRef(true);
  const bpmRef = useRef(parseTempoBpm(tempo));
  const patternRef = useRef(pattern);
  const rideIsHatRef = useRef(false);
  const onPlayheadChangeRef = useRef(onPlayheadChange);

  const [bpm, setBpm] = useState(() => parseTempoBpm(tempo));
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cells = totalCells(pattern);
  const chartKey = `${tempo}|${pattern.bars}|${pattern.beatsPerBar}|${pattern.perBeat}`;

  patternRef.current = pattern;
  bpmRef.current = bpm;
  loopRef.current = loop;
  playingRef.current = playing;
  onPlayheadChangeRef.current = onPlayheadChange;
  rideIsHatRef.current = /hi-?hat|踩鑔|鑔/i.test(voiceLabels?.ride ?? "");

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopPlayback = () => {
    clearTimer();
    playingRef.current = false;
    setPlaying(false);
    nextCellRef.current = 0;
    onPlayheadChangeRef.current(null);
  };

  const ensureAudio = async () => {
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
  };

  const scheduleAhead = () => {
    const ctx = audioRef.current;
    const noise = noiseRef.current;
    const currentPattern = patternRef.current;
    if (!ctx || !noise || !playingRef.current) return;

    const total = totalCells(currentPattern);
    const step = secondsPerCell(currentPattern, bpmRef.current);
    const horizon = ctx.currentTime + 0.12;

    while (nextTimeRef.current < horizon) {
      const cellIndex = nextCellRef.current;
      if (cellIndex >= total) {
        if (loopRef.current) {
          nextCellRef.current = 0;
          continue;
        }
        stopPlayback();
        return;
      }

      const when = nextTimeRef.current;
      const hits = hitsAtCell(currentPattern, cellIndex, rideIsHatRef.current);
      for (const hit of hits) {
        playPad(ctx, getPad(hit.padId), noise, when, hit.velocity);
      }

      const delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
      const scheduledCell = cellIndex;
      window.setTimeout(() => {
        if (!playingRef.current) return;
        onPlayheadChangeRef.current(scheduledCell);
      }, delayMs);

      nextCellRef.current = cellIndex + 1;
      nextTimeRef.current = when + step;
    }
  };

  const startPlayback = async () => {
    setError(null);
    try {
      const ctx = await ensureAudio();
      clearTimer();
      nextCellRef.current =
        playheadIndex !== null && playheadIndex < cells ? playheadIndex : 0;
      nextTimeRef.current = ctx.currentTime + 0.05;
      playingRef.current = true;
      setPlaying(true);
      scheduleAhead();
      timerRef.current = window.setInterval(scheduleAhead, 25);
    } catch (err) {
      playingRef.current = false;
      setPlaying(false);
      setError(err instanceof Error ? err.message : "無法啟動音訊");
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
      const ctx = audioRef.current;
      audioRef.current = null;
      noiseRef.current = null;
      if (ctx) void ctx.close();
    };
  }, []);

  // 只在換譜／換速度時重設；唔好依賴每次 render 都會變嘅 callback
  useEffect(() => {
    clearTimer();
    playingRef.current = false;
    setPlaying(false);
    nextCellRef.current = 0;
    onPlayheadChangeRef.current(null);
    const nextBpm = parseTempoBpm(tempo);
    bpmRef.current = nextBpm;
    setBpm(nextBpm);
  }, [chartKey, tempo]);

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
          if (playing) stopPlayback();
          else void startPlayback();
        }}
        className="rounded-full bg-brass px-5 py-2 text-sm font-medium text-ink transition hover:bg-brass-hot"
      >
        {playing ? "停止" : "播放鼓聲"}
      </button>

      <button
        type="button"
        onClick={() => stopPlayback()}
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

      {error ? (
        <p className="w-full text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

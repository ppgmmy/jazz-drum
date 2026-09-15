"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChartPattern, DrumVoice } from "@/data/charts";
import { useOptionalSongSync } from "@/components/SongSyncProvider";
import {
  createNoiseBuffer,
  getPad,
  hitsAtCell,
  parseTempoBpm,
  playPad,
  secondsPerCell,
  totalCells,
} from "@/lib/drumAudio";
import {
  getMelodyProfile,
  scheduleMelodyForCell,
} from "@/lib/pianoMelody";

type ChartPlayerProps = {
  pattern: ChartPattern;
  tempo: string;
  voiceLabels?: Partial<Record<DrumVoice, string>>;
  playheadIndex: number | null;
  onPlayheadChange: (index: number | null) => void;
  /** 段落時間窗（秒）——用嚟計段長，唔再硬夾 YouTube */
  songStartSec?: number;
  songEndSec?: number;
  sectionId?: string;
  /** 歌曲 slug，揀對應「琴代歌聲」旋律 */
  melodyId?: string;
  /**
   * 分段練習：到段尾必停，唔准循環過龍。
   * 預設喺有 songEndSec 時開啟。
   */
  strictSection?: boolean;
};

export function ChartPlayer({
  pattern,
  tempo,
  voiceLabels,
  playheadIndex,
  onPlayheadChange,
  songStartSec,
  songEndSec,
  sectionId,
  melodyId,
  strictSection,
}: ChartPlayerProps) {
  const songSync = useOptionalSongSync();
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextCellRef = useRef(0);
  const nextTimeRef = useRef(0);
  const playingRef = useRef(false);
  const loopRef = useRef(true);
  const withMelodyRef = useRef(true);
  const bpmRef = useRef(parseTempoBpm(tempo));
  const patternRef = useRef(pattern);
  const rideIsHatRef = useRef(false);
  const onPlayheadChangeRef = useRef(onPlayheadChange);
  const songStartSecRef = useRef(songStartSec);
  const songEndSecRef = useRef(songEndSec);
  const sectionDeadlineRef = useRef<number | null>(null);
  const reactId = useId();
  const ownerId = sectionId ?? reactId;

  const [bpm, setBpm] = useState(() => parseTempoBpm(tempo));
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [withMelody, setWithMelody] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cells = totalCells(pattern);
  const chartKey = `${tempo}|${pattern.bars}|${pattern.beatsPerBar}|${pattern.perBeat}`;
  const sectionBound =
    strictSection ?? (songEndSec !== undefined && songStartSec !== undefined);
  const hasSectionWindow =
    songStartSec !== undefined && songEndSec !== undefined && songEndSec > songStartSec;
  const melodyProfile = getMelodyProfile(melodyId);

  patternRef.current = pattern;
  bpmRef.current = bpm;
  loopRef.current = loop;
  withMelodyRef.current = withMelody;
  playingRef.current = playing;
  onPlayheadChangeRef.current = onPlayheadChange;
  songStartSecRef.current = songStartSec;
  songEndSecRef.current = songEndSec;
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
    sectionDeadlineRef.current = null;
    onPlayheadChangeRef.current(null);
  };

  const stopPlaybackRef = useRef(stopPlayback);
  stopPlaybackRef.current = stopPlayback;

  useEffect(() => {
    if (!songSync) return;
    return songSync.registerStopper(ownerId, () => {
      stopPlaybackRef.current();
    });
  }, [songSync, ownerId]);

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

  const triggerCell = (
    ctx: AudioContext,
    noise: AudioBuffer,
    cellIndex: number,
    when: number,
  ) => {
    const currentPattern = patternRef.current;
    const hits = hitsAtCell(currentPattern, cellIndex, rideIsHatRef.current);
    for (const hit of hits) {
      playPad(ctx, getPad(hit.padId), noise, when, hit.velocity);
    }
    if (withMelodyRef.current) {
      const secondsPerBeat = 60 / bpmRef.current;
      scheduleMelodyForCell(
        ctx,
        melodyProfile,
        currentPattern,
        cellIndex,
        when,
        secondsPerBeat,
      );
    }
    const delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
    const scheduledCell = cellIndex;
    window.setTimeout(() => {
      if (!playingRef.current) return;
      onPlayheadChangeRef.current(scheduledCell);
    }, delayMs);
  };

  const scheduleAhead = () => {
    const ctx = audioRef.current;
    const noise = noiseRef.current;
    if (!ctx || !noise || !playingRef.current) return;

    const deadline = sectionDeadlineRef.current;
    if (deadline !== null && ctx.currentTime >= deadline - 0.02) {
      stopPlayback();
      return;
    }

    const currentPattern = patternRef.current;
    const total = totalCells(currentPattern);
    const step = secondsPerCell(currentPattern, bpmRef.current);
    const horizon = ctx.currentTime + 0.12;

    while (nextTimeRef.current < horizon) {
      if (deadline !== null && nextTimeRef.current >= deadline) {
        stopPlayback();
        return;
      }

      const cellIndex = nextCellRef.current;
      if (cellIndex >= total) {
        if (loopRef.current || sectionBound) {
          nextCellRef.current = 0;
          continue;
        }
        stopPlayback();
        return;
      }

      triggerCell(ctx, noise, cellIndex, nextTimeRef.current);
      nextCellRef.current = cellIndex + 1;
      nextTimeRef.current = nextTimeRef.current + step;
    }
  };

  const startPlayback = async () => {
    setError(null);
    songSync?.claimPlayback(ownerId);
    try {
      const ctx = await ensureAudio();
      clearTimer();

      const startCell =
        playheadIndex !== null && playheadIndex < cells ? playheadIndex : 0;
      nextCellRef.current = startCell;
      nextTimeRef.current = ctx.currentTime + 0.05;
      playingRef.current = true;
      setPlaying(true);

      if (sectionBound && hasSectionWindow) {
        const windowSec =
          (songEndSecRef.current as number) - (songStartSecRef.current as number);
        sectionDeadlineRef.current = nextTimeRef.current + Math.max(0.5, windowSec);
      } else {
        sectionDeadlineRef.current = null;
      }

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

  useEffect(() => {
    clearTimer();
    playingRef.current = false;
    setPlaying(false);
    nextCellRef.current = 0;
    sectionDeadlineRef.current = null;
    onPlayheadChangeRef.current(null);
    const nextBpm = parseTempoBpm(tempo);
    bpmRef.current = nextBpm;
    setBpm(nextBpm);
    setWithMelody(true);
    setLoop(!(strictSection ?? hasSectionWindow));
  }, [chartKey, tempo, songStartSec, songEndSec, strictSection, hasSectionWindow]);

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
        {playing ? "停止" : withMelody ? "播鼓＋歌聲（琴）" : "播放鼓聲"}
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
        {sectionBound ? "段內鼓型循環（到段尾必停）" : "循環"}
      </label>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={withMelody}
          disabled={playing}
          onChange={(event) => setWithMelody(event.target.checked)}
          className="accent-[var(--brass)]"
        />
        琴代歌聲
      </label>

      <p className="font-mono text-xs text-brass">
        小節 {bar} · 拍 {beat}
        {playheadIndex !== null ? ` · 格 ${playheadIndex + 1}/${cells}` : ""}
      </p>

      <p className="w-full text-xs text-muted sm:w-auto sm:flex-1 sm:text-right">
        {withMelody
          ? sectionBound
            ? "分段練習：輕聲琴＝歌聲位，方便對唱句；到段尾即停，唔搶鼓、唔硬夾原曲。"
            : "輕聲琴代替歌聲線條，對住「唱到邊度」練鼓，音量刻意壓低唔搶鼓。"
          : "只播這段鼓譜的鼓聲，游標會跟著走，方便對譜練習。"}
      </p>

      {error ? (
        <p className="w-full text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

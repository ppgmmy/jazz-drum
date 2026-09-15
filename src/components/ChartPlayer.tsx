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
import { formatClock } from "@/lib/youtube";

type ChartPlayerProps = {
  pattern: ChartPattern;
  tempo: string;
  voiceLabels?: Partial<Record<DrumVoice, string>>;
  playheadIndex: number | null;
  onPlayheadChange: (index: number | null) => void;
  /** 影片對應呢段開始秒數；有值就可跟歌聲 */
  songStartSec?: number;
  /** 呢段喺影片大概結束秒數；跟歌超過就停鼓，避免打入下一段 */
  songEndSec?: number;
  sectionId?: string;
};

/** YouTube seek／起播延遲補償 */
const SONG_LATENCY_SEC = 0.08;

export function ChartPlayer({
  pattern,
  tempo,
  voiceLabels,
  playheadIndex,
  onPlayheadChange,
  songStartSec,
  songEndSec,
  sectionId,
}: ChartPlayerProps) {
  const songSync = useOptionalSongSync();
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextCellRef = useRef(0);
  const nextTimeRef = useRef(0);
  const playingRef = useRef(false);
  const loopRef = useRef(true);
  const withSongRef = useRef(true);
  const bpmRef = useRef(parseTempoBpm(tempo));
  const patternRef = useRef(pattern);
  const rideIsHatRef = useRef(false);
  const onPlayheadChangeRef = useRef(onPlayheadChange);
  const songStartSecRef = useRef(songStartSec);
  const songEndSecRef = useRef(songEndSec);
  const scheduledKeysRef = useRef(new Set<string>());
  const reactId = useId();
  const ownerId = sectionId ?? reactId;

  const [bpm, setBpm] = useState(() => parseTempoBpm(tempo));
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(songStartSec === undefined);
  const [withSong, setWithSong] = useState(songStartSec !== undefined);
  const [error, setError] = useState<string | null>(null);
  const [syncLabel, setSyncLabel] = useState<string | null>(null);

  const cells = totalCells(pattern);
  const chartKey = `${tempo}|${pattern.bars}|${pattern.beatsPerBar}|${pattern.perBeat}`;
  const canFollowSong = songStartSec !== undefined && Boolean(songSync);

  patternRef.current = pattern;
  bpmRef.current = bpm;
  loopRef.current = loop;
  withSongRef.current = withSong;
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

  const stopPlayback = (opts?: { pauseSong?: boolean }) => {
    clearTimer();
    playingRef.current = false;
    setPlaying(false);
    nextCellRef.current = 0;
    scheduledKeysRef.current.clear();
    onPlayheadChangeRef.current(null);
    setSyncLabel(null);
    if (opts?.pauseSong !== false && withSongRef.current) {
      songSync?.pauseSong();
    }
  };

  const stopPlaybackRef = useRef(stopPlayback);
  stopPlaybackRef.current = stopPlayback;

  useEffect(() => {
    if (!songSync) return;
    return songSync.registerStopper(ownerId, () => {
      stopPlaybackRef.current({ pauseSong: false });
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
    const hits = hitsAtCell(patternRef.current, cellIndex, rideIsHatRef.current);
    for (const hit of hits) {
      playPad(ctx, getPad(hit.padId), noise, when, hit.velocity);
    }
    const delayMs = Math.max(0, (when - ctx.currentTime) * 1000);
    const scheduledCell = cellIndex;
    window.setTimeout(() => {
      if (!playingRef.current) return;
      onPlayheadChangeRef.current(scheduledCell);
    }, delayMs);
  };

  const scheduleFree = (ctx: AudioContext, noise: AudioBuffer) => {
    const currentPattern = patternRef.current;
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

      triggerCell(ctx, noise, cellIndex, nextTimeRef.current);
      nextCellRef.current = cellIndex + 1;
      nextTimeRef.current = nextTimeRef.current + step;
    }
  };

  const scheduleWithSong = (ctx: AudioContext, noise: AudioBuffer) => {
    const startSec = songStartSecRef.current;
    if (startSec === undefined) {
      scheduleFree(ctx, noise);
      return;
    }

    const songNowRaw = songSync?.getSongTime() ?? null;
    if (songNowRaw === null) {
      scheduleFree(ctx, noise);
      return;
    }

    const songNow = songNowRaw + SONG_LATENCY_SEC;
    const endSec = songEndSecRef.current;
    if (endSec !== undefined && songNowRaw >= endSec - 0.03) {
      stopPlayback({ pauseSong: true });
      return;
    }

    const currentPattern = patternRef.current;
    const total = totalCells(currentPattern);
    const step = secondsPerCell(currentPattern, bpmRef.current);
    const patternDur = total * step;
    const elapsed = songNow - startSec;

    if (elapsed < -0.2) {
      setSyncLabel("對齊影片中…");
      return;
    }

    if (!loopRef.current && elapsed >= patternDur) {
      stopPlayback({ pauseSong: true });
      return;
    }

    const loopIndex = loopRef.current
      ? Math.max(0, Math.floor(elapsed / patternDur))
      : 0;
    const posInPattern = loopRef.current
      ? ((elapsed % patternDur) + patternDur) % patternDur
      : Math.max(0, elapsed);

    const expectedCell = Math.floor(posInPattern / step);
    const driftMs = Math.round((posInPattern - nextCellRef.current * step) * 1000);
    if (Math.abs(driftMs) > 45) {
      setSyncLabel(`鎖拍 ${driftMs > 0 ? "+" : ""}${driftMs}ms`);
    } else {
      setSyncLabel("已鎖拍");
    }

    const horizonSong = songNow + 0.14;
    let cell = expectedCell;
    let loopCursor = loopIndex;

    if (scheduledKeysRef.current.size > 256) {
      scheduledKeysRef.current.clear();
    }

    for (let guard = 0; guard < total * 3; guard += 1) {
      if (cell >= total) {
        if (!loopRef.current) break;
        cell = 0;
        loopCursor += 1;
      }

      const cellSongTime = startSec + loopCursor * patternDur + cell * step;
      if (endSec !== undefined && cellSongTime >= endSec) break;
      if (cellSongTime > horizonSong) break;

      const key = `${loopCursor}:${cell}`;
      if (!scheduledKeysRef.current.has(key)) {
        scheduledKeysRef.current.add(key);
        const when = ctx.currentTime + (cellSongTime - songNow);
        if (when >= ctx.currentTime - 0.045) {
          triggerCell(ctx, noise, cell, Math.max(when, ctx.currentTime));
        }
      }

      nextCellRef.current = cell;
      cell += 1;
    }
  };

  const scheduleAhead = () => {
    const ctx = audioRef.current;
    const noise = noiseRef.current;
    if (!ctx || !noise || !playingRef.current) return;

    if (withSongRef.current && songStartSecRef.current !== undefined) {
      scheduleWithSong(ctx, noise);
    } else {
      scheduleFree(ctx, noise);
    }
  };

  const startPlayback = async () => {
    setError(null);
    songSync?.claimPlayback(ownerId);
    try {
      const ctx = await ensureAudio();
      clearTimer();
      scheduledKeysRef.current.clear();

      const startCell =
        playheadIndex !== null && playheadIndex < cells ? playheadIndex : 0;
      nextCellRef.current = startCell;
      nextTimeRef.current = ctx.currentTime + 0.05;
      playingRef.current = true;
      setPlaying(true);

      if (withSongRef.current && songStartSecRef.current !== undefined) {
        const step = secondsPerCell(patternRef.current, bpmRef.current);
        const offsetSec = startCell * step;
        songSync?.playSongFrom(songStartSecRef.current + offsetSec);
        setSyncLabel("對齊影片中…");
      } else {
        setSyncLabel(null);
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
    scheduledKeysRef.current.clear();
    onPlayheadChangeRef.current(null);
    const nextBpm = parseTempoBpm(tempo);
    bpmRef.current = nextBpm;
    setBpm(nextBpm);
    setWithSong(songStartSec !== undefined);
    setLoop(songStartSec === undefined);
    setSyncLabel(null);
  }, [chartKey, tempo, songStartSec, songEndSec]);

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
        {playing ? "停止" : canFollowSong && withSong ? "播鼓＋歌" : "播放鼓聲"}
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
        {canFollowSong && withSong ? "鼓型循環（歌繼續）" : "循環"}
      </label>

      {canFollowSong ? (
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={withSong}
            disabled={playing}
            onChange={(event) => {
              setWithSong(event.target.checked);
              if (event.target.checked) setLoop(true);
            }}
            className="accent-[var(--brass)]"
          />
          跟歌聲
          {songStartSec !== undefined ? (
            <span className="font-mono text-xs text-brass">
              {formatClock(songStartSec)}
              {songEndSec !== undefined ? `–${formatClock(songEndSec)}` : ""}
            </span>
          ) : null}
        </label>
      ) : null}

      {syncLabel ? (
        <span className="rounded-full border border-brass/30 bg-brass/10 px-2.5 py-1 font-mono text-[11px] text-brass">
          {syncLabel}
        </span>
      ) : null}

      <p className="font-mono text-xs text-brass">
        小節 {bar} · 拍 {beat}
        {playheadIndex !== null ? ` · 格 ${playheadIndex + 1}/${cells}` : ""}
      </p>

      <p className="w-full text-xs text-muted sm:w-auto sm:flex-1 sm:text-right">
        {canFollowSong && withSong
          ? "鼓聲鎖住影片時間軸：播到邊度鼓就打到邊度，唔會越打越甩拍。"
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

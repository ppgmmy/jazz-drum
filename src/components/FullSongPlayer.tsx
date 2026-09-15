"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChartSection, DrumVoice } from "@/data/charts";
import { useOptionalSongSync } from "@/components/SongSyncProvider";
import {
  createNoiseBuffer,
  getPad,
  hitsAtCell,
  parseTempoBpm,
  playPad,
  secondsPerCell,
} from "@/lib/drumAudio";
import {
  buildSectionMarkers,
  cellInSection,
  findSectionBySongTime,
  type SectionMarker,
} from "@/lib/fullSongChart";
import { formatClock } from "@/lib/youtube";

type FullSongPlayerProps = {
  sections: ChartSection[];
  tempo: string;
  voiceLabels?: Partial<Record<DrumVoice, string>>;
  activeSectionIndex: number;
  onActiveSectionChange: (index: number) => void;
  sectionPlayhead: number | null;
  onSectionPlayheadChange: (index: number | null) => void;
};

const SONG_LATENCY_SEC = 0.08;

export function FullSongPlayer({
  sections,
  tempo,
  voiceLabels,
  activeSectionIndex,
  onActiveSectionChange,
  sectionPlayhead,
  onSectionPlayheadChange,
}: FullSongPlayerProps) {
  const songSync = useOptionalSongSync();
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const timerRef = useRef<number | null>(null);
  const playingRef = useRef(false);
  const withSongRef = useRef(true);
  const bpmRef = useRef(parseTempoBpm(tempo));
  const markersRef = useRef<SectionMarker[]>([]);
  const rideIsHatRef = useRef(false);
  const scheduledKeysRef = useRef(new Set<string>());
  const freeSongTimeRef = useRef(0);
  const freeLastCtxTimeRef = useRef(0);
  const onActiveRef = useRef(onActiveSectionChange);
  const onPlayheadRef = useRef(onSectionPlayheadChange);
  const activeIndexRef = useRef(activeSectionIndex);
  const ownerId = useId();

  const markers = buildSectionMarkers(sections);
  markersRef.current = markers;
  onActiveRef.current = onActiveSectionChange;
  onPlayheadRef.current = onSectionPlayheadChange;
  activeIndexRef.current = activeSectionIndex;
  rideIsHatRef.current = /hi-?hat|踩鑔|鑔/i.test(voiceLabels?.ride ?? "");

  const [bpm, setBpm] = useState(() => parseTempoBpm(tempo));
  const [playing, setPlaying] = useState(false);
  const [withSong, setWithSong] = useState(Boolean(songSync));
  const [error, setError] = useState<string | null>(null);
  const [syncLabel, setSyncLabel] = useState<string | null>(null);

  const songStartSec = markers[0]?.startSec ?? 0;
  const songEndSec = markers[markers.length - 1]?.endSec ?? songStartSec;
  const canFollowSong = Boolean(songSync);
  const activeLabel = markers[activeSectionIndex]?.label ?? "—";

  withSongRef.current = withSong;

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
    scheduledKeysRef.current.clear();
    onPlayheadRef.current(null);
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

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

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

  const readSongTime = (ctx: AudioContext): number | null => {
    if (withSongRef.current) {
      return songSync?.getSongTime() ?? null;
    }
    const now = ctx.currentTime;
    const dt = Math.max(0, now - freeLastCtxTimeRef.current);
    freeLastCtxTimeRef.current = now;
    freeSongTimeRef.current += dt;
    return freeSongTimeRef.current;
  };

  const scheduleAhead = () => {
    const ctx = audioRef.current;
    const noise = noiseRef.current;
    if (!ctx || !noise || !playingRef.current) return;

    const songNowRaw = readSongTime(ctx);
    if (songNowRaw === null) {
      setSyncLabel("對齊影片中…");
      return;
    }

    const songNow = withSongRef.current
      ? songNowRaw + SONG_LATENCY_SEC
      : songNowRaw;

    if (songNowRaw >= songEndSec - 0.03) {
      stopPlayback({ pauseSong: true });
      return;
    }

    const marker = findSectionBySongTime(markersRef.current, songNow);
    if (!marker) return;

    if (marker.index !== activeIndexRef.current) {
      activeIndexRef.current = marker.index;
      onActiveRef.current(marker.index);
      scheduledKeysRef.current.clear();
      document
        .getElementById(`section-${marker.index + 1}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const step = secondsPerCell(marker.pattern, bpmRef.current);
    const localCell = cellInSection(marker, songNow, step);
    onPlayheadRef.current(localCell);

    const horizon = songNow + 0.14;
    const patternDur = marker.cellCount * step;
    let loopCursor =
      patternDur > 0
        ? Math.floor(Math.max(0, songNow - marker.startSec) / patternDur)
        : 0;
    let cell = localCell;

    if (scheduledKeysRef.current.size > 300) scheduledKeysRef.current.clear();

    for (let guard = 0; guard < marker.cellCount * 3; guard += 1) {
      if (cell >= marker.cellCount) {
        cell = 0;
        loopCursor += 1;
      }
      const cellSongTime =
        marker.startSec + loopCursor * patternDur + cell * step;
      if (cellSongTime >= marker.endSec || cellSongTime >= songEndSec) break;
      if (cellSongTime > horizon) break;

      const key = `${marker.index}:${loopCursor}:${cell}`;
      if (!scheduledKeysRef.current.has(key)) {
        scheduledKeysRef.current.add(key);
        const when = ctx.currentTime + (cellSongTime - songNow);
        if (when >= ctx.currentTime - 0.045) {
          const hits = hitsAtCell(marker.pattern, cell, rideIsHatRef.current);
          const playAt = Math.max(when, ctx.currentTime);
          for (const hit of hits) {
            playPad(ctx, getPad(hit.padId), noise, playAt, hit.velocity);
          }
        }
      }
      cell += 1;
    }

    setSyncLabel(
      withSongRef.current
        ? `全曲 · ${formatClock(songNowRaw)}`
        : "全曲（只鼓）",
    );
  };

  const startPlayback = async () => {
    setError(null);
    songSync?.claimPlayback(ownerId);
    try {
      const ctx = await ensureAudio();
      clearTimer();
      scheduledKeysRef.current.clear();
      freeSongTimeRef.current = songStartSec;
      freeLastCtxTimeRef.current = ctx.currentTime;
      playingRef.current = true;
      setPlaying(true);
      activeIndexRef.current = 0;
      onActiveRef.current(0);
      onPlayheadRef.current(0);

      if (withSongRef.current && songSync) {
        songSync.playSongFrom(songStartSec);
        setSyncLabel("對齊影片中…");
      } else {
        setSyncLabel("全曲（只鼓）");
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

  return (
    <div className="mb-6 rounded-2xl border border-brass/35 bg-brass/5 px-3 py-3 print:hidden sm:px-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-brass uppercase">
          Full Song Run
        </p>
        <span className="rounded-full border border-brass/40 bg-ink/40 px-2.5 py-0.5 text-xs text-ivory">
          而家：{activeLabel}
        </span>
        {sectionPlayhead !== null ? (
          <span className="font-mono text-[11px] text-muted">
            格 {sectionPlayhead + 1}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (playing) stopPlayback();
            else void startPlayback();
          }}
          className="rounded-full bg-brass px-5 py-2 text-sm font-medium text-ink transition hover:bg-brass-hot"
        >
          {playing
            ? "停止"
            : canFollowSong && withSong
              ? "全曲鼓＋歌"
              : "全曲播鼓"}
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

        {canFollowSong ? (
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={withSong}
              disabled={playing}
              onChange={(event) => setWithSong(event.target.checked)}
              className="accent-[var(--brass)]"
            />
            跟歌聲
            <span className="font-mono text-xs text-brass">
              {formatClock(songStartSec)}–{formatClock(songEndSec)}
            </span>
          </label>
        ) : null}

        {syncLabel ? (
          <span className="rounded-full border border-brass/30 bg-brass/10 px-2.5 py-1 font-mono text-[11px] text-brass">
            {syncLabel}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-muted">
        由頭一路打到尾：影片同鼓一齊走，下面譜會跟住跳去而家嗰段，游標顯示打到邊格。
      </p>

      {error ? (
        <p className="mt-2 text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

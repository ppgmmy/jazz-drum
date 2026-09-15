"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { YTPlayer } from "@/lib/youtube";

type Stopper = () => void;

type SongSyncContextValue = {
  ready: boolean;
  registerPlayer: (player: YTPlayer | null) => void;
  /** 由某秒開始播歌（歌聲），並把音量調到可聽到但不蓋鼓 */
  playSongFrom: (startSec: number, volume?: number) => void;
  pauseSong: () => void;
  /** 同一時間只得一段鼓譜播放：claim 會停其他段 */
  claimPlayback: (ownerId: string) => void;
  registerStopper: (ownerId: string, stop: Stopper) => () => void;
};

const SongSyncContext = createContext<SongSyncContextValue | null>(null);

const DEFAULT_SONG_VOLUME = 42;

export function SongSyncProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<YTPlayer | null>(null);
  const stoppersRef = useRef(new Map<string, Stopper>());
  const ownerRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  const registerPlayer = useCallback((player: YTPlayer | null) => {
    playerRef.current = player;
    setReady(Boolean(player));
  }, []);

  const pauseSong = useCallback(() => {
    try {
      playerRef.current?.pauseVideo();
    } catch {
      // player 可能已銷毀
    }
  }, []);

  const playSongFrom = useCallback((startSec: number, volume = DEFAULT_SONG_VOLUME) => {
    const player = playerRef.current;
    if (!player) return;
    try {
      player.setVolume(Math.max(0, Math.min(100, volume)));
      player.seekTo(Math.max(0, startSec), true);
      player.playVideo();
    } catch {
      // ignore
    }
  }, []);

  const claimPlayback = useCallback((ownerId: string) => {
    // 停晒其他段（唔淨係上一個 owner），避免漏停
    for (const [id, stop] of stoppersRef.current) {
      if (id === ownerId) continue;
      try {
        stop();
      } catch {
        // ignore
      }
    }
    ownerRef.current = ownerId;
  }, []);

  const registerStopper = useCallback((ownerId: string, stop: Stopper) => {
    stoppersRef.current.set(ownerId, stop);
    return () => {
      const current = stoppersRef.current.get(ownerId);
      if (current === stop) stoppersRef.current.delete(ownerId);
      if (ownerRef.current === ownerId) ownerRef.current = null;
    };
  }, []);

  const value = useMemo(
    () => ({
      ready,
      registerPlayer,
      playSongFrom,
      pauseSong,
      claimPlayback,
      registerStopper,
    }),
    [
      ready,
      registerPlayer,
      playSongFrom,
      pauseSong,
      claimPlayback,
      registerStopper,
    ],
  );

  return (
    <SongSyncContext.Provider value={value}>{children}</SongSyncContext.Provider>
  );
}

export function useSongSync(): SongSyncContextValue {
  const ctx = useContext(SongSyncContext);
  if (!ctx) {
    throw new Error("useSongSync 必須包在 SongSyncProvider 內");
  }
  return ctx;
}

/** 頁面無 Provider 時（例如預覽）唔爆 */
export function useOptionalSongSync(): SongSyncContextValue | null {
  return useContext(SongSyncContext);
}

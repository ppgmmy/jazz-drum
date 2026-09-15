"use client";

import { useEffect, useId, useRef } from "react";
import { useSongSync } from "@/components/SongSyncProvider";
import { loadYouTubeApi } from "@/lib/youtube";

type SongPlayerProps = {
  youtubeId: string;
  title: string;
  artist: string;
};

export function SongPlayer({ youtubeId, title, artist }: SongPlayerProps) {
  const { registerPlayer } = useSongSync();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId().replace(/:/g, "");
  const elementId = `yt-host-${reactId}`;

  useEffect(() => {
    let cancelled = false;
    let player: { destroy: () => void } | null = null;

    void (async () => {
      try {
        const YT = await loadYouTubeApi();
        if (cancelled || !hostRef.current) return;

        player = new YT.Player(hostRef.current, {
          videoId: youtubeId,
          width: "100%",
          height: "100%",
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            ...(typeof window !== "undefined"
              ? { origin: window.location.origin }
              : {}),
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              registerPlayer(event.target);
            },
          },
        });
      } catch {
        // 嵌入失敗時保留下方 fallback iframe
      }
    })();

    return () => {
      cancelled = true;
      registerPlayer(null);
      try {
        player?.destroy();
      } catch {
        // ignore
      }
    };
  }, [youtubeId, registerPlayer]);

  return (
    <section className="print:hidden" aria-label="歌曲影片">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
            Full Song
          </p>
          <h2 className="mt-2 font-display text-2xl text-ivory sm:text-3xl">
            先聽成首歌
          </h2>
          <p className="mt-2 text-sm text-muted">
            {artist} — {title}
            （參考聽歌用；播鼓譜時用輕聲琴代替歌聲，唔搶鼓、唔硬夾影片）
          </p>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-brass transition hover:text-brass-hot"
        >
          於 YouTube 開啟 ↗
        </a>
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="relative aspect-video w-full">
          <div
            ref={hostRef}
            id={elementId}
            className="absolute inset-0 h-full w-full"
          />
          {/* API 未就緒前嘅後備；Player 建好後會取代內容 */}
          <noscript>
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
              title={`${title} — ${artist}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </noscript>
        </div>
      </div>
    </section>
  );
}

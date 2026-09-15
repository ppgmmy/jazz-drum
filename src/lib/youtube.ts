export type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  destroy: () => void;
};

type YTPlayerOptions = {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onError?: (event: { data: number }) => void;
    onStateChange?: (event: { data: number; target: YTPlayer }) => void;
  };
};

type YTNamespace = {
  Player: new (
    elementId: string | HTMLElement,
    options: YTPlayerOptions,
  ) => YTPlayer;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** 載入 YouTube IFrame API（全頁共用一次） */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API 只能在瀏覽器使用"));
  }
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    const prior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prior?.();
      if (window.YT) resolve(window.YT);
      else reject(new Error("YouTube API 載入失敗"));
    };

    if (!document.querySelector("script[data-yt-iframe-api]")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.dataset.ytIframeApi = "true";
      script.onerror = () => reject(new Error("無法載入 YouTube API"));
      document.head.appendChild(script);
    }
  });

  return apiPromise;
}

export function formatClock(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

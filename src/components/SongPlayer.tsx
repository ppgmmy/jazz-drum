type SongPlayerProps = {
  youtubeId: string;
  title: string;
  artist: string;
};

export function SongPlayer({ youtubeId, title, artist }: SongPlayerProps) {
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
            {artist} — {title}（跟影片對段落再打鼓）
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
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
            title={`${title} — ${artist}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
}

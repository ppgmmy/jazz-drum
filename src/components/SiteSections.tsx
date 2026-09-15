import Link from "next/link";
import { DRUM_CHARTS, type ChartLevel } from "@/data/charts";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-5 pt-6 sm:px-8 print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight text-ivory">
          Soft Ride
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <a href="/#kit" className="transition hover:text-ivory">
            鼓組
          </a>
          <a href="/#feel" className="hidden transition hover:text-ivory sm:inline">
            感覺
          </a>
          <Link href="/resources" className="transition hover:text-ivory">
            資源庫
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 55% at 70% 35%, rgba(212,162,76,0.16), transparent 60%), linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.03) 42%, transparent 44%)",
        }}
      />
      <div
        aria-hidden
        className="animate-ride pointer-events-none absolute right-[-12%] top-[12%] -z-10 h-[58vmin] w-[58vmin] rounded-full border border-brass/25 bg-[radial-gradient(circle_at_35%_35%,rgba(240,197,109,0.35),rgba(138,106,58,0.12)_42%,transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-8%] left-[-10%] -z-10 h-[42vmin] w-[42vmin] rounded-full bg-[radial-gradient(circle,rgba(90,120,160,0.28),transparent_70%)] blur-2xl"
      />

      <div className="mx-auto flex min-h-[72svh] max-w-6xl flex-col justify-center">
        <p className="animate-rise font-display text-[clamp(3.4rem,12vw,8.5rem)] leading-[0.9] tracking-[-0.03em] text-ivory">
          Soft Ride
        </p>
        <h1 className="animate-rise-delay-1 mt-6 max-w-2xl font-display text-[clamp(1.6rem,4vw,2.6rem)] leading-tight text-brass-hot">
          把爵士鼓的時間感，練成身體記憶。
        </h1>
        <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          從 ride 線條、swing 呼吸到歌曲鼓譜——一個給鼓手找回 pocket 的練習空間。
        </p>
        <div className="animate-rise-delay-2 mt-9 flex flex-wrap gap-3">
          <a
            href="#kit"
            className="inline-flex items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-brass-hot"
          >
            開始敲鼓
          </a>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm text-ivory transition hover:border-brass/50 hover:text-brass-hot"
          >
            打開資源庫
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FeelSection() {
  return (
    <section id="feel" className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
      <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
        The Feel
      </p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl text-ivory sm:text-4xl">
        爵士鼓先練感覺，再談速度。
      </h2>
      <div className="mt-10 grid gap-10 sm:grid-cols-3">
        {[
          {
            title: "Swing 感覺",
            body: "把八分音符彈成「長—短」的呼吸，而不是機械均分。Ride 手先定速，其餘聲部跟著走。",
          },
          {
            title: "Ride 圖案",
            body: "經典「叮—叮叮」要輕、連、帶一點延音。先單手練 2 小節，再加 hi-hat 腳。",
          },
          {
            title: "Brush 觸感",
            body: "刷片在小鼓上畫圓，重點是摩擦聲的厚度，不是敲擊。試著讓 sweep 與 ride 同呼吸。",
          },
        ].map((lesson) => (
          <article key={lesson.title} className="border-t border-white/15 pt-5">
            <h3 className="font-display text-xl text-brass-hot">{lesson.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{lesson.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PracticeSection() {
  return (
    <section id="practice" className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:px-8">
      <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
        Practice Path
      </p>
      <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">
        三步把 groove 鎖進 pocket
      </h2>
      <ol className="mt-10 space-y-6">
        {[
          {
            step: "01",
            title: "四分 Ride",
            detail: "只打 Ride 四分，腳踩 2 與 4，聽自己的時間是否穩定。",
          },
          {
            step: "02",
            title: "加 Snare 反拍",
            detail: "在 2、4 輕輕放 snare，保持 ride 線條不被打斷。",
          },
          {
            step: "03",
            title: "Kick 對位",
            detail: "用大鼓補和聲節奏，寧可少打，也要落在 pocket 裡。",
          },
        ].map((item) => (
          <li
            key={item.step}
            className="grid gap-2 border-l border-brass/40 pl-5 sm:grid-cols-[5rem_1fr] sm:items-baseline sm:gap-6"
          >
            <span className="font-mono text-sm tracking-[0.18em] text-brass">
              {item.step}
            </span>
            <div>
              <h3 className="font-display text-2xl text-ivory">{item.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const LEVEL_STYLE: Record<ChartLevel, string> = {
  入門: "text-brass",
  進階: "text-brass-hot",
  挑戰: "text-ivory",
};

export function ResourcesTeaser() {
  const preview = DRUM_CHARTS.slice(0, 4);

  return (
    <section id="charts" className="mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
            Chart Library
          </p>
          <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">
            資源庫：歌曲鼓譜
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            So What、Take Five、Blue Train… 把經典 groove 變成可練、可印的譜。
          </p>
        </div>
        <Link
          href="/resources"
          className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm text-ivory transition hover:border-brass/50 hover:text-brass-hot"
        >
          看全部鼓譜
        </Link>
      </div>

      <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {preview.map((chart) => (
          <li key={chart.slug}>
            <Link
              href={`/resources/${chart.slug}`}
              className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div>
                <p className="font-display text-xl text-ivory transition group-hover:text-brass-hot sm:text-2xl">
                  {chart.title}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {chart.artist} · {chart.style}
                </p>
              </div>
              <span
                className={`font-mono text-xs tracking-[0.18em] uppercase ${LEVEL_STYLE[chart.level]}`}
              >
                {chart.level}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-5 py-8 sm:px-8 print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-ivory">Soft Ride｜爵士鼓</p>
        <p>用 ride 呼吸，讓時間自己說話。</p>
      </div>
    </footer>
  );
}

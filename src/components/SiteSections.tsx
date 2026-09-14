import { FEEL_LESSONS, PRACTICE_PATH } from "@/data/kit";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-5 pt-6 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="#top" className="font-display text-xl tracking-tight text-ivory">
          Soft Ride
        </a>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <a href="#kit" className="transition hover:text-ivory">
            鼓組
          </a>
          <a href="#feel" className="transition hover:text-ivory">
            感覺
          </a>
          <a href="#practice" className="hidden transition hover:text-ivory sm:inline">
            練習
          </a>
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
          從 ride 線條、swing 呼吸到 brush 觸感——一個給鼓手找回 pocket 的練習空間。
        </p>
        <div className="animate-rise-delay-2 mt-9 flex flex-wrap gap-3">
          <a
            href="#kit"
            className="inline-flex items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-brass-hot"
          >
            開始敲鼓
          </a>
          <a
            href="#practice"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm text-ivory transition hover:border-brass/50 hover:text-brass-hot"
          >
            看練習路徑
          </a>
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
        {FEEL_LESSONS.map((lesson) => (
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
    <section id="practice" className="mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8">
      <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
        Practice Path
      </p>
      <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">
        三步把 groove 鎖進 pocket
      </h2>
      <ol className="mt-10 space-y-6">
        {PRACTICE_PATH.map((item) => (
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

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-ivory">Soft Ride｜爵士鼓</p>
        <p>用 ride 呼吸，讓時間自己說話。</p>
      </div>
    </footer>
  );
}

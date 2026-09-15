import Link from "next/link";
import {
  DRUM_CHARTS,
  GENRE_LABELS,
  type ChartGenre,
  type ChartLevel,
} from "@/data/charts";
import { SiteFooter, SiteHeader } from "@/components/SiteSections";

const GENRE_ORDER: ChartGenre[] = ["pop", "jazz"];
const LEVEL_ORDER: ChartLevel[] = ["入門", "進階", "挑戰"];

export const metadata = {
  title: "資源庫｜Soft Ride 鼓譜",
  description:
    "爵士與流行歌曲鼓譜練習庫：Billie Jean、晴天、So What、Take Five 等 groove 譜面。",
};

export default function ResourcesPage() {
  const sections = GENRE_ORDER.map((genre) => ({
    genre,
    label: GENRE_LABELS[genre],
    levels: LEVEL_ORDER.map((level) => ({
      level,
      charts: DRUM_CHARTS.filter(
        (chart) => chart.genre === genre && chart.level === level,
      ),
    })).filter((group) => group.charts.length > 0),
  }));

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
            Chart Library
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,6vw,4rem)] leading-tight text-ivory">
            資源庫：歌曲鼓譜
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            爵士 groove 與流行經典並排：可練習、可下載、可列印。先鎖時間感，再玩花巧。
          </p>

          <div className="mt-8 flex flex-wrap gap-3 print:hidden">
            {GENRE_ORDER.map((genre) => (
              <a
                key={genre}
                href={`#${genre}`}
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-muted transition hover:border-brass/40 hover:text-brass-hot"
              >
                {GENRE_LABELS[genre]}
              </a>
            ))}
          </div>

          <div className="mt-14 space-y-20">
            {sections.map((section) => (
              <section key={section.genre} id={section.genre}>
                <h2 className="font-display text-3xl text-ivory sm:text-4xl">
                  {section.label}
                </h2>
                <div className="mt-8 space-y-12">
                  {section.levels.map((group) => (
                    <div key={group.level}>
                      <h3 className="font-display text-xl text-brass-hot">
                        {group.level}
                      </h3>
                      <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                        {group.charts.map((chart) => (
                          <li key={chart.slug}>
                            <Link
                              href={`/resources/${chart.slug}`}
                              className="group flex flex-col gap-2 py-5 transition sm:flex-row sm:items-baseline sm:justify-between"
                            >
                              <div>
                                <p className="font-display text-2xl text-ivory transition group-hover:text-brass-hot">
                                  {chart.title}
                                </p>
                                <p className="mt-1 text-sm text-muted">
                                  {chart.artist} · {chart.style}
                                </p>
                              </div>
                              <p className="font-mono text-xs tracking-[0.18em] text-brass uppercase">
                                {chart.meter} · {chart.tempo}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

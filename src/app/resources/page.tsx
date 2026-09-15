import Link from "next/link";
import { DRUM_CHARTS, type ChartLevel } from "@/data/charts";
import { SiteFooter, SiteHeader } from "@/components/SiteSections";

const LEVEL_ORDER: ChartLevel[] = ["入門", "進階", "挑戰"];

export const metadata = {
  title: "資源庫｜Soft Ride 爵士鼓譜",
  description:
    "經典爵士歌曲鼓譜練習庫：So What、Take Five、Blue Train 等 groove 譜面。",
};

export default function ResourcesPage() {
  const grouped = LEVEL_ORDER.map((level) => ({
    level,
    charts: DRUM_CHARTS.filter((chart) => chart.level === level),
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
            精選經典爵士曲 groove，整理成可練習、可下載的鼓譜。先鎖時間感，再進 solo。
          </p>

          <div className="mt-14 space-y-14">
            {grouped.map((group) => (
              <section key={group.level}>
                <h2 className="font-display text-2xl text-brass-hot">
                  {group.level}
                </h2>
                <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
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
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

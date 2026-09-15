import Link from "next/link";
import { notFound } from "next/navigation";
import { ChartActions } from "@/components/ChartActions";
import { DrumChartView } from "@/components/DrumChartView";
import { SongPlayer } from "@/components/SongPlayer";
import { SiteFooter, SiteHeader } from "@/components/SiteSections";
import { getAllChartSlugs } from "@/data/charts";
import { getSongChart } from "@/data/getSongChart";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllChartSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const chart = getSongChart(slug);
  if (!chart) {
    return { title: "鼓譜｜Soft Ride" };
  }
  return {
    title: `${chart.title} 鼓譜｜Soft Ride`,
    description: `${chart.artist} — ${chart.title}：先聽成首歌，再分段練鼓譜。`,
  };
}

export default async function ChartPage({ params }: PageProps) {
  const { slug } = await params;
  const chart = getSongChart(slug);
  if (!chart) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/resources"
            className="text-sm text-muted transition hover:text-brass-hot print:hidden"
          >
            ← 返回資源庫
          </Link>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
                {chart.level} · {chart.style}
              </p>
              <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,3.6rem)] text-ivory">
                {chart.title}
              </h1>
              <p className="mt-2 text-muted">{chart.artist}</p>
            </div>
            <p className="font-mono text-sm tracking-[0.14em] text-brass">
              {chart.meter} · {chart.tempo}
            </p>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
            {chart.summary}
          </p>

          {chart.youtubeId ? (
            <div className="mt-10">
              <SongPlayer
                youtubeId={chart.youtubeId}
                title={chart.title}
                artist={chart.artist}
              />
            </div>
          ) : null}

          <section className="mt-10 print:hidden">
            <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
              Song Form
            </p>
            <h2 className="mt-2 font-display text-2xl text-ivory">歌曲結構</h2>
            <ol className="mt-5 flex flex-wrap gap-2">
              {chart.form.map((part, index) => (
                <li
                  key={`${part}-${index}`}
                  className="border border-white/15 px-3 py-1.5 text-sm text-muted"
                >
                  <span className="mr-2 font-mono text-brass">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {part}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12">
            <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase print:hidden">
              Drum Charts
            </p>
            <h2 className="mt-2 font-display text-2xl text-ivory sm:text-3xl">
              分段鼓譜
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted print:hidden">
              播放上面歌曲，對到該段再打。每段可分開下載或列印。
            </p>

            <div className="mt-8 space-y-12">
              {chart.sections.map((section, index) => {
                const svgId = `chart-${chart.slug}-${index}`;
                return (
                  <article key={section.label} className="scroll-mt-28">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl text-brass-hot sm:text-2xl">
                          {section.label}
                        </h3>
                        {section.description ? (
                          <p className="mt-2 max-w-2xl text-sm text-muted">
                            {section.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="print:hidden">
                        <ChartActions title={`${chart.title}-${section.label}`} chartSvgId={svgId} />
                      </div>
                    </div>
                    <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-ivory/95 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-5 print:border-0 print:bg-white print:p-0 print:shadow-none">
                      <DrumChartView
                        id={svgId}
                        title={chart.title}
                        sectionLabel={section.label}
                        meter={chart.meter}
                        tempo={chart.tempo}
                        pattern={section.pattern}
                        voiceLabels={chart.voiceLabels}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-12 border-t border-white/10 pt-8 print:hidden">
            <h2 className="font-display text-2xl text-ivory">怎麼跟歌練</h2>
            <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
              <li>1. 先完整聽一次，記住前奏／主歌／副歌何時進來。</li>
              <li>2. 只練對應段落的鼓譜，循環到能對上影片。</li>
              <li>3. 再開歌，從該段切入實打。</li>
              <li>4. 整首串起來：寧可少花，也要穩在 pocket。</li>
            </ol>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

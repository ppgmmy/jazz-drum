import Link from "next/link";
import { notFound } from "next/navigation";
import { ChartNotationPanel } from "@/components/ChartNotationPanel";
import { SongPlayer } from "@/components/SongPlayer";
import { SongSyncProvider } from "@/components/SongSyncProvider";
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
    description: `${chart.artist} — ${chart.title}：全曲結構鼓譜，按段落順序跟歌打完整首。`,
  };
}

export default async function ChartPage({ params }: PageProps) {
  const { slug } = await params;
  const chart = getSongChart(slug);
  if (!chart) notFound();

  return (
    <>
      <SiteHeader />
      <SongSyncProvider>
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
                Full Song Roadmap
              </p>
              <h2 className="mt-2 font-display text-2xl text-ivory">全曲結構</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted">
                由上到下＝整首歌打法。點段落可跳到對應鼓譜。播鼓時勾「跟歌聲」，影片會跳去該段，方便對住歌邊度。
              </p>
              <ol className="mt-5 flex flex-wrap gap-2">
                {chart.form.map((part, index) => (
                  <li key={`${part}-${index}`}>
                    <a
                      href={`#section-${index + 1}`}
                      className="block border border-white/15 px-3 py-1.5 text-sm text-muted transition hover:border-brass/50 hover:text-brass-hot"
                    >
                      <span className="mr-2 font-mono text-brass">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {part}
                    </a>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-12">
              <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase print:hidden">
                Full Song Charts
              </p>
              <h2 className="mt-2 font-display text-2xl text-ivory sm:text-3xl">
                全曲鼓譜
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted print:hidden">
                共 {chart.sections.length}{" "}
                段，按歌曲結構順序排列；多數段落為 8
                小節可循環樂句（含 ghost／fill）。預設五線鼓譜，可切格子譜。撳「播鼓＋歌」＝鼓聲同影片歌聲一齊出，聽住就知打到邊段。
              </p>

              <div className="mt-8 space-y-12">
                {chart.sections.map((section, index) => {
                  const svgIdBase = `chart-${chart.slug}-${index}`;
                  const bars = section.pattern.bars;
                  return (
                    <article
                      key={section.label}
                      id={`section-${index + 1}`}
                      className="scroll-mt-28"
                    >
                      <div className="mb-4">
                        <p className="font-mono text-xs tracking-[0.18em] text-brass">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(chart.sections.length).padStart(2, "0")} ·{" "}
                          {bars} 小節
                          {section.startSec !== undefined
                            ? ` · 影片 ${Math.floor(section.startSec / 60)}:${String(
                                Math.floor(section.startSec % 60),
                              ).padStart(2, "0")}`
                            : ""}
                        </p>
                        <h3 className="mt-1 font-display text-xl text-brass-hot sm:text-2xl">
                          {section.label}
                        </h3>
                        {section.description ? (
                          <p className="mt-2 max-w-2xl text-sm text-muted">
                            {section.description}
                          </p>
                        ) : null}
                      </div>
                      <ChartNotationPanel
                        svgIdBase={svgIdBase}
                        downloadTitle={`${chart.title}-${section.label}`}
                        title={chart.title}
                        sectionLabel={section.label}
                        meter={chart.meter}
                        tempo={chart.tempo}
                        pattern={section.pattern}
                        voiceLabels={chart.voiceLabels}
                        songStartSec={
                          chart.youtubeId ? section.startSec : undefined
                        }
                        sectionId={`${chart.slug}-${index}`}
                      />
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="mt-12 border-t border-white/10 pt-8 print:hidden">
              <h2 className="font-display text-2xl text-ivory">怎麼打完整首</h2>
              <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
                <li>1. 先聽完整首歌，對照上方「全曲結構」記住進出位置。</li>
                <li>2. 逐段練熟：勾「跟歌聲」播鼓＋歌，聽住對到去邊段。</li>
                <li>3. 再開影片由第 1 段順打到最後，中間只換譜不換感覺。</li>
                <li>4. 整首串連：寧可少花，也要穩在 pocket。</li>
              </ol>
            </section>
          </div>
        </main>
      </SongSyncProvider>
      <SiteFooter />
    </>
  );
}

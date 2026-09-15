import Link from "next/link";
import { notFound } from "next/navigation";
import { SongChartWorkspace } from "@/components/SongChartWorkspace";
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
    description: `${chart.artist} — ${chart.title}：全曲結構鼓譜，鼓聲配輕聲琴（代替歌聲）練習。`,
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
                由上到下＝整首歌打法。點段落可跳到對應鼓譜。播鼓時勾「琴代歌聲」：輕聲琴＝歌聲位，方便對唱句，唔搶鼓、唔硬夾 YouTube 原曲。
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
                段。可揀「全曲直落」由頭打到尾，或者「分段練習」逐段練（到段尾即停）。
              </p>

              <div className="mt-8">
                <SongChartWorkspace
                  slug={chart.slug}
                  title={chart.title}
                  meter={chart.meter}
                  tempo={chart.tempo}
                  voiceLabels={chart.voiceLabels}
                  sections={chart.sections}
                />
              </div>
            </section>

            <section className="mt-12 border-t border-white/10 pt-8 print:hidden">
              <h2 className="font-display text-2xl text-ivory">怎麼打完整首</h2>
              <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
                <li>1. 可先聽上方參考影片，對照「全曲結構」記住進出位置。</li>
                <li>2. 「分段練習」：鼓＋琴代歌聲播到段尾即停，唔會過龍。想一次聽晒就用「全曲直落」。</li>
                <li>3. 「全曲直落」：一個掣由頭打到尾，譜會跟住跳去而家嗰段。</li>
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

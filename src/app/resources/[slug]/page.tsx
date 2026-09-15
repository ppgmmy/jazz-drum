import Link from "next/link";
import { notFound } from "next/navigation";
import { ChartActions } from "@/components/ChartActions";
import { DrumChartView } from "@/components/DrumChartView";
import { SiteFooter, SiteHeader } from "@/components/SiteSections";
import { getAllChartSlugs, getChart } from "@/data/charts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllChartSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const chart = getChart(slug);
  if (!chart) {
    return { title: "鼓譜｜Soft Ride" };
  }
  return {
    title: `${chart.title} 鼓譜｜Soft Ride`,
    description: chart.summary,
  };
}

export default async function ChartPage({ params }: PageProps) {
  const { slug } = await params;
  const chart = getChart(slug);
  if (!chart) notFound();

  const svgId = `chart-${chart.slug}`;

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

          <ul className="mt-5 flex flex-wrap gap-2 print:hidden">
            {chart.focus.map((item) => (
              <li
                key={item}
                className="border border-brass/30 px-3 py-1 text-xs tracking-wide text-brass-hot"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 print:hidden">
            <ChartActions title={chart.title} chartSvgId={svgId} />
          </div>

          <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-ivory/95 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-5 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <DrumChartView chart={chart} id={svgId} />
          </div>

          <section className="mt-12 border-t border-white/10 pt-8 print:hidden">
            <h2 className="font-display text-2xl text-ivory">怎麼練這張譜</h2>
            <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
              <li>1. 只打 Ride，用腳踩 hi-hat，把拍號與速度坐穩。</li>
              <li>2. 加入 snare（含 ghost），保持 ride 線條不斷。</li>
              <li>3. 最後放 kick，寧可少打，也要落在 pocket。</li>
              <li>4. 列印後放譜架，跟著原曲慢速對練。</li>
            </ol>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

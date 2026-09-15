import type { ChartSection, DrumChart } from "@/data/charts";
import { getChart } from "@/data/charts";
import { SONG_MEDIA } from "@/data/songMedia";
import { parseTempoBpm } from "@/lib/drumAudio";

export type SongChart = DrumChart & {
  youtubeId: string;
  form: string[];
  sections: ChartSection[];
};

/** 未標 startSec 嘅段落，按 tempo × 小節數累加估算影片位置 */
function withEstimatedStarts(
  sections: ChartSection[],
  tempo: string,
  introSec = 0,
): ChartSection[] {
  const bpm = parseTempoBpm(tempo);
  let cursor = Math.max(0, introSec);

  return sections.map((section) => {
    const startSec =
      section.startSec !== undefined
        ? section.startSec
        : Math.round(cursor * 10) / 10;
    const beats = section.pattern.bars * section.pattern.beatsPerBar;
    const durationSec = (beats * 60) / Math.max(1, bpm);
    cursor = startSec + durationSec;
    return { ...section, startSec };
  });
}

export function getSongChart(slug: string): SongChart | undefined {
  const chart = getChart(slug);
  if (!chart) return undefined;

  const media = SONG_MEDIA[slug];
  const rawSections: ChartSection[] =
    media?.sections ??
    [
      {
        label: "基本 Groove",
        description: "先聽完整首歌，再對這段 groove 循環練習。",
        pattern: chart.pattern,
        startSec: 0,
      },
    ];

  const sections = withEstimatedStarts(
    rawSections,
    chart.tempo,
    media?.introSec ?? 0,
  );

  return {
    ...chart,
    /** 主譜與第一段對齊，方便列表／預覽也看到細譜 */
    pattern: sections[0]?.pattern ?? chart.pattern,
    youtubeId: media?.youtubeId ?? "",
    form: media?.form ?? ["全曲"],
    sections,
  };
}

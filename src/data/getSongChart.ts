import type { ChartSection, DrumChart } from "@/data/charts";
import { getChart } from "@/data/charts";
import { SONG_MEDIA } from "@/data/songMedia";

export type SongChart = DrumChart & {
  youtubeId: string;
  form: string[];
  sections: ChartSection[];
};

export function getSongChart(slug: string): SongChart | undefined {
  const chart = getChart(slug);
  if (!chart) return undefined;

  const media = SONG_MEDIA[slug];
  const sections: ChartSection[] =
    media?.sections ??
    [
      {
        label: "基本 Groove",
        description: "先聽完整首歌，再對這段 groove 循環練習。",
        pattern: chart.pattern,
      },
    ];

  return {
    ...chart,
    youtubeId: media?.youtubeId ?? "",
    form: media?.form ?? ["全曲"],
    sections,
  };
}

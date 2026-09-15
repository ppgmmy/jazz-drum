"use client";

import { useEffect, useState } from "react";
import { ChartNotationPanel } from "@/components/ChartNotationPanel";
import { FullSongPlayer } from "@/components/FullSongPlayer";
import type { ChartSection, DrumVoice } from "@/data/charts";

type PlayMode = "full" | "sections";

type SongChartWorkspaceProps = {
  slug: string;
  title: string;
  meter: string;
  tempo: string;
  youtubeId?: string;
  voiceLabels?: Partial<Record<DrumVoice, string>>;
  sections: ChartSection[];
};

export function SongChartWorkspace({
  slug,
  title,
  meter,
  tempo,
  youtubeId,
  voiceLabels,
  sections,
}: SongChartWorkspaceProps) {
  const [mode, setMode] = useState<PlayMode>("full");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [sectionPlayhead, setSectionPlayhead] = useState<number | null>(null);

  // 切模式時清游標
  useEffect(() => {
    setSectionPlayhead(null);
    setActiveSectionIndex(0);
  }, [mode, slug]);

  return (
    <div>
      <div className="mb-6 print:hidden">
        <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">
          Playback Mode
        </p>
        <div
          className="mt-3 inline-flex rounded-full border border-white/15 p-1"
          role="tablist"
          aria-label="播放模式"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "full"}
            onClick={() => setMode("full")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              mode === "full"
                ? "bg-brass text-ink"
                : "text-muted hover:text-brass-hot"
            }`}
          >
            全曲直落
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "sections"}
            onClick={() => setMode("sections")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              mode === "sections"
                ? "bg-brass text-ink"
                : "text-muted hover:text-brass-hot"
            }`}
          >
            分段練習
          </button>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          {mode === "full"
            ? "成首歌由頭打到尾：一個控制器帶住下面完整鼓譜跟住走，而家打到邊段會自動跳過去。"
            : "分段顯示：撳邊段就練邊段；跟歌聲時播到段尾即停，唔會過龍。"}
        </p>
      </div>

      {mode === "full" ? (
        <FullSongPlayer
          sections={sections}
          tempo={tempo}
          voiceLabels={voiceLabels}
          activeSectionIndex={activeSectionIndex}
          onActiveSectionChange={setActiveSectionIndex}
          sectionPlayhead={sectionPlayhead}
          onSectionPlayheadChange={setSectionPlayhead}
        />
      ) : null}

      <div className="mt-2 space-y-12">
        {sections.map((section, index) => {
          const isActive = mode === "full" && index === activeSectionIndex;
          return (
            <article
              key={section.label}
              id={`section-${index + 1}`}
              className={`scroll-mt-28 rounded-[1.25rem] transition ${
                mode === "full"
                  ? isActive
                    ? "ring-2 ring-brass/70 ring-offset-2 ring-offset-ink"
                    : "opacity-70"
                  : ""
              }`}
            >
              <div className="mb-4">
                <p className="font-mono text-xs tracking-[0.18em] text-brass">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(sections.length).padStart(2, "0")} ·{" "}
                  {section.pattern.bars} 小節
                  {section.startSec !== undefined
                    ? ` · 影片 ${Math.floor(section.startSec / 60)}:${String(
                        Math.floor(section.startSec % 60),
                      ).padStart(2, "0")}`
                    : ""}
                  {mode === "full" && isActive ? " · 播放中" : ""}
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
                svgIdBase={`chart-${slug}-${index}`}
                downloadTitle={`${title}-${section.label}`}
                title={title}
                sectionLabel={section.label}
                meter={meter}
                tempo={tempo}
                pattern={section.pattern}
                voiceLabels={voiceLabels}
                songStartSec={youtubeId ? section.startSec : undefined}
                songEndSec={youtubeId ? section.endSec : undefined}
                sectionId={`${slug}-${index}`}
                hidePlayer={mode === "full"}
                externalPlayhead={
                  mode === "full" && isActive ? sectionPlayhead : null
                }
                strictSection={mode === "sections"}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}

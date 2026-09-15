"use client";

import { useState } from "react";
import { ChartActions } from "@/components/ChartActions";
import { ChartPlayer } from "@/components/ChartPlayer";
import { DrumChartView } from "@/components/DrumChartView";
import { StaffDrumChartView } from "@/components/StaffDrumChartView";
import type { ChartPattern, DrumVoice } from "@/data/charts";

type NotationMode = "staff" | "grid";

type ChartNotationPanelProps = {
  svgIdBase: string;
  downloadTitle: string;
  title: string;
  sectionLabel: string;
  meter: string;
  tempo: string;
  pattern: ChartPattern;
  voiceLabels?: Partial<Record<DrumVoice, string>>;
  songStartSec?: number;
  songEndSec?: number;
  sectionId?: string;
  /** 歌曲 slug，揀「琴代歌聲」旋律 */
  melodyId?: string;
  /** 全曲模式：隱藏每段自己嘅播放器 */
  hidePlayer?: boolean;
  /** 由外層（全曲播放）注入游標 */
  externalPlayhead?: number | null;
  /** 分段練習：到段尾必停 */
  strictSection?: boolean;
};

export function ChartNotationPanel({
  svgIdBase,
  downloadTitle,
  title,
  sectionLabel,
  meter,
  tempo,
  pattern,
  voiceLabels,
  songStartSec,
  songEndSec,
  sectionId,
  melodyId,
  hidePlayer = false,
  externalPlayhead = null,
  strictSection = true,
}: ChartNotationPanelProps) {
  const [mode, setMode] = useState<NotationMode>("staff");
  const [playheadIndex, setPlayheadIndex] = useState<number | null>(null);
  const activePlayhead = hidePlayer ? externalPlayhead : playheadIndex;
  const staffId = `${svgIdBase}-staff`;
  const gridId = `${svgIdBase}-grid`;
  const activeId = mode === "staff" ? staffId : gridId;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div
          className="inline-flex rounded-full border border-white/15 p-1"
          role="tablist"
          aria-label="譜面格式"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "staff"}
            onClick={() => setMode("staff")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              mode === "staff"
                ? "bg-brass text-ink"
                : "text-muted hover:text-brass-hot"
            }`}
          >
            五線譜
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "grid"}
            onClick={() => setMode("grid")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              mode === "grid"
                ? "bg-brass text-ink"
                : "text-muted hover:text-brass-hot"
            }`}
          >
            格子譜
          </button>
        </div>
        <ChartActions title={downloadTitle} chartSvgId={activeId} />
      </div>

      {!hidePlayer ? (
        <ChartPlayer
          pattern={pattern}
          tempo={tempo}
          voiceLabels={voiceLabels}
          playheadIndex={playheadIndex}
          onPlayheadChange={setPlayheadIndex}
          songStartSec={songStartSec}
          songEndSec={songEndSec}
          sectionId={sectionId}
          melodyId={melodyId}
          strictSection={strictSection}
        />
      ) : null}

      <div className="rounded-[1.5rem] border border-white/10 bg-ivory/95 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-5 print:border-0 print:bg-white print:p-0 print:shadow-none">
        {mode === "staff" ? (
          <StaffDrumChartView
            id={staffId}
            title={title}
            sectionLabel={sectionLabel}
            meter={meter}
            tempo={tempo}
            pattern={pattern}
            voiceLabels={voiceLabels}
            playheadIndex={activePlayhead}
          />
        ) : (
          <DrumChartView
            id={gridId}
            title={title}
            sectionLabel={sectionLabel}
            meter={meter}
            tempo={tempo}
            pattern={pattern}
            voiceLabels={voiceLabels}
            playheadIndex={activePlayhead}
          />
        )}
      </div>
    </div>
  );
}

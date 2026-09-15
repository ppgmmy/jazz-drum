"use client";

import { useState } from "react";

type ChartActionsProps = {
  title: string;
  chartSvgId: string;
};

export function ChartActions({ title, chartSvgId }: ChartActionsProps) {
  const [message, setMessage] = useState<string | null>(null);

  const downloadSvg = () => {
    const node = document.getElementById(chartSvgId);
    if (!node) {
      setMessage("找不到譜面，請重新整理後再試。");
      return;
    }
    const blob = new Blob([node.outerHTML], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.replace(/\s+/g, "-").toLowerCase()}-drum-chart.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("已下載 SVG 譜面。");
  };

  const printChart = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={downloadSvg}
        className="rounded-full bg-brass px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-brass-hot"
      >
        下載 SVG
      </button>
      <button
        type="button"
        onClick={printChart}
        className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-ivory transition hover:border-brass/50 hover:text-brass-hot"
      >
        列印練習
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </div>
  );
}

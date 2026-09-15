import type { ChartPattern } from "@/data/charts";

/** 每行放幾小節：十六分密譜 2 小節一行，其餘最多 4 小節 */
export function barsPerSystem(pattern: ChartPattern): number {
  const cellsPerBar = pattern.beatsPerBar * pattern.perBeat;
  if (cellsPerBar >= 12) return 2;
  if (pattern.bars <= 4) return pattern.bars;
  return 4;
}

export function systemRanges(pattern: ChartPattern): Array<{
  startBar: number;
  barCount: number;
}> {
  const perLine = barsPerSystem(pattern);
  const ranges: Array<{ startBar: number; barCount: number }> = [];
  for (let start = 0; start < pattern.bars; start += perLine) {
    ranges.push({
      startBar: start,
      barCount: Math.min(perLine, pattern.bars - start),
    });
  }
  return ranges;
}

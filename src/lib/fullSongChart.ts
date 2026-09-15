import type { ChartPattern, ChartSection, Cell, DrumVoice } from "@/data/charts";
import { totalCells } from "@/lib/drumAudio";

const VOICES: DrumVoice[] = ["ride", "hihat", "snare", "kick"];

export type SectionMarker = {
  index: number;
  label: string;
  cellOffset: number;
  cellCount: number;
  startSec: number;
  endSec: number;
  pattern: ChartPattern;
};

export type FullSongLayout = {
  pattern: ChartPattern;
  markers: SectionMarker[];
  songStartSec: number;
  songEndSec: number;
};

function emptyVoice(length: number): Cell[] {
  return Array.from({ length }, () => "" as const);
}

/** 將各段 pattern 串成完整鼓譜（拍號一致先得） */
export function buildFullSongLayout(
  sections: ChartSection[],
): FullSongLayout | null {
  if (sections.length === 0) return null;

  const perBeat = sections[0].pattern.perBeat;
  const beatsPerBar = sections[0].pattern.beatsPerBar;
  for (const section of sections) {
    if (
      section.pattern.perBeat !== perBeat ||
      section.pattern.beatsPerBar !== beatsPerBar
    ) {
      return null;
    }
  }

  const markers: SectionMarker[] = [];
  const voices: Record<DrumVoice, Cell[]> = {
    ride: [],
    hihat: [],
    snare: [],
    kick: [],
  };
  let cellOffset = 0;
  let bars = 0;
  let songStartSec = sections[0].startSec ?? 0;
  let songEndSec = sections[0].endSec ?? songStartSec;

  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    const cellCount = totalCells(section.pattern);
    const startSec = section.startSec ?? songEndSec;
    const endSec =
      section.endSec ?? sections[index + 1]?.startSec ?? startSec + 16;

    markers.push({
      index,
      label: section.label,
      cellOffset,
      cellCount,
      startSec,
      endSec,
      pattern: section.pattern,
    });

    for (const voice of VOICES) {
      const row = section.pattern.voices[voice] ?? emptyVoice(cellCount);
      voices[voice].push(...row.slice(0, cellCount));
      if (row.length < cellCount) {
        voices[voice].push(...emptyVoice(cellCount - row.length));
      }
    }

    cellOffset += cellCount;
    bars += section.pattern.bars;
    songStartSec = Math.min(songStartSec, startSec);
    songEndSec = Math.max(songEndSec, endSec);
  }

  return {
    pattern: { bars, perBeat, beatsPerBar, voices },
    markers,
    songStartSec,
    songEndSec,
  };
}

/** 無完整串譜時，都整 markers 畀全曲播放用 */
export function buildSectionMarkers(sections: ChartSection[]): SectionMarker[] {
  const layout = buildFullSongLayout(sections);
  if (layout) return layout.markers;

  return sections.map((section, index) => {
    const startSec = section.startSec ?? 0;
    const endSec =
      section.endSec ?? sections[index + 1]?.startSec ?? startSec + 30;
    return {
      index,
      label: section.label,
      cellOffset: 0,
      cellCount: totalCells(section.pattern),
      startSec,
      endSec,
      pattern: section.pattern,
    };
  });
}

export function findSectionBySongTime(
  markers: SectionMarker[],
  songSec: number,
): SectionMarker | null {
  if (markers.length === 0) return null;
  for (const marker of markers) {
    if (songSec >= marker.startSec && songSec < marker.endSec) return marker;
  }
  if (songSec < markers[0].startSec) return markers[0];
  return markers[markers.length - 1];
}

export function cellInSection(
  marker: SectionMarker,
  songSec: number,
  secondsPerCellValue: number,
): number {
  const elapsed = Math.max(0, songSec - marker.startSec);
  if (marker.cellCount <= 0 || secondsPerCellValue <= 0) return 0;
  const patternDur = marker.cellCount * secondsPerCellValue;
  const pos = patternDur > 0 ? elapsed % patternDur : 0;
  return Math.min(
    marker.cellCount - 1,
    Math.max(0, Math.floor(pos / secondsPerCellValue)),
  );
}

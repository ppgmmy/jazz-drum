import {
  VOICE_LABELS,
  type Cell,
  type ChartPattern,
  type DrumVoice,
} from "@/data/charts";
import { systemRanges } from "@/lib/chartLayout";

const VOICES: DrumVoice[] = ["ride", "hihat", "snare", "kick"];

function cellGlyph(cell: Cell) {
  switch (cell) {
    case "X":
      return { kind: "accent" as const };
    case "x":
      return { kind: "hit" as const };
    case "g":
      return { kind: "ghost" as const };
    case "":
      return { kind: "rest" as const };
    default: {
      const _exhaustive: never = cell;
      return _exhaustive;
    }
  }
}

function subdivisionLabel(perBeat: 2 | 3 | 4, slotInBeat: number): string {
  if (slotInBeat === 0) return "";
  switch (perBeat) {
    case 2:
      return "&";
    case 3:
      return slotInBeat === 1 ? "trip" : "let";
    case 4: {
      if (slotInBeat === 1) return "e";
      if (slotInBeat === 2) return "&";
      return "a";
    }
    default: {
      const _exhaustive: never = perBeat;
      return _exhaustive;
    }
  }
}

type DrumChartViewProps = {
  id?: string;
  title: string;
  sectionLabel?: string;
  meter: string;
  tempo: string;
  pattern: ChartPattern;
  voiceLabels?: Partial<Record<DrumVoice, string>>;
  playheadIndex?: number | null;
};

export function DrumChartView({
  id = "drum-chart",
  title,
  sectionLabel,
  meter,
  tempo,
  pattern,
  voiceLabels,
  playheadIndex = null,
}: DrumChartViewProps) {
  const cellsPerBar = pattern.beatsPerBar * pattern.perBeat;
  const systems = systemRanges(pattern);
  const maxBarsInLine = Math.max(...systems.map((s) => s.barCount));
  const labelWidth = 92;
  const cellWidth = cellsPerBar >= 16 ? 20 : cellsPerBar >= 12 ? 22 : 26;
  const rowHeight = 34;
  const headerH = sectionLabel ? 58 : 48;
  const systemBodyH =
    22 + VOICES.length * rowHeight + (pattern.perBeat >= 3 ? 36 : 24);
  const legendH = 22;
  const width = labelWidth + maxBarsInLine * cellsPerBar * cellWidth + 24;
  const height =
    headerH + systems.length * systemBodyH + (systems.length - 1) * 10 + legendH;
  const heading = sectionLabel ? `${title} · ${sectionLabel}` : title;
  const gridMeta = `${pattern.bars} 小節 · 每行 ${systems[0]?.barCount ?? pattern.bars} 小節換行`;

  return (
    <svg
      id={id}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${heading} 鼓譜`}
    >
      <rect width={width} height={height} fill="#f7f1e6" rx="12" />
      <text x={16} y={26} fill="#101820" fontFamily="var(--font-display), Georgia, serif" fontSize="17">
        {heading}
      </text>
      <text x={width - 16} y={26} textAnchor="end" fill="#8a6a3a" fontFamily="var(--font-mono), monospace" fontSize="11">
        {meter} · {tempo}
      </text>
      <text x={16} y={46} fill="#8a6a3a" fontFamily="var(--font-body), sans-serif" fontSize="11">
        {sectionLabel ? `對片練習 · ${gridMeta}` : gridMeta}
      </text>

      {systems.map((system, systemIndex) => {
        const topPad = headerH + systemIndex * (systemBodyH + 10) + 8;
        const lineCells = system.barCount * cellsPerBar;
        const startCell = system.startBar * cellsPerBar;

        return (
          <g key={`system-${systemIndex}`}>
            {Array.from({ length: system.barCount }, (_, bar) => {
              const x =
                labelWidth +
                bar * cellsPerBar * cellWidth +
                (cellsPerBar * cellWidth) / 2;
              return (
                <text
                  key={`bar-num-${systemIndex}-${bar}`}
                  x={x}
                  y={topPad + 12}
                  textAnchor="middle"
                  fill="#8a6a3a"
                  fontFamily="var(--font-mono), monospace"
                  fontSize="10"
                >
                  小節 {system.startBar + bar + 1}
                </text>
              );
            })}

            {playheadIndex !== null &&
            playheadIndex >= startCell &&
            playheadIndex < startCell + lineCells ? (
              <rect
                x={labelWidth + (playheadIndex - startCell) * cellWidth}
                y={topPad + 22}
                width={cellWidth}
                height={VOICES.length * rowHeight}
                fill="#c4a35a"
                opacity="0.3"
              />
            ) : null}

            {VOICES.map((voice, row) => {
              const y = topPad + 22 + row * rowHeight;
              return (
                <g key={`${systemIndex}-${voice}`}>
                  <text x={12} y={y + 22} fill="#2a3648" fontFamily="var(--font-body), sans-serif" fontSize="12">
                    {voiceLabels?.[voice] ?? VOICE_LABELS[voice]}
                  </text>
                  <line
                    x1={labelWidth}
                    x2={labelWidth + lineCells * cellWidth}
                    y1={y + rowHeight}
                    y2={y + rowHeight}
                    stroke="#d7cbb8"
                    strokeWidth="1"
                  />
                  {Array.from({ length: lineCells }, (_, localIndex) => {
                    const index = startCell + localIndex;
                    const cell = pattern.voices[voice][index] ?? "";
                    const x = labelWidth + localIndex * cellWidth;
                    const beatIndex = localIndex % cellsPerBar;
                    const isBarStart = beatIndex === 0;
                    const isBeatStart = beatIndex % pattern.perBeat === 0;
                    const glyph = cellGlyph(cell);
                    const cx = x + cellWidth / 2;
                    const cy = y + rowHeight / 2;
                    const accentR = cellWidth < 22 ? 5.5 : 7;
                    const hitR = cellWidth < 22 ? 4.2 : 5.5;
                    const ghostR = cellWidth < 22 ? 3.2 : 4;

                    return (
                      <g key={`${voice}-${systemIndex}-${localIndex}`}>
                        {isBarStart ? (
                          <line x1={x} x2={x} y1={y + 4} y2={y + rowHeight - 2} stroke="#101820" strokeWidth="1.5" />
                        ) : isBeatStart ? (
                          <line x1={x} x2={x} y1={y + 8} y2={y + rowHeight - 4} stroke="#cbb89a" strokeWidth="1" />
                        ) : (
                          <line x1={x} x2={x} y1={y + 12} y2={y + rowHeight - 6} stroke="#e8dcc8" strokeWidth="1" />
                        )}
                        {glyph.kind === "accent" ? (
                          <circle cx={cx} cy={cy} r={accentR} fill="#101820" />
                        ) : null}
                        {glyph.kind === "hit" ? (
                          <circle cx={cx} cy={cy} r={hitR} fill="none" stroke="#101820" strokeWidth="1.6" />
                        ) : null}
                        {glyph.kind === "ghost" ? (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={ghostR}
                            fill="none"
                            stroke="#8a6a3a"
                            strokeWidth="1.2"
                            strokeDasharray="2 2"
                          />
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {Array.from({ length: lineCells }, (_, localIndex) => {
              const x = labelWidth + localIndex * cellWidth + cellWidth / 2;
              const slotInBeat = localIndex % pattern.perBeat;
              const beat =
                (Math.floor(localIndex / pattern.perBeat) % pattern.beatsPerBar) + 1;
              const sub = subdivisionLabel(pattern.perBeat, slotInBeat);
              const y =
                topPad + 22 + VOICES.length * rowHeight + (pattern.perBeat >= 3 ? 16 : 14);
              if (slotInBeat === 0) {
                return (
                  <text
                    key={`beat-${systemIndex}-${localIndex}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill="#8a6a3a"
                    fontFamily="var(--font-mono), monospace"
                    fontSize="10"
                  >
                    {beat}
                  </text>
                );
              }
              if (pattern.perBeat >= 3 && cellWidth >= 18) {
                return (
                  <text
                    key={`sub-${systemIndex}-${localIndex}`}
                    x={x}
                    y={y + 12}
                    textAnchor="middle"
                    fill="#b09a78"
                    fontFamily="var(--font-mono), monospace"
                    fontSize="8"
                  >
                    {sub}
                  </text>
                );
              }
              return null;
            })}
          </g>
        );
      })}

      <text x={16} y={height - 8} fill="#8a6a3a" fontFamily="var(--font-body), sans-serif" fontSize="10">
        ● 重音　○ 普通　◌ ghost
      </text>
    </svg>
  );
}

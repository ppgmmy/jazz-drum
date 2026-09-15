import {
  VOICE_LABELS,
  type Cell,
  type ChartPattern,
  type DrumVoice,
} from "@/data/charts";

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
};

export function DrumChartView({
  id = "drum-chart",
  title,
  sectionLabel,
  meter,
  tempo,
  pattern,
  voiceLabels,
}: DrumChartViewProps) {
  const cellsPerBar = pattern.beatsPerBar * pattern.perBeat;
  const totalCells = pattern.bars * cellsPerBar;
  const labelWidth = 92;
  const cellWidth = totalCells >= 48 ? 18 : totalCells >= 32 ? 22 : 28;
  const rowHeight = totalCells >= 48 ? 32 : 36;
  const topPad = sectionLabel ? 78 : 62;
  const bottomPad = pattern.perBeat >= 3 ? 48 : 36;
  const width = labelWidth + totalCells * cellWidth + 24;
  const height = topPad + VOICES.length * rowHeight + bottomPad;
  const heading = sectionLabel ? `${title} · ${sectionLabel}` : title;
  const gridMeta = `${pattern.bars} 小節 · 每拍 ${pattern.perBeat} 格`;

  return (
    <svg
      id={id}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full min-w-[640px]"
      role="img"
      aria-label={`${heading} 鼓譜`}
    >
      <rect width={width} height={height} fill="#f7f1e6" rx="12" />
      <text
        x={16}
        y={26}
        fill="#101820"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="17"
      >
        {heading}
      </text>
      <text
        x={width - 16}
        y={26}
        textAnchor="end"
        fill="#8a6a3a"
        fontFamily="var(--font-mono), monospace"
        fontSize="11"
      >
        {meter} · {tempo}
      </text>
      <text
        x={16}
        y={46}
        fill="#8a6a3a"
        fontFamily="var(--font-body), sans-serif"
        fontSize="11"
      >
        {sectionLabel ? `對片練習 · ${gridMeta}` : gridMeta}
      </text>

      {Array.from({ length: pattern.bars }, (_, bar) => {
        const x =
          labelWidth + bar * cellsPerBar * cellWidth + (cellsPerBar * cellWidth) / 2;
        return (
          <text
            key={`bar-num-${bar}`}
            x={x}
            y={topPad - 8}
            textAnchor="middle"
            fill="#8a6a3a"
            fontFamily="var(--font-mono), monospace"
            fontSize="10"
          >
            小節 {bar + 1}
          </text>
        );
      })}

      {VOICES.map((voice, row) => {
        const y = topPad + row * rowHeight;
        return (
          <g key={voice}>
            <text
              x={12}
              y={y + 22}
              fill="#2a3648"
              fontFamily="var(--font-body), sans-serif"
              fontSize="12"
            >
              {voiceLabels?.[voice] ?? VOICE_LABELS[voice]}
            </text>
            <line
              x1={labelWidth}
              x2={labelWidth + totalCells * cellWidth}
              y1={y + rowHeight}
              y2={y + rowHeight}
              stroke="#d7cbb8"
              strokeWidth="1"
            />
            {pattern.voices[voice].slice(0, totalCells).map((cell, index) => {
              const x = labelWidth + index * cellWidth;
              const beatIndex = index % cellsPerBar;
              const isBarStart = beatIndex === 0;
              const isBeatStart = beatIndex % pattern.perBeat === 0;
              const glyph = cellGlyph(cell);
              const cx = x + cellWidth / 2;
              const cy = y + rowHeight / 2;
              const accentR = cellWidth < 22 ? 5.5 : 7;
              const hitR = cellWidth < 22 ? 4.2 : 5.5;
              const ghostR = cellWidth < 22 ? 3.2 : 4;

              return (
                <g key={`${voice}-${index}`}>
                  {isBarStart ? (
                    <line
                      x1={x}
                      x2={x}
                      y1={y + 4}
                      y2={y + rowHeight - 2}
                      stroke="#101820"
                      strokeWidth="1.5"
                    />
                  ) : isBeatStart ? (
                    <line
                      x1={x}
                      x2={x}
                      y1={y + 8}
                      y2={y + rowHeight - 4}
                      stroke="#cbb89a"
                      strokeWidth="1"
                    />
                  ) : (
                    <line
                      x1={x}
                      x2={x}
                      y1={y + 12}
                      y2={y + rowHeight - 6}
                      stroke="#e8dcc8"
                      strokeWidth="1"
                    />
                  )}
                  {glyph.kind === "accent" ? (
                    <circle cx={cx} cy={cy} r={accentR} fill="#101820" />
                  ) : null}
                  {glyph.kind === "hit" ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={hitR}
                      fill="none"
                      stroke="#101820"
                      strokeWidth="1.6"
                    />
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

      {Array.from({ length: totalCells }, (_, index) => {
        const x = labelWidth + index * cellWidth + cellWidth / 2;
        const slotInBeat = index % pattern.perBeat;
        const beat =
          (Math.floor(index / pattern.perBeat) % pattern.beatsPerBar) + 1;
        const sub = subdivisionLabel(pattern.perBeat, slotInBeat);
        const y = height - (pattern.perBeat >= 3 ? 28 : 12);
        if (slotInBeat === 0) {
          return (
            <text
              key={`beat-${index}`}
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
              key={`sub-${index}`}
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

      <text
        x={16}
        y={height - 10}
        fill="#8a6a3a"
        fontFamily="var(--font-body), sans-serif"
        fontSize="10"
      >
        ● 重音　○ 普通　◌ ghost
      </text>
    </svg>
  );
}

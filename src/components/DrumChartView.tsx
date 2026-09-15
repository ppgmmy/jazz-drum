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
  const cellWidth = 28;
  const rowHeight = 36;
  const topPad = sectionLabel ? 72 : 56;
  const bottomPad = 36;
  const width = labelWidth + totalCells * cellWidth + 24;
  const height = topPad + VOICES.length * rowHeight + bottomPad;
  const heading = sectionLabel ? `${title} · ${sectionLabel}` : title;

  return (
    <svg
      id={id}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${heading} 鼓譜`}
    >
      <rect width={width} height={height} fill="#f7f1e6" rx="12" />
      <text
        x={16}
        y={28}
        fill="#101820"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="18"
      >
        {heading}
      </text>
      <text
        x={width - 16}
        y={28}
        textAnchor="end"
        fill="#8a6a3a"
        fontFamily="var(--font-mono), monospace"
        fontSize="11"
      >
        {meter} · {tempo}
      </text>
      {sectionLabel ? (
        <text
          x={16}
          y={50}
          fill="#8a6a3a"
          fontFamily="var(--font-body), sans-serif"
          fontSize="12"
        >
          對片練習段落
        </text>
      ) : null}

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
                  ) : null}
                  {glyph.kind === "accent" ? (
                    <circle cx={cx} cy={cy} r="7" fill="#101820" />
                  ) : null}
                  {glyph.kind === "hit" ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5.5"
                      fill="none"
                      stroke="#101820"
                      strokeWidth="1.6"
                    />
                  ) : null}
                  {glyph.kind === "ghost" ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4"
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

      {Array.from({ length: pattern.bars * pattern.beatsPerBar }, (_, beat) => {
        const index = beat * pattern.perBeat;
        const x = labelWidth + index * cellWidth + cellWidth / 2;
        const beatInBar = (beat % pattern.beatsPerBar) + 1;
        return (
          <text
            key={`beat-${beat}`}
            x={x}
            y={height - 12}
            textAnchor="middle"
            fill="#8a6a3a"
            fontFamily="var(--font-mono), monospace"
            fontSize="10"
          >
            {beatInBar}
          </text>
        );
      })}

      <text
        x={16}
        y={height - 12}
        fill="#8a6a3a"
        fontFamily="var(--font-body), sans-serif"
        fontSize="10"
      >
        ● 重音　○ 普通　◌ ghost
      </text>
    </svg>
  );
}

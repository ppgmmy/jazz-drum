import type { Cell, ChartPattern, DrumVoice } from "@/data/charts";

/**
 * 標準五線鼓譜（Percussion staff）
 * Ride／手打 HH 在譜上方 ×；Snare 第三線；Kick 底部；HH 腳在譜下方 ×
 */

type StaffDrumChartViewProps = {
  id?: string;
  title: string;
  sectionLabel?: string;
  meter: string;
  tempo: string;
  pattern: ChartPattern;
  voiceLabels?: Partial<Record<DrumVoice, string>>;
};

const LINE_GAP = 12;
const STAFF_LINE_COUNT = 5;
const STAFF_HEIGHT = (STAFF_LINE_COUNT - 1) * LINE_GAP;

const VOICE_Y: Record<DrumVoice, number> = {
  ride: -LINE_GAP * 0.85,
  snare: LINE_GAP * 2,
  kick: LINE_GAP * 3.5,
  hihat: LINE_GAP * 5.15,
};

const VOICES: DrumVoice[] = ["ride", "snare", "kick", "hihat"];

function isActive(cell: Cell | undefined): cell is Exclude<Cell, ""> {
  return cell === "x" || cell === "X" || cell === "g";
}

function PercussionClef({ x, y }: { x: number; y: number }) {
  const h = STAFF_HEIGHT;
  return (
    <g aria-hidden="true">
      <rect x={x} y={y + h * 0.18} width={7} height={h * 0.64} fill="#101820" rx={1} />
      <rect x={x + 11} y={y + h * 0.18} width={7} height={h * 0.64} fill="#101820" rx={1} />
    </g>
  );
}

function XNote({
  cx,
  cy,
  size,
  stroke,
  strokeWidth,
}: {
  cx: number;
  cy: number;
  size: number;
  stroke: string;
  strokeWidth: number;
}) {
  return (
    <g>
      <line
        x1={cx - size}
        y1={cy - size}
        x2={cx + size}
        y2={cy + size}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={cx + size}
        y1={cy - size}
        x2={cx - size}
        y2={cy + size}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </g>
  );
}

function OvalNote({
  cx,
  cy,
  ghost,
  accent,
}: {
  cx: number;
  cy: number;
  ghost: boolean;
  accent: boolean;
}) {
  const rx = ghost ? 4.2 : 5.4;
  const ry = ghost ? 3.2 : 4.1;
  return (
    <g>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        transform={`rotate(-18 ${cx} ${cy})`}
        fill={ghost ? "none" : "#101820"}
        stroke="#101820"
        strokeWidth={ghost ? 1.4 : 1}
        opacity={ghost ? 0.75 : 1}
      />
      {accent ? (
        <path
          d={`M ${cx - 7} ${cy - 11} L ${cx} ${cy - 16} L ${cx + 7} ${cy - 11}`}
          fill="none"
          stroke="#101820"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ) : null}
    </g>
  );
}

function meterDenominator(meter: string): number {
  const match = meter.match(/\/(\d+)/);
  return match ? Number(match[1]) : 4;
}

export function StaffDrumChartView({
  id = "staff-drum-chart",
  title,
  sectionLabel,
  meter,
  tempo,
  pattern,
  voiceLabels,
}: StaffDrumChartViewProps) {
  const cellsPerBar = pattern.beatsPerBar * pattern.perBeat;
  const totalCells = pattern.bars * cellsPerBar;
  const slotWidth = totalCells >= 48 ? 16 : totalCells >= 32 ? 20 : 24;
  const leftPad = 72;
  const topPad = sectionLabel ? 70 : 54;
  const staffTop = topPad + 28;
  const bottomPad = 56;
  const width = leftPad + totalCells * slotWidth + 28;
  const height = staffTop + STAFF_HEIGHT + bottomPad + 28;
  const heading = sectionLabel ? `${title} · ${sectionLabel}` : title;
  const rideIsHat = /hi-?hat|踩鑔|鑔/i.test(voiceLabels?.ride ?? "");
  const bottomNumeral = meterDenominator(meter);

  return (
    <svg
      id={id}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full min-w-[640px]"
      role="img"
      aria-label={`${heading} 五線鼓譜`}
    >
      <rect width={width} height={height} fill="#f7f1e6" rx="12" />

      <text
        x={16}
        y={24}
        fill="#101820"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="17"
      >
        {heading}
      </text>
      <text
        x={width - 16}
        y={24}
        textAnchor="end"
        fill="#8a6a3a"
        fontFamily="var(--font-mono), monospace"
        fontSize="11"
      >
        {meter} · {tempo}
      </text>
      <text
        x={16}
        y={44}
        fill="#8a6a3a"
        fontFamily="var(--font-sans), sans-serif"
        fontSize="11"
      >
        五線鼓譜（Percussion）· {pattern.bars} 小節 · 每拍 {pattern.perBeat} 分
      </text>

      <PercussionClef x={18} y={staffTop} />
      <text
        x={44}
        y={staffTop + LINE_GAP * 1.35}
        fill="#101820"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="20"
        fontWeight="600"
      >
        {pattern.beatsPerBar}
      </text>
      <text
        x={44}
        y={staffTop + LINE_GAP * 3.15}
        fill="#101820"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="20"
        fontWeight="600"
      >
        {bottomNumeral}
      </text>

      {Array.from({ length: STAFF_LINE_COUNT }, (_, i) => {
        const y = staffTop + i * LINE_GAP;
        return (
          <line
            key={`line-${i}`}
            x1={leftPad - 8}
            x2={leftPad + totalCells * slotWidth}
            y1={y}
            y2={y}
            stroke="#101820"
            strokeWidth="1.15"
          />
        );
      })}

      {Array.from({ length: pattern.bars + 1 }, (_, bar) => {
        const x = leftPad + bar * cellsPerBar * slotWidth;
        return (
          <g key={`barline-${bar}`}>
            <line
              x1={x}
              x2={x}
              y1={staffTop}
              y2={staffTop + STAFF_HEIGHT}
              stroke="#101820"
              strokeWidth={bar === 0 || bar === pattern.bars ? 2 : 1.35}
            />
            {bar < pattern.bars ? (
              <text
                x={x + (cellsPerBar * slotWidth) / 2}
                y={staffTop - 10}
                textAnchor="middle"
                fill="#8a6a3a"
                fontFamily="var(--font-mono), monospace"
                fontSize="10"
              >
                小節 {bar + 1}
              </text>
            ) : null}
          </g>
        );
      })}

      {Array.from({ length: pattern.bars * pattern.beatsPerBar }, (_, beat) => {
        if (beat % pattern.beatsPerBar === 0) return null;
        const x = leftPad + beat * pattern.perBeat * slotWidth;
        return (
          <line
            key={`beat-${beat}`}
            x1={x}
            x2={x}
            y1={staffTop}
            y2={staffTop + STAFF_HEIGHT}
            stroke="#cbb89a"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
        );
      })}

      {Array.from({ length: totalCells }, (_, index) => {
        const cx = leftPad + index * slotWidth + slotWidth / 2;
        const hits = VOICES.map((voice) => ({
          voice,
          cell: pattern.voices[voice][index],
        })).filter((item): item is { voice: DrumVoice; cell: Exclude<Cell, ""> } =>
          isActive(item.cell),
        );

        if (hits.length === 0) return null;

        const stemUp = hits.some((h) => h.voice === "ride" || h.voice === "snare");
        const stemX = cx + (stemUp ? 5 : -5);
        const noteYs = hits.map((h) => staffTop + VOICE_Y[h.voice]);
        const stemTop = Math.min(...noteYs) - (stemUp ? 28 : 0);
        const stemBottom = Math.max(...noteYs) + (stemUp ? 0 : 28);
        const nextHasHit =
          index % pattern.perBeat !== pattern.perBeat - 1 &&
          VOICES.some((voice) => isActive(pattern.voices[voice][index + 1]));

        return (
          <g key={`col-${index}`}>
            <line
              x1={stemX}
              x2={stemX}
              y1={stemTop}
              y2={stemBottom}
              stroke="#101820"
              strokeWidth="1.25"
            />
            {nextHasHit ? (
              <line
                x1={stemX}
                x2={stemX + slotWidth}
                y1={stemUp ? stemTop : stemBottom}
                y2={stemUp ? stemTop : stemBottom}
                stroke="#101820"
                strokeWidth="3.2"
              />
            ) : (
              <line
                x1={stemX}
                x2={stemX + 7}
                y1={stemUp ? stemTop : stemBottom}
                y2={stemUp ? stemTop + 5 : stemBottom - 5}
                stroke="#101820"
                strokeWidth="1.4"
              />
            )}

            {hits.map(({ voice, cell }) => {
              const cy = staffTop + VOICE_Y[voice];
              const ghost = cell === "g";
              const accent = cell === "X";
              const isCymbal = voice === "ride" || voice === "hihat";

              if (isCymbal) {
                return (
                  <g key={`${voice}-${index}`}>
                    <XNote
                      cx={cx}
                      cy={cy}
                      size={ghost ? 3.6 : 4.6}
                      stroke={ghost ? "#8a6a3a" : "#101820"}
                      strokeWidth={accent ? 2.2 : 1.6}
                    />
                    {accent ? (
                      <path
                        d={`M ${cx - 6} ${cy - 10} L ${cx} ${cy - 14} L ${cx + 6} ${cy - 10}`}
                        fill="none"
                        stroke="#101820"
                        strokeWidth="1.5"
                      />
                    ) : null}
                  </g>
                );
              }

              return (
                <OvalNote
                  key={`${voice}-${index}`}
                  cx={cx}
                  cy={cy}
                  ghost={ghost}
                  accent={accent}
                />
              );
            })}
          </g>
        );
      })}

      {Array.from({ length: pattern.bars * pattern.beatsPerBar }, (_, beat) => {
        const x =
          leftPad +
          beat * pattern.perBeat * slotWidth +
          (pattern.perBeat * slotWidth) / 2;
        const beatInBar = (beat % pattern.beatsPerBar) + 1;
        return (
          <text
            key={`count-${beat}`}
            x={x}
            y={staffTop + STAFF_HEIGHT + 22}
            textAnchor="middle"
            fill="#8a6a3a"
            fontFamily="var(--font-mono), monospace"
            fontSize="10"
          >
            {beatInBar}
          </text>
        );
      })}

      <g transform={`translate(16, ${height - 16})`}>
        <XNote cx={6} cy={-2} size={3.5} stroke="#101820" strokeWidth={1.4} />
        <text
          x={16}
          y={1}
          fill="#8a6a3a"
          fontFamily="var(--font-sans), sans-serif"
          fontSize="10"
        >
          {rideIsHat ? "× Hi-Hat／Ride" : "× Ride／HH"}
        </text>
        <ellipse cx={118} cy={-2} rx={4.5} ry={3.4} fill="#101820" />
        <text
          x={128}
          y={1}
          fill="#8a6a3a"
          fontFamily="var(--font-sans), sans-serif"
          fontSize="10"
        >
          ● Snare／Kick
        </text>
        <ellipse
          cx={232}
          cy={-2}
          rx={4}
          ry={3}
          fill="none"
          stroke="#8a6a3a"
          strokeWidth="1.3"
        />
        <text
          x={242}
          y={1}
          fill="#8a6a3a"
          fontFamily="var(--font-sans), sans-serif"
          fontSize="10"
        >
          ○ ghost　＾ 重音
        </text>
      </g>
    </svg>
  );
}

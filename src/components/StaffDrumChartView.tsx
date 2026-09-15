import type { Cell, ChartPattern, DrumVoice } from "@/data/charts";
import { systemRanges } from "@/lib/chartLayout";

type StaffDrumChartViewProps = {
  id?: string;
  title: string;
  sectionLabel?: string;
  meter: string;
  tempo: string;
  pattern: ChartPattern;
  voiceLabels?: Partial<Record<DrumVoice, string>>;
  /** 播放游標：全曲格索引，null 表示未播放 */
  playheadIndex?: number | null;
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

function XNote(props: {
  cx: number;
  cy: number;
  size: number;
  stroke: string;
  strokeWidth: number;
}) {
  const { cx, cy, size, stroke, strokeWidth } = props;
  return (
    <g>
      <line x1={cx - size} y1={cy - size} x2={cx + size} y2={cy + size} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1={cx + size} y1={cy - size} x2={cx - size} y2={cy + size} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  );
}

function OvalNote(props: {
  cx: number;
  cy: number;
  ghost: boolean;
  accent: boolean;
}) {
  const { cx, cy, ghost, accent } = props;
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
  playheadIndex = null,
}: StaffDrumChartViewProps) {
  const cellsPerBar = pattern.beatsPerBar * pattern.perBeat;
  const systems = systemRanges(pattern);
  const maxBarsInLine = Math.max(...systems.map((s) => s.barCount));
  const slotWidth = cellsPerBar >= 16 ? 18 : cellsPerBar >= 12 ? 20 : 24;
  const leftPad = 72;
  const headerH = sectionLabel ? 58 : 48;
  const systemBodyH = 28 + STAFF_HEIGHT + 36;
  const legendH = 28;
  const width = leftPad + maxBarsInLine * cellsPerBar * slotWidth + 28;
  const height =
    headerH + systems.length * systemBodyH + (systems.length - 1) * 12 + legendH + 12;
  const heading = sectionLabel ? `${title} · ${sectionLabel}` : title;
  const rideIsHat = /hi-?hat|踩鑔|鑔/i.test(voiceLabels?.ride ?? "");
  const bottomNumeral = meterDenominator(meter);

  return (
    <svg
      id={id}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${heading} 五線鼓譜`}
    >
      <rect width={width} height={height} fill="#f7f1e6" rx="12" />
      <text x={16} y={24} fill="#101820" fontFamily="var(--font-display), Georgia, serif" fontSize="17">
        {heading}
      </text>
      <text x={width - 16} y={24} textAnchor="end" fill="#8a6a3a" fontFamily="var(--font-mono), monospace" fontSize="11">
        {meter} · {tempo}
      </text>
      <text x={16} y={44} fill="#8a6a3a" fontFamily="var(--font-sans), sans-serif" fontSize="11">
        五線鼓譜 · {pattern.bars} 小節 · 每行 {systems[0]?.barCount ?? pattern.bars} 小節自動換行
      </text>

      {systems.map((system, systemIndex) => {
        const staffTop = headerH + systemIndex * (systemBodyH + 12) + 28;
        const lineCells = system.barCount * cellsPerBar;
        const startCell = system.startBar * cellsPerBar;
        const showClef = systemIndex === 0;

        return (
          <g key={`system-${systemIndex}`}>
            {showClef ? (
              <>
                <PercussionClef x={18} y={staffTop} />
                <text x={44} y={staffTop + LINE_GAP * 1.35} fill="#101820" fontFamily="var(--font-display), Georgia, serif" fontSize="20" fontWeight="600">
                  {pattern.beatsPerBar}
                </text>
                <text x={44} y={staffTop + LINE_GAP * 3.15} fill="#101820" fontFamily="var(--font-display), Georgia, serif" fontSize="20" fontWeight="600">
                  {bottomNumeral}
                </text>
              </>
            ) : null}

            {Array.from({ length: STAFF_LINE_COUNT }, (_, i) => {
              const y = staffTop + i * LINE_GAP;
              return (
                <line
                  key={`line-${systemIndex}-${i}`}
                  x1={leftPad - 8}
                  x2={leftPad + lineCells * slotWidth}
                  y1={y}
                  y2={y}
                  stroke="#101820"
                  strokeWidth="1.15"
                />
              );
            })}

            {playheadIndex !== null &&
            playheadIndex >= startCell &&
            playheadIndex < startCell + lineCells ? (
              <rect
                x={leftPad + (playheadIndex - startCell) * slotWidth}
                y={staffTop - LINE_GAP * 1.2}
                width={slotWidth}
                height={STAFF_HEIGHT + LINE_GAP * 2.4}
                fill="#c4a35a"
                opacity="0.28"
              />
            ) : null}

            {Array.from({ length: system.barCount + 1 }, (_, bar) => {
              const x = leftPad + bar * cellsPerBar * slotWidth;
              const absoluteBar = system.startBar + bar;
              const isEnd = absoluteBar === pattern.bars;
              return (
                <g key={`barline-${systemIndex}-${bar}`}>
                  <line
                    x1={x}
                    x2={x}
                    y1={staffTop}
                    y2={staffTop + STAFF_HEIGHT}
                    stroke="#101820"
                    strokeWidth={bar === 0 || isEnd ? 2 : 1.35}
                  />
                  {bar < system.barCount ? (
                    <text
                      x={x + (cellsPerBar * slotWidth) / 2}
                      y={staffTop - 10}
                      textAnchor="middle"
                      fill="#8a6a3a"
                      fontFamily="var(--font-mono), monospace"
                      fontSize="10"
                    >
                      小節 {absoluteBar + 1}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {Array.from({ length: system.barCount * pattern.beatsPerBar }, (_, beat) => {
              if (beat % pattern.beatsPerBar === 0) return null;
              const x = leftPad + beat * pattern.perBeat * slotWidth;
              return (
                <line
                  key={`beat-${systemIndex}-${beat}`}
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

            {Array.from({ length: lineCells }, (_, localIndex) => {
              const index = startCell + localIndex;
              const cx = leftPad + localIndex * slotWidth + slotWidth / 2;
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
                localIndex % pattern.perBeat !== pattern.perBeat - 1 &&
                VOICES.some((voice) => isActive(pattern.voices[voice][index + 1]));

              return (
                <g key={`col-${systemIndex}-${localIndex}`}>
                  <line x1={stemX} x2={stemX} y1={stemTop} y2={stemBottom} stroke="#101820" strokeWidth="1.25" />
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
                      <OvalNote key={`${voice}-${index}`} cx={cx} cy={cy} ghost={ghost} accent={accent} />
                    );
                  })}
                </g>
              );
            })}

            {Array.from({ length: system.barCount * pattern.beatsPerBar }, (_, beat) => {
              const x =
                leftPad +
                beat * pattern.perBeat * slotWidth +
                (pattern.perBeat * slotWidth) / 2;
              const beatInBar = (beat % pattern.beatsPerBar) + 1;
              return (
                <text
                  key={`count-${systemIndex}-${beat}`}
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
          </g>
        );
      })}

      <g transform={`translate(16, ${height - 14})`}>
        <XNote cx={6} cy={-2} size={3.5} stroke="#101820" strokeWidth={1.4} />
        <text x={16} y={1} fill="#8a6a3a" fontFamily="var(--font-sans), sans-serif" fontSize="10">
          {rideIsHat ? "× Hi-Hat／Ride" : "× Ride／HH"}
        </text>
        <ellipse cx={118} cy={-2} rx={4.5} ry={3.4} fill="#101820" />
        <text x={128} y={1} fill="#8a6a3a" fontFamily="var(--font-sans), sans-serif" fontSize="10">
          ● Snare／Kick
        </text>
        <ellipse cx={232} cy={-2} rx={4} ry={3} fill="none" stroke="#8a6a3a" strokeWidth="1.3" />
        <text x={242} y={1} fill="#8a6a3a" fontFamily="var(--font-sans), sans-serif" fontSize="10">
          ○ ghost　＾ 重音
        </text>
      </g>
    </svg>
  );
}

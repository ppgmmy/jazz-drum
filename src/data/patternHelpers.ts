import type { Cell, ChartPattern } from "@/data/charts";

/** 建立固定長度空格／填格 */
export function cells(length: number, fill: Cell = ""): Cell[] {
  return Array.from({ length }, () => fill);
}

/** 串接多段 pattern 格 */
export function concat(...parts: Cell[][]): Cell[] {
  return parts.flat();
}

/** 重複一段格 n 次 */
export function repeat(part: Cell[], times: number): Cell[] {
  return Array.from({ length: times }, () => part).flat();
}

/** 在指定索引寫入（其餘保持空白） */
export function place(length: number, hits: Array<[number, Cell]>): Cell[] {
  const row = cells(length);
  for (const [index, cell] of hits) {
    if (index >= 0 && index < length) row[index] = cell;
  }
  return row;
}

type GrooveOpts = {
  bars?: number;
  perBeat?: 2 | 3 | 4;
  beatsPerBar?: number;
  ride?: Cell[];
  hihat?: Cell[];
  snare?: Cell[];
  kick?: Cell[];
};

/** 組出完整 ChartPattern；缺聲部自動補空白 */
export function groove(opts: GrooveOpts): ChartPattern {
  const bars = opts.bars ?? 4;
  const perBeat = opts.perBeat ?? 4;
  const beatsPerBar = opts.beatsPerBar ?? 4;
  const total = bars * beatsPerBar * perBeat;
  const pad = (row?: Cell[]) => {
    if (!row) return cells(total);
    if (row.length === total) return row;
    if (row.length > total) return row.slice(0, total);
    return [...row, ...cells(total - row.length)];
  };
  return {
    bars,
    perBeat,
    beatsPerBar,
    voices: {
      ride: pad(opts.ride),
      hihat: pad(opts.hihat),
      snare: pad(opts.snare),
      kick: pad(opts.kick),
    },
  };
}

/** 八分 Hi-Hat／Ride：每拍只打頭兩格中的偶數位（perBeat=4 時打 e 空） */
export function hats8(bars = 4, accentEvery = 0): Cell[] {
  const total = bars * 16;
  return Array.from({ length: total }, (_, i) => {
    if (i % 2 !== 0) return "" as const;
    if (accentEvery > 0 && i % accentEvery === 0) return "X" as const;
    return "x" as const;
  });
}

/** 十六分閉合 HH */
export function hats16(bars = 4, openIndexes: number[] = []): Cell[] {
  const total = bars * 16;
  const opens = new Set(openIndexes);
  return Array.from({ length: total }, (_, i) =>
    opens.has(i) ? ("X" as const) : ("x" as const),
  );
}

/** Swing ride「叮—叮叮」：perBeat=2、4/4 */
export function swingRide(bars = 4): Cell[] {
  const bar: Cell[] = ["x", "", "x", "x", "x", "", "x", "x"];
  return repeat(bar, bars);
}

/** 2／4 feather／ghost snare（八分格） */
export function featherSnare(bars = 4, accent = false): Cell[] {
  const hit: Cell = accent ? "X" : "g";
  const bar: Cell[] = ["", "", hit, "", "", "", hit, ""];
  return repeat(bar, bars);
}

/** 標準 rock／pop backbeat snare（16 分格） */
export function backbeat16(bars = 4, ghosts: Array<[number, Cell]> = []): Cell[] {
  const total = bars * 16;
  const row = cells(total);
  for (let bar = 0; bar < bars; bar++) {
    const base = bar * 16;
    row[base + 4] = "X";
    row[base + 12] = "X";
  }
  for (const [index, cell] of ghosts) {
    if (index >= 0 && index < total && row[index] === "") row[index] = cell;
  }
  return row;
}

/** four-on-the-floor kick（16 分） */
export function fourFloor16(bars = 4): Cell[] {
  const total = bars * 16;
  return Array.from({ length: total }, (_, i) =>
    i % 4 === 0 ? ("x" as const) : ("" as const),
  );
}

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

/** 休止（Intro 無鼓／數拍） */
export function rest16(bars = 4): Cell[] {
  return cells(bars * 16);
}

/** 四分 HH／Crash（副歌常用）；crashOn1 時每小節第 1 拍標 X */
export function quarters16(bars = 4, crashOn1 = false): Cell[] {
  const total = bars * 16;
  return Array.from({ length: total }, (_, i) => {
    if (i % 4 !== 0) return "" as const;
    if (crashOn1 && i % 16 === 0) return "X" as const;
    return "x" as const;
  });
}

/**
 * Billie Jean 經典 ghost：backbeat 前後 e／a 輕點
 * （配合 four-on-the-floor + 2／4 snare）
 */
export function billieJeanGhosts(bars = 4): Array<[number, Cell]> {
  const out: Array<[number, Cell]> = [];
  for (let b = 0; b < bars; b++) {
    const base = b * 16;
    for (const o of [3, 6, 11, 14]) out.push([base + o, "g"]);
  }
  return out;
}

/**
 * Teen Spirit 主歌 kick：簡單「We Will Rock You」感
 * 1 + 3，偶數小節可多一粒 &
 */
export function teenSpiritVerseKick(bars = 4): Cell[] {
  const parts: Cell[][] = [];
  for (let b = 0; b < bars; b++) {
    if (b % 2 === 0) parts.push(place(16, [[0, "x"], [8, "x"]]));
    else parts.push(place(16, [[0, "x"], [8, "x"], [10, "x"]]));
  }
  return concat(...parts);
}

/**
 * Teen Spirit 副歌／Intro 主 groove kick（切分、重 1）
 * 近似 Grohl disco-rock：1、a、& of 2、3、a、& of 4
 */
export function teenSpiritChorusKick(bars = 4): Cell[] {
  return repeat(
    place(16, [
      [0, "x"],
      [3, "x"],
      [6, "x"],
      [8, "x"],
      [11, "x"],
      [14, "x"],
    ]),
    bars,
  );
}

/** Seven Nation Army：kick 跟 bass riff 長短 */
export function sevenNationKick(bars = 4): Cell[] {
  // 1 — 2& 3 — 4 &（簡化對 riff）
  return repeat(
    place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
    bars,
  );
}

/** Another One Bites the Dust：經典 octave kick 線 */
export function bitesDustKick(bars = 4): Cell[] {
  return repeat(
    place(16, [[0, "x"], [3, "x"], [6, "x"], [8, "x"], [11, "x"], [14, "x"]]),
    bars,
  );
}

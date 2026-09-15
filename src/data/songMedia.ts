import type { ChartSection, Cell } from "@/data/charts";
import {
  backbeat16,
  cells,
  concat,
  featherSnare,
  fourFloor16,
  groove,
  hats16,
  hats8,
  place,
  repeat,
  swingRide,
} from "@/data/patternHelpers";

export type SongMedia = {
  youtubeId: string;
  form: string[];
  /** 影片開頭到第一段鼓譜對應位置的秒數（預留前奏） */
  introSec?: number;
  sections?: ChartSection[];
};

function section(
  label: string,
  description: string,
  pattern: ReturnType<typeof groove>,
  startSec?: number,
): ChartSection {
  return { label, description, pattern, ...(startSec !== undefined ? { startSec } : {}) };
}

function ghostsEveryBar(bars: number, offsets: number[]): Array<[number, Cell]> {
  const out: Array<[number, Cell]> = [];
  for (let b = 0; b < bars; b++) {
    for (const o of offsets) out.push([b * 16 + o, "g"]);
  }
  return out;
}

/** 與 charts.ts 的 slug 一一對應 —— 全曲按結構順序，多數段落 8 小節 */
export const SONG_MEDIA: Record<string, SongMedia> = {
  "so-what": {
    youtubeId: "zqNTltOGh5c",
    introSec: 8,
    form: ["頭奏", "主題", "Solo 輪流", "主題再現", "尾聲"],
    sections: [
      section(
        "1. 頭奏（8 小節）",
        "跟影片開頭：ride 輕、空間大；kick 幾乎不打，先把時間感擺穩。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: cells(64),
        }),
      ),
      section(
        "2. 主題 Head（8 小節）",
        "主題進來：2／4 輕 snare；kick 點骨架。這 8 小節循環對整段主題。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                ["x", "", "", "", "", "", "", "x"],
                ["x", "", "", "", "", "", "", ""],
              ),
            ),
          ),
        }),
      ),
      section(
        "3. Solo 陪襯（8 小節）",
        "Solo 時只守 ride＋2／4；kick 停。每輪 solo 都用這段循環。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: cells(64),
        }),
      ),
      section(
        "4. 主題再現（8 小節）",
        "回到主題，kick 可略密一點，但仍留白。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                ["x", "", "", "x", "", "", "", ""],
                ["x", "", "", "", "", "", "x", ""],
              ),
            ),
          ),
        }),
      ),
      section(
        "5. 尾聲 Fill（8 小節）",
        "前 6 小節維持主題；最後 2 小節小 fill 收束。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: concat(swingRide(6), ["x", "", "x", "x", "x", "x", "x", ""], ["x", "", "x", "", "x", "x", "", ""]),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: concat(
            featherSnare(6),
            ["", "g", "X", "g", "X", "", "g", ""],
            ["g", "X", "g", "X", "", "g", "X", ""],
          ),
          kick: concat(
            ...Array.from({ length: 3 }, () =>
              concat(
                ["x", "", "", "", "", "", "", ""],
                ["x", "", "", "", "", "", "", ""],
              ),
            ),
            ["", "", "", "", "x", "", "x", ""],
            ["x", "", "x", "", "x", "", "", ""],
          ),
        }),
      ),
    ],
  },
  "take-five": {
    youtubeId: "tT9Eh8wNMkw",
    introSec: 6,
    form: ["Sax 主題", "鋼琴 Solo", "主題再現", "尾奏"],
    sections: [
      section(
        "1. Sax 主題（5/4 × 8）",
        "整段主題用 3+2 呼吸循環；Ride 不趕，第 4 拍 snare 要準。",
        groove({
          bars: 8,
          perBeat: 2,
          beatsPerBar: 5,
          ride: repeat(["x", "", "x", "x", "x", "", "x", "x", "x", ""], 8),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 8),
          snare: repeat(["", "", "", "", "X", "", "", "", "g", ""], 8),
          kick: repeat(["x", "", "", "", "", "", "x", "", "", ""], 8),
        }),
      ),
      section(
        "2. 鋼琴 Solo（5/4 × 8）",
        "Solo 時可加 kick 推進，仍守 3+2。",
        groove({
          bars: 8,
          perBeat: 2,
          beatsPerBar: 5,
          ride: repeat(["x", "", "x", "x", "x", "", "x", "x", "x", "x"], 8),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 8),
          snare: repeat(["", "", "g", "", "X", "", "", "", "g", ""], 8),
          kick: repeat(["x", "", "", "x", "", "", "x", "", "x", ""], 8),
        }),
      ),
      section(
        "3. 主題再現（5/4 × 8）",
        "回到主題感覺，動態收回一層。",
        groove({
          bars: 8,
          perBeat: 2,
          beatsPerBar: 5,
          ride: repeat(["x", "", "x", "x", "x", "", "x", "x", "x", ""], 8),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 8),
          snare: repeat(["", "", "", "", "X", "", "", "", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "", "x", "", "", ""], 8),
        }),
      ),
      section(
        "4. 尾奏（5/4 × 4）",
        "最後幾輪漸收；尾拍可輕 fill。",
        groove({
          bars: 4,
          perBeat: 2,
          beatsPerBar: 5,
          ride: concat(
            repeat(["x", "", "x", "x", "x", "", "x", "x", "x", ""], 3),
            ["x", "", "x", "", "x", "x", "x", "", "", ""],
          ),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 4),
          snare: concat(
            repeat(["", "", "", "", "X", "", "", "", "", ""], 3),
            ["", "g", "X", "g", "X", "", "X", "", "", ""],
          ),
          kick: concat(
            repeat(["x", "", "", "", "", "", "x", "", "", ""], 3),
            ["x", "", "", "", "", "", "", "", "x", ""],
          ),
        }),
      ),
    ],
  },
  "blue-train": {
    youtubeId: "YjRbmtrDJI4",
    introSec: 0,
    form: ["頭奏", "主題", "Solo", "主題再現"],
    sections: [
      section(
        "1. 頭奏 Shuffle（8 小節）",
        "先進入 shuffle 黏感；snare 2／4 加 ghost。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "", "X", "", "g", "", "", "", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "", "x", "", "x", "", "", ""], 8),
        }),
      ),
      section(
        "2. 主題（8 小節）",
        "主題段 kick 跟著低音走；第 8 小節可小 fill。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: concat(
            repeat(["", "", "g", "X", "", "g", "", "", "g", "X", "", ""], 7),
            ["", "g", "X", "g", "X", "g", "X", "", "X", "X", "", ""],
          ),
          kick: concat(
            repeat(["x", "", "", "", "", "x", "", "", "x", "", "", ""], 7),
            ["x", "", "x", "", "", "", "x", "", "", "", "x", ""],
          ),
        }),
      ),
      section(
        "3. Solo 陪襯（8 小節）",
        "Solo 時略疏，但仍保持 shuffle 推進。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "", "X", "", "g", "", "", "", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "", "x", "", "", "", "", ""], 8),
        }),
      ),
      section(
        "4. 主題再現＋收（8 小節）",
        "再現主題；最後兩小節 turnaround fill。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: concat(
            repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 6),
            ["x", "", "x", "x", "", "x", "x", "", "x", "x", "", ""],
            ["x", "", "", "x", "x", "x", "x", "", "", "", "", ""],
          ),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: concat(
            repeat(["", "", "", "X", "", "g", "", "", "", "X", "", ""], 6),
            ["", "", "g", "X", "", "g", "", "", "g", "X", "", ""],
            ["X", "g", "X", "g", "X", "", "X", "X", "", "", "", ""],
          ),
          kick: concat(
            repeat(["x", "", "", "", "", "", "x", "", "x", "", "", ""], 6),
            ["x", "", "", "", "", "", "x", "", "x", "", "", ""],
            ["", "", "", "", "x", "", "", "", "x", "", "x", ""],
          ),
        }),
      ),
    ],
  },
  "all-blues": {
    youtubeId: "-488UORrfJ0",
    form: ["Groove 開場", "主題", "Solo", "再現"],
    sections: [
      section(
        "1. Groove 開場（8 小節）",
        "6/8 畫圓；kick 落大拍。",
        groove({
          bars: 8,
          perBeat: 3,
          beatsPerBar: 2,
          ride: repeat(["x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "g", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "x"], 8),
        }),
      ),
      section(
        "2. 主題（8 小節）",
        "主題段可略加 snare ghost，仍保持圓滑。",
        groove({
          bars: 8,
          perBeat: 3,
          beatsPerBar: 2,
          ride: repeat(["x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", ""], 8),
          snare: concat(
            ...Array.from({ length: 4 }, () =>
              concat(["", "", "g", "X", "", ""], ["", "", "g", "X", "", "g"]),
            ),
          ),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(["x", "", "", "", "", "x"], ["x", "", "", "", "", ""]),
            ),
          ),
        }),
      ),
      section(
        "3. Solo 陪襯（8 小節）",
        "Solo 再收一層，只留 ride 圓。",
        groove({
          bars: 8,
          perBeat: 3,
          beatsPerBar: 2,
          ride: repeat(["x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "g", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", ""], 8),
        }),
      ),
      section(
        "4. 再現／收（8 小節）",
        "再現主題；尾兩小節輕收。",
        groove({
          bars: 8,
          perBeat: 3,
          beatsPerBar: 2,
          ride: concat(repeat(["x", "", "x", "x", "", "x"], 6), ["x", "", "x", "x", "", ""], ["x", "", "x", "", "", ""]),
          hihat: repeat(["", "", "", "x", "", ""], 8),
          snare: concat(repeat(["", "", "g", "X", "", ""], 6), ["g", "", "g", "X", "g", ""], ["", "g", "X", "", "", ""]),
          kick: concat(repeat(["x", "", "", "", "", "x"], 6), ["x", "", "", "", "", ""], ["x", "", "", "", "", ""]),
        }),
      ),
    ],
  },
  "satin-doll": {
    youtubeId: "wTFPV1pk654",
    form: ["頭奏", "主題 A", "主題 B", "Solo", "再現"],
    sections: [
      section(
        "1. 頭奏（8 小節）",
        "Medium swing 進場；kick 點到為止。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: repeat(["x", "", "", "", "", "x", "", ""], 8),
        }),
      ),
      section(
        "2. 主題 A（8 小節）",
        "A 段：feather snare；偶發 kick。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                ["", "", "g", "", "", "", "X", ""],
                ["", "", "g", "", "", "g", "X", ""],
              ),
            ),
          ),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                ["x", "", "", "", "", "x", "", ""],
                ["x", "", "", "x", "", "", "", ""],
              ),
            ),
          ),
        }),
      ),
      section(
        "3. 主題 B／橋（8 小節）",
        "B 段稍推進；第 8 小節 fill 回 A。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: concat(swingRide(7), ["x", "x", "x", "", "x", "", "x", "x"]),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: concat(
            featherSnare(7),
            ["g", "X", "g", "X", "", "g", "X", ""],
          ),
          kick: concat(
            repeat(["x", "", "", "", "", "x", "", ""], 7),
            ["", "", "x", "", "x", "", "", ""],
          ),
        }),
      ),
      section(
        "4. Solo 陪襯（8 小節）",
        "Solo 時回到輕 A 段感覺。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: repeat(["x", "", "", "", "", "", "", ""], 8),
        }),
      ),
      section(
        "5. 再現／尾（8 小節）",
        "主題再現後收；尾小節輕 fill。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: concat(swingRide(7), ["x", "", "x", "x", "x", "", "", ""]),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: concat(featherSnare(7), ["", "g", "g", "X", "g", "", "X", ""]),
          kick: concat(repeat(["x", "", "", "", "", "x", "", ""], 7), ["", "", "", "", "x", "", "x", ""]),
        }),
      ),
    ],
  },
  "autumn-leaves": {
    youtubeId: "CpB7-8SGlJ0",
    form: ["前奏", "主題", "Solo", "主題再現"],
    sections: [
      section(
        "1. 前奏（8 小節）",
        "慢板進場；可改 brush。動態收細。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                ["x", "", "x", "", "x", "", "x", "x"],
                ["x", "", "x", "", "x", "", "x", "x"],
              ),
            ),
          ),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: repeat(["x", "", "", "", "", "", "", ""], 8),
        }),
      ),
      section(
        "2. 主題（8 小節）",
        "主題段 kick 偶發；勿蓋旋律。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                ["x", "", "", "", "", "", "", ""],
                ["x", "", "", "", "", "x", "", ""],
              ),
            ),
          ),
        }),
      ),
      section(
        "3. Solo 陪襯（8 小節）",
        "Solo 更疏，只守時間。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: cells(64),
        }),
      ),
      section(
        "4. 主題再現＋尾 Fill（8 小節）",
        "再現後，最後兩小節輕 fill 收。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: concat(swingRide(6), ["x", "", "x", "", "x", "x", "", ""], ["x", "", "x", "", "", "", "", ""]),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: concat(featherSnare(6), ["", "g", "g", "X", "g", "", "X", ""], ["g", "", "X", "", "", "", "", ""]),
          kick: concat(repeat(["x", "", "", "", "", "", "", ""], 6), ["", "", "", "", "x", "", "x", ""], ["x", "", "", "", "", "", "", ""]),
        }),
      ),
    ],
  },
  moanin: {
    youtubeId: "fsJ3JjpZyoA",
    form: ["主題", "Solo", "呼應", "主題再現"],
    sections: [
      section(
        "1. 主題 Hard Bop（8 小節）",
        "Snare 可咬；ride 仍要鬆。先慢練一倍。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "g", "X", "", "g", "", "", "g", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "x", "x", "", "", "", "", ""], 8),
        }),
      ),
      section(
        "2. Solo 陪襯（8 小節）",
        "Solo 時略收，仍保持 shuffle 推進。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "", "X", "", "g", "", "", "", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "x", "", "", "", "", "", ""], 8),
        }),
      ),
      section(
        "3. 呼應段（8 小節）",
        "樂隊呼應：偶發 snare 咬一下；第 8 小節 fill。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: concat(
            repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 7),
            ["x", "", "", "x", "x", "x", "x", "", "", "", "", ""],
          ),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: concat(
            repeat(["", "", "g", "X", "", "g", "", "", "g", "X", "", ""], 7),
            ["X", "g", "X", "g", "X", "", "X", "X", "", "", "", ""],
          ),
          kick: concat(
            repeat(["x", "", "", "", "", "x", "x", "", "", "", "", ""], 7),
            ["", "", "", "", "x", "", "", "", "x", "", "x", ""],
          ),
        }),
      ),
      section(
        "4. 主題再現（8 小節）",
        "再現主題 groove，收在強拍。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "g", "X", "", "g", "", "", "g", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "x", "x", "", "", "", "", ""], 8),
        }),
      ),
    ],
  },
  "a-train": {
    youtubeId: "D6mFGy4g_n8",
    form: ["火車頭奏", "主題", "Solo", "再現／尾"],
    sections: [
      section(
        "1. 火車頭奏（8 小節）",
        "Bounce 進場：像火車但不赶。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: repeat(["x", "", "", "x", "", "", "", ""], 8),
        }),
      ),
      section(
        "2. 主題（8 小節）",
        "主題段 snare 可加一點 ghost；kick 點軌道。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                ["", "", "g", "", "", "", "X", ""],
                ["", "g", "g", "", "", "", "X", ""],
              ),
            ),
          ),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                ["x", "", "", "x", "", "", "", ""],
                ["x", "", "", "", "", "x", "", ""],
              ),
            ),
          ),
        }),
      ),
      section(
        "3. Solo 陪襯（8 小節）",
        "Solo 時保持輕盈 bounce。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: repeat(["x", "", "", "", "", "", "", ""], 8),
        }),
      ),
      section(
        "4. 再現／尾（8 小節）",
        "再現可稍密 kick；尾兩小節收。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: concat(swingRide(6), ["x", "", "x", "x", "x", "", "x", ""], ["x", "", "x", "", "", "", "", ""]),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: concat(featherSnare(6), ["g", "X", "g", "", "g", "", "X", ""], ["", "g", "X", "", "", "", "", ""]),
          kick: concat(
            ...Array.from({ length: 3 }, () =>
              concat(
                ["x", "", "", "x", "", "", "", "x"],
                ["x", "", "", "x", "", "x", "", ""],
              ),
            ),
            ["x", "", "x", "", "x", "", "", ""],
            ["x", "", "", "", "", "", "", ""],
          ),
        }),
      ),
    ],
  },
  "billie-jean": {
    youtubeId: "Zi_XLOBDo_Y",
    introSec: 0,
    form: ["Intro", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "間奏", "副歌結束"],
    sections: [
      section(
        "1. Intro（8 小節）",
        "四落地 kick＋2／4 snare；HH 八分。先對死地板感。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: fourFloor16(8),
          snare: backbeat16(8, ghostsEveryBar(8, [3, 5, 11, 13])),
        }),
      ),
      section(
        "2. 主歌 1（8 小節）",
        "維持 Intro groove；人聲進來後動態再收一點。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: fourFloor16(8),
          snare: backbeat16(8, ghostsEveryBar(8, [3, 5, 11, 13])),
        }),
      ),
      section(
        "3. 副歌 1（8 小節）",
        "副歌可在 a 補 kick；第 8 小節小 fill 回主歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 3 }, () =>
              concat(
                place(16, [[0, "x"], [4, "x"], [8, "x"], [11, "x"], [12, "x"], [14, "x"]]),
                place(16, [[0, "x"], [4, "x"], [8, "x"], [11, "x"], [12, "x"]]),
              ),
            ),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [11, "x"], [12, "x"], [14, "x"]]),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [10, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: concat(
            backbeat16(7),
            place(16, [[4, "X"], [10, "g"], [11, "g"], [12, "X"], [14, "g"]]),
          ),
        }),
      ),
      section(
        "4. 主歌 2（8 小節）",
        "回到四落地；與主歌 1 相同骨架。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: fourFloor16(8),
          snare: backbeat16(8, ghostsEveryBar(8, [3, 5, 11, 13])),
        }),
      ),
      section(
        "5. 副歌 2（8 小節）",
        "副歌再一次；尾小節可加 fill。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 3 }, () =>
              concat(
                place(16, [[0, "x"], [4, "x"], [8, "x"], [11, "x"], [12, "x"], [14, "x"]]),
                place(16, [[0, "x"], [4, "x"], [8, "x"], [11, "x"], [12, "x"]]),
              ),
            ),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [11, "x"], [12, "x"], [14, "x"]]),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [10, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: concat(
            backbeat16(7),
            place(16, [[4, "X"], [10, "g"], [11, "g"], [12, "X"], [14, "g"], [15, "X"]]),
          ),
        }),
      ),
      section(
        "6. 間奏（8 小節）",
        "前 6 小節維持 groove；後 2 小節十六分 snare fill。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(6), place(16, [[0, "X"], [4, "x"], [8, "x"], [12, "x"]]), hats8(1)),
          kick: concat(
            fourFloor16(6),
            place(16, [[0, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            fourFloor16(1),
          ),
          snare: concat(
            backbeat16(6),
            place(16, [[4, "X"], [6, "g"], [7, "X"], [8, "g"], [9, "X"], [10, "g"], [11, "X"], [12, "X"]]),
            backbeat16(1),
          ),
        }),
      ),
      section(
        "7. 副歌結束（8 小節）",
        "最後副歌：穩在地板；尾可停在 snare。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 3 }, () =>
              concat(
                place(16, [[0, "x"], [4, "x"], [8, "x"], [11, "x"], [12, "x"], [14, "x"]]),
                place(16, [[0, "x"], [4, "x"], [8, "x"], [11, "x"], [12, "x"]]),
              ),
            ),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [11, "x"], [12, "x"]]),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [12, "x"]]),
          ),
          snare: concat(backbeat16(7), place(16, [[4, "X"], [12, "X"], [14, "X"], [15, "X"]])),
        }),
      ),
    ],
  },
  "seven-nation-army": {
    youtubeId: "0J2QdDbelmY",
    introSec: 7,
    form: ["Intro riff", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "riff 再現"],
    sections: [
      section(
        "1. Intro Riff（8 小節）",
        "Kick 線＝riff：對準長短，再疊 2／4 snare。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(
            place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            8,
          ),
          snare: backbeat16(8),
        }),
      ),
      section(
        "2. 主歌 1（8 小節）",
        "維持 riff kick；HH 可略收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(
            place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            8,
          ),
          snare: backbeat16(8),
        }),
      ),
      section(
        "3. 副歌 1（8 小節）",
        "打開 HH（重音＝開）；kick 可加厚。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, [0, 16, 32, 48, 64, 80, 96, 112]),
          kick: concat(
            ...Array.from({ length: 3 }, () =>
              concat(
                place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
                place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [13, "x"], [14, "x"]]),
              ),
            ),
            place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            place(16, [[0, "x"], [4, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
      ),
      section(
        "4. 主歌 2（8 小節）",
        "收回主歌 riff 感。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(
            place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            8,
          ),
          snare: backbeat16(8),
        }),
      ),
      section(
        "5. 副歌 2（8 小節）",
        "再爆發；尾可加 fill。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, [0, 16, 32, 48, 64, 80, 96, 112]),
          kick: repeat(
            place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            8,
          ),
          snare: concat(backbeat16(7), place(16, [[4, "X"], [8, "g"], [10, "X"], [12, "X"], [14, "X"]])),
        }),
      ),
      section(
        "6. Riff 再現／尾（8 小節）",
        "回到 intro riff；最後兩小節收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(6), cells(16), place(16, [[0, "X"], [8, "x"]])),
          kick: concat(
            repeat(place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]), 6),
            place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"]]),
            place(16, [[0, "x"], [8, "x"]]),
          ),
          snare: concat(backbeat16(6), place(16, [[4, "X"], [12, "X"]]), place(16, [[4, "X"], [12, "X"], [15, "X"]])),
        }),
      ),
    ],
  },
  "smells-like-teen-spirit": {
    youtubeId: "hTWKbfoikeg",
    introSec: 5,
    form: ["主歌 1", "副歌 1", "主歌 2", "副歌 2", "Solo／尾"],
    sections: [
      section(
        "1. 主歌 1（收・8 小節）",
        "安靜段：HH／四分輕打，kick 少，留白。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: repeat(Array.from({ length: 16 }, (_, i) => (i % 4 === 0 ? ("x" as const) : ("" as const))), 8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(place(16, [[0, "x"]]), place(16, [[0, "x"], [10, "x"]])),
            ),
          ),
          snare: backbeat16(8),
        }),
      ),
      section(
        "2. 副歌 1（放・8 小節）",
        "Crash 進副歌：kick 更密，動態一次到位。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, Array.from({ length: 16 }, (_, i) => i * 8)),
          kick: repeat(
            place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"]]),
            8,
          ),
          snare: backbeat16(8, ghostsEveryBar(8, [7, 15])),
        }),
      ),
      section(
        "3. 主歌 2（收・8 小節）",
        "再收回；進副歌前最後一小節 fill。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(
            repeat(Array.from({ length: 16 }, (_, i) => (i % 4 === 0 ? ("x" as const) : ("" as const))), 7),
            place(16, [[0, "X"], [4, "X"], [8, "X"], [12, "X"]]),
          ),
          kick: concat(
            ...Array.from({ length: 3 }, () =>
              concat(place(16, [[0, "x"]]), place(16, [[0, "x"]])),
            ),
            place(16, [[0, "x"]]),
            place(16, [[0, "x"], [8, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: concat(
            backbeat16(7),
            place(16, [[4, "X"], [6, "g"], [7, "X"], [8, "g"], [9, "X"], [10, "X"], [11, "g"], [12, "X"], [13, "X"], [14, "X"], [15, "X"]]),
          ),
        }),
      ),
      section(
        "4. 副歌 2（放・8 小節）",
        "再爆發；保持速度，不要越打越趕。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, Array.from({ length: 16 }, (_, i) => i * 8)),
          kick: repeat(
            place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"], [14, "x"]]),
            8,
          ),
          snare: backbeat16(8, ghostsEveryBar(8, [7, 15])),
        }),
      ),
      section(
        "5. Solo／尾（8 小節）",
        "Solo 段維持副歌厚度；最後兩小節大 fill 收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats16(6, Array.from({ length: 12 }, (_, i) => i * 8)), place(16, [[0, "X"], [4, "X"], [8, "X"], [12, "X"]]), place(16, [[0, "X"], [8, "X"]])),
          kick: concat(
            repeat(place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"]]), 6),
            place(16, [[0, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            place(16, [[0, "x"], [8, "x"]]),
          ),
          snare: concat(
            backbeat16(6),
            place(16, [[4, "X"], [6, "X"], [7, "g"], [8, "X"], [9, "g"], [10, "X"], [11, "X"], [12, "X"], [13, "X"], [14, "X"], [15, "X"]]),
            place(16, [[4, "X"], [12, "X"], [15, "X"]]),
          ),
        }),
      ),
    ],
  },
  "another-one-bites-the-dust": {
    youtubeId: "rY0WxgSXdEE",
    introSec: 0,
    form: ["Intro", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "間奏", "副歌結束"],
    sections: [
      section(
        "1. Intro Kick（8 小節）",
        "先把 kick ostinato 對死；可先不加 snare。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(place(16, [[0, "x"], [8, "x"], [10, "x"], [13, "x"], [14, "x"]]), 8),
          snare: cells(128),
        }),
      ),
      section(
        "2. 主歌 1（8 小節）",
        "同一 kick 線＋2／4 snare。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(place(16, [[0, "x"], [8, "x"], [10, "x"], [13, "x"], [14, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
      ),
      section(
        "3. 副歌 1（8 小節）",
        "維持 kick DNA；HH 可略打開。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 16),
          kick: repeat(place(16, [[0, "x"], [8, "x"], [10, "x"], [13, "x"], [14, "x"]]), 8),
          snare: backbeat16(8),
        }),
      ),
      section(
        "4. 主歌 2（8 小節）",
        "回到主歌厚度。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(place(16, [[0, "x"], [8, "x"], [10, "x"], [13, "x"], [14, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
      ),
      section(
        "5. 副歌 2（8 小節）",
        "副歌再一次。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 16),
          kick: repeat(place(16, [[0, "x"], [8, "x"], [10, "x"], [13, "x"], [14, "x"]]), 8),
          snare: backbeat16(8),
        }),
      ),
      section(
        "6. 間奏（8 小節）",
        "間奏可強調 kick；尾 fill。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(6), place(16, [[0, "X"], [8, "x"], [12, "x"]]), hats8(1)),
          kick: concat(
            repeat(place(16, [[0, "x"], [8, "x"], [10, "x"], [13, "x"], [14, "x"]]), 6),
            place(16, [[0, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            place(16, [[0, "x"], [8, "x"], [10, "x"], [13, "x"], [14, "x"]]),
          ),
          snare: concat(backbeat16(6), place(16, [[4, "X"], [8, "g"], [10, "X"], [12, "X"], [14, "X"]]), backbeat16(1)),
        }),
      ),
      section(
        "7. 副歌結束（8 小節）",
        "最後副歌；尾停在 kick／snare。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 16),
          kick: concat(
            repeat(place(16, [[0, "x"], [8, "x"], [10, "x"], [13, "x"], [14, "x"]]), 7),
            place(16, [[0, "x"], [8, "x"], [14, "x"]]),
          ),
          snare: concat(backbeat16(7), place(16, [[4, "X"], [12, "X"], [15, "X"]])),
        }),
      ),
    ],
  },
  "uptown-funk": {
    youtubeId: "OPf0YbXqDm0",
    introSec: 8,
    form: ["Intro hits", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "Bridge", "副歌結束"],
    sections: [
      section(
        "1. Intro Hits（8 小節）",
        "注意停頓與重音 hits；空白格也是譜。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats16(2), place(16, [[0, "X"], [4, "X"], [12, "X"]]), hats16(1), hats16(2), place(16, [[0, "X"], [4, "X"], [12, "X"]]), hats16(1)),
          kick: concat(
            place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]),
            place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]),
            place(16, [[0, "x"], [4, "x"], [12, "x"]]),
            place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]),
            place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]),
            place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]),
            place(16, [[0, "x"], [4, "x"], [12, "x"]]),
            place(16, [[0, "x"], [3, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: concat(backbeat16(2), place(16, [[0, "X"], [4, "X"], [12, "X"]]), backbeat16(1), backbeat16(2), place(16, [[0, "X"], [4, "X"], [12, "X"]]), backbeat16(1)),
        }),
      ),
      section(
        "2. 主歌 1（8 小節）",
        "十六分 HH 要鬆；kick／snare 同步。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8),
          kick: repeat(place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [6, 14])),
        }),
      ),
      section(
        "3. 副歌 1（8 小節）",
        "副歌 hits／停頓；跟影片對空拍。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats16(3), place(16, [[0, "X"], [4, "X"], [12, "X"]]), hats16(3), place(16, [[0, "X"], [8, "x"], [12, "x"]])),
          kick: concat(
            repeat(place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]), 3),
            place(16, [[0, "x"], [4, "x"], [12, "x"]]),
            repeat(place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]), 3),
            place(16, [[0, "x"], [3, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: concat(backbeat16(3), place(16, [[0, "X"], [4, "X"], [12, "X"]]), backbeat16(3), place(16, [[4, "X"], [8, "X"], [12, "X"], [14, "g"], [15, "X"]])),
        }),
      ),
      section(
        "4. 主歌 2（8 小節）",
        "回到主歌十六分 groove。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8),
          kick: repeat(place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [6, 14])),
        }),
      ),
      section(
        "5. 副歌 2（8 小節）",
        "副歌再一次。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats16(3), place(16, [[0, "X"], [4, "X"], [12, "X"]]), hats16(3), place(16, [[0, "X"], [8, "x"], [12, "x"]])),
          kick: concat(
            repeat(place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]), 3),
            place(16, [[0, "x"], [4, "x"], [12, "x"]]),
            repeat(place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]), 3),
            place(16, [[0, "x"], [3, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: concat(backbeat16(3), place(16, [[0, "X"], [4, "X"], [12, "X"]]), backbeat16(3), backbeat16(1)),
        }),
      ),
      section(
        "6. Bridge／停頓（8 小節）",
        "Bridge 常有停：先數拍，再一起撞回副歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(4), cells(32), place(16, [[0, "X"], [8, "x"], [12, "x"]]), hats8(1)),
          kick: concat(
            repeat(place(16, [[0, "x"], [6, "x"], [10, "x"]]), 4),
            cells(32),
            place(16, [[0, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]),
          ),
          snare: concat(backbeat16(4), cells(32), place(16, [[4, "X"], [8, "X"], [12, "X"], [14, "g"], [15, "X"]]), backbeat16(1)),
        }),
      ),
      section(
        "7. 副歌結束（8 小節）",
        "最後副歌＋尾 hits。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats16(6), place(16, [[0, "X"], [4, "X"], [8, "X"], [12, "X"]]), place(16, [[0, "X"]])),
          kick: concat(
            repeat(place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]), 6),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [12, "x"]]),
            place(16, [[0, "x"]]),
          ),
          snare: concat(backbeat16(6), place(16, [[0, "X"], [4, "X"], [8, "X"], [12, "X"]]), place(16, [[0, "X"], [8, "X"]])),
        }),
      ),
    ],
  },
  "we-will-rock-you": {
    youtubeId: "-tJYN-eG1zk",
    introSec: 0,
    form: ["Stomp 開場", "人聲段", "結他段", "Stomp 再現", "結尾"],
    sections: [
      section(
        "1. Stomp 開場（8 小節）",
        "kick-kick-snare 全程；練重量與穩定。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: cells(128),
          kick: repeat(place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"]]), 8),
          snare: repeat(place(16, [[4, "X"], [12, "X"]]), 8),
        }),
      ),
      section(
        "2. 人聲段（8 小節）",
        "維持同一 stomp；勿搶人聲。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: cells(128),
          kick: repeat(place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"]]), 8),
          snare: repeat(place(16, [[4, "X"], [12, "X"]]), 8),
        }),
      ),
      section(
        "3. 結他段（8 小節）",
        "仍是 stomp；可略加重。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: cells(128),
          kick: repeat(place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"]]), 8),
          snare: repeat(place(16, [[4, "X"], [12, "X"]]), 8),
        }),
      ),
      section(
        "4. Stomp 再現（8 小節）",
        "再現開場感。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: cells(128),
          kick: repeat(place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"]]), 8),
          snare: repeat(place(16, [[4, "X"], [12, "X"]]), 8),
        }),
      ),
      section(
        "5. 結尾（8 小節）",
        "前 6 小節 stomp；後 2 小節加花收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: cells(128),
          kick: concat(
            repeat(place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"]]), 6),
            place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"], [14, "x"]]),
            place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: concat(
            repeat(place(16, [[4, "X"], [12, "X"]]), 6),
            place(16, [[4, "X"], [12, "X"], [14, "X"], [15, "X"]]),
            place(16, [[4, "X"], [8, "X"], [12, "X"], [14, "X"], [15, "X"]]),
          ),
        }),
      ),
    ],
  },
  "beat-it": {
    youtubeId: "oRdxUFDoQe0",
    introSec: 10,
    form: ["Intro", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "Solo", "副歌尾"],
    sections: [
      section(
        "1. Intro（8 小節）",
        "乾淨 pop-rock 進場。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(place(16, [[0, "x"], [6, "x"], [10, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
      ),
      section(
        "2. 主歌 1（8 小節）",
        "kick 在 1 與 a／+ 變化；snare 要齊。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [6, "x"], [10, "x"]]),
                place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"]]),
              ),
            ),
          ),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
      ),
      section(
        "3. 副歌 1（8 小節）",
        "可打開 HH；kick 稍密。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, Array.from({ length: 32 }, (_, i) => i * 4 + 2)),
          kick: repeat(place(16, [[0, "x"], [6, "x"], [10, "x"], [14, "x"]]), 8),
          snare: backbeat16(8),
        }),
      ),
      section(
        "4. 主歌 2（8 小節）",
        "收回主歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [6, "x"], [10, "x"]]),
                place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"]]),
              ),
            ),
          ),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
      ),
      section(
        "5. 副歌 2（8 小節）",
        "副歌再打開。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, Array.from({ length: 32 }, (_, i) => i * 4 + 2)),
          kick: repeat(place(16, [[0, "x"], [6, "x"], [10, "x"], [14, "x"]]), 8),
          snare: backbeat16(8),
        }),
      ),
      section(
        "6. Solo 前＋Solo（8 小節）",
        "前 4 小節 groove；後 4 小節含 fill 進 Solo。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(5), place(16, [[0, "X"], [8, "x"], [12, "x"]]), hats8(2)),
          kick: concat(
            repeat(place(16, [[0, "x"], [6, "x"], [10, "x"]]), 5),
            place(16, [[0, "x"], [8, "x"], [12, "x"]]),
            repeat(place(16, [[0, "x"], [6, "x"], [10, "x"], [14, "x"]]), 2),
          ),
          snare: concat(
            backbeat16(5),
            place(16, [[4, "X"], [6, "g"], [7, "X"], [8, "g"], [9, "X"], [10, "g"], [11, "X"], [12, "X"], [13, "g"], [14, "X"], [15, "X"]]),
            backbeat16(2),
          ),
        }),
      ),
      section(
        "7. 副歌尾（8 小節）",
        "最後副歌；尾兩小節收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats16(6, Array.from({ length: 24 }, (_, i) => i * 4 + 2)), place(16, [[0, "X"], [8, "x"], [12, "x"]]), place(16, [[0, "X"]])),
          kick: concat(
            repeat(place(16, [[0, "x"], [6, "x"], [10, "x"], [14, "x"]]), 6),
            place(16, [[0, "x"], [8, "x"], [12, "x"]]),
            place(16, [[0, "x"]]),
          ),
          snare: concat(backbeat16(6), place(16, [[4, "X"], [12, "X"], [14, "X"]]), place(16, [[4, "X"], [12, "X"]])),
        }),
      ),
    ],
  },
  "qing-tian": {
    youtubeId: "DYptgVvkVLQ",
    introSec: 12,
    form: ["前奏", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "間奏", "副歌／尾奏"],
    sections: [
      section(
        "1. 前奏（8 小節）",
        "慢板十字節奏；柔、留空間。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [10, "x"]]),
                place(16, [[0, "x"], [8, "x"], [10, "x"]]),
              ),
            ),
          ),
          snare: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[4, "g"], [12, "X"]]),
                place(16, [[4, "g"], [12, "X"], [15, "g"]]),
              ),
            ),
          ),
        }),
      ),
      section(
        "2. 主歌 1（8 小節）",
        "2 拍 ghost、4 拍才重；勿蓋人聲。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [10, "x"]]),
                place(16, [[0, "x"], [8, "x"], [10, "x"]]),
              ),
            ),
          ),
          snare: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[4, "g"], [12, "X"]]),
                place(16, [[4, "g"], [12, "X"]]),
              ),
            ),
          ),
        }),
      ),
      section(
        "3. 副歌 1（8 小節）",
        "副歌稍打開，仍 ballad 呼吸。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 16),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [8, "x"], [10, "x"]]),
                place(16, [[0, "x"], [8, "x"], [10, "x"], [14, "x"]]),
              ),
            ),
          ),
          snare: concat(backbeat16(7), place(16, [[4, "X"], [10, "g"], [12, "X"], [14, "g"]])),
        }),
      ),
      section(
        "4. 主歌 2（8 小節）",
        "收回主歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [10, "x"]]),
                place(16, [[0, "x"], [8, "x"], [10, "x"]]),
              ),
            ),
          ),
          snare: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[4, "g"], [12, "X"]]),
                place(16, [[4, "g"], [12, "X"]]),
              ),
            ),
          ),
        }),
      ),
      section(
        "5. 副歌 2（8 小節）",
        "副歌再打開。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 16),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [8, "x"], [10, "x"]]),
                place(16, [[0, "x"], [8, "x"], [10, "x"], [14, "x"]]),
              ),
            ),
          ),
          snare: backbeat16(8),
        }),
      ),
      section(
        "6. 間奏（8 小節）",
        "間奏可稍推，仍留空給吉他／鋼琴。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 3 }, () =>
              concat(
                place(16, [[0, "x"], [8, "x"]]),
                place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"]]),
              ),
            ),
            place(16, [[0, "x"], [8, "x"]]),
            place(16, [[0, "x"], [8, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: concat(backbeat16(7), place(16, [[4, "X"], [8, "g"], [10, "X"], [12, "X"], [14, "g"], [15, "X"]])),
        }),
      ),
      section(
        "7. 副歌／尾奏（8 小節）",
        "最後副歌漸收；尾兩小節輕結束。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(6, 16), hats8(1), place(16, [[0, "x"], [8, "x"]])),
          kick: concat(
            ...Array.from({ length: 3 }, () =>
              concat(
                place(16, [[0, "x"], [8, "x"], [10, "x"]]),
                place(16, [[0, "x"], [8, "x"], [10, "x"]]),
              ),
            ),
            place(16, [[0, "x"], [8, "x"]]),
            place(16, [[0, "x"]]),
          ),
          snare: concat(backbeat16(6), place(16, [[4, "X"], [12, "X"]]), place(16, [[4, "g"], [12, "X"]])),
        }),
      ),
    ],
  },
  "hai-kuo-tian-kong": {
    youtubeId: "V4GUy2EHMMs",
    introSec: 18,
    form: ["前奏", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "大尾"],
    sections: [
      section(
        "1. 前奏（8 小節）",
        "克制 rock 進場。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(place(16, [[0, "x"], [8, "x"]]), 8),
          snare: backbeat16(8),
        }),
      ),
      section(
        "2. 主歌 1（8 小節）",
        "主歌克制；kick 不過密。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [8, "x"]]),
                place(16, [[0, "x"], [8, "x"], [10, "x"]]),
              ),
            ),
          ),
          snare: backbeat16(8),
        }),
      ),
      section(
        "3. 副歌 1（8 小節）",
        "Crash／Ride 打開；kick 加厚。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, [0, 16, 32, 48, 64, 80, 96, 112]),
          kick: repeat(place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
      ),
      section(
        "4. 主歌 2（8 小節）",
        "收回主歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [8, "x"]]),
                place(16, [[0, "x"], [8, "x"], [10, "x"]]),
              ),
            ),
          ),
          snare: backbeat16(8),
        }),
      ),
      section(
        "5. 副歌 2（8 小節）",
        "副歌再打開。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, [0, 16, 32, 48, 64, 80, 96, 112]),
          kick: repeat(place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"], [14, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
      ),
      section(
        "6. 大尾（8 小節）",
        "前 6 小節副歌厚度；後 2 小節 fill 撞 Crash 收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(
            hats16(6, [0, 16, 32, 48, 64, 80]),
            place(16, [[0, "X"], [4, "X"], [8, "X"], [12, "X"]]),
            place(16, [[0, "X"], [8, "X"]]),
          ),
          kick: concat(
            repeat(place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"]]), 6),
            place(16, [[0, "x"], [8, "x"], [12, "x"], [14, "x"]]),
            place(16, [[0, "x"], [8, "x"]]),
          ),
          snare: concat(
            backbeat16(6),
            place(16, [[4, "X"], [6, "X"], [7, "g"], [8, "X"], [9, "g"], [10, "X"], [11, "X"], [12, "X"], [13, "X"], [14, "X"], [15, "X"]]),
            place(16, [[4, "X"], [12, "X"], [15, "X"]]),
          ),
        }),
      ),
    ],
  },
};

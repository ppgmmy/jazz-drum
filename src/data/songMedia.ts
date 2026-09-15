import type { ChartSection, Cell } from "@/data/charts";
import {
  backbeat16,
  billieJeanGhosts,
  bitesDustKick,
  cells,
  concat,
  featherSnare,
  fourFloor16,
  groove,
  hats16,
  hats8,
  place,
  quarters16,
  repeat,
  rest16,
  sevenNationKick,
  swingRide,
  teenSpiritChorusKick,
  teenSpiritVerseKick,
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
    introSec: 0,
    form: ["Bass／鋼琴 Intro", "主題 Head", "Solo 陪襯", "主題再現", "尾聲"],
    sections: [
      section(
        "1. Bass／鋼琴 Intro（8 小節）",
        "原唱開頭幾乎無鼓：只輕點 hi-hat 腳在 2／4，ride／kick 留白，對住低音主題數拍。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: cells(64),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: cells(64),
          kick: cells(64),
        }),
        0,
      ),
      section(
        "2. 主題 Head（8 小節）",
        "鼓進入：經典 swing ride「叮—叮叮」+ 2／4 feather snare；kick 只點骨架，勿蓋銅管呼應。",
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
                ["x", "", "", "", "", "", "x", ""],
              ),
            ),
          ),
        }),
        33,
      ),
      section(
        "3. Solo 陪襯（8 小節）",
        "Solo 輪流時只守 ride＋2／4；kick 幾乎停，留空間給即興。每輪 solo 循環這段。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: swingRide(8),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: featherSnare(8),
          kick: cells(64),
        }),
        120,
      ),
      section(
        "4. 主題再現（8 小節）",
        "回到 Head 感覺；kick 可略密，但仍要鬆。",
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
        420,
      ),
      section(
        "5. 尾聲（8 小節）",
        "漸收：ride 更疏，最後兩小節輕 fill 收。",
        groove({
          bars: 8,
          perBeat: 2,
          ride: concat(swingRide(6), ["x", "", "x", "", "x", "", "", ""], ["x", "", "", "", "", "", "", ""]),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 8),
          snare: concat(featherSnare(6), ["", "g", "X", "", "g", "", "X", ""], ["", "", "X", "", "", "", "", ""]),
          kick: concat(cells(48), ["", "", "", "", "x", "", "x", ""], ["x", "", "", "", "", "", "", ""]),
        }),
        480,
      ),
    ],
  },

  "take-five": {
    youtubeId: "tT9Eh8wNMkw",
    introSec: 0,
    form: ["鋼琴 Intro", "Sax 主題", "鋼琴 Solo", "鼓 Solo", "主題再現", "尾奏"],
    sections: [
      section(
        "1. 鋼琴 Intro（5/4 × 4）",
        "原唱先鋼琴 vamp：此段無鼓／極輕 hi-hat，對住 3+2 呼吸數拍。",
        groove({
          bars: 4,
          perBeat: 2,
          beatsPerBar: 5,
          ride: cells(40),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 4),
          snare: cells(40),
          kick: cells(40),
        }),
        0,
      ),
      section(
        "2. Sax 主題（5/4 × 8）",
        "Morello 經典：Ride 走 3+2；snare 落在第 4 拍；kick 點 1 與銜接處。",
        groove({
          bars: 8,
          perBeat: 2,
          beatsPerBar: 5,
          ride: repeat(["x", "", "x", "x", "x", "", "x", "x", "x", ""], 8),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 8),
          snare: repeat(["", "", "", "", "X", "", "", "", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "", "x", "", "", ""], 8),
        }),
        18,
      ),
      section(
        "3. 鋼琴 Solo（5/4 × 8）",
        "維持 3+2；可略加 kick 推進，動態仍要讓鋼琴。",
        groove({
          bars: 8,
          perBeat: 2,
          beatsPerBar: 5,
          ride: repeat(["x", "", "x", "x", "x", "", "x", "x", "x", "x"], 8),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 8),
          snare: repeat(["", "", "g", "", "X", "", "", "", "g", ""], 8),
          kick: repeat(["x", "", "", "x", "", "", "x", "", "x", ""], 8),
        }),
        90,
      ),
      section(
        "4. 鼓 Solo（5/4 × 8）",
        "向 Morello 致敬的練習段：snare 對話增多，但仍卡在 5/4 骨架上。",
        groove({
          bars: 8,
          perBeat: 2,
          beatsPerBar: 5,
          ride: repeat(["x", "", "x", "", "x", "", "x", "", "x", ""], 8),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 8),
          snare: repeat(["g", "X", "g", "X", "X", "g", "X", "g", "X", ""], 8),
          kick: repeat(["x", "", "", "", "x", "", "x", "", "", ""], 8),
        }),
        200,
      ),
      section(
        "5. 主題再現（5/4 × 8）",
        "回到主題 ride／snare；動態收回。",
        groove({
          bars: 8,
          perBeat: 2,
          beatsPerBar: 5,
          ride: repeat(["x", "", "x", "x", "x", "", "x", "x", "x", ""], 8),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 8),
          snare: repeat(["", "", "", "", "X", "", "", "", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "", "x", "", "", ""], 8),
        }),
        280,
      ),
      section(
        "6. 尾奏（5/4 × 4）",
        "漸收；最後一小節可輕 fill。",
        groove({
          bars: 4,
          perBeat: 2,
          beatsPerBar: 5,
          ride: concat(
            repeat(["x", "", "x", "x", "x", "", "x", "x", "x", ""], 3),
            ["x", "", "x", "", "x", "", "", "", "", ""],
          ),
          hihat: repeat(["", "", "", "", "x", "", "", "", "", ""], 4),
          snare: concat(
            repeat(["", "", "", "", "X", "", "", "", "", ""], 3),
            ["", "g", "g", "X", "X", "", "", "", "", ""],
          ),
          kick: repeat(["x", "", "", "", "", "", "x", "", "", ""], 4),
        }),
        320,
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
    introSec: 0,
    form: ["鋼琴 Intro", "主題", "Solo", "呼應", "主題再現"],
    sections: [
      section(
        "1. 鋼琴 Intro（8 小節・疏）",
        "原唱開頭鋼琴主題先出：此段只輕點 hi-hat 腳 2／4，ride／kick 留白對數拍。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: cells(96),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: cells(96),
          kick: cells(96),
        }),
        0,
      ),
      section(
        "2. 主題 Hard Bop（8 小節）",
        "鼓進入：shuffle ride；snare 可咬；kick 點 1 與銜接。先慢練一倍。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "g", "X", "", "g", "", "", "g", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "x", "x", "", "", "", "", ""], 8),
        }),
        18,
      ),
      section(
        "3. Solo 陪襯（8 小節）",
        "Solo 時略收，仍保持 shuffle 推進。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "", "X", "", "g", "", "", "", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "x", "", "", "", "", "", ""], 8),
        }),
        55,
      ),
      section(
        "4. 呼應段（8 小節）",
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
        120,
      ),
      section(
        "5. 主題再現（8 小節）",
        "再現主題 groove，收在強拍。",
        groove({
          bars: 8,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 8),
          hihat: repeat(["", "", "", "x", "", "", "", "", "", "x", "", ""], 8),
          snare: repeat(["", "", "g", "X", "", "g", "", "", "g", "X", "", ""], 8),
          kick: repeat(["x", "", "", "", "", "x", "x", "", "", "", "", ""], 8),
        }),
        180,
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
    form: ["Intro", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "Bridge 間奏", "副歌結束"],
    sections: [
      section(
        "1. Intro（8 小節）",
        "原唱經典：kick 四落地；snare 只在 2／4；HH 八分；ghost 在 e／a。先把地板感鎖死。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: fourFloor16(8),
          snare: backbeat16(8, billieJeanGhosts(8)),
        }),
        0,
      ),
      section(
        "2. 主歌 1（8 小節）",
        "人聲進來仍維持同一 groove——Billie Jean 主歌／副歌骨架幾乎不變。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: fourFloor16(8),
          snare: backbeat16(8, billieJeanGhosts(8)),
        }),
        26,
      ),
      section(
        "3. 副歌 1（8 小節）",
        "仍四落地；HH 可略開。第 8 小節小 fill 接回主歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 8),
          kick: fourFloor16(8),
          snare: concat(
            backbeat16(7, billieJeanGhosts(7)),
            place(16, [[4, "X"], [10, "g"], [11, "g"], [12, "X"], [14, "g"]]),
          ),
        }),
        56,
      ),
      section(
        "4. 主歌 2（8 小節）",
        "回到 Intro／主歌同一四落地 groove。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: fourFloor16(8),
          snare: backbeat16(8, billieJeanGhosts(8)),
        }),
        82,
      ),
      section(
        "5. 副歌 2（8 小節）",
        "同副歌 1；保持 pocket，勿加花蓋過貝斯線。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 8),
          kick: fourFloor16(8),
          snare: backbeat16(8, billieJeanGhosts(8)),
        }),
        112,
      ),
      section(
        "6. Bridge 間奏（8 小節）",
        "間奏仍鎖四落地；可把 HH 打開一點，最後兩小節 fill 回副歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats16(6, [0, 16, 32, 48, 64, 80]), hats8(2)),
          kick: fourFloor16(8),
          snare: concat(
            backbeat16(6, billieJeanGhosts(6)),
            place(16, [[4, "X"], [6, "g"], [7, "X"], [12, "X"], [14, "g"]]),
            place(16, [[4, "X"], [8, "g"], [10, "X"], [12, "X"], [14, "X"]]),
          ),
        }),
        140,
      ),
      section(
        "7. 副歌結束（8 小節）",
        "outro 副歌循環：四落地到底；尾小節 Crash／停。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(7, 8), place(16, [[0, "X"], [8, "X"]])),
          kick: concat(fourFloor16(7), place(16, [[0, "x"], [8, "x"]])),
          snare: concat(backbeat16(7, billieJeanGhosts(7)), place(16, [[4, "X"], [12, "X"]])),
        }),
        170,
      ),
    ],
  },

  "seven-nation-army": {
    youtubeId: "0J2QdDbelmY",
    introSec: 0,
    form: ["Intro riff", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "Bridge", "riff／尾"],
    sections: [
      section(
        "1. Intro Riff（8 小節）",
        "Kick 線＝bass riff 長短；再疊穩 2／4 snare。先對死 riff 再加花。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: sevenNationKick(8),
          snare: backbeat16(8),
        }),
        7,
      ),
      section(
        "2. 主歌 1（8 小節）",
        "維持 riff kick；HH 可略收，人聲為主。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: sevenNationKick(8),
          snare: backbeat16(8),
        }),
        33,
      ),
      section(
        "3. 副歌 1（8 小節）",
        "打開 HH；kick 可加厚一點，但仍跟著 riff。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, [0, 16, 32, 48, 64, 80, 96, 112]),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]),
                place(16, [[0, "x"], [6, "x"], [8, "x"], [12, "x"], [13, "x"], [14, "x"]]),
              ),
            ),
          ),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
        55,
      ),
      section(
        "4. 主歌 2（8 小節）",
        "收回主歌 riff 感。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: sevenNationKick(8),
          snare: backbeat16(8),
        }),
        80,
      ),
      section(
        "5. 副歌 2（8 小節）",
        "再打開；進 Bridge 前可小 fill。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, [0, 16, 32, 48, 64, 80, 96, 112]),
          kick: sevenNationKick(8),
          snare: concat(backbeat16(7), place(16, [[4, "X"], [10, "X"], [12, "X"], [14, "g"]])),
        }),
        100,
      ),
      section(
        "6. Bridge（8 小節）",
        "中段張力：kick 更碎、HH 打開；對住結他／人聲堆疊。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8),
          kick: repeat(place(16, [[0, "x"], [4, "x"], [6, "x"], [8, "x"], [12, "x"], [14, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [6, 14])),
        }),
        125,
      ),
      section(
        "7. Riff／尾（8 小節）",
        "回到 Intro riff；尾兩小節可打停。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(6), place(16, [[0, "X"], [8, "X"]]), place(16, [[0, "X"]])),
          kick: concat(sevenNationKick(6), place(16, [[0, "x"], [8, "x"]]), place(16, [[0, "x"]])),
          snare: concat(backbeat16(6), place(16, [[4, "X"], [12, "X"]]), place(16, [[4, "X"]])),
        }),
        155,
      ),
    ],
  },

  "smells-like-teen-spirit": {
    youtubeId: "hTWKbfoikeg",
    introSec: 0,
    form: ["結他 Intro", "鼓 Intro", "主歌", "Pre-Chorus", "副歌", "主歌 2", "Pre 2", "副歌 2", "Solo", "副歌／尾"],
    sections: [
      section(
        "1. 結他 Intro（4 小節・無鼓）",
        "原唱先 clean 結他 riff：此段完全休止，對住影片數 4 小節再進鼓。",
        groove({
          bars: 4,
          perBeat: 4,
          ride: rest16(4),
          kick: rest16(4),
          snare: rest16(4),
        }),
        0,
      ),
      section(
        "2. 鼓 Intro（8 小節）",
        "Grohl 進場：flam 感 fill 後直接副歌型 syncopated groove；四分 HH／Crash 在 1。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: quarters16(8, true),
          kick: teenSpiritChorusKick(8),
          snare: backbeat16(8, ghostsEveryBar(8, [3, 7])),
        }),
        7,
      ),
      section(
        "3. 主歌（8 小節・收）",
        "安靜段：閉合 HH 八分；snare 2／4；kick 簡單 1+3（偶數小節多一粒 &）。每 2 小節尾可開 HH。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: teenSpiritVerseKick(8),
          snare: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[4, "X"], [12, "X"]]),
                place(16, [[4, "X"], [12, "X"], [15, "X"]]),
              ),
            ),
          ),
        }),
        25,
      ),
      section(
        "4. Pre-Chorus（8 小節）",
        "Hello hello：HH 略開、kick 加密；最後一小節 16 分 snare fill 撞進副歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(7),
          kick: concat(
            teenSpiritVerseKick(6),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [10, "x"], [12, "x"], [14, "x"]]),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [12, "x"]]),
          ),
          snare: concat(
            backbeat16(7),
            place(16, [[0, "g"], [2, "g"], [4, "X"], [6, "g"], [8, "X"], [10, "X"], [12, "X"], [14, "X"]]),
          ),
        }),
        40,
      ),
      section(
        "5. 副歌（8 小節・放）",
        "爆點：Crash 在每小節 1；四分 HH；kick 用 Intro／副歌切分型。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: quarters16(8, true),
          kick: teenSpiritChorusKick(8),
          snare: backbeat16(8, ghostsEveryBar(8, [3, 7])),
        }),
        55,
      ),
      section(
        "6. 主歌 2（8 小節・收）",
        "再收回主歌 groove。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: teenSpiritVerseKick(8),
          snare: backbeat16(8),
        }),
        85,
      ),
      section(
        "7. Pre-Chorus 2（8 小節）",
        "同 Pre-Chorus 推進；fill 進副歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(7),
          kick: concat(teenSpiritVerseKick(7), place(16, [[0, "x"], [8, "x"], [12, "x"], [14, "x"]])),
          snare: concat(
            backbeat16(7),
            place(16, [[4, "X"], [6, "X"], [8, "X"], [10, "g"], [12, "X"], [14, "X"]]),
          ),
        }),
        100,
      ),
      section(
        "8. 副歌 2（8 小節・放）",
        "再爆一次副歌 groove。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: quarters16(8, true),
          kick: teenSpiritChorusKick(8),
          snare: backbeat16(8, ghostsEveryBar(8, [3, 7])),
        }),
        115,
      ),
      section(
        "9. Solo（8 小節）",
        "結他 Solo 用副歌型重 groove 頂住。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: quarters16(8, true),
          kick: teenSpiritChorusKick(8),
          snare: backbeat16(8, ghostsEveryBar(8, [7, 15])),
        }),
        145,
      ),
      section(
        "10. 副歌／尾（8 小節）",
        "最後副歌＋outro；尾兩小節可打停。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(quarters16(6, true), place(16, [[0, "X"], [4, "X"], [8, "X"], [12, "X"]]), place(16, [[0, "X"]])),
          kick: concat(teenSpiritChorusKick(6), place(16, [[0, "x"], [8, "x"], [12, "x"]]), place(16, [[0, "x"]])),
          snare: concat(backbeat16(6), place(16, [[4, "X"], [8, "X"], [12, "X"]]), place(16, [[4, "X"]])),
        }),
        175,
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
        "經典 octave kick 線先出來；再疊 2／4 snare＋HH。對死這條 kick 就是整首歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: bitesDustKick(8),
          snare: backbeat16(8),
        }),
        0,
      ),
      section(
        "2. 主歌 1（8 小節）",
        "維持 kick 線；人聲進來動態略收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: bitesDustKick(8),
          snare: backbeat16(8),
        }),
        22,
      ),
      section(
        "3. 副歌 1（8 小節）",
        "HH 可開；kick 線不變——這首歌靠同一條低音踢貫穿。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 8),
          kick: bitesDustKick(8),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
        45,
      ),
      section(
        "4. 主歌 2（8 小節）",
        "收回主歌。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: bitesDustKick(8),
          snare: backbeat16(8),
        }),
        68,
      ),
      section(
        "5. 副歌 2（8 小節）",
        "再打開。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 8),
          kick: bitesDustKick(8),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
        90,
      ),
      section(
        "6. 間奏（8 小節）",
        "間奏仍鎖 kick 線；可加小 fill。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8, [0, 32, 64, 96]),
          kick: bitesDustKick(8),
          snare: concat(backbeat16(7), place(16, [[4, "X"], [8, "g"], [10, "X"], [12, "X"], [14, "g"]])),
        }),
        115,
      ),
      section(
        "7. 副歌結束（8 小節）",
        "outro 副歌；尾小節 Crash 收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(7, 8), place(16, [[0, "X"]])),
          kick: concat(bitesDustKick(7), place(16, [[0, "x"], [8, "x"]])),
          snare: concat(backbeat16(7), place(16, [[4, "X"], [12, "X"]])),
        }),
        140,
      ),
    ],
  },

  "uptown-funk": {
    youtubeId: "OPf0YbXqDm0",
    introSec: 0,
    form: ["Intro hits", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "Bridge", "副歌結束"],
    sections: [
      section(
        "1. Intro Hits（8 小節）",
        "原唱開頭重音 hits＋停頓；空白格也是譜——對死停拍再進 groove。",
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
        8,
      ),
      section(
        "2. 主歌 1（8 小節）",
        "十六分 HH 要鬆；kick 落 1、a、& of 2、a of 3——原唱 funk pocket。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats16(8),
          kick: repeat(place(16, [[0, "x"], [3, "x"], [6, "x"], [10, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [6, 14])),
        }),
        35,
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
        60,
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
        90,
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
        115,
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
        145,
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
        175,
      ),
    ],
  },
  "we-will-rock-you": {
    youtubeId: "-tJYN-eG1zk",
    introSec: 0,
    form: ["Stomp 開場", "人聲段", "結他／全套鼓", "Stomp 再現", "結尾"],
    sections: [
      section(
        "1. Stomp 開場（8 小節）",
        "原唱經典：兩下腳踏（1 與 &）＋拍手（2／4）。無 HH／Ride——純身體節奏。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: cells(128),
          kick: repeat(place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"]]), 8),
          snare: repeat(place(16, [[4, "X"], [12, "X"]]), 8),
        }),
        0,
      ),
      section(
        "2. 人聲段（8 小節）",
        "Buddy you're a boy… 仍鎖同一 stomp；重量穩、勿搶人聲。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: cells(128),
          kick: repeat(place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"]]), 8),
          snare: repeat(place(16, [[4, "X"], [12, "X"]]), 8),
        }),
        16,
      ),
      section(
        "3. 結他／全套鼓（8 小節）",
        "原唱結他進來改打全套：Crash／HH 四分、kick 推進、2／4 snare——唔再係 stomp。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: quarters16(8, true),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"]]),
                place(16, [[0, "x"], [6, "x"], [8, "x"], [10, "x"], [14, "x"]]),
              ),
            ),
          ),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
        68,
      ),
      section(
        "4. Stomp 再現（8 小節）",
        "We will, we will rock you——回到純 stomp。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: cells(128),
          kick: repeat(place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"]]), 8),
          snare: repeat(place(16, [[4, "X"], [12, "X"]]), 8),
        }),
        95,
      ),
      section(
        "5. 結尾（8 小節）",
        "前 6 小節 stomp；後 2 小節全套 hits／Crash 收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(cells(96), place(16, [[0, "X"], [4, "X"], [8, "X"], [12, "X"]]), place(16, [[0, "X"]])),
          kick: concat(
            repeat(place(16, [[0, "x"], [2, "x"], [8, "x"], [10, "x"]]), 6),
            place(16, [[0, "x"], [4, "x"], [8, "x"], [12, "x"]]),
            place(16, [[0, "x"]]),
          ),
          snare: concat(
            repeat(place(16, [[4, "X"], [12, "X"]]), 6),
            place(16, [[4, "X"], [8, "X"], [12, "X"], [14, "X"], [15, "X"]]),
            place(16, [[4, "X"], [12, "X"]]),
          ),
        }),
        110,
      ),
    ],
  },
  "beat-it": {
    youtubeId: "oRdxUFDoQe0",
    introSec: 0,
    form: ["Intro", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "Solo", "副歌尾"],
    sections: [
      section(
        "1. Intro（8 小節）",
        "原唱經典 disco-rock：HH 八分；kick 落 1、& of 2、a of 3；snare 穩 2／4。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(place(16, [[0, "x"], [6, "x"], [11, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [3, 14])),
        }),
        10,
      ),
      section(
        "2. 主歌 1（8 小節）",
        "維持 Intro kick 線；偶數小節可多一粒 & of 3 推進。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [6, "x"], [11, "x"]]),
                place(16, [[0, "x"], [6, "x"], [8, "x"], [11, "x"]]),
              ),
            ),
          ),
          snare: backbeat16(8, ghostsEveryBar(8, [3, 14])),
        }),
        38,
      ),
      section(
        "3. 副歌 1（8 小節）",
        "Beat it：HH 略開；kick 加厚但仍跟同一口袋。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8, 8),
          kick: repeat(place(16, [[0, "x"], [6, "x"], [10, "x"], [11, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [15])),
        }),
        68,
      ),
      section(
        "4. 主歌 2（8 小節）",
        "收回主歌 kick 線。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: concat(
            ...Array.from({ length: 4 }, () =>
              concat(
                place(16, [[0, "x"], [6, "x"], [11, "x"]]),
                place(16, [[0, "x"], [6, "x"], [8, "x"], [11, "x"]]),
              ),
            ),
          ),
          snare: backbeat16(8, ghostsEveryBar(8, [3, 14])),
        }),
        95,
      ),
      section(
        "5. 副歌 2（8 小節）",
        "副歌再打開；尾 fill 進 Solo。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(7, 8), place(16, [[0, "X"], [8, "x"], [12, "x"]])),
          kick: concat(
            repeat(place(16, [[0, "x"], [6, "x"], [10, "x"], [11, "x"]]), 7),
            place(16, [[0, "x"], [8, "x"], [12, "x"], [14, "x"]]),
          ),
          snare: concat(
            backbeat16(7),
            place(16, [[4, "X"], [6, "g"], [8, "X"], [10, "X"], [12, "X"], [14, "X"]]),
          ),
        }),
        125,
      ),
      section(
        "6. Solo（8 小節）",
        "Van Halen Solo：用副歌厚度頂住；HH／Crash 打開。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: quarters16(8, true),
          kick: repeat(place(16, [[0, "x"], [6, "x"], [10, "x"], [14, "x"]]), 8),
          snare: backbeat16(8, ghostsEveryBar(8, [7, 15])),
        }),
        155,
      ),
      section(
        "7. 副歌尾（8 小節）",
        "最後副歌；尾兩小節 Crash 收。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: concat(hats8(6, 8), place(16, [[0, "X"], [4, "X"], [8, "X"], [12, "X"]]), place(16, [[0, "X"]])),
          kick: concat(
            repeat(place(16, [[0, "x"], [6, "x"], [10, "x"], [11, "x"]]), 6),
            place(16, [[0, "x"], [8, "x"], [12, "x"]]),
            place(16, [[0, "x"]]),
          ),
          snare: concat(backbeat16(6), place(16, [[4, "X"], [12, "X"], [14, "X"]]), place(16, [[4, "X"], [12, "X"]])),
        }),
        185,
      ),
    ],
  },
  "qing-tian": {
    youtubeId: "DYptgVvkVLQ",
    introSec: 0,
    form: ["前奏", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "間奏", "副歌／尾奏"],
    sections: [
      section(
        "1. 前奏（8 小節）",
        "慢板十字節奏；柔、留空間。2 拍 ghost、4 拍才重。",
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
        12,
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
        45,
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
        75,
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
        110,
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
        140,
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
        175,
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
        210,
      ),
    ],
  },
  "hai-kuo-tian-kong": {
    youtubeId: "V4GUy2EHMMs",
    introSec: 0,
    form: ["前奏", "主歌 1", "副歌 1", "主歌 2", "副歌 2", "大尾"],
    sections: [
      section(
        "1. 前奏（8 小節）",
        "克制 rock 進場；kick 只點 1＋3。",
        groove({
          bars: 8,
          perBeat: 4,
          ride: hats8(8),
          kick: repeat(place(16, [[0, "x"], [8, "x"]]), 8),
          snare: backbeat16(8),
        }),
        18,
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
        50,
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
        85,
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
        120,
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
        155,
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
        190,
      ),
    ],
  },
};

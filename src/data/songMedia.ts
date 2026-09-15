import type { ChartSection } from "@/data/charts";
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
  sections?: ChartSection[];
};

/** 與 charts.ts 的 slug 一一對應 —— 分段譜盡量 4 小節＋16 分細分 */
export const SONG_MEDIA: Record<string, SongMedia> = {
  "so-what": {
    youtubeId: "zqNTltOGh5c",
    form: ["頭奏", "主題", "Solo 輪流", "主題再現", "尾聲"],
    sections: [
      {
        label: "主題（4 小節）",
        description:
          "跟影片主題：ride「叮—叮叮」連貫；2／4 輕點 snare；kick 只點骨架，不要填滿。",
        pattern: groove({
          bars: 4,
          perBeat: 2,
          ride: swingRide(4),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 4),
          snare: featherSnare(4),
          kick: concat(
            ["x", "", "", "", "", "", "", "x"],
            ["x", "", "", "", "", "", "", ""],
            ["x", "", "", "x", "", "", "", ""],
            ["x", "", "", "", "", "", "x", ""],
          ),
        }),
      },
      {
        label: "Solo 陪襯",
        description: "Solo 時 kick 幾乎停，只守 ride 與 2／4，讓獨奏者呼吸。",
        pattern: groove({
          bars: 4,
          perBeat: 2,
          ride: swingRide(4),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 4),
          snare: featherSnare(4),
          kick: cells(32),
        }),
      },
      {
        label: "轉折 Fill（進主題）",
        description: "第 4 小節小 fill：snare 三連感後回到主題 kick。",
        pattern: groove({
          bars: 4,
          perBeat: 2,
          ride: concat(swingRide(3), ["x", "", "x", "", "x", "x", "x", ""]),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 4),
          snare: concat(
            featherSnare(3),
            ["", "g", "X", "g", "X", "", "g", ""],
          ),
          kick: concat(
            ["x", "", "", "", "", "", "", ""],
            ["x", "", "", "", "", "", "", ""],
            ["x", "", "", "", "", "", "", ""],
            ["", "", "", "", "x", "", "x", ""],
          ),
        }),
      },
    ],
  },
  "take-five": {
    youtubeId: "tT9Eh8wNMkw",
    form: ["Sax 主題", "鋼琴 Solo", "主題再現", "尾奏"],
    sections: [
      {
        label: "主題 Groove（5/4 × 2）",
        description:
          "分組 3+2：前三拍站穩，第 4 拍 snare 重，第 5 拍收氣。Ride 不要趕。",
        pattern: groove({
          bars: 2,
          perBeat: 2,
          beatsPerBar: 5,
          ride: [
            "x", "", "x", "x", "x", "", "x", "x", "x", "",
            "x", "", "x", "x", "x", "", "x", "x", "x", "",
          ],
          hihat: [
            "", "", "", "", "x", "", "", "", "", "",
            "", "", "", "", "x", "", "", "", "", "",
          ],
          snare: [
            "", "", "", "", "X", "", "", "", "g", "",
            "", "", "", "", "X", "", "", "", "", "",
          ],
          kick: [
            "x", "", "", "", "", "", "x", "", "", "",
            "x", "", "", "x", "", "", "x", "", "", "",
          ],
        }),
      },
      {
        label: "變奏（Kick 推進）",
        description: "第二遍可多一點 kick，仍守 3+2 呼吸。",
        pattern: groove({
          bars: 2,
          perBeat: 2,
          beatsPerBar: 5,
          ride: [
            "x", "", "x", "x", "x", "", "x", "x", "x", "x",
            "x", "", "x", "x", "x", "", "x", "x", "x", "",
          ],
          hihat: [
            "", "", "", "", "x", "", "", "", "", "",
            "", "", "", "", "x", "", "", "", "", "",
          ],
          snare: [
            "", "", "g", "", "X", "", "", "", "g", "",
            "", "", "", "", "X", "", "g", "", "", "",
          ],
          kick: [
            "x", "", "", "x", "", "", "x", "", "x", "",
            "x", "", "", "", "", "", "x", "", "", "x",
          ],
        }),
      },
    ],
  },
  "blue-train": {
    youtubeId: "YjRbmtrDJI4",
    form: ["頭奏", "主題", "Solo", "主題再現"],
    sections: [
      {
        label: "Shuffle Groove（4 小節）",
        description:
          "Shuffle 長短八分要「黏」。Snare 在 2／4 加 ghost；kick 跟著低音走。",
        pattern: groove({
          bars: 4,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 4),
          hihat: repeat(
            ["", "", "", "x", "", "", "", "", "", "x", "", ""],
            4,
          ),
          snare: concat(
            ["", "", "", "X", "", "g", "", "", "", "X", "", ""],
            ["", "", "g", "X", "", "", "", "", "g", "X", "", "g"],
            ["", "", "", "X", "", "g", "", "", "", "X", "", ""],
            ["", "g", "", "X", "", "g", "", "", "g", "X", "g", ""],
          ),
          kick: concat(
            ["x", "", "", "", "", "", "x", "", "x", "", "", ""],
            ["x", "", "", "", "", "x", "", "", "", "", "x", ""],
            ["x", "", "", "", "", "", "x", "", "x", "", "", ""],
            ["x", "", "x", "", "", "", "x", "", "", "", "", ""],
          ),
        }),
      },
      {
        label: "Turnaround Fill",
        description: "第 4 小節 fill：snare 推進後回 shuffle。",
        pattern: groove({
          bars: 4,
          perBeat: 3,
          ride: concat(
            repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 3),
            ["x", "", "x", "x", "", "", "x", "x", "x", "", "", ""],
          ),
          hihat: repeat(
            ["", "", "", "x", "", "", "", "", "", "x", "", ""],
            4,
          ),
          snare: concat(
            ["", "", "", "X", "", "g", "", "", "", "X", "", ""],
            ["", "", "", "X", "", "g", "", "", "", "X", "", ""],
            ["", "", "", "X", "", "g", "", "", "", "X", "", ""],
            ["", "g", "X", "g", "X", "g", "X", "", "X", "X", "", ""],
          ),
          kick: concat(
            ["x", "", "", "", "", "", "x", "", "x", "", "", ""],
            ["x", "", "", "", "", "", "x", "", "x", "", "", ""],
            ["x", "", "", "", "", "", "x", "", "x", "", "", ""],
            ["", "", "", "", "", "", "x", "", "", "", "x", ""],
          ),
        }),
      },
    ],
  },
  "all-blues": {
    youtubeId: "-488UORrfJ0",
    form: ["Groove 開場", "主題", "Solo", "再現"],
    sections: [
      {
        label: "6/8 Waltz Groove",
        description: "一大拍三小格。Ride 畫圓；kick 落在大拍，不要打成直八。",
        pattern: groove({
          bars: 4,
          perBeat: 3,
          beatsPerBar: 2,
          ride: repeat(["x", "", "x", "x", "", "x"], 4),
          hihat: repeat(["", "", "", "x", "", ""], 4),
          snare: concat(
            ["", "", "g", "X", "", ""],
            ["", "", "g", "X", "", "g"],
            ["", "", "g", "X", "", ""],
            ["g", "", "g", "X", "g", ""],
          ),
          kick: concat(
            ["x", "", "", "", "", "x"],
            ["x", "", "", "", "", ""],
            ["x", "", "", "", "", "x"],
            ["x", "", "x", "", "", ""],
          ),
        }),
      },
      {
        label: "Solo 陪襯（更疏）",
        description: "Solo 時再收一層，只留 ride 圓與偶發 snare。",
        pattern: groove({
          bars: 4,
          perBeat: 3,
          beatsPerBar: 2,
          ride: repeat(["x", "", "x", "x", "", "x"], 4),
          hihat: repeat(["", "", "", "x", "", ""], 4),
          snare: repeat(["", "", "g", "X", "", ""], 4),
          kick: repeat(["x", "", "", "", "", ""], 4),
        }),
      },
    ],
  },
  "satin-doll": {
    youtubeId: "wTFPV1pk654",
    form: ["頭奏", "主題 AABA", "Solo", "再現"],
    sections: [
      {
        label: "A 段 Medium Swing",
        description: "Ride「叮—叮叮」要輕；2／4 feather snare；kick 點到為止。",
        pattern: groove({
          bars: 4,
          perBeat: 2,
          ride: swingRide(4),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 4),
          snare: concat(
            ["", "", "g", "", "", "", "X", ""],
            ["", "", "g", "", "", "", "X", ""],
            ["", "", "g", "g", "", "", "X", ""],
            ["", "", "g", "", "", "g", "X", ""],
          ),
          kick: concat(
            ["x", "", "", "", "", "x", "", ""],
            ["x", "", "", "x", "", "", "", ""],
            ["x", "", "", "", "", "x", "", ""],
            ["x", "", "x", "", "", "", "", "x"],
          ),
        }),
      },
      {
        label: "B 段／轉折",
        description: "B 段可稍推進；第 4 小節小 fill 回 A。",
        pattern: groove({
          bars: 4,
          perBeat: 2,
          ride: concat(swingRide(3), ["x", "x", "x", "", "x", "", "x", "x"]),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 4),
          snare: concat(
            ["", "", "g", "", "", "", "X", ""],
            ["", "", "g", "", "", "", "X", ""],
            ["", "", "g", "", "", "", "X", "g"],
            ["g", "X", "g", "X", "", "g", "X", ""],
          ),
          kick: concat(
            ["x", "", "", "", "", "x", "", ""],
            ["x", "", "", "", "", "x", "", ""],
            ["x", "", "", "x", "", "", "", ""],
            ["", "", "x", "", "x", "", "", ""],
          ),
        }),
      },
    ],
  },
  "autumn-leaves": {
    youtubeId: "CpB7-8SGlJ0",
    form: ["前奏", "主題", "Solo", "主題再現"],
    sections: [
      {
        label: "Ballad Swing",
        description: "慢板更考驗穩定。可改 brush；動態收細，留空間給旋律。",
        pattern: groove({
          bars: 4,
          perBeat: 2,
          ride: concat(
            ["x", "", "x", "", "x", "", "x", "x"],
            ["x", "", "x", "", "x", "", "x", "x"],
            ["x", "", "x", "x", "x", "", "x", ""],
            ["x", "", "x", "", "x", "", "x", "x"],
          ),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 4),
          snare: featherSnare(4),
          kick: concat(
            ["x", "", "", "", "", "", "", ""],
            ["x", "", "", "", "", "x", "", ""],
            ["x", "", "", "", "", "", "", ""],
            ["x", "", "", "x", "", "", "", ""],
          ),
        }),
      },
      {
        label: "主題尾 Fill",
        description: "進 Solo 前一小段：輕 fill，不要破壞 ballad 氣氛。",
        pattern: groove({
          bars: 4,
          perBeat: 2,
          ride: concat(swingRide(3).slice(0, 24), ["x", "", "x", "", "x", "x", "", ""]),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 4),
          snare: concat(featherSnare(3), ["", "g", "g", "X", "g", "", "X", ""]),
          kick: concat(
            ["x", "", "", "", "", "", "", ""],
            ["x", "", "", "", "", "", "", ""],
            ["x", "", "", "", "", "", "", ""],
            ["", "", "", "", "x", "", "x", ""],
          ),
        }),
      },
    ],
  },
  moanin: {
    youtubeId: "fsJ3JjpZyoA",
    form: ["主題", "Solo", "呼應", "主題再現"],
    sections: [
      {
        label: "Hard Bop Shuffle",
        description: "Snare 可以更咬牙，ride 仍要鬆。先慢練一倍再回原速。",
        pattern: groove({
          bars: 4,
          perBeat: 3,
          ride: repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 4),
          hihat: repeat(
            ["", "", "", "x", "", "", "", "", "", "x", "", ""],
            4,
          ),
          snare: concat(
            ["", "", "g", "X", "", "g", "", "", "g", "X", "", ""],
            ["", "", "g", "X", "", "g", "", "g", "", "X", "", "g"],
            ["", "", "g", "X", "", "g", "", "", "g", "X", "", ""],
            ["g", "", "g", "X", "g", "g", "", "", "g", "X", "g", ""],
          ),
          kick: concat(
            ["x", "", "", "", "", "x", "x", "", "", "", "", ""],
            ["x", "", "", "", "", "x", "", "", "x", "", "", ""],
            ["x", "", "", "", "", "x", "x", "", "", "", "", ""],
            ["x", "", "x", "", "", "x", "", "", "", "", "x", ""],
          ),
        }),
      },
      {
        label: "呼應／Fill",
        description: "樂隊呼應處：第 4 小節 snare 咬一下再回 groove。",
        pattern: groove({
          bars: 4,
          perBeat: 3,
          ride: concat(
            repeat(["x", "", "x", "x", "", "x", "x", "", "x", "x", "", "x"], 3),
            ["x", "", "", "x", "x", "x", "x", "", "", "", "", ""],
          ),
          hihat: repeat(
            ["", "", "", "x", "", "", "", "", "", "x", "", ""],
            4,
          ),
          snare: concat(
            ["", "", "g", "X", "", "g", "", "", "g", "X", "", ""],
            ["", "", "g", "X", "", "g", "", "", "g", "X", "", ""],
            ["", "", "g", "X", "", "g", "", "", "g", "X", "", ""],
            ["X", "g", "X", "g", "X", "", "X", "X", "", "", "", ""],
          ),
          kick: concat(
            ["x", "", "", "", "", "x", "x", "", "", "", "", ""],
            ["x", "", "", "", "", "x", "x", "", "", "", "", ""],
            ["x", "", "", "", "", "x", "x", "", "", "", "", ""],
            ["", "", "", "", "x", "", "", "", "x", "", "x", ""],
          ),
        }),
      },
    ],
  },
  "a-train": {
    youtubeId: "D6mFGy4g_n8",
    form: ["火車頭奏", "主題", "Solo", "再現／尾"],
    sections: [
      {
        label: "Bounce Swing",
        description: "輕快 bounce：像火車但不赶。Kick 偶爾點軌道。",
        pattern: groove({
          bars: 4,
          perBeat: 2,
          ride: swingRide(4),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 4),
          snare: concat(
            ["", "", "g", "", "", "", "X", ""],
            ["", "g", "g", "", "", "", "X", ""],
            ["", "", "g", "", "", "", "X", ""],
            ["", "", "g", "g", "", "", "X", ""],
          ),
          kick: concat(
            ["x", "", "", "x", "", "", "", ""],
            ["x", "", "", "", "", "x", "", ""],
            ["x", "", "", "x", "", "", "", ""],
            ["x", "", "x", "", "", "x", "", ""],
          ),
        }),
      },
      {
        label: "頭奏／再現推進",
        description: "頭奏與再現可稍密 kick，仍保持輕盈。",
        pattern: groove({
          bars: 4,
          perBeat: 2,
          ride: swingRide(4),
          hihat: repeat(["", "", "x", "", "", "", "x", ""], 4),
          snare: concat(
            ["", "", "g", "", "", "", "X", ""],
            ["", "", "g", "", "", "", "X", "g"],
            ["", "", "g", "", "", "", "X", ""],
            ["g", "X", "g", "", "g", "", "X", ""],
          ),
          kick: concat(
            ["x", "", "", "x", "", "", "", "x"],
            ["x", "", "", "x", "", "x", "", ""],
            ["x", "", "", "x", "", "", "", "x"],
            ["x", "", "x", "", "x", "", "", ""],
          ),
        }),
      },
    ],
  },
  "billie-jean": {
    youtubeId: "Zi_XLOBDo_Y",
    form: ["Intro 鼓＋Bass", "主歌", "副歌", "間奏", "副歌結束"],
    sections: [
      {
        label: "Intro／主歌（4 小節）",
        description:
          "十六分細看：四落地 kick + 2／4 snare；HH 八分均勻。可在 snare 前後加極輕 ghost。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4),
          kick: fourFloor16(4),
          snare: backbeat16(4, [
            [3, "g"],
            [5, "g"],
            [11, "g"],
            [13, "g"],
            [19, "g"],
            [21, "g"],
            [27, "g"],
            [29, "g"],
            [35, "g"],
            [37, "g"],
            [43, "g"],
            [45, "g"],
            [51, "g"],
            [53, "g"],
            [59, "g"],
            [61, "g"],
          ]),
        }),
      },
      {
        label: "副歌",
        description: "副歌可在「a」補 kick，仍不要打亂地板感；第 4 小節可小 fill。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4),
          kick: concat(
            place(16, [
              [0, "x"],
              [4, "x"],
              [8, "x"],
              [11, "x"],
              [12, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [4, "x"],
              [8, "x"],
              [11, "x"],
              [12, "x"],
            ]),
            place(16, [
              [0, "x"],
              [4, "x"],
              [8, "x"],
              [11, "x"],
              [12, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [4, "x"],
              [8, "x"],
              [10, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: concat(
            backbeat16(3),
            place(16, [
              [4, "X"],
              [10, "g"],
              [11, "g"],
              [12, "X"],
              [14, "g"],
            ]),
          ),
        }),
      },
      {
        label: "間奏 Fill",
        description: "對影片間奏：snare 十六分推進兩拍，再回四落地。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: concat(hats8(3), place(16, [[0, "X"], [4, "x"], [8, "x"], [12, "x"]])),
          kick: concat(
            fourFloor16(3),
            place(16, [
              [0, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: concat(
            backbeat16(3),
            place(16, [
              [4, "X"],
              [6, "g"],
              [7, "X"],
              [8, "g"],
              [9, "X"],
              [10, "g"],
              [11, "X"],
              [12, "X"],
            ]),
          ),
        }),
      },
    ],
  },
  "seven-nation-army": {
    youtubeId: "0J2QdDbelmY",
    form: ["Intro riff", "主歌", "副歌", "riff 再現"],
    sections: [
      {
        label: "Intro Riff（4 小節）",
        description:
          "把 riff 想成 kick 線：對準每一下長短，再疊 2／4 snare。空間比密度重要。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4),
          kick: concat(
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
              [12, "x"],
            ]),
          ),
          snare: backbeat16(4),
        }),
      },
      {
        label: "副歌",
        description: "打開 HH（重音＝開），kick 可加厚，仍守 riff 骨架。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats16(4, [0, 16, 32, 48]),
          kick: concat(
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [12, "x"],
              [13, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [4, "x"],
              [6, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: backbeat16(4, [
            [15, "g"],
            [31, "g"],
            [47, "g"],
            [63, "g"],
          ]),
        }),
      },
    ],
  },
  "smells-like-teen-spirit": {
    youtubeId: "hTWKbfoikeg",
    form: ["安靜主歌", "爆發副歌", "主歌", "副歌", "Solo／尾"],
    sections: [
      {
        label: "主歌（收・4 小節）",
        description: "跟著影片安靜段：HH 四分／八分輕打，kick 少，留白。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: repeat(
            Array.from({ length: 16 }, (_, i) =>
              i % 4 === 0 ? ("x" as const) : ("" as const),
            ),
            4,
          ),
          kick: concat(
            place(16, [[0, "x"]]),
            place(16, [[0, "x"], [10, "x"]]),
            place(16, [[0, "x"]]),
            place(16, [[0, "x"], [8, "x"]]),
          ),
          snare: backbeat16(4),
        }),
      },
      {
        label: "副歌（放）",
        description: "Crash 進副歌：kick 更密，snare 可加 ghost；動態一次到位。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats16(4, [0, 8, 16, 24, 32, 40, 48, 56]),
          kick: concat(
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
              [12, "x"],
            ]),
          ),
          snare: backbeat16(4, [
            [7, "g"],
            [15, "g"],
            [23, "g"],
            [31, "g"],
            [39, "g"],
            [47, "g"],
            [55, "g"],
            [62, "g"],
            [63, "X"],
          ]),
        }),
      },
      {
        label: "進副歌 Fill",
        description: "主歌最後一小节：snare 滾奏感，撞上副歌 Crash。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: concat(
            repeat(
              Array.from({ length: 16 }, (_, i) =>
                i % 4 === 0 ? ("x" as const) : ("" as const),
              ),
              3,
            ),
            place(16, [[0, "X"], [4, "X"], [8, "X"], [12, "X"]]),
          ),
          kick: concat(
            place(16, [[0, "x"]]),
            place(16, [[0, "x"]]),
            place(16, [[0, "x"]]),
            place(16, [
              [0, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: concat(
            backbeat16(3),
            place(16, [
              [4, "X"],
              [6, "g"],
              [7, "X"],
              [8, "g"],
              [9, "X"],
              [10, "X"],
              [11, "g"],
              [12, "X"],
              [13, "X"],
              [14, "X"],
              [15, "X"],
            ]),
          ),
        }),
      },
    ],
  },
  "another-one-bites-the-dust": {
    youtubeId: "rY0WxgSXdEE",
    form: ["Bass／Kick intro", "主歌", "副歌", "間奏", "副歌"],
    sections: [
      {
        label: "Intro Kick Ostinato",
        description:
          "先跟影片把 kick 線對死（十六分格看長短），再疊 snare；不要蓋過貝斯。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4),
          kick: repeat(
            place(16, [
              [0, "x"],
              [8, "x"],
              [10, "x"],
              [13, "x"],
              [14, "x"],
            ]),
            4,
          ),
          snare: cells(64),
        }),
      },
      {
        label: "主歌／副歌",
        description: "同一 kick 線 + 2／4 snare；HH 八分。第 4 小節可微變。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4),
          kick: concat(
            repeat(
              place(16, [
                [0, "x"],
                [8, "x"],
                [10, "x"],
                [13, "x"],
                [14, "x"],
              ]),
              3,
            ),
            place(16, [
              [0, "x"],
              [8, "x"],
              [10, "x"],
              [12, "x"],
              [13, "x"],
              [14, "x"],
            ]),
          ),
          snare: backbeat16(4, [
            [15, "g"],
            [31, "g"],
            [47, "g"],
            [61, "g"],
            [63, "g"],
          ]),
        }),
      },
    ],
  },
  "uptown-funk": {
    youtubeId: "OPf0YbXqDm0",
    form: ["Intro hits", "主歌", "副歌", "Bridge", "副歌結束"],
    sections: [
      {
        label: "主歌 Groove（十六分）",
        description: "HH 十六分要鬆；kick 與 snare 對齊影片的同步感。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats16(4),
          kick: concat(
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [8, "x"],
              [11, "x"],
              [14, "x"],
            ]),
          ),
          snare: backbeat16(4, [
            [6, "g"],
            [14, "g"],
            [22, "g"],
            [30, "g"],
            [38, "g"],
            [46, "g"],
            [54, "g"],
            [62, "g"],
          ]),
        }),
      },
      {
        label: "副歌 Hits",
        description: "注意停頓與重音 hits；空白格也是譜的一部分。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: concat(
            hats16(2),
            place(16, [
              [0, "X"],
              [4, "X"],
              [8, ""],
              [12, "X"],
            ]),
            hats16(1),
          ),
          kick: concat(
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [4, "x"],
              [8, ""],
              [12, "x"],
            ]),
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: concat(
            backbeat16(2),
            place(16, [
              [0, "X"],
              [4, "X"],
              [12, "X"],
            ]),
            backbeat16(1),
          ),
        }),
      },
      {
        label: "Bridge／停頓",
        description: "Bridge 常有停：先數拍，再一起撞回副歌。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: concat(
            hats8(2),
            cells(16),
            place(16, [[0, "X"], [8, "x"], [12, "x"]]),
          ),
          kick: concat(
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            cells(16),
            place(16, [
              [0, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: concat(
            backbeat16(2),
            cells(16),
            place(16, [
              [4, "X"],
              [8, "X"],
              [12, "X"],
              [14, "g"],
              [15, "X"],
            ]),
          ),
        }),
      },
    ],
  },
  "we-will-rock-you": {
    youtubeId: "-tJYN-eG1zk",
    form: ["Stomp 全程", "人聲進出", "結他段", "結尾"],
    sections: [
      {
        label: "Stomp（4 小節）",
        description:
          "kick-kick-snare 對十六分格：1+ 踢、2 掌。整首幾乎不變，練重量與穩定。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: cells(64),
          kick: repeat(
            place(16, [
              [0, "x"],
              [2, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            4,
          ),
          snare: repeat(
            place(16, [
              [4, "X"],
              [12, "X"],
            ]),
            4,
          ),
        }),
      },
      {
        label: "結尾加花（可選）",
        description: "尾段可在第 4 小節多兩下 snare，仍回 stomp 感。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: cells(64),
          kick: concat(
            repeat(
              place(16, [
                [0, "x"],
                [2, "x"],
                [8, "x"],
                [10, "x"],
              ]),
              3,
            ),
            place(16, [
              [0, "x"],
              [2, "x"],
              [8, "x"],
              [10, "x"],
              [14, "x"],
            ]),
          ),
          snare: concat(
            repeat(
              place(16, [
                [4, "X"],
                [12, "X"],
              ]),
              3,
            ),
            place(16, [
              [4, "X"],
              [12, "X"],
              [14, "X"],
              [15, "X"],
            ]),
          ),
        }),
      },
    ],
  },
  "beat-it": {
    youtubeId: "oRdxUFDoQe0",
    form: ["Intro", "主歌", "副歌", "Solo", "副歌尾"],
    sections: [
      {
        label: "主歌（4 小節）",
        description: "乾淨 pop-rock：kick 在 1 與「a／+」變化；snare 要啪得齊。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4),
          kick: concat(
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [10, "x"],
              [14, "x"],
            ]),
          ),
          snare: backbeat16(4, [
            [15, "g"],
            [31, "g"],
            [47, "g"],
            [63, "g"],
          ]),
        }),
      },
      {
        label: "副歌",
        description: "可打開 HH（重音＝開）；kick 稍密，仍守 backbeat。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats16(4, [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62]),
          kick: concat(
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [4, "x"],
              [6, "x"],
              [10, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: backbeat16(4),
        }),
      },
      {
        label: "Solo 前 Fill",
        description: "進 Solo／副歌尾：第 4 小節十六分 snare fill。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: concat(hats8(3), place(16, [[0, "X"], [8, "x"], [12, "x"]])),
          kick: concat(
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [8, "x"],
              [12, "x"],
            ]),
          ),
          snare: concat(
            backbeat16(3),
            place(16, [
              [4, "X"],
              [6, "g"],
              [7, "X"],
              [8, "g"],
              [9, "X"],
              [10, "g"],
              [11, "X"],
              [12, "X"],
              [13, "g"],
              [14, "X"],
              [15, "X"],
            ]),
          ),
        }),
      },
    ],
  },
  "qing-tian": {
    youtubeId: "DYptgVvkVLQ",
    form: ["前奏", "主歌", "副歌", "間奏", "副歌", "尾奏"],
    sections: [
      {
        label: "主歌（4 小節）",
        description:
          "慢板十字節奏要柔。2 拍可用 ghost、4 拍才重；kick 稀疏，勿蓋人聲。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4),
          kick: concat(
            place(16, [
              [0, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [10, "x"],
            ]),
          ),
          snare: concat(
            place(16, [
              [4, "g"],
              [12, "X"],
            ]),
            place(16, [
              [4, "g"],
              [12, "X"],
              [15, "g"],
            ]),
            place(16, [
              [4, "g"],
              [12, "X"],
            ]),
            place(16, [
              [4, "g"],
              [11, "g"],
              [12, "X"],
            ]),
          ),
        }),
      },
      {
        label: "副歌",
        description: "副歌稍打開 HH，仍保持 ballad 呼吸；第 4 小節輕 fill。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4, 16),
          kick: concat(
            place(16, [
              [0, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [8, "x"],
              [10, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
              [14, "x"],
            ]),
          ),
          snare: concat(
            backbeat16(3),
            place(16, [
              [4, "X"],
              [10, "g"],
              [12, "X"],
              [14, "g"],
            ]),
          ),
        }),
      },
      {
        label: "間奏",
        description: "間奏可稍推，但仍留空給吉他／鋼琴。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4),
          kick: concat(
            place(16, [
              [0, "x"],
              [8, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [8, "x"],
            ]),
            place(16, [
              [0, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: concat(
            backbeat16(3),
            place(16, [
              [4, "X"],
              [8, "g"],
              [10, "X"],
              [12, "X"],
              [14, "g"],
              [15, "X"],
            ]),
          ),
        }),
      },
    ],
  },
  "hai-kuo-tian-kong": {
    youtubeId: "V4GUy2EHMMs",
    form: ["前奏", "主歌", "副歌", "主歌", "副歌", "大尾"],
    sections: [
      {
        label: "主歌（4 小節）",
        description: "克制 rock：HH 八分、kick 不過密；跟影片主歌動態。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats8(4),
          kick: concat(
            place(16, [
              [0, "x"],
              [8, "x"],
            ]),
            place(16, [
              [0, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [8, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
          ),
          snare: backbeat16(4),
        }),
      },
      {
        label: "副歌",
        description: "Crash／Ride 打開；kick 加厚，不要越打越趕。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: hats16(4, [0, 16, 32, 48]),
          kick: concat(
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
              [14, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [3, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: backbeat16(4, [
            [15, "g"],
            [31, "g"],
            [47, "g"],
            [63, "g"],
          ]),
        }),
      },
      {
        label: "大尾 Fill",
        description: "大尾前：第 4 小節 fill 再撞 Crash；控制速度。",
        pattern: groove({
          bars: 4,
          perBeat: 4,
          ride: concat(
            hats16(3, [0, 16, 32]),
            place(16, [
              [0, "X"],
              [4, "X"],
              [8, "X"],
              [12, "X"],
            ]),
          ),
          kick: concat(
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [6, "x"],
              [8, "x"],
              [10, "x"],
            ]),
            place(16, [
              [0, "x"],
              [8, "x"],
              [12, "x"],
              [14, "x"],
            ]),
          ),
          snare: concat(
            backbeat16(3),
            place(16, [
              [4, "X"],
              [6, "X"],
              [7, "g"],
              [8, "X"],
              [9, "g"],
              [10, "X"],
              [11, "X"],
              [12, "X"],
              [13, "X"],
              [14, "X"],
              [15, "X"],
            ]),
          ),
        }),
      },
    ],
  },
};

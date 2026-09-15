import type { ChartPattern, ChartSection } from "@/data/charts";

export type SongMedia = {
  youtubeId: string;
  form: string[];
  sections?: ChartSection[];
};

const empty = (): ChartPattern["voices"]["kick"] =>
  Array.from({ length: 16 }, () => "" as const);
const hats = (): ChartPattern["voices"]["ride"] =>
  Array.from({ length: 16 }, () => "x" as const);

const groove = (
  kick: ChartPattern["voices"]["kick"],
  snare: ChartPattern["voices"]["snare"],
  ride: ChartPattern["voices"]["ride"],
): ChartPattern => ({
  bars: 2,
  perBeat: 2,
  beatsPerBar: 4,
  voices: { ride, hihat: empty(), snare, kick },
});

/** 與 charts.ts 的 slug 一一對應 */
export const SONG_MEDIA: Record<string, SongMedia> = {
  "so-what": {
    youtubeId: "zqNTltOGh5c",
    form: ["頭奏", "主題", "Solo 輪流", "主題再現", "尾聲"],
    sections: [
      {
        label: "主題",
        description: "跟著影片主題段：ride 輕、2／4 點 snare。",
        pattern: groove(
          ["x", "", "", "", "", "", "", "x", "x", "", "", "", "", "", "", ""],
          ["", "", "g", "", "", "", "g", "", "", "", "g", "", "", "", "g", ""],
          ["x", "", "x", "x", "x", "", "x", "x", "x", "", "x", "x", "x", "", "x", "x"],
        ),
      },
      {
        label: "Solo 陪襯",
        description: "Solo 時 kick 再少，只守時間。",
        pattern: groove(
          empty(),
          ["", "", "g", "", "", "", "g", "", "", "", "g", "", "", "", "g", ""],
          ["x", "", "x", "x", "x", "", "x", "x", "x", "", "x", "x", "x", "", "x", "x"],
        ),
      },
    ],
  },
  "take-five": {
    youtubeId: "tT9Eh8wNMkw",
    form: ["Sax 主題", "鋼琴 Solo", "主題再現", "尾奏"],
  },
  "blue-train": {
    youtubeId: "YjRbmtrDJI4",
    form: ["頭奏", "主題", "Solo", "主題再現"],
  },
  "all-blues": {
    youtubeId: "-488UORrfJ0",
    form: ["Groove 開場", "主題", "Solo", "再現"],
  },
  "satin-doll": {
    youtubeId: "wTFPV1pk654",
    form: ["頭奏", "主題 AABA", "Solo", "再現"],
  },
  "autumn-leaves": {
    youtubeId: "CpB7-8SGlJ0",
    form: ["前奏", "主題", "Solo", "主題再現"],
  },
  moanin: {
    youtubeId: "fsJ3JjpZyoA",
    form: ["主題", "Solo", "呼應", "主題再現"],
  },
  "a-train": {
    youtubeId: "D6mFGy4g_n8",
    form: ["火車頭奏", "主題", "Solo", "再現／尾"],
  },
  "billie-jean": {
    youtubeId: "Zi_XLOBDo_Y",
    form: ["Intro 鼓＋Bass", "主歌", "副歌", "間奏", "副歌結束"],
    sections: [
      {
        label: "Intro／主歌",
        description: "先聽完整 intro，對準四落地 kick，再疊 snare。",
        pattern: groove(
          ["x", "", "", "", "x", "", "", "", "x", "", "", "", "x", "", "", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          hats(),
        ),
      },
      {
        label: "副歌",
        description: "副歌可補一點 kick，仍然不要打亂地板感。",
        pattern: groove(
          ["x", "", "", "", "x", "", "", "x", "x", "", "", "", "x", "", "x", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", "g"],
          hats(),
        ),
      },
    ],
  },
  "seven-nation-army": {
    youtubeId: "0J2QdDbelmY",
    form: ["Intro riff", "主歌", "副歌", "riff 再現"],
    sections: [
      {
        label: "Intro Riff",
        description: "先對 riff／kick 線，再加 snare。",
        pattern: groove(
          ["x", "", "", "x", "", "x", "", "", "x", "", "", "x", "", "x", "", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          ["x", "", "x", "", "x", "", "x", "", "x", "", "x", "", "x", "", "x", ""],
        ),
      },
      {
        label: "副歌",
        description: "打開 Hi-Hat，整體加厚。",
        pattern: groove(
          ["x", "", "", "x", "", "x", "", "", "x", "", "", "x", "x", "", "", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          hats(),
        ),
      },
    ],
  },
  "smells-like-teen-spirit": {
    youtubeId: "hTWKbfoikeg",
    form: ["安靜主歌", "爆發副歌", "主歌", "副歌", "Solo／尾"],
    sections: [
      {
        label: "主歌（收）",
        description: "跟著影片安靜段，輕打留白。",
        pattern: groove(
          ["x", "", "", "", "", "", "", "", "x", "", "", "", "", "", "", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          ["x", "", "x", "", "x", "", "x", "", "x", "", "x", "", "x", "", "x", ""],
        ),
      },
      {
        label: "副歌（放）",
        description: "副歌進去就爆發：Crash + 更密 kick。",
        pattern: groove(
          ["x", "", "", "x", "x", "", "", "", "x", "", "", "x", "x", "", "", ""],
          ["", "", "X", "", "", "", "X", "g", "", "", "X", "", "", "", "X", ""],
          hats().map((v, i) => (i % 4 === 0 ? "X" : v)),
        ),
      },
    ],
  },
  "another-one-bites-the-dust": {
    youtubeId: "rY0WxgSXdEE",
    form: ["Bass／Kick intro", "主歌", "副歌", "間奏", "副歌"],
    sections: [
      {
        label: "Intro Kick 線",
        description: "先跟影片把 kick ostinato 對死。",
        pattern: groove(
          ["x", "", "", "", "x", "x", "", "x", "x", "", "", "", "x", "x", "", "x"],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          ["x", "", "x", "", "x", "", "x", "", "x", "", "x", "", "x", "", "x", ""],
        ),
      },
      {
        label: "主歌／副歌",
        description: "維持同一 kick 線，snare 穩在 2／4。",
        pattern: groove(
          ["x", "", "", "", "x", "x", "", "x", "x", "", "", "", "x", "x", "", "x"],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          hats(),
        ),
      },
    ],
  },
  "uptown-funk": {
    youtubeId: "OPf0YbXqDm0",
    form: ["Intro hits", "主歌", "副歌", "Bridge", "副歌結束"],
    sections: [
      {
        label: "主歌 Groove",
        description: "先用八分 HH 站穩，再對影片加速感覺。",
        pattern: groove(
          ["x", "", "", "x", "", "", "x", "", "x", "", "", "", "", "x", "", ""],
          ["", "", "", "", "X", "", "", "", "", "", "", "", "X", "", "g", ""],
          hats(),
        ),
      },
      {
        label: "副歌 Hits",
        description: "注意影片裡的停頓與重音 hits。",
        pattern: groove(
          ["x", "", "", "x", "", "", "x", "", "x", "", "x", "", "", "x", "", ""],
          ["", "", "", "", "X", "", "", "", "", "", "", "", "X", "", "", ""],
          hats(),
        ),
      },
    ],
  },
  "we-will-rock-you": {
    youtubeId: "-tJYN-eG1zk",
    form: ["Stomp 全程", "人聲進出", "結他段", "結尾"],
    sections: [
      {
        label: "Stomp（全程）",
        description: "整首歌幾乎都是這下：kick-kick-snare。",
        pattern: groove(
          ["x", "x", "", "", "x", "x", "", "", "x", "x", "", "", "x", "x", "", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          empty(),
        ),
      },
    ],
  },
  "beat-it": {
    youtubeId: "oRdxUFDoQe0",
    form: ["Intro", "主歌", "副歌", "Solo", "副歌尾"],
    sections: [
      {
        label: "主歌",
        description: "乾淨 pop-rock backbeat，先對影片速度。",
        pattern: groove(
          ["x", "", "", "x", "", "", "", "", "x", "", "", "x", "x", "", "", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", "g"],
          hats(),
        ),
      },
      {
        label: "副歌",
        description: "可打開 HH，snare 打得更齊。",
        pattern: groove(
          ["x", "", "", "x", "", "", "", "", "x", "", "", "x", "x", "", "x", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          hats(),
        ),
      },
    ],
  },
  "qing-tian": {
    youtubeId: "DYptgVvkVLQ",
    form: ["前奏", "主歌", "副歌", "間奏", "副歌", "尾奏"],
    sections: [
      {
        label: "主歌",
        description: "先聽完主歌再打：慢、柔、不要蓋人聲。",
        pattern: groove(
          ["x", "", "", "", "", "", "", "", "x", "", "", "x", "", "", "", ""],
          ["", "", "g", "", "", "", "X", "", "", "", "g", "", "", "", "X", ""],
          ["x", "", "x", "", "x", "", "x", "", "x", "", "x", "", "x", "", "x", ""],
        ),
      },
      {
        label: "副歌",
        description: "副歌稍打開，仍保持 ballad 呼吸。",
        pattern: groove(
          ["x", "", "", "", "x", "", "", "", "x", "", "", "x", "", "", "", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          hats(),
        ),
      },
    ],
  },
  "hai-kuo-tian-kong": {
    youtubeId: "V4GUy2EHMMs",
    form: ["前奏", "主歌", "副歌", "主歌", "副歌", "大尾"],
    sections: [
      {
        label: "主歌",
        description: "跟著影片主歌：克制、留位。",
        pattern: groove(
          ["x", "", "", "", "x", "", "", "", "x", "", "", "", "x", "", "", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          hats(),
        ),
      },
      {
        label: "副歌／大尾",
        description: "副歌與大尾加 Crash，注意不要越打越趕。",
        pattern: groove(
          ["x", "", "", "x", "x", "", "", "", "x", "", "", "x", "x", "", "x", ""],
          ["", "", "X", "", "", "", "X", "", "", "", "X", "", "", "", "X", ""],
          hats().map((v, i) => (i === 0 || i === 8 ? "X" : v)),
        ),
      },
    ],
  },
};

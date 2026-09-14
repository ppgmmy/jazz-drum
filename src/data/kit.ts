export type DrumPadId =
  | "kick"
  | "snare"
  | "hihat"
  | "ride"
  | "tom"
  | "crash";

export type DrumPad = {
  id: DrumPadId;
  label: string;
  zh: string;
  key: string;
  frequency: number;
  type: OscillatorType;
  duration: number;
  gain: number;
  noise?: boolean;
};

export const DRUM_PADS: DrumPad[] = [
  {
    id: "kick",
    label: "Kick",
    zh: "大鼓",
    key: "a",
    frequency: 55,
    type: "sine",
    duration: 0.45,
    gain: 0.9,
  },
  {
    id: "snare",
    label: "Snare",
    zh: "小鼓",
    key: "s",
    frequency: 180,
    type: "triangle",
    duration: 0.22,
    gain: 0.55,
    noise: true,
  },
  {
    id: "hihat",
    label: "Hi-Hat",
    zh: "踩鑔",
    key: "d",
    frequency: 7200,
    type: "square",
    duration: 0.08,
    gain: 0.18,
    noise: true,
  },
  {
    id: "ride",
    label: "Ride",
    zh: "Ride",
    key: "f",
    frequency: 420,
    type: "sine",
    duration: 1.4,
    gain: 0.28,
  },
  {
    id: "tom",
    label: "Tom",
    zh: "筒鼓",
    key: "g",
    frequency: 120,
    type: "sine",
    duration: 0.35,
    gain: 0.65,
  },
  {
    id: "crash",
    label: "Crash",
    zh: "Crash",
    key: "h",
    frequency: 620,
    type: "triangle",
    duration: 1.1,
    gain: 0.32,
    noise: true,
  },
];

export const FEEL_LESSONS = [
  {
    title: "Swing 感覺",
    body: "把八分音符彈成「長—短」的呼吸，而不是機械均分。Ride 手先定速，其餘聲部跟著走。",
  },
  {
    title: "Ride 圖案",
    body: "經典「叮—叮叮」要輕、連、帶一點延音。先單手練 2 小節，再加 hi-hat 腳。",
  },
  {
    title: "Brush 觸感",
    body: "刷片在小鼓上畫圓，重點是摩擦聲的厚度，不是敲擊。試著讓 sweep 與 ride 同呼吸。",
  },
] as const;

export const PRACTICE_PATH = [
  {
    step: "01",
    title: "四分 Ride",
    detail: "只打 Ride 四分，腳踩 2 與 4，聽自己的時間是否穩定。",
  },
  {
    step: "02",
    title: "加 Snare 反拍",
    detail: "在 2、4 輕輕放 snare，保持 ride 線條不被打斷。",
  },
  {
    step: "03",
    title: "Kick 對位",
    detail: "用大鼓補和聲節奏，寧可少打，也要落在 pocket 裡。",
  },
] as const;

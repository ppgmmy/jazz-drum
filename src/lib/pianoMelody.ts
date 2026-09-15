import type { ChartPattern } from "@/data/charts";

/**
 * 用輕聲鋼琴代替歌聲線條：方便對住「唱到邊度」，唔搶鼓。
 * 係教學用旋律輪廓，唔係原曲完整 copyrighted transcription。
 */

export type MelodyNote = {
  midi: number;
  velocity: number;
  /** 以拍為單位嘅大致時值 */
  durationBeats: number;
};

type MelodyProfile = {
  /** 人聲中音區附近 */
  rootMidi: number;
  scale: number[];
  /**
   * 每拍一個 scale degree（可循環）；
   * -1 = 休止（像歌手換氣）
   * 數字可跨八度（例如 7 = 上一度根音）
   */
  phrase: number[];
  /** 相對鼓聲嘅輕聲倍率（預設好細） */
  softGain: number;
};

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];
const DORIAN = [0, 2, 3, 5, 7, 9, 10];
const MIXOLYDIAN = [0, 2, 4, 5, 7, 9, 10];
const PENT_MIN = [0, 3, 5, 7, 10];
const BLUES = [0, 3, 5, 6, 7, 10];

/** 每首：偏「可唱」嘅短句輪廓，輕聲坐喺鼓下面 */
const PROFILES: Record<string, MelodyProfile> = {
  // 小號 call／answer 感 → 琴代 hook
  "so-what": {
    rootMidi: 57,
    scale: DORIAN,
    phrase: [4, 4, 3, 2, 0, -1, 4, 3, 2, 0, -1, -1, 5, 4, 3, 2],
    softGain: 0.22,
  },
  "take-five": {
    rootMidi: 60,
    scale: MINOR,
    phrase: [0, 2, 4, 2, 0, 0, 2, 4, 5, 4],
    softGain: 0.22,
  },
  "blue-train": {
    rootMidi: 58,
    scale: BLUES,
    phrase: [0, -1, 2, 3, 4, 3, 2, 0, 4, -1, 3, 2, 0, -1, -1, -1],
    softGain: 0.2,
  },
  "all-blues": {
    rootMidi: 59,
    scale: MIXOLYDIAN,
    phrase: [0, -1, 2, 4, 5, 4, 2, 0, 4, -1, 5, 4, 2, 0, -1, -1],
    softGain: 0.2,
  },
  "satin-doll": {
    rootMidi: 60,
    scale: MAJOR,
    phrase: [2, 4, 5, 4, 2, 0, 1, 0, 4, 5, 7, 5, 4, 2, 0, -1],
    softGain: 0.2,
  },
  "autumn-leaves": {
    rootMidi: 62,
    scale: MINOR,
    phrase: [4, 3, 2, 0, 1, 0, -1, -1, 5, 4, 3, 1, 2, 0, -1, -1],
    softGain: 0.2,
  },
  moanin: {
    rootMidi: 58,
    scale: MINOR,
    phrase: [0, 0, 2, 3, 5, 3, 2, 0, 0, -1, 3, 2, 0, -1, -1, -1],
    softGain: 0.2,
  },
  "a-train": {
    rootMidi: 60,
    scale: MAJOR,
    phrase: [0, 2, 4, 5, 7, 5, 4, 2, 4, 5, 4, 2, 0, -1, -1, -1],
    softGain: 0.2,
  },
  // Pop vocal hooks — stylized singable outlines
  "billie-jean": {
    rootMidi: 62,
    scale: MINOR,
    phrase: [0, -1, 0, 2, 3, 2, 0, -1, 4, 3, 2, 0, 2, 0, -1, -1],
    softGain: 0.18,
  },
  "seven-nation-army": {
    rootMidi: 52,
    scale: PENT_MIN,
    phrase: [0, -1, 0, 3, 4, 3, 0, -1, 0, -1, 0, 3, 5, 4, 3, 0],
    softGain: 0.2,
  },
  "smells-like-teen-spirit": {
    rootMidi: 60,
    scale: MINOR,
    phrase: [0, -1, -1, 0, 3, -1, 5, 4, 0, -1, -1, 0, 3, 5, 4, -1],
    softGain: 0.18,
  },
  "another-one-bites-the-dust": {
    rootMidi: 55,
    scale: MINOR,
    phrase: [0, -1, -1, 0, -1, -1, 0, 2, 3, -1, 2, 0, -1, -1, -1, -1],
    softGain: 0.18,
  },
  "uptown-funk": {
    rootMidi: 60,
    scale: MIXOLYDIAN,
    phrase: [0, -1, 4, 5, 4, 2, 0, -1, 0, 2, 4, 5, 7, 5, 4, 2],
    softGain: 0.18,
  },
  "we-will-rock-you": {
    rootMidi: 60,
    scale: MAJOR,
    phrase: [0, -1, -1, 2, 4, -1, 5, 4, 0, -1, -1, 2, 4, 5, 4, -1],
    softGain: 0.18,
  },
  "beat-it": {
    rootMidi: 62,
    scale: MINOR,
    phrase: [0, 2, 3, 5, 3, 2, 0, -1, 4, 3, 2, 0, 2, 0, -1, -1],
    softGain: 0.18,
  },
  "qing-tian": {
    rootMidi: 64,
    scale: MAJOR,
    phrase: [0, 2, 4, 5, 4, 2, 0, 2, 5, 4, 2, 0, 1, 0, -1, -1],
    softGain: 0.18,
  },
  "hai-kuo-tian-kong": {
    rootMidi: 59,
    scale: MAJOR,
    phrase: [0, 2, 4, 5, 7, 5, 4, 2, 4, 5, 4, 2, 0, -1, -1, -1],
    softGain: 0.18,
  },
};

const FALLBACK_JAZZ: MelodyProfile = {
  rootMidi: 60,
  scale: DORIAN,
  phrase: [0, 2, 4, 3, 2, 0, -1, -1, 5, 4, 3, 2, 0, -1, -1, -1],
  softGain: 0.2,
};

const FALLBACK_POP: MelodyProfile = {
  rootMidi: 60,
  scale: MINOR,
  phrase: [0, -1, 2, 3, 5, 3, 2, 0, 4, 3, 2, 0, -1, -1, -1, -1],
  softGain: 0.18,
};

export function getMelodyProfile(
  melodyId: string | undefined,
  genreHint?: "jazz" | "pop",
): MelodyProfile {
  if (melodyId && PROFILES[melodyId]) return PROFILES[melodyId];
  return genreHint === "pop" ? FALLBACK_POP : FALLBACK_JAZZ;
}

function midiFromDegree(profile: MelodyProfile, degree: number): number {
  const len = profile.scale.length;
  const octave = Math.floor(degree / len);
  const idx = ((degree % len) + len) % len;
  return profile.rootMidi + octave * 12 + profile.scale[idx];
}

/** 依格位決定要唔要彈「歌聲」位 */
export function melodyNoteAtCell(
  profile: MelodyProfile,
  pattern: ChartPattern,
  cellIndex: number,
): MelodyNote | null {
  const beat = Math.floor(cellIndex / pattern.perBeat) % pattern.beatsPerBar;
  const sub = cellIndex % pattern.perBeat;
  // 只喺拍頭落音，留空間俾鼓
  if (sub !== 0) return null;

  const motifIndex = Math.floor(cellIndex / pattern.perBeat);
  const degree = profile.phrase[motifIndex % profile.phrase.length];
  if (degree < 0) return null;

  // 睇後面幾拍係休止／下一個音，決定拉長幾耐（更似唱歌）
  let hold = 1;
  for (let i = 1; i < 4; i += 1) {
    const next = profile.phrase[(motifIndex + i) % profile.phrase.length];
    if (next < 0) {
      hold += 1;
      continue;
    }
    break;
  }

  return {
    midi: midiFromDegree(profile, degree),
    velocity: (beat === 0 ? 0.42 : 0.3) * profile.softGain,
    durationBeats: hold,
  };
}

function midiToFreq(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

/**
 * 輕聲「歌聲位」琴音：偏 sine、少敲擊感，坐喺鼓下面。
 */
export function playPianoNote(
  ctx: AudioContext,
  when: number,
  midi: number,
  velocity = 0.08,
  durationSec = 0.55,
) {
  const freq = midiToFreq(midi);
  // 刻意好細 peak，唔同鼓搶
  const peak = Math.max(0.008, Math.min(0.09, velocity * 0.55));
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, when);
  master.gain.exponentialRampToValueAtTime(peak, when + 0.03);
  master.gain.exponentialRampToValueAtTime(peak * 0.55, when + 0.18);
  master.gain.exponentialRampToValueAtTime(0.0001, when + durationSec);
  master.connect(ctx.destination);

  const fund = ctx.createOscillator();
  fund.type = "sine";
  fund.frequency.setValueAtTime(freq, when);

  // 極輕第二泛音，似人聲／軟琴，唔刺耳
  const partial = ctx.createOscillator();
  partial.type = "sine";
  partial.frequency.setValueAtTime(freq * 2, when);
  const partialGain = ctx.createGain();
  partialGain.gain.setValueAtTime(peak * 0.14, when);
  partialGain.gain.exponentialRampToValueAtTime(0.0001, when + durationSec * 0.85);

  // 輕微 vibrato，更似唱歌
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(5.2, when);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(freq * 0.004, when);
  lfo.connect(lfoGain);
  lfoGain.connect(fund.frequency);

  fund.connect(master);
  partial.connect(partialGain);
  partialGain.connect(master);

  fund.start(when);
  partial.start(when);
  lfo.start(when);
  fund.stop(when + durationSec + 0.03);
  partial.stop(when + durationSec + 0.03);
  lfo.stop(when + durationSec + 0.03);
}

export function scheduleMelodyForCell(
  ctx: AudioContext,
  profile: MelodyProfile,
  pattern: ChartPattern,
  cellIndex: number,
  when: number,
  secondsPerBeat: number,
) {
  const note = melodyNoteAtCell(profile, pattern, cellIndex);
  if (!note) return;
  const dur = Math.max(0.28, note.durationBeats * secondsPerBeat * 0.92);
  playPianoNote(ctx, when, note.midi, note.velocity, dur);
}

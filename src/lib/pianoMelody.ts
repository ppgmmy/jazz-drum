import type { ChartPattern } from "@/data/charts";

/**
 * 教學用鋼琴引導旋律：只係 tonal outline／ostinato，
 * 唔係原曲 copyrighted transcription。
 */

export type MelodyNote = {
  midi: number;
  velocity: number;
  /** 以拍為單位嘅大致時值 */
  durationBeats: number;
};

type MelodyProfile = {
  /** 中音區根音 MIDI */
  rootMidi: number;
  /** 音階半音間隔（相對 root） */
  scale: number[];
  /**
   * 每拍一個 scale degree index（可循環）；
   * -1 = 休止；數字 = scale[degree % scale.length]
   */
  motif: number[];
  /** 幾密：每拍／每兩拍／每小節 */
  density: "beat" | "half" | "bar";
};

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];
const DORIAN = [0, 2, 3, 5, 7, 9, 10];
const MIXOLYDIAN = [0, 2, 4, 5, 7, 9, 10];
const PENT_MIN = [0, 3, 5, 7, 10];
const BLUES = [0, 3, 5, 6, 7, 10];

const PROFILES: Record<string, MelodyProfile> = {
  "so-what": {
    rootMidi: 50,
    scale: DORIAN,
    motif: [0, -1, 4, -1, 0, -1, 3, 2],
    density: "beat",
  },
  "take-five": {
    rootMidi: 58,
    scale: MINOR,
    motif: [0, 2, 4, 2, 0],
    density: "beat",
  },
  "blue-train": {
    rootMidi: 53,
    scale: BLUES,
    motif: [0, -1, 3, -1, 4, 3, 0, -1],
    density: "beat",
  },
  "all-blues": {
    rootMidi: 55,
    scale: MIXOLYDIAN,
    motif: [0, -1, 4, -1, 5, 4, 0, -1],
    density: "beat",
  },
  "satin-doll": {
    rootMidi: 53,
    scale: MAJOR,
    motif: [0, 2, 4, 5, 4, 2, 0, -1],
    density: "half",
  },
  "autumn-leaves": {
    rootMidi: 57,
    scale: MINOR,
    motif: [4, 3, 2, 0, 1, 0, -1, -1],
    density: "half",
  },
  moanin: {
    rootMidi: 53,
    scale: MINOR,
    motif: [0, -1, 0, 2, 3, -1, 4, -1],
    density: "beat",
  },
  "a-train": {
    rootMidi: 53,
    scale: MAJOR,
    motif: [0, 2, 4, 7, 4, 2, 0, -1],
    density: "half",
  },
  "billie-jean": {
    rootMidi: 55,
    scale: MINOR,
    motif: [0, -1, 0, -1, 4, -1, 3, -1],
    density: "beat",
  },
  "seven-nation-army": {
    rootMidi: 52,
    scale: PENT_MIN,
    motif: [0, -1, 0, 3, 4, 3, 0, -1],
    density: "beat",
  },
  "smells-like-teen-spirit": {
    rootMidi: 55,
    scale: MINOR,
    motif: [0, -1, -1, -1, 3, -1, 5, -1],
    density: "half",
  },
  "another-one-bites-the-dust": {
    rootMidi: 52,
    scale: MINOR,
    motif: [0, -1, -1, 0, -1, -1, 0, 3],
    density: "beat",
  },
  "uptown-funk": {
    rootMidi: 53,
    scale: MIXOLYDIAN,
    motif: [0, -1, 4, -1, 0, -1, 5, 4],
    density: "beat",
  },
  "we-will-rock-you": {
    rootMidi: 55,
    scale: MAJOR,
    motif: [0, -1, -1, 0, -1, -1, 4, -1],
    density: "half",
  },
  "beat-it": {
    rootMidi: 58,
    scale: MINOR,
    motif: [0, -1, 3, -1, 4, -1, 3, 0],
    density: "beat",
  },
  "qing-tian": {
    rootMidi: 60,
    scale: MAJOR,
    motif: [0, 2, 4, 2, 5, 4, 2, 0],
    density: "half",
  },
  "hai-kuo-tian-kong": {
    rootMidi: 55,
    scale: MAJOR,
    motif: [0, -1, 4, 5, 4, 2, 0, -1],
    density: "half",
  },
};

const FALLBACK_JAZZ: MelodyProfile = {
  rootMidi: 55,
  scale: DORIAN,
  motif: [0, -1, 4, -1, 3, 2, 0, -1],
  density: "beat",
};

const FALLBACK_POP: MelodyProfile = {
  rootMidi: 55,
  scale: MINOR,
  motif: [0, -1, 0, -1, 4, -1, 3, -1],
  density: "beat",
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

/** 依格位決定要唔要彈引導音 */
export function melodyNoteAtCell(
  profile: MelodyProfile,
  pattern: ChartPattern,
  cellIndex: number,
): MelodyNote | null {
  const cellsPerBar = pattern.beatsPerBar * pattern.perBeat;
  const beat = Math.floor(cellIndex / pattern.perBeat) % pattern.beatsPerBar;
  const sub = cellIndex % pattern.perBeat;
  // 只喺拍頭（第一細分）落音，避免同鼓搶
  if (sub !== 0) return null;

  if (profile.density === "half" && beat % 2 !== 0) return null;
  if (profile.density === "bar" && beat !== 0) return null;

  const motifIndex = Math.floor(cellIndex / pattern.perBeat);
  const degree = profile.motif[motifIndex % profile.motif.length];
  if (degree < 0) return null;

  const durationBeats =
    profile.density === "bar" ? pattern.beatsPerBar : profile.density === "half" ? 2 : 1;

  return {
    midi: midiFromDegree(profile, degree),
    velocity: beat === 0 ? 0.55 : 0.38,
    durationBeats,
  };
}

function midiToFreq(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

/** 簡易鋼琴音色：三角波 + 短噪聲敲擊 + 指數衰减 */
export function playPianoNote(
  ctx: AudioContext,
  when: number,
  midi: number,
  velocity = 0.4,
  durationSec = 0.45,
) {
  const freq = midiToFreq(midi);
  const peak = Math.max(0.02, Math.min(0.45, velocity * 0.32));
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, when);
  master.gain.exponentialRampToValueAtTime(peak, when + 0.012);
  master.gain.exponentialRampToValueAtTime(peak * 0.35, when + 0.12);
  master.gain.exponentialRampToValueAtTime(0.0001, when + durationSec);
  master.connect(ctx.destination);

  const fund = ctx.createOscillator();
  fund.type = "triangle";
  fund.frequency.setValueAtTime(freq, when);

  const partial = ctx.createOscillator();
  partial.type = "sine";
  partial.frequency.setValueAtTime(freq * 2.01, when);
  const partialGain = ctx.createGain();
  partialGain.gain.setValueAtTime(peak * 0.22, when);
  partialGain.gain.exponentialRampToValueAtTime(0.0001, when + durationSec * 0.7);

  const hammer = ctx.createOscillator();
  hammer.type = "sine";
  hammer.frequency.setValueAtTime(freq * 4.5, when);
  const hammerGain = ctx.createGain();
  hammerGain.gain.setValueAtTime(peak * 0.18, when);
  hammerGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.04);

  fund.connect(master);
  partial.connect(partialGain);
  partialGain.connect(master);
  hammer.connect(hammerGain);
  hammerGain.connect(master);

  fund.start(when);
  partial.start(when);
  hammer.start(when);
  fund.stop(when + durationSec + 0.02);
  partial.stop(when + durationSec + 0.02);
  hammer.stop(when + 0.06);
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
  const dur = Math.max(0.18, note.durationBeats * secondsPerBeat * 0.85);
  playPianoNote(ctx, when, note.midi, note.velocity, dur);
}

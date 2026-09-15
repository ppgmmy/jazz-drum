import { DRUM_PADS, type DrumPad, type DrumPadId } from "@/data/kit";
import type { Cell, ChartPattern, DrumVoice } from "@/data/charts";

/** 較長噪聲緩衝：Crash／Ride 殘響要用到 */
export function createNoiseBuffer(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 2.2), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function clampVelocity(velocity: number) {
  return Math.max(0.05, Math.min(1.25, velocity));
}

function connectMaster(
  ctx: AudioContext,
  when: number,
  gain: number,
  duration: number,
) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(Math.max(0.0001, gain), when);
  master.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  master.connect(ctx.destination);
  return master;
}

/** 輕微飽和，令鼓聲更有「打到皮」嘅厚度 */
function softClip(ctx: AudioContext, amount = 1.6) {
  const shaper = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < curve.length; i += 1) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * amount);
  }
  shaper.curve = curve;
  shaper.oversample = "2x";
  return shaper;
}

function tone(
  ctx: AudioContext,
  dest: AudioNode,
  when: number,
  opts: {
    type: OscillatorType;
    freqStart: number;
    freqEnd: number;
    peak: number;
    attack: number;
    decay: number;
  },
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type;
  osc.frequency.setValueAtTime(Math.max(20, opts.freqStart), when);
  osc.frequency.exponentialRampToValueAtTime(
    Math.max(20, opts.freqEnd),
    when + opts.decay,
  );
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, opts.peak),
    when + opts.attack,
  );
  gain.gain.exponentialRampToValueAtTime(0.0001, when + opts.decay);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(when);
  osc.stop(when + opts.decay + 0.03);
}

function noiseBurst(
  ctx: AudioContext,
  noiseBuffer: AudioBuffer,
  dest: AudioNode,
  when: number,
  opts: {
    type: BiquadFilterType;
    freq: number;
    q?: number;
    peak: number;
    attack: number;
    decay: number;
  },
) {
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  src.buffer = noiseBuffer;
  filter.type = opts.type;
  filter.frequency.setValueAtTime(opts.freq, when);
  filter.Q.value = opts.q ?? 0.7;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, opts.peak),
    when + opts.attack,
  );
  gain.gain.exponentialRampToValueAtTime(0.0001, when + opts.decay);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  src.start(when);
  src.stop(when + opts.decay + 0.03);
}

function playKick(
  ctx: AudioContext,
  noiseBuffer: AudioBuffer,
  when: number,
  velocity: number,
  padGain: number,
) {
  const v = clampVelocity(velocity);
  const master = connectMaster(ctx, when, padGain * v * 1.05, 0.55);
  const body = softClip(ctx, 2.1);
  body.connect(master);

  // 低頻身體：高起音再掉到 ~45Hz
  tone(ctx, body, when, {
    type: "sine",
    freqStart: 168,
    freqEnd: 44,
    peak: 1,
    attack: 0.004,
    decay: 0.42,
  });
  // 次低音層：更長、更暖
  tone(ctx, body, when, {
    type: "sine",
    freqStart: 72,
    freqEnd: 38,
    peak: 0.55,
    attack: 0.006,
    decay: 0.5,
  });
  // 打皮 click
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "bandpass",
    freq: 1800,
    q: 0.9,
    peak: 0.28 * v,
    attack: 0.001,
    decay: 0.035,
  });
  tone(ctx, master, when, {
    type: "triangle",
    freqStart: 220,
    freqEnd: 90,
    peak: 0.22 * v,
    attack: 0.001,
    decay: 0.04,
  });
}

function playSnare(
  ctx: AudioContext,
  noiseBuffer: AudioBuffer,
  when: number,
  velocity: number,
  padGain: number,
) {
  const v = clampVelocity(velocity);
  const master = connectMaster(ctx, when, padGain * v, 0.32);
  const body = softClip(ctx, 1.5);
  body.connect(master);

  // 鼓身音頭
  tone(ctx, body, when, {
    type: "triangle",
    freqStart: 210,
    freqEnd: 155,
    peak: 0.55,
    attack: 0.002,
    decay: 0.12,
  });
  tone(ctx, body, when, {
    type: "sine",
    freqStart: 180,
    freqEnd: 140,
    peak: 0.35,
    attack: 0.002,
    decay: 0.16,
  });
  // 響弦（wires）
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "bandpass",
    freq: 4200,
    q: 0.85,
    peak: 0.85 * v,
    attack: 0.001,
    decay: 0.18,
  });
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "highpass",
    freq: 6500,
    q: 0.5,
    peak: 0.35 * v,
    attack: 0.001,
    decay: 0.08,
  });
  // 短瞬態
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "bandpass",
    freq: 1200,
    q: 1.2,
    peak: 0.4 * v,
    attack: 0.001,
    decay: 0.03,
  });
}

function playHihat(
  ctx: AudioContext,
  noiseBuffer: AudioBuffer,
  when: number,
  velocity: number,
  padGain: number,
) {
  const v = clampVelocity(velocity);
  const master = connectMaster(ctx, when, padGain * v * 1.4, 0.12);
  // 金屬感：幾個不諧和方波經 highpass
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 7000;
  filter.Q.value = 0.6;
  filter.connect(master);

  const ratios = [1, 1.34, 1.77, 2.41, 3.13];
  for (const ratio of ratios) {
    tone(ctx, filter, when, {
      type: "square",
      freqStart: 420 * ratio,
      freqEnd: 400 * ratio,
      peak: (0.12 / ratios.length) * v,
      attack: 0.001,
      decay: 0.05,
    });
  }
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "highpass",
    freq: 9000,
    q: 0.4,
    peak: 0.55 * v,
    attack: 0.001,
    decay: 0.055,
  });
}

function playRide(
  ctx: AudioContext,
  noiseBuffer: AudioBuffer,
  when: number,
  velocity: number,
  padGain: number,
) {
  const v = clampVelocity(velocity);
  const master = connectMaster(ctx, when, padGain * v * 1.15, 1.2);

  // Bell 部分音
  const bellPartials = [
    { f: 420, g: 0.28 },
    { f: 640, g: 0.16 },
    { f: 980, g: 0.1 },
    { f: 1480, g: 0.06 },
    { f: 2100, g: 0.04 },
  ];
  for (const partial of bellPartials) {
    tone(ctx, master, when, {
      type: "sine",
      freqStart: partial.f,
      freqEnd: partial.f * 0.985,
      peak: partial.g * v,
      attack: 0.002,
      decay: 0.9,
    });
  }
  // 鑔面 wash
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "bandpass",
    freq: 6500,
    q: 0.55,
    peak: 0.18 * v,
    attack: 0.004,
    decay: 0.75,
  });
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "highpass",
    freq: 9000,
    peak: 0.08 * v,
    attack: 0.002,
    decay: 0.35,
  });
}

function playTom(
  ctx: AudioContext,
  noiseBuffer: AudioBuffer,
  when: number,
  velocity: number,
  padGain: number,
) {
  const v = clampVelocity(velocity);
  const master = connectMaster(ctx, when, padGain * v, 0.45);
  const body = softClip(ctx, 1.7);
  body.connect(master);

  tone(ctx, body, when, {
    type: "sine",
    freqStart: 195,
    freqEnd: 98,
    peak: 0.95,
    attack: 0.004,
    decay: 0.34,
  });
  tone(ctx, body, when, {
    type: "triangle",
    freqStart: 240,
    freqEnd: 110,
    peak: 0.28,
    attack: 0.003,
    decay: 0.22,
  });
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "bandpass",
    freq: 900,
    q: 1,
    peak: 0.22 * v,
    attack: 0.001,
    decay: 0.05,
  });
}

function playCrash(
  ctx: AudioContext,
  noiseBuffer: AudioBuffer,
  when: number,
  velocity: number,
  padGain: number,
) {
  const v = clampVelocity(velocity);
  const master = connectMaster(ctx, when, padGain * v, 1.6);

  const metallic = [380, 520, 740, 980, 1320, 1850, 2450, 3200];
  for (const [index, freq] of metallic.entries()) {
    tone(ctx, master, when, {
      type: index % 2 === 0 ? "triangle" : "sine",
      freqStart: freq,
      freqEnd: freq * 0.97,
      peak: (0.2 / metallic.length) * (1 + (index % 3 === 0 ? 0.4 : 0)) * v,
      attack: 0.002,
      decay: 1.25 - index * 0.05,
    });
  }
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "bandpass",
    freq: 4500,
    q: 0.4,
    peak: 0.7 * v,
    attack: 0.003,
    decay: 1.2,
  });
  noiseBurst(ctx, noiseBuffer, master, when, {
    type: "highpass",
    freq: 7500,
    peak: 0.4 * v,
    attack: 0.002,
    decay: 0.9,
  });
}

export function playPad(
  ctx: AudioContext,
  pad: DrumPad,
  noiseBuffer: AudioBuffer,
  when = ctx.currentTime,
  velocity = 1,
) {
  switch (pad.id) {
    case "kick":
      playKick(ctx, noiseBuffer, when, velocity, pad.gain);
      return;
    case "snare":
      playSnare(ctx, noiseBuffer, when, velocity, pad.gain);
      return;
    case "hihat":
      playHihat(ctx, noiseBuffer, when, velocity, pad.gain);
      return;
    case "ride":
      playRide(ctx, noiseBuffer, when, velocity, pad.gain);
      return;
    case "tom":
      playTom(ctx, noiseBuffer, when, velocity, pad.gain);
      return;
    case "crash":
      playCrash(ctx, noiseBuffer, when, velocity, pad.gain);
      return;
    default: {
      const _exhaustive: never = pad.id;
      return _exhaustive;
    }
  }
}

export function getPad(id: DrumPadId): DrumPad {
  const pad = DRUM_PADS.find((item) => item.id === id);
  if (!pad) throw new Error(`Missing pad ${id}`);
  return pad;
}

/** 由譜面 tempo 字串抽出 BPM（♩ 或 ♩.） */
export function parseTempoBpm(tempo: string): number {
  const match = tempo.match(/([\d.]+)/);
  const value = match ? Number(match[1]) : 100;
  if (!Number.isFinite(value) || value <= 0) return 100;
  // 附點四分＝拍時，直接當「一大拍」BPM 用（配合 beatsPerBar）
  return Math.round(value);
}

function cellVelocity(cell: Cell): number {
  switch (cell) {
    case "X":
      return 1.15;
    case "x":
      return 0.95;
    case "g":
      return 0.35;
    case "":
      return 0;
    default: {
      const _exhaustive: never = cell;
      return _exhaustive;
    }
  }
}

function voiceToPad(voice: DrumVoice, rideIsHat: boolean): DrumPadId {
  switch (voice) {
    case "kick":
      return "kick";
    case "snare":
      return "snare";
    case "hihat":
      return "hihat";
    case "ride":
      return rideIsHat ? "hihat" : "ride";
    default: {
      const _exhaustive: never = voice;
      return _exhaustive;
    }
  }
}

export type ScheduledHit = {
  voice: DrumVoice;
  padId: DrumPadId;
  velocity: number;
};

/** 譜面播放時：踩鑔／Ride 當拍子感，音量要低過踢／军，唔好蓋住鼓聲 */
function chartVoiceMix(voice: DrumVoice): number {
  switch (voice) {
    case "ride":
      return 0.38;
    case "hihat":
      return 0.34;
    case "snare":
      return 1;
    case "kick":
      return 1.08;
    default: {
      const _exhaustive: never = voice;
      return _exhaustive;
    }
  }
}

/** 某一格要打哪些聲部 */
export function hitsAtCell(
  pattern: ChartPattern,
  cellIndex: number,
  rideIsHat: boolean,
): ScheduledHit[] {
  const voices: DrumVoice[] = ["ride", "hihat", "snare", "kick"];
  const hits: ScheduledHit[] = [];
  for (const voice of voices) {
    const cell = pattern.voices[voice][cellIndex] ?? "";
    const velocity = cellVelocity(cell) * chartVoiceMix(voice);
    if (velocity <= 0) continue;
    hits.push({
      voice,
      padId: voiceToPad(voice, rideIsHat),
      velocity,
    });
  }
  return hits;
}

export function totalCells(pattern: ChartPattern): number {
  return pattern.bars * pattern.beatsPerBar * pattern.perBeat;
}

export function secondsPerCell(pattern: ChartPattern, bpm: number): number {
  const beatSec = 60 / Math.max(40, Math.min(240, bpm));
  return beatSec / pattern.perBeat;
}

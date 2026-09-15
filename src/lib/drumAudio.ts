import { DRUM_PADS, type DrumPad, type DrumPadId } from "@/data/kit";
import type { Cell, ChartPattern, DrumVoice } from "@/data/charts";

export function createNoiseBuffer(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function playPad(
  ctx: AudioContext,
  pad: DrumPad,
  noiseBuffer: AudioBuffer,
  when = ctx.currentTime,
  velocity = 1,
) {
  const master = ctx.createGain();
  master.gain.value = pad.gain * Math.max(0.05, Math.min(1.2, velocity));
  master.connect(ctx.destination);

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = pad.type;
  osc.frequency.setValueAtTime(pad.frequency, when);
  if (pad.id === "kick" || pad.id === "tom") {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(35, pad.frequency * 0.35),
      when + pad.duration * 0.55,
    );
  }
  oscGain.gain.setValueAtTime(1, when);
  oscGain.gain.exponentialRampToValueAtTime(0.001, when + pad.duration);
  osc.connect(oscGain);
  oscGain.connect(master);
  osc.start(when);
  osc.stop(when + pad.duration + 0.02);

  if (pad.noise) {
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    noise.buffer = noiseBuffer;
    filter.type = pad.id === "hihat" ? "highpass" : "bandpass";
    filter.frequency.value = pad.id === "hihat" ? 6000 : 1800;
    noiseGain.gain.setValueAtTime(
      (pad.id === "snare" ? 0.7 : pad.id === "hihat" ? 0.18 : 0.35) *
        velocity,
      when,
    );
    noiseGain.gain.exponentialRampToValueAtTime(
      0.001,
      when + pad.duration * 0.8,
    );
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(when);
    noise.stop(when + pad.duration);
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

function voiceToPad(
  voice: DrumVoice,
  rideIsHat: boolean,
): DrumPadId {
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
      return 0.42;
    case "hihat":
      return 0.38;
    case "snare":
      return 1;
    case "kick":
      return 1.05;
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

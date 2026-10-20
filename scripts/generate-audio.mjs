// Generates a 30 second, 120 BPM synth bed plus small cartoon SFX.
// No external samples: everything is synthesized so the soundtrack is original.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const SR = 44100;
const DURATION = 30;
const N = SR * DURATION;
const out = new Float32Array(N);

let seed = 123456789;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const addTone = (start, dur, freq, gain, shape = 'sine', decay = 6) => {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    const env = Math.exp(-t * decay);
    const ph = 2 * Math.PI * freq * t;
    let v = Math.sin(ph);
    if (shape === 'triangle') v = (2 / Math.PI) * Math.asin(Math.sin(ph));
    if (shape === 'square') v = Math.sin(ph) > 0 ? 0.7 : -0.7;
    out[s0 + i] += v * env * gain;
  }
};

const addKick = (start, gain = 0.7) => {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(0.36 * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    const f = 46 + 120 * Math.exp(-t * 28);
    const env = Math.exp(-t * 8.5);
    out[s0 + i] += Math.sin(2 * Math.PI * f * t) * env * gain;
  }
};

const addSnare = (start, gain = 0.34) => {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(0.22 * SR);
  let prev = 0;
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 18);
    const noise = rnd() * 2 - 1;
    const hp = noise - prev;
    prev = noise;
    out[s0 + i] += (hp * 0.6 + Math.sin(2 * Math.PI * 185 * t) * 0.25) * env * gain;
  }
};

const addHat = (start, gain = 0.12) => {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(0.055 * SR);
  let prev = 0;
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 70);
    const noise = rnd() * 2 - 1;
    const hp = noise - prev * 0.92;
    prev = noise;
    out[s0 + i] += hp * env * gain;
  }
};

const addWhoosh = (start, dur = 0.5, gain = 0.2, up = true) => {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  let prev = 0;
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    const p = t / dur;
    const env = Math.sin(Math.PI * Math.min(1, p));
    const noise = rnd() * 2 - 1;
    const hp = noise - prev * (up ? 0.9 - p * 0.5 : 0.5 + p * 0.4);
    prev = noise;
    out[s0 + i] += hp * env * gain;
  }
};

const addClang = (start, gain = 0.3) => {
  const partials = [523, 1187, 1743, 2310, 3102];
  const s0 = Math.floor(start * SR);
  const n = Math.floor(0.7 * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    let v = 0;
    partials.forEach((f, k) => {
      v += Math.sin(2 * Math.PI * f * t + k) * Math.exp(-t * (4 + k * 2.2));
    });
    out[s0 + i] += v * gain * 0.22;
  }
};

const addDing = (start, gain = 0.18) => {
  addTone(start, 0.6, 1046.5, gain, 'sine', 5);
  addTone(start + 0.09, 0.5, 1568, gain * 0.7, 'sine', 6);
  addTone(start + 0.18, 0.4, 2093, gain * 0.45, 'sine', 7);
};

const CHORDS = [
  {bass: 65.41, notes: [261.63, 329.63, 392.0]},
  {bass: 49.0, notes: [196.0, 246.94, 293.66]},
  {bass: 55.0, notes: [220.0, 261.63, 329.63]},
  {bass: 43.65, notes: [174.61, 220.0, 261.63]},
];
const MELODY = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 659.25];

const beat = 0.5; // 120 BPM
const bar = beat * 4;

for (let b = 0; b < Math.ceil(DURATION / bar); b++) {
  const chord = CHORDS[b % 4];
  const start = b * bar;
  // pad
  chord.notes.forEach((f, k) => {
    const s0 = Math.floor(start * SR);
    const n = Math.floor(bar * SR);
    for (let i = 0; i < n && s0 + i < N; i++) {
      const t = i / SR;
      const attack = Math.min(1, t / 0.35);
      const release = t > bar - 0.25 ? Math.max(0, (bar - t) / 0.25) : 1;
      out[s0 + i] += Math.sin(2 * Math.PI * f * 0.5 * t) * 0.026 * attack * release * (k === 0 ? 1 : 0.75);
    }
  });
  // bass eighths
  for (let e = 0; e < 8; e++) {
    const st = start + e * (beat / 2);
    const f = chord.bass * (e % 3 === 2 ? 2 : 1);
    addTone(st, 0.23, f, 0.15, 'triangle', 7);
  }
  // drums
  for (let q = 0; q < 4; q++) {
    addKick(start + q * beat, q === 0 ? 0.62 : 0.5);
    if (q === 1 || q === 3) addSnare(start + q * beat, 0.26);
    addHat(start + q * beat, 0.08);
    addHat(start + q * beat + beat / 2, 0.055);
  }
  // melody
  for (let e = 0; e < 8; e++) {
    if (b % 2 === 0 && e % 2 === 0) continue;
    const st = start + e * (beat / 2);
    const f = MELODY[(e + b * 3) % MELODY.length];
    addTone(st, 0.2, f, 0.055, 'triangle', 9);
    addTone(st, 0.2, f * 2, 0.018, 'sine', 12);
  }
}

// intro / transition SFX
addWhoosh(1.65, 0.5, 0.2, true);
addWhoosh(2.35, 0.3, 0.12, true);
[2.6, 2.9, 3.2, 3.5].forEach((t, i) => addTone(t, 0.12, 660 + i * 120, 0.09, 'sine', 14));
addTone(5.6, 0.18, 520, 0.06, 'sine', 10);
addClang(7.05, 0.32);
addWhoosh(7.0, 0.35, 0.1, false);
addDing(9.35);
addDing(9.72);
addDing(10.05);
addTone(12.55, 0.1, 440, 0.1, 'square', 18);
addTone(13.55, 0.18, 220, 0.14, 'square', 10);
addWhoosh(20.1, 0.4, 0.12, true);
addTone(22.15, 0.12, 880, 0.1, 'sine', 12);
addWhoosh(23.7, 0.6, 0.16, true);
addDing(24.15);
addTone(24.3, 0.4, 523.25, 0.09, 'sine', 4);
addTone(24.45, 0.4, 659.25, 0.08, 'sine', 4);
addTone(24.6, 0.6, 783.99, 0.09, 'sine', 3);
addClang(29.1, 0.12);

// soft limiter and fades
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[i]));
const norm = 0.88 / Math.max(peak, 1e-6);
const fadeIn = SR * 0.35;
const fadeOut = SR * 1.2;
for (let i = 0; i < N; i++) {
  let g = norm;
  if (i < fadeIn) g *= i / fadeIn;
  if (i > N - fadeOut) g *= (N - i) / fadeOut;
  out[i] = Math.tanh(out[i] * g * 1.1) * 0.92;
}

// write 16-bit PCM WAV
const data = Buffer.alloc(N * 2);
for (let i = 0; i < N; i++) {
  const v = Math.max(-1, Math.min(1, out[i]));
  data.writeInt16LE(Math.round(v * 32767), i * 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);

const dir = path.resolve('public/audio');
fs.mkdirSync(dir, {recursive: true});
const wav = path.join(dir, 'bgm.wav');
fs.writeFileSync(wav, Buffer.concat([header, data]));
console.log(`wrote ${wav} (${(N * 2 / 1024 / 1024).toFixed(1)} MB)`);
const mp3 = path.join(dir, 'bgm.mp3');
execFileSync(
  'ffmpeg',
  ['-y', '-v', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3],
  {stdio: 'inherit'},
);
fs.unlinkSync(wav);
console.log(`wrote ${mp3}`);

export const W = 1280;
export const H = 720;
export const FPS = 30;
export const DURATION = 900;

export const theme = {
  paper: '#F2EEE3',
  paperDeep: '#E8E1D1',
  card: '#FBF8F0',
  ink: '#2E2924',
  inkSoft: '#6B6055',
  inkFaint: '#A79D90',
  coral: '#D46A57',
  coralDark: '#B84E3C',
  coralLight: '#E99786',
  teal: '#79D0C4',
  tealDark: '#2E9C8F',
  yellow: '#F7D566',
  yellowDark: '#C99A2E',
  lavender: '#CBB9E8',
  lavenderDeep: '#A78FD1',
  purple: '#6A5ACD',
  purpleDeep: '#4A3C9E',
  night: '#2D2A5E',
  nightDeep: '#1B1A3D',
  blue: '#5B7FC7',
  pink: '#F3B7C2',
  mint: '#CDEEE2',
  grey: '#BDB6AA',
  red: '#D9534F',
  white: '#FFFFFF',
};

export const FONT = '"Xiaoke", "KaiTi", "STKaiti", "Segoe Print", cursive';

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, p: number) => a + (b - a) * clamp(p);

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const seeded = (seed: number, min: number, max: number) =>
  min + rand(seed) * (max - min);

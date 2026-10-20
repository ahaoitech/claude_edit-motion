import {theme} from './theme';

export type SceneKind = 'night' | 'ramen' | 'shiba' | 'disco';

export type Clip = {
  id: SceneKind;
  label: string;
  start: number;
  duration: number;
  tint: string;
};

export const CLIPS: Clip[] = [
  {id: 'night', label: '夜景.mp4', start: 0, duration: 2.4, tint: theme.night},
  {id: 'ramen', label: '拉面.mp4', start: 2.4, duration: 4.6, tint: '#E7C89B'},
  {id: 'shiba', label: '柴犬.mov', start: 7.0, duration: 2.9, tint: theme.mint},
  {id: 'disco', label: '小克蹦迪.mp4', start: 9.9, duration: 2.8, tint: '#6B4C9A'},
];

export const MEDIA = [
  {id: 'night' as SceneKind, label: '夜景.mp4', duration: '2.4s'},
  {id: 'ramen' as SceneKind, label: '拉面.mp4', duration: '4.6s'},
  {id: 'shiba' as SceneKind, label: '柴犬.mov', duration: '2.9s'},
  {id: 'disco' as SceneKind, label: '小克蹦迪.mp4', duration: '2.8s'},
];

export const TL = {
  x: 110,
  y: 468,
  pxPerSec: 70,
  height: 98,
  audioY: 584,
  audioHeight: 42,
};

/** Video time (seconds) -> playhead position on the edit timeline (seconds). */
export const PLAYHEAD_KEYS: [number, number][] = [
  [0, 0],
  [2.2, 0],
  [4.0, 0],
  [5.0, 0.4],
  [6.0, 1.6],
  [6.9, 2.0],
  [8.0, 4.0],
  [9.5, 4.8],
  [11.0, 7.4],
  [12.0, 8.0],
  [14.0, 9.0],
  [16.0, 10.0],
  [20.0, 10.0],
  [23.5, 11.0],
  [24.2, 15.0],
  [30.0, 15.0],
];

export const sceneForTime = (t: number): SceneKind => {
  if (t < 4.4) return 'night';
  if (t < 8.2) return 'ramen';
  if (t < 12.4) return 'disco';
  if (t < 14.9) return 'shiba';
  return 'disco';
};

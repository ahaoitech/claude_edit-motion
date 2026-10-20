import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {theme, clamp} from '../theme';

type Pose = 'walk' | 'idle' | 'point' | 'push' | 'confused' | 'thumbsup' | 'shades';

const POS: {t: number; x: number; y: number; s: number; pose: Pose}[] = [
  {t: 0, x: -130, y: 405, s: 1, pose: 'walk'},
  {t: 2.0, x: -130, y: 405, s: 1, pose: 'walk'},
  {t: 2.6, x: 150, y: 405, s: 1, pose: 'walk'},
  {t: 3.6, x: 260, y: 405, s: 1, pose: 'idle'},
  {t: 4.1, x: 170, y: 405, s: 1, pose: 'idle'},
  {t: 6.2, x: 185, y: 405, s: 1, pose: 'idle'},
  {t: 7.0, x: 200, y: 420, s: 1, pose: 'push'},
  {t: 8.3, x: 200, y: 420, s: 1, pose: 'idle'},
  {t: 9.0, x: 205, y: 430, s: 1, pose: 'point'},
  {t: 11.3, x: 205, y: 430, s: 1, pose: 'confused'},
  {t: 13.6, x: 210, y: 430, s: 1, pose: 'confused'},
  {t: 14.2, x: 210, y: 395, s: 1, pose: 'point'},
  {t: 15.2, x: 215, y: 372, s: 1, pose: 'point'},
  {t: 16.6, x: 235, y: 372, s: 1, pose: 'point'},
  {t: 18.0, x: 510, y: 300, s: 1, pose: 'thumbsup'},
  {t: 19.6, x: 520, y: 300, s: 1, pose: 'walk'},
  {t: 23.4, x: 840, y: 370, s: 1, pose: 'point'},
  {t: 24.6, x: 850, y: 370, s: 1, pose: 'idle'},
  {t: 26.0, x: 1000, y: 455, s: 1, pose: 'shades'},
  {t: 30.0, x: 1000, y: 455, s: 1, pose: 'shades'},
];

export const mascotAt = (t: number) => {
  let i = 0;
  while (i < POS.length - 1 && t >= POS[i + 1].t) i++;
  const a = POS[i];
  const b = POS[Math.min(POS.length - 1, i + 1)];
  if (b.t === a.t) return a;
  const p = clamp((t - a.t) / (b.t - a.t));
  const e = p * p * (3 - 2 * p);
  return {
    x: interpolate(e, [0, 1], [a.x, b.x]),
    y: interpolate(e, [0, 1], [a.y, b.y]),
    s: interpolate(e, [0, 1], [a.s, b.s]),
    pose: (t < a.t ? a.pose : b.pose) as Pose,
  };
};

const ARMS: {from: number; to: number; tx: number; ty: number}[] = [
  {from: 8.6, to: 12.9, tx: 140, ty: 120},
  {from: 14.15, to: 16.7, tx: 905, ty: 160},
  {from: 20.2, to: 23.9, tx: 1114, ty: 44},
];

const CORAL = theme.coral;
const INK = theme.ink;

export const MascotLayer: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const {fps} = useVideoConfig();
  const m = mascotAt(t);
  const walking = m.pose === 'walk';
  const bob = walking ? Math.abs(Math.sin(frame * 0.35)) * 4 : Math.sin(frame * 0.08) * 1.4;
  const legSwing = walking ? Math.sin(frame * 0.35) * 8 : Math.sin(frame * 0.08) * 1.2;
  const blink = Math.pow(Math.max(0, Math.sin(frame * 0.07 + 1.7)), 18);
  const eyeH = 9 * (1 - blink * 0.9);

  const arm = ARMS.find((a) => t >= a.from && t <= a.to);
  const armProgress = arm
    ? spring({frame: frame - Math.round(arm.from * fps), fps, config: {damping: 12, stiffness: 100, mass: 0.8}}) *
      interpolate(t, [arm.to - 0.3, arm.to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;
  const localTx = arm ? arm.tx - m.x : 0;
  const localTy = arm ? arm.ty - m.y : 0;
  const armMidX = localTx / 2 + 10;
  const armMidY = localTy / 2 - 30;
  // A long reach to the right is routed below the phone, then up to the control.
  const armPath =
    localTx > 450
      ? `M 70 28 C ${localTx * 0.45} 120, ${localTx * 0.92} ${localTy * 0.35} ${localTx} ${localTy}`
      : `M 70 28 Q ${armMidX} ${armMidY} ${localTx} ${localTy}`;

  // dust while moving fast
  const moving = walking && t > 1.9 && t < 4.5;
  const dustT = (t * 3) % 1;
  const moving2 = walking && t > 19.5 && t < 23.5;
  const dustT2 = (t * 3.2) % 1;

  return (
    <svg
      width={1280}
      height={720}
      style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}
    >
      {moving && (
        <g opacity={1 - dustT} transform={`translate(${m.x - 18 + dustT * 26} ${m.y + 88})`}>
          <ellipse rx={8 + dustT * 5} ry={6 + dustT * 4} fill={theme.white} stroke={INK} strokeWidth="2.2" />
          <ellipse cx="12" cy="2" rx={5 + dustT * 3} ry={4 + dustT * 2} fill={theme.white} stroke={INK} strokeWidth="1.8" />
        </g>
      )}
      {moving && (
        <g opacity={0.9 - dustT * 0.9} transform={`translate(${m.x - 34 + dustT * 20} ${m.y + 84})`}>
          <ellipse rx={6 + dustT * 4} ry={4.5 + dustT * 3} fill={theme.white} stroke={INK} strokeWidth="2" />
        </g>
      )}
      {moving2 && (
        <g opacity={1 - dustT2} transform={`translate(${m.x - 4 - dustT2 * 30} ${m.y + 88})`}>
          <ellipse rx={9 + dustT2 * 5} ry={6 + dustT2 * 4} fill={theme.white} stroke={INK} strokeWidth="2.2" />
          <ellipse cx="-12" cy="2" rx={5 + dustT2 * 3} ry={4 + dustT2 * 2} fill={theme.white} stroke={INK} strokeWidth="1.8" />
        </g>
      )}
      {moving2 && (
        <g opacity={0.8 - dustT2 * 0.8} transform={`translate(${m.x - 22 - dustT2 * 24} ${m.y + 82})`}>
          <ellipse rx={6 + dustT2 * 4} ry={4.5 + dustT2 * 3} fill={theme.white} stroke={INK} strokeWidth="2" />
        </g>
      )}

      <g transform={`translate(${m.x} ${m.y + bob}) scale(${m.s})`}>
        {/* motion lines */}
        {walking && (
          <g stroke={INK} strokeWidth="2.4" strokeLinecap="round" opacity="0.35">
            <path d={`M -10 ${24 + Math.sin(frame * 0.3) * 4} h -11`} />
            <path d={`M -8 ${42 + Math.cos(frame * 0.3) * 4} h -15`} />
          </g>
        )}

        {/* legs */}
        <g stroke={INK} strokeWidth="5" strokeLinecap="round">
          <path d={`M 19 56 L ${19 + legSwing} 82`} />
          <path d={`M 53 56 L ${53 - legSwing} 82`} />
        </g>
        {/* feet */}
        <g>
          <path d={`M ${8 + legSwing} 84 C ${2 + legSwing} 84, ${1 + legSwing} 93, ${9 + legSwing} 94 C ${13 + legSwing} 100, ${24 + legSwing} 98, ${26 + legSwing} 93 C ${31 + legSwing} 89, ${27 + legSwing} 82, ${20 + legSwing} 83 Z`} fill={theme.white} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <path d={`M ${44 - legSwing} 84 C ${38 - legSwing} 84, ${37 - legSwing} 93, ${45 - legSwing} 94 C ${49 - legSwing} 100, ${60 - legSwing} 98, ${62 - legSwing} 93 C ${67 - legSwing} 89, ${63 - legSwing} 82, ${56 - legSwing} 83 Z`} fill={theme.white} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        </g>

        {/* short arms for most poses */}
        {m.pose !== 'point' && (
          <>
            {m.pose === 'shades' || m.pose === 'thumbsup' ? (
              <path d="M 72 24 C 86 14, 92 4, 96 -6" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none" />
            ) : m.pose === 'confused' ? (
              <path d="M 72 26 C 84 22, 86 10, 80 4" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M 72 26 L 86 36" stroke={INK} strokeWidth="7" strokeLinecap="round" />
            )}
            <path d="M 0 26 L -13 36" stroke={INK} strokeWidth="7" strokeLinecap="round" />
            <circle cx="-14" cy="38" r="6.5" fill={CORAL} stroke={INK} strokeWidth="2.4" />
            <circle cx={m.pose === 'shades' || m.pose === 'thumbsup' ? 97 : m.pose === 'confused' ? 80 : 87} cy={m.pose === 'shades' || m.pose === 'thumbsup' ? -9 : m.pose === 'confused' ? 2 : 38} r="6.5" fill={CORAL} stroke={INK} strokeWidth="2.4" />
          </>
        )}

        {/* body */}
        <rect x="0" y="0" width="72" height="58" rx="14" fill={CORAL} stroke={INK} strokeWidth="3.2" />
        <path d="M 8 8 C 20 2, 34 2, 44 4" stroke="rgba(255,255,255,0.35)" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* face */}
        {m.pose === 'shades' ? (
          <g>
            <rect x="12" y="18" width="48" height="13" rx="6" fill={INK} />
            <rect x="17" y="21" width="14" height="7" rx="3" fill="#5A4B42" />
            <rect x="39" y="21" width="14" height="7" rx="3" fill="#5A4B42" />
            <path d="M 31 24 H 39" stroke={INK} strokeWidth="2.5" />
            <path d="M 28 42 Q 36 49 44 42" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <rect x="19" y={26 - eyeH / 2} width="6" height={eyeH} rx="3" fill={INK} />
            <rect x="47" y={26 - eyeH / 2} width="6" height={eyeH} rx="3" fill={INK} />
            {m.pose === 'confused' ? (
              <path d="M 30 44 Q 36 40 42 44" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : m.pose === 'push' ? (
              <ellipse cx="36" cy="43" rx="4.5" ry="5" fill={INK} />
            ) : (
              <path d="M 30 41 Q 36 47 42 41" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
            <ellipse cx="13" cy="36" rx="4.2" ry="2.8" fill={theme.pink} opacity="0.9" />
            <ellipse cx="59" cy="36" rx="4.2" ry="2.8" fill={theme.pink} opacity="0.9" />
          </g>
        )}

        {/* long pointing arm */}
        {arm && armProgress > 0.01 && (
          <g>
            <path
              d={armPath}
              stroke={INK}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - clamp(armProgress)}
            />
            <path
              d={armPath}
              stroke={CORAL}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - clamp(armProgress)}
            />
            <circle cx={localTx} cy={localTy} r="8" fill={CORAL} stroke={INK} strokeWidth="2.6" opacity={clamp(armProgress * 1.4)} />
            <rect x="64" y="20" width="13" height="16" rx="5" fill={CORAL} stroke={INK} strokeWidth="2.4" />
          </g>
        )}

        {/* heart at the finale */}
        {m.pose === 'shades' && (
          <g transform="translate(102 -16) rotate(-12)">
            <path d="M 0 8 C -9 2, -8 -6, -3 -7 C 0 -8, 0 -5, 0 -4 C 0 -5, 0 -8, 3 -7 C 8 -6, 9 2, 0 8 Z" fill={theme.pink} stroke={INK} strokeWidth="1.6" />
          </g>
        )}

        {/* tiny hair for shades */}
        {m.pose === 'shades' && (
          <g stroke={INK} strokeWidth="2.6" strokeLinecap="round">
            <path d="M 24 0 L 20 -7 M 34 0 L 33 -8 M 44 0 L 48 -7" />
          </g>
        )}
      </g>
    </svg>
  );
};

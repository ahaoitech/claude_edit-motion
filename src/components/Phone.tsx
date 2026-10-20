import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {theme, clamp} from '../theme';
import {DiscoScene, NightScene, RamenScene, ShibaScene} from './scenes';

const CUTS: {t: number; scene: 'night' | 'ramen' | 'shiba' | 'disco'}[] = [
  {t: 0, scene: 'night'},
  {t: 4.4, scene: 'ramen'},
  {t: 8.2, scene: 'disco'},
  {t: 12.4, scene: 'shiba'},
  {t: 14.9, scene: 'disco'},
];

export const Phone: React.FC<{
  frame: number;
  t: number;
  width?: number;
  height?: number;
  final?: boolean;
}> = ({frame, t, width = 190, height = 300, final = false}) => {
  const {fps} = useVideoConfig();
  const s = width / 190;
  const innerH = height / s;

  const currentIndex = Math.max(0, CUTS.findIndex((c, i) => t >= c.t && (i === CUTS.length - 1 || t < CUTS[i + 1].t)));
  const current = CUTS[currentIndex];
  const prev = CUTS[Math.max(0, currentIndex - 1)];
  const cutAge = t - current.t;
  const cut = currentIndex === 0 ? 1 : clamp(cutAge / 0.22);
  const showPrev = currentIndex > 0 && cut < 1 && prev.scene !== current.scene;

  const focus = interpolate(t, [5.0, 5.45, 6.5, 6.9], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const textPop = spring({frame: frame - Math.round(12.5 * fps), fps, config: {damping: 12, stiffness: 180, mass: 0.7}}) *
    interpolate(t, [14.2, 14.6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flash = interpolate(t, [14.6, 16.2], [0, 0.7], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sat = interpolate(t, [14.6, 16.2], [1, 1.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const impact = interpolate(t, [14.6, 16.2], [0, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const punch = 1 + impact * 0.05 + Math.sin(frame * 0.22) * 0.004 * impact;
  const social = final || t >= 25.2;

  const sceneFor = (kind: string) => {
    switch (kind) {
      case 'night':
        return <NightScene frame={frame} t={t} />;
      case 'ramen':
        return <RamenScene frame={frame} t={t} focus={focus} zoom={1 + focus * 0.06} />;
      case 'shiba':
        return <ShibaScene frame={frame} t={t} textPop={Math.max(0, textPop)} />;
      default:
        return <DiscoScene frame={frame} t={t} impact={impact} flash={flash} social={social} />;
    }
  };

  const ScreenLayer: React.FC<{kind: string; opacity: number; scale: number}> = ({kind, opacity, scale}) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 50%',
        overflow: 'hidden',
      }}
    >
      {sceneFor(kind)}
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 190,
        height: 300,
        transform: `scale(${s})`,
        transformOrigin: '0 0',
      }}
    >
      {/* side buttons */}
      <div style={{position: 'absolute', left: -4, top: 62, width: 5, height: 22, borderRadius: 3, background: theme.ink}} />
      <div style={{position: 'absolute', left: -4, top: 92, width: 5, height: 34, borderRadius: 3, background: theme.ink}} />
      <div style={{position: 'absolute', right: -4, top: 96, width: 5, height: 46, borderRadius: 3, background: theme.ink}} />
      {/* body */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 30,
          background: '#211C1A',
          border: `3px solid ${theme.ink}`,
          boxShadow: '6px 8px 0 rgba(46,41,36,0.16)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 7,
            borderRadius: 23,
            overflow: 'hidden',
            background: '#0D0B0A',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              filter: `brightness(${1 + flash * 0.45}) saturate(${sat})`,
              transform: `scale(${punch})`,
            }}
          >
            {t < 2.45 ? (
              <div style={{position: 'absolute', inset: 0, background: '#0D0B0A'}} />
            ) : (
              <>
                {showPrev && <ScreenLayer kind={prev.scene} opacity={1 - cut} scale={1 + cut * 0.04} />}
                <ScreenLayer kind={current.scene} opacity={showPrev ? cut : 1} scale={1.04 - cut * 0.04} />
              </>
            )}
          </div>
          {/* glare */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              left: -40,
              width: 150,
              height: 420,
              transform: 'rotate(18deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.10), rgba(255,255,255,0))',
              pointerEvents: 'none',
            }}
          />
          {/* dynamic island */}
          <div
            style={{
              position: 'absolute',
              top: 7,
              left: '50%',
              marginLeft: -32,
              width: 64,
              height: 15,
              borderRadius: 9,
              background: '#171312',
              border: '1px solid #000',
            }}
          >
            <div style={{position: 'absolute', right: 10, top: 5, width: 4.5, height: 4.5, borderRadius: 3, background: '#2B3A55'}} />
          </div>
          {/* home indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: '50%',
              marginLeft: -26,
              width: 52,
              height: 3.5,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.7)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

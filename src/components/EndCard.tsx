import React from 'react';
import {interpolate, useVideoConfig} from 'remotion';
import {FONT, theme, clamp, rand} from '../theme';
import {Phone} from './Phone';
import {MascotLayer} from './Mascot';

const CONFETTI = Array.from({length: 44}, (_, i) => ({
  x: rand(i * 3 + 11) * 1280,
  delay: 24.3 + rand(i * 7 + 5) * 2.6,
  dur: 1.9 + rand(i * 11 + 3) * 1.5,
  size: 5 + rand(i * 13 + 7) * 7,
  color: [theme.yellow, theme.coral, theme.teal, theme.lavender, theme.pink, theme.white][i % 6],
  rot: rand(i * 17 + 9) * 720,
  drift: (rand(i * 19 + 2) - 0.5) * 90,
  rect: i % 3 !== 0,
}));

export const EndCard: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const {fps} = useVideoConfig();
  const wash = interpolate(t, [24.3, 25.7], [0, 0.76], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cardIn = interpolate(t, [24.7, 26.1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const phoneIn = interpolate(t, [24.55, 25.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeAll = interpolate(t, [24.4, 25.1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (t < 24.35) return null;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: theme.paper, opacity: wash}} />
      <div
        style={{
          position: 'absolute',
          left: 330,
          top: -60,
          width: 620,
          height: 720,
          background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.62), rgba(255,255,255,0) 62%)',
          opacity: fadeAll,
        }}
      />

      {/* final phone */}
      <div
        style={{
          position: 'absolute',
          left: 462,
          top: 128,
          opacity: phoneIn,
          transform: `translateY(${(1 - phoneIn) * 24}px) scale(${0.94 + phoneIn * 0.06})`,
          transformOrigin: '50% 60%',
        }}
      >
        <Phone frame={frame} t={t} width={300} height={475} final />
      </div>

      {/* polaroid note */}
      <div
        style={{
          position: 'absolute',
          left: 35 - (1 - cardIn) * 430,
          top: 186,
          width: 378,
          height: 330,
          background: '#FCFAF3',
          border: `2.6px solid ${theme.ink}`,
          borderRadius: 6,
          boxShadow: '7px 9px 0 rgba(46,41,36,0.16)',
          transform: `rotate(-4deg)`,
          opacity: cardIn,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: -14,
            width: 112,
            height: 27,
            background: 'rgba(247,213,102,0.78)',
            transform: 'rotate(-2deg)',
            border: '1px solid rgba(201,154,46,0.35)',
          }}
        />
        {Array.from({length: 6}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 24, right: 24, top: 44 + i * 46, height: 1, background: 'rgba(91,127,199,0.16)'}} />
        ))}
        <div style={{position: 'absolute', left: 32, top: 42, fontFamily: FONT, fontSize: 27, color: theme.ink}}>30 秒剪完，</div>
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 92,
            fontFamily: FONT,
            fontSize: 58,
            letterSpacing: 1,
            color: '#26355F',
            transform: 'rotate(-1.5deg)',
          }}
        >
          Opus 5.5
        </div>
        <svg width="270" height="22" style={{position: 'absolute', left: 48, top: 168}}>
          <path d="M 2 12 C 60 4, 190 4, 264 10" stroke="#D9534F" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.85" />
          <path d="M 18 17 C 80 11, 180 10, 238 15" stroke="#D9534F" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
        </svg>
        <div style={{position: 'absolute', left: 96, top: 210, fontFamily: FONT, fontSize: 26, color: theme.ink}}>
          — 小克收工
          <span style={{color: theme.yellowDark, fontSize: 22}}> ✨</span>
        </div>
        <div style={{position: 'absolute', left: 32, top: 280, fontFamily: FONT, fontSize: 12, color: theme.inkFaint}}>
          a 30s motion study · built with Remotion
        </div>
      </div>

      {/* final mascot above the wash */}
      <div style={{position: 'absolute', inset: 0, opacity: fadeAll}}>
        <MascotLayer t={t} frame={frame} />
      </div>

      {/* confetti */}
      {CONFETTI.map((c, i) => {
        const p = clamp((t - c.delay) / c.dur);
        if (p <= 0 || p >= 1) return null;
        const y = -30 + p * 800;
        const x = c.x + Math.sin(t * 2.2 + i) * 22 + c.drift * p;
        const rotate = c.rot + p * 260;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: c.size,
              height: c.rect ? c.size * 0.62 : c.size,
              background: c.color,
              border: `1px solid rgba(46,41,36,0.35)`,
              borderRadius: c.rect ? 1.5 : c.size,
              transform: `rotate(${rotate}deg)`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </div>
  );
};

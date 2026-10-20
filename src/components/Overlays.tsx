import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {FONT, theme, clamp} from '../theme';
import {Bubble, Sparkle} from '../ui';

const fade = (t: number, start: number, end: number) =>
  interpolate(t, [start, start + 0.15, end - 0.25, end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const TrashCan: React.FC<{frame: number; open: number}> = ({frame, open}) => (
  <svg width="92" height="118" viewBox="0 0 92 118" style={{position: 'absolute', left: 512, top: 538}}>
    {/* lid */}
    <g transform={`rotate(${-open * 24} 20 34)`}>
      <ellipse cx="46" cy="30" rx="34" ry="9" fill="#E9E3D7" stroke={theme.ink} strokeWidth="2.8" />
      <path d="M 24 26 H 68 L 66 36 H 26 Z" fill="#CFC7B8" stroke={theme.ink} strokeWidth="2.6" />
      <path d="M 38 24 C 38 16, 54 16, 54 24" fill="none" stroke={theme.ink} strokeWidth="3" />
    </g>
    {/* body */}
    <path d="M 18 40 H 74 L 68 110 C 67 116, 62 118, 56 118 H 36 C 30 118, 25 116, 24 110 Z" fill="#D8D0C2" stroke={theme.ink} strokeWidth="2.8" />
    {[34, 46, 58].map((x) => (
      <path key={x} d={`M ${x} 50 L ${x - 1} 106`} stroke="#A89E90" strokeWidth="3" strokeLinecap="round" />
    ))}
    <path d="M 26 44 H 18 M 66 44 H 74" stroke={theme.ink} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const Overlays: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const {fps} = useVideoConfig();
  const bubble1 = spring({frame: frame - Math.round(5.35 * fps), fps, config: {damping: 11, stiffness: 170}}) *
    fade(t, 5.35, 7.0);
  const trash = spring({frame: frame - Math.round(6.75 * fps), fps, config: {damping: 12, stiffness: 130}}) *
    fade(t, 6.75, 8.35);
  const bye = spring({frame: frame - Math.round(7.0 * fps), fps, config: {damping: 12, stiffness: 170}}) *
    fade(t, 7.0, 8.2);
  const clang = spring({frame: frame - Math.round(7.05 * fps), fps, config: {damping: 9, stiffness: 200, mass: 0.6}}) *
    fade(t, 7.05, 8.25);
  const question = spring({frame: frame - Math.round(12.75 * fps), fps, config: {damping: 12, stiffness: 160}}) *
    fade(t, 12.75, 14.55);
  const key = spring({frame: frame - Math.round(12.55 * fps), fps, config: {damping: 13, stiffness: 120}}) *
    fade(t, 12.55, 14.55);
  const press = interpolate(t, [13.35, 13.55, 13.85], [0, 1, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const steady = spring({frame: frame - Math.round(17.75 * fps), fps, config: {damping: 11, stiffness: 150}}) *
    fade(t, 17.75, 20.2);
  const open = interpolate(t, [6.85, 7.1, 7.9], [0, 1, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {bubble1 > 0.01 && (
        <Bubble x={492} y={386} width={168} scale={clamp(bubble1)} fontSize={20}>
          这段在发呆 zzz
        </Bubble>
      )}

      {trash > 0.01 && (
        <div style={{opacity: clamp(trash), transform: `translateY(${(1 - trash) * 18}px)`}}>
          <TrashCan frame={frame} open={open} />
        </div>
      )}
      {bye > 0.01 && (
        <Bubble x={596} y={552} width={86} tail="left" scale={clamp(bye)} fontSize={19} rotate={2}>
          拜拜~
        </Bubble>
      )}
      {clang > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 606,
            top: 590,
            transform: `scale(${clamp(clang)}) rotate(-7deg)`,
            transformOrigin: '20% 50%',
            fontFamily: FONT,
            fontSize: 46,
            color: theme.yellow,
            WebkitTextStroke: `5px ${theme.ink}`,
            paintOrder: 'stroke fill',
            whiteSpace: 'nowrap',
          }}
        >
          哐当!
        </div>
      )}

      {question > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 196,
            top: 384,
            transform: `scale(${clamp(question)}) rotate(${Math.sin(frame * 0.15) * 8}deg)`,
            fontFamily: FONT,
            fontSize: 42,
            color: theme.yellow,
            WebkitTextStroke: `4px ${theme.ink}`,
            paintOrder: 'stroke fill',
          }}
        >
          ?
        </div>
      )}

      {key > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 195,
            top: 548,
            width: 192,
            height: 104,
            transform: `scale(${clamp(key)}) translateY(${press * 9}px)`,
            transformOrigin: '50% 100%',
            opacity: clamp(key),
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 10,
              width: 184,
              height: 92,
              borderRadius: 14,
              background: '#B7AD9D',
              border: `2.8px solid ${theme.ink}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 184,
              height: 92,
              borderRadius: 14,
              background: '#F4EEE2',
              border: `3px solid ${theme.ink}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT,
              fontSize: 34,
              color: theme.ink,
              boxShadow: 'inset 0 -6px 0 rgba(46,41,36,0.12)',
            }}
          >
            Ctrl+Z
          </div>
          {press > 0.4 && <Sparkle x={168} y={14} size={18} color={theme.yellow} opacity={press} />}
        </div>
      )}

      {steady > 0.01 && (
        <Bubble x={508} y={267} width={54} scale={clamp(steady)} fontSize={22}>
          稳了
        </Bubble>
      )}

      {/* sparkle celebration around the phone */}
      {[0, 1, 2, 3, 4].map((i) => {
        const p = interpolate(t, [9.2 + i * 0.3, 9.5 + i * 0.3, 10.8 + i * 0.2, 11.2 + i * 0.2], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <Sparkle
            key={i}
            x={540 + (i % 3) * 70 + (i === 3 ? 40 : 0)}
            y={110 + Math.floor(i / 3) * 150 + (i % 2) * 40}
            size={14 + (i % 3) * 5}
            color={i % 2 ? theme.pink : theme.yellow}
            opacity={p}
            rotate={p * 60}
          />
        );
      })}
    </div>
  );
};

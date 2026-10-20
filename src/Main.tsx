import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, theme, W, H, rand} from './theme';
import {Editor} from './components/Editor';
import {TerminalIntro} from './components/Terminal';
import {EndCard} from './components/EndCard';

const useXiaokeFont = () => {
  const [handle] = useState(() => delayRender('Loading Xiaoke font'));
  useEffect(() => {
    let alive = true;
    const face = new FontFace('Xiaoke', `url(${staticFile('fonts/ZCOOLKuaiLe-Regular.ttf')})`);
    face
      .load()
      .then((loaded) => {
        if (!alive) return;
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
    return () => {
      alive = false;
    };
  }, [handle]);
};

const Paper: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: theme.paper}} />
    <AbsoluteFill
      style={{
        backgroundImage: 'radial-gradient(rgba(46,41,36,0.075) 1px, transparent 1.15px)',
        backgroundSize: '7px 7px',
        opacity: 0.55,
      }}
    />
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.35), rgba(214,204,185,0.22) 75%, rgba(196,184,163,0.35) 100%)',
      }}
    />
    {[
      {x: 82, y: 92, s: 16, r: 12},
      {x: 1206, y: 104, s: 12, r: -8},
      {x: 1136, y: 660, s: 14, r: 20},
      {x: 140, y: 636, s: 11, r: -14},
    ].map((d, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: d.x,
          top: d.y,
          width: d.s,
          height: d.s,
          transform: `rotate(${d.r}deg)`,
          opacity: 0.18,
        }}
      >
        <div style={{position: 'absolute', left: d.s / 2 - 1, top: 0, width: 2, height: d.s, background: theme.ink}} />
        <div style={{position: 'absolute', left: 0, top: d.s / 2 - 1, width: d.s, height: 2, background: theme.ink}} />
      </div>
    ))}
    {Array.from({length: 9}).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 180 + rand(i * 5 + 2) * 940,
          top: 80 + rand(i * 9 + 4) * 560,
          width: 3,
          height: 3,
          borderRadius: 2,
          background: theme.ink,
          opacity: 0.12,
        }}
      />
    ))}
  </AbsoluteFill>
);

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  useXiaokeFont();
  const flash = interpolate(t, [1.78, 1.88, 1.99], [0, 0.88, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: theme.paper, fontFamily: FONT, width: W, height: H}}>
      <Paper />
      <Editor t={t} frame={frame} />
      <TerminalIntro t={t} frame={frame} />
      <div style={{position: 'absolute', inset: 0, background: '#FFFDF6', opacity: flash, pointerEvents: 'none'}} />
      <EndCard t={t} frame={frame} />
      <Audio
        src={staticFile('audio/bgm.mp3')}
        volume={(f) => {
          const time = f / fps;
          const fadeIn = interpolate(time, [0, 0.6], [0, 0.34], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const fadeOut = interpolate(time, [29.3, 30], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return fadeIn * fadeOut;
        }}
      />
    </AbsoluteFill>
  );
};

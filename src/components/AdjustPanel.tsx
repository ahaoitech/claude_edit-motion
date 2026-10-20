import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {FONT, theme, clamp} from '../theme';
import {Panel} from '../ui';

const Slider: React.FC<{
  label: string;
  value: number;
  display: string;
  y: number;
  highlight?: number;
  frame: number;
  delay: number;
}> = ({label, value, display, y, highlight = 0, frame, delay}) => {
  const {fps} = useVideoConfig();
  const p = clamp(value);
  const appear = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 110}});
  const knobX = 18 + p * 302;
  return (
    <div style={{position: 'absolute', left: 18, top: y, width: 326, opacity: clamp(appear)}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontSize: 16, color: theme.ink}}>
        <span>{label}</span>
        <span style={{fontSize: 14, color: theme.inkSoft}}>{display}</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 30,
          width: 326,
          height: 5,
          borderRadius: 3,
          background: '#D8D1C4',
          border: `1.4px solid ${theme.ink}`,
        }}
      >
        <div style={{width: knobX, height: '100%', borderRadius: 3, background: theme.teal, borderRight: `1.4px solid ${theme.ink}`}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: knobX - 9,
          top: 21,
          width: 18,
          height: 18,
          borderRadius: 10,
          background: theme.card,
          border: `2.2px solid ${theme.ink}`,
          boxShadow: highlight > 0 ? `0 0 0 ${3 + highlight * 3}px rgba(247,213,102,${0.35 + highlight * 0.35})` : undefined,
        }}
      />
    </div>
  );
};

export const AdjustPanel: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const {fps} = useVideoConfig();
  const go = spring({
    frame: frame - Math.round(14.5 * fps),
    fps,
    config: {damping: 11, stiffness: 90, mass: 0.9},
  });
  const flash = interpolate(go, [0, 1], [0, 0.7]);
  const sat = interpolate(go, [0, 1], [1, 1.1]);
  const impact = interpolate(go, [0, 1], [0, 0.6]);
  const highlight = interpolate(t, [14.2, 14.6, 16.4, 16.9], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 896, top: 66, width: 360, height: 286}}>
      <Panel style={{left: 0, top: 0, width: 360, height: 286}} radius={14} fill={theme.card} tilt={0.15}>
        <div style={{position: 'absolute', left: 20, top: 10, fontFamily: FONT, fontSize: 26, color: theme.ink}}>
          调整
          <span style={{fontSize: 19, color: theme.yellowDark, marginLeft: 6}}>✦</span>
        </div>
        <div style={{position: 'absolute', left: 20, top: 48, width: 320, height: 2, background: theme.ink, opacity: 0.5}} />
        <Slider label="闪光" value={flash} display={`${Math.round(flash * 100)}%`} y={60} highlight={highlight} frame={frame} delay={Math.round(1.84 * fps)} />
        <Slider label="饱和度" value={sat - 1} display={`${Math.round(sat * 100)}%`} y={118} frame={frame} delay={Math.round(1.89 * fps)} />
        <Slider label="缩放冲击" value={impact} display={`${Math.round(impact * 100)}%`} y={176} frame={frame} delay={Math.round(1.94 * fps)} />
        <Slider label="速度" value={0} display="1.0x" y={234} frame={frame} delay={Math.round(1.99 * fps)} />
      </Panel>
    </div>
  );
};

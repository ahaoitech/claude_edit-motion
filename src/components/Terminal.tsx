import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {FONT, theme, clamp} from '../theme';

type Tok = {text: string; color: string};

const L1: Tok[] = [
  {text: 'const ', color: '#7B61C9'},
  {text: '剪辑软件', color: theme.coral},
  {text: ' = ', color: theme.ink},
  {text: '小克', color: theme.coral},
  {text: '.', color: theme.ink},
  {text: '写代码', color: '#4C8FBF'},
  {text: '()', color: theme.ink},
];
const L2: Tok[] = [
  {text: '剪辑软件', color: theme.coral},
  {text: '.', color: theme.ink},
  {text: '画出', color: '#4C8FBF'},
  {text: '(', color: theme.ink},
  {text: '时间轴', color: theme.yellowDark},
  {text: ', ', color: theme.ink},
  {text: '预览', color: theme.yellowDark},
  {text: ', ', color: theme.ink},
  {text: '面板', color: theme.yellowDark},
  {text: ')', color: theme.ink},
];
const L3: Tok[] = [
  {text: '小克', color: theme.coral},
  {text: '.', color: theme.ink},
  {text: '钻', color: '#4C8FBF'},
];

const renderTokens = (tokens: Tok[], visible: number) => {
  let left = visible;
  return tokens.map((tok, i) => {
    if (left <= 0) return null;
    const part = tok.text.slice(0, left);
    left -= tok.text.length;
    return (
      <span key={i} style={{color: tok.color}}>
        {part}
      </span>
    );
  });
};

const len = (tokens: Tok[]) => tokens.reduce((n, t) => n + t.text.length, 0);

export const TerminalIntro: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const {fps} = useVideoConfig();
  if (t > 2.3) return null;
  const appear = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 150}});
  const reveal1 = Math.floor(interpolate(t, [0.02, 0.16], [0, len(L1)], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const reveal2 = Math.floor(interpolate(t, [0.16, 0.32], [0, len(L2)], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const reveal3 = Math.floor(interpolate(t, [0.32, 0.45], [0, len(L3)], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const zoom = interpolate(t, [1.72, 2.02], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line1Active = t < 0.16;
  const line2Active = t >= 0.16 && t < 0.32;
  const line3Active = t >= 0.32;
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${1 + zoom * 5})`,
        opacity: 1 - interpolate(t, [1.74, 1.98], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 660,
          height: 205,
          background: '#FCF9F2',
          border: `3px solid ${theme.ink}`,
          borderRadius: 14,
          boxShadow: '7px 9px 0 rgba(46,41,36,0.16)',
          transform: `scale(${0.86 + clamp(appear) * 0.14}) rotate(-0.3deg)`,
          opacity: clamp(appear),
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 38, borderBottom: `2.4px solid ${theme.ink}`}}>
          {[theme.red, '#F2C94C', '#6FCF97'].map((c, i) => (
            <div key={i} style={{position: 'absolute', left: 16 + i * 18, top: 14, width: 10, height: 10, borderRadius: 6, background: c, border: `1.4px solid ${theme.ink}`}} />
          ))}
          <div style={{position: 'absolute', left: 0, right: 0, top: 10, textAlign: 'center', fontFamily: FONT, fontSize: 13, color: theme.inkSoft}}>
            小克.js — 终端
          </div>
        </div>
        <div style={{position: 'absolute', left: 22, top: 58, fontFamily: FONT, fontSize: 21.5, lineHeight: '36px', whiteSpace: 'pre'}}>
          <div style={{display: 'flex'}}>
            <span style={{width: 26, color: theme.inkFaint, fontSize: 18}}>1</span>
            <span>{renderTokens(L1, reveal1)}</span>
            {line1Active && cursorOn && <span style={{width: 11, height: 22, background: theme.coral, display: 'inline-block', marginLeft: 2, alignSelf: 'center'}} />}
          </div>
          <div style={{display: 'flex', opacity: reveal2 > 0 ? 1 : 0}}>
            <span style={{width: 26, color: theme.inkFaint, fontSize: 18}}>2</span>
            <span>{renderTokens(L2, reveal2)}</span>
            {line2Active && cursorOn && <span style={{width: 11, height: 22, background: theme.coral, display: 'inline-block', marginLeft: 2, alignSelf: 'center'}} />}
          </div>
          <div style={{display: 'flex', opacity: reveal3 > 0 ? 1 : 0}}>
            <span style={{width: 26, color: theme.inkFaint, fontSize: 18}}>3</span>
            <span>{renderTokens(L3, reveal3)}</span>
            {line3Active && (
              <span style={{width: 13, height: 25, background: theme.coral, display: 'inline-block', marginLeft: 2, alignSelf: 'center', opacity: cursorOn ? 1 : 0.15}} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

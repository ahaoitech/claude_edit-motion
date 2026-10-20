import React from 'react';
import {interpolate} from 'remotion';
import {FONT, theme} from '../theme';
import {Icon} from '../ui';

const pad = (n: number) => String(n).padStart(2, '0');

const timecode = (t: number) => {
  const s = Math.floor(t);
  const f = Math.floor((t - s) * 30);
  return `00:00:${pad(s)}:${pad(f)}`;
};

export const TopBar: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const done = t >= 25.2;
  const pulse = t > 21.5 && t < 24.9 ? 1 + Math.sin(frame * 0.4) * 0.035 : 1;
  const glow = t > 21.5 && t < 24.9 ? 0.35 + 0.35 * Math.abs(Math.sin(frame * 0.2)) : 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1264, height: 52}}>
      {[theme.red, '#F2C94C', '#6FCF97'].map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 24 + i * 19,
            top: 20,
            width: 10,
            height: 10,
            borderRadius: 6,
            background: c,
            border: `1.6px solid ${theme.ink}`,
          }}
        />
      ))}
      <div style={{position: 'absolute', left: 84, top: 12}}>
        <Icon name="clapper" size={27} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 118,
          top: 17,
          fontFamily: FONT,
          fontSize: 16.5,
          color: theme.ink,
          whiteSpace: 'nowrap',
        }}
      >
        小克剪辑_最终版_打死不改(3).mp4
      </div>
      <div
        style={{
          position: 'absolute',
          left: 574,
          top: 11,
          width: 190,
          height: 30,
          borderRadius: 8,
          background: theme.ink,
          color: '#F7F3E9',
          fontFamily: FONT,
          fontSize: 17,
          letterSpacing: 1.4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {timecode(t)}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 774,
          top: 18,
          fontFamily: FONT,
          fontSize: 12.5,
          color: theme.inkFaint,
        }}
      >
        · 已自动保存
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1002,
          top: 14,
          width: 62,
          height: 24,
          borderRadius: 7,
          border: `2px solid ${theme.ink}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          fontSize: 12,
          color: theme.ink,
          background: theme.card,
        }}
      >
        1080p
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1076,
          top: 9,
          width: 178,
          height: 35,
          borderRadius: 9,
          background: done ? '#B9DCD5' : theme.teal,
          border: `2.6px solid ${theme.ink}`,
          boxShadow: `0 0 0 ${4 + glow * 5}px rgba(121,208,196,${glow * 0.45})`,
          transform: `scale(${pulse})`,
          transformOrigin: '70% 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontFamily: FONT,
          fontSize: 17,
          color: theme.ink,
        }}
      >
        {done ? <Icon name="check" size={19} /> : <Icon name="upload" size={17} />}
        {done ? '完成' : '导出'}
      </div>
      <div style={{position: 'absolute', left: 0, top: 51, width: 1264, height: 2.4, background: theme.ink, opacity: 0.85}} />
    </div>
  );
};

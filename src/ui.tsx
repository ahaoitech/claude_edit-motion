import React from 'react';
import {FONT, theme} from './theme';

export const SketchBorder: React.FC<{
  color?: string;
  width?: number;
  radius?: number;
  opacity?: number;
}> = ({color = theme.ink, width = 3, radius = 14, opacity = 1}) => (
  <svg
    style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible'}}
  >
    <rect
      x={2}
      y={2}
      width="calc(100% - 4px)"
      height="calc(100% - 4px)"
      rx={radius}
      fill="none"
      stroke={color}
      strokeWidth={width}
      opacity={opacity}
    />
    <rect
      x={4.5}
      y={1.2}
      width="calc(100% - 7px)"
      height="calc(100% - 3px)"
      rx={radius + 1}
      fill="none"
      stroke={color}
      strokeWidth={0.9}
      opacity={0.32 * opacity}
    />
  </svg>
);

export const Panel: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  fill?: string;
  radius?: number;
  tilt?: number;
  shadow?: boolean;
  color?: string;
  borderWidth?: number;
  className?: string;
}> = ({children, style, fill = theme.card, radius = 14, tilt = 0, shadow = true, color = theme.ink, borderWidth = 3}) => (
  <div
    className={undefined}
    style={{
      position: 'absolute',
      background: fill,
      borderRadius: radius,
      transform: `rotate(${tilt}deg)`,
      boxShadow: shadow ? '4px 5px 0 rgba(46, 41, 36, 0.13)' : undefined,
      ...style,
    }}
  >
    <SketchBorder color={color} width={borderWidth} radius={radius} />
    {children}
  </div>
);

export const HandText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
  stroke?: string;
  strokeWidth?: number;
  rotate?: number;
}> = ({children, size = 18, color = theme.ink, weight = 400, style, stroke, strokeWidth = 0, rotate = 0}) => (
  <span
    style={{
      fontFamily: FONT,
      fontSize: size,
      color,
      fontWeight: weight,
      lineHeight: 1.12,
      display: 'inline-block',
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      WebkitTextStroke: stroke ? `${strokeWidth}px ${stroke}` : undefined,
      paintOrder: 'stroke fill',
      ...style,
    }}
  >
    {children}
  </span>
);

type IconName =
  | 'play'
  | 'pause'
  | 'rewind'
  | 'forward'
  | 'music'
  | 'text'
  | 'plus'
  | 'clapper'
  | 'upload'
  | 'check'
  | 'heart'
  | 'comment'
  | 'share'
  | 'rotate'
  | 'flip'
  | 'glitch'
  | 'zoom'
  | 'slide'
  | 'dissolve'
  | 'trash'
  | 'sparkle'
  | 'camera'
  | 'folder';

export const Icon: React.FC<{name: IconName; size?: number; color?: string; style?: React.CSSProperties}> = ({
  name,
  size = 24,
  color = theme.ink,
  style,
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style,
  };
  switch (name) {
    case 'play':
      return (
        <svg {...common}>
          <path d="M8 5.5 L18.5 12 L8 18.5 Z" fill={color} stroke={color} />
        </svg>
      );
    case 'pause':
      return (
        <svg {...common}>
          <rect x="7" y="5" width="3.4" height="14" rx="1.2" fill={color} />
          <rect x="13.6" y="5" width="3.4" height="14" rx="1.2" fill={color} />
        </svg>
      );
    case 'rewind':
      return (
        <svg {...common}>
          <path d="M19 6 L11 12 L19 18 Z" fill={color} />
          <path d="M11 6 L3 12 L11 18 Z" fill={color} />
        </svg>
      );
    case 'forward':
      return (
        <svg {...common}>
          <path d="M5 6 L13 12 L5 18 Z" fill={color} />
          <path d="M13 6 L21 12 L13 18 Z" fill={color} />
        </svg>
      );
    case 'music':
      return (
        <svg {...common}>
          <path d="M9 18 V6.5 L19 4.5 V16" />
          <circle cx="6.5" cy="18" r="2.6" fill={color} />
          <circle cx="16.5" cy="16" r="2.6" fill={color} />
        </svg>
      );
    case 'text':
      return (
        <svg {...common}>
          <path d="M4 6 H20 M12 6 V19 M8.5 19 H15.5" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5 V19 M5 12 H19" />
        </svg>
      );
    case 'clapper':
      return (
        <svg {...common}>
          <rect x="3.2" y="9" width="17.6" height="10.5" rx="2.2" fill={color} opacity="0.18" />
          <path d="M3 9 L20 6.2 L20.6 9.6 L3.6 12.4 Z" fill={color} />
          <path d="M6.2 8.2 L8 10.4 M10 7.6 L11.8 9.8 M13.8 7 L15.6 9.2 M17.4 6.5 L19.1 8.6" stroke={theme.card} strokeWidth="1.4" />
        </svg>
      );
    case 'upload':
      return (
        <svg {...common}>
          <path d="M12 16 V4.5 M7.8 8.6 L12 4.4 L16.2 8.6" />
          <path d="M5 15.5 V19 H19 V15.5" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M4.8 12.6 L9.8 17.8 L19.6 6.4" strokeWidth="3" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 20 C4.5 14.8 3.4 10.6 4.8 7.6 C6.5 4 11 4.2 12 7.4 C13 4.2 17.5 4 19.2 7.6 C20.6 10.6 19.5 14.8 12 20 Z" fill={color} />
        </svg>
      );
    case 'comment':
      return (
        <svg {...common}>
          <path d="M4 5.5 H20 V16.5 H12.5 L8 20 V16.5 H4 Z" fill={theme.card} />
        </svg>
      );
    case 'share':
      return (
        <svg {...common}>
          <path d="M4 17 C4 11 8 7.5 14 7.2 M14 4 L20 8 L14 12" />
        </svg>
      );
    case 'rotate':
      return (
        <svg {...common}>
          <path d="M19 12 A7 7 0 1 1 15.6 5.9" />
          <path d="M16.2 2.6 L16 6.6 L20 7.2" />
        </svg>
      );
    case 'flip':
      return (
        <svg {...common}>
          <path d="M12 3.5 V20.5" strokeDasharray="2 3" />
          <path d="M9.5 6 H4.5 V18 H9.5 Z" />
          <path d="M14.5 6 H19.5 V18 H14.5 Z" />
        </svg>
      );
    case 'glitch':
      return (
        <svg {...common}>
          <path d="M4 6 H10 L12 9 H20 M4 12 H8 L10 15 H20 M4 18 H13 L15 15 H20" />
        </svg>
      );
    case 'zoom':
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15.2 15.2 L20 20 M7 10.5 H14 M10.5 7 V14" />
        </svg>
      );
    case 'slide':
      return (
        <svg {...common}>
          <path d="M3.5 7 H16 L13 4 M16 7 L13 10" />
          <path d="M20.5 17 H8 L11 14 M8 17 L11 20" />
        </svg>
      );
    case 'dissolve':
      return (
        <svg {...common}>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <circle key={`${r}-${c}`} cx={7 + c * 5} cy={7 + r * 5} r={1.4} fill={color} stroke="none" opacity={0.4 + (r + c) * 0.1} />
            )),
          )}
        </svg>
      );
    case 'trash':
      return (
        <svg {...common}>
          <path d="M5 7.5 H19 L17.6 20 H6.4 Z" fill={theme.card} />
          <path d="M3.5 7.5 H20.5 M9 4.5 H15 L15.6 7.5 H8.4 Z" fill={theme.card} />
          <path d="M9.5 10.5 V17.5 M12 10.5 V17.5 M14.5 10.5 V17.5" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 2.5 C13.2 8.2 15.8 10.8 21.5 12 C15.8 13.2 13.2 15.8 12 21.5 C10.8 15.8 8.2 13.2 2.5 12 C8.2 10.8 10.8 8.2 12 2.5 Z" fill={color} stroke="none" />
        </svg>
      );
    case 'camera':
      return (
        <svg {...common}>
          <rect x="3.5" y="7" width="13" height="10" rx="2" fill={theme.card} />
          <path d="M16.5 10.5 L21 8 V16 L16.5 13.5 Z" fill={color} />
          <circle cx="8.5" cy="8" r="1.2" fill={color} />
        </svg>
      );
    case 'folder':
      return (
        <svg {...common}>
          <path d="M3.5 6 H10 L12 8 H20.5 V19 H3.5 Z" fill={theme.card} />
        </svg>
      );
    default:
      return null;
  }
};

export const Sparkle: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  rotate?: number;
  opacity?: number;
}> = ({x, y, size = 20, color = theme.yellow, rotate = 0, opacity = 1}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{position: 'absolute', left: x - size / 2, top: y - size / 2, transform: `rotate(${rotate}deg)`, opacity, pointerEvents: 'none', overflow: 'visible'}}
  >
    <path
      d="M12 1.5 C13.2 8 15.9 10.8 22.5 12 C15.9 13.2 13.2 16 12 22.5 C10.8 16 8.1 13.2 1.5 12 C8.1 10.8 10.8 8 12 1.5 Z"
      fill={color}
      stroke={theme.ink}
      strokeWidth="1.2"
    />
  </svg>
);

export const Bubble: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  width?: number;
  tail?: 'down' | 'left' | 'none';
  scale?: number;
  rotate?: number;
  fill?: string;
  fontSize?: number;
}> = ({children, x, y, width, tail = 'down', scale = 1, rotate = 0, fill = theme.card, fontSize = 22}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `scale(${scale}) rotate(${rotate}deg)`,
      transformOrigin: tail === 'down' ? '50% 100%' : '0% 50%',
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        position: 'relative',
        background: fill,
        border: `3px solid ${theme.ink}`,
        borderRadius: 14,
        padding: '8px 14px',
        minWidth: width,
        boxShadow: '3px 4px 0 rgba(46,41,36,0.12)',
        fontFamily: FONT,
        fontSize,
        color: theme.ink,
        whiteSpace: 'nowrap',
        textAlign: 'center',
      }}
    >
      {children}
      {tail !== 'none' && (
        <div
          style={{
            position: 'absolute',
            width: 14,
            height: 14,
            background: fill,
            borderRight: `3px solid ${theme.ink}`,
            borderBottom: `3px solid ${theme.ink}`,
            transform: 'rotate(45deg)',
            ...(tail === 'down' ? {left: '50%', bottom: -9, marginLeft: -7} : {left: -9, top: '50%', marginTop: -7, transform: 'rotate(135deg)'}),
          }}
        />
      )}
    </div>
  </div>
);

export const DustPuff: React.FC<{x: number; y: number; r: number; opacity: number}> = ({x, y, r, opacity}) => (
  <svg width={r * 2.6} height={r * 2.2} style={{position: 'absolute', left: x - r * 1.3, top: y - r * 1.1, opacity, pointerEvents: 'none'}}>
    <ellipse cx={r * 1.1} cy={r * 1.1} rx={r} ry={r * 0.72} fill={theme.white} stroke={theme.ink} strokeWidth="2.4" />
    <ellipse cx={r * 1.9} cy={r * 1.25} rx={r * 0.55} ry={r * 0.42} fill={theme.white} stroke={theme.ink} strokeWidth="2" />
  </svg>
);

export const Waveform: React.FC<{width: number; height: number; count?: number; seed?: number; color?: string}> = ({
  width,
  height,
  count = 120,
  seed = 7,
  color = theme.lavenderDeep,
}) => {
  const bars = [];
  const step = width / count;
  for (let i = 0; i < count; i++) {
    const n = Math.sin(i * 12.9898 + seed) * 43758.5453;
    const f = n - Math.floor(n);
    const h = 4 + f * (height - 8) * (0.55 + 0.45 * Math.abs(Math.sin(i * 0.31 + seed)));
    bars.push(<rect key={i} x={i * step + step * 0.18} y={(height - h) / 2} width={Math.max(1.2, step * 0.5)} height={h} rx={0.8} fill={color} />);
  }
  return <svg width={width} height={height} style={{display: 'block'}}>{bars}</svg>;
};

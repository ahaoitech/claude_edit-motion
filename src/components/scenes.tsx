import React, {useId} from 'react';
import {theme, rand} from '../theme';
import {FONT} from '../theme';

const STARS = Array.from({length: 34}, (_, i) => ({
  x: (rand(i * 3 + 1) * 190),
  y: rand(i * 7 + 2) * 170,
  r: 0.6 + rand(i * 11 + 3) * 1.5,
  p: rand(i * 13 + 4) * Math.PI * 2,
}));

const BUILDINGS = [
  {x: -8, w: 30, h: 108, c: '#211E45'},
  {x: 20, w: 24, h: 78, c: '#2A2554'},
  {x: 42, w: 30, h: 122, c: '#1B193A'},
  {x: 70, w: 26, h: 92, c: '#252148'},
  {x: 94, w: 30, h: 132, c: '#201D42'},
  {x: 122, w: 24, h: 84, c: '#2A2554'},
  {x: 144, w: 30, h: 112, c: '#1D1A3D'},
  {x: 172, w: 26, h: 94, c: '#241F49'},
];

export const NightScene: React.FC<{frame: number; t: number}> = ({frame, t}) => {
  const uid = useId().replace(/:/g, '');
  const pan = Math.sin(t * 0.6) * 3;
  return (
    <svg viewBox="0 0 190 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3A86" />
          <stop offset="45%" stopColor="#2E2A5E" />
          <stop offset="100%" stopColor="#16142E" />
        </linearGradient>
      </defs>
      <rect width="190" height="300" fill={`url(#sky-${uid})`} />
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#FFF4C7"
          opacity={0.35 + 0.65 * Math.abs(Math.sin(frame * 0.06 + s.p))}
        />
      ))}
      <g transform={`translate(${pan},0)`}>
        <circle cx="132" cy="66" r="23" fill="#F7D566" />
        <circle cx="124" cy="59" r="4.2" fill="#E8BF4B" opacity="0.7" />
        <circle cx="138" cy="72" r="5.6" fill="#E8BF4B" opacity="0.55" />
        <circle cx="128" cy="75" r="2.6" fill="#E8BF4B" opacity="0.6" />
        <circle cx="132" cy="66" r="30" fill="#F7D566" opacity="0.1" />
        {BUILDINGS.map((b, bi) => {
          const top = 300 - b.h;
          const rows = Math.floor(b.h / 16);
          const cols = Math.max(2, Math.floor(b.w / 9));
          return (
            <g key={bi}>
              <rect x={b.x} y={top} width={b.w} height={b.h} fill={b.c} />
              {Array.from({length: rows}).map((_, r) =>
                Array.from({length: cols}).map((_, c) => {
                  const seed = bi * 97 + r * 13 + c * 7;
                  const lit = rand(seed) > 0.38;
                  if (!lit) return null;
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={b.x + 4 + c * (b.w - 8) / cols}
                      y={top + 7 + r * 15}
                      width="3.6"
                      height="5"
                      rx="0.7"
                      fill={rand(seed + 5) > 0.82 ? '#F7D566' : '#E8C15B'}
                      opacity={0.65 + 0.35 * Math.abs(Math.sin(frame * 0.03 + seed))}
                    />
                  );
                }),
              )}
            </g>
          );
        })}
      </g>
      <rect y="240" width="190" height="60" fill="#121026" opacity="0.55" />
    </svg>
  );
};

const steamPath = (x: number, y: number, phase: number) => {
  const a = Math.sin(phase) * 6;
  return `M ${x} ${y} C ${x - 8 + a} ${y - 18}, ${x + 10 - a} ${y - 30}, ${x + 2} ${y - 46}`;
};

export const RamenScene: React.FC<{frame: number; t: number; focus?: number; zoom?: number}> = ({
  frame,
  t,
  focus = 0,
  zoom = 1,
}) => {
  const uid = useId().replace(/:/g, '');
  const steam = frame * 0.09;
  return (
    <svg viewBox="0 0 190 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`warm-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6E2BC" />
          <stop offset="100%" stopColor="#E8C48D" />
        </linearGradient>
        <linearGradient id={`table-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D7A96E" />
          <stop offset="100%" stopColor="#C08E56" />
        </linearGradient>
      </defs>
      <g style={{filter: `blur(${focus * 3.2}px)`}}>
        <rect width="190" height="300" fill={`url(#warm-${uid})`} />
        <rect y="212" width="190" height="88" fill={`url(#table-${uid})`} />
        <g transform={`translate(95 218) scale(${zoom}) translate(-95 -218)`}>
          {/* chopsticks */}
          <g transform="rotate(-26 150 20)">
            <rect x="128" y="-6" width="6" height="214" rx="3" fill="#A9713C" stroke={theme.ink} strokeWidth="2" />
            <rect x="140" y="-14" width="6" height="220" rx="3" fill="#B98048" stroke={theme.ink} strokeWidth="2" />
          </g>
          {/* noodle lift */}
          <path d="M 128 70 C 120 110, 105 140, 100 178" stroke="#F3D98E" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 134 74 C 128 112, 112 142, 106 180" stroke="#EBCB77" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 122 78 C 116 112, 100 146, 96 176" stroke="#F7E3A6" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* steam */}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={steamPath(72 + i * 22, 150, steam + i * 1.7)}
              stroke="#FFFDF5"
              strokeWidth="5"
              fill="none"
              opacity={0.5 * (1 - focus * 0.5)}
              strokeLinecap="round"
            />
          ))}
          {/* bowl */}
          <ellipse cx="95" cy="222" rx="63" ry="17" fill="#EFE7D6" stroke={theme.ink} strokeWidth="2.6" />
          <path d="M 35 220 C 38 262, 66 276, 95 276 C 124 276, 152 262, 155 220 Z" fill="#FBF6EA" stroke={theme.ink} strokeWidth="2.8" />
          <path d="M 45 238 C 65 252, 125 252, 145 238" stroke="#D9534F" strokeWidth="5" fill="none" opacity="0.8" />
          <path d="M 52 250 C 70 260, 120 260, 138 250" stroke="#D9534F" strokeWidth="2.4" fill="none" opacity="0.55" strokeDasharray="5 4" />
          {/* broth */}
          <ellipse cx="95" cy="221" rx="55" ry="13" fill="#D89B55" />
          <ellipse cx="95" cy="220" rx="50" ry="10" fill="#E8B268" />
          {/* noodles in bowl */}
          <path d="M 55 218 C 70 210, 80 224, 95 216 C 110 208, 125 224, 140 216" stroke="#F3D98E" strokeWidth="5" fill="none" />
          <path d="M 58 223 C 74 216, 84 228, 98 220 C 112 212, 128 226, 138 219" stroke="#EBCB77" strokeWidth="4" fill="none" />
          {/* egg */}
          <ellipse cx="72" cy="214" rx="15" ry="10" fill="#FFFDF4" stroke={theme.ink} strokeWidth="1.8" />
          <ellipse cx="72" cy="214" rx="6.5" ry="5.5" fill="#F2A93B" />
          {/* naruto */}
          <circle cx="112" cy="216" r="10" fill="#FFF4F1" stroke={theme.ink} strokeWidth="1.8" />
          <path d="M 112 208 C 118 212, 116 220, 109 221 C 105 219, 106 213, 112 212" stroke="#E9778B" strokeWidth="2.4" fill="none" />
          {/* greens */}
          <path d="M 86 210 C 90 202, 98 202, 101 209 C 98 215, 89 215, 86 210 Z" fill="#5E9E62" stroke={theme.ink} strokeWidth="1.4" />
          <path d="M 78 211 C 81 205, 87 205, 89 211 C 86 216, 80 215, 78 211 Z" fill="#6FB173" stroke={theme.ink} strokeWidth="1.2" />
          {/* chashu */}
          <ellipse cx="126" cy="220" rx="11" ry="7" fill="#C96E5A" stroke={theme.ink} strokeWidth="1.6" transform="rotate(-8 126 220)" />
        </g>
      </g>
      {focus > 0.01 && (
        <g opacity={focus}>
          {[[28, 96], [162, 96], [28, 268], [162, 268]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d={i % 2 === 0 ? 'M 10 0 H 0 V 10' : 'M -10 0 H 0 V 10'} stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.9" />
              <path d={i < 2 ? 'M 0 10 V 0' : 'M 0 -10 V 0'} stroke="none" />
            </g>
          ))}
          <g transform="translate(95 152)">
            <circle r="17" fill="rgba(255,255,255,0.18)" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M 0 -17 A 17 17 0 0 1 17 0" stroke="#FFFFFF" strokeWidth="4" fill="none" />
          </g>
          <text x="95" y="196" textAnchor="middle" fontFamily={FONT} fontSize="19" fill="#FFFFFF" style={{paintOrder: 'stroke'}} stroke="rgba(46,41,36,0.55)" strokeWidth="3">
            对焦中..
          </text>
        </g>
      )}
    </svg>
  );
};

export const ShibaScene: React.FC<{frame: number; t: number; textPop?: number}> = ({frame, t, textPop = 0}) => {
  const bob = Math.sin(frame * 0.12) * 2;
  const heartPulse = 1 + Math.sin(frame * 0.18) * 0.08;
  return (
    <svg viewBox="0 0 190 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="190" height="300" fill="#CDEEE2" />
      {Array.from({length: 22}).map((_, i) => (
        <circle key={i} cx={rand(i * 5 + 20) * 190} cy={rand(i * 9 + 30) * 300} r={1.6} fill="#FFFFFF" opacity={0.5} />
      ))}
      <g transform={`translate(0 ${bob})`}>
        {/* body */}
        <ellipse cx="95" cy="260" rx="52" ry="58" fill="#D98A4E" stroke={theme.ink} strokeWidth="2.6" />
        <ellipse cx="95" cy="268" rx="30" ry="43" fill="#FFF8EC" />
        {/* ears */}
        <path d="M 58 122 L 70 66 L 98 108 Z" fill="#D98A4E" stroke={theme.ink} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M 66 112 L 73 82 L 88 107 Z" fill="#F3B7C2" />
        <path d="M 132 122 L 120 66 L 92 108 Z" fill="#D98A4E" stroke={theme.ink} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M 124 112 L 117 82 L 102 107 Z" fill="#F3B7C2" />
        {/* head */}
        <ellipse cx="95" cy="150" rx="48" ry="44" fill="#D98A4E" stroke={theme.ink} strokeWidth="2.8" />
        <ellipse cx="95" cy="166" rx="33" ry="26" fill="#FFF8EC" />
        <ellipse cx="78" cy="171" rx="9" ry="7" fill="#F3B7C2" opacity="0.85" />
        <ellipse cx="112" cy="171" rx="9" ry="7" fill="#F3B7C2" opacity="0.85" />
        {/* eyes */}
        <ellipse cx="78" cy="147" rx="5.2" ry="6.4" fill="#2E2924" />
        <ellipse cx="112" cy="147" rx="5.2" ry="6.4" fill="#2E2924" />
        <circle cx="80" cy="145" r="1.6" fill="#FFFFFF" />
        <circle cx="114" cy="145" r="1.6" fill="#FFFFFF" />
        {/* brows */}
        <ellipse cx="78" cy="137" rx="6.5" ry="3" fill="#FFF8EC" />
        <ellipse cx="112" cy="137" rx="6.5" ry="3" fill="#FFF8EC" />
        {/* nose + mouth */}
        <path d="M 91 158 Q 95 155 99 158 Q 97 163 95 163 Q 93 163 91 158 Z" fill="#2E2924" />
        <path d="M 95 163 V 168 M 95 168 Q 89 174 85 170 M 95 168 Q 101 174 105 170" stroke="#2E2924" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* hearts */}
        <g transform={`translate(52 106) scale(${heartPulse})`}>
          <path d="M 0 8 C -9 2, -8 -6, -3 -7 C 0 -8, 0 -5, 0 -4 C 0 -5, 0 -8, 3 -7 C 8 -6, 9 2, 0 8 Z" fill="#E9778B" stroke={theme.ink} strokeWidth="1.2" />
        </g>
        <g transform={`translate(138 88) scale(${heartPulse * 0.8})`} opacity="0.8">
          <path d="M 0 8 C -9 2, -8 -6, -3 -7 C 0 -8, 0 -5, 0 -4 C 0 -5, 0 -8, 3 -7 C 8 -6, 9 2, 0 8 Z" fill="#E9778B" stroke={theme.ink} strokeWidth="1.2" />
        </g>
      </g>
      {textPop > 0.01 && (
        <g transform={`translate(95 244) scale(${0.55 + textPop * 0.45}) rotate(-3)`} opacity={textPop}>
          <text
            textAnchor="middle"
            fontFamily={FONT}
            fontSize="25"
            fill={theme.yellow}
            stroke={theme.ink}
            strokeWidth="4.5"
            style={{paintOrder: 'stroke'}}
          >
            前方高能预警
          </text>
          <text textAnchor="middle" fontFamily={FONT} fontSize="25" fill={theme.yellow}>
            前方高能预警
          </text>
        </g>
      )}
    </svg>
  );
};

const DiscoMascot: React.FC<{frame: number}> = ({frame}) => {
  const sway = Math.sin(frame * 0.24) * 5;
  const armA = -35 + Math.sin(frame * 0.3) * 18;
  const armB = 35 - Math.sin(frame * 0.3 + 1) * 18;
  const bounce = Math.abs(Math.sin(frame * 0.24)) * 5;
  return (
    <g transform={`translate(95 ${196 - bounce}) rotate(${sway})`}>
      <path d={`M -26 22 L -34 ${60 + bounce} M 26 22 L 34 ${60 + bounce}`} stroke={theme.ink} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="-34" cy={64 + bounce} rx="10" ry="6" fill="#FFF8EC" stroke={theme.ink} strokeWidth="2.4" />
      <ellipse cx="34" cy={64 + bounce} rx="10" ry="6" fill="#FFF8EC" stroke={theme.ink} strokeWidth="2.4" />
      <g transform={`rotate(${armA} -28 -8)`}>
        <path d="M -28 -8 L -48 -40" stroke={theme.ink} strokeWidth="7" strokeLinecap="round" />
        <circle cx="-48" cy="-42" r="7" fill={theme.coral} stroke={theme.ink} strokeWidth="2.4" />
      </g>
      <g transform={`rotate(${armB} 28 -8)`}>
        <path d="M 28 -8 L 48 -40" stroke={theme.ink} strokeWidth="7" strokeLinecap="round" />
        <circle cx="48" cy="-42" r="7" fill={theme.coral} stroke={theme.ink} strokeWidth="2.4" />
      </g>
      <rect x="-31" y="-34" width="62" height="50" rx="10" fill={theme.coral} stroke={theme.ink} strokeWidth="3" />
      <path d="M -16 -14 Q -11 -20 -6 -14 M 6 -14 Q 11 -20 16 -14" stroke={theme.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M -9 -2 Q 0 7 9 -2" stroke={theme.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <ellipse cx="-19" cy="-5" rx="4" ry="2.6" fill="#F3B7C2" opacity="0.9" />
      <ellipse cx="19" cy="-5" rx="4" ry="2.6" fill="#F3B7C2" opacity="0.9" />
    </g>
  );
};

export const DiscoScene: React.FC<{frame: number; t: number; impact?: number; flash?: number; social?: boolean}> = ({
  frame,
  t,
  impact = 0,
  flash = 0,
  social = false,
}) => {
  const uid = useId().replace(/:/g, '');
  const ballRot = frame * 1.4;
  const beams = 0.1 + 0.06 * Math.abs(Math.sin(frame * 0.08));
  const scale = 1 + impact * 0.07;
  return (
    <svg viewBox="0 0 190 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`disco-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B62B8" />
          <stop offset="55%" stopColor="#654A9B" />
          <stop offset="100%" stopColor="#34245C" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`}>
          <stop offset="0%" stopColor="#FFF6C9" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFF6C9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="190" height="300" fill={`url(#disco-${uid})`} />
      <g opacity={beams}>
        <polygon points="95,58 0,300 42,300" fill="#FFF6C9" />
        <polygon points="95,58 148,300 190,300" fill="#FFD6E8" />
        <polygon points="95,58 70,300 112,300" fill="#B7F0F7" />
      </g>
      <g transform={`translate(95 52) rotate(${ballRot})`} style={{transformOrigin: '0 0'}}>
        <circle r="38" fill={`url(#glow-${uid})`} opacity="0.9" />
        <circle r="21" fill="#C9D4E0" stroke={theme.ink} strokeWidth="2.2" />
        <path d="M -21 0 H 21 M 0 -21 V 21 M -15 -15 L 15 15 M 15 -15 L -15 15" stroke="#FFFFFF" strokeWidth="1.3" opacity="0.8" />
        <circle cx="-7" cy="-8" r="4" fill="#FFFFFF" opacity="0.9" />
      </g>
      <g transform={`translate(95 218) scale(${scale}) translate(-95 -218)`}>
        {/* floor */}
        {Array.from({length: 5}).map((_, row) =>
          Array.from({length: 9}).map((_, col) => {
            const y0 = 206 + row * 19;
            const y1 = y0 + 19;
            const spread = 0.55 + row * 0.14;
            const cx = 95;
            const x0 = cx + (col - 4.5) * 22 * spread;
            const x1 = cx + (col - 3.5) * 22 * spread;
            const x2 = cx + (col - 3.5) * 22 * (spread + 0.12);
            const x3 = cx + (col - 4.5) * 22 * (spread + 0.12);
            const even = (row + col) % 2 === 0;
            const colors = ['#8ED1C6', '#F0C96A', '#C9B9E6', '#7EC3B8'];
            return (
              <polygon
                key={`${row}-${col}`}
                points={`${x0},${y0} ${x1},${y0} ${x2},${y1} ${x3},${y1}`}
                fill={even ? colors[row % colors.length] : '#4A3A78'}
                opacity={0.72}
                stroke="#3B2A66"
                strokeWidth="0.8"
              />
            );
          }),
        )}
        <DiscoMascot frame={frame} />
      </g>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 28 + rand(i * 7 + 2) * 134;
        const y = 90 + rand(i * 11 + 5) * 110;
        const s = 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.1 + i));
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${0.7 + s * 0.5})`} opacity={0.5 + s * 0.5}>
            <path d="M 0 -7 L 2 -2 L 7 0 L 2 2 L 0 7 L -2 2 L -7 0 L -2 -2 Z" fill="#FFF6C9" stroke={theme.yellowDark} strokeWidth="0.8" />
          </g>
        );
      })}
      <rect width="190" height="300" fill="#FFF6C9" opacity={flash * 0.22} />
      {social && <SocialOverlay frame={frame} />}
    </svg>
  );
};

const SocialOverlay: React.FC<{frame: number}> = ({frame}) => {
  const pop = 0.9 + Math.sin(frame * 0.15) * 0.03;
  return (
    <g>
      <g transform={`translate(95 112) scale(${pop}) rotate(-4)`}>
        <text textAnchor="middle" fontFamily={FONT} fontSize="38" fill={theme.yellow} stroke={theme.ink} strokeWidth="6" style={{paintOrder: 'stroke'}}>
          拿捏了!
        </text>
        <text textAnchor="middle" fontFamily={FONT} fontSize="38" fill={theme.yellow}>
          拿捏了!
        </text>
      </g>
      {/* avatar */}
      <g transform="translate(160 42)">
        <circle r="15" fill="#D9534F" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="-4" cy="-3" r="1.6" fill="#FFFFFF" />
        <circle cx="5" cy="-3" r="1.6" fill="#FFFFFF" />
        <path d="M -5 4 Q 0 9 5 4" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="12" cy="-12" r="5" fill="#FFFFFF" stroke="#D9534F" strokeWidth="1.4" />
        <path d="M 12 -15 V -9 M 9 -12 H 15" stroke="#D9534F" strokeWidth="1.2" />
      </g>
      {[
        {y: 82, icon: 'heart', count: '10.2w', color: '#E86A7A'},
        {y: 122, icon: 'comment', count: '2333', color: '#FFFFFF'},
        {y: 162, icon: 'share', count: '分享', color: '#FFFFFF'},
      ].map((it, i) => (
        <g key={i} transform={`translate(164 ${it.y})`}>
          <circle r="12" fill="rgba(46,41,36,0.35)" />
          {it.icon === 'heart' && <path d="M 0 7 C -9 1, -8 -7, -3 -8 C 0 -9, 0 -6, 0 -5 C 0 -6, 0 -9, 3 -8 C 8 -7, 9 1, 0 7 Z" fill="#F26D7D" stroke="#FFFFFF" strokeWidth="1.4" />}
          {it.icon === 'comment' && <path d="M -7 -6 H 7 V 4 H 1 L -3 8 V 4 H -7 Z" fill="#FFFFFF" opacity="0.95" />}
          {it.icon === 'share' && <path d="M -7 5 C -7 0, -3 -3, 2 -3 M 2 -6 L 7 -2.5 L 2 1" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />}
          <text y="26" textAnchor="middle" fontFamily={FONT} fontSize="10" fill="#FFFFFF">{it.count}</text>
        </g>
      ))}
      <g transform="translate(10 258)">
        <text fontFamily={FONT} fontSize="12" fill="#FFFFFF">@小克 · Opus 5.5</text>
        <text y="16" fontFamily={FONT} fontSize="9.5" fill="#F7D566">#AI剪辑 #卡点 #code2video</text>
      </g>
      <g transform="translate(148 286) rotate(-8)">
        <circle r="12" fill="none" stroke="#E86A7A" strokeWidth="2" />
        <text textAnchor="middle" y="3.5" fontFamily={FONT} fontSize="7.5" fill="#E86A7A">小克出品</text>
      </g>
    </g>
  );
};

export const MiniScene: React.FC<{kind: 'night' | 'ramen' | 'shiba' | 'disco'; width: number; height: number}> = ({
  kind,
  width,
  height,
}) => {
  const uid = useId().replace(/:/g, '');
  if (kind === 'night') {
    return (
      <svg width={width} height={height} viewBox="0 0 60 72" preserveAspectRatio="xMidYMid slice">
        <rect width="60" height="72" fill="#2A2656" />
        <circle cx="44" cy="18" r="7" fill="#F7D566" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={i * 12 - 2} y={34 + (i % 3) * 6} width="10" height="40" fill="#1B193A" />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={i * 9 + 3} y={42 + (i % 2) * 10} width="3" height="4" fill="#F0C96A" opacity="0.8" />
        ))}
      </svg>
    );
  }
  if (kind === 'ramen') {
    return (
      <svg width={width} height={height} viewBox="0 0 60 72" preserveAspectRatio="xMidYMid slice">
        <rect width="60" height="72" fill="#F2DFC0" />
        <rect y="50" width="60" height="22" fill="#D9B383" />
        <ellipse cx="30" cy="48" rx="22" ry="7" fill="#FBF6EA" stroke="#2E2924" strokeWidth="1.4" />
        <path d="M 8 48 C 9 62, 18 66, 30 66 C 42 66, 51 62, 52 48 Z" fill="#FBF6EA" stroke="#2E2924" strokeWidth="1.5" />
        <ellipse cx="30" cy="48" rx="18" ry="5" fill="#E1A85D" />
        <circle cx="24" cy="46" r="4.5" fill="#FFFDF4" />
        <circle cx="24" cy="46" r="2" fill="#F2A93B" />
        <path d="M 36 44 L 42 20" stroke="#A9713C" strokeWidth="2" />
      </svg>
    );
  }
  if (kind === 'shiba') {
    return (
      <svg width={width} height={height} viewBox="0 0 60 72" preserveAspectRatio="xMidYMid slice">
        <rect width="60" height="72" fill="#CDEEE2" />
        <ellipse cx="30" cy="42" rx="20" ry="24" fill="#D98A4E" stroke="#2E2924" strokeWidth="1.5" />
        <path d="M 13 28 L 16 8 L 27 25 Z" fill="#D98A4E" stroke="#2E2924" strokeWidth="1.4" />
        <path d="M 47 28 L 44 8 L 33 25 Z" fill="#D98A4E" stroke="#2E2924" strokeWidth="1.4" />
        <ellipse cx="30" cy="46" rx="12" ry="9" fill="#FFF8EC" />
        <ellipse cx="23" cy="39" rx="2" ry="2.6" fill="#2E2924" />
        <ellipse cx="37" cy="39" rx="2" ry="2.6" fill="#2E2924" />
        <path d="M 27 47 Q 30 50 33 47" stroke="#2E2924" strokeWidth="1.4" fill="none" />
      </svg>
    );
  }
  return (
    <svg width={width} height={height} viewBox="0 0 60 72" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`mini-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B62B8" />
          <stop offset="100%" stopColor="#34245C" />
        </linearGradient>
      </defs>
      <rect width="60" height="72" fill={`url(#mini-${uid})`} />
      <circle cx="30" cy="17" r="7" fill="#C9D4E0" stroke="#2E2924" strokeWidth="1.2" />
      {Array.from({length: 3}).map((_, r) =>
        Array.from({length: 6}).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 10} y={44 + r * 9} width="10" height="9" fill={(r + c) % 2 ? '#8ED1C6' : '#4A3A78'} opacity="0.85" />
        )),
      )}
      <rect x="21" y="34" width="18" height="15" rx="4" fill="#D46A57" stroke="#2E2924" strokeWidth="1.4" />
      <path d="M 25 40 Q 27 38 29 40 M 31 40 Q 33 38 35 40" stroke="#2E2924" strokeWidth="1.1" fill="none" />
    </svg>
  );
};

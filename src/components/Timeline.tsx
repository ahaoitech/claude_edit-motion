import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {FONT, theme, clamp} from '../theme';
import {CLIPS, PLAYHEAD_KEYS, TL} from '../data';
import {Icon, Panel, Waveform, Sparkle} from '../ui';
import {MiniScene} from './scenes';

const playheadAt = (t: number) => {
  for (let i = 0; i < PLAYHEAD_KEYS.length - 1; i++) {
    const [t0, v0] = PLAYHEAD_KEYS[i];
    const [t1, v1] = PLAYHEAD_KEYS[i + 1];
    if (t >= t0 && t <= t1) {
      return interpolate(t, [t0, t1], [v0, v1], {easing: (p) => p * p * (3 - 2 * p)});
    }
  }
  return PLAYHEAD_KEYS[PLAYHEAD_KEYS.length - 1][1];
};

export const Timeline: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const {fps} = useVideoConfig();
  const playhead = playheadAt(t);
  const playX = TL.x + playhead * TL.pxPerSec;
  const deleteP = interpolate(t, [7.85, 8.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const labelPop = spring({frame: frame - Math.round(13.4 * fps), fps, config: {damping: 11, stiffness: 160}});

  return (
    <div style={{position: 'absolute', left: 8, top: 352, width: 1264, height: 360}}>
      <Panel style={{left: 0, top: 0, width: 1264, height: 360}} radius={14} fill={'#F7F3E9'} borderWidth={3}>
        {/* ruler */}
        <div style={{position: 'absolute', left: 96, top: 32, width: 1150, height: 2, background: theme.ink, opacity: 0.7}} />
        {Array.from({length: 17}).map((_, i) => {
          const x = TL.x + i * TL.pxPerSec;
          const major = i % 2 === 0;
          return (
            <div key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: major ? 20 : 25,
                  width: 1.6,
                  height: major ? 12 : 7,
                  background: theme.ink,
                  opacity: major ? 0.8 : 0.45,
                }}
              />
              {major && (
                <div
                  style={{
                    position: 'absolute',
                    left: x - 16,
                    top: 2,
                    width: 32,
                    textAlign: 'center',
                    fontFamily: FONT,
                    fontSize: 12.5,
                    color: theme.inkSoft,
                  }}
                >
                  0:{String(i).padStart(2, '0')}
                </div>
              )}
            </div>
          );
        })}

        {/* tool rail */}
        {[
          {x: 32, y: 52, fill: theme.yellow, icon: 'text' as const},
          {x: 32, y: 112, fill: theme.teal, icon: 'play' as const},
          {x: 32, y: 180, fill: theme.lavender, icon: 'music' as const},
        ].map((it, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: it.x,
              top: it.y,
              width: 36,
              height: 36,
              borderRadius: 7,
              background: it.fill,
              border: `2.4px solid ${theme.ink}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={it.icon} size={21} />
          </div>
        ))}

        {/* clips */}
        {CLIPS.map((clip, i) => {
          const appear = spring({frame: frame - Math.round((2.45 + i * 0.22) * fps), fps, config: {damping: 12, stiffness: 150}});
          const isRamen = clip.id === 'ramen';
          const shifted = i >= 2 ? -140 * deleteP : 0;
          const width = (isRamen ? clip.duration * TL.pxPerSec - 140 * deleteP : clip.duration * TL.pxPerSec);
          const left = TL.x + clip.start * TL.pxPerSec + shifted;
          return (
            <div
              key={clip.id}
              style={{
                position: 'absolute',
                left,
                top: 92,
                width,
                height: TL.height,
                borderRadius: 7,
                border: `2.4px solid ${theme.ink}`,
                overflow: 'hidden',
                background: clip.tint,
                opacity: clamp(appear),
                transform: `scale(${0.9 + clamp(appear) * 0.1})`,
                transformOrigin: '0% 50%',
              }}
            >
              {Array.from({length: Math.max(1, Math.ceil(width / 58))}).map((_, k) => (
                <div key={k} style={{position: 'absolute', left: k * 58, top: 0, width: 58, height: TL.height, overflow: 'hidden', borderRight: k > 0 ? '1px solid rgba(46,41,36,0.18)' : undefined}}>
                  <MiniScene kind={clip.id} width={58} height={TL.height} />
                </div>
              ))}
              <div
                style={{
                  position: 'absolute',
                  left: 5,
                  top: 4,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: 'rgba(46,41,36,0.78)',
                  color: '#FFF8EC',
                  fontFamily: FONT,
                  fontSize: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                {clip.label}
              </div>
              <div style={{position: 'absolute', right: 5, bottom: 4, display: 'flex', gap: 3}}>
                {[clip.id === 'night' ? 'camera' : 'music', 'sparkle'].map((ic, n) => (
                  <span
                    key={n}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.78)',
                      border: '1px solid rgba(46,41,36,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={ic as 'camera'} size={10} />
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {/* deleted segment */}
        {deleteP < 0.98 && t > 6.7 && (
          <div
            style={{
              position: 'absolute',
              left: TL.x + 2.45 * TL.pxPerSec,
              top: 92,
              width: 140 * (1 - deleteP),
              height: TL.height,
              background:
                'repeating-linear-gradient(135deg, rgba(70,64,56,0.55) 0px, rgba(70,64,56,0.55) 7px, rgba(190,183,170,0.55) 7px, rgba(190,183,170,0.55) 14px)',
              border: '2px dashed rgba(46,41,36,0.75)',
              borderRadius: 6,
              opacity: 0.9,
            }}
          />
        )}

        {/* audio bed */}
        <div
          style={{
            position: 'absolute',
            left: TL.x,
            top: 204,
            width: 16 * TL.pxPerSec,
            height: TL.audioHeight,
            borderRadius: 7,
            border: `2.4px solid ${theme.ink}`,
            background: '#EFEAF7',
            overflow: 'hidden',
          }}
        >
          <div style={{position: 'absolute', left: 6, top: 5, zIndex: 2}}>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 11,
                background: theme.card,
                border: '1.4px solid rgba(46,41,36,0.5)',
                borderRadius: 4,
                padding: '0 5px',
              }}
            >
              ♪ bgm_小克.wav
            </span>
          </div>
          <div style={{position: 'absolute', left: 0, top: 8, opacity: 0.95}}>
            <Waveform width={16 * TL.pxPerSec} height={26} count={210} seed={3} color="#7C69C4" />
          </div>
        </div>

        {/* text track label */}
        {labelPop > 0.01 && (
          <div
            style={{
              position: 'absolute',
              left: TL.x + 8.4 * TL.pxPerSec,
              top: 58,
              transform: `scale(${clamp(labelPop)})`,
              transformOrigin: '0% 100%',
              opacity: clamp(labelPop),
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                height: 25,
                padding: '0 10px',
                borderRadius: 5,
                background: theme.yellow,
                border: `2.2px solid ${theme.ink}`,
                fontFamily: FONT,
                fontSize: 12.5,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="text" size={13} /> 前方高能预告
            </div>
          </div>
        )}

        {/* playhead */}
        <div style={{position: 'absolute', left: playX, top: 26, width: 2, height: 300, background: theme.red, opacity: 0.9}} />
        <div
          style={{
            position: 'absolute',
            left: playX - 9,
            top: 26,
            width: 18,
            height: 20,
            background: theme.red,
            border: `2px solid ${theme.ink}`,
            borderRadius: '4px 4px 7px 7px',
            transform: 'rotate(-1deg)',
          }}
        >
          <div style={{position: 'absolute', left: 6, top: -6, width: 2, height: 8, background: theme.ink, opacity: 0.5}} />
        </div>

        {/* sparkles */}
        {[
          {x: 600, y: 160, t0: 9.3, t1: 10.2, s: 15, c: theme.yellow},
          {x: 660, y: 150, t0: 9.7, t1: 10.6, s: 11, c: theme.pink},
          {x: 760, y: 168, t0: 10.0, t1: 10.9, s: 13, c: theme.white},
          {x: 905, y: 145, t0: 13.6, t1: 14.5, s: 12, c: theme.yellow},
        ].map((sp, i) => {
          const p = interpolate(t, [sp.t0, sp.t0 + 0.2, sp.t1 - 0.2, sp.t1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return <Sparkle key={i} x={sp.x} y={sp.y} size={sp.s} color={sp.c} opacity={p} rotate={p * 45} />;
        })}

        {/* zoom slider */}
        <div style={{position: 'absolute', left: 30, top: 330, width: 230, height: 20, display: 'flex', alignItems: 'center', gap: 8}}>
          <span style={{fontFamily: FONT, fontSize: 18, color: theme.inkSoft}}>−</span>
          <div style={{position: 'relative', width: 170, height: 3, background: theme.inkFaint, borderRadius: 2}}>
            <div style={{position: 'absolute', left: 58, top: -6, width: 15, height: 15, borderRadius: 8, background: theme.card, border: `2px solid ${theme.ink}`}} />
          </div>
          <span style={{fontFamily: FONT, fontSize: 18, color: theme.inkSoft}}>+</span>
        </div>
        <div style={{position: 'absolute', right: 22, top: 330, fontFamily: FONT, fontSize: 11, color: theme.inkFaint}}>
          片段 9 · 总时长 0:16.0
        </div>
      </Panel>
    </div>
  );
};

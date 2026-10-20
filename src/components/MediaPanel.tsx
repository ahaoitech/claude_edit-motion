import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {FONT, theme, clamp} from '../theme';
import {MEDIA} from '../data';
import {Icon, Panel as MiniPanel} from '../ui';
import {MiniScene} from './scenes';

const TABS = ['素材', '转场', '文字'];

export const MediaPanel: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const {fps} = useVideoConfig();
  const active = t < 8.4 ? 0 : t < 12.3 ? 1 : t < 14.8 ? 2 : 0;
  const mediaOpacity = active === 0 ? 1 : 0.0;
  const transOpacity = active === 1 ? 1 : 0;
  const textOpacity = active === 2 ? 1 : 0;

  return (
    <div style={{position: 'absolute', left: 18, top: 66, width: 290, height: 282}}>
      <MiniPanel style={{left: 0, top: 0, width: 290, height: 282}} radius={14} fill={theme.card}>
        {/* tabs */}
        {TABS.map((tab, i) => {
          const isActive = active === i;
          return (
            <div
              key={tab}
              style={{
                position: 'absolute',
                left: 10 + i * 90,
                top: 8,
                width: 84,
                height: 28,
                borderRadius: 7,
                background: isActive ? theme.yellow : '#EFE9DB',
                border: `2.2px solid ${theme.ink}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT,
                fontSize: 14,
                color: isActive ? theme.ink : theme.inkSoft,
                transform: `rotate(${isActive ? -0.6 : 0}deg)`,
              }}
            >
              {tab}
            </div>
          );
        })}

        {/* MEDIA */}
        <div style={{position: 'absolute', left: 0, top: 44, width: 290, opacity: mediaOpacity, pointerEvents: 'none'}}>
          {MEDIA.map((m, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const appear = spring({
              frame: frame - Math.round((1.92 + i * 0.09) * fps),
              fps,
              config: {damping: 13, stiffness: 150, mass: 0.7},
            });
            return (
              <div
                key={m.label}
                style={{
                  position: 'absolute',
                  left: 10 + col * 138,
                  top: row * 94,
                  width: 128,
                  opacity: clamp(appear),
                  transform: `translateY(${(1 - appear) * 12}px)`,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: 128,
                    height: 70,
                    borderRadius: 8,
                    border: `2.2px solid ${theme.ink}`,
                    overflow: 'hidden',
                    background: '#EEE7D7',
                  }}
                >
                  <MiniScene kind={m.id} width={128} height={70} />
                  <div
                    style={{
                      position: 'absolute',
                      right: 4,
                      bottom: 3,
                      padding: '1px 5px',
                      borderRadius: 4,
                      background: 'rgba(46,41,36,0.72)',
                      color: '#FFF8EC',
                      fontFamily: FONT,
                      fontSize: 9.5,
                    }}
                  >
                    {m.duration}
                  </div>
                </div>
                <div style={{textAlign: 'center', fontFamily: FONT, fontSize: 12.5, color: theme.ink, marginTop: 2}}>
                  {m.label}
                </div>
              </div>
            );
          })}
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 10 + i * 138,
                top: 186,
                width: 128,
                height: 44,
                borderRadius: 8,
                border: `2.2px dashed ${theme.inkFaint}`,
                color: theme.inkFaint,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                fontFamily: FONT,
                fontSize: 11,
              }}
            >
              <Icon name="plus" size={18} color={theme.inkFaint} />
              导入素材
            </div>
          ))}
        </div>

        {/* TRANSITIONS */}
        <div style={{position: 'absolute', left: 0, top: 44, width: 290, opacity: transOpacity, pointerEvents: 'none'}}>
          {[
            {label: '旋转', icon: 'rotate' as const, fill: theme.lavender, x: 10, y: 0},
            {label: '翻页', icon: 'flip' as const, fill: theme.mint, x: 148, y: 0},
            {label: '故障', icon: 'glitch' as const, fill: theme.pink, x: 10, y: 78},
            {label: '放大', icon: 'zoom' as const, fill: '#BBD7F0', x: 148, y: 78},
            {label: '滑动', icon: 'slide' as const, fill: '#F6E3A8', x: 10, y: 156},
            {label: '溶解', icon: 'dissolve' as const, fill: '#DDD6C9', x: 148, y: 156},
          ].map((it, i) => {
            const pick = i === 0 ? interpolate(t, [8.9, 9.2, 10.3, 10.7], [1, 1.06, 1.06, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
            return (
              <div key={it.label} style={{position: 'absolute', left: it.x, top: it.y, width: 128}}>
                <div
                  style={{
                    position: 'relative',
                    width: 128,
                    height: 58,
                    borderRadius: 8,
                    background: it.fill,
                    border: `${i === 0 && t > 8.8 ? 3 : 2.2}px solid ${theme.ink}`,
                    boxShadow: i === 0 && t > 8.8 ? '0 0 0 3px rgba(247,213,102,0.75)' : undefined,
                    transform: `scale(${pick}) rotate(${i % 2 === 0 ? -0.5 : 0.4}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={it.icon} size={28} />
                </div>
                <div style={{textAlign: 'center', fontFamily: FONT, fontSize: 11.5, marginTop: 1}}>{it.label}</div>
              </div>
            );
          })}
        </div>

        {/* TEXT */}
        <div style={{position: 'absolute', left: 0, top: 44, width: 290, opacity: textOpacity, pointerEvents: 'none'}}>
          {[
            {text: '前方高能', fill: theme.yellow, color: theme.ink, y: 0, border: theme.ink},
            {text: '好耶~', fill: '#F7C7D0', color: theme.ink, y: 76, border: theme.ink},
            {text: '霓虹 NEON', fill: '#2B2438', color: '#F5A8C8', y: 152, border: theme.ink},
          ].map((it, i) => {
            const pick = i === 1 ? interpolate(t, [12.8, 13.1, 13.9, 14.3], [1, 1.05, 1.05, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
            return (
              <div
                key={it.text}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: it.y,
                  width: 266,
                  height: 62,
                  borderRadius: 9,
                  background: it.fill,
                  border: `2.4px solid ${it.border}`,
                  boxShadow: i === 1 && t > 12.7 ? '0 0 0 3px rgba(247,213,102,0.8)' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT,
                  fontSize: 27,
                  color: it.color,
                  transform: `scale(${pick}) rotate(${i === 1 ? -1 : 0.4}deg)`,
                  textShadow: i === 2 ? '0 0 8px rgba(245,168,200,0.9)' : undefined,
                }}
              >
                {it.text}
              </div>
            );
          })}
        </div>
      </MiniPanel>
    </div>
  );
};

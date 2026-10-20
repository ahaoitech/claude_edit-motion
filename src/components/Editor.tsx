import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {theme, clamp, W, H} from '../theme';
import {TopBar} from './TopBar';
import {MediaPanel} from './MediaPanel';
import {AdjustPanel} from './AdjustPanel';
import {Timeline} from './Timeline';
import {Phone} from './Phone';
import {MascotLayer} from './Mascot';
import {Overlays} from './Overlays';
import {Icon, Panel} from '../ui';

export const Editor: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - Math.round(1.7 * fps), fps, config: {damping: 16, stiffness: 170}});
  const scale = interpolate(
    t,
    [1.72, 3.1, 15.3, 16.35, 24.6, 26.4, 30],
    [1, 1.2, 1.2, 1.5, 1.5, 1.04, 1.04],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (p) => p * p * (3 - 2 * p)},
  );
  const cx = interpolate(
    t,
    [1.72, 3.1, 15.3, 16.35, 20.0, 24.6, 26.4, 30],
    [640, 600, 600, 813, 757, 757, 650, 650],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (p) => p * p * (3 - 2 * p)},
  );
  const cy = interpolate(
    t,
    [1.72, 3.1, 15.3, 16.35, 24.6, 26.4, 30],
    [360, 358, 358, 255, 255, 345, 345],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (p) => p * p * (3 - 2 * p)},
  );
  const tx = 640 - cx * scale;
  const ty = 360 - cy * scale;
  const playing = t > 3.2;

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: H,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: '0 0',
          opacity: clamp(enter),
        }}
      >
        <Panel
          style={{left: 8, top: 8, width: 1264, height: 704, overflow: 'hidden'}}
          radius={18}
          fill={'#F7F3E9'}
          borderWidth={3.2}
          shadow={false}
        >
          <TopBar t={t} frame={frame} />
          <MediaPanel t={t} frame={frame} />
          <AdjustPanel t={t} frame={frame} />
          <Timeline t={t} frame={frame} />

          {/* phone preview */}
          <div style={{position: 'absolute', left: 550, top: 70, width: 190, height: 300}}>
            <Phone frame={frame} t={t} />
          </div>
          {/* transport */}
          <div style={{position: 'absolute', left: 566, top: 378, width: 160, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Icon name="rewind" size={21} />
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                border: `2.4px solid ${theme.ink}`,
                background: theme.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={playing ? 'pause' : 'play'} size={15} />
            </div>
            <Icon name="forward" size={21} />
          </div>

          {t < 24.45 && <MascotLayer t={t} frame={frame} />}
          <Overlays t={t} frame={frame} />
        </Panel>
      </div>
    </div>
  );
};

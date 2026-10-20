import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {FPS, DURATION, W, H} from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="ClaudeEditMotion" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
  </>
);

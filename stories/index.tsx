import * as React from 'react';
//@ts-ignore
import { storiesOf } from '@storybook/react';
import { ReactPlayable } from '../src/components/ReactPlayable/';

storiesOf('ReactPlayable', module).add('default view', () => (
  <ReactPlayable
    width={760}
    height={428}
    title="MY VIDEO!"
    src="http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_10mb.mp4"
  />
));

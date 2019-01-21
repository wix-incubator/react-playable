import * as React from 'react';
//@ts-ignore
import { storiesOf } from '@storybook/react';
import { ReactPlayable } from '../src/components/ReactPlayable/';

storiesOf('ReactPlayable', module)
  .add('default view', () => (
    <ReactPlayable
      width={760}
      height={428}
      title="MY VIDEO!"
      src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
    />
  ))
  .add('auto play', () => (
    <ReactPlayable
      width={760}
      height={428}
      title="MY VIDEO!"
      config={{ autoplay: true }}
      src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
    />
  ));

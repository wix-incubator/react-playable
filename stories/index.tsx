import * as React from 'react';
//@ts-ignore
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean, text } from '@storybook/addon-knobs';

import { ReactPlayable } from '../src/components/ReactPlayable/';

const stories = storiesOf('ReactPlayable', module);

stories.addDecorator(withKnobs);

stories
  .add('default view', () => (
    <ReactPlayable
      width={number('Widgth', 760)}
      height={number('Height', 428)}
      title={text('Title', 'MY VIDEO!')}
      fillAllSpace={boolean('Fill all space', false)}
      src={text('Source', 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4')}
    />
  ))
  .add('auto play', () => (
    <ReactPlayable
      width={760}
      height={428}
      title="MY VIDEO!"
      autoplay
      src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
    />
  ))
  .add('preload none', () => (
    <ReactPlayable
      width={760}
      height={428}
      preload="none"
      config={{
        hideOverlay: true,
      }}
      src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
    />
  ))
  .add('preload metadata', () => (
    <ReactPlayable
      width={760}
      height={428}
      preload="metadata"
      config={{
        hideOverlay: true,
      }}
      src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
    />
  ));

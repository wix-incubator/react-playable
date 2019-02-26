import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactIs from 'react-is';

import {
  bool,
  array,
  arrayOf,
  number,
  string,
  func,
  oneOfType,
  object,
  shape,
  exact,
} from 'prop-types';

import {
  create,
  registerModule,
  registerPlaybackAdapter,
  //@ts-ignore
} from 'playable';

interface IState {
  isMounted: boolean;
}

interface IExtendedStatelessComponent extends React.StatelessComponent {
  dependencies?: string[];
}

interface IExtendedComponent extends React.ComponentClass {
  dependencies?: string[];
}

interface IMediaSourceObject {
  url: string;
  type?: string;
}

type MediaSource =
  | string
  | IMediaSourceObject
  | Array<string | IMediaSourceObject>;

const PropertyToMethodMap: { [parameter: string]: string } = {
  autoplay: 'setAutoplay',
  preload: 'setPreload',
  width: 'setWidth',
  height: 'setHeight',
  fillAllSpace: 'setFillAllSpace',
  src: 'setSrc',
  title: 'setTitle',
  poster: 'setPoster',
};

export interface ReactPlayableProps {
  config?: {
    modules?: any;
    playbackAdapters?: any[];
    hideMainUI?: boolean;
    hideOverlay?: boolean;
    disableControlWithKeyboard?: boolean;
    disableControlWithClickOnPlayer?: boolean;
    disableFullScreen?: boolean;
    nativeBrowserControls?: boolean;
  };

  width?: number;
  height?: number;
  fillAllSpace?: boolean;

  src?: MediaSource;

  autoplay?: boolean;
  preload?: string;

  title?: string;
  poster?: string;

  texts?: any;

  onInit?(player: any): void;
}

export class ReactPlayable extends React.PureComponent<
  ReactPlayableProps,
  IState
> {
  static propTypes: React.ValidationMap<ReactPlayableProps> = {
    width: number, // Width of player
    height: number, // Height of player
    fillAllSpace: bool, // Alow player to fill all available space

    src: oneOfType([
      string,
      exact({
        url: string,
        type: string,
      }),
      arrayOf(
        oneOfType([
          string,
          exact({
            url: string,
            type: string,
          }),
        ]),
      ),
    ]), // Same as in playable

    autoplay: bool,
    preload: string,

    title: string,
    poster: string,
    texts: object,

    config: shape({
      modules: object,
      playbackAdapters: array,
      hideMainUI: bool,
      hideOverlay: bool,
      disableControlWithKeyboard: bool,
      disableControlWithClickOnPlayer: bool,
      disableFullScreen: bool,
      nativeBrowserControls: bool,
    }),

    onInit: func,
  };

  private _player: any;
  private _$wrapper: HTMLElement;

  constructor(props: ReactPlayableProps) {
    super(props);

    this.state = {
      isMounted: false,
    };
  }

  componentDidMount() {
    const {
      width,
      height,
      fillAllSpace = false,

      src,
      autoplay = false,
      preload = 'auto',

      title,
      poster,

      texts,
      config: {
        modules = {},
        playbackAdapters = [],
        disableControlWithClickOnPlayer = false,
        disableControlWithKeyboard = false,
        disableFullScreen = false,
        nativeBrowserControls = false,
        hideMainUI = false,
        hideOverlay = false,
      } = {},
      onInit,
    } = this.props;

    this.registerModules(modules);
    this.registerPlaybackAdapters(playbackAdapters);

    this._player = create({
      autoplay,
      preload,
      width,
      height,
      fillAllSpace,
      src,
      title,
      poster,
      disableControlWithClickOnPlayer,
      disableControlWithKeyboard,
      disableFullScreen,
      texts,
      nativeBrowserControls,
      hideMainUI,
      hideOverlay,
    });

    this._player.attachToElement(this._$wrapper);

    onInit && onInit(this._player);

    this.setState({
      isMounted: true,
    });
  }

  componentDidUpdate(prevProps: ReactPlayableProps) {
    Object.keys(this.props).forEach((property: string) => {
      const method =
        PropertyToMethodMap[property] &&
        this._player[PropertyToMethodMap[property]];

      if (method) {
        const newValue: any = (this.props as any)[property];
        const oldValue: any = (prevProps as any)[property];
        if (newValue !== oldValue) {
          method(newValue);
        }
      }
    });
  }

  componentWillUnmount() {
    this._player.destroy();
    this._player = null;
  }

  registerModules(modules: any = {}) {
    Object.keys(modules).forEach(moduleName =>
      registerModule(moduleName, modules[moduleName]),
    );
  }

  registerPlaybackAdapters(adapters: any[] = []) {
    adapters.forEach(adapter => registerPlaybackAdapter(adapter));
  }

  setWrapperRef = (element: HTMLElement) => {
    this._$wrapper = element;
  };

  getExtendedChildren() {
    const { children } = this.props;

    return React.Children.map(children, child => {
      if (
        typeof child === 'boolean' ||
        typeof child === 'string' ||
        typeof child === 'number' ||
        ReactIs.isFragment(child) ||
        typeof (child as React.ReactElement<any>).type === 'string'
      ) {
        return child;
      }

      const constructor:
        | IExtendedComponent
        | IExtendedStatelessComponent = (child as React.ReactComponentElement<
        any
      >).type;

      if (constructor.dependencies) {
        const modules = constructor.dependencies.reduce(
          (resolvedModules: any, moduleName: string) => {
            //@ts-ignore
            resolvedModules[moduleName] = this._player._scope.resolve(
              moduleName,
            );

            return resolvedModules;
          },
          {},
        );
        return React.cloneElement(
          child as React.ReactComponentElement<any>,
          modules,
        );
      }

      return child;
    });
  }

  renderChildren() {
    return ReactDOM.createPortal(
      this.getExtendedChildren(),
      //@ts-ignore
      this._player._defaultModules.rootContainer.getElement(),
    );
  }

  render() {
    const styles = this.props.fillAllSpace
      ? { width: '100%', height: '100%' }
      : {};

    return (
      <section
        data-hook="react-playable"
        ref={this.setWrapperRef}
        style={styles}
      >
        {this.state.isMounted ? this.renderChildren() : null}
      </section>
    );
  }
}

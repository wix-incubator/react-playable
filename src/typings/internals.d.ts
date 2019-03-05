import { any } from 'prop-types';
import { create } from 'domain';

declare module '*.scss';
declare module '*.tsx';

declare module 'playable' {
  export function create(...args: any[]): any;
  export function registerModule(...args: any[]): any;
  export function registerPlaybackAdapter(...args: any[]): any;
}

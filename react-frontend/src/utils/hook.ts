/**
 * @fileoverview Defines lagacy React life-cycle method equivalents.
 * @copyright Shingo OKAWA 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from 'react';
import * as Animation from './animation';
import * as DOM from './dom';
import { dequal } from 'dequal';

// `useEffect` parameters.
type UseEffectParams = Parameters<typeof React.useEffect>;
// `useEffect` callback function.
type UseEffectCallback = UseEffectParams[0];
// `useEffect` dependencies list.
type UseEffectDeps = UseEffectParams[1];
// `useEffect` return..
type UseEffectReturn = ReturnType<typeof React.useEffect>

/**
 * Deeply compared version of `useMemo`.
 * @param {T} defaultValue the value to be memoized.
 * @returns a memoized version of the value as long as it remains deeply equal.
 */
export const useDeepComparedMemo = <T>(defaultValue?: T): T => {
  const ref = React.useRef<T>(defaultValue);
  const [sig, dispatch] = React.useState<{}>(Object.create(null));
  if (!dequal(defaultValue, ref.current)) {
    ref.current = defaultValue;
    dispatch(Object.create(null));
  }
  return React.useMemo<T>(() => ref.current, [sig]);
};

/**
 * Deeply compared version of `useEffect`.
 * @param {() => void} callback The callback function.
 * @param {any[]} dependencies The dependencies.
 */
export const useDeepComparedEffect = (
  callback: UseEffectCallback,
  deps: UseEffectDeps
): UseEffectReturn =>
  React.useEffect(callback, useDeepComparedMemo(deps));

/**
 * An equivalent for the legacy `componentDidMount` life-cycle method.
 * @param {() => void} callback The callback function.
 */
export const useDidMount = (callback: () => void): void => {
  React.useEffect(() => {
    callback();
  }, []);
};

/**
 * An equivalent for the legacy `componentDidUpdate` life-cycle method.
 * @param {() => void} callback The callback function.
 * @param {any[]} dependencies The dependencies.
 */
export const useDidUpdate = (callback: () => void, dependencies?: any[]): void => {
  const hasMounted = React.useRef(false)
  React.useEffect(() => {
    if (hasMounted.current) callback();
    else hasMounted.current = true;
  }, dependencies);
};

/**
 * An equivalent for the legacy `componentWillUnmount` life-cycle method.
 * @param {() => void} callback The callback function.
 */
export const useWillUnmount = (callback: () => void): void => {
  React.useEffect(() => {
    return () => {
      callback();
    };
  }, []);
};

/**
 * An equivalent for the legacy `forceUpdate` life-cycle method.
 */
export const useForceUpdate = (): () => void => {
  const [, dispatch] = React.useState<{}>(Object.create(null));
  const memoizedDispatch = React.useCallback(
    (): void => {
      dispatch(Object.create(null));
    },
    [dispatch],
  );
  return memoizedDispatch;
};

/**
 * Returns the previous value of a specified variable.
 * @param {T} defaultValue the value to be compared.
 * @returns a previously memoized version of the value..
 */
export const usePrevious= <T>(defaultValue?: T): T => {
  const ref = React.useRef<T>(null);
  React.useEffect(() => {
    ref.current = defaultValue;
  }, [defaultValue]);
  return ref.current;
};

/**
 * Returns the mount-safe value of a specified variable.
 * @param {T} defaultValue the value to be compared.
 * @returns a mount-safe version of the value.
 */
export const useMountedState = <T>(defaultValue?: T): [T, (next: T | (() => T)) => void] => {
  const hasUnmounted = React.useRef(false);
  const [value, dispatch] = React.useState<T>(defaultValue);
  const setValue = (next: T | (() => T)): void => {
    if (!hasUnmounted.current)
      dispatch(next);
  }
  React.useEffect(
    () => () => {
      hasUnmounted.current = true;
    },
    [],
  );
  return [value, setValue];
};

/**
 * Returns appropriate `useLayoutEffect` according to the environment.
 */
export const useLayoutEffect = 
  DOM.isDefined() ? React.useLayoutEffect : React.useEffect;

/**
 * Returns the mount-safe frame request/clear functions.
 * @returns a mount-safe frame request/clear functions.
 */
export const useFrame = (): [
  (callback: (info: { isCanceled: () => boolean }) => void) => void,
  () => void,
] => {
  const ref = React.useRef<number>(null);

  const cancel = (): void =>
    Animation.clear(ref.current);

  const next = (
    callback: (info: { isCanceled: () => boolean }) => void,
    delay = 2,
  ): void => {
    cancel();
    const id = Animation.request(() => {
      if (delay <= 1)
        callback({ isCanceled: () => id !== ref.current });
      else
        next(callback, delay - 1);
    });
    ref.current = id;
  }

  React.useEffect(
    () => () => {
      cancel();
    },
    [],
  );

  return [next, cancel];
};

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export const useAsyncEffect = (fn, input) => {
  const cleanupQueueRef = useRef([]);
  const [iterator, setIterator] = useState(null);
  const [generator, setGenerator] = useState(null);

  const cleanup = useCallback(() => {
    for (let callback of cleanupQueueRef.current) {
      callback();
    }
  }, [generator]);

  const onCleanup = useCallback((fn) => {
    cleanupQueueRef.current.push(fn);
  }, [true]);

  const next = useCallback((value) => {
    if (iterator && iterator.done) {
      return;
    }

    setIterator(generator.next(value));
  }, [iterator, generator]);

  const genThrow = useCallback((error) => {
    if (iterator && iterator.done) {
      return;
    }

    setIterator(generator.throw(error));
  }, [iterator]);

  useEffect(() => {
    cleanupQueueRef.current = [];
    setIterator(null);
    setGenerator(() => fn(onCleanup));
  }, input);

  useEffect(() => {
    if (!generator) return;

    next();

    return cleanup;
  }, [generator]);

  useEffect(() => {
    if (!iterator) return;

    let mounted = true;

    if (iterator.value instanceof Promise) {
      iterator.value.then((value) => {
        if (mounted) {
          next(value);
        }
      }).catch((error) => {
        if (mounted) {
          genThrow(error);
        }
      });

      return;
    }

    next(iterator.value);

    return () => {
      mounted = false;
    };
  }, [iterator]);
};

export const useDelayedEffect = (fn, ms, input) => {
  const timeoutRef = useRef(0);
  const clearedRef = useRef(false);

  const clearDelayedEffect = useCallback(() => {
    clearTimeout(timeoutRef.current);
  }, [true]);

  useEffect(() => {
    if (clearedRef.current) return;

    const timeoutCb = fn();

    if (typeof timeoutCb != 'function') return;

    timeoutRef.current = setTimeout(timeoutCb, ms);

    return clearDelayedEffect;
  }, input);

  return clearDelayedEffect;
};

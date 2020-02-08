import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export const useAsyncEffect = (fn, input) => {
  const cbQueueRef = useRef([]);
  const [iterator, setIterator] = useState(null);
  const [generator, setGenerator] = useState(null);

  const cleanup = useCallback(() => {
    for (let callback of cbQueueRef.current) {
      callback();
    }
  }, [generator]);

  const onCleanup = useCallback((fn) => {
    cbQueueRef.current.push(fn);
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
    cbQueueRef.current = [];
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

export const useDelayedEffect = (cb, ms, input) => {
  const timeoutRef = useRef(0);

  const clearDelayedEffect = useCallback(() => {
    clearTimeout(timeoutRef.current);
  }, [true]);

  useEffect(() => {
    const timeoutCb = cb();

    if (typeof timeoutCb != 'function') return;

    timeoutRef.current = setTimeout(timeoutCb, ms);

    return clearDelayedEffect;
  }, input);

  return clearDelayedEffect;
};

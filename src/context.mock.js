import React, { createContext, useContext, useMemo } from 'react';

const noop = function () {};
const noopGen = function* () {};

const BobcatContext = createContext();

export const BobcatProvider = ({ children }) => {
  const bobcat = useMemo(() => {
    const scope = noop;
    const flow = noop;
    const trap = noop;
    const useTrap = noop;
    const pass = noop;
    const fail = noop;
    const assert = noop;
    const before = noop;
    const beforeEach = noop;
    const after = noop;
    const afterEach = noop;
    const run = noopGen;

    return {
      scope,
      flow,
      trap,
      useTrap,
      pass,
      fail,
      assert,
      before,
      beforeEach,
      after,
      afterEach,
      run,
    };
  }, [true]);

  return (
    <BobcatContext.Provider value={bobcat}>
      {children}
    </BobcatContext.Provider>
  );
};

export const useBobcat = () => {
  return useContext(BobcatContext);
};
